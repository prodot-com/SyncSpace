import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Users, Briefcase, CheckSquare, Shield, Trash2, Edit3, X, LifeBuoy, Bell, LogOut, Settings, Lock } from 'lucide-react';
import axios from 'axios';
import { io } from "socket.io-client";

// --- Reusable Modal Components ---
const ModalShell = ({ children, close }) => ( <div className="fixed inset-0 bg-black bg-opacity-70 z-[70] flex justify-center items-center p-4"><div className="bg-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-md relative animate-fade-in-up"><button onClick={close} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={20} /></button>{children}</div></div>);
const ConfirmModal = ({ close, onConfirm, title, message }) => ( <ModalShell close={close}><h2 className="text-2xl font-bold mb-3">{title}</h2><p className="text-slate-300 mb-6">{message}</p><div className="flex gap-3 justify-end"><button type="button" onClick={close} className="px-5 py-2 rounded font-semibold bg-slate-600 hover:bg-slate-500 transition">Cancel</button><button onClick={onConfirm} className="px-5 py-2 rounded font-semibold bg-red-600 hover:bg-red-500 transition text-white">Confirm</button></div></ModalShell>);
const EditWorkspaceModal = ({ closeModal, workspace, handleUpdate }) => { const [name, setName] = useState(workspace.name); const [description, setDescription] = useState(workspace.description || ""); const handleSubmit = (e) => { e.preventDefault(); handleUpdate(workspace._id, { name, description }); }; return ( <ModalShell close={closeModal}><h2 className="text-2xl font-bold mb-4">Edit Workspace</h2><form className="space-y-3" onSubmit={handleSubmit}><input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Workspace Name" className="w-full px-4 py-2 bg-slate-700 rounded-lg" required /><textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full px-4 py-2 bg-slate-700 rounded-lg" rows={3} /><div className="flex justify-end gap-2 pt-2"><button type="button" onClick={closeModal} className="px-4 py-2 bg-slate-600 rounded-lg">Cancel</button><button type="submit" className="px-4 py-2 bg-teal-600 rounded-lg">Save</button></div></form></ModalShell>);};
const EditTaskModal = ({ closeModal, task, handleUpdate }) => {
    const [title, setTitle] = useState(task.title);
    const [status, setStatus] = useState(task.status || "Pending");
    const [assignedTo, setAssignedTo] = useState(task.assignedTo?._id || "");

    const handleSubmit = (e) => {
        e.preventDefault();
        handleUpdate(task._id, { title, status, assignedTo });
    };

    return (
        <ModalShell close={closeModal}>
            <h2 className="text-2xl font-bold mb-4">Edit Task</h2>
            <form className="space-y-3" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Task Title"
                    className="w-full px-4 py-2 bg-slate-700 rounded-lg"
                    required
                />

                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700 rounded-lg"
                >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>

                <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700 rounded-lg"
                >
                    <option value="">Unassigned</option>
                    {/* populate dropdown with users */}
                    {task.workspace?.members?.map((member) => (
                        <option key={member._id} value={member._id}>
                            {member.name}
                        </option>
                    ))}
                </select>

                <div className="flex justify-end gap-2 pt-2">
                    <button
                        type="button"
                        onClick={closeModal}
                        className="px-4 py-2 bg-slate-600 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-teal-600 rounded-lg"
                    >
                        Save
                    </button>
                </div>
            </form>
        </ModalShell>
    );
};


