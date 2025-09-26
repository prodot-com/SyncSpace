// import React, { useState, useEffect, useMemo } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { Loader2, Users, Briefcase, CheckSquare, Shield, Trash2, Edit3, X, LifeBuoy, Bell, LogOut, LayoutGrid } from 'lucide-react';
// import axios from 'axios';
// import { io } from "socket.io-client";
// import { BACKEND_URL } from '../../utilities/constants';
// import { SOCKET_URL } from '../../utilities/constants';


// const ModalShell = ({ children, close }) => (
//     <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] flex justify-center items-center p-4 transition-opacity duration-300">
//         <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-6 w-full max-w-md relative animate-fade-in-up">
//             <button onClick={close} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
//                 <X size={20} />
//             </button>
//             {children}
//         </div>
//     </div>
// );


// const ConfirmModal = ({ close, onConfirm, title, message }) => (
//     <ModalShell close={close}>
//         <h2 className="text-2xl font-bold mb-3 text-white">{title}</h2>
//         <p className="text-slate-300 mb-6">{message}</p>
//         <div className="flex gap-3 justify-end">
//             <button type="button" onClick={close} className="px-5 py-2 rounded-lg font-semibold bg-slate-600 hover:bg-slate-500 transition-colors">
//                 Cancel
//             </button>
//             <button onClick={onConfirm} className="px-5 py-2 rounded-lg font-semibold bg-red-600 hover:bg-red-500 transition-colors text-white">
//                 Confirm
//             </button>
//         </div>
//     </ModalShell>
// );


// const EditWorkspaceModal = ({ closeModal, workspace, handleUpdate }) => {
//     const [name, setName] = useState(workspace.name);
//     const [description, setDescription] = useState(workspace.description || "");
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         handleUpdate(workspace._id, { name, description });
//     };
//     return (
//         <ModalShell close={closeModal}>
//             <h2 className="text-2xl font-bold mb-4 text-white">Edit Workspace</h2>
//             <form className="space-y-4" onSubmit={handleSubmit}>
//                 <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Workspace Name" className="w-full px-4 py-2 bg-slate-700/50 rounded-lg border border-slate-600 focus:ring-2 focus:ring-teal-500 outline-none transition" required />
//                 <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)" className="w-full px-4 py-2 bg-slate-700/50 rounded-lg border border-slate-600 focus:ring-2 focus:ring-teal-500 outline-none transition" rows={3} />
//                 <div className="flex justify-end gap-3 pt-2">
//                     <button type="button" onClick={closeModal} className="px-5 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors font-semibold">Cancel</button>
//                     <button type="submit" className="px-5 py-2 bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors font-semibold text-white">Save Changes</button>
//                 </div>
//             </form>
//         </ModalShell>
//     );
// };


// const EditTaskModal = ({ closeModal, task, handleUpdate }) => {
//     const [title, setTitle] = useState(task.title);
//     const [status, setStatus] = useState(task.status || "To Do");
//     const [assignedTo, setAssignedTo] = useState(task.assignedTo?._id || "");

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         handleUpdate(task._id, { title, status, assignedTo });
//     };

//     return (
//         <ModalShell close={closeModal}>
//             <h2 className="text-2xl font-bold mb-4 text-white">Edit Task</h2>
//             <form className="space-y-4" onSubmit={handleSubmit}>
//                 <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task Title" className="w-full px-4 py-2 bg-slate-700/50 rounded-lg border border-slate-600 focus:ring-2 focus:ring-teal-500 outline-none transition" required />
//                 <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-2 bg-slate-700/50 rounded-lg border border-slate-600 focus:ring-2 focus:ring-teal-500 outline-none transition appearance-none">
//                     <option value="To Do">To Do</option>
//                     <option value="In Progress">In Progress</option>
//                     <option value="Completed">Completed</option>
//                 </select>
//                 <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="w-full px-4 py-2 bg-slate-700/50 rounded-lg border border-slate-600 focus:ring-2 focus:ring-teal-500 outline-none transition appearance-none">
//                     <option value="">Unassigned</option>
//                     {task.workspace?.members?.map((member) => (
//                         <option key={member._id} value={member._id}>
//                             {member.name}
//                         </option>
//                     ))}
//                 </select>
//                 <div className="flex justify-end gap-3 pt-2">
//                     <button type="button" onClick={closeModal} className="px-5 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors font-semibold">Cancel</button>
//                     <button type="submit" className="px-5 py-2 bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors font-semibold text-white">Save Changes</button>
//                 </div>
//             </form>
//         </ModalShell>
//     );
// };


// const NotificationsPanel = ({ notifications, onMarkAsRead }) => {
//     const unreadCount = notifications.filter(n => !n.read).length;
//     return (
//         <div className="absolute right-0 mt-3 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl py-2 z-30 animate-fade-in-down">
//             <div className="px-4 py-2 font-bold text-white border-b border-slate-700">Notifications ({unreadCount})</div>
//             <div className="max-h-96 overflow-y-auto">
//                 {notifications.length > 0 ? notifications.map(notif => (
//                     <div
//                         key={notif._id}
//                         className={`px-4 py-3 border-b border-slate-700 last:border-b-0 cursor-pointer hover:bg-slate-700/50 transition-colors ${!notif.read ? 'bg-teal-500/10' : ''}`}
//                         onClick={() => onMarkAsRead(notif._id)}
//                     >
//                         <p className="text-sm text-slate-200">{notif.message}</p>
//                         <p className="text-xs text-slate-400 mt-1">{new Date(notif.createdAt).toLocaleString()}</p>
//                     </div>
//                 )) : <p className="text-sm text-slate-400 text-center py-6">No new notifications.</p>}
//             </div>
//         </div>
//     );
// };


