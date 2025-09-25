import React, { useState, useEffect, useCallback, Fragment } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove, // Correctly imported
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Loader2, CheckSquare, LayoutGrid, X, Send, Users, Shield, Plus, MessageSquare, Tag, GripVertical
} from "lucide-react";
import axios from "axios";

// --- REUSABLE UI COMPONENTS (No Changes) ---
const API_BASE_URL = "http://localhost:9000/api";

const Modal = ({ children, close, size = '2xl' }) => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex justify-center items-center p-4 font-sans animate-fade-in">
        <div className={`bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl shadow-black/50 p-6 w-full max-w-${size} relative animate-slide-up`}>
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

const FormSelect = ({ label, children, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <select {...props} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition appearance-none">
            {children}
        </select>
    </div>
);

const PrimaryButton = ({ children, isLoading, ...props }) => (
    <button {...props} disabled={isLoading} className="w-full flex justify-center items-center py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-500 disabled:bg-teal-800 disabled:cursor-not-allowed transition-all shadow-lg shadow-teal-900/50">
        {isLoading ? <Loader2 className="animate-spin" /> : children}
    </button>
);

// --- TASK-SPECIFIC COMPONENTS (No Changes) ---

const TaskCard = ({ task, onOpenDetails }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id });
    const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : "auto", opacity: isDragging ? 0.5 : 1 };
    
    return (
        <div ref={setNodeRef} style={style} className="bg-slate-700 p-3 rounded-lg mb-3 cursor-pointer border border-slate-600 hover:border-teal-500/50 hover:bg-slate-600/50 transition-all group" onClick={() => onOpenDetails(task)}>
            <div className="flex justify-between items-start">
                <p className="font-semibold text-white flex-1 pr-2">{task.title}</p>
                <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 text-slate-500 group-hover:text-slate-300">
                    <GripVertical size={16}/>
                </div>
            </div>
            <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                    <Tag size={12} />
                    <span>{task.workspace.name}</span>
                </div>
                {task.assignedTo && (
                    <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center font-bold text-xs" title={task.assignedTo.name}>
                        {task.assignedTo.name.charAt(0)}
                    </div>
                )}
            </div>
        </div>
    );
};

const TaskDetailsModal = ({ close, task, onUpdateStatus, comments, onAddComment, loadingComments }) => {
    const [newComment, setNewComment] = useState("");
    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        onAddComment(task._id, newComment);
        setNewComment("");
    };

    return (
        <Modal close={close}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">{task.title}</h2>
                    <p className="text-sm text-slate-400">in workspace: <span className="font-semibold text-teal-400">{task.workspace.name}</span></p>
                </div>
                <FormSelect value={task.status} onChange={(e) => onUpdateStatus(task, e.target.value)} className="w-auto !py-1">
                    <option>To Do</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                </FormSelect>
            </div>
            <p className="text-slate-300 mb-6">{task.description || "No description provided."}</p>
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2"><MessageSquare size={18} /> Comments</h3>
            <div className="space-y-4 max-h-64 overflow-y-auto bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                {loadingComments ? <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div> :
                    comments.length > 0 ? comments.map(comment => (
                        <div key={comment._id} className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center font-bold flex-shrink-0 text-sm" title={comment.user.name}>{comment.user.name.charAt(0)}</div>
                            <div className="flex-1 bg-slate-700/50 rounded-lg rounded-tl-none px-4 py-2">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold text-sm text-white">{comment.user.name}</p>
                                    <p className="text-xs text-slate-400">{new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                                <p className="text-slate-300 mt-1 text-sm">{comment.content}</p>
                            </div>
                        </div>
                    )) : <p className="text-center text-slate-400 text-sm py-4">No comments yet. Be the first to say something!</p>
                }
            </div>
            <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 mt-4">
                <input value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Add a comment..." className="flex-1 px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                <button type="submit" className="bg-teal-600 p-2.5 rounded-lg font-semibold hover:bg-teal-500 transition-transform hover:scale-105"><Send size={18} /></button>
            </form>
        </Modal>
    );
};

const NewTaskModal = ({ close, workspaces, onCreate, isLoading }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [workspaceId, setWorkspaceId] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !workspaceId) return alert("Title and workspace are required");
        onCreate({ title, description, workspace: workspaceId });
    };

    return (
        <Modal close={close} size="md">
            <h2 className="text-2xl font-bold mb-4 text-center">Create New Task</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <FormInput label="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What needs to be done?" required/>
                <FormTextarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add more details..."/>
                <FormSelect label="Workspace" value={workspaceId} onChange={(e) => setWorkspaceId(e.target.value)} required>
                    <option value="">Select Workspace</option>
                    {workspaces.map(ws => <option key={ws._id} value={ws._id}>{ws.name}</option>)}
                </FormSelect>
                <PrimaryButton type="submit" isLoading={isLoading}>Create Task</PrimaryButton>
            </form>
        </Modal>
    );
};

