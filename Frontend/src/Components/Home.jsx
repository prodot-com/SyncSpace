import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, FilePenLine, MessageSquare, Zap, X, LineSquiggle } from "lucide-react";
import axios from "axios";
import { BACKEND_URL } from "../../utilities/constants.js";


const FormInput = ({ label, name, type = "text", placeholder, value, onChange, required = true }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-slate-300 mb-1">
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
      required={required}
    />
  </div>
);


const SignUpForm = ({ signUpData, handleSignUpChange, handleSignUp, setModalContent, alert }) => (
  <div>
    <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-2">Get Started with SyncSpace</h2>
    <p className="text-center text-slate-400 mb-6 text-sm sm:text-base">Create an account to begin collaborating.</p>
    {alert && <p className="text-center my-3 text-slate-100 bg-slate-700/50 py-2 rounded-md text-sm">{alert}</p>}
    <form className="space-y-4" onSubmit={handleSignUp}>
      <FormInput label="Full Name" name="name" placeholder="John Doe" value={signUpData.name} onChange={handleSignUpChange} />
      <FormInput label="Email Address" name="email" type="email" placeholder="you@example.com" value={signUpData.email} onChange={handleSignUpChange} />
      <FormInput label="Password" name="password" type="password" placeholder="••••••••" value={signUpData.password} onChange={handleSignUpChange} />
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-slate-300 mb-1">Role</label>
        <select
          id="role"
          name="role"
          value={signUpData.role}
          onChange={handleSignUpChange}
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 appearance-none"
        >
          <option>Member</option>
          <option>Admin</option>
        </select>
      </div>
      <button type="submit" className="w-full py-3 mt-4 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-500 transition-transform hover:scale-105 shadow-lg shadow-teal-900/50">
        Create Account
      </button>
      <p className="text-center text-sm text-slate-400 pt-4">
        Already have an account?{' '}
        <button type="button" onClick={() => setModalContent('signIn')} className="font-semibold text-teal-400 hover:text-teal-300 hover:underline">
          Sign In
        </button>
      </p>
    </form>
  </div>
);


const SignInForm = ({ signInData, handleSignInChange, handleSignIn, setModalContent, alert }) => (
  <div>
    <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-2">Welcome Back</h2>
    <p className="text-center text-slate-400 mb-6 text-sm sm:text-base">Sign in to access your workspaces.</p>
    {alert && <p className="text-center my-3 text-slate-100 bg-slate-700/50 py-2 rounded-md text-sm">{alert}</p>}
    <form className="space-y-4" onSubmit={handleSignIn}>
      <FormInput label="Email Address" name="email" type="email" placeholder="you@example.com" value={signInData.email} onChange={handleSignInChange} />
      <FormInput label="Password" name="password" type="password" placeholder="••••••••" value={signInData.password} onChange={handleSignInChange} />
      <button type="submit" className="w-full py-3 mt-4 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-500 transition-transform hover:scale-105 shadow-lg shadow-teal-900/50">
        Sign In
      </button>
      <p className="text-center text-sm text-slate-400 pt-4">
        Don't have an account?{' '}
        <button type="button" onClick={() => setModalContent('signUp')} className="font-semibold text-teal-400 hover:text-teal-300 hover:underline">
          Sign Up
        </button>
      </p>
    </form>
  </div>
);


const AuthModal = ({ closeModal, modalContent, ...props }) => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4 font-sans animate-fade-in">
    <div className="bg-slate-800 rounded-2xl shadow-2xl shadow-black/50 p-6 sm:p-8 w-full max-w-md relative animate-slide-up">
      <button onClick={closeModal} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-transform hover:rotate-90 duration-300">
        <X size={24} />
      </button>
      {modalContent === 'signUp' ? <SignUpForm {...props} /> : <SignInForm {...props} />}
    </div>
  </div>
);