// const AdminPage = () => {
//     const navigate = useNavigate();
//     const [stats, setStats] = useState(null);
//     const [users, setUsers] = useState([]);
//     const [workspaces, setWorkspaces] = useState([]);
//     const [tasks, setTasks] = useState([]);
//     const [helpRequests, setHelpRequests] = useState([]);
//     const [currentUser, setCurrentUser] = useState(null);
//     const [notifications, setNotifications] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [modal, setModal] = useState({ isOpen: false, type: null, props: {} });
//     const [search, setSearch] = useState("");
//     const [profileOpen, setProfileOpen] = useState(false);
//     const [notificationsOpen, setNotificationsOpen] = useState(false);
    
//     const token = localStorage.getItem("token");
    
//     const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

//     useEffect(() => {
//         if (!token) { navigate("/"); return; }
//         const fetchAdminData = async () => {
//             try {
//                 const [statsRes, usersRes, wsRes, tasksRes, helpRes, currentUserRes, notificationsRes] = await Promise.all([
//                     axios.get(`${BACKEND_URL}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
//                     axios.get(`${BACKEND_URL}/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
//                     axios.get(`${BACKEND_URL}/admin/workspaces`, { headers: { Authorization: `Bearer ${token}` } }),
//                     axios.get(`${BACKEND_URL}/admin/tasks`, { headers: { Authorization: `Bearer ${token}` } }),
//                     axios.get(`${BACKEND_URL}/admin/help-requests`, { headers: { Authorization: `Bearer ${token}` } }),
//                     axios.get(`${BACKEND_URL}/users/me`, { headers: { Authorization: `Bearer ${token}` } }),
//                     axios.get(`${BACKEND_URL}/notifications`, { headers: { Authorization: `Bearer ${token}` } })
//                 ]);
//                 setStats(statsRes.data);
//                 setUsers(usersRes.data);
//                 setWorkspaces(wsRes.data);
//                 setTasks(tasksRes.data);
//                 setHelpRequests(helpRes.data);
//                 setCurrentUser(currentUserRes.data);
//                 setNotifications(notificationsRes.data);
//             } catch (err) {
//                 setError(err.response?.status === 403 ? "You do not have permission to view this page." : "Failed to load admin data.");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchAdminData();
//     }, [token, navigate]);

//     useEffect(() => {
//         if (!token) return;
//         const socket = io(`${SOCKET_URL}`, { auth: { token } });
//         socket.on('new-notification', (notification) => {
//             setNotifications(prev => [notification, ...prev]);
//         });
//         return () => socket.disconnect();
//     }, [token]);
    
//     const handleLogout = () => { localStorage.removeItem("token"); navigate("/"); };
//     const openModal = (type, props) => setModal({ isOpen: true, type, props });
//     const closeModal = () => setModal({ isOpen: false, type: null, props: {} });

//     const handleDeleteUser = (id) => openModal('confirm', { title: "Delete User?", message: "Are you sure? This action is irreversible.", onConfirm: async () => { try { await axios.delete(`${BACKEND_URL}/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } }); setUsers(prev => prev.filter(u => u._id !== id)); closeModal(); } catch (err) { alert("Failed to delete user"); } } });
//     const handleDeleteWorkspace = (id) => openModal('confirm', { title: "Delete Workspace?", message: "This will delete all associated data. Are you sure?", onConfirm: async () => { try { await axios.delete(`${BACKEND_URL}/admin/workspaces/${id}`, { headers: { Authorization: `Bearer ${token}` } }); setWorkspaces(prev => prev.filter(w => w._id !== id)); closeModal(); } catch (err) { alert("Failed to delete workspace"); } } });
//     const handleUpdateWorkspace = async (id, data) => { try { const res = await axios.put(`${BACKEND_URL}/admin/workspaces/${id}`, data, { headers: { Authorization: `Bearer ${token}` } }); setWorkspaces(prev => prev.map(w => w._id === id ? res.data : w)); closeModal(); } catch (err) { alert("Failed to update workspace"); } };
//     const handleChangeRole = async (id, newRole) => { try { const res = await axios.put(`${BACKEND_URL}/admin/users/${id}/role`, { role: newRole }, { headers: { Authorization: `Bearer ${token}` } }); setUsers(prev => prev.map(u => (u._id === id ? res.data : u))); } catch (err) { alert("Failed to update role"); } };
//     const handleResolveHelpRequest = (id) => { openModal('confirm', { title: "Resolve Request?", message: "Mark this help request as resolved?", onConfirm: async () => { try { await axios.delete(`${BACKEND_URL}/admin/help-requests/${id}`, { headers: { Authorization: `Bearer ${token}` } }); setHelpRequests(prev => prev.filter(req => req._id !== id)); closeModal(); } catch (err) { alert("Failed to resolve help request."); } } }); };
//     const handleMarkAsRead = async (id) => { try { await axios.put(`${BACKEND_URL}/notifications/${id}/read`, {}, { headers: { Authorization: `Bearer ${token}` } }); setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n)); } catch (err) { console.error("Failed to mark as read"); }};
//     const handleDeleteTask = (id) => { openModal('confirm', { title: "Delete Task?", message: "Are you sure you want to delete this task?", onConfirm: async () => { try { await axios.delete(`${BACKEND_URL}/admin/tasks/${id}`, { headers: { Authorization: `Bearer ${token}` } }); setTasks(prev => prev.filter(task => task._id !== id)); closeModal(); } catch (err) { alert("Failed to delete task"); } } }); };
//     const handleUpdateTask = async (id, data) => { try { const res = await axios.put(`${BACKEND_URL}/admin/tasks/${id}`, data, { headers: { Authorization: `Bearer ${token}` } }); setTasks(prev => prev.map(task => task._id === id ? res.data : task)); closeModal(); } catch (err) { alert("Failed to update task"); } };

