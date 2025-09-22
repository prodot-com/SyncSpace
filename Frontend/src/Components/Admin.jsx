import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Users, Briefcase, CheckSquare, Shield, Trash2 } from 'lucide-react';
import axios from 'axios';

// --- Reusable Modal Component ---
const ConfirmModal = ({ close, onConfirm, title, message }) => (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-[70] flex justify-center items-center p-4">
        <div className="bg-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-md relative animate-fade-in-up">
            <h2 className="text-2xl font-bold mb-3">{title}</h2>
            <p className="text-slate-300 mb-6">{message}</p>
            <div className="flex gap-3 justify-end">
                <button type="button" onClick={close} className="px-5 py-2 rounded font-semibold bg-slate-600 hover:bg-slate-500 transition">Cancel</button>
                <button onClick={onConfirm} className="px-5 py-2 rounded font-semibold bg-red-600 hover:bg-red-500 transition text-white">Confirm</button>
            </div>
        </div>
    </div>
);

const AdminPage = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [workspaces, setWorkspaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modal, setModal] = useState({ isOpen: false, type: null, props: {} });

    const token = localStorage.getItem("token");
    const API_BASE_URL = "http://localhost:9000/api/admin";

    useEffect(() => {
        if (!token) {
            navigate("/");
            return;
        }

        const fetchAdminData = async () => {
            try {
                const [statsRes, usersRes, wsRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/stats`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${API_BASE_URL}/users`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${API_BASE_URL}/workspaces`, { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setStats(statsRes.data);
                setUsers(usersRes.data);
                setWorkspaces(wsRes.data);
            } catch (err) {
                if (err.response?.status === 403) {
                    setError("You do not have permission to view this page.");
                } else {
                    setError("Failed to load admin data.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, [token, navigate]);

    const openConfirmModal = (type, props) => setModal({ isOpen: true, type, props });
    const closeModal = () => setModal({ isOpen: false, type: null, props: {} });

    const handleDeleteUser = async (id) => {
        openConfirmModal('deleteUser', {
            title: "Delete User?",
            message: "Are you sure you want to permanently delete this user? This action cannot be undone.",
            onConfirm: async () => {
                try {
                    await axios.delete(`${API_BASE_URL}/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                    setUsers(prev => prev.filter(user => user._id !== id));
                    closeModal();
                } catch (err) { alert("Failed to delete user"); }
            }
        });
    };

    const handleDeleteWorkspace = async (id) => {
         openConfirmModal('deleteWorkspace', {
            title: "Delete Workspace?",
            message: "This will permanently delete the workspace and all its associated data. Are you sure?",
            onConfirm: async () => {
                try {
                    await axios.delete(`${API_BASE_URL}/workspaces/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                    setWorkspaces(prev => prev.filter(ws => ws._id !== id));
                    closeModal();
                } catch (err) { alert("Failed to delete workspace"); }
            }
        });
    };

    if (loading) return <div className="min-h-screen flex justify-center items-center bg-slate-900 text-white"><Loader2 size={40} className="animate-spin text-teal-500" /></div>;
    if (error) return <div className="min-h-screen flex flex-col justify-center items-center bg-slate-900 text-white"><h2 className="text-2xl text-red-500">{error}</h2><Link to="/dashboard" className="mt-4 text-teal-400 hover:underline">Return to Dashboard</Link></div>;
    
    return (
        <div className="font-sans min-h-screen bg-slate-900 text-white flex">
            {modal.isOpen && <ConfirmModal close={closeModal} {...modal.props} />}
            <aside className="w-64 bg-slate-800 p-6 flex-col border-r border-slate-700 hidden md:flex">
                <h1 className="text-2xl font-bold mb-10">SyncSpace</h1>
                <nav className="flex flex-col space-y-2">
                    <Link to="/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors text-slate-300">
                        <Briefcase size={18} /> Dashboard
                    </Link>
                    <button className="flex items-center gap-3 p-3 rounded-lg bg-teal-500/20 font-semibold text-white">
                        <Shield size={18} /> Admin Panel
                    </button>
                </nav>
            </aside>
            
            <main className="flex-1 p-8 overflow-y-auto">
                <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-slate-800 p-6 rounded-xl flex items-center gap-4"><Users size={32} className="text-teal-400" /><div><div className="text-3xl font-bold">{stats?.users}</div><div className="text-slate-400">Total Users</div></div></div>
                    <div className="bg-slate-800 p-6 rounded-xl flex items-center gap-4"><Briefcase size={32} className="text-teal-400" /><div><div className="text-3xl font-bold">{stats?.workspaces}</div><div className="text-slate-400">Total Workspaces</div></div></div>
                    <div className="bg-slate-800 p-6 rounded-xl flex items-center gap-4"><CheckSquare size={32} className="text-teal-400" /><div><div className="text-3xl font-bold">{stats?.tasks}</div><div className="text-slate-400">Total Tasks</div></div></div>
                </div>

                <div className="space-y-8">
                    <div className="bg-slate-800 rounded-xl p-6">
                        <h2 className="text-2xl font-bold mb-4">User Management</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead><tr className="border-b border-slate-700"><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Role</th><th className="p-3 text-right">Actions</th></tr></thead>
                                <tbody>{users.map(user => (<tr key={user._id} className="border-b border-slate-700 last:border-b-0 hover:bg-slate-700/50"> <td className="p-3">{user.name}</td> <td className="p-3 text-slate-400">{user.email}</td> <td className="p-3"><span className={`px-2 py-1 text-xs rounded-full ${user.role === 'Admin' ? 'bg-teal-500/30 text-teal-300' : 'bg-slate-600'}`}>{user.role}</span></td> <td className="p-3 text-right"><button onClick={() => handleDeleteUser(user._id)} className="text-red-500 hover:text-red-400 disabled:opacity-50" disabled={user.role === 'Admin'}><Trash2 size={18} /></button></td></tr>))}</tbody>
                            </table>
                        </div>
                    </div>
                    <div className="bg-slate-800 rounded-xl p-6">
                        <h2 className="text-2xl font-bold mb-4">Workspace Management</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead><tr className="border-b border-slate-700"><th className="p-3">Name</th><th className="p-3">Created By</th><th className="p-3">Members</th><th className="p-3 text-right">Actions</th></tr></thead>
                                <tbody>{workspaces.map(ws => ( <tr key={ws._id} className="border-b border-slate-700 last:border-b-0 hover:bg-slate-700/50"> <td className="p-3">{ws.name}</td> <td className="p-3 text-slate-400">{ws.createdBy?.name || 'N/A'}</td> <td className="p-3">{ws.members.length}</td> <td className="p-3 text-right"><button onClick={() => handleDeleteWorkspace(ws._id)} className="text-red-500 hover:text-red-400"><Trash2 size={18} /></button></td></tr>))}</tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminPage;

