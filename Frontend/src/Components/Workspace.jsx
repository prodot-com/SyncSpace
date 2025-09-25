// import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
// import { useNavigate, useParams, Link } from "react-router-dom";
// import {
//     DndContext,
//     PointerSensor,
//     useSensor,
//     useSensors,
//     closestCenter,
// } from "@dnd-kit/core";
// import {
//     SortableContext,
//     useSortable,
//     verticalListSortingStrategy,
//     arrayMove,
// } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import {
//     Plus, X, Loader2, MessageSquare, CheckSquare, FileText,
//     Users, Settings, ArrowLeft, Edit3, Trash2, UserPlus, Upload, Send, Download, LifeBuoy
// } from "lucide-react";
// import axios from "axios";
// import { io } from "socket.io-client";
// import {BACKEND_URL } from '../../utilities/constants.js'
// import { SOCKET_URL } from "../../utilities/constants.js";


// const ModalShell = ({ children, close }) => (
//     <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[60] flex justify-center items-center p-4">
//         <div className="bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl p-6 w-full max-w-lg relative animate-fade-in-up">
//             <button
//                 onClick={close}
//                 className="absolute top-3 right-3 text-slate-500 hover:text-white transition-colors hover:bg-slate-700 rounded-full p-1"
//             >
//                 <X size={24} />
//             </button>
//             {children}
//         </div>
//     </div>
// );

// const SuccessModal = ({ close, title, message }) => (
//     <ModalShell close={close}>
//         <h2 className="text-2xl font-bold mb-3 text-teal-400">{title}</h2>
//         <p className="text-slate-300 mb-6">{message}</p>
//         <div className="flex gap-3 justify-end">
//             <button onClick={close} className="px-5 py-2 rounded-lg font-semibold bg-teal-600 hover:bg-teal-500 transition-all duration-200 shadow-lg hover:shadow-teal-500/20 transform hover:-translate-y-0.5">Close</button>
//         </div>
//     </ModalShell>
// );


// const CreateTaskModal = ({ close, onCreate, workspaceId, members }) => {
//     const [title, setTitle] = useState("");
//     const [description, setDescription] = useState("");
//     const [status, setStatus] = useState("To Do");
//     const [assignedTo, setAssignedTo] = useState("");

//     const submit = (e) => {
//         e.preventDefault();
//         if (!title.trim()) return;
//         onCreate({ title, description, status, assignedTo: assignedTo || null, workspace: workspaceId });
//     };

//     return (
//         <ModalShell close={close}>
//             <h2 className="text-2xl font-bold mb-4 text-white">Create New Task</h2>
//             <form onSubmit={submit} className="space-y-4">
//                 <input
//                     value={title}
//                     onChange={e => setTitle(e.target.value)}
//                     placeholder="Task Title"
//                     className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
//                     required
//                 />
//                 <textarea
//                     value={description}
//                     onChange={e => setDescription(e.target.value)}
//                     placeholder="Add a description..."
//                     rows={4}
//                     className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
//                 />
//                 <div className="grid grid-cols-2 gap-4">
//                     <select value={status} onChange={e => setStatus(e.target.value)} className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 appearance-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition">
//                         <option>To Do</option>
//                         <option>In Progress</option>
//                         <option>Completed</option>
//                     </select>
//                     <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)} className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 appearance-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition">
//                         <option value="">Unassigned</option>
//                         {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
//                     </select>
//                 </div>
//                 <div className="flex justify-end gap-3 pt-4">
//                     <button type="button" onClick={close} className="px-5 py-2 rounded-lg font-semibold bg-slate-600 hover:bg-slate-500 transition-all duration-200 transform hover:-translate-y-0.5">Cancel</button>
//                     <button type="submit" className="px-5 py-2 rounded-lg font-semibold bg-teal-600 hover:bg-teal-500 transition-all duration-200 shadow-lg hover:shadow-teal-500/20 transform hover:-translate-y-0.5">Create Task</button>
//                 </div>
//             </form>
//         </ModalShell>
//     );
// };

// const EditTaskModal = ({ close, task, members, onUpdate, onDelete, isAdmin }) => {
//     const [title, setTitle] = useState(task.title || "");
//     const [description, setDescription] = useState(task.description || "");
//     const [status, setStatus] = useState(task.status || "To Do");
//     const [assignedTo, setAssignedTo] = useState(task.assignedTo ? task.assignedTo._id : "");

//     const submit = (e) => {
//         e.preventDefault();
//         if (!title.trim()) return;
//         onUpdate(task._id, { title, description, status, assignedTo: assignedTo || null });
//     };

//     return (
//         <ModalShell close={close}>
//             <h2 className="text-2xl font-bold mb-4">Edit Task</h2>
//             <form onSubmit={submit} className="space-y-4">
//                 <input
//                     value={title}
//                     onChange={e => setTitle(e.target.value)}
//                     placeholder="Task Title"
//                     className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
//                     required
//                 />
//                 <textarea
//                     value={description}
//                     onChange={e => setDescription(e.target.value)}
//                     placeholder="Add a description..."
//                     rows={4}
//                     className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
//                 />
//                 <div className="grid grid-cols-2 gap-4">
//                     <select value={status} onChange={e => setStatus(e.target.value)} className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 appearance-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition">
//                         <option>To Do</option>
//                         <option>In Progress</option>
//                         <option>Completed</option>
//                     </select>
//                     <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)} className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 appearance-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition">
//                         <option value="">Unassigned</option>
//                         {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
//                     </select>
//                 </div>
//                 <div className="flex justify-between items-center pt-4">
//                     {isAdmin && (
//                         <button type="button" onClick={() => onDelete(task._id)} className="px-5 py-2 rounded-lg font-semibold bg-red-600 hover:bg-red-500 transition-all duration-200 shadow-lg hover:shadow-red-500/20 transform hover:-translate-y-0.5 text-white">
//                             Delete Task
//                         </button>
//                     )}
//                     <div className="flex gap-3 ml-auto">
//                         <button type="button" onClick={close} className="px-5 py-2 rounded-lg font-semibold bg-slate-600 hover:bg-slate-500 transition-all duration-200 transform hover:-translate-y-0.5">Cancel</button>
//                         <button type="submit" className="px-5 py-2 rounded-lg font-semibold bg-teal-600 hover:bg-teal-500 transition-all duration-200 shadow-lg hover:shadow-teal-500/20 transform hover:-translate-y-0.5">Save Changes</button>
//                     </div>
//                 </div>
//             </form>
//         </ModalShell>
//     );
// };

// const ConfirmModal = ({ close, onConfirm, title, message }) => (
//     <ModalShell close={close}>
//         <h2 className="text-2xl font-bold mb-3">{title}</h2>
//         <p className="text-slate-300 mb-6">{message}</p>
//         <div className="flex gap-3 justify-end">
//             <button type="button" onClick={close} className="px-5 py-2 rounded-lg font-semibold bg-slate-600 hover:bg-slate-500 transition-all duration-200 transform hover:-translate-y-0.5">Cancel</button>
//             <button onClick={onConfirm} className="px-5 py-2 rounded-lg font-semibold bg-red-600 hover:bg-red-500 transition-all duration-200 shadow-lg hover:shadow-red-500/20 transform hover:-translate-y-0.5 text-white">Confirm</button>
//         </div>
//     </ModalShell>
// );

// const MembersModal = ({ close, members, onInvite, onRemove, isAdmin }) => {
//     const [email, setEmail] = useState("");
//     const handleInvite = (e) => {
//         e.preventDefault();
//         if (!email.trim()) return;
//         onInvite(email);
//         setEmail("");
//     };

//     return (
//         <ModalShell close={close}>
//             <h2 className="text-2xl font-bold mb-4">Manage Members</h2>
//             {isAdmin && (
//                 <form onSubmit={handleInvite} className="mb-4">
//                     <div className="flex gap-2">
//                         <input
//                             type="email"
//                             value={email}
//                             onChange={e => setEmail(e.target.value)}
//                             placeholder="Invite user by email"
//                             className="flex-1 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
//                             required
//                         />
//                         <button type="submit" className="bg-teal-600 p-2 rounded-lg font-semibold hover:bg-teal-500 transition-all duration-200 shadow-lg hover:shadow-teal-500/20 transform hover:-translate-y-0.5">
//                             <UserPlus size={20} />
//                         </button>
//                     </div>
//                 </form>
//             )}
//             <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
//                 {members.map(m => (
//                     <div key={m._id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
//                         <div>
//                             <div className="font-semibold">{m.name}</div>
//                             <div className="text-xs text-slate-400">{m.email}</div>
//                         </div>
//                         {isAdmin && (
//                             <button onClick={() => onRemove(m._id)} className="text-red-500 hover:text-red-400 p-1">
//                                 <Trash2 size={16} />
//                             </button>
//                         )}
//                     </div>
//                 ))}
//             </div>
//         </ModalShell>
//     );
// };

// const SettingsModal = ({ close, workspace, onUpdate, onDeleteWorkspace, isAdmin }) => {
//     const [name, setName] = useState(workspace.name || "");
//     const [description, setDescription] = useState(workspace.description || "");

//     const submit = (e) => {
//         e.preventDefault();
//         if (!name.trim()) return;
//         onUpdate({ name, description });
//     };

