import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Users, Briefcase, CheckSquare, Shield, Trash2, Edit3, X, Plus, UserPlus, LayoutGrid, Bell, LogOut, Lock } from 'lucide-react';
import axios from 'axios';

// --- Reusable Modal Components ---

const ModalShell = ({ children, close }) => (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-[70] flex justify-center items-center p-4">
        <div className="bg-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-lg relative animate-fade-in-up">
            <button onClick={close} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                <X size={20} />
            </button>
            {children}
        </div>
    </div>
);

const ConfirmModal = ({ close, onConfirm, title, message }) => (
    <ModalShell close={close}>
        <h2 className="text-2xl font-bold mb-3">{title}</h2>
        <p className="text-slate-300 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
            <button
                type="button"
                onClick={close}
                className="px-5 py-2 rounded font-semibold bg-slate-600 hover:bg-slate-500 transition"
            >
                Cancel
            </button>
            <button
                onClick={onConfirm}
                className="px-5 py-2 rounded font-semibold bg-red-600 hover:bg-red-500 transition text-white"
            >
                Confirm
            </button>
        </div>
    </ModalShell>
);


// --- Team Specific Modals ---

const CreateTeamModal = ({ closeModal, handleCreate }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        handleCreate({ name, description });
    };

    return (
        <ModalShell close={closeModal}>
            <h2 className="text-2xl font-bold mb-4">Create New Team</h2>
            <form className="space-y-3" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Team Name"
                    className="w-full px-4 py-2 bg-slate-700 rounded-lg"
                    required
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    className="w-full px-4 py-2 bg-slate-700 rounded-lg"
                    rows={3}
                />
                <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={closeModal} className="px-4 py-2 bg-slate-600 rounded-lg">
                        Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 bg-teal-600 rounded-lg">
                        Create
                    </button>
                </div>
            </form>
        </ModalShell>
    );
};

const EditTeamModal = ({ closeModal, team, handleUpdate }) => {
    const [name, setName] = useState(team.name);
    const [description, setDescription] = useState(team.description || "");
    const handleSubmit = (e) => {
        e.preventDefault();
        handleUpdate(team._id, { name, description });
    };

    return (
        <ModalShell close={closeModal}>
            <h2 className="text-2xl font-bold mb-4">Edit Team</h2>
            <form className="space-y-3" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Team Name"
                    className="w-full px-4 py-2 bg-slate-700 rounded-lg"
                    required
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    className="w-full px-4 py-2 bg-slate-700 rounded-lg"
                    rows={3}
                />
                <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={closeModal} className="px-4 py-2 bg-slate-600 rounded-lg">
                        Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 bg-teal-600 rounded-lg">
                        Save
                    </button>
                </div>
            </form>
        </ModalShell>
    );
};