//     if (loading) return <div className="min-h-screen flex justify-center items-center bg-slate-900 text-white"><Loader2 size={40} className="animate-spin text-teal-400" /></div>;
//     if (error) return <div className="min-h-screen flex flex-col justify-center items-center bg-slate-900 text-white p-4"><div className="text-center"><Shield size={48} className="text-red-500 mx-auto mb-4" /><h2 className="text-2xl font-bold text-red-400 mb-2">Access Denied</h2><p className="text-slate-300">{error}</p><Link to="/dashboard" className="mt-6 inline-block text-teal-400 hover:text-teal-300 font-semibold transition-colors">Return to Dashboard</Link></div></div>;
    
//     return (
//         <div className="font-sans min-h-screen bg-slate-900 text-slate-100 flex antialiased">
//             {modal.isOpen && modal.type === 'confirm' && <ConfirmModal close={closeModal} {...modal.props} />}
//             {modal.isOpen && modal.type === 'editWorkspace' && <EditWorkspaceModal closeModal={closeModal} workspace={modal.props.workspace} handleUpdate={handleUpdateWorkspace} />}
//             {modal.isOpen && modal.type === 'editTask' && <EditTaskModal closeModal={closeModal} task={modal.props.task} handleUpdate={handleUpdateTask} />}
            
//             {/* Sidebar */}
//             <aside className="w-64 bg-slate-800 p-6 flex-col border-r border-slate-700 hidden md:flex">
//                 <h1 className="text-2xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">SyncSpace</h1>
//                 <nav className="flex flex-col space-y-2 flex-grow">
//                     <Link to={`/Dashboard/${users._id}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/50 text-slate-300 transition-colors"><LayoutGrid size={20} /> Dashboard</Link>
//                     <Link to={`/Tasks/${users._id}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/50 text-slate-300 transition-colors"><CheckSquare size={20} /> My Tasks</Link>
//                     <Link to={`/Team/${users._id}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/50 text-slate-300 transition-colors"><Users size={20} /> Teams</Link>
//                     <Link to="#" className="flex items-center gap-3 p-3 rounded-lg bg-teal-500/20 text-white font-semibold cursor-default"><Shield size={20} /> Admin Panel</Link>
//                 </nav>
//             </aside>
            
//             <main className="flex-1 flex flex-col">
//                 {/* Header */}
//                  <header className="bg-slate-800/60 backdrop-blur-sm border-b border-slate-700 flex items-center justify-between px-8 py-4 sticky top-0 z-10">
//                     <h1 className="text-2xl font-bold">Admin Panel</h1>
//                     <div className="flex items-center gap-5">
//                         <div className="relative">
//                             <button onClick={() => setNotificationsOpen(prev => !prev)} className="relative text-slate-400 hover:text-white transition-colors pt-1">
//                                 <Bell size={25}/>
//                                 {unreadCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">{unreadCount}</span>}
//                             </button>
//                             {notificationsOpen && <NotificationsPanel notifications={notifications} onMarkAsRead={handleMarkAsRead} />}
//                         </div>
//                         <div className="relative">
//                         <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2">
//                             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center font-bold text-slate-900">{currentUser?.name?.charAt(0)}</div>
//                         </button>
//                         {profileOpen && (
//                             <div className="absolute right-0 mt-3 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl py-2 z-20 animate-fade-in-down">
//                                 <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-colors"><LogOut size={16}/> Logout</button>
//                             </div>
//                         )}
//                         </div>
//                     </div>
//                 </header>

//                 {/* Main Content */}
//                 <div className="flex-1 p-8 overflow-y-auto">
//                     {/* Stats Grid */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
//                         <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl flex items-center gap-5 hover:bg-slate-700/60 transition-colors duration-300"><Users size={32} className="text-teal-400" /><div><div className="text-3xl font-bold">{stats?.users}</div><div className="text-slate-400">Total Users</div></div></div>
//                         <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl flex items-center gap-5 hover:bg-slate-700/60 transition-colors duration-300"><Briefcase size={32} className="text-teal-400" /><div><div className="text-3xl font-bold">{stats?.workspaces}</div><div className="text-slate-400">Workspaces</div></div></div>
//                         <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl flex items-center gap-5 hover:bg-slate-700/60 transition-colors duration-300"><CheckSquare size={32} className="text-teal-400" /><div><div className="text-3xl font-bold">{stats?.tasks}</div><div className="text-slate-400">Total Tasks</div></div></div>
//                         <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl flex items-center gap-5 hover:bg-slate-700/60 transition-colors duration-300"><LifeBuoy size={32} className="text-orange-400" /><div><div className="text-3xl font-bold">{helpRequests.length}</div><div className="text-slate-400">Help Requests</div></div></div>
//                     </div>

