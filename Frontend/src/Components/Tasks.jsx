import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Plus, X, Loader2, Send, Edit3, Trash2,
} from "lucide-react";
import axios from "axios";
import { io } from "socket.io-client";

// --- Reusable Modals ---
const ModalShell = ({ children, close }) => (
  <div className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex justify-center items-center p-4">
    <div className="bg-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-lg relative animate-fade-in-up">
      <button
        onClick={close}
        className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
      >
        <X size={24} />
      </button>
      {children}
    </div>
  </div>
);

const CreateTaskModal = ({ close, onCreate }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({ title, description });
  };
  return (
    <ModalShell close={close}>
      <h2 className="text-2xl font-bold mb-4 text-white">Create New Task</h2>
      <form onSubmit={submit} className="space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task Title"
          className="w-full px-4 py-2 rounded bg-slate-700 border border-slate-600 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a description..."
          rows={4}
          className="w-full px-4 py-2 rounded bg-slate-700 border border-slate-600 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
        />
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={close}
            className="px-5 py-2 rounded font-semibold bg-slate-600 hover:bg-slate-500 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded font-semibold bg-teal-600 hover:bg-teal-500 transition"
          >
            Create Task
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

const TaskCard = ({ task, onEdit }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task._id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-slate-700 p-4 rounded-lg mb-3 shadow-md cursor-grab active:cursor-grabbing"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 mr-2">
          <p className="font-semibold text-white leading-snug">{task.title}</p>
          <p className="text-xs text-slate-400 mt-2">
            {task.description || "No description"}
          </p>
        </div>
        <button
          onClick={() => onEdit(task)}
          className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-600 transition-colors"
        >
          <Edit3 size={14} />
        </button>
      </div>
    </div>
  );
};

// --- Main Tasks Page ---
const TasksPage = () => {
  const { userid } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [columns, setColumns] = useState(null);
  const [modal, setModal] = useState({ type: null, props: {} });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const API_BASE_URL = "http://localhost:9000/api";

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  // --- Fetch Tasks ---
  const fetchTasks = async () => {
    if (!userid) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/tasks/${userid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data || []);
    } catch (err) {
      console.error("Failed to load tasks:", err);
      alert("Failed to load tasks.");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) navigate("/");
    fetchTasks();
  }, [userid, token, navigate]);

  // --- Build columns for Kanban ---
  useEffect(() => {
    if (!tasks) return;
    setColumns({
      "To Do": { name: "To Do", items: tasks.filter((t) => t.status === "To Do") },
      "In Progress": { name: "In Progress", items: tasks.filter((t) => t.status === "In Progress") },
      "Completed": { name: "Completed", items: tasks.filter((t) => t.status === "Completed") },
    });
  }, [tasks]);

  const openModal = (type, props = {}) => setModal({ type, props });
  const closeModal = () => setModal({ type: null, props: {} });

  const createTask = async (data) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/tasks`, { ...data, user: userid }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => [...prev, res.data]);
      closeModal();
    } catch (err) {
      alert("Failed to create task");
    }
  };

  const updateTask = async (taskId, patch) => {
    const originalTasks = [...tasks];
    try {
      setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, ...patch } : t)));
      await axios.put(`${API_BASE_URL}/tasks/${taskId}`, patch, { headers: { Authorization: `Bearer ${token}` } });
      closeModal();
    } catch (err) {
      setTasks(originalTasks);
      alert("Failed to update task");
    }
  };

  const deleteTask = (taskId) => {
    const originalTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
    axios.delete(`${API_BASE_URL}/tasks/${taskId}`, { headers: { Authorization: `Bearer ${token}` } })
      .catch(() => { setTasks(originalTasks); alert("Failed to delete task"); });
  };

  const findContainer = (id) => {
    if (columns && columns[id]) return id;
    return columns ? Object.keys(columns).find((key) => columns[key].items.find((item) => item._id === id)) : null;
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId) || (columns[overId] ? overId : null);
    if (!activeContainer || !overContainer || active.id === over.id) return;

    const originalTasks = [...tasks];
    if (activeContainer === overContainer) {
      const taskList = columns[activeContainer].items;
      const oldIndex = taskList.findIndex((t) => t._id === activeId);
      const newIndex = taskList.findIndex((t) => t._id === overId);
      if (oldIndex === -1 || newIndex === -1) return;
      const reordered = arrayMove(taskList, oldIndex, newIndex);
      const otherTasks = tasks.filter((t) => t.status !== activeContainer);
      setTasks([...otherTasks, ...reordered]);
    } else {
      setTasks((prev) =>
        prev.map((t) => (t._id === activeId ? { ...t, status: overContainer } : t))
      );
      axios.put(`${API_BASE_URL}/tasks/${activeId}`, { status: overContainer }, { headers: { Authorization: `Bearer ${token}` } })
        .catch(() => setTasks(originalTasks));
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-900"><Loader2 className="animate-spin text-teal-500" size={40} /></div>;

  return (
    <div className="font-sans min-h-screen bg-slate-900 text-white flex">
      {modal.type === "createTask" && <CreateTaskModal close={closeModal} onCreate={createTask} />}

      <aside className="w-64 bg-slate-800 p-6 hidden md:flex flex-col border-r border-slate-700">
        <p onClick={() => navigate("/dashboard")} className="flex cursor-pointer items-center gap-2 text-sm text-slate-400 hover:text-white mb-6">Back to Dashboard</p>
        <h2 className="text-xl font-bold">Tasks</h2>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="bg-slate-800/50 shadow-md flex items-center justify-between px-8 py-4 border-b border-slate-700">
          <h1 className="text-2xl font-bold">Tasks Board</h1>
          <button onClick={() => openModal("createTask")} className="bg-teal-600 px-4 py-2 rounded-lg flex items-center gap-2 font-semibold hover:bg-teal-500 transition text-sm"><Plus size={16}/> New Task</button>
        </header>

        <div className="flex-1 overflow-x-auto p-8">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="flex gap-6 h-full">
              {columns && Object.entries(columns).map(([colId, col]) => (
                <div key={colId} className="w-80 flex-shrink-0 bg-slate-800 rounded-xl flex flex-col">
                  <h3 className="font-semibold text-lg mb-3 px-4 pt-4">{col.name} ({col.items.length})</h3>
                  <SortableContext items={col.items.map(i => i._id)} strategy={verticalListSortingStrategy}>
                    <div className="flex-1 overflow-y-auto px-4 pb-4">
                      {col.items.map(item => (
                        <TaskCard key={item._id} task={item} onEdit={(t) => openModal("editTask", { task: t })} />
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

export default TasksPage;