//     return (
//         <ModalShell close={close}>
//             <h2 className="text-2xl font-bold mb-4">Workspace Settings</h2>
//             <form onSubmit={submit} className="space-y-4">
//                 <input
//                     value={name}
//                     onChange={e => setName(e.target.value)}
//                     placeholder="Workspace name"
//                     className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
//                     required
//                 />
//                 <textarea
//                     value={description}
//                     onChange={e => setDescription(e.target.value)}
//                     placeholder="Description"
//                     className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
//                     rows={4}
//                 />
//                 <div className="flex justify-between items-center pt-2">
//                     <button type="button" onClick={onDeleteWorkspace} className="text-red-500 hover:underline text-sm">
//                         Delete Workspace
//                     </button>
//                     <div className="flex gap-3">
//                         <button type="button" onClick={close} className="px-5 py-2 rounded-lg font-semibold bg-slate-600 hover:bg-slate-500 transition-all duration-200 transform hover:-translate-y-0.5">Cancel</button>
//                         <button type="submit" className="px-5 py-2 rounded-lg font-semibold bg-teal-600 hover:bg-teal-500 transition-all duration-200 shadow-lg hover:shadow-teal-500/20 transform hover:-translate-y-0.5">Save Changes</button>
//                     </div>
//                 </div>
//             </form>
//         </ModalShell>
//     );
// };

// const CreateDocumentModal = ({ close, onCreate }) => {
//     const [title, setTitle] = useState("");
//     const submit = (e) => {
//         e.preventDefault();
//         if (!title.trim()) return;
//         onCreate(title);
//     };

//     return (
//         <ModalShell close={close}>
//             <h2 className="text-2xl font-bold mb-4 text-white">Create New Document</h2>
//             <form onSubmit={submit} className="space-y-4">
//                 <input
//                     value={title}
//                     onChange={e => setTitle(e.target.value)}
//                     placeholder="Document Title"
//                     className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
//                     required
//                 />
//                 <div className="flex justify-end gap-3 pt-4">
//                     <button type="button" onClick={close} className="px-5 py-2 rounded-lg font-semibold bg-slate-600 hover:bg-slate-500 transition-all duration-200 transform hover:-translate-y-0.5">Cancel</button>
//                     <button type="submit" className="px-5 py-2 rounded-lg font-semibold bg-teal-600 hover:bg-teal-500 transition-all duration-200 shadow-lg hover:shadow-teal-500/20 transform hover:-translate-y-0.5">Create Document</button>
//                 </div>
//             </form>
//         </ModalShell>
//     );
// };

// const HelpModal = ({ close, onSend }) => {
//     const [message, setMessage] = useState("");
//     const submit = (e) => {
//         e.preventDefault();
//         if (!message.trim()) return;
//         onSend(message);
//     };

//     return (
//         <ModalShell close={close}>
//             <h2 className="text-2xl font-bold mb-4 text-white">Help & Support</h2>
//             <p className="text-slate-400 text-sm mb-4">Describe your issue below. A request will be sent to the workspace administrator.</p>
//             <form onSubmit={submit} className="space-y-4">
//                 <textarea
//                     value={message}
//                     onChange={e => setMessage(e.target.value)}
//                     placeholder="How can we help you?"
//                     rows={5}
//                     className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
//                     required
//                 />
//                 <div className="flex justify-end gap-3 pt-2">
//                     <button type="button" onClick={close} className="px-5 py-2 rounded-lg font-semibold bg-slate-600 hover:bg-slate-500 transition-all duration-200 transform hover:-translate-y-0.5">Cancel</button>
//                     <button type="submit" className="px-5 py-2 rounded-lg font-semibold bg-teal-600 hover:bg-teal-500 transition-all duration-200 shadow-lg hover:shadow-teal-500/20 transform hover:-translate-y-0.5">Send Request</button>
//                 </div>
//             </form>
//         </ModalShell>
//     );
// };


// // --- View Components ---

// const TaskCard = ({ task, onOpenEdit }) => {
//     const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id });
//     const style = {
//         transform: CSS.Transform.toString(transform),
//         transition,
//         zIndex: isDragging ? 50 : "auto",
//         boxShadow: isDragging ? "0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)" : ""
//     };

//     return (
//         <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={`bg-slate-800 p-4 rounded-lg mb-3 shadow-lg border border-slate-700/80 hover:border-teal-500/50 cursor-grab active:cursor-grabbing transition-all duration-200 ${isDragging ? "ring-2 ring-teal-500 shadow-2xl" : "hover:shadow-xl"}`}>
//             <div className="flex justify-between items-start">
//                 <div className="flex-1 mr-2">
//                     <p className="font-semibold text-white leading-snug">{task.title}</p>
//                     <p className="text-xs text-slate-400 mt-2">{task.assignedTo ? `Assigned to: ${task.assignedTo.name}` : "Unassigned"}</p>
//                 </div>
//                 <button onClick={() => onOpenEdit(task)} className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-600 transition-colors">
//                     <Edit3 size={14} />
//                 </button>
//             </div>
//         </div>
//     );
// };

// const DocumentsPanel = ({ documents, onUpload, onDelete, loading, onOpenEditor, onOpenCreate, isAdmin }) => {
//     const handleFileSelect = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             onUpload(file);
//             e.target.value = null;
//         }
//     };

//     const textDocs = documents.filter(d => d.isTextDocument);
//     const uploadedFiles = documents.filter(d => !d.isTextDocument);

//     return (
//         <div className="p-8 flex-1 space-y-8 animate-fade-in">
//             <div>
//                 <div className="flex items-center justify-between mb-4">
//                     <h2 className="text-3xl font-bold tracking-tight">Collaborative Docs</h2>
//                     {isAdmin && (
//                         <button onClick={onOpenCreate} className="bg-slate-700 px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 hover:bg-slate-600 transition-all duration-200 font-semibold text-sm transform hover:-translate-y-0.5 shadow-lg">
//                             <Plus size={16} /> New Document
//                         </button>
//                     )}
//                 </div>
//                 {loading ? <div className="flex justify-center py-10"><Loader2 className="animate-spin text-teal-500" size={32} /></div> :
//                     textDocs.length > 0 ? (
//                         <div className="bg-slate-800/50 rounded-xl p-3">
//                             {textDocs.map(doc => (
//                                 <div key={doc._id} className="grid grid-cols-6 items-center gap-4 p-3 rounded-lg hover:bg-slate-700/50 transition-colors">
//                                     <button onClick={() => onOpenEditor(doc._id)} className="font-semibold hover:text-teal-400 truncate col-span-3 flex items-center gap-3 text-left">
//                                         <FileText size={16} className="text-teal-400 flex-shrink-0" /> {doc.name}
//                                     </button>
//                                     <div className="text-sm text-slate-400 text-center col-span-1">by {doc.uploadedBy?.name || 'Unknown'}</div>
//                                     <div className="text-sm text-slate-500 text-center col-span-1">{new Date(doc.createdAt).toLocaleDateString()}</div>
//                                     <div className="flex justify-end items-center">
//                                         {isAdmin && (<button onClick={() => onDelete(doc._id)} className="text-red-500 hover:text-red-400 p-2 rounded-full hover:bg-slate-700"><Trash2 size={16} /></button>)}
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     ) : <div className="text-center py-10 bg-slate-800/50 rounded-xl border border-dashed border-slate-700"><h3 className="font-semibold text-xl">No Text Documents</h3><p className="text-slate-400 mt-2 text-sm">Create your first collaborative document.</p></div>
//                 }
//             </div>

//             <div>
//                 <div className="flex items-center justify-between mb-4">
//                     <h2 className="text-3xl font-bold tracking-tight">Uploaded Files</h2>
//                     {isAdmin && (
//                         <label className="bg-teal-600 px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 hover:bg-teal-500 transition-all duration-200 font-semibold text-sm transform hover:-translate-y-0.5 shadow-lg hover:shadow-teal-500/20">
//                             <Upload size={16} /> Upload File
//                             <input type="file" onChange={handleFileSelect} hidden />
//                         </label>
//                     )}
//                 </div>
//                 {loading ? <div className="flex justify-center py-10"><Loader2 className="animate-spin text-teal-500" size={32} /></div> :
//                     uploadedFiles.length > 0 ? (
//                         <div className="bg-slate-800/50 rounded-xl p-3">
//                             {uploadedFiles.map(doc => (
//                                 <div key={doc._id} className="grid grid-cols-6 items-center gap-4 p-3 rounded-lg hover:bg-slate-700/50 transition-colors">
//                                     <div className="font-semibold truncate col-span-3 flex items-center gap-3"><Upload size={16} className="text-slate-400 flex-shrink-0" /> {doc.name}</div>
//                                     <div className="text-sm text-slate-400 text-center col-span-1">by {doc.uploadedBy?.name || 'Unknown'}</div>
//                                     <div className="text-sm text-slate-500 text-center col-span-1">{new Date(doc.createdAt).toLocaleDateString()}</div>
//                                     <div className="flex justify-end items-center gap-4">
//                                         <a href={`${SOCKET_URL}${doc.fileUrl}`} target="_blank" rel="noreferrer" className="text-teal-400 hover:text-teal-300 p-2 rounded-full hover:bg-slate-700"><Download size={16} /></a>
//                                         {isAdmin && (<button onClick={() => onDelete(doc._id)} className="text-red-500 hover:text-red-400 p-2 rounded-full hover:bg-slate-700"><Trash2 size={16} /></button>)}
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     ) : <div className="text-center py-10 bg-slate-800/50 rounded-xl border border-dashed border-slate-700"><h3 className="font-semibold text-xl">No Files Uploaded</h3><p className="text-slate-400 mt-2 text-sm">Upload your first file to share with the team.</p></div>
//                 }
//             </div>
//         </div>
//     );
// };

// const ChatPanel = ({ workspaceId, token, currentUser, socket, initialMessages }) => {
//     const [messages, setMessages] = useState(() => initialMessages || []);
//     const [newMessage, setNewMessage] = useState("");
//     const messagesEndRef = useRef(null);

//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     };

//     useEffect(() => {
//         setMessages(initialMessages || []);
//     }, [initialMessages]);

//     useEffect(() => {
//         if (!socket) return;

//         const handleReceiveMessage = (message) => {
//             if (!message) return;
//             console.log("socket receiveMessage:", message);
//             setMessages(prev => [...prev, message]);
//         };