// --- Notifications Panel Component ---
const NotificationsPanel = ({ notifications, onMarkAsRead, navigate }) => {
    const unreadCount = notifications.filter(n => !n.read).length;
    return (
        <div className="absolute right-0 mt-2 w-80 bg-slate-700 rounded-lg shadow-lg py-2 z-30">
            <div className="px-4 py-2 font-bold text-white border-b border-slate-600">Notifications ({unreadCount})</div>
            <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? notifications.map(notif => (
                    <div 
                        key={notif._id} 
                        className={`px-4 py-3 border-b border-slate-600 last:border-b-0 cursor-pointer hover:bg-slate-600 ${!notif.read ? 'bg-teal-500/10' : ''}`}
                        onClick={() => { onMarkAsRead(notif._id)}}
                    >
                        <p className="text-sm text-slate-200">{notif.message}</p>
                        <p className="text-xs text-slate-400 mt-1">{new Date(notif.createdAt).toLocaleString()}</p>
                    </div>
                )) : <p className="text-sm text-slate-400 text-center py-4">No new notifications.</p>}
            </div>
        </div>
    );
};

const AdminPage = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [workspaces, setWorkspaces] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [helpRequests, setHelpRequests] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modal, setModal] = useState({ isOpen: false, type: null, props: {} });
    const [search, setSearch] = useState("");
    const [profileOpen, setProfileOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    
    const token = localStorage.getItem("token");
    const API_BASE_URL = "http://localhost:9000/api";
    
    const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

    useEffect(() => {
        if (!token) { navigate("/"); return; }
        const fetchAdminData = async () => {
            try {
                const [statsRes, usersRes, wsRes, tasksRes, helpRes, currentUserRes, notificationsRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${API_BASE_URL}/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${API_BASE_URL}/admin/workspaces`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${API_BASE_URL}/admin/tasks`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${API_BASE_URL}/admin/help-requests`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${API_BASE_URL}/users/me`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${API_BASE_URL}/notifications`, { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setStats(statsRes.data);
                setUsers(usersRes.data);
                setWorkspaces(wsRes.data);
                setTasks(tasksRes.data);
                setHelpRequests(helpRes.data);
                setCurrentUser(currentUserRes.data);
                setNotifications(notificationsRes.data);
            } catch (err) {
                setError(err.response?.status === 403 ? "You do not have permission to view this page." : "Failed to load admin data.");
            } finally {
                setLoading(false);
            }
        };
        fetchAdminData();
    }, [token, navigate]);

      useEffect(() => {
    if (!token) return;
    const socket = io("http://localhost:9000", { auth: { token } });
    socket.on('new-notification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
    });
    return () => socket.disconnect();
  }, [token]);
    
    const handleLogout = () => { localStorage.removeItem("token"); navigate("/"); };
    const openModal = (type, props) => setModal({ isOpen: true, type, props });
    const closeModal = () => setModal({ isOpen: false, type: null, props: {} });

    const handleDeleteUser = (id) => openModal('confirm', { title: "Delete User?", message: "Are you sure? This action is irreversible.", onConfirm: async () => { try { await axios.delete(`${API_BASE_URL}/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } }); setUsers(prev => prev.filter(u => u._id !== id)); closeModal(); } catch (err) { alert("Failed to delete user"); } } });
    const handleDeleteWorkspace = (id) => openModal('confirm', { title: "Delete Workspace?", message: "This will delete all associated data. Are you sure?", onConfirm: async () => { try { await axios.delete(`${API_BASE_URL}/admin/workspaces/${id}`, { headers: { Authorization: `Bearer ${token}` } }); setWorkspaces(prev => prev.filter(w => w._id !== id)); closeModal(); } catch (err) { alert("Failed to delete workspace"); } } });
    const handleUpdateWorkspace = async (id, data) => { try { const res = await axios.put(`${API_BASE_URL}/admin/workspaces/${id}`, data, { headers: { Authorization: `Bearer ${token}` } }); setWorkspaces(prev => prev.map(w => w._id === id ? res.data : w)); closeModal(); } catch (err) { alert("Failed to update workspace"); } };
    const handleChangeRole = async (id, newRole) => { try { const res = await axios.put(`${API_BASE_URL}/admin/users/${id}/role`, { role: newRole }, { headers: { Authorization: `Bearer ${token}` } }); setUsers(prev => prev.map(u => (u._id === id ? res.data : u))); } catch (err) { alert("Failed to update role"); } };
    const handleResolveHelpRequest = (id) => { openModal('confirm', { title: "Resolve Request?", message: "Mark this help request as resolved?", onConfirm: async () => { try { await axios.delete(`${API_BASE_URL}/admin/help-requests/${id}`, { headers: { Authorization: `Bearer ${token}` } }); setHelpRequests(prev => prev.filter(req => req._id !== id)); closeModal(); } catch (err) { alert("Failed to resolve help request."); } } }); };
    const handleMarkAsRead = async (id) => { try { await axios.put(`${API_BASE_URL}/notifications/${id}/read`, {}, { headers: { Authorization: `Bearer ${token}` } }); setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n)); } catch (err) { console.error("Failed to mark as read"); }};
    const handleDeleteTask = (id) => {
    openModal('confirm', {
        title: "Delete Task?",
        message: "Are you sure you want to delete this task?",
        onConfirm: async () => {
            try {
                await axios.delete(`${API_BASE_URL}/admin/tasks/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTasks(prev => prev.filter(task => task._id !== id));
                closeModal();
            } catch (err) {
                alert("Failed to delete task");
            }
        }
    });
};
const handleUpdateTask = async (id, data) => {
    try {
        const res = await axios.put(`${API_BASE_URL}/admin/tasks/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(prev => prev.map(task => task._id === id ? res.data : task));
        closeModal();
    } catch (err) {
        alert("Failed to update task");
    }
};



    if (loading) return <div className="min-h-screen flex justify-center items-center bg-slate-900 text-white"><Loader2 size={40} className="animate-spin text-teal-500" /></div>;
    if (error) return <div className="min-h-screen flex flex-col justify-center items-center bg-slate-900 text-white"><h2 className="text-2xl text-red-500">{error}</h2><Link to="/dashboard" className="mt-4 text-teal-400 hover:underline">Return to Dashboard</Link></div>;
    
    return (
        <div className="font-sans min-h-screen bg-slate-900 text-white flex">
            {modal.isOpen && modal.type === 'confirm' && <ConfirmModal close={closeModal} {...modal.props} />}
            {modal.isOpen && modal.type === 'editWorkspace' && <EditWorkspaceModal closeModal={closeModal} workspace={modal.props.workspace} handleUpdate={handleUpdateWorkspace} />}
            {modal.isOpen && modal.type === 'editTask' && (
    <EditTaskModal
        closeModal={closeModal}
        task={modal.props.task}
        handleUpdate={handleUpdateTask}
    />
)}
            <aside className="w-64 bg-slate-800 p-6 flex-col border-r border-slate-700 hidden md:flex">
                <h1 className="text-2xl font-bold mb-10">SyncSpace</h1>
                <nav className="flex flex-col space-y-2">
                    <Link to={currentUser ? `/Dashboard/${currentUser._id}` : '/dashboard'} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors text-slate-300"><Briefcase size={18} /> Dashboard</Link>
                    <button className="flex items-center gap-3 p-3 rounded-lg bg-teal-500/20 font-semibold text-white"><Shield size={18} /> Admin Panel</button>
                </nav>
            </aside>
            
            <main className="flex-1 flex flex-col">
                 <header className="bg-slate-800/50 shadow-md flex items-center justify-between px-8 py-4">
                    <h1 className="text-2xl font-bold">Admin Panel</h1>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <button onClick={() => setNotificationsOpen(prev => !prev)} className="relative text-slate-400 hover:text-white">
                                <Bell size={22}/>
                                {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full px-1.5 py-0.5">{unreadCount}</span>}
                            </button>
                            {notificationsOpen && <NotificationsPanel notifications={notifications} onMarkAsRead={handleMarkAsRead} navigate={navigate} />}
                        </div>
                        <div className="relative">
                        <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center font-bold">{currentUser?.name?.charAt(0)}</div>
                        </button>
                        {profileOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-slate-700 rounded-lg shadow-lg py-2 z-20">
                                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-600"><LogOut size={16}/> Logout</button>
                            </div>
                        )}
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-8 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-slate-800 p-6 rounded-xl flex items-center gap-4"><Users size={32} className="text-teal-400" /><div><div className="text-3xl font-bold">{stats?.users}</div><div className="text-slate-400">Total Users</div></div></div>
                        <div className="bg-slate-800 p-6 rounded-xl flex items-center gap-4"><Briefcase size={32} className="text-teal-400" /><div><div className="text-3xl font-bold">{stats?.workspaces}</div><div className="text-slate-400">Total Workspaces</div></div></div>
                        <div className="bg-slate-800 p-6 rounded-xl flex items-center gap-4"><CheckSquare size={32} className="text-teal-400" /><div><div className="text-3xl font-bold">{stats?.tasks}</div><div className="text-slate-400">Total Tasks</div></div></div>
                        <div className="bg-slate-800 p-6 rounded-xl flex items-center gap-4"><LifeBuoy size={32} className="text-teal-400" /><div><div className="text-3xl font-bold">{helpRequests.length}</div><div className="text-slate-400">Open Help Requests</div></div></div>
                    </div>

                     <div className="bg-slate-800 rounded-xl p-6 mb-8">
                        <h2 className="text-2xl font-bold mb-4">Open Help Requests</h2>
                        <div className="overflow-auto max-h-72">
                            {helpRequests.length > 0 ? (
                                <table className="w-full text-left">
                                    <thead><tr className="border-b border-slate-700"><th className="p-3 w-1/4">From User</th><th className="p-3 w-1/4">Workspace</th><th className="p-3 w-1/2">Message</th><th className="p-3 text-right">Actions</th></tr></thead>
                                    <tbody>{helpRequests.map(req => ( <tr key={req._id} className="border-b border-slate-700 last:border-b-0 hover:bg-slate-700/50"> <td className="p-3 align-top">{req.user.name}</td> <td className="p-3 align-top text-slate-400">{req.workspace.name}</td> <td className="p-3 align-top text-slate-300">{req.message}</td> <td className="p-3 text-right align-top"><button onClick={() => handleResolveHelpRequest(req._id)} className="text-teal-400 hover:text-teal-300 font-semibold">Resolve</button></td></tr>))}</tbody>
                                </table>
                            ) : <p className="text-center text-slate-400 py-8">No open help requests.</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        <div className="bg-slate-800 rounded-xl p-6">
                            <h2 className="text-2xl font-bold mb-4">User Management</h2>
                            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="mb-4 p-2 w-full rounded bg-slate-700"/>
                            <div className="overflow-auto max-h-96">
                                <table className="w-full text-left">
                                    <thead><tr className="border-b border-slate-700"><th className="p-3">Name</th><th className="p-3">Role</th><th className="p-3 text-right">Actions</th></tr></thead>
                                    <tbody>{users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())).map(user => ( <tr key={user._id} className="border-b border-slate-700 last:border-b-0 hover:bg-slate-700/50"> <td className="p-3">{user.name}</td> <td className="p-3"><select value={user.role} onChange={(e) => handleChangeRole(user._id, e.target.value)} className="bg-slate-700 p-1 rounded"><option value="Member">Member</option><option value="Admin">Admin</option></select></td> <td className="p-3 text-right"><button onClick={() => handleDeleteUser(user._id)} className="text-red-500 hover:text-red-400 disabled:opacity-50" disabled={user.role === 'Admin'}><Trash2 size={18} /></button></td></tr>))}</tbody>
                                </table>
                            </div>
                        </div>
                        <div className="bg-slate-800 rounded-xl p-6">
                            <h2 className="text-2xl font-bold mb-4">Workspace Management</h2>
                            <div className="overflow-auto max-h-96">
                                <table className="w-full text-left">
                                    <thead><tr className="border-b border-slate-700"><th className="p-3">Name</th><th className="p-3">Members</th><th className="p-3 text-right">Actions</th></tr></thead>
                                    <tbody>{workspaces.map(ws => ( <tr key={ws._id} className="border-b border-slate-700 last:border-b-0 hover:bg-slate-700/50"> <td className="p-3">{ws.name}</td> <td className="p-3">{ws.members.length}</td> <td className="p-3 text-right flex gap-2 justify-end"><button onClick={() => openModal('editWorkspace', { workspace: ws })} className="text-slate-400 hover:text-white"><Edit3 size={18} /></button><button onClick={() => handleDeleteWorkspace(ws._id)} className="text-red-500 hover:text-red-400"><Trash2 size={18} /></button></td></tr>))}</tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800 rounded-xl p-6 mt-8">
                     <h2 className="text-2xl font-bold mb-4">All Tasks</h2>
                     <div className="overflow-auto max-h-96">
                         <table className="w-full text-left">
                             <thead><tr className="border-b border-slate-700"><th className="p-3">Title</th><th className="p-3">Workspace</th><th className="p-3">Status</th><th className="p-3">Assigned To</th><th className="p-3 text-right">Actions</th></tr></thead>
                             <tbody>{tasks.map(task => ( <tr key={task._id} className="border-b border-slate-700 last:border-b-0 hover:bg-slate-700/50"> <td className="p-3">{task.title}</td> <td className="p-3 text-slate-400">{task.workspace?.name || 'N/A'}</td><td className="p-3"><span className={`px-2 py-1 text-xs rounded-full ${task.status === "Completed" ? "bg-green-600/50" : task.status === "In Progress" ? "bg-yellow-600/50" : "bg-slate-600"}`}>{task.status}</span></td> <td className="p-3 text-slate-400">{task.assignedTo?.name || 'Unassigned'}</td>
                             <td className="p-3 text-right flex gap-2 justify-end">
    <button
        onClick={() => openModal('editTask', { task })}
        className="text-slate-400 hover:text-white"
    >
        <Edit3 size={18} />
    </button>
    <button
        onClick={() => handleDeleteTask(task._id)}
        className="text-red-500 hover:text-red-400"
    >
        <Trash2 size={18} />
    </button>
</td>
</tr>))}</tbody>
                         </table>
                     </div>
                </div>
            </main>
        </div>
    );
};

export default AdminPage;




{/* <div className="bg-slate-800 rounded-xl p-6 mt-8">
                     <h2 className="text-2xl font-bold mb-4">All Tasks</h2>
                     <div className="overflow-auto max-h-96">
                         <table className="w-full text-left">
                             <thead><tr className="border-b border-slate-700"><th className="p-3">Title</th><th className="p-3">Workspace</th><th className="p-3">Status</th><th className="p-3">Assigned To</th><th className="p-3 text-right">Actions</th></tr></thead>
                             <tbody>{tasks.map(task => ( <tr key={task._id} className="border-b border-slate-700 last:border-b-0 hover:bg-slate-700/50"> <td className="p-3">{task.title}</td> <td className="p-3 text-slate-400">{task.workspace?.name || 'N/A'}</td><td className="p-3"><span className={`px-2 py-1 text-xs rounded-full ${task.status === "Completed" ? "bg-green-600/50" : task.status === "In Progress" ? "bg-yellow-600/50" : "bg-slate-600"}`}>{task.status}</span></td> <td className="p-3 text-slate-400">{task.assignedTo?.name || 'Unassigned'}</td><td className="p-3 text-right"><button onClick={() => handleDeleteTask(task._id)} className="text-red-500 hover:text-red-400"><Trash2 size={18} /></button></td></tr>))}</tbody>
                         </table>
                     </div>
                </div> */}