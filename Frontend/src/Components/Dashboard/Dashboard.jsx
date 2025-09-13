import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Plus, X, Briefcase, LogOut, Loader2, Search, Bell, MessageSquare, 
    LayoutGrid, Users, CheckSquare, Settings, ChevronDown, Clock, BarChart2, FileText
} from 'lucide-react';
import axios from 'axios';

// --- Reusable Modals (same as before) ---
const CreateWorkspaceModal = ({ closeModal, handleCreateWorkspace }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert('Workspace name is required.');
    handleCreateWorkspace({ name, description });
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex justify-center items-center p-4 font-sans">
      <div className="bg-slate-800 rounded-2xl shadow-2xl shadow-black/50 p-8 w-full max-w-md relative animate-fade-in-up">
        <button onClick={closeModal} className="absolute top-4 right-4 text-slate-400 hover:text-white transition"><X size={24} /></button>
        <h2 className="text-3xl font-bold text-center text-white mb-2">Create New Workspace</h2>
        <p className="text-center text-slate-400 mb-8">Start a new project by giving it a name.</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Workspace Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Description (Optional)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition" rows="3" />
          </div>
          <button type="submit" className="w-full py-3 mt-4 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-500 transition shadow-md">Create Workspace</button>
        </form>
      </div>
    </div>
  );
};

const CreateTeamModal = ({ closeModal, handleCreateTeam }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert('Team name is required.');
    handleCreateTeam({ name, description });
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex justify-center items-center p-4 font-sans">
      <div className="bg-slate-800 rounded-2xl shadow-2xl shadow-black/50 p-8 w-full max-w-md relative animate-fade-in-up">
        <button onClick={closeModal} className="absolute top-4 right-4 text-slate-400 hover:text-white transition"><X size={24} /></button>
        <h2 className="text-3xl font-bold text-center text-white mb-2">Create New Team</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Team Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Description (Optional)</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition" rows="3" />
          </div>
          <button type="submit" className="w-full py-3 mt-4 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-500 transition shadow-md">Create Team</button>
        </form>
      </div>
    </div>
  );
};

