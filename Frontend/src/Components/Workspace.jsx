import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { DndContext, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
    Plus, X, Loader2, MessageSquare, CheckSquare, FileText, 
    Users, Settings, ArrowLeft
} from 'lucide-react';
import axios from 'axios';

// --- Reusable Modals for Tasks ---
const CreateTaskModal = ({ closeModal, handleCreateTask, workspaceId }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('To Do');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return alert('Task title is required.');
        handleCreateTask({ title, description, status, workspace: workspaceId });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex justify-center items-center p-4">
            <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-lg relative animate-fade-in-up">
                <button onClick={closeModal} className="absolute top-4 right-4 text-slate-400 hover:text-white transition"><X size={24} /></button>
                <h2 className="text-3xl font-bold text-center text-white mb-4">Create New Task</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:ring-teal-500 focus:border-teal-500 transition" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:ring-teal-500 focus:border-teal-500 transition" rows="4" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:ring-teal-500 focus:border-teal-500 transition appearance-none">
                            <option>To Do</option>
                            <option>In Progress</option>
                            <option>Completed</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full py-3 mt-4 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-500 transition">Create Task</button>
                </form>
            </div>
        </div>
    );
};

// --- Draggable Task Card Component (for Dnd Kit) ---
const TaskCard = ({ task }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`bg-slate-700 p-4 rounded-lg mb-4 shadow-md ${isDragging ? 'shadow-lg shadow-teal-500/30' : ''}`}
        >
            <p className="font-semibold text-white">{task.title}</p>
            <p className="text-sm text-slate-400 mt-1 line-clamp-2">{task.description}</p>
        </div>
    );
};


// --- Workspace Page Component ---
const WorkspacePage = () => {
    const { id: workspaceId } = useParams();
    const navigate = useNavigate();
    const [workspace, setWorkspace] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [columns, setColumns] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState({ type: null, isOpen: false, data: null });

    const token = localStorage.getItem("token");
    const API_BASE_URL = "http://localhost:9000/api";
    
    const sensors = useSensors(useSensor(PointerSensor));

    useEffect(() => {
        if (!token) { navigate("/"); return; }

        const fetchData = async () => {
            try {
                setLoading(true);
                const [wsRes, tasksRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/workspaces/${workspaceId}`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${API_BASE_URL}/tasks/${workspaceId}`, { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setWorkspace(wsRes.data);
                setTasks(tasksRes.data);
            } catch (error) {
                console.error("Error fetching workspace data:", error);
                navigate("/dashboard");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [workspaceId, token, navigate]);

    useEffect(() => {
        const boardColumns = {
            'To Do': { name: 'To Do', items: tasks.filter(t => t.status === 'To Do') },
            'In Progress': { name: 'In Progress', items: tasks.filter(t => t.status === 'In Progress') },
            'Completed': { name: 'Completed', items: tasks.filter(t => t.status === 'Completed') }
        };
        setColumns(boardColumns);
    }, [tasks]);

    const handleCreateTask = async (newTaskData) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/tasks`, newTaskData, { headers: { Authorization: `Bearer ${token}` } });
            setTasks(prev => [...prev, res.data]);
            closeModal();
        } catch (error) {
            console.error("Error creating task:", error);
            alert("Failed to create task.");
        }
    };

    const findContainer = (itemId) => {
        if (columns[itemId]) return itemId;
        return Object.keys(columns).find(key => columns[key].items.some(item => item._id === itemId));
    };
    
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over) return;
        
        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(over.id);

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return;
        }

        // Optimistic UI update
        const updatedTasks = tasks.map(task => 
            task._id === active.id ? { ...task, status: overContainer } : task
        );
        setTasks(updatedTasks);
        
        // API call to persist the change
        axios.put(`${API_BASE_URL}/tasks/${active.id}`, 
            { status: overContainer },
            { headers: { Authorization: `Bearer ${token}` } }
        ).catch(error => {
            console.error("Error updating task status:", error);
            // Revert state on API failure
            setTasks(tasks); 
            alert("Could not update task status.");
        });
    };

    const openModal = (type, data = null) => setModal({ type, isOpen: true, data });
    const closeModal = () => setModal({ type: null, isOpen: false, data: null });

    if (loading) {
        return <div className="min-h-screen flex justify-center items-center bg-slate-900 text-white"><Loader2 size={40} className="animate-spin text-teal-500" /></div>;
    }

    return (
        <div className="font-sans min-h-screen bg-slate-900 text-white flex">
            {modal.isOpen && modal.type === 'createTask' && <CreateTaskModal closeModal={closeModal} handleCreateTask={handleCreateTask} workspaceId={workspaceId} />}
            
            <aside className="w-64 bg-slate-800 p-6 flex-col z-10 hidden md:flex">
                <Link to="/dashboard" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8">
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-white">{workspace?.name}</h2>
                    <p className="text-sm text-slate-400 line-clamp-3">{workspace?.description}</p>
                </div>
                <nav className="flex flex-col space-y-2">
                    <a href="#" className="flex items-center gap-3 p-3 rounded-lg bg-teal-500/20 font-semibold"><CheckSquare size={20}/> Kanban Board</a>
                    <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700"><FileText size={20}/> Documents</a>
                    <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700"><MessageSquare size={20}/> Chat</a>
                    <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700"><Users size={20}/> Members</a>
                    <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700"><Settings size={20}/> Settings</a>
                </nav>
            </aside>

            <main className="flex-1 flex flex-col">
                <header className="bg-slate-800/50 backdrop-blur-sm shadow-md flex items-center justify-between px-8 py-4">
                    <h1 className="text-2xl font-bold text-white">{workspace?.name} Board</h1>
                    <button onClick={() => openModal('createTask')} className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-500 transition text-sm">
                        <Plus size={18}/> New Task
                    </button>
                </header>

                <div className="flex-1 p-8 overflow-x-auto">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <div className="flex gap-6 h-full">
                            {columns && Object.entries(columns).map(([columnId, column]) => (
                                <div key={columnId} className="w-80 flex-shrink-0 bg-slate-800 rounded-xl p-4 flex flex-col">
                                    <h3 className="font-bold text-lg mb-4 px-2">{column.name} <span className="text-sm text-slate-400">{column.items.length}</span></h3>
                                    <SortableContext items={column.items.map(i => i._id)} strategy={verticalListSortingStrategy}>
                                        <div className="flex-1 overflow-y-auto pr-2">
                                            {column.items.map(item => (
                                                <TaskCard key={item._id} task={item} />
                                            ))}
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

export default WorkspacePage;

