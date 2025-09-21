import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Plus, X, Briefcase, LogOut, Loader2, Search, Bell, MessageSquare,
  LayoutGrid, Users, CheckSquare, Settings, ChevronDown, Clock, ShieldCheck,
  Edit3, Lock, Trash2
} from "lucide-react";
import axios from "axios";

// --- Modals (minimized for brevity) ---
const CreateWorkspaceModal = ({ closeModal, handleCreateWorkspace }) => { const [name, setName] = useState(""); const [description, setDescription] = useState(""); const handleSubmit = (e) => { e.preventDefault(); if (!name.trim()) return alert("Workspace name is required."); handleCreateWorkspace({ name, description }); }; return ( <div className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex justify-center items-center p-4 font-sans"><div className="bg-slate-800 rounded-2xl shadow-2xl shadow-black/50 p-8 w-full max-w-md relative animate-fade-in-up"><button onClick={closeModal} className="absolute top-4 right-4 text-slate-400 hover:text-white transition"><X size={24} /></button><h2 className="text-3xl font-bold text-center text-white mb-2">Create New Workspace</h2><form className="space-y-4" onSubmit={handleSubmit}><input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Workspace Name" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg" required /><textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg" /><button type="submit" className="w-full py-3 mt-4 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-500 transition">Create Workspace</button></form></div></div>);};
const CreateTeamModal = ({ closeModal, handleCreateTeam }) => { const [name, setName] = useState(""); const [description, setDescription] = useState(""); const handleSubmit = (e) => { e.preventDefault(); if (!name.trim()) return alert("Team name is required."); handleCreateTeam({ name, description }); }; return ( <div className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex justify-center items-center p-4 font-sans"><div className="bg-slate-800 rounded-2xl shadow-2xl shadow-black/50 p-8 w-full max-w-md relative animate-fade-in-up"><button onClick={closeModal} className="absolute top-4 right-4 text-slate-400 hover:text-white transition"><X size={24} /></button><h2 className="text-3xl font-bold text-center text-white mb-2">Create New Team</h2><form className="space-y-4" onSubmit={handleSubmit}><input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Team Name" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg" required /><textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description (optional)" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg" /><button type="submit" className="w-full py-3 mt-4 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-500 transition">Create Team</button></form></div></div>);};
const EditProfileModal = ({ closeModal, user, handleUpdateProfile }) => { const [formData, setFormData] = useState({ name: user.name, email: user.email, skills: user.skills || "", portfolio: user.portfolio || "", rate: user.rate || "" }); const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value }); const handleSubmit = (e) => { e.preventDefault(); handleUpdateProfile(formData); }; return ( <div className="fixed inset-0 bg-black bg-opacity-70 z-[70] flex justify-center items-center p-4 font-sans"><div className="bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-md relative"><button onClick={closeModal} className="absolute top-4 right-4 text-slate-400 hover:text-white transition"><X size={24}/></button><h2 className="text-2xl font-bold mb-4">Edit Profile</h2><form className="space-y-3" onSubmit={handleSubmit}>{["name","email","skills","portfolio","rate"].map((field) => ( <input key={field} type="text" name={field} value={formData[field]} onChange={handleChange} placeholder={field.charAt(0).toUpperCase() + field.slice(1)} className="w-full px-4 py-2 bg-slate-700 rounded-lg"/>))}<button type="submit" className="w-full py-2 bg-teal-600 rounded-lg hover:bg-teal-500">Update</button></form></div></div>);};
const ChangePasswordModal = ({ closeModal, handleChangePassword }) => { const [form, setForm] = useState({ currentPassword: "", newPassword: "" }); const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value }); const handleSubmit = (e) => { e.preventDefault(); handleChangePassword(form); }; return ( <div className="fixed inset-0 bg-black bg-opacity-70 z-[70] flex justify-center items-center p-4 font-sans"><div className="bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-md relative"><button onClick={closeModal} className="absolute top-4 right-4 text-slate-400 hover:text-white transition"><X size={24}/></button><h2 className="text-2xl font-bold mb-4">Change Password</h2><form className="space-y-3" onSubmit={handleSubmit}><input type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange} placeholder="Current Password" className="w-full px-4 py-2 bg-slate-700 rounded-lg"/><input type="password" name="newPassword" value={form.newPassword} onChange={handleChange} placeholder="New Password" className="w-full px-4 py-2 bg-slate-700 rounded-lg"/><button type="submit" className="w-full py-2 bg-teal-600 rounded-lg hover:bg-teal-500">Update Password</button></form></div></div>);};

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
    fetchData("users/me", setUser, "user");
    fetchData("workspaces", setWorkspaces, "workspaces");
    fetchData("teams", setTeams, "teams");
  }, [token, navigate]);

  useEffect(() => {
    const fetchAllTasks = async () => {
      if (workspaces.length > 0) {
        try {
          setLoading(prev => ({ ...prev, tasks: true }));
          const taskPromises = workspaces.map(ws =>
            axios.get(`${API_BASE_URL}/tasks/${ws._id}`, { headers: { Authorization: `Bearer ${token}` } })
          );
          const taskResults = await Promise.all(taskPromises);
          setTasks(taskResults.flatMap(r => r.data));
        } catch { } finally {
          setLoading(prev => ({ ...prev, tasks: false }));
        }
      } else {
        setLoading(prev => ({...prev, tasks: false}));
      }
    };
    fetchAllTasks();
  }, [workspaces, token]);

  const handleCreateWorkspace = async (newWorkspace) => { try { const res = await axios.post(`${API_BASE_URL}/workspaces`, newWorkspace, { headers: { Authorization: `Bearer ${token}` } }); setWorkspaces(prev => [...prev, res.data]); showAlert("Workspace created successfully!"); closeModal(); } catch { showAlert("Error creating workspace."); }};
  const handleCreateTeam = async (newTeam) => { try { const res = await axios.post(`${API_BASE_URL}/teams`, newTeam, { headers: { Authorization: `Bearer ${token}` } }); setTeams(prev => [...prev, res.data.team]); showAlert("Team created successfully!"); closeModal(); } catch { showAlert("Error creating team."); }};
  const handleUpdateProfile = async (formData) => { try { const res = await axios.put(`${API_BASE_URL}/users/me`, formData, { headers: { Authorization: `Bearer ${token}` } }); setUser(res.data); showAlert("Profile updated!"); closeModal(); } catch { showAlert("Error updating profile."); }};
  const handleChangePassword = async (form) => { try { await axios.put(`${API_BASE_URL}/users/me/password`, form, { headers: { Authorization: `Bearer ${token}` } }); showAlert("Password updated!"); closeModal(); } catch { showAlert("Error updating password."); }};
  const handleLogout = () => { localStorage.removeItem("token"); navigate("/"); };
  const showAlert = (message) => { setAlert(message); setTimeout(() => setAlert(null), 3000); };
  const openModal = (type) => setModal({ type, isOpen: true });
  const closeModal = () => setModal({ type: null, isOpen: false });

  const tasksSummary = useMemo(() => {
    return tasks.reduce((acc, task) => {
      const status = task.status || "To Do";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, { "To Do": 0, "In Progress": 0, "Completed": 0 });
  }, [tasks]);

  if (loading.user || !user) {
    return <div className="min-h-screen flex justify-center items-center bg-slate-900 text-white"><Loader2 size={40} className="animate-spin text-teal-500" /></div>;
  }

  return (
    <div className="font-sans min-h-screen bg-slate-900 text-white flex">
      {modal.isOpen && modal.type === "workspace" && <CreateWorkspaceModal closeModal={closeModal} handleCreateWorkspace={handleCreateWorkspace} />}
      {modal.isOpen && modal.type === "team" && <CreateTeamModal closeModal={closeModal} handleCreateTeam={handleCreateTeam} />}
      {modal.isOpen && modal.type === "editProfile" && <EditProfileModal closeModal={closeModal} user={user} handleUpdateProfile={handleUpdateProfile} />}
      {modal.isOpen && modal.type === "changePassword" && <ChangePasswordModal closeModal={closeModal} handleChangePassword={handleChangePassword} />}

      <aside className="w-64 bg-slate-800 p-6 hidden md:flex flex-col">
        <h1 className="text-2xl font-bold mb-10">SyncSpace</h1>
        <nav className="flex flex-col space-y-2">
          <Link to={`/Dashboard/${user._id}`} className="flex items-center gap-3 p-3 rounded-lg bg-teal-500/20 font-semibold"><LayoutGrid size={20}/> Dashboard</Link>
          <Link to={`/Tasks/${user._id}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 text-slate-300"><CheckSquare size={20}/> My Tasks</Link>
          <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 text-slate-300"><MessageSquare size={20}/> Messages</button>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-slate-800/50 shadow-md flex items-center justify-between px-8 py-4">
          <div className="relative w-full max-w-md">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search..." className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2" />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-slate-400 hover:text-white"><Bell size={22}/><span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full px-1.5">3</span></button>
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center font-bold">{user?.name?.charAt(0)}</div>
                <ChevronDown size={16} className={`${profileOpen ? "rotate-180" : ""}`} />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-700 rounded-lg shadow-lg py-2 z-20">
                  <button onClick={() => openModal("editProfile")} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-600"><Edit3 size={16}/> Edit Profile</button>
                  <button onClick={() => openModal("changePassword")} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-600"><Lock size={16}/> Change Password</button>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-600"><LogOut size={16}/> Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          {alert && <div className="bg-teal-600 text-white text-center py-2 mb-6 rounded-lg">{alert}</div>}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Workspaces */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Workspaces</h2>
                  <button onClick={() => openModal("workspace")} className="flex items-center gap-2 px-4 py-2 bg-teal-600 rounded-lg font-semibold hover:bg-teal-500"><Plus size={18}/> New</button>
                </div>
                {loading.workspaces ? <Loader2 className="animate-spin text-teal-500"/> :
                  workspaces.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {workspaces.map(ws => (
                        <div key={ws._id} className="bg-slate-800 p-5 rounded-xl shadow-lg hover:shadow-teal-500/20 cursor-pointer" onClick={() => navigate(`/Workspace/${ws._id}`)}>
                          <div className="flex items-center gap-4 mb-3"><Briefcase className="text-teal-500" size={24}/><h3 className="text-lg font-bold">{ws.name}</h3></div>
                          <p className="text-slate-400 text-sm">{ws.description || "No description."}</p>
                        </div>
                      ))}
                    </div>
                  ) : <div className="text-center py-6 bg-slate-800 rounded-lg">No workspaces yet</div>
                }
              </div>

              {/* Teams */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Teams</h2>
                  <button onClick={() => openModal("team")} className="flex items-center gap-2 px-4 py-2 bg-slate-700 rounded-lg font-semibold hover:bg-slate-600"><Plus size={18}/> New</button>
                </div>
                {loading.teams ? <Loader2 className="animate-spin text-teal-500"/> :
                  teams.length > 0 ? (
                    <div className="bg-slate-800 p-3 rounded-xl">
                      {teams.map(team => (
                        <div key={team._id} className="flex justify-between p-3 border-b border-slate-700 last:border-none">
                            <h3 className="font-bold">{team.name}</h3>
                            <span className="text-slate-400 text-sm">{team.members.length} members</span>
                        </div>
                      ))}
                    </div>
                  ) : <div className="text-center py-6 bg-slate-800 rounded-lg">No teams yet</div>
                }
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Profile */}
              <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-teal-500 flex items-center justify-center text-2xl font-bold">{user?.name?.charAt(0)}</div>
                  <div><h3 className="text-lg font-bold">{user?.name}</h3><p className="text-slate-400 text-sm">{user?.email}</p></div>
                </div>
                <div className="border-t border-slate-700 pt-4 flex items-center gap-3"><ShieldCheck className="text-teal-400"/> Role: <span className="font-bold">{user?.role}</span></div>
              </div>

              {/* Tasks Summary */}
              <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold mb-4">Task Summary</h2>
                <div className="space-y-3">
                  {Object.entries(tasksSummary).map(([status, count]) => (
                    <div key={status} className="flex justify-between"><span>{status}</span><span className="font-bold">{count}</span></div>
                  ))}
                </div>
              </div>

              {/* Activity */}
              <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-slate-400"><Clock size={16} className="text-teal-500"/> Task "Landing Page" marked Completed</li>
                  <li className="flex items-center gap-3 text-sm text-slate-400"><Plus size={16} className="text-teal-500"/> Workspace "Marketing" created</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;