//                     {/* Help Requests */}
//                      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8">
//                         <h2 className="text-xl font-bold mb-4 pb-4 border-b border-slate-700">Open Help Requests</h2>
//                         <div className="overflow-auto max-h-72">
//                             {helpRequests.length > 0 ? (
//                                 <table className="w-full text-left">
//                                     <thead><tr className="border-b border-slate-600"><th className="p-3 text-sm font-semibold text-slate-400 w-1/4">User</th><th className="p-3 text-sm font-semibold text-slate-400 w-1/4">Workspace</th><th className="p-3 text-sm font-semibold text-slate-400 w-1/2">Message</th><th className="p-3 text-sm font-semibold text-slate-400 text-right">Actions</th></tr></thead>
//                                     <tbody>{helpRequests.map(req => ( <tr key={req._id} className="border-b border-slate-700/50 last:border-b-0 hover:bg-slate-700/30 transition-colors"> <td className="p-3 align-top">{req.user.name}</td> <td className="p-3 align-top text-slate-400">{req.workspace.name}</td> <td className="p-3 align-top text-slate-300 text-sm whitespace-pre-wrap">{req.message}</td> <td className="p-3 text-right align-top"><button onClick={() => handleResolveHelpRequest(req._id)} className="text-teal-400 hover:text-teal-300 font-semibold transition-colors">Resolve</button></td></tr>))}</tbody>
//                                 </table>
//                             ) : <p className="text-center text-slate-400 py-10">No open help requests.</p>}
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
//                         {/* User Management */}
//                         <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
//                             <h2 className="text-xl font-bold mb-4 pb-4 border-b border-slate-700">User Management</h2>
//                             <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..." className="mb-4 p-2 w-full rounded bg-slate-700/50 border border-slate-600 focus:ring-2 focus:ring-teal-500 outline-none transition"/>
//                             <div className="overflow-auto max-h-96">
//                                 <table className="w-full text-left">
//                                     <thead><tr className="border-b border-slate-600"><th className="p-3 text-sm font-semibold text-slate-400">Name</th><th className="p-3 text-sm font-semibold text-slate-400">Role</th><th className="p-3 text-sm font-semibold text-slate-400 text-right">Actions</th></tr></thead>
//                                     <tbody>{users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())).map(user => ( <tr key={user._id} className="border-b border-slate-700/50 last:border-b-0 hover:bg-slate-700/30 transition-colors"> <td className="p-3">{user.name}</td> <td className="p-3"><select value={user.role} onChange={(e) => handleChangeRole(user._id, e.target.value)} className="bg-slate-700 p-1 rounded border border-slate-600"><option value="Member">Member</option><option value="Admin">Admin</option></select></td> <td className="p-3 text-right"><button onClick={() => handleDeleteUser(user._id)} className="text-red-500 hover:text-red-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors" disabled={user.role === 'Admin'}><Trash2 size={18} /></button></td></tr>))}</tbody>
//                                 </table>
//                             </div>
//                         </div>

//                         {/* Workspace Management */}
//                         <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
//                             <h2 className="text-xl font-bold mb-4 pb-4 border-b border-slate-700">Workspace Management</h2>
//                             <div className="overflow-auto max-h-[28.5rem]"> {/* Matched height */}
//                                 <table className="w-full text-left">
//                                     <thead><tr className="border-b border-slate-600"><th className="p-3 text-sm font-semibold text-slate-400">Name</th><th className="p-3 text-sm font-semibold text-slate-400">Members</th><th className="p-3 text-sm font-semibold text-slate-400 text-right">Actions</th></tr></thead>
//                                     <tbody>{workspaces.map(ws => ( <tr key={ws._id} className="border-b border-slate-700/50 last:border-b-0 hover:bg-slate-700/30 transition-colors"> <td className="p-3">{ws.name}</td> <td className="p-3">{ws.members.length}</td> <td className="p-3 text-right flex gap-3 justify-end"><button onClick={() => openModal('editWorkspace', { workspace: ws })} className="text-slate-400 hover:text-white transition-colors"><Edit3 size={18} /></button><button onClick={() => handleDeleteWorkspace(ws._id)} className="text-red-500 hover:text-red-400 transition-colors"><Trash2 size={18} /></button></td></tr>))}</tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     </div>
                    
//                     {/* All Tasks */}
//                      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
//                         <h2 className="text-xl font-bold mb-4 pb-4 border-b border-slate-700">All Tasks</h2>
//                         <div className="overflow-auto max-h-96">
//                             <table className="w-full text-left">
//                                 <thead><tr className="border-b border-slate-600"><th className="p-3 text-sm font-semibold text-slate-400">Title</th><th className="p-3 text-sm font-semibold text-slate-400">Workspace</th><th className="p-3 text-sm font-semibold text-slate-400">Status</th><th className="p-3 text-sm font-semibold text-slate-400">Assigned To</th><th className="p-3 text-sm font-semibold text-slate-400 text-right">Actions</th></tr></thead>
//                                 <tbody>{tasks.map(task => ( <tr key={task._id} className="border-b border-slate-700/50 last:border-b-0 hover:bg-slate-700/30 transition-colors"> <td className="p-3">{task.title}</td> <td className="p-3 text-slate-400">{task.workspace?.name || 'N/A'}</td><td className="p-3"><span className={`px-2 py-1 text-xs rounded-full font-semibold ${task.status === "Completed" ? "bg-green-500/20 text-green-300" : task.status === "In Progress" ? "bg-yellow-500/20 text-yellow-300" : "bg-slate-600/50 text-slate-300"}`}>{task.status}</span></td> <td className="p-3 text-slate-400">{task.assignedTo?.name || 'Unassigned'}</td>
//                                 <td className="p-3 text-right flex gap-3 justify-end">
//                                     <button onClick={() => openModal('editTask', { task })} className="text-slate-400 hover:text-white transition-colors"><Edit3 size={18} /></button>
//                                     <button onClick={() => handleDeleteTask(task._id)} className="text-red-500 hover:text-red-400 transition-colors"><Trash2 size={18} /></button>
//                                 </td>
//                                 </tr>))}</tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// };

