import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, FilePenLine, MessageSquare, Zap, X } from "lucide-react";
import Image1 from "../assets/Image1.png"

const HomePage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('signUp'); // 'signUp' or 'signIn'

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const Modal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 font-sans">
      <div className="bg-slate-800 mt-25 rounded-2xl shadow-2xl shadow-black/50 px-8 py-4 w-full max-w-md relative animate-fade-in-up">
        <button onClick={closeModal} className="absolute top-4 right-4 text-slate-400 hover:text-white transition">
          <X size={24} />
        </button>
        {modalContent === 'signUp' ? <SignUpForm /> : <SignInForm />}
      </div>
    </div>
  );

  const SignUpForm = () => (
    <div>
      <h2 className="text-3xl font-bold text-center text-white mb-2">Get Started with SyncSpace</h2>
      <p className="text-center text-slate-400 mb-8">Create an account to begin collaborating.</p>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
          <input type="text" placeholder="John Doe" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
          <input type="email" placeholder="you@example.com" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
          <input type="password" placeholder="••••••••" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
          <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition appearance-none">
            <option>Member</option>
            <option>Admin</option>
          </select>
        </div>
        <button type="submit" className="w-full py-3 mt-4 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-500 transition shadow-md">Create Account</button>
        <p className="text-center text-sm text-slate-400 pt-4">
          Already have an account? <button type="button" onClick={() => setModalContent('signIn')} className="font-semibold text-teal-500 hover:underline">Sign In</button>
        </p>
      </form>
    </div>
  );

  const SignInForm = () => (
     <div>
      <h2 className="text-3xl font-bold text-center text-white mb-2">Welcome Back</h2>
      <p className="text-center text-slate-400 mb-8">Sign in to access your workspaces.</p>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
          <input type="email" placeholder="you@example.com" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
          <input type="password" placeholder="••••••••" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition" />
        </div>
        <button type="submit" className="w-full py-3 mt-4 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-500 transition shadow-md">Sign In</button>
        <p className="text-center text-sm text-slate-400 pt-4">
          Don't have an account? <button type="button" onClick={() => setModalContent('signUp')} className="font-semibold text-teal-500 hover:underline">Sign Up</button>
        </p>
      </form>
    </div>
  );


  return (
    <div className="font-sans min-h-screen bg-slate-900 text-white flex flex-col items-center">
      {isModalOpen && <Modal />}
      {/* Navbar */}
      <div className="mt-5 bg-slate-800/65 sm:max-w-[1330px] fixed max-w-[350px]
        sm:max-h-[77px] flex flex-col sm:flex-row justify-between items-center w-full 
        px-4 sm:px-10 pt-5 py-4 rounded-2xl z-50 backdrop-blur-sm shadow-2xl shadow-black/30">
        <div>
          <h1
            onClick={() => window.location.reload()}
            className="text-2xl sm:text-3xl font-bold text-white cursor-pointer"
          >
            SyncSpace
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row items-center sm:space-x-4 mt-4 sm:mt-0">
            <button onClick={() => openModal('signIn')} className="text-slate-300 hover:text-white transition font-medium px-3 py-2">Sign In</button>
            <button onClick={() => openModal('signUp')} className="bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-500 transition shadow-md">Sign Up</button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="mt-[155px] sm:mt-20 min-h-[590px] sm:min-h-screen w-full relative flex flex-col justify-center items-center px-4 sm:px-6">
        {/* Teal Glow Background */}
        <div
          className="absolute inset-0 z-0 opacity-80"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 100%, rgba(13, 148, 136, 0.4) 0%, transparent 60%),
              radial-gradient(circle at 50% 100%, rgba(30, 64, 175, 0.3) 0%, transparent 70%)
            `,
          }}
        />
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-center">
          <h1
            className="font-bold leading-tight text-5xl sm:text-7xl max-w-full sm:max-w-4xl tracking-tight
            bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400"
          >
            Where Teamwork Flows, Instantly.
          </h1>
          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-full sm:max-w-3xl">
            Manage projects, share documents, and communicate seamlessly in one unified hub.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6 sm:mt-10">
            <button
              onClick={() => document.getElementById("features").scrollIntoView({ behavior: "smooth" })}
              className="px-6 py-3 cursor-pointer bg-teal-600 text-white rounded-lg text-lg font-semibold shadow-md hover:bg-teal-500 hover:shadow-lg transition duration-300"
            >
              Explore Features
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
<div id="features" className="p-6 mt-22 sm:p-10 sm:pt-2 pt-3 max-w-[1430px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
  {/* Text Content */}
  <div>
    <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
      A Unified Hub for Teams & Projects
    </h2>
    <p className="mt-4 sm:mt-6 text-base sm:text-xl text-slate-300 leading-relaxed">
      <span className="text-teal-500 font-semibold">SyncSpace</span> is a real-time collaborative platform built in a 4-week sprint. 
      It combines task management, document collaboration, and chat—so your team never needs to juggle multiple disconnected tools again.
    </p>

    {/* Features List */}
    <div className="mt-8 sm:mt-10 space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row items-start gap-4 group">
        <div className="p-3 rounded-full bg-teal-500/10 group-hover:bg-teal-500/20 transition">
          <LayoutGrid className="text-teal-500 w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-white">Kanban Task Boards</h3>
          <p className="text-slate-400 text-sm sm:text-base">
            Organize work visually with drag-and-drop boards, assign tasks, and track progress across your team in real time.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start gap-4 group">
        <div className="p-3 rounded-full bg-teal-500/10 group-hover:bg-teal-500/20 transition">
          <FilePenLine className="text-teal-500 w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-white">Collaborative Document Editing</h3>
          <p className="text-slate-400 text-sm sm:text-base">
            Work together on documents with simultaneous editing, live updates, and version history built-in.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start gap-4 group">
        <div className="p-3 rounded-full bg-teal-500/10 group-hover:bg-teal-500/20 transition">
          <MessageSquare className="text-teal-500 w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-white">Integrated Chat & Alerts</h3>
          <p className="text-slate-400 text-sm sm:text-base">
            Keep everyone aligned with workspace-specific chat channels and instant notifications for updates, mentions, and deadlines.
          </p>
        </div>
      </div>
    </div>

    {/* CTA Buttons */}
    <div className="flex flex-col sm:flex-row gap-4 mt-8 sm:mt-12">
      <button
        className="px-6 py-3 cursor-pointer bg-teal-600 hover:bg-teal-500 rounded-lg text-lg font-semibold shadow-lg transition"
        onClick={() => document.querySelector('[class*="bg-slate-950"]').scrollIntoView({ behavior: 'smooth' })}
      >
        View Development Timeline
      </button>
      <a
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-3 text-center cursor-pointer border border-slate-400 hover:bg-slate-800 rounded-lg text-lg font-semibold transition"
      >
        See Code on GitHub
      </a>
    </div>
  </div>

  {/* Image / Illustration Placeholder */}
  <div className="hidden lg:flex justify-center items-center bg-slate-800 rounded-xl p-4 border border-slate-700">
    <img src={Image1} alt="SyncSpace dashboard preview" className="rounded-lg" />
  </div>
</div>

{/* Stats / Trust Section */}
<div className="bg-slate-950/50 rounded-2xl max-w-[330px] shadow-lg shadow-teal-500/20 py-16 sm:py-20 overflow-hidden w-full sm:max-w-[1430px] mx-auto mt-16 sm:mt-24">
  <div className="max-w-6xl mx-auto text-center mb-8 sm:mb-12 relative z-10">
    <h2 className="text-3xl sm:text-4xl font-bold text-white">
      Built in a Focused 4-Week Sprint
    </h2>
    <p className="mt-2 sm:mt-4 text-base sm:text-lg text-slate-400">
      A structured roadmap: authentication, teams, workspaces, tasks, real-time docs, and chat—delivered step by step.
    </p>
  </div>

  <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12 text-center relative z-10">
    <div className="group flex flex-col items-center">
      <Zap className="text-teal-500 w-10 h-10 group-hover:scale-110 transition-transform" />
      <h3 className="text-slate-300 mt-2 font-semibold text-lg">Real-time Collaboration</h3>
      <p className="text-slate-400 text-sm">Powered by Node.js, MongoDB & Socket.IO</p>
    </div>
    <div className="group flex flex-col items-center">
      <div className="text-4xl sm:text-5xl font-extrabold text-teal-500 group-hover:scale-110 transition-transform">
        50%
      </div>
      <p className="text-slate-300 mt-2 font-semibold text-lg">Weeks 1 & 2 Complete</p>
      <p className="text-slate-400 text-sm">Core backend + Kanban + Docs + Chat running</p>
    </div>
  </div>
</div>


      {/* Final CTA */}
      <div className="flex flex-col items-center justify-center py-16 sm:py-20 px-4 text-white">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 sm:mb-6">
          Ready to Revolutionize Your Workflow?
        </h2>
        <p className="text-base sm:text-lg text-center max-w-full sm:max-w-2xl mb-6 sm:mb-8 text-slate-300">
          Get started for free and discover how SyncSpace can bring your team closer, no matter where they are.
        </p>
        <div className="flex gap-4">
          <button 
            className="px-6 py-3 cursor-pointer bg-teal-600 hover:bg-teal-500 rounded-lg text-lg font-semibold shadow-lg transition"
            onClick={() => openModal('signUp')}
            >
            Get Started for Free
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-gray-400 text-sm flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
        <span className="text-[12px] sm:text-[15px]">
          ©2025 SyncSpace | Built with 🧡 in Barrackpore
        </span>
      </footer>
    </div>
  );
};

export default HomePage;