//         socket.on("receiveMessage", handleReceiveMessage);
//         return () => {
//             socket.off("receiveMessage", handleReceiveMessage);
//         };
//     }, [socket]);

//     useEffect(() => {
//         scrollToBottom();
//     }, [messages]);

//     const handleSendMessage = (e) => {
//         e.preventDefault();
//         if (newMessage.trim() && socket) {
//             socket.emit("sendMessage", { content: newMessage, workspaceId });
//             setNewMessage("");
//         }
//     };

//     return (
//         <div className="p-8 flex-1 flex flex-col animate-fade-in">
//             <h2 className="text-3xl font-bold mb-4 tracking-tight">Team Chat</h2>
//             <div className="flex-1 bg-slate-800/50 rounded-xl p-4 overflow-y-auto space-y-4 custom-scrollbar">
//                 {(messages || []).filter(Boolean).map((msg, idx) => {
//                     const id = msg._id ?? `msg-fallback-${idx}`;
//                     const sender = msg.sender ?? { _id: null, name: "Unknown" };
//                     const isCurrentUser = !!(currentUser && (currentUser._id === sender._id || currentUser._id === sender.id));
//                     const initial = (sender.name && typeof sender.name === "string") ? sender.name.charAt(0).toUpperCase() : "?";
//                     const displayName = sender.name || "Unknown";

//                     return (
//                         <div key={id} className={`flex gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
//                             <div className={`flex items-start gap-3 max-w-md ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
//                                 <div className="w-9 h-9 rounded-full bg-teal-500/80 flex items-center justify-center font-bold flex-shrink-0 text-sm border-2 border-slate-600">
//                                     {initial}
//                                 </div>
//                                 <div className={`p-3 rounded-lg ${isCurrentUser ? 'bg-teal-600/80 rounded-br-none' : 'bg-slate-700/80 rounded-bl-none'}`}>
//                                     <p className="font-semibold text-sm">{displayName}</p>
//                                     <p className="text-white mt-1 break-words">{msg.content}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     );
//                 })}
//                 <div ref={messagesEndRef} />
//             </div>

//             <form onSubmit={handleSendMessage} className="flex items-center gap-3 mt-4">
//                 <input
//                     value={newMessage}
//                     onChange={e => setNewMessage(e.target.value)}
//                     placeholder="Type a message..."
//                     className="flex-1 px-4 py-3 rounded-lg bg-slate-700 border border-transparent focus:border-teal-500 focus:ring-0 transition outline-none"
//                 />
//                 <button type="submit" className="bg-teal-600 p-3 rounded-lg font-semibold hover:bg-teal-500 transition-all duration-200 shadow-lg hover:shadow-teal-500/20 transform hover:-translate-y-0.5">
//                     <Send size={20} />
//                 </button>
//             </form>
//         </div>
//     );
// };


// const DocumentEditorPanel = ({ documentId, socket, onBack }) => {
//     const quillRef = useRef();
//     const wrapperRef = useCallback((wrapper) => {
//         if (wrapper == null) return;
//         wrapper.innerHTML = "";
//         const editor = document.createElement("div");
//         wrapper.append(editor);
//         if (window.Quill) {
//             const q = new window.Quill(editor, {
//                 theme: "snow",
//                 modules: { toolbar: [[{ header: [1, 2, 3, false] }], ['bold', 'italic', 'underline'], ['link'], [{ list: 'ordered' }, { list: 'bullet' }]] }
//             });
//             quillRef.current = q;
//         }
//     }, []);

//     useEffect(() => {
//         if (!socket || !quillRef.current) return;

//         socket.once("load-document", documentData => {
//             quillRef.current.setContents(documentData);
//             quillRef.current.enable();
//         });

//         socket.emit("join-document", documentId);

//         const receiveHandler = (delta) => { quillRef.current.updateContents(delta); };
//         socket.on("receive-changes", receiveHandler);

//         const textChangeHandler = (delta, oldDelta, source) => { if (source !== 'user') return; socket.emit("send-changes", delta, documentId); };
//         quillRef.current.on('text-change', textChangeHandler);

//         const saveInterval = setInterval(() => {
//             socket.emit("save-document", { documentId, data: quillRef.current.getContents() });
//         }, 2000);

//         return () => {
//             socket.off("receive-changes", receiveHandler);
//             if (quillRef.current) { quillRef.current.off('text-change', textChangeHandler); }
//             clearInterval(saveInterval);
//         };
//     }, [socket, documentId]);

//     return (
//         <div className="p-8 flex-1 flex flex-col animate-fade-in">
//             <div className="flex items-center gap-4 mb-4">
//                 <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-lg transition-colors"><ArrowLeft size={16} /> Back to Documents</button>
//             </div>
//             <div className="bg-white text-black rounded-lg overflow-hidden flex-1 quill-container ring-1 ring-slate-700">
//                 <div ref={wrapperRef} style={{ height: "100%" }}></div>
//             </div>
//         </div>
//     );
// };


// // --- Main Workspace Page Component ---

// const WorkspacePage = () => {
//     const { id: workspaceId } = useParams();
//     const navigate = useNavigate();
//     const [workspace, setWorkspace] = useState(null);
//     const [currentUser, setCurrentUser] = useState(null);
//     const [tasks, setTasks] = useState([]);
//     const [documents, setDocuments] = useState([]);
//     const [chatMessages, setChatMessages] = useState([]);
//     const [columns, setColumns] = useState(null);
//     const [loading, setLoading] = useState({ page: true, tasks: false, docs: false });
//     const [activeTab, setActiveTab] = useState("kanban");
//     const [activeDocument, setActiveDocument] = useState(null);
//     const [modal, setModal] = useState({ type: null, props: {} });
//     const [socket, setSocket] = useState(null);

//     const token = localStorage.getItem("token");

//     const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

//     const isAdmin = useMemo(() => currentUser?._id === workspace?.createdBy?._id, [currentUser, workspace]);

//     // --- Data Fetching ---
//     const fetchWorkspaceAndMembers = async () => { try { const res = await axios.get(`${BACKEND_URL}/workspaces/${workspaceId}`, { headers: { Authorization: `Bearer ${token}` } }); setWorkspace(res.data); } catch (err) { if (err.response?.status === 401 || err.response?.status === 404) navigate("/"); } };
    
//     useEffect(() => {
//         const quillCssId = 'quill-css';
//         const quillJsId = 'quill-js';

//         if (!document.getElementById(quillCssId)) {
//             const quillCss = document.createElement('link');
//             quillCss.id = quillCssId;
//             quillCss.rel = 'stylesheet';
//             quillCss.href = 'https://cdn.jsdelivr.net/npm/quill@2.0.0/dist/quill.snow.css';
//             document.head.appendChild(quillCss);
//         }
        
//         if (!document.getElementById(quillJsId)) {
//             const quillScript = document.createElement('script');
//             quillScript.id = quillJsId;
//             quillScript.src = 'https://cdn.jsdelivr.net/npm/quill@2.0.0/dist/quill.js';
//             quillScript.async = true;
//             document.body.appendChild(quillScript);
//         }
//     }, []);

//     useEffect(() => { if (!token) { navigate("/"); return; } const fetchAll = async () => { setLoading({ page: true, tasks: true, docs: true }); try { const [wsRes, tasksRes, docsRes, userRes, chatRes] = await Promise.all([axios.get(`${BACKEND_URL}/workspaces/${workspaceId}`, { headers: { Authorization: `Bearer ${token}` } }), axios.get(`${BACKEND_URL}/tasks/${workspaceId}`, { headers: { Authorization: `Bearer ${token}` } }), axios.get(`${BACKEND_URL}/documents/${workspaceId}`, { headers: { Authorization: `Bearer ${token}` } }), axios.get(`${BACKEND_URL}/users/me`, { headers: { Authorization: `Bearer ${token}` } }), axios.get(`${BACKEND_URL}/chat/${workspaceId}`, { headers: { Authorization: `Bearer ${token}` } })]); setWorkspace(wsRes.data); setTasks(tasksRes.data || []); setDocuments(docsRes.data || []); setCurrentUser(userRes.data); setChatMessages(chatRes.data || []); } catch (err) { navigate("/"); } finally { setLoading({ page: false, tasks: false, docs: false }); } }; fetchAll(); }, [workspaceId, token, navigate]);

//     // --- Socket Connection & Event Handlers ---
//     useEffect(() => {
//         if (!token) return;
//         const newSocket = io(`${SOCKET_URL}`, { auth: { token } });
//         setSocket(newSocket);

//         newSocket.on('connect', () => {
//             newSocket.emit("joinWorkspace", workspaceId);
//         });

//         const handleReceiveMessage = (message) => {
//             setChatMessages((prevMessages) => [...prevMessages, message]);
//         };

//         const handleTaskUpdated = (updatedTask) => {
//             if (updatedTask.deleted) {
//                 setTasks(prev => prev.filter(t => t._id !== updatedTask._id));
//             } else {
//                 setTasks(prev => {
//                     const exists = prev.some(t => t._id === updatedTask._id);
//                     if (exists) {
//                         return prev.map(t => t._id === updatedTask._id ? updatedTask : t);
//                     }
//                     return [...prev, updatedTask];
//                 });
//             }
//         };

//         const handleDocUpdated = (payload) => {
//             const doc = payload.doc || payload;
//             if (doc.deleted) {
//                 setDocuments(prev => prev.filter(d => d._id !== doc.docId));
//             } else if (doc._id) {
//                 setDocuments(prev => {
//                     const exists = prev.some(d => d._id === doc._id);
//                     if (exists) return prev.map(d => (d._id === doc._id ? doc : d));
//                     return [...prev, doc];
//                 });
//             }
//         };

//         newSocket.on("receiveMessage", handleReceiveMessage);
//         newSocket.on("taskUpdated", handleTaskUpdated);
//         newSocket.on("docUpdated", handleDocUpdated);

