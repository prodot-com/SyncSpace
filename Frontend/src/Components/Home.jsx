import React, { useState } from "react";
import {useNavigate } from "react-router-dom";
import { LayoutGrid, FilePenLine, MessageSquare, Zap, X } from "lucide-react";
import axios from "axios"
import Image1 from "../assets/Image1.png"


const SignUpForm = ({ signUpData, handleSignUpChange, handleSignUp, setModalContent, alert }) => (
  <div>
    <h2 className="text-3xl font-bold text-center text-white mb-2">Get Started with SyncSpace</h2>
    <p className="text-center text-slate-400 mb-1">Create an account to begin collaborating.</p>
    {alert && <h1 className="text-center m-3 text-slate-100">{alert}</h1>}
    <form className="space-y-4" onSubmit={handleSignUp}>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
        <input name="name" type="text" placeholder="John Doe" value={signUpData.name} onChange={handleSignUpChange} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
        <input name="email" type="text" placeholder="you@example.com" value={signUpData.email} onChange={handleSignUpChange} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
        <input name="password" type="password" placeholder="••••••••" value={signUpData.password} onChange={handleSignUpChange} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
        <select name="role" value={signUpData.role} onChange={handleSignUpChange} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition appearance-none">
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

const SignInForm = ({ signInData, handleSignInChange, handleSignIn, setModalContent, alert }) => (
   <div>
    <h2 className="text-3xl font-bold text-center text-white mb-2">Welcome Back</h2>
    <p className="text-center text-slate-400 mb-2">Sign in to access your workspaces.</p>
    {alert && <h1 className="text-center m-3 text-slate-100">{alert}</h1>}
    <form className="space-y-4" onSubmit={handleSignIn}>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
        <input name="email" type="email" placeholder="you@example.com" value={signInData.email} onChange={handleSignInChange} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
        <input name="password" type="password" placeholder="••••••••" value={signInData.password} onChange={handleSignInChange} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition" required />
      </div>
      <button type="submit" className="w-full py-3 mt-4 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-500 transition shadow-md">Sign In</button>
      <p className="text-center text-sm text-slate-400 pt-4">
        Don't have an account? <button type="button" onClick={() => setModalContent('signUp')} className="font-semibold text-teal-500 hover:underline">Sign Up</button>
      </p>
    </form>
  </div>
);

const Modal = ({ closeModal, modalContent, setModalContent, signUpData, handleSignUpChange, handleSignUp, signInData, handleSignInChange, handleSignIn, alert }) => (
  <div className="fixed  inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 font-sans">
    <div className=" mt-25 bg-slate-800 rounded-2xl shadow-2xl shadow-black/50 p-8 w-full max-w-md relative animate-fade-in-up">
      <button onClick={closeModal} className="absolute top-4 right-4 text-slate-400 hover:text-white transition">
        <X size={24} />
      </button>
      {modalContent === 'signUp' ? 
        <SignUpForm 
          signUpData={signUpData}
          handleSignUpChange={handleSignUpChange}
          handleSignUp={handleSignUp}
          setModalContent={setModalContent}
          alert={alert}
        /> : 
        <SignInForm 
          signInData={signInData}
          handleSignInChange={handleSignInChange}
          handleSignIn={handleSignIn}
          setModalContent={setModalContent}
          alert={alert}
        />}
    </div>
  </div>
);


// --- Page Components ---

const HomePage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('signUp');
  const [alert, setAlert] = useState(null);

  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Member',
  });

  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  });

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSignInChange = (e) => {
    const { name, value } = e.target;
    setSignInData(prevData => ({ ...prevData, [name]: value }));
  };

 const handleSignUp = async (e) => {
  e.preventDefault();
  console.log("Submitting Sign Up Data:", signUpData);
  try {
    const res = await axios.post(
      "http://localhost:9000/api/auth/register",
      signUpData   // ✅ use signUpData
    );

    console.log("Signup Success:", res.data);
    setAlert("Account created successfully!");
  } catch (error) {
    console.error("Signup Error: ", error.response?.data || error.message);
    setAlert(error.response?.data?.message || "Something went wrong during signup.");
  }
  setTimeout(() => {
    closeModal();
    setAlert(null);
  }, 2000);
};

