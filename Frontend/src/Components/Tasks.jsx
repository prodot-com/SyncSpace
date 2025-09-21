import React, { useState, useEffect, useCallback } from "react";
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
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Plus, X, Loader2, MessageSquare, CheckSquare,
  Users, Settings, ArrowLeft, Edit3, Trash2, UserPlus, Upload, Send, LayoutGrid
} from "lucide-react";
import axios from "axios";

// --- Reusable Components ---
const ModalShell = ({ children, close }) => ( <div className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex justify-center items-center p-4"><div className="bg-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-2xl relative animate-fade-in-up"><button onClick={close} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={20} /></button>{children}</div></div>);
const TaskCard = ({ task, onOpenDetails }) => { const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id }); const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : "auto" }; return ( <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={() => onOpenDetails(task)} className={`bg-slate-700 p-3 rounded-lg mb-3 cursor-pointer`}><div className="flex justify-between items-start"><div className="flex-1"><p className="font-semibold text-white">{task.title}</p><p className="text-xs text-slate-400 mt-1">in <span className="font-semibold">{task.workspace.name}</span></p></div></div></div>);};

// --- Task Details Modal with Comments ---
const TaskDetailsModal = ({ close, task, onUpdateStatus, comments, onAddComment, loadingComments }) => {
    const [newComment, setNewComment] = useState("");
    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if(!newComment.trim()) return;
        onAddComment(task._id, newComment);
        setNewComment("");
    };

    return (
        <ModalShell close={close}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-2xl font-bold">{task.title}</h2>
                    <p className="text-sm text-slate-400">in workspace: <span className="font-semibold text-teal-400">{task.workspace.name}</span></p>
                </div>
                <select value={task.status} onChange={(e) => onUpdateStatus(task, e.target.value)} className="px-3 py-2 rounded bg-slate-700 border border-slate-600 appearance-none">
                    <option>To Do</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                </select>
            </div>
            <p className="text-slate-300 mb-6">{task.description || "No description provided."}</p>
            
            <h3 className="font-bold text-lg mb-3">Comments</h3>
            <div className="space-y-3 max-h-48 overflow-y-auto bg-slate-900/50 p-3 rounded-lg">
                {loadingComments ? <Loader2 className="animate-spin"/> : comments.map(comment => (
                    <div key={comment._id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center font-bold flex-shrink-0 text-sm">{comment.user.name.charAt(0)}</div>
                        <div>
                            <p className="font-semibold text-sm">{comment.user.name} <span className="text-xs text-slate-500 ml-2">{new Date(comment.createdAt).toLocaleTimeString()}</span></p>
                            <p className="text-slate-300">{comment.content}</p>
                        </div>
                    </div>
                ))}
            </div>
            <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 mt-4">
                <input value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Add a comment..." className="flex-1 px-4 py-2 rounded-lg bg-slate-700" />
                <button type="submit" className="bg-teal-600 p-2 rounded-lg font-semibold hover:bg-teal-500 transition"><Send size={18}/></button>
            </form>
        </ModalShell>
    );
};


// --- Main Tasks Page Component ---

