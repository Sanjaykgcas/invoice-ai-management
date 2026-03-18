import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { AnimatePresence } from 'framer-motion';
import { Mail, Lock, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isEmailValid) {
      setError('Invalid email format');
      return;
    }

    if (email === 'admin@invoice.ai') {
      if (password === 'admin123') {
        login();
        navigate('/');
      } else {
        setError('Invalid credentials');
      }
    } else {
      // Simulate real auth for any generic email
      login();
      navigate('/');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center relative animate-in fade-in zoom-in-95 duration-500">
      <div className="w-full max-w-md">
        <div className={`glassmorphism rounded-3xl p-8 relative overflow-hidden transition-all duration-300 ${error ? 'glow-red border-red-500/50' : 'glow-gold'}`}>
          <div className="absolute top-0 right-0 -m-4">
            <div className="w-32 h-32 bg-[#D4AF37] rounded-full blur-3xl opacity-20 pointer-events-none"></div>
          </div>

          <div className="text-center mb-8">
            <ShieldCheck className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">
              Access Portal
            </h2>
            <p className="text-gray-400 mt-2 font-medium">Secure AI Invoice Management</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div className="space-y-1">
              <label className="text-sm text-gray-400 ml-1">Work Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-[#D4AF37] transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-2xl bg-black/50 text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                  placeholder="admin@invoice.ai"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-400 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-[#D4AF37] transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-2xl bg-black/50 text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-400 text-sm font-medium flex items-center bg-red-900/20 py-2 border border-red-500/20 rounded-xl justify-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-bold py-3.5 rounded-2xl hover:scale-[1.02] transform transition-all active:scale-[0.98] glow-gold flex justify-center items-center group"
            >
              Sign In To Dashboard
            </button>
          </form>

          <div className="mt-8 relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative bg-black/70 px-4 text-sm text-gray-500 font-medium">Or continue with</div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => { login(); navigate('/'); }}
              className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white py-3 rounded-2xl hover:bg-white/10 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Login with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