const ManageMembersModal = ({ closeModal, team, allUsers, handleAddMember, handleRemoveMember }) => {
    const [selectedUserId, setSelectedUserId] = useState('');
    const teamMemberIds = team.members.map(m => m._id);
    const potentialMembers = allUsers.filter(u => !teamMemberIds.includes(u._id));
    
    const handleAdd = (e) => {
        e.preventDefault();
        if (!selectedUserId) return;
        handleAddMember(team._id, selectedUserId);
        setSelectedUserId('');
    };

    return (
        <ModalShell close={closeModal}>
            <h2 className="text-2xl font-bold mb-4">Manage Members for {team.name}</h2>
            <form onSubmit={handleAdd} className="mb-4">
                <div className="flex gap-2">
                    <select
                        value={selectedUserId}
                        onChange={e => setSelectedUserId(e.target.value)}
                        className="flex-1 px-3 py-2 rounded bg-slate-700"
                    >
                        <option value="">Select a user to add...</option>
                        {potentialMembers.map(user => <option key={user._id} value={user._id}>{user.name}</option>)}
                    </select>
                    <button type="submit" className="bg-teal-600 p-2 rounded font-semibold hover:bg-teal-500 transition">
                        <UserPlus size={20} />
                    </button>
                </div>
            </form>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {team.members.map(member => (
                    <div key={member._id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                        <div>
                            <div className="font-semibold">{member.name}</div>
                            <div className="text-xs text-slate-400">{member.email}</div>
                        </div>
                        <button onClick={() => handleRemoveMember(team._id, member._id)} className="text-red-500 hover:text-red-400 p-1">
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </ModalShell>
    );
};

const ViewMembersModal = ({ closeModal, team }) => (
    <ModalShell close={closeModal}>
        <h2 className="text-2xl font-bold mb-4">Members of {team.name}</h2>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {team.members.map(member => (
                <div key={member._id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                    <div>
                        <div className="font-semibold">{member.name}</div>
                        <div className="text-xs text-slate-400">{member.email}</div>
                    </div>
                </div>
            ))}
        </div>
        <div className="flex justify-end mt-4">
            <button
                type="button"
                onClick={closeModal}
                className="px-5 py-2 rounded font-semibold bg-slate-600 hover:bg-slate-500 transition"
            >
                Close
            </button>
        </div>
    </ModalShell>
);

const EditProfileModal = ({ closeModal, user, handleUpdateProfile }) => { const [formData, setFormData] = useState({ name: user.name, email: user.email, skills: user.skills || "", portfolio: user.portfolio || "", rate: user.rate || "" }); const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value }); const handleSubmit = (e) => { e.preventDefault(); handleUpdateProfile(formData); }; return ( <ModalShell close={closeModal}><h2 className="text-2xl font-bold mb-4">Edit Profile</h2><form className="space-y-3" onSubmit={handleSubmit}>{["name","email","skills","portfolio","rate"].map((field) => ( <input key={field} type="text" name={field} value={formData[field]} onChange={handleChange} placeholder={field.charAt(0).toUpperCase() + field.slice(1)} className="w-full px-4 py-2 bg-slate-700 rounded-lg"/>))}<button type="submit" className="w-full py-2 bg-teal-600 rounded-lg hover:bg-teal-500">Update</button></form></ModalShell>);};
const ChangePasswordModal = ({ closeModal, handleChangePassword }) => { const [form, setForm] = useState({ currentPassword: "", newPassword: "" }); const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value }); const handleSubmit = (e) => { e.preventDefault(); handleChangePassword(form); }; return ( <ModalShell close={closeModal}><h2 className="text-2xl font-bold mb-4">Change Password</h2><form className="space-y-3" onSubmit={handleSubmit}><input type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange} placeholder="Current Password" className="w-full px-4 py-2 bg-slate-700 rounded-lg"/><input type="password" name="newPassword" value={form.newPassword} onChange={handleChange} placeholder="New Password" className="w-full px-4 py-2 bg-slate-700 rounded-lg"/><button type="submit" className="w-full py-2 bg-teal-600 rounded-lg hover:bg-teal-500">Update Password</button></form></ModalShell>);};
const NotificationsPanel = ({ notifications, onMarkAsRead, navigate }) => { const unreadCount = notifications.filter(n => !n.read).length; return ( <div className="absolute right-0 mt-2 w-80 bg-slate-700 rounded-lg shadow-lg py-2 z-30"><div className="px-4 py-2 font-bold text-white border-b border-slate-600">Notifications ({unreadCount})</div><div className="max-h-96 overflow-y-auto">{notifications.length > 0 ? notifications.map(notif => ( <div key={notif._id} className={`px-4 py-3 border-b border-slate-600 last:border-b-0 cursor-pointer hover:bg-slate-600 ${!notif.read ? 'bg-teal-500/10' : ''}`} onClick={() => { onMarkAsRead(notif._id); navigate(notif.link || '#'); }}><p className="text-sm text-slate-200">{notif.message}</p><p className="text-xs text-slate-400 mt-1">{new Date(notif.createdAt).toLocaleString()}</p></div>)) : <p className="text-sm text-slate-400 text-center py-4">No new notifications.</p>}</div></div>);};