const TasksPage = () => {
  const navigate = useNavigate();
  const { id: userId } = useParams();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [columns, setColumns] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ type: null, props: {} });
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  const token = localStorage.getItem("token");
  const API_BASE_URL = "http://localhost:9000/api";

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  // --- Data Fetching ---
  const fetchAllTasks = useCallback(async () => {
    try {
        setLoading(true);
        const wsRes = await axios.get(`${API_BASE_URL}/workspaces`, { headers: { Authorization: `Bearer ${token}` } });
        const workspaces = wsRes.data;
        
        const taskPromises = workspaces.map(ws => 
            axios.get(`${API_BASE_URL}/tasks/${ws._id}`, { headers: { Authorization: `Bearer ${token}` } })
        );
        const taskResults = await Promise.all(taskPromises);
        const allTasks = taskResults.flatMap(res => res.data);
        
        const myTasks = allTasks.filter(task => task.assignedTo?._id === userId);
        
        myTasks.forEach(task => {
            const workspace = workspaces.find(ws => ws._id === task.workspace);
            if (workspace) task.workspace = { _id: workspace._id, name: workspace.name };
        });

        setTasks(myTasks);
    } catch (err) {
        console.error("Failed to fetch tasks", err);
    } finally {
        setLoading(false);
    }
  }, [token, userId]);

  useEffect(() => {
    if (!token) { navigate("/"); return; }
    const fetchUser = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/users/me`, { headers: { Authorization: `Bearer ${token}` } });
            setUser(res.data);
            fetchAllTasks();
        } catch {
            localStorage.removeItem("token");
            navigate("/");
        }
    };
    fetchUser();
  }, [token, navigate, fetchAllTasks]);

  useEffect(() => {
    if (!tasks) return;
    setColumns({
      "To Do": { name: "To Do", items: tasks.filter(t => t.status === "To Do") },
      "In Progress": { name: "In Progress", items: tasks.filter(t => t.status === "In Progress") },
      "Completed": { name: "Completed", items: tasks.filter(t => t.status === "Completed") },
    });
  }, [tasks]);

  // --- API Actions & Handlers ---
  const handleUpdateStatus = async (task, newStatus) => {
    const originalTasks = [...tasks];
    setTasks(prev => prev.map(t => t._id === task._id ? { ...t, status: newStatus } : t));
    try {
        await axios.put(`${API_BASE_URL}/tasks/${task._id}`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) {
        alert("Failed to update status");
        setTasks(originalTasks);
    }
  };

  const openTaskDetails = async (task) => {
      setModal({ type: "taskDetails", props: { task } });
      setLoadingComments(true);
      try {
          const res = await axios.get(`${API_BASE_URL}/comments/${task._id}`, { headers: { Authorization: `Bearer ${token}` } });
          setComments(res.data || "555");
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
      } catch (err) {
          alert("Failed to add comment.");
      }
  };

  const findContainer = (id) => { if (columns && columns[id]) return id; return columns ? Object.keys(columns).find((key) => columns[key].items.find((item) => item._id === id)) : null; };
  const handleDragEnd = (event) => { const { active, over } = event; if (!over) return; const activeContainer = findContainer(active.id); const overContainer = findContainer(over.id) || over.id; if (!activeContainer || !overContainer || active.id === over.id || activeContainer === overContainer) return; const task = tasks.find(t => t._id === active.id); if (task) handleUpdateStatus(task, overContainer);};
  const closeModal = () => setModal({ type: null, props: {} });

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-900"><Loader2 className="animate-spin text-teal-500" size={40} /></div>;
  }

  return (
    <div className="font-sans min-h-screen bg-slate-900 text-white flex">
        {modal.type === "taskDetails" && <TaskDetailsModal close={closeModal} task={modal.props.task} onUpdateStatus={handleUpdateStatus} comments={comments} onAddComment={addComment} loadingComments={loadingComments} />}
      <aside className="w-64 bg-slate-800 p-6 hidden md:flex flex-col border-r border-slate-700">
        <h1 className="text-2xl font-bold mb-10">SyncSpace</h1>
        <nav className="flex flex-col gap-2">
            <Link to={`/Dashboard/${user._id}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors text-slate-300"><LayoutGrid size={18} /> Dashboard</Link>
            <Link to={`/Tasks/${user._id}`} className="flex items-center gap-3 p-3 rounded-lg bg-teal-500/20 font-semibold text-white"><CheckSquare size={18} /> My Tasks</Link>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="bg-slate-800/50 shadow-md px-8 py-4 border-b border-slate-700">
            <h1 className="text-2xl font-bold">My Tasks</h1>
            <p className="text-slate-400">All tasks assigned to you across all workspaces.</p>
        </header>

        <div className="flex-1 flex flex-col overflow-y-auto">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <div className="flex gap-6 h-full p-8 overflow-x-auto">
                    {columns && Object.entries(columns).map(([colId, col]) => (
                        <div key={colId} className="w-80 flex-shrink-0 bg-slate-800 rounded-xl flex flex-col">
                            <h3 className="font-semibold text-lg mb-3 px-4 pt-4">{col.name} <span className="text-slate-400 text-sm">({col.items.length})</span></h3>
                            <SortableContext items={col.items.map(i => i._id)} strategy={verticalListSortingStrategy}>
                                <div className="flex-1 overflow-y-auto px-4 pb-4">
                                {col.items.map(item => <TaskCard key={item._id} task={item} onOpenDetails={openTaskDetails} />)}
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