//         return () => {
//             newSocket.off("receiveMessage", handleReceiveMessage);
//             newSocket.off("taskUpdated", handleTaskUpdated);
//             newSocket.off("docUpdated", handleDocUpdated);
//             newSocket.disconnect();
//         };
//     }, [token, workspaceId]);

//     // Rebuild columns when tasks change
//     useEffect(() => { if (!tasks) return; setColumns({ "To Do": { name: "To Do", items: tasks.filter(t => t.status === "To Do") }, "In Progress": { name: "In Progress", items: tasks.filter(t => t.status === "In Progress") }, "Completed": { name: "Completed", items: tasks.filter(t => t.status === "Completed") } }); }, [tasks]);

//     // --- API Actions ---
//     const createTask = async (data) => { try { const res = await axios.post(`${BACKEND_URL}/tasks`, data, { headers: { Authorization: `Bearer ${token}` } }); if (socket) socket.emit("taskUpdated", res.data); closeModal(); } catch (err) { alert("Failed to create task"); console.log(err) } };
//     const updateTask = async (taskId, patch) => { try { const res = await axios.put(`${BACKEND_URL}/tasks/${taskId}`, patch, { headers: { Authorization: `Bearer ${token}` } }); if (socket) socket.emit("taskUpdated", res.data); closeModal(); } catch (err) { alert("Failed to update task"); } };
//     const deleteTask = (taskId) => { openModal("confirm", { title: "Delete Task?", message: "Are you sure you want to permanently delete this task?", onConfirm: async () => { try { await axios.delete(`${BACKEND_URL}/tasks/${taskId}`, { headers: { Authorization: `Bearer ${token}` } }); if (socket) socket.emit("taskUpdated", { _id: taskId, deleted: true, workspace: workspaceId }); closeModal(); } catch (err) { alert("Failed to delete task"); } } }); };
//     const inviteMember = async (email) => { try { await axios.post(`${BACKEND_URL}/workspaces/${workspaceId}/members`, { email }, { headers: { Authorization: `Bearer ${token}` } }); fetchWorkspaceAndMembers(); } catch (err) { alert(err.response?.data?.message || "Failed to invite member."); } };
//     const removeMember = (userId) => { openModal("confirm", { title: "Remove Member?", message: "Are you sure you want to remove this member from the workspace?", onConfirm: async () => { try { closeModal(); await axios.delete(`${BACKEND_URL}/workspaces/${workspaceId}/members/${userId}`, { headers: { Authorization: `Bearer ${token}` } }); setWorkspace(prev => ({ ...prev, members: prev.members.filter(m => m._id !== userId) })); } catch (err) { alert("Failed to remove member."); } } }); };
//     const updateWorkspace = async (patch) => { try { const res = await axios.put(`${BACKEND_URL}/workspaces/${workspaceId}`, patch, { headers: { Authorization: `Bearer ${token}` } }); setWorkspace(res.data); closeModal(); } catch (err) { alert("Failed to update workspace."); } };
//     const uploadDocument = async (file) => { const formData = new FormData(); formData.append("file", file); try { const res = await axios.post(`${BACKEND_URL}/documents/${workspaceId}`, formData, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }); if (socket) socket.emit("docUpdated", { doc: res.data, workspaceId }); } catch (err) { alert("File upload failed"); } };
//     const createTextDocument = async (title) => { try { const res = await axios.post(`${BACKEND_URL}/documents/text`, { title, workspaceId }, { headers: { Authorization: `Bearer ${token}` } }); if (socket) socket.emit("docUpdated", { doc: res.data, workspaceId }); setActiveDocument(res.data._id); closeModal(); } catch (err) { alert("Failed to create document."); } };
//     const deleteDocument = (docId) => { openModal("confirm", { title: "Delete Document?", message: "Are you sure you want to permanently delete this file?", onConfirm: async () => { try { await axios.delete(`${BACKEND_URL}/documents/${docId}`, { headers: { Authorization: `Bearer ${token}` } }); if (socket) socket.emit("docUpdated", { docId: docId, deleted: true, workspaceId }); closeModal(); } catch (err) { alert("Failed to delete document"); } } }); };
//     const deleteWorkspace = () => { openModal("confirm", { title: "Delete Workspace?", message: "This action is irreversible and will delete all associated tasks, documents, and chat messages.", onConfirm: async () => { try { await axios.delete(`${BACKEND_URL}/workspaces/${workspaceId}`, { headers: { Authorization: `Bearer ${token}` } }); navigate(`/dashboard/${currentUser?._id}`); } catch (err) { alert("Failed to delete workspace."); } } }); };
//     const handleSendHelp = async (message) => { try { await axios.post(`${BACKEND_URL}/help/${workspaceId}`, { message }, { headers: { Authorization: `Bearer ${token}` } }); closeModal(); openModal("success", { title: "Request Sent", message: "Your help request has been sent to the workspace admin." }); } catch (err) { alert("Failed to send help request."); } };
//     const findContainer = (id) => { if (columns && columns[id]) return id; return columns ? Object.keys(columns).find((key) => columns[key].items.find((item) => item._id === id)) : null; };
//     const handleDragEnd = (event) => { const { active, over } = event; if (!over) return; const activeId = active.id; const overId = over.id; const activeContainer = findContainer(activeId); const overContainer = findContainer(overId) || (columns[overId] ? overId : null); if (!activeContainer || !overContainer || active.id === over.id) return; const originalTasks = [...tasks]; if (activeContainer === overContainer) { const taskList = columns[activeContainer].items; const oldIndex = taskList.findIndex(t => t._id === activeId); const newIndex = taskList.findIndex(t => t._id === overId); if (oldIndex === -1 || newIndex === -1) return; const reorderedTasksInColumn = arrayMove(taskList, oldIndex, newIndex); const otherTasks = tasks.filter(t => t.status !== activeContainer); setTasks([...otherTasks, ...reorderedTasksInColumn]); } else { const updatedTask = tasks.find(t => t._id === activeId); updatedTask.status = overContainer; updateTask(activeId, { status: overContainer }); } };
//     const openModal = (type, props = {}) => setModal({ type, props });
//     const closeModal = () => setModal({ type: null, props: {} });

//     const renderTabContent = () => {
//         if (activeTab === 'docs' && activeDocument) {
//             return <DocumentEditorPanel documentId={activeDocument} socket={socket} onBack={() => setActiveDocument(null)} />;
//         }
//         switch (activeTab) {
//             case 'kanban':
//                 return (
//                     <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
//                         <div className="flex gap-6 h-full p-8 overflow-x-auto custom-scrollbar">
//                             {columns && Object.entries(columns).map(([colId, col]) => (
//                                 <div key={colId} className="w-80 flex-shrink-0 bg-slate-800/60 rounded-xl flex flex-col shadow-inner">
//                                     <h3 className="font-semibold text-lg mb-3 px-4 pt-4 pb-3 border-b-2 border-slate-700/50">{col.name} <span className="text-slate-400 text-sm">({col.items.length})</span></h3>
//                                     <SortableContext items={col.items.map(i => i._id)} strategy={verticalListSortingStrategy}>
//                                         <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar">
//                                             {col.items.map(item => <TaskCard key={item._id} task={item} onOpenEdit={(t) => openModal("editTask", { task: t })} />)}
//                                         </div>
//                                     </SortableContext>
//                                 </div>
//                             ))}
//                         </div>
//                     </DndContext>
//                 );
//             case 'docs':
//                 return <DocumentsPanel documents={documents} onUpload={uploadDocument} onDelete={deleteDocument} loading={loading.docs} onOpenEditor={setActiveDocument} onOpenCreate={() => openModal('createDocument')} isAdmin={isAdmin} />;
//             case 'chat':
//                 return <ChatPanel workspaceId={workspaceId} token={token} currentUser={currentUser} socket={socket} initialMessages={chatMessages} />;
//             default: return null;
//         }
//     };

//     if (loading.page || !workspace) {
//         return <div className="min-h-screen flex items-center justify-center bg-slate-900"><Loader2 className="animate-spin text-teal-500" size={40} /></div>;
//     }

//     return (
//         <div className="font-sans min-h-screen bg-gradient-to-br from-slate-900 to-gray-900 text-white flex">
//             {modal.type === "createTask" && <CreateTaskModal close={closeModal} onCreate={createTask} workspaceId={workspaceId} members={workspace.members} />}
//             {modal.type === "editTask" && <EditTaskModal close={closeModal} task={modal.props.task} members={workspace.members} onUpdate={updateTask} onDelete={deleteTask} isAdmin={isAdmin} />}
//             {modal.type === "members" && <MembersModal close={closeModal} members={workspace.members} onInvite={inviteMember} onRemove={removeMember} isAdmin={isAdmin} />}
//             {modal.type === "settings" && <SettingsModal close={closeModal} workspace={workspace} onUpdate={updateWorkspace} onDeleteWorkspace={deleteWorkspace} isAdmin={isAdmin} />}
//             {modal.type === "confirm" && <ConfirmModal close={closeModal} {...modal.props} />}
//             {modal.type === "createDocument" && <CreateDocumentModal close={closeModal} onCreate={createTextDocument} />}
//             {modal.type === "help" && <HelpModal close={closeModal} onSend={handleSendHelp} />}
//             {modal.type === "success" && <SuccessModal close={closeModal} {...modal.props} />}