const Header = ({ onSignIn, onSignUp }) => (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl bg-slate-800/60 flex justify-between items-center px-4 sm:px-8 py-3 rounded-2xl z-40 backdrop-blur-md shadow-2xl shadow-black/30 border border-slate-700">
        <h1 className="text-xl sm:text-2xl font-bold text-white cursor-pointer" onClick={() => window.location.reload()}>
            SyncSpace
        </h1>
        <nav className="flex items-center gap-2 sm:gap-4">
            <button onClick={onSignIn} className="cursor-pointer text-slate-300 hover:text-white transition font-medium px-3 py-2 rounded-md text-sm sm:text-base">
                Sign In
            </button>
            <button onClick={onSignUp} className="cursor-pointer bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-500 transition shadow-md shadow-teal-900/50 text-sm sm:text-base">
                Sign Up
            </button>
        </nav>
    </header>
);


const FeatureItem = ({ icon, title, children }) => (
    <div className="flex items-start gap-4 group">
        <div className="p-3 rounded-full bg-teal-500/10 group-hover:bg-teal-500/20 transition-all duration-300 group-hover:scale-110">
            {React.createElement(icon, { className: "text-teal-400 w-6 h-6" })}
        </div>
        <div>
            <h3 className="text-lg sm:text-xl font-semibold text-white">{title}</h3>
            <p className="text-slate-400 text-sm sm:text-base">{children}</p>
        </div>
    </div>
);