// export default AdminPage;


import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Users, Briefcase, CheckSquare, Shield, Trash2, Edit3, X, LifeBuoy, Bell, LogOut, LayoutGrid } from 'lucide-react';
import axios from 'axios';
import { io } from "socket.io-client";
import { BACKEND_URL } from '../../utilities/constants';
import { SOCKET_URL } from '../../utilities/constants';


const ModalShell = ({ children, close }) => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] flex justify-center items-center p-4 transition-opacity duration-300">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-6 w-full max-w-md relative animate-fade-in-up">
            <button onClick={close} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
                <X size={20} />
            </button>
            {children}
        </div>
    </div>
);


const ConfirmModal = ({ close, onConfirm, title, message }) => (
    <ModalShell close={close}>
        <h2 className="text-xl sm:text-2xl font-bold mb-3 text-white">{title}</h2>
        <p className="text-slate-300 mb-6 text-sm sm:text-base">{message}</p>
        <div className="flex gap-3 justify-end">
            <button type="button" onClick={close} className="px-5 py-2 rounded-lg font-semibold bg-slate-600 hover:bg-slate-500 transition-colors">
                Cancel
            </button>
            <button onClick={onConfirm} className="px-5 py-2 rounded-lg font-semibold bg-red-600 hover:bg-red-500 transition-colors text-white">
                Confirm
            </button>
        </div>
    </ModalShell>
);


const EditWorkspaceModal = ({ closeModal, workspace, handleUpdate }) => {
    const [name, setName] = useState(workspace.name);
    const [description, setDescription] = useState(workspace.description || "");
    const handleSubmit = (e) => {
        e.preventDefault();
        handleUpdate(workspace._id, { name, description });
    };
    return (
        <ModalShell close={closeModal}>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">Edit Workspace</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Workspace Name" className="w-full px-4 py-2 bg-slate-700/50 rounded-lg border border-slate-600 focus:ring-2 focus:ring-teal-500 outline-none transition" required />
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)" className="w-full px-4 py-2 bg-slate-700/50 rounded-lg border border-slate-600 focus:ring-2 focus:ring-teal-500 outline-none transition" rows={3} />
                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={closeModal} className="px-5 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors font-semibold">Cancel</button>
                    <button type="submit" className="px-5 py-2 bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors font-semibold text-white">Save Changes</button>
                </div>
            </form>
        </ModalShell>
    );
};


const EditTaskModal = ({ closeModal, task, handleUpdate }) => {
    const [title, setTitle] = useState(task.title);
    const [status, setStatus] = useState(task.status || "To Do");
    const [assignedTo, setAssignedTo] = useState(task.assignedTo?._id || "");

    const handleSubmit = (e) => {
        e.preventDefault();
        handleUpdate(task._id, { title, status, assignedTo });
    };

    return (
        <ModalShell close={closeModal}>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">Edit Task</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task Title" className="w-full px-4 py-2 bg-slate-700/50 rounded-lg border border-slate-600 focus:ring-2 focus:ring-teal-500 outline-none transition" required />
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-2 bg-slate-700/50 rounded-lg border border-slate-600 focus:ring-2 focus:ring-teal-500 outline-none transition appearance-none">
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
                <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="w-full px-4 py-2 bg-slate-700/50 rounded-lg border border-slate-600 focus:ring-2 focus:ring-teal-500 outline-none transition appearance-none">
                    <option value="">Unassigned</option>
                    {task.workspace?.members?.map((member) => (
                        <option key={member._id} value={member._id}>
                            {member.name}
                        </option>
                    ))}
                </select>
                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={closeModal} className="px-5 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors font-semibold">Cancel</button>
                    <button type="submit" className="px-5 py-2 bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors font-semibold text-white">Save Changes</button>
                </div>
            </form>
        </ModalShell>
    );
};


const NotificationsPanel = ({ notifications, onMarkAsRead }) => {
    const unreadCount = notifications.filter(n => !n.read).length;
    return (
        <div className="absolute right-4 sm:right-0 mt-3 w-[calc(100vw-2rem)] max-w-sm sm:w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl py-2 z-30 animate-fade-in-down">
            <div className="px-4 py-2 font-bold text-white border-b border-slate-700">Notifications ({unreadCount})</div>
            <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? notifications.map(notif => (
                    <div
                        key={notif._id}
                        className={`px-4 py-3 border-b border-slate-700 last:border-b-0 cursor-pointer hover:bg-slate-700/50 transition-colors ${!notif.read ? 'bg-teal-500/10' : ''}`}
                        onClick={() => onMarkAsRead(notif._id)}
                    >
                        <p className="text-sm text-slate-200">{notif.message}</p>
                        <p className="text-xs text-slate-400 mt-1">{new Date(notif.createdAt).toLocaleString()}</p>
                    </div>
                )) : <p className="text-sm text-slate-400 text-center py-6">No new notifications.</p>}
            </div>
        </div>
    );
};