const TeamsPage = () => {
    const navigate = useNavigate();
    const [teams, setTeams] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modal, setModal] = useState({ isOpen: false, type: null, props: {} });
    const [profileOpen, setProfileOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    const token = localStorage.getItem("token");
    const API_BASE_URL = "http://localhost:9000/api";
    const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

    const fetchTeams = useCallback(async () => {
        try {
            const teamsRes = await axios.get(`${API_BASE_URL}/teams`, { headers: { Authorization: `Bearer ${token}` } });
            setTeams(teamsRes.data);
        } catch (err) {
            setError("Failed to load teams.");
        }
    }, [token]);

    useEffect(() => {
        if (!token) { navigate("/"); return; }
        const fetchInitialData = async () => {
            try {
                const userRes = await axios.get(`${API_BASE_URL}/users/me`, { headers: { Authorization: `Bearer ${token}` } });
                setCurrentUser(userRes.data);

                const promises = [
                    axios.get(`${API_BASE_URL}/teams`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${API_BASE_URL}/notifications`, { headers: { Authorization: `Bearer ${token}` } })
                ];

                if (userRes.data.role === 'Admin') {
                    promises.push(axios.get(`${API_BASE_URL}/admin/users`, { headers: { Authorization: `Bearer ${token}` } }));
                }

                const [teamsRes, notificationsRes, allUsersRes] = await Promise.all(promises);
                
                setTeams(teamsRes.data);
                setNotifications(notificationsRes.data);
                if (allUsersRes) {
                    setAllUsers(allUsersRes.data);
                }

            } catch (err) {
                setError("Failed to load data.");
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, [token, navigate]);
    
    const handleLogout = () => { localStorage.removeItem("token"); navigate("/"); };
    const openModal = (type, props) => setModal({ isOpen: true, type, props });
    const closeModal = () => setModal({ isOpen: false, type: null, props: {} });
    
    const handleCreateTeam = async (data) => { try { await axios.post(`${API_BASE_URL}/teams`, data, { headers: { Authorization: `Bearer ${token}` } }); await fetchTeams(); closeModal(); } catch { alert("Failed to create team."); }};
    const handleUpdateTeam = async (id, data) => { try { await axios.put(`${API_BASE_URL}/teams/${id}`, data, { headers: { Authorization: `Bearer ${token}` } }); await fetchTeams(); closeModal(); } catch { alert("Failed to update team."); }};
    const handleDeleteTeam = (id) => { openModal('confirm', { title: "Delete Team?", message: "Are you sure? This action cannot be undone.", onConfirm: async () => { try { await axios.delete(`${API_BASE_URL}/teams/${id}`, { headers: { Authorization: `Bearer ${token}` } }); await fetchTeams(); closeModal(); } catch { alert("Failed to delete team."); } } }); };
    const handleAddMember = async (teamId, userId) => { try { await axios.post(`${API_BASE_URL}/teams/${teamId}/members`, { userId }, { headers: { Authorization: `Bearer ${token}` } }); await fetchTeams(); const updatedTeam = await axios.get(`${API_BASE_URL}/teams/${teamId}`, { headers: { Authorization: `Bearer ${token}` } }); setModal({ isOpen: true, type: 'manageMembers', props: { team: updatedTeam.data } }); } catch { alert("Failed to add member."); }};
    const handleRemoveMember = (teamId, userId) => { openModal('confirm', { title: "Remove Member?", message: "Are you sure you want to remove this member from the team?", onConfirm: async () => { try { await axios.delete(`${API_BASE_URL}/teams/${teamId}/members/${userId}`, { headers: { Authorization: `Bearer ${token}` } }); await fetchTeams(); closeModal(); } catch { alert("Failed to remove member."); } } }); };
    const handleMarkAsRead = async (id) => { try { await axios.put(`${API_BASE_URL}/notifications/${id}/read`, {}, { headers: { Authorization: `Bearer ${token}` } }); setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n)); } catch (err) { console.error("Failed to mark as read"); }};
    const handleUpdateProfile = async (formData) => { try { const res = await axios.put(`${API_BASE_URL}/users/me`, formData, { headers: { Authorization: `Bearer ${token}` } }); setCurrentUser(res.data); closeModal(); } catch { alert("Error updating profile."); }};
    const handleChangePassword = async (form) => { try { await axios.put(`${API_BASE_URL}/users/me/password`, form, { headers: { Authorization: `Bearer ${token}` } }); closeModal(); } catch { alert("Error updating password."); }};

    if (loading) return <div className="min-h-screen flex justify-center items-center bg-slate-900"><Loader2 size={40} className="animate-spin text-teal-500" /></div>;
    if (error) return <div className="min-h-screen flex flex-col justify-center items-center bg-slate-900 text-white"><h2 className="text-2xl text-red-500">{error}</h2><Link to="/dashboard" className="mt-4 text-teal-400 hover:underline">Return to Dashboard</Link></div>;

    return (
        <div className="font-sans min-h-screen bg-slate-900 text-white flex">
            {modal.isOpen && modal.type === 'confirm' && <ConfirmModal close={closeModal} {...modal.props} />}
            {modal.isOpen && modal.type === 'createTeam' && <CreateTeamModal closeModal={closeModal} handleCreate={handleCreateTeam} />}
            {modal.isOpen && modal.type === 'editTeam' && <EditTeamModal closeModal={closeModal} team={modal.props.team} handleUpdate={handleUpdateTeam} />}
            {modal.isOpen && modal.type === 'manageMembers' && <ManageMembersModal closeModal={closeModal} team={modal.props.team} allUsers={allUsers} handleAddMember={handleAddMember} handleRemoveMember={handleRemoveMember} />}
            {modal.isOpen && modal.type === 'viewMembers' && <ViewMembersModal closeModal={closeModal} team={modal.props.team} />}
            {modal.isOpen && modal.type === "editProfile" && <EditProfileModal closeModal={closeModal} user={currentUser} handleUpdateProfile={handleUpdateProfile} />}
            {modal.isOpen && modal.type === "changePassword" && <ChangePasswordModal closeModal={closeModal} handleChangePassword={handleChangePassword} />}
            
            <aside className="w-64 bg-slate-800 p-6 flex-col border-r border-slate-700 hidden md:flex">
                <h1 className="text-2xl font-bold mb-10">SyncSpace</h1>
                <nav className="flex flex-col space-y-2">
          <Link to={`/Dashboard/${currentUser._id}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 text-slate-300"><LayoutGrid size={20}/> Dashboard</Link>
          <Link to={`/Tasks/${currentUser._id}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 text-slate-300"><CheckSquare size={20}/> My Tasks</Link>
         
            <button className="flex items-center gap-3 p-3 rounded-lg bg-teal-500/20 font-semibold text-white">
                        <Users size={18} /> Teams
                    </button>
                     {currentUser.role === 'Admin' && (
              <Link to={`/Admin/${currentUser._id}`}className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 text-slate-300"><Shield size={20}/> Admin Panel</Link>
          )}
         </nav>
            </aside>
            
            <main className="flex-1 flex flex-col">
                 <header className="bg-slate-800/50 shadow-md flex items-center justify-between px-8 py-4">
                    <h1 className="text-2xl font-bold">Teams</h1>
                    <div className="flex items-center gap-4">
                        
                        <div className="relative">
                        <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center font-bold">{currentUser?.name?.charAt(0)}</div>
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

                <div className="p-8 overflow-y-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold"></h1>
                        {currentUser?.role === 'Admin' && (
                            <button
                                onClick={() => openModal('createTeam')}
                                className="bg-teal-600 px-4 py-2 rounded-lg flex items-center gap-2 font-semibold hover:bg-teal-500 transition text-sm"
                            >
                                <Plus size={16}/> New Team
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {teams.map(team => (
                            <div key={team._id} className="bg-slate-800 p-6 rounded-xl shadow-lg flex flex-col">
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-white">{team.name}</h2>
                                    <p className="text-slate-400 text-sm mt-2 min-h-[40px]">{team.description || "No description provided."}</p>
                                    <div className="flex items-center gap-2 mt-4 text-sm text-teal-400">
                                        <Users size={16}/>
                                        <span>{team.members.length} Members</span>
                                    </div>
                                </div>
                                
                                <div className="border-t border-slate-700 mt-4 pt-4 flex gap-2">
                                    {currentUser?.role === 'Admin' ? (
                                        <>
                                            <button
                                                onClick={() => openModal('manageMembers', {team})}
                                                className="flex-1 text-sm py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
                                            >
                                                Manage Members
                                            </button>
                                            <button
                                                onClick={() => openModal('editTeam', {team})}
                                                className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
                                            >
                                                <Edit3 size={16}/>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTeam(team._id)}
                                                className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition"
                                            >
                                                <Trash2 size={16}/>
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => openModal('viewMembers', {team})}
                                            className="flex-1 text-sm py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
                                        >
                                            View Members
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TeamsPage;

