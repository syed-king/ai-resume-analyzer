'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Target, TrendingUp, Shield, ArrowRight, Star } from 'lucide-react';

const features = [
  { icon: Target, title: 'Match Score', desc: 'AI-powered semantic similarity between your resume and job description.', color: 'text-purple-400' },
  { icon: TrendingUp, title: 'Skill Gap Analysis', desc: 'Instantly identify missing skills and get actionable suggestions.', color: 'text-blue-400' },
  { icon: Shield, title: 'ATS Optimization', desc: 'Beat applicant tracking systems with keyword and format analysis.', color: 'text-pink-400' },
];

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => { if (user) router.push('/dashboard'); }, [user, router]);

  return (
    <main className="min-h-screen gradient-bg overflow-hidden">
      {/* Floating Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb w-96 h-96 bg-purple-600 top-[-10%] left-[-5%]" style={{ animationDelay: '0s' }} />
        <div className="orb w-80 h-80 bg-blue-600 top-[20%] right-[-5%]" style={{ animationDelay: '2s' }} />
        <div className="orb w-72 h-72 bg-pink-600 bottom-[-5%] left-[20%]" style={{ animationDelay: '4s' }} />
        <div className="orb w-64 h-64 bg-cyan-600 bottom-[10%] right-[15%]" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-purple-blue flex items-center justify-center shadow-glow">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-lg gradient-text">ResumeAI</span>
        </div>
        <div className="flex gap-3">
          <Link href="/login" className="btn-secondary text-sm px-5 py-2">Login</Link>
          <Link href="/register" className="btn-primary text-sm px-5 py-2">Get Started</Link>
        </div>
      </motion.header>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center pt-20 pb-32 px-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-8 text-sm text-purple-300"
        >
          <Star className="w-3.5 h-3.5 fill-current" />
          100% Free · No API Keys Required · Open Source AI
        </motion.div>

        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-display font-bold text-5xl md:text-7xl leading-[1.1] max-w-4xl mb-6"
        >
          Land Your Dream Job with{' '}
          <span className="gradient-text">AI-Powered</span>{' '}
          Resume Analysis
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="text-white/60 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed"
        >
          Upload your resume, paste a job description, and get an instant AI match score,
          missing skills analysis, and ATS optimization tips — completely free.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/register" className="btn-primary text-base px-8 py-3.5 flex items-center gap-2">
            Analyze My Resume <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/login" className="btn-secondary text-base px-8 py-3.5">
            Sign In
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex gap-8 mt-16 text-center"
        >
          {[['AI-Powered', 'Analysis'], ['Free', 'Forever'], ['ATS', 'Optimized']].map(([val, label]) => (
            <div key={val}>
              <p className="font-display font-bold text-2xl gradient-text">{val}</p>
              <p className="text-white/40 text-sm">{label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 pb-32 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display font-bold text-3xl md:text-4xl text-center mb-12"
        >
          Everything you need to <span className="gradient-text">get hired</span>
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc, color }, i) => (
            <motion.div
              key={title}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -4 }}
              className="glass-card p-8 card-hover"
            >
              <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-5 ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-display font-semibold text-xl mb-3">{title}</h3>
              <p className="text-white/50 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto glass-card p-12"
        >
          <h2 className="font-display font-bold text-3xl mb-4">Ready to boost your career?</h2>
          <p className="text-white/50 mb-8">Join thousands improving their resume success rate with AI.</p>
          <Link href="/register" className="btn-primary text-base px-10 py-4 inline-flex items-center gap-2">
            Start for Free <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
