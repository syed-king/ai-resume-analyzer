'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Home, Upload, History, LogOut, Sun, Moon, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/analyze',   label: 'Analyze',   icon: Upload },
  { href: '/history',   label: 'History',   icon: History },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!user) return null;

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="hidden md:flex fixed top-4 left-1/2 -translate-x-1/2 z-50 items-center gap-2 px-4 py-2 card-3d shadow-glow"
      >
        <Link href="/" className="flex items-center gap-2 mr-4">
          <div className="w-7 h-7 rounded-lg bg-gradient-purple-blue flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-sm text-glow text-white">ResumeAI</span>
        </Link>
        {navLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              pathname === href
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            {label}
          </Link>
        ))}
        <div className="flex items-center gap-2 ml-4 pl-4 border-l border-white/10">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-white/60 hover:text-white/90 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </motion.nav>

      {/* Mobile Bottom Nav */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="md:hidden fixed bottom-4 left-4 right-4 z-50"
      >
        <div className="card-3d flex items-center justify-around px-2 py-3">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex flex-col items-center gap-1">
              <div className={`p-2 rounded-xl transition-all ${
                pathname === href ? 'bg-purple-500/30 text-purple-300' : 'text-white/50'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-medium ${pathname === href ? 'text-purple-300' : 'text-white/40'}`}>
                {label}
              </span>
            </Link>
          ))}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex flex-col items-center gap-1 text-white/50"
            >
              <div className="p-2 rounded-xl">
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </div>
              <span className="text-xs">Theme</span>
            </button>
          )}
          <button onClick={logout} className="flex flex-col items-center gap-1 text-white/50">
            <div className="p-2 rounded-xl hover:bg-red-500/20">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="text-xs">Logout</span>
          </button>
        </div>
      </motion.div>
    </>
  );
}
