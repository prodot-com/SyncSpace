import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
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
  Plus,
  X,
  Loader2,
  MessageSquare,
  CheckSquare,
  FileText,
  Users,
  Settings,
  ArrowLeft,
  Edit3,
  Trash2,
  UserPlus,
} from "lucide-react";
import axios from "axios";

// --- Reusable UI Components ---
const ModalShell = ({ children, close }) => (
  <div className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex justify-center items-center p-4">
    <div className="bg-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-lg relative animate-fade-in-up">
      <button
        onClick={close}
        className="absolute top-3 right-3 text-slate-400 hover:text-white"
      >
        <X size={20} />
      </button>
      {children}
    </div>
  </div>
);

// --- Task Modals: Create & Edit ---
const CreateTaskModal = ({ close, onCreate, workspaceId, members }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To Do");
  const [assignedTo, setAssignedTo] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Title required");
    onCreate({ title, description, status, assignedTo: assignedTo || null, workspace: workspaceId });
  };

  return (
    <ModalShell close={close}>
      <h2 className="text-2xl font-bold mb-3">Create Task</h2>
      <form onSubmit={submit} className="space-y-3">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full px-3 py-2 rounded bg-slate-700" required />
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" rows={4} className="w-full px-3 py-2 rounded bg-slate-700" />
        <div className="flex gap-2">
          <select value={status} onChange={e => setStatus(e.target.value)} className="px-3 py-2 rounded bg-slate-700">
            <option>To Do</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)} className="px-3 py-2 rounded bg-slate-700">
            <option value="">Unassigned</option>
            {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
          </select>
        </div>
        <div className="flex gap-2 pt-2">
          <button type="submit" className="bg-teal-600 px-4 py-2 rounded font-semibold hover:bg-teal-500 transition">Create</button>
          <button type="button" onClick={close} className="bg-slate-700 px-4 py-2 rounded font-semibold hover:bg-slate-600 transition">Cancel</button>
        </div>
      </form>
    </ModalShell>
  );
};

const EditTaskModal = ({ close, task, members, onUpdate, onDelete }) => {
  const [title, setTitle] = useState(task.title || "");
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState(task.status || "To Do");
  const [assignedTo, setAssignedTo] = useState(task.assignedTo ? task.assignedTo._id : "");

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Title required");
    onUpdate(task._id, { title, description, status, assignedTo: assignedTo || null });
  };

  return (
    <ModalShell close={close}>
      <h2 className="text-2xl font-bold mb-3">Edit Task</h2>
      <form onSubmit={submit} className="space-y-3">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full px-3 py-2 rounded bg-slate-700" required />
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" rows={4} className="w-full px-3 py-2 rounded bg-slate-700" />
        <div className="flex gap-2">
          <select value={status} onChange={e => setStatus(e.target.value)} className="px-3 py-2 rounded bg-slate-700">
            <option>To Do</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)} className="px-3 py-2 rounded bg-slate-700">
            <option value="">Unassigned</option>
            {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
          </select>
        </div>
        <div className="flex gap-2 pt-2">
          <button type="submit" className="bg-teal-600 px-4 py-2 rounded font-semibold hover:bg-teal-500 transition">Save Changes</button>
          <button type="button" onClick={() => onDelete(task._id)} className="bg-red-600 px-4 py-2 rounded font-semibold hover:bg-red-500 transition text-white">Delete Task</button>
          <button type="button" onClick={close} className="bg-slate-700 px-4 py-2 rounded font-semibold hover:bg-slate-600 transition">Cancel</button>
        </div>
      </form>
    </ModalShell>
  );
};

const ConfirmModal = ({ close, onConfirm, title, message }) => (
  <ModalShell close={close}>
    <h2 className="text-2xl font-bold mb-3">{title}</h2>
    <p className="text-slate-300 mb-6">{message}</p>
    <div className="flex gap-2 justify-end">
      <button onClick={onConfirm} className="bg-red-600 px-4 py-2 rounded font-semibold hover:bg-red-500 transition text-white">Confirm</button>
      <button type="button" onClick={close} className="bg-slate-700 px-4 py-2 rounded font-semibold hover:bg-slate-600 transition">Cancel</button>
    </div>
  </ModalShell>
);

// --- Sortable Task Card ---
const TaskCard = ({ task, onOpenEdit }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : "auto" };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={`bg-slate-700 p-3 rounded-lg mb-3 cursor-grab active:cursor-grabbing`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="font-semibold text-white">{task.title}</p>
          <p className="text-xs text-slate-400 mt-1">{task.assignedTo ? `Assigned to: ${task.assignedTo.name}` : "Unassigned"}</p>
        </div>
        <button onClick={() => onOpenEdit(task)} className="text-slate-400 hover:text-white p-1"><Edit3 size={14} /></button>
      </div>
    </div>
  );
};