//             <aside className="w-64 bg-slate-800/50 backdrop-blur-sm p-6 hidden md:flex flex-col border-r border-slate-700/50">
//                 <Link to={`/Dashboard/${currentUser?._id}`} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8 transition-colors"><ArrowLeft size={16} /> Back to Dashboard</Link>
//                 <div className="mb-8">
//                     <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-400">{workspace.name}</h2>
//                     <p className="text-sm text-slate-400 line-clamp-3 mt-1">{workspace.description}</p>
//                 </div>
//                 <nav className="flex flex-col gap-2">
//                     <button onClick={() => { setActiveTab("kanban"); setActiveDocument(null); }} className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-left ${activeTab === 'kanban' ? 'bg-teal-500/20 text-teal-300 font-semibold border-l-2 border-teal-400' : 'hover:bg-slate-700/50 text-slate-300'}`}><CheckSquare size={18} /> Kanban Board</button>
//                     <button onClick={() => { setActiveTab("docs"); setActiveDocument(null); }} className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-left ${activeTab === 'docs' && !activeDocument ? 'bg-teal-500/20 text-teal-300 font-semibold border-l-2 border-teal-400' : 'hover:bg-slate-700/50 text-slate-300'}`}><FileText size={18} /> Documents</button>
//                     <button onClick={() => { setActiveTab("chat"); setActiveDocument(null); }} className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-left ${activeTab === 'chat' ? 'bg-teal-500/20 text-teal-300 font-semibold border-l-2 border-teal-400' : 'hover:bg-slate-700/50 text-slate-300'}`}><MessageSquare size={18} /> Chat</button>
//                     <div className="border-t border-slate-700/50 my-2"></div>
//                     <button onClick={() => openModal("members")} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/50 transition-colors text-slate-300"><Users size={18} /> Members</button>
//                     {isAdmin && (<button onClick={() => openModal("settings")} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/50 transition-colors text-slate-300"><Settings size={18} /> Settings</button>)}
//                     {!isAdmin && (<button onClick={() => openModal("help")} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/50 transition-colors text-slate-300"><LifeBuoy size={18} /> Help & Support</button>)}
//                 </nav>
//             </aside>

//             <main className="flex-1 flex flex-col">
//                 <header className="bg-slate-900/30 flex items-center justify-between px-8 py-5 border-b border-slate-700/50">
//                     <h1 className="text-2xl font-bold tracking-wide">{workspace.name} / <span className="text-teal-400">{activeDocument ? 'Editor' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span></h1>
//                     {activeTab === 'kanban' && <button onClick={() => openModal("createTask")} className="bg-teal-600 px-4 py-2 rounded-lg flex items-center gap-2 font-semibold hover:bg-teal-500 transition-all duration-200 text-sm shadow-lg hover:shadow-teal-500/20 transform hover:-translate-y-0.5"><Plus size={16} /> New Task</button>}
//                 </header>

//                 <div className="flex-1 flex flex-col overflow-y-auto">
//                     {renderTabContent()}
//                 </div>
//             </main>
//         </div>
//     );
// };

// export default WorkspacePage;



import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
    Plus, X, Loader2, MessageSquare, CheckSquare, FileText,
    Users, Settings, ArrowLeft, Edit3, Trash2, UserPlus, Upload, Send, Download, LifeBuoy
} from "lucide-react";
import axios from "axios";
import { io } from "socket.io-client";
import {BACKEND_URL } from '../../utilities/constants.js'
import { SOCKET_URL } from "../../utilities/constants.js";


const ModalShell = ({ children, close }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[60] flex justify-center items-center p-4">
        <div className="bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl p-6 w-full max-w-lg relative animate-fade-in-up">
            <button
                onClick={close}
                className="absolute top-3 right-3 text-slate-500 hover:text-white transition-colors hover:bg-slate-700 rounded-full p-1"
            >
                <X size={24} />
            </button>
            {children}
        </div>
    </div>
);

const SuccessModal = ({ close, title, message }) => (
    <ModalShell close={close}>
        <h2 className="text-xl sm:text-2xl font-bold mb-3 text-teal-400">{title}</h2>
        <p className="text-slate-300 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
            <button onClick={close} className="px-5 py-2 rounded-lg font-semibold bg-teal-600 hover:bg-teal-500 transition-all duration-200 shadow-lg hover:shadow-teal-500/20 transform hover:-translate-y-0.5">Close</button>
        </div>
    </ModalShell>
);


const CreateTaskModal = ({ close, onCreate, workspaceId, members }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("To Do");
    const [assignedTo, setAssignedTo] = useState("");

    const submit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onCreate({ title, description, status, assignedTo: assignedTo || null, workspace: workspaceId });
    };

    return (
        <ModalShell close={close}>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">Create New Task</h2>
            <form onSubmit={submit} className="space-y-4">
                <input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Task Title"
                    className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    required
                />
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Add a description..."
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <select value={status} onChange={e => setStatus(e.target.value)} className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 appearance-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition">
                        <option>To Do</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                    </select>
                    <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)} className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 appearance-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition">
                        <option value="">Unassigned</option>
                        {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                    </select>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={close} className="px-5 py-2 rounded-lg font-semibold bg-slate-600 hover:bg-slate-500 transition-all duration-200 transform hover:-translate-y-0.5">Cancel</button>
                    <button type="submit" className="px-5 py-2 rounded-lg font-semibold bg-teal-600 hover:bg-teal-500 transition-all duration-200 shadow-lg hover:shadow-teal-500/20 transform hover:-translate-y-0.5">Create Task</button>
                </div>
            </form>
        </ModalShell>
    );
};

const EditTaskModal = ({ close, task, members, onUpdate, onDelete, isAdmin }) => {
    const [title, setTitle] = useState(task.title || "");
    const [description, setDescription] = useState(task.description || "");
    const [status, setStatus] = useState(task.status || "To Do");
    const [assignedTo, setAssignedTo] = useState(task.assignedTo ? task.assignedTo._id : "");

    const submit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onUpdate(task._id, { title, description, status, assignedTo: assignedTo || null });
    };

    return (
        <ModalShell close={close}>
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Edit Task</h2>
            <form onSubmit={submit} className="space-y-4">
                <input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Task Title"
                    className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    required
                />
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Add a description..."
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <select value={status} onChange={e => setStatus(e.target.value)} className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 appearance-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition">
                        <option>To Do</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                    </select>
                    <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)} className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 appearance-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition">
                        <option value="">Unassigned</option>
                        {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                    </select>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center pt-4 gap-4">
                    {isAdmin && (
                        <button type="button" onClick={() => onDelete(task._id)} className="w-full sm:w-auto px-5 py-2 rounded-lg font-semibold bg-red-600 hover:bg-red-500 transition-all duration-200 shadow-lg hover:shadow-red-500/20 transform hover:-translate-y-0.5 text-white">
                            Delete Task
                        </button>
                    )}
                    <div className="flex gap-3 ml-auto w-full sm:w-auto">
                        <button type="button" onClick={close} className="flex-1 sm:flex-none px-5 py-2 rounded-lg font-semibold bg-slate-600 hover:bg-slate-500 transition-all duration-200 transform hover:-translate-y-0.5">Cancel</button>
                        <button type="submit" className="flex-1 sm:flex-none px-5 py-2 rounded-lg font-semibold bg-teal-600 hover:bg-teal-500 transition-all duration-200 shadow-lg hover:shadow-teal-500/20 transform hover:-translate-y-0.5">Save Changes</button>
                    </div>
                </div>
            </form>
        </ModalShell>
    );
};

const ConfirmModal = ({ close, onConfirm, title, message }) => (
    <ModalShell close={close}>
        <h2 className="text-xl sm:text-2xl font-bold mb-3">{title}</h2>
        <p className="text-slate-300 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
            <button type="button" onClick={close} className="px-5 py-2 rounded-lg font-semibold bg-slate-600 hover:bg-slate-500 transition-all duration-200 transform hover:-translate-y-0.5">Cancel</button>
            <button onClick={onConfirm} className="px-5 py-2 rounded-lg font-semibold bg-red-600 hover:bg-red-500 transition-all duration-200 shadow-lg hover:shadow-red-500/20 transform hover:-translate-y-0.5 text-white">Confirm</button>
        </div>
    </ModalShell>
);