const handleSignIn = async (e) => {
  e.preventDefault();
  console.log("Submitting Sign In Data:", signInData);
  try {
    const res = await axios.post(
      "http://localhost:9000/api/auth/login",   // ✅ correct endpoint
      signInData
    );

    console.log("Signin Success:", res.data);
    setAlert("Signed in successfully! Redirecting to Dashboard");
    // optionally store token
    localStorage.setItem("token", res.data.token);

    setTimeout(()=>{
        navigate(`/Dashboard/${res.data.user._id}`)
    },1500)

  } catch (error) {
    console.error("Signin Error: ", error.response?.data || error.message);
    setAlert(error.response?.data?.message || "Something went wrong during signin.");
  }

};


  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="font-sans min-h-screen bg-slate-900 text-white flex flex-col items-center">
      {isModalOpen && <Modal 
        closeModal={closeModal}
        modalContent={modalContent}
        setModalContent={setModalContent}
        signUpData={signUpData}
        handleSignUpChange={handleSignUpChange}
        handleSignUp={handleSignUp}
        signInData={signInData}
        handleSignInChange={handleSignInChange}
        handleSignIn={handleSignIn}
        alert={alert}
      />}
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
        <div className=" flex flex-col sm:flex-row items-center sm:space-x-4 mt-4 sm:mt-0">
            <button onClick={() => openModal('signIn')} className=" text-slate-300 hover:text-white transition font-medium px-3 py-2">Sign In</button>
            <button onClick={() => openModal('signUp')} className="bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-500 transition shadow-md">Sign Up</button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="mt-[155px] sm:mt-20 min-h-[590px] sm:min-h-screen w-full relative flex flex-col justify-center items-center px-4 sm:px-6">
        <div
          className="absolute inset-0 z-0 opacity-80"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 100%, rgba(13, 148, 136, 0.4) 0%, transparent 60%),
              radial-gradient(circle at 50% 100%, rgba(30, 64, 175, 0.3) 0%, transparent 70%)
            `,
          }}
        />
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
      <div id="features" className="p-6 sm:p-10 sm:pt-2 pt-3 max-w-[1430px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
        <div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Everything Your Team Needs, in One Place.
          </h2>
          <p className="mt-4 sm:mt-6 text-base sm:text-xl text-slate-300 leading-relaxed">
            SyncSpace is the outcome of a 4-week development plan, designed to build a fully-featured collaborative hub.
            <span className="text-teal-500 font-semibold"> Project managers</span> can orchestrate tasks with visual Kanban boards, while 
            <span className="text-teal-500 font-semibold"> team members</span> collaborate on documents in real-time and stay connected with integrated chat.
          </p>
          <div className="mt-8 sm:mt-10 space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row items-start gap-4 group">
              <div className="p-3 rounded-full bg-teal-500/10 group-hover:bg-teal-500/20 transition">
                <LayoutGrid className="text-teal-500 w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-white">Dynamic Kanban Boards</h3>
                <p className="text-slate-400 text-sm sm:text-base">
                  Visualize workflows and manage tasks with interactive, drag-and-drop boards.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start gap-4 group">
              <div className="p-3 rounded-full bg-teal-500/10 group-hover:bg-teal-500/20 transition">
                <FilePenLine className="text-teal-500 w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-white">Real-time Document Editor</h3>
                <p className="text-slate-400 text-sm sm:text-base">
                  Co-author documents simultaneously with live cursors and instant updates.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start gap-4 group">
              <div className="p-3 rounded-full bg-teal-500/10 group-hover:bg-teal-500/20 transition">
                <MessageSquare className="text-teal-500 w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-white">Integrated Chat & Notifications</h3>
                <p className="text-slate-400 text-sm sm:text-base">
                  Stay in the loop with workspace-specific chat channels and real-time alerts.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-8 sm:mt-12">
            <button
              className="px-6 py-3 cursor-pointer bg-teal-600 hover:bg-teal-500 rounded-lg text-lg font-semibold shadow-lg transition"
              onClick={() => document.querySelector('[class*="bg-slate-950"]').scrollIntoView({ behavior: 'smooth' })}
            >
              View Project Timeline
            </button>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="px-6 py-3 text-center cursor-pointer border border-slate-400 hover:bg-slate-800 rounded-lg text-lg font-semibold transition">
              See Code on GitHub
            </a>
          </div>
        </div>
        <div className="hidden lg:flex justify-center items-center bg-slate-800 rounded-xl p-4 border border-slate-700">
             <img src={Image1} alt="SyncSpace application dashboard" className="rounded-lg" />
        </div>
      </div>

      {/* Stats / Trust Section */}
      <div className="bg-slate-950/50 rounded-2xl max-w-[330px] shadow-lg shadow-teal-500/20 py-16 sm:py-20 overflow-hidden w-full sm:max-w-[1430px] mx-auto mt-16 sm:mt-24">
        <div className="max-w-6xl mx-auto text-center mb-8 sm:mb-12 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            A Focused 4-Week Development Sprint
          </h2>
          <p className="mt-2 sm:mt-4 text-base sm:text-lg text-slate-400">
            From concept to deployment, this project follows a structured plan to deliver a robust and feature-rich platform.
          </p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12 text-center relative z-10">
          <div className="group flex flex-col items-center">
            <Zap className="text-teal-500 w-10 h-10 group-hover:scale-110 transition-transform" />
            <h3 className="text-slate-300 mt-2 font-semibold text-lg">Real-time Collaboration</h3>
            <p className="text-slate-400 text-sm">Powered by Node.js & Socket.IO</p>
          </div>
          <div className="group flex flex-col items-center">
            <div className="text-4xl sm:text-5xl font-extrabold text-teal-500 group-hover:scale-110 transition-transform">
              50%
            </div>
            <p className="text-slate-300 mt-2 font-semibold text-lg">Weeks 1 & 2 Complete</p>
            <p className="text-slate-400 text-sm">Core backend and UI functional</p>
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