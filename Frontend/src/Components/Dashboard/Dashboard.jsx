import React, { useState, useEffect, useMemo, Fragment } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Plus, X, Briefcase, LogOut, Loader2, Search, Bell,
  LayoutGrid, Users, CheckSquare, Settings, ChevronDown, Clock, ShieldCheck,
  Edit3, Lock, Trash2, Shield, FolderKanban, MessageCircle, MoreVertical
} from "lucide-react";
import axios from "axios";
import { io } from "socket.io-client";
import { Transition, Menu } from '@headlessui/react'
import {BACKEND_URL} from '../../../utilities/constants.js'
import { SOCKET_URL } from "../../../utilities/constants.js";


const Modal = ({ children, close, size = 'md' }) => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] flex justify-center items-center p-4 font-sans animate-fade-in">
        <div className={`bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl shadow-black/50 p-8 w-full max-w-${size} relative animate-slide-up`}>
            <button onClick={close} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-transform hover:rotate-90 duration-300">
                <X size={24} />
            </button>
            {children}
        </div>
    </div>
);

const FormInput = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <input {...props} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition" />
    </div>
);

const FormTextarea = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <textarea {...props} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition resize-none" rows="3"></textarea>
    </div>
);

const PrimaryButton = ({ children, isLoading, ...props }) => (
    <button {...props} disabled={isLoading} className="w-full flex justify-center items-center py-3 mt-4 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-500 disabled:bg-teal-800 disabled:cursor-not-allowed transition-all shadow-lg shadow-teal-900/50">
        {isLoading ? <Loader2 className="animate-spin" /> : children}
    </button>
);

// Modal Implementations
const CreateWorkspaceModal = ({ closeModal, handleCreateWorkspace, isLoading }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const handleSubmit = (e) => { e.preventDefault(); handleCreateWorkspace({ name, description }); };
    
    return (
        <Modal close={closeModal}>
            <h2 className="text-3xl font-bold text-center text-white mb-2">Create New Workspace</h2>
            <p className="text-center text-slate-400 mb-6">Organize your projects and tasks.</p>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <FormInput label="Workspace Name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Q4 Marketing Campaign" required />
                <FormTextarea label="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A brief description of this workspace." />
                <PrimaryButton type="submit" isLoading={isLoading}>Create Workspace</PrimaryButton>
            </form>
        </Modal>
    );
};

const CreateTeamModal = ({ closeModal, handleCreateTeam, isLoading }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const handleSubmit = (e) => { e.preventDefault(); handleCreateTeam({ name, description }); };

    return (
        <Modal close={closeModal}>
            <h2 className="text-3xl font-bold text-center text-white mb-2">Create New Team</h2>
            <p className="text-center text-slate-400 mb-6">Bring your team members together.</p>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <FormInput label="Team Name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Design Crew" required />
                <FormTextarea label="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} placeholder="What this team is about." />
                <PrimaryButton type="submit" isLoading={isLoading}>Create Team</PrimaryButton>
            </form>
        </Modal>
    );
};

const EditProfileModal = ({ closeModal, user, handleUpdateProfile, isLoading }) => {
    const [formData, setFormData] = useState({ name: user.name, email: user.email, skills: user.skills || "", portfolio: user.portfolio || "", rate: user.rate || "" });
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e) => { e.preventDefault(); handleUpdateProfile(formData); };
    
    return (
        <Modal close={closeModal}>
            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
            <form className="space-y-3" onSubmit={handleSubmit}>
                <FormInput label="Full Name" type="text" name="name" value={formData.name} onChange={handleChange} />
                <FormInput label="Email" type="email" name="email" value={formData.email} onChange={handleChange} />
                <FormInput label="Skills" type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g. React, Node.js, Figma" />
                <FormInput label="Portfolio URL" type="text" name="portfolio" value={formData.portfolio} onChange={handleChange} placeholder="https://yourportfolio.com" />
                <FormInput label="Hourly Rate ($)" type="text" name="rate" value={formData.rate} onChange={handleChange} placeholder="e.g. 50" />
                <PrimaryButton type="submit" isLoading={isLoading}>Update Profile</PrimaryButton>
            </form>
        </Modal>
    );
};