// --- MAIN PAGE COMPONENT ---
const TasksPage = () => {
    const navigate = useNavigate();
    const { id: userId } = useParams();
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [columns, setColumns] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState({ type: null, props: {}, isLoading: false });
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [workspaces, setWorkspaces] = useState([]);

    const token = localStorage.getItem("token");
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

    const fetchAllData = useCallback(async () => {
        try {
            setLoading(true);
            const userRes = await axios.get(`${API_BASE_URL}/users/me`, { headers: { Authorization: `Bearer ${token}` } });
            setUser(userRes.data);
            
            const wsRes = await axios.get(`${API_BASE_URL}/workspaces`, { headers: { Authorization: `Bearer ${token}` } });
            setWorkspaces(wsRes.data);

            const taskPromises = wsRes.data.map(ws => axios.get(`${API_BASE_URL}/tasks/${ws._id}`, { headers: { Authorization: `Bearer ${token}` } }));
            const taskResults = await Promise.all(taskPromises);
            
            const allTasks = taskResults.flatMap(res => res.data);
            const myTasks = allTasks
                .filter(task => task.assignedTo && String(task.assignedTo._id) === String(userId))
                .map(task => {
                    const ws = wsRes.data.find(w => w._id === task.workspace);
                    return ws ? { ...task, workspace: { _id: ws._id, name: ws.name } } : task;
                });

            setTasks(myTasks);
        } catch (err) {
            console.error("Failed to fetch data", err);
            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/");
            }
        } finally {
            setLoading(false);
        }
    }, [token, userId, navigate]);
    
    useEffect(() => {
        if (!token) { navigate("/"); return; }
        fetchAllData();
    }, [token, navigate, fetchAllData]);

    useEffect(() => {
        setColumns({
            "To Do": { name: "To Do", items: tasks.filter(t => t.status === "To Do") },
            "In Progress": { name: "In Progress", items: tasks.filter(t => t.status === "In Progress") },
            "Completed": { name: "Completed", items: tasks.filter(t => t.status === "Completed") },
        });
    }, [tasks]);

    const handleUpdateStatus = async (task, newStatus) => {
        const originalTasks = [...tasks];
        setTasks(prev => prev.map(t => t._id === task._id ? { ...t, status: newStatus } : t));
        try {
            await axios.put(`${API_BASE_URL}/tasks/${task._id}`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
        } catch {
            alert("Failed to update status");
            setTasks(originalTasks);
        }
    };

    const openTaskDetails = async (task) => {
        setModal({ type: "taskDetails", props: { task }, isLoading: false });
        setLoadingComments(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/comments/${task._id}`, { headers: { Authorization: `Bearer ${token}` } });
            setComments(res.data);
        } catch (err) {
            console.error("Failed to fetch comments", err);
        } finally {
            setLoadingComments(false);
        }
    };

    const addComment = async (taskId, content) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/comments/${taskId}`, { content }, { headers: { Authorization: `Bearer ${token}` } });
            setComments(prev => [...prev, res.data]);
        } catch {
            alert("Failed to add comment.");
        }
    };

    const createTask = async (taskData) => {
        setModal(prev => ({ ...prev, isLoading: true }));
        try {
            const res = await axios.post(`${API_BASE_URL}/tasks`, { ...taskData, assignedTo: user._id }, { headers: { Authorization: `Bearer ${token}` } });
            const newTask = res.data;
            const ws = workspaces.find(w => w._id === newTask.workspace);
            if (ws) newTask.workspace = { _id: ws._id, name: ws.name };
            setTasks(prev => [...prev, newTask]);
            closeModal();
        } catch (err) {
            console.error("Failed to create task:", err);
            alert("Failed to create task.");
        } finally {
             setModal(prev => ({ ...prev, isLoading: false }));
        }
    };

    const findContainer = (id) => {
        if (columns && columns[id]) return id;
        return columns ? Object.keys(columns).find(key => columns[key].items.find(item => item._id === id)) : null;
    };

    // --- REPLACED HANDLE DRAG END FUNCTION ---
    const handleDragEnd = ({ active, over }) => {
        if (!over) return;
        if (active.id === over.id) return;

        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(over.id) || over.id;

        if (!activeContainer || !overContainer) return;

        // Scenario 1: Reordering within the same column
        if (activeContainer === overContainer) {
          setTasks(prevTasks => {
            const activeColumnItems = columns[activeContainer].items;
            const oldIndex = activeColumnItems.findIndex(item => item._id === active.id);
            const newIndex = activeColumnItems.findIndex(item => item._id === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
              const reorderedItems = arrayMove(activeColumnItems, oldIndex, newIndex);
              
              const newTasks = Object.values(columns)
                .map(col => col.name === activeContainer ? reorderedItems : col.items)
                .flat();

              return newTasks;
            }
            return prevTasks;
          });
          return;
        }

        // Scenario 2: Moving to a different column
        const task = tasks.find(t => t._id === active.id);
        if (task) {
          handleUpdateStatus(task, overContainer);
        }
    };

    const closeModal = () => setModal({ type: null, props: {}, isLoading: false });

    if (loading || !user) {
        return <div className="min-h-screen w-full flex justify-center items-center bg-slate-900"><Loader2 size={40} className="animate-spin text-teal-500" /></div>;
    }
    
    return (
        <div className="font-sans min-h-screen bg-slate-900 text-white flex">
            {modal.type === "taskDetails" && <TaskDetailsModal close={closeModal} task={modal.props.task} onUpdateStatus={handleUpdateStatus} comments={comments} onAddComment={addComment} loadingComments={loadingComments} />}
            {modal.type === "newTask" && <NewTaskModal close={closeModal} workspaces={workspaces} onCreate={createTask} isLoading={modal.isLoading} />}

            <aside className="w-64 bg-slate-800 p-6 hidden md:flex flex-col border-r border-slate-700">
                <h1 className="text-2xl font-bold mb-10">SyncSpace</h1>
                <nav className="flex flex-col space-y-2 flex-grow">
                    <Link to={`/Dashboard/${user._id}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/50 text-slate-300 transition-colors"><LayoutGrid size={20} /> Dashboard</Link>
                    <Link to={`/Tasks/${user._id}`} className="flex items-center gap-3 p-3 rounded-lg bg-teal-500/20 text-white font-semibold"><CheckSquare size={20} /> My Tasks</Link>
                    <Link to={`/Team/${user._id}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/50 text-slate-300 transition-colors"><Users size={20} /> Teams</Link>
                    {user.role === 'Admin' && <Link to={`/Admin/${user._id}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/50 text-slate-300 transition-colors"><Shield size={20} /> Admin Panel</Link>}
                </nav>
            </aside>

            <main className="flex-1 flex flex-col h-screen">
                <header className="bg-slate-800/50 backdrop-blur-md shadow-md px-8 py-4 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
                    <div>
                        <h1 className="text-2xl font-bold">My Tasks</h1>
                        <p className="text-slate-400">Tasks assigned to you across all workspaces.</p>
                    </div>
                    <button onClick={() => setModal({ type: "newTask" })} className="flex items-center gap-2 bg-teal-600 px-4 py-2 rounded-lg font-semibold hover:bg-teal-500 transition-transform hover:scale-105">
                        <Plus size={18} /> New Task
                    </button>
                </header>

                <div className="flex-1 p-8 overflow-x-auto overflow-y-hidden">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <div className="flex gap-6 h-full">
                            {columns && Object.entries(columns).map(([colId, col]) => (
                                <div key={colId} className="w-80 lg:w-96 flex-shrink-0 bg-slate-800/70 rounded-xl flex flex-col h-full border border-slate-700">
                                    <h3 className="font-semibold text-lg px-4 pt-4 pb-2 flex items-center gap-2 border-b border-slate-700">
                                        {col.name}
                                        <span className="text-sm bg-slate-700 text-slate-300 rounded-full px-2 py-0.5">{col.items.length}</span>
                                    </h3>
                                    <SortableContext items={col.items.map(i => i._id)} strategy={verticalListSortingStrategy}>
                                        <div className="flex-1 overflow-y-auto p-4">
                                            {col.items.length > 0 ?
                                                col.items.map(item => <TaskCard key={item._id} task={item} onOpenDetails={openTaskDetails} />)
                                                : <div className="text-center text-slate-500 pt-10">No tasks here!</div>
                                            }
                                        </div>
                                    </SortableContext>
                                </div>
                            ))}
                        </div>
                    </DndContext>
                </div>
            </main>
        </div>
    );
};

export default TasksPage;