const MembersModal = ({ close, members, onInvite, onRemove, isAdmin }) => {
    const [email, setEmail] = useState("");
    const handleInvite = (e) => {
        e.preventDefault();
        if (!email.trim()) return;
        onInvite(email);
        setEmail("");
    };

    return (
        <ModalShell close={close}>
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Manage Members</h2>
            {isAdmin && (
                <form onSubmit={handleInvite} className="mb-4">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Invite user by email"
                            className="flex-1 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                            required
                        />
                        <button type="submit" className="bg-teal-600 p-2 rounded-lg font-semibold hover:bg-teal-500 transition-all duration-200 shadow-lg hover:shadow-teal-500/20 transform hover:-translate-y-0.5">
                            <UserPlus size={20} />
                        </button>
                    </div>
                </form>
            )}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {members.map(m => (
                    <div key={m._id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <div>
                            <div className="font-semibold text-sm sm:text-base">{m.name}</div>
                            <div className="text-xs text-slate-400">{m.email}</div>
                        </div>
                        {isAdmin && (
                            <button onClick={() => onRemove(m._id)} className="text-red-500 hover:text-red-400 p-1">
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </ModalShell>
    );
};

const SettingsModal = ({ close, workspace, onUpdate, onDeleteWorkspace, isAdmin }) => {
    const [name, setName] = useState(workspace.name || "");
    const [description, setDescription] = useState(workspace.description || "");

    const submit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onUpdate({ name, description });
    };

    return (
        <ModalShell close={close}>
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Workspace Settings</h2>
            <form onSubmit={submit} className="space-y-4">
                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Workspace name"
                    className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    required
                />
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Description"
                    className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    rows={4}
                />
                <div className="flex flex-col sm:flex-row justify-between items-center pt-2 gap-4">
                    <button type="button" onClick={onDeleteWorkspace} className="text-red-500 hover:underline text-sm font-semibold w-full sm:w-auto text-center sm:text-left">
                        Delete Workspace
                    </button>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <button type="button" onClick={close} className="flex-1 sm:flex-none px-5 py-2 rounded-lg font-semibold bg-slate-600 hover:bg-slate-500 transition-all duration-200 transform hover:-translate-y-0.5">Cancel</button>
                        <button type="submit" className="flex-1 sm:flex-none px-5 py-2 rounded-lg font-semibold bg-teal-600 hover:bg-teal-500 transition-all duration-200 shadow-lg hover:shadow-teal-500/20 transform hover:-translate-y-0.5">Save Changes</button>
                    </div>
                </div>
            </form>
        </ModalShell>
    );
};

const CreateDocumentModal = ({ close, onCreate }) => {
    const [title, setTitle] = useState("");
    const submit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onCreate(title);
    };

    return (
        <ModalShell close={close}>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">Create New Document</h2>
            <form onSubmit={submit} className="space-y-4">
                <input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Document Title"
                    className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    required
                />
                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={close} className="px-5 py-2 rounded-lg font-semibold bg-slate-600 hover:bg-slate-500 transition-all duration-200 transform hover:-translate-y-0.5">Cancel</button>
                    <button type="submit" className="px-5 py-2 rounded-lg font-semibold bg-teal-600 hover:bg-teal-500 transition-all duration-200 shadow-lg hover:shadow-teal-500/20 transform hover:-translate-y-0.5">Create Document</button>
                </div>
            </form>
        </ModalShell>
    );
};

const HelpModal = ({ close, onSend }) => {
    const [message, setMessage] = useState("");
    const submit = (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        onSend(message);
    };

    return (
        <ModalShell close={close}>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">Help & Support</h2>
            <p className="text-slate-400 text-sm mb-4">Describe your issue below. A request will be sent to the workspace administrator.</p>
            <form onSubmit={submit} className="space-y-4">
                <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="How can we help you?"
                    rows={5}
                    className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    required
                />
                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={close} className="px-5 py-2 rounded-lg font-semibold bg-slate-600 hover:bg-slate-500 transition-all duration-200 transform hover:-translate-y-0.5">Cancel</button>
                    <button type="submit" className="px-5 py-2 rounded-lg font-semibold bg-teal-600 hover:bg-teal-500 transition-all duration-200 shadow-lg hover:shadow-teal-500/20 transform hover:-translate-y-0.5">Send Request</button>
                </div>
            </form>
        </ModalShell>
    );
};

const TaskCard = ({ task, onOpenEdit }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : "auto",
        boxShadow: isDragging ? "0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)" : ""
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={`bg-slate-800 p-4 rounded-lg mb-3 shadow-lg border border-slate-700/80 hover:border-teal-500/50 cursor-grab active:cursor-grabbing transition-all duration-200 ${isDragging ? "ring-2 ring-teal-500 shadow-2xl" : "hover:shadow-xl"}`}>
            <div className="flex justify-between items-start">
                <div className="flex-1 mr-2">
                    <p className="font-semibold text-white leading-snug">{task.title}</p>
                    <p className="text-xs text-slate-400 mt-2">{task.assignedTo ? `Assigned to: ${task.assignedTo.name}` : "Unassigned"}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); onOpenEdit(task) }} className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-600 transition-colors">
                    <Edit3 size={14} />
                </button>
            </div>
        </div>
    );
};