const ChangePasswordModal = ({ closeModal, handleChangePassword, isLoading }) => {
    const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = (e) => { e.preventDefault(); handleChangePassword(form); };
    
    return (
        <Modal close={closeModal}>
            <h2 className="text-2xl font-bold mb-4">Change Password</h2>
            <form className="space-y-3" onSubmit={handleSubmit}>
                <FormInput label="Current Password" type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange} placeholder="••••••••" />
                <FormInput label="New Password" type="password" name="newPassword" value={form.newPassword} onChange={handleChange} placeholder="••••••••" />
                <PrimaryButton type="submit" isLoading={isLoading}>Update Password</PrimaryButton>
            </form>
        </Modal>
    );
};

// UI Components
const NotificationsPanel = ({ notifications, onMarkAsRead, isOpen }) => {
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <Transition
            show={isOpen}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
        >
            <div className="absolute right-0 mt-2 w-80 bg-slate-700/80 backdrop-blur-md border border-slate-600 rounded-lg shadow-lg py-1 z-30">
                <div className="px-4 py-2 font-bold text-white">Notifications</div>
                <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? notifications.map(notif => (
                        <div
                            key={notif._id}
                            className={`px-4 py-3 border-t border-slate-600 hover:bg-slate-600/50 cursor-pointer ${!notif.read ? 'bg-teal-500/10' : ''}`}
                            onClick={() => onMarkAsRead(notif._id)}
                        >
                            <p className="text-sm text-slate-200">{notif.message}</p>
                            <p className="text-xs text-slate-400 mt-1">{new Date(notif.createdAt).toLocaleString()}</p>
                        </div>
                    )) : <p className="text-sm text-slate-400 text-center py-8">You're all caught up!</p>}
                </div>
            </div>
        </Transition>
    );
};

const ProfileDropdown = ({ user, onEditProfile, onChangePassword, onLogout, isOpen }) => (
    <Transition
        show={isOpen}
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
    >
        <div className="absolute right-0 mt-2 w-56 bg-slate-700/80 backdrop-blur-md border border-slate-600 rounded-lg shadow-lg py-2 z-20">
            <div className="px-4 py-2 border-b border-slate-600">
                <p className="text-sm font-semibold text-white">{user.name}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
            <div className="py-1">
                <button onClick={onEditProfile} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-600/50 transition-colors"><Edit3 size={16} /> Edit Profile</button>
                <button onClick={onChangePassword} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-600/50 transition-colors"><Lock size={16} /> Change Password</button>
                <button onClick={onLogout} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-slate-600/50 transition-colors"><LogOut size={16} /> Logout</button>
            </div>
        </div>
    </Transition>
);