// --- Members Modal ---
const MembersModal = ({ close, members, onRemove }) => {
  return (
    <ModalShell close={close}>
      <h2 className="text-2xl font-bold mb-3">Manage Members</h2>
      <div className="mb-3">
        <div className="flex gap-2">
          <input placeholder="Invite by email (Feature coming soon)" className="flex-1 px-3 py-2 rounded bg-slate-700" disabled />
          <button className="bg-teal-600 px-3 py-2 rounded opacity-50 cursor-not-allowed"><UserPlus size={16} /></button>
        </div>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {members.map(m => (
          <div key={m._id} className="flex items-center justify-between p-2 bg-slate-900/50 rounded">
            <div>
              <div className="font-semibold">{m.name}</div>
              <div className="text-xs text-slate-400">{m.email}</div>
            </div>
            <button onClick={() => onRemove(m._id)} className="text-red-500 hover:text-red-400 p-1"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </ModalShell>
  );
};

// --- Workspace Settings Modal ---
const SettingsModal = ({ close, workspace, onUpdate }) => {
  const [name, setName] = useState(workspace.name || "");
  const [description, setDescription] = useState(workspace.description || "");

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Name required");
    onUpdate({ name, description });
  };

  return (
    <ModalShell close={close}>
      <h2 className="text-2xl font-bold mb-3">Workspace Settings</h2>
      <form onSubmit={submit} className="space-y-3">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Workspace name" className="w-full px-3 py-2 rounded bg-slate-700" required />
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="w-full px-3 py-2 rounded bg-slate-700" rows={4} />
        <div className="flex gap-2 pt-2">
          <button type="submit" className="bg-teal-600 px-4 py-2 rounded font-semibold hover:bg-teal-500 transition">Save Changes</button>
          <button type="button" onClick={close} className="bg-slate-700 px-4 py-2 rounded font-semibold hover:bg-slate-600 transition">Cancel</button>
        </div>
      </form>
    </ModalShell>
  );
};

// --- Main Workspace Page Component ---
const WorkspacePage = () => {
  const { id: workspaceId } = useParams();
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [columns, setColumns] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ type: null, props: {} });

  const token = localStorage.getItem("token");
  const API_BASE_URL = "http://localhost:9000/api";

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  // Fetch all workspace data on load
  useEffect(() => {
    if (!token) { navigate("/"); return; }
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [wsRes, tasksRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/workspaces/${workspaceId}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/tasks/${workspaceId}`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setWorkspace(wsRes.data);
        setTasks(tasksRes.data || []);
      } catch (err) {
        console.error("Error loading workspace:", err);
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [workspaceId, token, navigate]);

  // Rebuild columns when tasks change
  useEffect(() => {
    if (!tasks) return;
    const boardColumns = {
      "To Do": { name: "To Do", items: tasks.filter(t => t.status === "To Do") },
      "In Progress": { name: "In Progress", items: tasks.filter(t => t.status === "In Progress") },
      "Completed": { name: "Completed", items: tasks.filter(t => t.status === "Completed") },
    };
    setColumns(boardColumns);
  }, [tasks]);

  // --- API Actions ---
  const createTask = async (data) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/tasks`, data, { headers: { Authorization: `Bearer ${token}` } });
      const createdTask = res.data;
      if (createdTask.assignedTo && workspace?.members) {
          const assigneeDetails = workspace.members.find(m => m._id === createdTask.assignedTo);
          if(assigneeDetails) createdTask.assignedTo = assigneeDetails;
      }
      setTasks(prev => [...prev, createdTask]);
      closeModal();
    } catch (err) {
      alert("Failed to create task");
    }
  };

  const updateTask = async (taskId, patch) => {
    const originalTasks = [...tasks];
    try {
      const updatedTaskLocally = { ...tasks.find(t => t._id === taskId), ...patch };
      if (patch.assignedTo && workspace?.members) {
        const assigneeDetails = workspace.members.find(m => m._id === patch.assignedTo);
        updatedTaskLocally.assignedTo = assigneeDetails;
      }
      setTasks(prev => prev.map(t => t._id === taskId ? updatedTaskLocally : t));
      closeModal();
      await axios.put(`${API_BASE_URL}/tasks/${taskId}`, patch, { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) {
      setTasks(originalTasks);
      alert("Failed to update task");
    }
  };

  const deleteTask = (taskId) => {
    openModal("confirm", {
        title: "Delete Task?",
        message: "Are you sure you want to permanently delete this task?",
        onConfirm: async () => {
            const originalTasks = [...tasks];
            try {
                setTasks(prev => prev.filter(t => t._id !== taskId));
                closeModal();
                await axios.delete(`${API_BASE_URL}/tasks/${taskId}`, { headers: { Authorization: `Bearer ${token}` } });
            } catch (err) {
                setTasks(originalTasks);
                alert("Failed to delete task");
            }
        }
    });
  };

  const removeMember = (userId) => {
    openModal("confirm", {
        title: "Remove Member?",
        message: "Are you sure you want to remove this member from the workspace?",
        onConfirm: async () => {
            try {
                closeModal();
                await axios.delete(`${API_BASE_URL}/workspaces/${workspaceId}/members/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
                setWorkspace(prev => ({...prev, members: prev.members.filter(m => m._id !== userId)}));
            } catch (err) {
                alert("Failed to remove member.");
            }
        }
    });
  };

  const updateWorkspace = async (patch) => {
      try {
          const res = await axios.put(`${API_BASE_URL}/workspaces/${workspaceId}`, patch, { headers: { Authorization: `Bearer ${token}` } });
          setWorkspace(res.data);
          closeModal();
      } catch (err) {
          alert("Failed to update workspace.");
      }
  };

  const findContainer = (taskId) => Object.keys(columns).find(colId =>
    columns[colId].items.some(item => item._id === taskId)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const originalColumns = { ...columns };
    const activeContainerId = findContainer(active.id);
    const overContainerId = findContainer(over.id) || over.id;
    if (!activeContainerId || !overContainerId) return;

    const activeItems = [...originalColumns[activeContainerId].items];
    const overItems = activeContainerId === overContainerId
      ? activeItems
      : [...originalColumns[overContainerId].items];

    if (activeContainerId === overContainerId) {
      const oldIndex = activeItems.findIndex(t => t._id === active.id);
      const newIndex = activeItems.findIndex(t => t._id === over.id);
      const newItems = arrayMove(activeItems, oldIndex, newIndex);

      setColumns(prev => ({
        ...prev,
        [activeContainerId]: { ...prev[activeContainerId], items: newItems }
      }));
    } else {
      const movedTaskIndex = activeItems.findIndex(t => t._id === active.id);
      const [movedTask] = activeItems.splice(movedTaskIndex, 1);
      movedTask.status = overContainerId;

      const overIndex = overItems.findIndex(t => t._id === over.id);
      if (overIndex === -1) overItems.push(movedTask);
      else overItems.splice(overIndex, 0, movedTask);

      setColumns(prev => ({
        ...prev,
        [activeContainerId]: { ...prev[activeContainerId], items: activeItems },
        [overContainerId]: { ...prev[overContainerId], items: overItems }
      }));

      axios.put(`${API_BASE_URL}/tasks/${active.id}`, { status: overContainerId }, { headers: { Authorization: `Bearer ${token}` } })
        .catch(() => {
          alert("Could not update task status.");
          setColumns(originalColumns);
        });
    }
  };

  const openModal = (type, props = {}) => setModal({ type, props });
  const closeModal = () => setModal({ type: null, props: {} });

  if (loading || !workspace) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-900"><Loader2 className="animate-spin text-teal-500" size={40} /></div>;
  }

  return (
    <div className="font-sans min-h-screen bg-slate-900 text-white flex">
      {/* Modals */}
      {modal.type === "createTask" && <CreateTaskModal close={closeModal} onCreate={createTask} workspaceId={workspaceId} members={workspace.members} />}
      {modal.type === "editTask" && <EditTaskModal close={closeModal} task={modal.props.task} members={workspace.members} onUpdate={updateTask} onDelete={deleteTask} />}
      {modal.type === "members" && <MembersModal close={closeModal} members={workspace.members} onRemove={removeMember} />}
      {modal.type === "settings" && <SettingsModal close={closeModal} workspace={workspace} onUpdate={updateWorkspace} />}
      {modal.type === "confirm" && <ConfirmModal close={closeModal} {...modal.props} />}

      <aside className="w-64 bg-slate-800 p-6 hidden md:flex flex-col">
        <Link to="/dashboard" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6"><ArrowLeft size={16} /> Back to Dashboard</Link>
        <div className="mb-6">
          <h2 className="text-xl font-bold">{workspace.name}</h2>
          <p className="text-sm text-slate-400 line-clamp-3">{workspace.description}</p>
        </div>
        <nav className="flex flex-col gap-2">
          <button onClick={() => {}} className="flex items-center gap-3 p-3 rounded-lg bg-teal-500/20 font-semibold"><CheckSquare size={18} /> Kanban Board</button>
          <button onClick={() => alert('Documents feature coming soon!')} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors"><FileText size={18} /> Documents</button>
          <button onClick={() => alert('Chat feature coming soon!')} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors"><MessageSquare size={18} /> Chat</button>
          <button onClick={() => openModal("members")} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors"><Users size={18} /> Members</button>
          <button onClick={() => openModal("settings")} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors"><Settings size={18} /> Settings</button>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="bg-slate-800/50 shadow-md flex items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold">{workspace.name} Board</h1>
          <button onClick={() => openModal("createTask")} className="bg-teal-600 px-4 py-2 rounded-lg flex items-center gap-2 font-semibold hover:bg-teal-500 transition"><Plus size={16}/> New Task</button>
        </header>

        <div className="p-6 overflow-x-auto flex-1">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="flex gap-6 h-full">
              {columns && Object.entries(columns).map(([colId, col]) => (
                <div key={colId} className="w-80 flex-shrink-0 bg-slate-800 rounded-xl p-4 flex flex-col">
                  <h3 className="font-semibold text-lg mb-3 px-1">{col.name} <span className="text-slate-400 text-sm">({col.items.length})</span></h3>
                  <SortableContext items={col.items.map(i => i._id)} strategy={verticalListSortingStrategy}>
                    <div className="flex-1 overflow-y-auto pr-1">
                      {col.items.map(item => (
                        <TaskCard key={item._id} task={item} onOpenEdit={(t) => openModal("editTask", { task: t })} />
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