const BottomNav = ({ user }) => {
    const navItems = [
        { path: `/Dashboard/${user._id}`, icon: LayoutGrid, label: "Dashboard" },
        { path: `/Tasks/${user._id}`, icon: CheckSquare, label: "Tasks" },
        { path: `/Team/${user._id}`, icon: Users, label: "Teams" },
    ];
    if (user.role === 'Admin') {
        navItems.push({ path: `/Admin/${user._id}`, icon: Shield, label: "Admin" });
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 flex justify-around items-center p-2 z-50 md:hidden">
            {navItems.map(item => (
                <Link 
                    key={item.label}
                    to={item.path} 
                    className={`flex flex-col items-center justify-center gap-1 w-full py-1 rounded-md transition-colors text-slate-400 hover:text-teal-400
                        ${item.label === 'Admin'? "bg-slate-700": ""}
                        `}
                >
                    <item.icon size={20} />
                    <span className="text-xs">{item.label}</span>
                </Link>
            ))}
        </nav>
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
    
    const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

    useEffect(() => {
        if (!token) { navigate("/"); return; }
        const fetchAdminData = async () => {
            try {
                const [statsRes, usersRes, wsRes, tasksRes, helpRes, currentUserRes, notificationsRes] = await Promise.all([
                    axios.get(`${BACKEND_URL}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${BACKEND_URL}/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${BACKEND_URL}/admin/workspaces`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${BACKEND_URL}/admin/tasks`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${BACKEND_URL}/admin/help-requests`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${BACKEND_URL}/users/me`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${BACKEND_URL}/notifications`, { headers: { Authorization: `Bearer ${token}` } })
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
        const socket = io(`${SOCKET_URL}`, { auth: { token } });
        socket.on('new-notification', (notification) => {
            setNotifications(prev => [notification, ...prev]);
        });
        return () => socket.disconnect();
    }, [token]);
    
    const handleLogout = () => { localStorage.removeItem("token"); navigate("/"); };
    const openModal = (type, props) => { setProfileOpen(false); setNotificationsOpen(false); setModal({ isOpen: true, type, props }); };
    const closeModal = () => setModal({ isOpen: false, type: null, props: {} });

    const handleDeleteUser = (id) => openModal('confirm', { title: "Delete User?", message: "Are you sure? This action is irreversible.", onConfirm: async () => { try { await axios.delete(`${BACKEND_URL}/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } }); setUsers(prev => prev.filter(u => u._id !== id)); closeModal(); } catch (err) { alert("Failed to delete user"); } } });
    const handleDeleteWorkspace = (id) => openModal('confirm', { title: "Delete Workspace?", message: "This will delete all associated data. Are you sure?", onConfirm: async () => { try { await axios.delete(`${BACKEND_URL}/admin/workspaces/${id}`, { headers: { Authorization: `Bearer ${token}` } }); setWorkspaces(prev => prev.filter(w => w._id !== id)); closeModal(); } catch (err) { alert("Failed to delete workspace"); } } });
    const handleUpdateWorkspace = async (id, data) => { try { const res = await axios.put(`${BACKEND_URL}/admin/workspaces/${id}`, data, { headers: { Authorization: `Bearer ${token}` } }); setWorkspaces(prev => prev.map(w => w._id === id ? res.data : w)); closeModal(); } catch (err) { alert("Failed to update workspace"); } };
    const handleChangeRole = async (id, newRole) => { try { const res = await axios.put(`${BACKEND_URL}/admin/users/${id}/role`, { role: newRole }, { headers: { Authorization: `Bearer ${token}` } }); setUsers(prev => prev.map(u => (u._id === id ? res.data : u))); } catch (err) { alert("Failed to update role"); } };
    const handleResolveHelpRequest = (id) => { openModal('confirm', { title: "Resolve Request?", message: "Mark this help request as resolved?", onConfirm: async () => { try { await axios.delete(`${BACKEND_URL}/admin/help-requests/${id}`, { headers: { Authorization: `Bearer ${token}` } }); setHelpRequests(prev => prev.filter(req => req._id !== id)); closeModal(); } catch (err) { alert("Failed to resolve help request."); } } }); };
    const handleMarkAsRead = async (id) => { try { await axios.put(`${BACKEND_URL}/notifications/${id}/read`, {}, { headers: { Authorization: `Bearer ${token}` } }); setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n)); } catch (err) { console.error("Failed to mark as read"); }};
    const handleDeleteTask = (id) => { openModal('confirm', { title: "Delete Task?", message: "Are you sure you want to delete this task?", onConfirm: async () => { try { await axios.delete(`${BACKEND_URL}/admin/tasks/${id}`, { headers: { Authorization: `Bearer ${token}` } }); setTasks(prev => prev.filter(task => task._id !== id)); closeModal(); } catch (err) { alert("Failed to delete task"); } } }); };
    const handleUpdateTask = async (id, data) => { try { const res = await axios.put(`${BACKEND_URL}/admin/tasks/${id}`, data, { headers: { Authorization: `Bearer ${token}` } }); setTasks(prev => prev.map(task => task._id === id ? res.data : task)); closeModal(); } catch (err) { alert("Failed to update task"); } };

    if (loading) return <div className="min-h-screen flex justify-center items-center bg-slate-900 text-white"><Loader2 size={40} className="animate-spin text-teal-400" /></div>;
    if (error) return <div className="min-h-screen flex flex-col justify-center items-center bg-slate-900 text-white p-4"><div className="text-center"><Shield size={48} className="text-red-500 mx-auto mb-4" /><h2 className="text-2xl font-bold text-red-400 mb-2">Access Denied</h2><p className="text-slate-300">{error}</p><Link to="/dashboard" className="mt-6 inline-block text-teal-400 hover:text-teal-300 font-semibold transition-colors">Return to Dashboard</Link></div></div>;
    
    return (
        <div className="font-sans min-h-screen bg-slate-900 text-slate-100 flex antialiased">
            {modal.isOpen && modal.type === 'confirm' && <ConfirmModal close={closeModal} {...modal.props} />}
            {modal.isOpen && modal.type === 'editWorkspace' && <EditWorkspaceModal closeModal={closeModal} workspace={modal.props.workspace} handleUpdate={handleUpdateWorkspace} />}
            {modal.isOpen && modal.type === 'editTask' && <EditTaskModal closeModal={closeModal} task={modal.props.task} handleUpdate={handleUpdateTask} />}
            
            <aside className="w-64 bg-slate-800 p-6 flex-col border-r border-slate-700 hidden md:flex">
                <h1 className="text-2xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">SyncSpace</h1>
                <nav className="flex flex-col space-y-2 flex-grow">
                    <Link to={`/Dashboard/${currentUser._id}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/50 text-slate-300 transition-colors"><LayoutGrid size={20} /> Dashboard</Link>
                    <Link to={`/Tasks/${currentUser._id}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/50 text-slate-300 transition-colors"><CheckSquare size={20} /> My Tasks</Link>
                    <Link to={`/Team/${currentUser._id}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/50 text-slate-300 transition-colors"><Users size={20} /> Teams</Link>
                    <Link to={`/Admin/${currentUser._id}`} className="flex items-center gap-3 p-3 rounded-lg bg-teal-500/20 text-white font-semibold cursor-default"><Shield size={20} /> Admin Panel</Link>
                </nav>
            </aside>
            
            <main className="flex-1 flex flex-col min-w-0">
                 <header className="bg-slate-800/60 backdrop-blur-sm border-b border-slate-700 flex items-center justify-between px-4 sm:px-8 py-3 sticky top-0 z-10">
                    <h1 className="text-xl sm:text-2xl font-bold">Admin Panel</h1>
                    <div className="flex items-center gap-4 sm:gap-5">
                        <div className="relative">
                            <button onClick={() => { setNotificationsOpen(p => !p); setProfileOpen(false); }} className="relative text-slate-400 hover:text-white transition-colors pt-1">
                                <Bell size={22}/>
                                {unreadCount > 0 && <span className="absolute -top-1 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">{unreadCount}</span>}
                            </button>
                            {notificationsOpen && <NotificationsPanel notifications={notifications} onMarkAsRead={handleMarkAsRead} />}
                        </div>
                        <div className="relative">
                            <button onClick={() => { setProfileOpen(p => !p); setNotificationsOpen(false); }} className="flex items-center gap-2">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center font-bold text-slate-900">{currentUser?.name?.charAt(0)}</div>
                            </button>
                            {profileOpen && (
                                <div className="absolute right-0 mt-3 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl py-2 z-20 animate-fade-in-down">
                                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-colors"><LogOut size={16}/> Logout</button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-4 sm:p-8 overflow-y-auto pb-24 md:pb-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
                        <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex items-center gap-4 hover:bg-slate-700/60 transition-colors"><Users size={24} className="text-teal-400" /><div><div className="text-2xl font-bold">{stats?.users}</div><div className="text-slate-400 text-sm">Total Users</div></div></div>
                        <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex items-center gap-4 hover:bg-slate-700/60 transition-colors"><Briefcase size={24} className="text-teal-400" /><div><div className="text-2xl font-bold">{stats?.workspaces}</div><div className="text-slate-400 text-sm">Workspaces</div></div></div>
                        <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex items-center gap-4 hover:bg-slate-700/60 transition-colors"><CheckSquare size={24} className="text-teal-400" /><div><div className="text-2xl font-bold">{stats?.tasks}</div><div className="text-slate-400 text-sm">Total Tasks</div></div></div>
                        <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex items-center gap-4 hover:bg-slate-700/60 transition-colors"><LifeBuoy size={24} className="text-orange-400" /><div><div className="text-2xl font-bold">{helpRequests.length}</div><div className="text-slate-400 text-sm">Help Requests</div></div></div>
                    </div>

                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6 mb-8">
                        <h2 className="text-lg sm:text-xl font-bold mb-4 pb-4 border-b border-slate-700">Open Help Requests</h2>
                        <div className="overflow-x-auto">
                            {helpRequests.length > 0 ? (
                                <table className="w-full text-left min-w-[600px]">
                                    <thead><tr className="border-b border-slate-600"><th className="p-3 text-sm font-semibold text-slate-400 w-1/4">User</th><th className="p-3 text-sm font-semibold text-slate-400 w-1/4">Workspace</th><th className="p-3 text-sm font-semibold text-slate-400 w-1/2">Message</th><th className="p-3 text-sm font-semibold text-slate-400 text-right">Actions</th></tr></thead>
                                    <tbody>{helpRequests.map(req => ( <tr key={req._id} className="border-b border-slate-700/50 last:border-b-0 hover:bg-slate-700/30 transition-colors"> <td className="p-3 align-top text-sm">{req.user.name}</td> <td className="p-3 align-top text-slate-400 text-sm">{req.workspace.name}</td> <td className="p-3 align-top text-slate-300 text-sm whitespace-pre-wrap">{req.message}</td> <td className="p-3 text-right align-top"><button onClick={() => handleResolveHelpRequest(req._id)} className="text-teal-400 hover:text-teal-300 font-semibold transition-colors text-sm">Resolve</button></td></tr>))}</tbody>
                                </table>
                            ) : <p className="text-center text-slate-400 py-10">No open help requests.</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6">
                            <h2 className="text-lg sm:text-xl font-bold mb-4 pb-4 border-b border-slate-700">User Management</h2>
                            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..." className="mb-4 p-2 w-full rounded bg-slate-700/50 border border-slate-600 focus:ring-2 focus:ring-teal-500 outline-none transition"/>
                            <div className="overflow-x-auto max-h-96">
                                <table className="w-full text-left min-w-[400px]">
                                    <thead><tr className="border-b border-slate-600"><th className="p-3 text-sm font-semibold text-slate-400">Name</th><th className="p-3 text-sm font-semibold text-slate-400">Role</th><th className="p-3 text-sm font-semibold text-slate-400 text-right">Actions</th></tr></thead>
                                    <tbody>{users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())).map(user => ( <tr key={user._id} className="border-b border-slate-700/50 last:border-b-0 hover:bg-slate-700/30 transition-colors"> <td className="p-3 text-sm">{user.name}</td> <td className="p-3"><select value={user.role} onChange={(e) => handleChangeRole(user._id, e.target.value)} className="bg-slate-700 p-1 rounded border border-slate-600 text-sm"><option value="Member">Member</option><option value="Admin">Admin</option></select></td> <td className="p-3 text-right"><button onClick={() => handleDeleteUser(user._id)} className="text-red-500 hover:text-red-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors" disabled={user.role === 'Admin'}><Trash2 size={16} /></button></td></tr>))}</tbody>
                                </table>
                            </div>
                        </div>

                        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6">
                            <h2 className="text-lg sm:text-xl font-bold mb-4 pb-4 border-b border-slate-700">Workspace Management</h2>
                            <div className="overflow-x-auto max-h-[28.5rem]">
                                <table className="w-full text-left min-w-[400px]">
                                    <thead><tr className="border-b border-slate-600"><th className="p-3 text-sm font-semibold text-slate-400">Name</th><th className="p-3 text-sm font-semibold text-slate-400">Members</th><th className="p-3 text-sm font-semibold text-slate-400 text-right">Actions</th></tr></thead>
                                    <tbody>{workspaces.map(ws => ( <tr key={ws._id} className="border-b border-slate-700/50 last:border-b-0 hover:bg-slate-700/30 transition-colors"> <td className="p-3 text-sm">{ws.name}</td> <td className="p-3 text-sm">{ws.members.length}</td> <td className="p-3 text-right flex gap-3 justify-end"><button onClick={() => openModal('editWorkspace', { workspace: ws })} className="text-slate-400 hover:text-white transition-colors"><Edit3 size={16} /></button><button onClick={() => handleDeleteWorkspace(ws._id)} className="text-red-500 hover:text-red-400 transition-colors"><Trash2 size={16} /></button></td></tr>))}</tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                     <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6">
                        <h2 className="text-lg sm:text-xl font-bold mb-4 pb-4 border-b border-slate-700">All Tasks</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-[700px]">
                                <thead><tr className="border-b border-slate-600"><th className="p-3 text-sm font-semibold text-slate-400">Title</th><th className="p-3 text-sm font-semibold text-slate-400">Workspace</th><th className="p-3 text-sm font-semibold text-slate-400">Status</th><th className="p-3 text-sm font-semibold text-slate-400">Assigned To</th><th className="p-3 text-sm font-semibold text-slate-400 text-right">Actions</th></tr></thead>
                                <tbody>{tasks.map(task => ( <tr key={task._id} className="border-b border-slate-700/50 last:border-b-0 hover:bg-slate-700/30 transition-colors"> <td className="p-3 text-sm">{task.title}</td> <td className="p-3 text-slate-400 text-sm">{task.workspace?.name || 'N/A'}</td><td className="p-3 text-sm"><span className={`px-2 py-1 text-xs rounded-full font-semibold ${task.status === "Completed" ? "bg-green-500/20 text-green-300" : task.status === "In Progress" ? "bg-yellow-500/20 text-yellow-300" : "bg-slate-600/50 text-slate-300"}`}>{task.status}</span></td> <td className="p-3 text-slate-400 text-sm">{task.assignedTo?.name || 'Unassigned'}</td>
                                <td className="p-3 text-right flex gap-3 justify-end">
                                    <button onClick={() => openModal('editTask', { task })} className="text-slate-400 hover:text-white transition-colors"><Edit3 size={16} /></button>
                                    <button onClick={() => handleDeleteTask(task._id)} className="text-red-500 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                                </td>
                                </tr>))}</tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {currentUser && <BottomNav user={currentUser} />}
            </main>
        </div>
    );
};

export default AdminPage;