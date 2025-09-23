import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Users, Briefcase, CheckSquare, Shield, Trash2, Edit3, X, LifeBuoy } from 'lucide-react';
import axios from 'axios';

// --- Reusable Modal Components ---
const ModalShell = ({ children, close }) => ( <div className="fixed inset-0 bg-black bg-opacity-70 z-[70] flex justify-center items-center p-4"><div className="bg-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-md relative animate-fade-in-up"><button onClick={close} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={20} /></button>{children}</div></div>);
const ConfirmModal = ({ close, onConfirm, title, message }) => ( <ModalShell close={close}><h2 className="text-2xl font-bold mb-3">{title}</h2><p className="text-slate-300 mb-6">{message}</p><div className="flex gap-3 justify-end"><button type="button" onClick={close} className="px-5 py-2 rounded font-semibold bg-slate-600 hover:bg-slate-500 transition">Cancel</button><button onClick={onConfirm} className="px-5 py-2 rounded font-semibold bg-red-600 hover:bg-red-500 transition text-white">Confirm</button></div></ModalShell>);

// --- Edit Workspace Modal ---
const EditWorkspaceModal = ({ closeModal, workspace, handleUpdate }) => {
    const [name, setName] = useState(workspace.name);
    const [description, setDescription] = useState(workspace.description || "");
    const handleSubmit = (e) => { e.preventDefault(); handleUpdate(workspace._id, { name, description }); };
    return ( <ModalShell close={closeModal}><h2 className="text-2xl font-bold mb-4">Edit Workspace</h2><form className="space-y-3" onSubmit={handleSubmit}><input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Workspace Name" className="w-full px-4 py-2 bg-slate-700 rounded-lg" required /><textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full px-4 py-2 bg-slate-700 rounded-lg" rows={3} /><div className="flex justify-end gap-2 pt-2"><button type="button" onClick={closeModal} className="px-4 py-2 bg-slate-600 rounded-lg">Cancel</button><button type="submit" className="px-4 py-2 bg-teal-600 rounded-lg">Save</button></div></form></ModalShell>);
};