const Sidebar = ({ user }) => (
    <aside className="w-64 bg-slate-800 p-6 hidden md:flex flex-col border-r border-slate-700">
        <h1 className="text-2xl font-bold mb-10 text-white">SyncSpace</h1>
        <nav className="flex flex-col space-y-2 flex-grow">
            <Link to={`/Dashboard/${user._id}`} className="flex items-center gap-3 p-3 rounded-lg bg-teal-500/20 text-white font-semibold"><LayoutGrid size={20} /> Dashboard</Link>
            <Link to={`/Tasks/${user._id}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/50 text-slate-300 transition-colors"><CheckSquare size={20} /> My Tasks</Link>
            <Link to={`/Team/${user._id}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/50 text-slate-300 transition-colors"><Users size={20} /> Teams</Link>
            {user.role === 'Admin' && (
                <Link to={`/Admin/${user._id}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/50 text-slate-300 transition-colors"><Shield size={20} /> Admin Panel</Link>
            )}
        </nav>
        <div className="mt-auto">
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/50 text-slate-300 transition-colors">
                <Settings size={20} /> Settings
            </button>
        </div>
    </aside>
);

const Header = ({ user, unreadCount, onProfileToggle, onNotificationToggle }) => (
    <header className="bg-slate-800/50 backdrop-blur-md border-b border-slate-700 flex items-center justify-between px-8 py-4 sticky top-0 z-10">
        <div className="relative w-full max-w-md">
            <Search size={20} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search workspaces, tasks..." className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 transition" />
        </div>
        <div className="flex items-center gap-6">
            <button onClick={onNotificationToggle} className="relative text-slate-400 hover:text-white transition-colors">
                <Bell size={22} />
                {unreadCount > 0 && <span className="absolute -top-1 -right-1.5 flex h-5 w-5 items-center justify-center bg-red-500 text-xs rounded-full">{unreadCount}</span>}
            </button>
            <button onClick={onProfileToggle} className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center font-bold">{user?.name?.charAt(0)}</div>
                <ChevronDown size={16} className="text-slate-400" />
            </button>
        </div>
    </header>
);


// Main Page
const DashboardPage = () => {
    const navigate = useNavigate();
    const [modal, setModal] = useState({ type: null, isOpen: false, isLoading: false });
    const [workspaces, setWorkspaces] = useState([]);
    const [teams, setTeams] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState({ page: true, workspaces: true, user: true, teams: true, tasks: true, notifications: true });
    const [alert, setAlert] = useState(null);
    const [profileOpen, setProfileOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    const token = localStorage.getItem("token");
    const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

    useEffect(() => {
        if (!token) { navigate("/"); return; }
        const fetchData = async (endpoint, setter, loadingKey) => {
            try {
                setLoading(prev => ({ ...prev, [loadingKey]: true }));
                const res = await axios.get(`${BACKEND_URL}/${endpoint}`, { headers: { Authorization: `Bearer ${token}` } });
                setter(res.data);
            } catch (error) {
                if (error.response?.status === 401) handleLogout();
                showAlert(`Failed to load ${loadingKey}.`, 'error');
            } finally {
                setLoading(prev => ({ ...prev, [loadingKey]: false }));
            }
        };
        const fetchInitialData = async () => {
            await Promise.all([
                fetchData("users/me", setUser, "user"),
                fetchData("workspaces", setWorkspaces, "workspaces"),
                fetchData("teams", setTeams, "teams"),
                fetchData("notifications", setNotifications, "notifications")
            ]);
            setLoading(prev => ({...prev, page: false}));
        }
        fetchInitialData();
    }, [token, navigate]);

    useEffect(() => {
        if (!token) return;
        const socket = io(`${SOCKET_URL}`, { auth: { token } });
        socket.on('new-notification', (notification) => setNotifications(prev => [notification, ...prev]));
        return () => socket.disconnect();
    }, [token]);

    useEffect(() => {
        const fetchAllTasks = async () => {
            if (workspaces.length > 0) {
                try {
                    setLoading(prev => ({ ...prev, tasks: true }));
                    const taskPromises = workspaces.map(ws =>
                        axios.get(`${BACKEND_URL}/tasks/${ws._id}`, { headers: { Authorization: `Bearer ${token}` } })
                    );
                    const taskResults = await Promise.all(taskPromises);
                    setTasks(taskResults.flatMap(r => r.data));
                } catch(err) {
                     console.error("Failed to fetch tasks", err);
                } finally {
                    setLoading(prev => ({ ...prev, tasks: false }));
                }
            } else if (!loading.workspaces) {
                setLoading(prev => ({ ...prev, tasks: false }));
            }
        };
        fetchAllTasks();
    }, [workspaces, token, loading.workspaces]);

    const createApiHandler = (endpoint, successMessage, errorMessage, setData) => async (data) => {
        setModal(prev => ({ ...prev, isLoading: true }));
        try {
            const res = await axios.post(`${BACKEND_URL}/${endpoint}`, data, { headers: { Authorization: `Bearer ${token}` } });
            setData(prev => [...prev, res.data.team || res.data]);
            showAlert(successMessage, 'success');
            closeModal();
        } catch {
            showAlert(errorMessage, 'error');
        } finally {
            setModal(prev => ({ ...prev, isLoading: false }));
        }
    };
    
    const updateApiHandler = (endpoint, successMessage, errorMessage, setData) => async (data) => {
        setModal(prev => ({ ...prev, isLoading: true }));
        try {
            const res = await axios.put(`${BACKEND_URL}/${endpoint}`, data, { headers: { Authorization: `Bearer ${token}` } });
            if (setData) setData(res.data);
            showAlert(successMessage, 'success');
            closeModal();
        } catch {
            showAlert(errorMessage, 'error');
        } finally {
            setModal(prev => ({ ...prev, isLoading: false }));
        }
    };

    const handleCreateWorkspace = createApiHandler('workspaces', 'Workspace created!', 'Error creating workspace.', setWorkspaces);
    const handleCreateTeam = createApiHandler('teams', 'Team created!', 'Error creating team.', setTeams);
    const handleUpdateProfile = updateApiHandler('users/me', 'Profile updated!', 'Error updating profile.', setUser);
    const handleChangePassword = updateApiHandler('users/me/password', 'Password updated!', 'Error updating password.');

    const handleMarkAsRead = async (id) => {
        try {
            await axios.put(`${BACKEND_URL}/notifications/${id}/read`, {}, { headers: { Authorization: `Bearer ${token}` } });
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
        } catch (err) {
            console.error("Failed to mark notification as read");
        }
    };
    
    const handleLogout = () => { localStorage.removeItem("token"); navigate("/"); };
    const showAlert = (message, type = 'info') => { setAlert({message, type}); setTimeout(() => setAlert(null), 3000); };
    const openModal = (type) => { setProfileOpen(false); setNotificationsOpen(false); setModal({ type, isOpen: true, isLoading: false }); };
    const closeModal = () => setModal({ type: null, isOpen: false, isLoading: false });

    const tasksSummary = useMemo(() => {
        return tasks.reduce((acc, task) => {
            const status = task.status || "To Do";
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, { "To Do": 0, "In Progress": 0, "Completed": 0 });
    }, [tasks]);

    if (loading.page || !user) {
        return <div className="min-h-screen w-full flex justify-center items-center bg-slate-900"><Loader2 size={40} className="animate-spin text-teal-500" /></div>;
    }

    return (
        <div className="font-sans min-h-screen bg-slate-900 text-white flex">
            {modal.isOpen && modal.type === "workspace" && <CreateWorkspaceModal closeModal={closeModal} handleCreateWorkspace={handleCreateWorkspace} isLoading={modal.isLoading} />}
            {modal.isOpen && modal.type === "team" && <CreateTeamModal closeModal={closeModal} handleCreateTeam={handleCreateTeam} isLoading={modal.isLoading} />}
            {modal.isOpen && modal.type === "editProfile" && <EditProfileModal closeModal={closeModal} user={user} handleUpdateProfile={handleUpdateProfile} isLoading={modal.isLoading} />}
            {modal.isOpen && modal.type === "changePassword" && <ChangePasswordModal closeModal={closeModal} handleChangePassword={handleChangePassword} isLoading={modal.isLoading} />}
            
            <Sidebar user={user} />

            <div className="flex-1 flex flex-col">
                <Header 
                    user={user} 
                    unreadCount={unreadCount} 
                    onProfileToggle={() => { setProfileOpen(p => !p); setNotificationsOpen(false); }}
                    onNotificationToggle={() => { setNotificationsOpen(n => !n); setProfileOpen(false); }}
                />
                <div className="relative">
                    <ProfileDropdown user={user} onEditProfile={() => openModal("editProfile")} onChangePassword={() => openModal("changePassword")} onLogout={handleLogout} isOpen={profileOpen}/>
                    <NotificationsPanel notifications={notifications} onMarkAsRead={handleMarkAsRead} isOpen={notificationsOpen} />
                </div>

                <main className="flex-1 p-8 overflow-y-auto">
                    {alert && <div className={`fixed top-24 right-8 bg-slate-700 border border-slate-600 text-white text-sm py-2 px-4 rounded-lg shadow-lg animate-fade-in-down ${alert.type === 'error' ? 'border-red-500/50' : 'border-green-500/50'}`}>{alert.message}</div>}
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user.name.split(' ')[0]}!</h1>
                    <p className="text-slate-400 mb-8">Here's a snapshot of your collaborative space.</p>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-bold flex items-center gap-2"><Briefcase className="text-teal-400"/> Workspaces</h2>
                                    {user.role === 'Admin' && <button onClick={() => openModal("workspace")} className="flex items-center gap-2 px-4 py-2 bg-teal-600 rounded-lg font-semibold hover:bg-teal-500 transition-transform hover:scale-105"><Plus size={18} /> New Workspace</button>}
                                </div>
                                {loading.workspaces ? <Loader2 className="animate-spin text-teal-500" /> :
                                    workspaces.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {workspaces.map(ws => (
                                                <div key={ws._id} className="bg-slate-800 p-5 rounded-xl shadow-lg hover:shadow-teal-500/20 hover:-translate-y-1 transition-all cursor-pointer border border-slate-700 hover:border-teal-500/50" onClick={() => navigate(`/Workspace/${ws._id}`)}>
                                                    <h3 className="text-lg font-bold text-white mb-2">{ws.name}</h3>
                                                    <p className="text-slate-400 text-sm h-10">{ws.description || "No description provided."}</p>
                                                </div>
                                            ))}
                                        </div>
                                  ) : user.role === 'Admin'? (<div className="text-center py-10 bg-slate-800 rounded-lg border border-slate-700">No workspaces yet. Create one to get started!</div>):
                                  (<div className="text-center py-10 bg-slate-800 rounded-lg border border-slate-700">Your are added to any workspace. Contact the relevant Admin for further information.</div>)
                                }
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-bold flex items-center gap-2"><Users className="text-teal-400"/> Teams</h2>
                                    {user.role === 'Admin' && <button onClick={() => openModal("team")} className="flex items-center gap-2 px-4 py-2 bg-slate-700 rounded-lg font-semibold hover:bg-slate-600 transition-transform hover:scale-105"><Plus size={18} /> New Team</button>}
                                </div>
                                {loading.teams ? <Loader2 className="animate-spin text-teal-500" /> :
                                    teams.length > 0 ? (
                                        <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                                            {teams.map(team => (
                                                <div key={team._id} className="flex justify-between items-center p-3 border-b border-slate-700 last:border-none">
                                                    <h3 className="font-bold text-white">{team.name}</h3>
                                                    <span className="text-slate-400 text-sm">{team.members.length} members</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : <div className="text-center py-10 bg-slate-800 rounded-lg border border-slate-700">You are not part of any team yet.</div>
                                }
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FolderKanban className="text-teal-400"/> Task Summary</h2>
                                {loading.tasks ? <Loader2 className="animate-spin text-teal-500"/> :
                                <div className="space-y-3">
                                    {Object.entries(tasksSummary).map(([status, count]) => (
                                        <div key={status} className="flex justify-between items-center text-slate-300">
                                            <span>{status}</span>
                                            <span className="font-bold bg-slate-700 px-2 py-0.5 rounded text-white">{count}</span>
                                        </div>
                                    ))}
                                </div>
                                }
                            </div>
                            
                            <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><MessageCircle className="text-teal-400"/> Recent Activity</h2>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-sm text-slate-400"><Clock size={16} className="text-teal-500 flex-shrink-0" /> Task "Landing Page" marked Completed</li>
                                    <li className="flex items-center gap-3 text-sm text-slate-400"><Plus size={16} className="text-teal-500 flex-shrink-0" /> Workspace "Marketing" created</li>
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