// --- Dashboard Page Component ---
const DashboardPage = () => {
  const navigate = useNavigate();
  const [modal, setModal] = useState({ type: null, isOpen: false });
  const [workspaces, setWorkspaces] = useState([]);
  const [teams, setTeams] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState({ workspaces: true, user: true, teams: true, tasks: true });
  const [alert, setAlert] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const token = localStorage.getItem("token");
  const API_BASE_URL = "http://localhost:9000/api";

  useEffect(() => {
    if (!token) { navigate("/"); return; }
    const fetchData = async (endpoint, setter, loadingKey) => {
      try {
        setLoading(prev => ({ ...prev, [loadingKey]: true }));
        const res = await axios.get(`${API_BASE_URL}/${endpoint}`, { headers: { Authorization: `Bearer ${token}` } });
        setter(res.data);
      } catch (error) {
        if (error.response?.status === 401) handleLogout();
        setAlert(`Failed to load ${loadingKey}.`);
      } finally {
        setLoading(prev => ({ ...prev, [loadingKey]: false }));
      }
    };
    fetchData('users/me', setUser, 'user');
    fetchData('workspaces', setWorkspaces, 'workspaces');
    fetchData('teams', setTeams, 'teams');
  }, [token, navigate]);

  useEffect(() => {
    if (workspaces.length > 0) {
      const fetchTasksForSummary = async () => {
        try {
          setLoading(prev => ({ ...prev, tasks: true }));
          const res = await axios.get(`${API_BASE_URL}/tasks/${workspaces[0]._id}`, { headers: { Authorization: `Bearer ${token}` } });
          setTasks(res.data);
        } finally {
          setLoading(prev => ({ ...prev, tasks: false }));
        }
      };
      fetchTasksForSummary();
    }
  }, [workspaces, token]);

  const handleCreateWorkspace = async (newWorkspace) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/workspaces`, newWorkspace, { headers: { Authorization: `Bearer ${token}` } });
      setWorkspaces(prev => [...prev, res.data]);
      showAlert("Workspace created successfully!");
      closeModal();
    } catch {
      showAlert("Error creating workspace.");
    }
  };
  const handleCreateTeam = async (newTeam) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/teams`, newTeam, { headers: { Authorization: `Bearer ${token}` } });
      setTeams(prev => [...prev, res.data.team]);
      showAlert("Team created successfully!");
      closeModal();
    } catch {
      showAlert("Error creating team.");
    }
  };

  const openModal = (type) => setModal({ type, isOpen: true });
  const closeModal = () => setModal({ type: null, isOpen: false });
  const handleLogout = () => { localStorage.removeItem("token"); navigate('/'); };
  const showAlert = (message) => { setAlert(message); setTimeout(() => setAlert(null), 3000); };

  const tasksSummary = useMemo(() => {
    return tasks.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
    }, { 'To Do': 0, 'In Progress': 0, 'Completed': 0 });
  }, [tasks]);

  const recentActivity = [
    { id: 1, text: "You were added to Project Phoenix by Jane Doe.", time: "2h ago" },
    { id: 2, text: "Task 'Setup Backend' marked complete by John.", time: "5h ago" },
  ];

  if (loading.user) {
    return <div className="min-h-screen flex justify-center items-center bg-slate-900 text-white"><Loader2 size={40} className="animate-spin text-teal-500" /></div>;
  }

  return (
    <div className="font-sans min-h-screen bg-slate-900 text-white flex">
      {modal.isOpen && modal.type === 'workspace' && <CreateWorkspaceModal closeModal={closeModal} handleCreateWorkspace={handleCreateWorkspace} />}
      {modal.isOpen && modal.type === 'team' && <CreateTeamModal closeModal={closeModal} handleCreateTeam={handleCreateTeam} />}

      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 p-6 flex-col z-10 hidden md:flex">
        <h1 className="text-2xl font-bold mb-10">SyncSpace</h1>
        <nav className="flex flex-col space-y-2">
          <button className="flex items-center gap-3 p-3 rounded-lg bg-teal-500/20"><LayoutGrid size={20}/> Workspaces</button>
          <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700"><Users size={20}/> Teams</button>
          <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700"><CheckSquare size={20}/> Tasks</button>
          <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700"><MessageSquare size={20}/> Messages</button>
          <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700"><Bell size={20}/> Notifications</button>
        </nav>
        <div className="mt-auto bg-slate-700 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center font-bold">{user?.name?.charAt(0)}</div>
            <div>
              <h4 className="font-semibold">{user?.name}</h4>
              <p className="text-xs text-slate-400">{user?.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-slate-800/50 backdrop-blur-sm shadow-md flex items-center justify-between px-8 py-4">
          <div className="relative w-full max-w-md">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search..." className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 focus:ring-teal-500 focus:border-teal-500" />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-slate-400 hover:text-white">
              <Bell size={22}/>
              <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full px-1">3</span>
            </button>
            <button className="relative text-slate-400 hover:text-white">
              <MessageSquare size={22}/>
              <span className="absolute -top-1 -right-1 bg-teal-500 text-xs rounded-full px-1">5</span>
            </button>
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center font-bold">{user?.name?.charAt(0)}</div>
                <ChevronDown size={16} className={`transition-transform ${profileOpen ? 'rotate-180' : ''}`}/>
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-700 rounded-lg shadow-lg py-2">
                  <button className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-600"><Settings size={16}/> Settings</button>
                  <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-600"><LogOut size={16}/> Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {alert && <div className="bg-teal-600 text-white text-center py-2 mb-6 rounded-lg">{alert}</div>}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Workspaces + Teams */}
            <div className="lg:col-span-2 space-y-8">
              {/* Workspaces */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Workspaces</h2>
                  <button onClick={() => openModal('workspace')} className="flex items-center gap-2 px-4 py-2 bg-teal-600 rounded-lg"><Plus size={18}/> New</button>
                </div>
                {loading.workspaces ? <Loader2 className="animate-spin text-teal-500 mx-auto"/> :
                  workspaces.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {workspaces.map(ws => (
                        <div key={ws._id} className="bg-slate-800 p-5 rounded-xl shadow hover:shadow-teal-500/20 cursor-pointer" onClick={() => navigate(`/workspace/${ws._id}`)}>
                          <div className="flex items-center gap-4 mb-3">
                            <Briefcase className="text-teal-500"/>
                            <h3 className="font-bold truncate">{ws.name}</h3>
                          </div>
                          <p className="text-slate-400 text-sm">{ws.description || 'No description'}</p>
                        </div>
                      ))}
                    </div>
                  ) : <div className="text-center py-10 bg-slate-800 rounded-xl">No workspaces yet</div>}
              </div>

              {/* Teams */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Teams</h2>
                  <button onClick={() => openModal('team')} className="flex items-center gap-2 px-3 py-1 bg-slate-700 rounded-lg"><Plus size={16}/> Team</button>
                </div>
                {loading.teams ? <Loader2 className="animate-spin text-teal-500 mx-auto"/> :
                  teams.length > 0 ? (
                    <div className="bg-slate-800 p-5 rounded-xl">
                      {teams.map(team => (
                        <div key={team._id} className="flex justify-between py-3 border-b border-slate-700 last:border-0">
                          <span className="font-semibold">{team.name}</span>
                          <span className="text-sm text-slate-400">{team.members.length} members</span>
                        </div>
                      ))}
                    </div>
                  ) : <div className="text-center py-10 bg-slate-800 rounded-xl">No teams yet</div>}
              </div>
            </div>

            {/* Sidebar widgets */}
            <div className="space-y-8">
              {/* Task Summary */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Task Summary</h2>
                {loading.tasks ? <Loader2 className="animate-spin text-teal-500 mx-auto"/> :
                  <div className="bg-slate-800 p-5 rounded-xl space-y-4">
                    <div className="flex justify-between p-3 bg-slate-700 rounded"><span className="text-yellow-400">To Do</span><span>{tasksSummary['To Do']}</span></div>
                    <div className="flex justify-between p-3 bg-slate-700 rounded"><span className="text-blue-400">In Progress</span><span>{tasksSummary['In Progress']}</span></div>
                    <div className="flex justify-between p-3 bg-slate-700 rounded"><span className="text-green-400">Completed</span><span>{tasksSummary['Completed']}</span></div>
                  </div>}
              </div>

              {/* Analytics */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Analytics</h2>
                <div className="bg-slate-800 p-5 rounded-xl flex flex-col gap-4">
                  <div className="flex items-center gap-3"><BarChart2 className="text-teal-400"/> <span>Total Tasks: {tasks.length}</span></div>
                  <div className="flex items-center gap-3"><Users className="text-blue-400"/> <span>Total Teams: {teams.length}</span></div>
                  <div className="flex items-center gap-3"><Briefcase className="text-yellow-400"/> <span>Total Workspaces: {workspaces.length}</span></div>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
                <div className="bg-slate-800 p-5 rounded-xl space-y-4">
                  {recentActivity.map(a => (
                    <div key={a.id} className="flex gap-3">
                      <Clock size={18} className="text-slate-500 mt-1"/>
                      <div>
                        <p className="text-sm">{a.text}</p>
                        <p className="text-xs text-slate-500">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Floating Quick Action */}
        <button onClick={() => openModal('workspace')} className="fixed bottom-8 right-8 bg-teal-600 hover:bg-teal-500 text-white p-4 rounded-full shadow-lg">
          <Plus size={24}/>
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