const App = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('signUp');
  const [alert, setAlert] = useState(null);

  const [signUpData, setSignUpData] = useState({ name: '', email: '', password: '', role: 'Member' });
  const [signInData, setSignInData] = useState({ email: '', password: '' });

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignInChange = (e) => {
    const { name, value } = e.target;
    setSignInData(prev => ({ ...prev, [name]: value }));
    setAlert(null)
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/register`, signUpData);
      setAlert("Account created successfully!");
      setTimeout(() => {
        closeModal();
        setAlert(null);
        setModalContent('signIn'); 
        setIsModalOpen(true);
      }, 1500);
    } catch (error) {
      setAlert(error.response?.data?.message || "Sign-up failed. Please try again.");
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/login`, signInData);
      setAlert("Signed in successfully! Redirecting...");
      localStorage.setItem("token", res.data.token);
      setTimeout(() => {
        navigate(`/Dashboard/${res.data.user._id}`);
        console.log(`Simulating navigation to Dashboard for user: ${res.data.user._id}`);
        closeModal();
      }, 1500);
    } catch (error) {
      setAlert(error.response?.data?.message || "Sign-in failed. Please check your credentials.");
    }
  };

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
    setAlert(null); 
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  
  useEffect(() => {
    const handleEsc = (event) => {
       if (event.key === 'Escape') {
         closeModal();
       }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="font-sans min-h-screen bg-slate-900 text-white flex flex-col items-center selection:bg-teal-300/50">
      
      {isModalOpen && <AuthModal 
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

      <Header onSignIn={() => openModal('signIn')} onSignUp={() => openModal('signUp')} />

      
      <main className="w-full pt-28 sm:pt-32 md:pt-40 flex flex-col items-center">
        <section className="min-h-[calc(100vh-10rem)] w-full relative flex flex-col justify-center items-center px-4 sm:px-6">
          <div
            className="absolute inset-0 z-0 opacity-80"
            style={{
              backgroundImage: `
                radial-gradient(circle at 50% 100%, rgba(13, 148, 136, 0.3) 0%, transparent 60%),
                radial-gradient(circle at 50% 100%, rgba(30, 64, 175, 0.2) 0%, transparent 70%)
              `,
            }}
          />
          <div className="relative z-10 flex flex-col justify-center items-center text-center">
            <h1 className="font-bold leading-tight text-4xl sm:text-6xl md:text-7xl max-w-4xl tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
              Where Teamwork Flows, Instantly.
            </h1>
            <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl">
              Manage projects, share documents, and communicate seamlessly in one unified hub.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <button
                onClick={() => document.getElementById("features").scrollIntoView({ behavior: "smooth" })}
                className="px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold shadow-lg shadow-teal-900/50 hover:bg-teal-500 hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-base sm:text-lg"
              >
                Explore Features
              </button>
            </div>
          </div>
        </section>

        
        <section id="features" className="p-4 sm:p-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Everything Your Team Needs, in One Place.
            </h2>
            <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed">
              SyncSpace is designed to be a fully-featured collaborative hub where{' '}
              <span className="text-teal-400 font-semibold">managers</span> orchestrate tasks and{' '}
              <span className="text-teal-400 font-semibold">team members</span> collaborate effortlessly.
            </p>
            <div className="mt-10 space-y-8">
              <FeatureItem icon={LayoutGrid} title="Dynamic Kanban Boards">
                Visualize workflows and manage tasks with interactive, drag-and-drop boards.
              </FeatureItem>
              <FeatureItem icon={FilePenLine} title="Real-time Document Editor">
                Co-author documents simultaneously with live cursors and instant updates.
              </FeatureItem>
              <FeatureItem icon={MessageSquare} title="Integrated Chat & Notifications">
                Stay in the loop with workspace-specific chat channels and real-time alerts.
              </FeatureItem>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-8 sm:mt-12">
            <button
              className="px-6 py-3 cursor-pointer bg-teal-600 hover:bg-teal-500 rounded-lg font-semibold shadow-lg transition text-base sm:text-lg"
              onClick={() => document.querySelector('[class*="bg-slate-950"]').scrollIntoView({ behavior: 'smooth' })}
            >
              View Project Timeline
            </button>
            <a href="https://github.com/prodot-com/SyncSpace" target="_blank" rel="noopener noreferrer" className="px-6 py-3 text-center cursor-pointer border border-slate-400 hover:bg-slate-800 rounded-lg font-semibold transition text-base sm:text-lg">
              See Code on GitHub
            </a>
          </div>
          </div>
          <div className="hidden lg:flex justify-center items-center bg-slate-800 rounded-xl p-4 border border-slate-700 order-1 lg:order-2">
             <img src="https://placehold.co/600x400/1e293b/94a3b8?text=SyncSpace+UI" alt="SyncSpace application dashboard" className="rounded-lg shadow-2xl" />
          </div>
        </section>

        
        <section className="bg-slate-950/50 rounded-2xl shadow-lg shadow-teal-500/10 py-16 sm:py-20 px-4 w-[95%] max-w-7xl mx-auto mt-16 sm:mt-24">
          <div className="text-center mb-12 px-2">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              A Focused 4-Week Development Sprint
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-400">
              From concept to deployment, a structured plan to deliver a robust platform.
            </p>
          </div>
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-12 text-center">
            <div className="group flex flex-col items-center">
              <Zap className="text-teal-400 w-10 h-10 group-hover:scale-110 transition-transform" />
              <h3 className="text-slate-300 mt-4 font-semibold text-lg">Real-time Collaboration</h3>
              <p className="text-slate-400 text-sm">Powered by Node.js & Socket.IO</p>
            </div>
            <div className="group flex flex-col items-center">
              <LineSquiggle className="text-teal-400 w-10 h-10 group-hover:scale-110 transition-transform" />
              <p className="text-slate-300 mt-2 font-semibold text-lg">Tailwind compatible</p>
              <p className="text-slate-400 text-sm">Core backend and UI functional</p>
            </div>
          </div>
        </section>

      
        <section className="flex flex-col items-center justify-center py-16 sm:py-20 px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Revolutionize Your Workflow?
          </h2>
          <p className="text-base sm:text-lg max-w-2xl mb-8 text-slate-300">
            Get started for free and discover how SyncSpace can bring your team closer, no matter where they are.
          </p>
          <button 
            className="px-6 py-3 sm:px-8 sm:py-4 bg-teal-600 hover:bg-teal-500 rounded-lg font-semibold shadow-lg shadow-teal-900/50 transition-all transform hover:scale-105 text-base sm:text-lg"
            onClick={() => openModal('signUp')}
          >
            Get Started for Free
          </button>
        </section>
      </main>

      
      <footer className="w-full py-6 text-center text-gray-400 text-xs sm:text-sm border-t border-slate-800 px-4">
          <p>&copy; {new Date().getFullYear()} SyncSpace | Built with 🧡 in India</p>
      </footer>
    </div>
  );
};

export default App;