const DocumentsPanel = ({ documents, onUpload, onDelete, loading, onOpenEditor, onOpenCreate, isAdmin }) => {
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            onUpload(file);
            e.target.value = null;
        }
    };

    const textDocs = documents.filter(d => d.isTextDocument);
    const uploadedFiles = documents.filter(d => !d.isTextDocument);

    return (
        <div className="p-4 sm:p-8 flex-1 space-y-8 animate-fade-in">
            <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between mb-4 gap-4">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Collaborative Docs</h2>
                    {isAdmin && (
                        <button onClick={onOpenCreate} className="bg-slate-700 px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 hover:bg-slate-600 transition-all duration-200 font-semibold text-sm transform hover:-translate-y-0.5 shadow-lg">
                            <Plus size={16} /> New Document
                        </button>
                    )}
                </div>
                {loading ? <div className="flex justify-center py-10"><Loader2 className="animate-spin text-teal-500" size={32} /></div> :
                    textDocs.length > 0 ? (
                        <div className="bg-slate-800/50 rounded-xl p-2 sm:p-3">
                            {textDocs.map(doc => (
                                <div key={doc._id} className="grid grid-cols-1 sm:grid-cols-6 items-start sm:items-center gap-2 sm:gap-4 p-3 rounded-lg hover:bg-slate-700/50 transition-colors">
                                    <button onClick={() => onOpenEditor(doc._id)} className="font-semibold hover:text-teal-400 truncate sm:col-span-3 flex items-center gap-3 text-left">
                                        <FileText size={16} className="text-teal-400 flex-shrink-0" /> {doc.name}
                                    </button>
                                    <div className="text-xs text-slate-400 sm:text-center sm:col-span-1">by {doc.uploadedBy?.name || 'Unknown'}</div>
                                    <div className="text-xs text-slate-500 sm:text-center sm:col-span-1">{new Date(doc.createdAt).toLocaleDateString()}</div>
                                    <div className="flex justify-end items-center sm:col-span-1">
                                        {isAdmin && (<button onClick={() => onDelete(doc._id)} className="text-red-500 hover:text-red-400 p-2 rounded-full hover:bg-slate-700"><Trash2 size={16} /></button>)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : <div className="text-center py-10 bg-slate-800/50 rounded-xl border border-dashed border-slate-700"><h3 className="font-semibold text-lg sm:text-xl">No Text Documents</h3><p className="text-slate-400 mt-2 text-sm">Create your first collaborative document.</p></div>
                }
            </div>

            <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between mb-4 gap-4">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Uploaded Files</h2>
                    {isAdmin && (
                        <label className="bg-teal-600 px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 hover:bg-teal-500 transition-all duration-200 font-semibold text-sm transform hover:-translate-y-0.5 shadow-lg hover:shadow-teal-500/20">
                            <Upload size={16} /> Upload File
                            <input type="file" onChange={handleFileSelect} hidden />
                        </label>
                    )}
                </div>
                {loading ? <div className="flex justify-center py-10"><Loader2 className="animate-spin text-teal-500" size={32} /></div> :
                    uploadedFiles.length > 0 ? (
                        <div className="bg-slate-800/50 rounded-xl p-2 sm:p-3">
                            {uploadedFiles.map(doc => (
                                <div key={doc._id} className="grid grid-cols-1 sm:grid-cols-6 items-start sm:items-center gap-2 sm:gap-4 p-3 rounded-lg hover:bg-slate-700/50 transition-colors">
                                    <div className="font-semibold truncate sm:col-span-3 flex items-center gap-3"><Upload size={16} className="text-slate-400 flex-shrink-0" /> {doc.name}</div>
                                    <div className="text-xs text-slate-400 sm:text-center sm:col-span-1">by {doc.uploadedBy?.name || 'Unknown'}</div>
                                    <div className="text-xs text-slate-500 sm:text-center sm:col-span-1">{new Date(doc.createdAt).toLocaleDateString()}</div>
                                    <div className="flex justify-end items-center gap-2 sm:gap-4 sm:col-span-1">
                                        <a href={`${SOCKET_URL}${doc.fileUrl}`} target="_blank" rel="noreferrer" className="text-teal-400 hover:text-teal-300 p-2 rounded-full hover:bg-slate-700"><Download size={16} /></a>
                                        {isAdmin && (<button onClick={() => onDelete(doc._id)} className="text-red-500 hover:text-red-400 p-2 rounded-full hover:bg-slate-700"><Trash2 size={16} /></button>)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : <div className="text-center py-10 bg-slate-800/50 rounded-xl border border-dashed border-slate-700"><h3 className="font-semibold text-lg sm:text-xl">No Files Uploaded</h3><p className="text-slate-400 mt-2 text-sm">Upload your first file to share with the team.</p></div>
                }
            </div>
        </div>
    );
};

const ChatPanel = ({ workspaceId, token, currentUser, socket, initialMessages }) => {
    const [messages, setMessages] = useState(() => initialMessages || []);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        setMessages(initialMessages || []);
    }, [initialMessages]);

    useEffect(() => {
        if (!socket) return;
        const handleReceiveMessage = (message) => {
            if (!message) return;
            setMessages(prev => [...prev, message]);
        };
        socket.on("receiveMessage", handleReceiveMessage);
        return () => {
            socket.off("receiveMessage", handleReceiveMessage);
        };
    }, [socket]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() && socket) {
            socket.emit("sendMessage", { content: newMessage, workspaceId });
            setNewMessage("");
        }
    };

    return (
        <div className="p-4 sm:p-8 flex-1 flex flex-col animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 tracking-tight">Team Chat</h2>
            <div className="flex-1 bg-slate-800/50 rounded-xl p-4 overflow-y-auto space-y-4 custom-scrollbar">
                {(messages || []).filter(Boolean).map((msg, idx) => {
                    const id = msg._id ?? `msg-fallback-${idx}`;
                    const sender = msg.sender ?? { _id: null, name: "Unknown" };
                    const isCurrentUser = !!(currentUser && (currentUser._id === sender._id || currentUser._id === sender.id));
                    const initial = (sender.name && typeof sender.name === "string") ? sender.name.charAt(0).toUpperCase() : "?";
                    const displayName = sender.name || "Unknown";

                    return (
                        <div key={id} className={`flex gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex items-start gap-3 max-w-[80%] sm:max-w-md ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                                <div className="w-9 h-9 rounded-full bg-teal-500/80 flex items-center justify-center font-bold flex-shrink-0 text-sm border-2 border-slate-600">
                                    {initial}
                                </div>
                                <div className={`p-3 rounded-lg ${isCurrentUser ? 'bg-teal-600/80 rounded-br-none' : 'bg-slate-700/80 rounded-bl-none'}`}>
                                    <p className="font-semibold text-sm">{displayName}</p>
                                    <p className="text-white mt-1 break-words">{msg.content}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="flex items-center gap-3 mt-4">
                <input
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 rounded-lg bg-slate-700 border border-transparent focus:border-teal-500 focus:ring-0 transition outline-none"
                />
                <button type="submit" className="bg-teal-600 p-3 rounded-lg font-semibold hover:bg-teal-500 transition-all duration-200 shadow-lg hover:shadow-teal-500/20 transform hover:-translate-y-0.5">
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};


const DocumentEditorPanel = ({ documentId, socket, onBack }) => {
    const quillRef = useRef();
    const wrapperRef = useCallback((wrapper) => {
        if (wrapper == null) return;
        wrapper.innerHTML = "";
        const editor = document.createElement("div");
        wrapper.append(editor);
        if (window.Quill) {
            const q = new window.Quill(editor, {
                theme: "snow",
                modules: { toolbar: [[{ header: [1, 2, 3, false] }], ['bold', 'italic', 'underline'], ['link'], [{ list: 'ordered' }, { list: 'bullet' }]] }
            });
            quillRef.current = q;
        }
    }, []);

    useEffect(() => {
        if (!socket || !quillRef.current) return;
        socket.once("load-document", documentData => {
            quillRef.current.setContents(documentData);
            quillRef.current.enable();
        });
        socket.emit("join-document", documentId);
        const receiveHandler = (delta) => { quillRef.current.updateContents(delta); };
        socket.on("receive-changes", receiveHandler);
        const textChangeHandler = (delta, oldDelta, source) => { if (source !== 'user') return; socket.emit("send-changes", delta, documentId); };
        quillRef.current.on('text-change', textChangeHandler);
        const saveInterval = setInterval(() => {
            socket.emit("save-document", { documentId, data: quillRef.current.getContents() });
        }, 2000);
        return () => {
            socket.off("receive-changes", receiveHandler);
            if (quillRef.current) { quillRef.current.off('text-change', textChangeHandler); }
            clearInterval(saveInterval);
        };
    }, [socket, documentId]);

    return (
        <div className="p-4 sm:p-8 flex-1 flex flex-col animate-fade-in">
            <div className="flex items-center gap-4 mb-4">
                <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-lg transition-colors"><ArrowLeft size={16} /> Back to Documents</button>
            </div>
            <div className="bg-white text-black rounded-lg overflow-hidden flex-1 quill-container ring-1 ring-slate-700">
                <div ref={wrapperRef} style={{ height: "100%" }}></div>
            </div>
        </div>
    );
};

const BottomNav = ({ activeTab, setActiveTab, openModal, isAdmin }) => {
    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    const navItems = [
        { name: "kanban", icon: CheckSquare, label: "Board" },
        { name: "docs", icon: FileText, label: "Docs" },
        { name: "chat", icon: MessageSquare, label: "Chat" },
        { name: "members", icon: Users, label: "Members" }
    ];

    if (isAdmin) {
        navItems.push({ name: "settings", icon: Settings, label: "Settings" });
    } else {
        navItems.push({ name: "help", icon: LifeBuoy, label: "Help" });
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-slate-800/80 backdrop-blur-md border-t border-slate-700 flex justify-around items-center p-2 z-50 md:hidden">
            {navItems.map(item => (
                <button 
                    key={item.name}
                    onClick={() => item.name === 'members' || item.name === 'settings' || item.name === 'help' ? openModal(item.name) : handleTabClick(item.name)} 
                    className={`flex flex-col items-center justify-center gap-1 w-full py-1 rounded-md transition-colors ${activeTab === item.name ? 'text-teal-400' : 'text-slate-400 hover:text-white'}`}
                >
                    <item.icon size={20} />
                    <span className="text-xs">{item.label}</span>
                </button>
            ))}
        </nav>
    );
};


const WorkspacePage = () => {
    const { id: workspaceId } = useParams();
    const navigate = useNavigate();
    const [workspace, setWorkspace] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [columns, setColumns] = useState(null);
    const [loading, setLoading] = useState({ page: true, tasks: false, docs: false });
    const [activeTab, setActiveTab] = useState("kanban");
    const [activeDocument, setActiveDocument] = useState(null);
    const [modal, setModal] = useState({ type: null, props: {} });
    const [socket, setSocket] = useState(null);

    const token = localStorage.getItem("token");

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

    const isAdmin = useMemo(() => currentUser?._id === workspace?.createdBy?._id, [currentUser, workspace]);

    useEffect(() => {
        const quillCssId = 'quill-css';
        const quillJsId = 'quill-js';
        if (!document.getElementById(quillCssId)) { const quillCss = document.createElement('link'); quillCss.id = quillCssId; quillCss.rel = 'stylesheet'; quillCss.href = 'https://cdn.jsdelivr.net/npm/quill@2.0.0/dist/quill.snow.css'; document.head.appendChild(quillCss); }
        if (!document.getElementById(quillJsId)) { const quillScript = document.createElement('script'); quillScript.id = quillJsId; quillScript.src = 'https://cdn.jsdelivr.net/npm/quill@2.0.0/dist/quill.js'; quillScript.async = true; document.body.appendChild(quillScript); }
    }, []);

    useEffect(() => { if (!token) { navigate("/"); return; } const fetchAll = async () => { setLoading({ page: true, tasks: true, docs: true }); try { const [wsRes, tasksRes, docsRes, userRes, chatRes] = await Promise.all([axios.get(`${BACKEND_URL}/workspaces/${workspaceId}`, { headers: { Authorization: `Bearer ${token}` } }), axios.get(`${BACKEND_URL}/tasks/${workspaceId}`, { headers: { Authorization: `Bearer ${token}` } }), axios.get(`${BACKEND_URL}/documents/${workspaceId}`, { headers: { Authorization: `Bearer ${token}` } }), axios.get(`${BACKEND_URL}/users/me`, { headers: { Authorization: `Bearer ${token}` } }), axios.get(`${BACKEND_URL}/chat/${workspaceId}`, { headers: { Authorization: `Bearer ${token}` } })]); setWorkspace(wsRes.data); setTasks(tasksRes.data || []); setDocuments(docsRes.data || []); setCurrentUser(userRes.data); setChatMessages(chatRes.data || []); } catch (err) { navigate("/"); } finally { setLoading({ page: false, tasks: false, docs: false }); } }; fetchAll(); }, [workspaceId, token, navigate]);

    useEffect(() => {
        if (!token) return;
        const newSocket = io(`${SOCKET_URL}`, { auth: { token } });
        setSocket(newSocket);
        newSocket.on('connect', () => newSocket.emit("joinWorkspace", workspaceId));
        const handleTaskUpdated = (updatedTask) => { if (updatedTask.deleted) setTasks(prev => prev.filter(t => t._id !== updatedTask._id)); else setTasks(prev => { const exists = prev.some(t => t._id === updatedTask._id); if (exists) return prev.map(t => t._id === updatedTask._id ? updatedTask : t); return [...prev, updatedTask]; }); };
        const handleDocUpdated = (payload) => { const doc = payload.doc || payload; if (doc.deleted) setDocuments(prev => prev.filter(d => d._id !== doc.docId)); else if (doc._id) setDocuments(prev => { const exists = prev.some(d => d._id === doc._id); if (exists) return prev.map(d => (d._id === doc._id ? doc : d)); return [...prev, doc]; }); };
        newSocket.on("taskUpdated", handleTaskUpdated);
        newSocket.on("docUpdated", handleDocUpdated);
        return () => { newSocket.off("taskUpdated"); newSocket.off("docUpdated"); newSocket.disconnect(); };
    }, [token, workspaceId]);

    useEffect(() => { if (!tasks) return; setColumns({ "To Do": { name: "To Do", items: tasks.filter(t => t.status === "To Do") }, "In Progress": { name: "In Progress", items: tasks.filter(t => t.status === "In Progress") }, "Completed": { name: "Completed", items: tasks.filter(t => t.status === "Completed") } }); }, [tasks]);

    const fetchWorkspaceAndMembers = async () => { try { const res = await axios.get(`${BACKEND_URL}/workspaces/${workspaceId}`, { headers: { Authorization: `Bearer ${token}` } }); setWorkspace(res.data); } catch (err) { if (err.response?.status === 401 || err.response?.status === 404) navigate("/"); } };
    const createTask = async (data) => { try { const res = await axios.post(`${BACKEND_URL}/tasks`, data, { headers: { Authorization: `Bearer ${token}` } }); if (socket) socket.emit("taskUpdated", res.data); closeModal(); } catch (err) { alert("Failed to create task"); } };
    const updateTask = async (taskId, patch) => { try { const res = await axios.put(`${BACKEND_URL}/tasks/${taskId}`, patch, { headers: { Authorization: `Bearer ${token}` } }); if (socket) socket.emit("taskUpdated", res.data); closeModal(); } catch (err) { alert("Failed to update task"); } };
    const deleteTask = (taskId) => openModal("confirm", { title: "Delete Task?", message: "Are you sure?", onConfirm: async () => { try { await axios.delete(`${BACKEND_URL}/tasks/${taskId}`, { headers: { Authorization: `Bearer ${token}` } }); if (socket) socket.emit("taskUpdated", { _id: taskId, deleted: true, workspace: workspaceId }); closeModal(); } catch (err) { alert("Failed to delete task"); } } });
    const inviteMember = async (email) => { try { await axios.post(`${BACKEND_URL}/workspaces/${workspaceId}/members`, { email }, { headers: { Authorization: `Bearer ${token}` } }); fetchWorkspaceAndMembers(); } catch (err) { alert(err.response?.data?.message || "Failed to invite member."); } };
    const removeMember = (userId) => openModal("confirm", { title: "Remove Member?", message: "Are you sure?", onConfirm: async () => { try { closeModal(); await axios.delete(`${BACKEND_URL}/workspaces/${workspaceId}/members/${userId}`, { headers: { Authorization: `Bearer ${token}` } }); setWorkspace(prev => ({ ...prev, members: prev.members.filter(m => m._id !== userId) })); } catch (err) { alert("Failed to remove member."); } } });
    const updateWorkspace = async (patch) => { try { const res = await axios.put(`${BACKEND_URL}/workspaces/${workspaceId}`, patch, { headers: { Authorization: `Bearer ${token}` } }); setWorkspace(res.data); closeModal(); } catch (err) { alert("Failed to update workspace."); } };
    const uploadDocument = async (file) => { const formData = new FormData(); formData.append("file", file); try { const res = await axios.post(`${BACKEND_URL}/documents/${workspaceId}`, formData, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }); if (socket) socket.emit("docUpdated", { doc: res.data, workspaceId }); } catch (err) { alert("File upload failed"); } };
    const createTextDocument = async (title) => { try { const res = await axios.post(`${BACKEND_URL}/documents/text`, { title, workspaceId }, { headers: { Authorization: `Bearer ${token}` } }); if (socket) socket.emit("docUpdated", { doc: res.data, workspaceId }); setActiveDocument(res.data._id); closeModal(); } catch (err) { alert("Failed to create document."); } };
    const deleteDocument = (docId) => openModal("confirm", { title: "Delete Document?", message: "Are you sure?", onConfirm: async () => { try { await axios.delete(`${BACKEND_URL}/documents/${docId}`, { headers: { Authorization: `Bearer ${token}` } }); if (socket) socket.emit("docUpdated", { docId, deleted: true, workspaceId }); closeModal(); } catch (err) { alert("Failed to delete document"); } } });
    const deleteWorkspace = () => openModal("confirm", { title: "Delete Workspace?", message: "This action is irreversible.", onConfirm: async () => { try { await axios.delete(`${BACKEND_URL}/workspaces/${workspaceId}`, { headers: { Authorization: `Bearer ${token}` } }); navigate(`/dashboard/${currentUser?._id}`); } catch (err) { alert("Failed to delete workspace."); } } });
    const handleSendHelp = async (message) => { try { await axios.post(`${BACKEND_URL}/help/${workspaceId}`, { message }, { headers: { Authorization: `Bearer ${token}` } }); closeModal(); openModal("success", { title: "Request Sent", message: "Your help request has been sent." }); } catch (err) { alert("Failed to send help request."); } };
    const findContainer = (id) => { if (columns && columns[id]) return id; return columns ? Object.keys(columns).find((key) => columns[key].items.find((item) => item._id === id)) : null; };
    const handleDragEnd = (event) => { const { active, over } = event; if (!over || active.id === over.id) return; const activeContainer = findContainer(active.id); const overContainer = findContainer(over.id) || (columns[over.id] ? over.id : null); if (!activeContainer || !overContainer) return; if (activeContainer === overContainer) { setTasks(prev => { const taskList = columns[activeContainer].items; const oldIndex = taskList.findIndex(t => t._id === active.id); const newIndex = taskList.findIndex(t => t._id === over.id); return arrayMove(prev, oldIndex, newIndex); }); } else { updateTask(active.id, { status: overContainer }); } };
    const openModal = (type, props = {}) => setModal({ type, props });
    const closeModal = () => setModal({ type: null, props: {} });

    const renderTabContent = () => {
        if (activeTab === 'docs' && activeDocument) {
            return <DocumentEditorPanel documentId={activeDocument} socket={socket} onBack={() => setActiveDocument(null)} />;
        }
        switch (activeTab) {
            case 'kanban':
                return (
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <div className="flex gap-4 sm:gap-6 h-full p-4 sm:p-8 overflow-x-auto custom-scrollbar">
                            {columns && Object.entries(columns).map(([colId, col]) => (
                                <div key={colId} className="w-[80vw] sm:w-80 flex-shrink-0 bg-slate-800/60 rounded-xl flex flex-col shadow-inner">
                                    <h3 className="font-semibold text-base sm:text-lg mb-3 px-4 pt-4 pb-3 border-b-2 border-slate-700/50">{col.name} <span className="text-slate-400 text-sm">({col.items.length})</span></h3>
                                    <SortableContext items={col.items.map(i => i._id)} strategy={verticalListSortingStrategy}>
                                        <div className="flex-1 overflow-y-auto px-2 sm:px-4 pb-4 custom-scrollbar">
                                            {col.items.map(item => <TaskCard key={item._id} task={item} onOpenEdit={(t) => openModal("editTask", { task: t })} />)}
                                        </div>
                                    </SortableContext>
                                </div>
                            ))}
                        </div>
                    </DndContext>
                );
            case 'docs':
                return <DocumentsPanel documents={documents} onUpload={uploadDocument} onDelete={deleteDocument} loading={loading.docs} onOpenEditor={setActiveDocument} onOpenCreate={() => openModal('createDocument')} isAdmin={isAdmin} />;
            case 'chat':
                return <ChatPanel workspaceId={workspaceId} token={token} currentUser={currentUser} socket={socket} initialMessages={chatMessages} />;
            default: return null;
        }
    };

    if (loading.page || !workspace || !currentUser) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-900"><Loader2 className="animate-spin text-teal-500" size={40} /></div>;
    }

    return (
        <div className="font-sans min-h-screen bg-gradient-to-br from-slate-900 to-gray-900 text-white flex">
            {modal.type === "createTask" && <CreateTaskModal close={closeModal} onCreate={createTask} workspaceId={workspaceId} members={workspace.members} />}
            {modal.type === "editTask" && <EditTaskModal close={closeModal} task={modal.props.task} members={workspace.members} onUpdate={updateTask} onDelete={deleteTask} isAdmin={isAdmin} />}
            {modal.type === "members" && <MembersModal close={closeModal} members={workspace.members} onInvite={inviteMember} onRemove={removeMember} isAdmin={isAdmin} />}
            {modal.type === "settings" && <SettingsModal close={closeModal} workspace={workspace} onUpdate={updateWorkspace} onDeleteWorkspace={deleteWorkspace} isAdmin={isAdmin} />}
            {modal.type === "confirm" && <ConfirmModal close={closeModal} {...modal.props} />}
            {modal.type === "createDocument" && <CreateDocumentModal close={closeModal} onCreate={createTextDocument} />}
            {modal.type === "help" && <HelpModal close={closeModal} onSend={handleSendHelp} />}
            {modal.type === "success" && <SuccessModal close={closeModal} {...modal.props} />}

            <aside className="w-64 bg-slate-800/50 backdrop-blur-sm p-6 hidden md:flex flex-col border-r border-slate-700/50">
                <Link to={`/Dashboard/${currentUser?._id}`} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8 transition-colors"><ArrowLeft size={16} /> Back to Dashboard</Link>
                <div className="mb-8">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-400">{workspace.name}</h2>
                    <p className="text-sm text-slate-400 line-clamp-3 mt-1">{workspace.description}</p>
                </div>
                <nav className="flex flex-col gap-2">
                    <button onClick={() => { setActiveTab("kanban"); setActiveDocument(null); }} className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-left ${activeTab === 'kanban' ? 'bg-teal-500/20 text-teal-300 font-semibold border-l-2 border-teal-400' : 'hover:bg-slate-700/50 text-slate-300'}`}><CheckSquare size={18} /> Kanban Board</button>
                    <button onClick={() => { setActiveTab("docs"); setActiveDocument(null); }} className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-left ${activeTab === 'docs' && !activeDocument ? 'bg-teal-500/20 text-teal-300 font-semibold border-l-2 border-teal-400' : 'hover:bg-slate-700/50 text-slate-300'}`}><FileText size={18} /> Documents</button>
                    <button onClick={() => { setActiveTab("chat"); setActiveDocument(null); }} className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-left ${activeTab === 'chat' ? 'bg-teal-500/20 text-teal-300 font-semibold border-l-2 border-teal-400' : 'hover:bg-slate-700/50 text-slate-300'}`}><MessageSquare size={18} /> Chat</button>
                    <div className="border-t border-slate-700/50 my-2"></div>
                    <button onClick={() => openModal("members")} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/50 transition-colors text-slate-300"><Users size={18} /> Members</button>
                    {isAdmin && (<button onClick={() => openModal("settings")} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/50 transition-colors text-slate-300"><Settings size={18} /> Settings</button>)}
                    {!isAdmin && (<button onClick={() => openModal("help")} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/50 transition-colors text-slate-300"><LifeBuoy size={18} /> Help & Support</button>)}
                </nav>
            </aside>

            <main className="flex-1 flex flex-col min-w-0">
                <header className="bg-slate-900/30 flex items-center justify-between px-4 sm:px-8 py-4 border-b border-slate-700/50">
                    <div className="flex-1 truncate">
                        <h1 className="text-lg sm:text-2xl font-bold tracking-wide truncate">{workspace.name} / <span className="text-teal-400">{activeDocument ? 'Editor' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span></h1>
                    </div>
                    {activeTab === 'kanban' && 
                        <button onClick={() => openModal("createTask")} className="bg-teal-600 p-2 sm:px-4 sm:py-2 rounded-lg flex items-center gap-2 font-semibold hover:bg-teal-500 transition-all duration-200 text-sm shadow-lg hover:shadow-teal-500/20 transform hover:-translate-y-0.5">
                            <Plus size={16} /> 
                            <span className="hidden sm:inline">New Task</span>
                        </button>
                    }
                </header>

                <div className="flex-1 flex flex-col overflow-y-auto pb-20 md:pb-0">
                    {renderTabContent()}
                </div>
            </main>
            {currentUser && <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} openModal={openModal} isAdmin={isAdmin} />}
        </div>
    );
};

export default WorkspacePage;