const AdminPage = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [workspaces, setWorkspaces] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [helpRequests, setHelpRequests] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modal, setModal] = useState({ isOpen: false, type: null, props: {} });
    const [search, setSearch] = useState("");

    const token = localStorage.getItem("token");
    const API_BASE_URL = "http://localhost:9000/api";

    useEffect(() => {
        if (!token) { navigate("/"); return; }
        const fetchAdminData = async () => {
            try {
                const [statsRes, usersRes, wsRes, tasksRes, helpRes, currentUserRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${API_BASE_URL}/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${API_BASE_URL}/admin/workspaces`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${API_BASE_URL}/admin/tasks`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${API_BASE_URL}/admin/help-requests`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${API_BASE_URL}/users/me`, { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setStats(statsRes.data);
                setUsers(usersRes.data);
                setWorkspaces(wsRes.data);
                setTasks(tasksRes.data);
                setHelpRequests(helpRes.data);
                setCurrentUser(currentUserRes.data);
            } catch (err) {
                setError(err.response?.status === 403 ? "You do not have permission to view this page." : "Failed to load admin data.");
            } finally {
                setLoading(false);
            }
        };
        fetchAdminData();
    }, [token, navigate]);

    const openModal = (type, props) => setModal({ isOpen: true, type, props });
    const closeModal = () => setModal({ isOpen: false, type: null, props: {} });

    const handleDeleteUser = (id) => openModal('confirm', { title: "Delete User?", message: "Are you sure? This action is irreversible.", onConfirm: async () => { try { await axios.delete(`${API_BASE_URL}/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } }); setUsers(prev => prev.filter(u => u._id !== id)); closeModal(); } catch (err) { alert("Failed to delete user"); } } });
    const handleDeleteWorkspace = (id) => openModal('confirm', { title: "Delete Workspace?", message: "This will delete all associated data. Are you sure?", onConfirm: async () => { try { await axios.delete(`${API_BASE_URL}/admin/workspaces/${id}`, { headers: { Authorization: `Bearer ${token}` } }); setWorkspaces(prev => prev.filter(w => w._id !== id)); closeModal(); } catch (err) { alert("Failed to delete workspace"); } } });
    const handleDeleteTask = (id) => openModal('confirm', { title: "Delete Task?", message: "Are you sure you want to delete this task?", onConfirm: async () => { try { await axios.delete(`${API_BASE_URL}/admin/tasks/${id}`, { headers: { Authorization: `Bearer ${token}` } }); setTasks(prev => prev.filter(t => t._id !== id)); closeModal(); } catch (err) { alert("Failed to delete task"); } } });
    const handleUpdateWorkspace = async (id, data) => { try { const res = await axios.put(`${API_BASE_URL}/admin/workspaces/${id}`, data, { headers: { Authorization: `Bearer ${token}` } }); setWorkspaces(prev => prev.map(w => w._id === id ? res.data : w)); closeModal(); } catch (err) { alert("Failed to update workspace"); } };
    const handleChangeRole = async (id, newRole) => { try { const res = await axios.put(`${API_BASE_URL}/admin/users/${id}/role`, { role: newRole }, { headers: { Authorization: `Bearer ${token}` } }); setUsers(prev => prev.map(u => (u._id === id ? res.data : u))); } catch (err) { alert("Failed to update role"); } };
    const handleResolveHelpRequest = (id) => { openModal('confirm', { title: "Resolve Request?", message: "Mark this help request as resolved?", onConfirm: async () => { try { await axios.delete(`${API_BASE_URL}/admin/help-requests/${id}`, { headers: { Authorization: `Bearer ${token}` } }); setHelpRequests(prev => prev.filter(req => req._id !== id)); closeModal(); } catch (err) { alert("Failed to resolve help request."); } } }); };

    if (loading) return <div className="min-h-screen flex justify-center items-center bg-slate-900 text-white"><Loader2 size={40} className="animate-spin text-teal-500" /></div>;
    if (error) return <div className="min-h-screen flex flex-col justify-center items-center bg-slate-900 text-white"><h2 className="text-2xl text-red-500">{error}</h2><Link to="/dashboard" className="mt-4 text-teal-400 hover:underline">Return to Dashboard</Link></div>;
    
    return (
        <div className="font-sans min-h-screen bg-slate-900 text-white flex">
            {modal.isOpen && modal.type === 'confirm' && <ConfirmModal close={closeModal} {...modal.props} />}
            {modal.isOpen && modal.type === 'editWorkspace' && <EditWorkspaceModal closeModal={closeModal} workspace={modal.props.workspace} handleUpdate={handleUpdateWorkspace} />}
            <aside className="w-64 bg-slate-800 p-6 flex-col border-r border-slate-700 hidden md:flex">
                <h1 className="text-2xl font-bold mb-10">SyncSpace</h1>
                <nav className="flex flex-col space-y-2">
                    <Link to={currentUser ? `/Dashboard/${currentUser._id}` : '/dashboard'} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors text-slate-300"><Briefcase size={18} /> Dashboard</Link>
                    <button className="flex items-center gap-3 p-3 rounded-lg bg-teal-500/20 font-semibold text-white"><Shield size={18} /> Admin Panel</button>
                </nav>
            </aside>
            
            <main className="flex-1 p-8 overflow-y-auto">
                <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
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
                <div className="bg-slate-800 rounded-xl p-6 mt-8">
                     <h2 className="text-2xl font-bold mb-4">All Tasks</h2>
                     <div className="overflow-auto max-h-96">
                         <table className="w-full text-left">
                             <thead><tr className="border-b border-slate-700"><th className="p-3">Title</th><th className="p-3">Workspace</th><th className="p-3">Status</th><th className="p-3">Assigned To</th><th className="p-3 text-right">Actions</th></tr></thead>
                             <tbody>{tasks.map(task => ( <tr key={task._id} className="border-b border-slate-700 last:border-b-0 hover:bg-slate-700/50"> <td className="p-3">{task.title}</td> <td className="p-3 text-slate-400">{task.workspace?.name || 'N/A'}</td><td className="p-3"><span className={`px-2 py-1 text-xs rounded-full ${task.status === "Completed" ? "bg-green-600/50" : task.status === "In Progress" ? "bg-yellow-600/50" : "bg-slate-600"}`}>{task.status}</span></td> <td className="p-3 text-slate-400">{task.assignedTo?.name || 'Unassigned'}</td><td className="p-3 text-right"><button onClick={() => handleDeleteTask(task._id)} className="text-red-500 hover:text-red-400"><Trash2 size={18} /></button></td></tr>))}</tbody>
                         </table>
                     </div>
                </div>
            </main>
        </div>
    );
};

export default AdminPage;

