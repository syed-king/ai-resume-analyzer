'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Zap, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(email.trim().toLowerCase(), password, name);
      toast.success('Account created! Let\'s analyze your resume 🚀');
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen gradient-bg grid-bg flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb w-96 h-96 bg-purple-600 top-[-10%] left-[-5%]" />
        <div className="orb w-72 h-72 bg-pink-600 bottom-[-5%] right-[-5%]" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="card-3d p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-purple-blue flex items-center justify-center mx-auto mb-4 shadow-glow">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-display font-bold text-3xl mb-2 text-glow text-white">Create account</h1>
            <p className="text-white/50">Start analyzing resumes for free</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-white/60 mb-2 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  className="input-3d pl-10" placeholder="Your Name" />
              </div>
            </div>
            <div>
              <label className="text-sm text-white/60 mb-2 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="input-3d pl-10" placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="text-sm text-white/60 mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type={showPw ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                  className="input-3d pl-10 pr-10" placeholder="Min 6 characters" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <motion.button
              type="submit" disabled={loading}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="btn-3d w-full py-4 text-center disabled:opacity-60"
            >
              {loading ? 'Creating account…' : 'Create Free Account'}
            </motion.button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
