'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { analysisApi } from '@/lib/api';
import Link from 'next/link';
import { History, ArrowRight, TrendingUp } from 'lucide-react';

interface HistoryItem { id: number; resume_id: number; match_score: number; ats_score: number; created_at: string; resume_filename?: string; }

function ScoreBar({ score, label }: { score: number; label: string }) {
  const color = score >= 70 ? 'bg-green-500' : score >= 40 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div>
      <div className="flex justify-between text-xs text-white/40 mb-1"><span>{label}</span><span>{score.toFixed(0)}%</span></div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${color}`} />
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (user) analysisApi.history().then(r => setHistory(r.data)).finally(() => setFetching(false));
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <div className="min-h-screen gradient-bg grid-bg">
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb w-80 h-80 bg-blue-600 top-[-5%] right-[-5%]" />
        <div className="orb w-72 h-72 bg-purple-600 bottom-[5%] left-[-5%]" style={{ animationDelay: '2s' }} />
      </div>
      <Navbar />
      <main className="relative z-10 pt-24 pb-28 md:pb-10 px-4 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-glow text-white">Analysis <span className="gradient-text">History</span></h1>
            <p className="text-white/50 mt-1">{history.length} analysis{history.length !== 1 ? 'es' : ''} completed</p>
          </div>
          <Link href="/analyze" className="btn-3d px-4 py-2.5 text-sm flex items-center justify-center gap-2 whitespace-nowrap flex-shrink-0">
            <TrendingUp className="w-4 h-4" /> <span className="hidden sm:inline">New Analysis</span><span className="sm:hidden">New</span>
          </Link>
        </motion.div>

        {fetching ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="card-3d p-6 h-32 shimmer" />)}
          </div>
        ) : history.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="card-3d p-16 text-center">
            <History className="w-14 h-14 mx-auto mb-4 text-white/20" />
            <h2 className="font-display font-semibold text-xl mb-2 text-white/60">No analyses yet</h2>
            <p className="text-white/30 mb-6 max-w-sm mx-auto">Upload your resume and analyze it against a job description.</p>
            <Link href="/analyze" className="btn-3d px-6 py-3 inline-block whitespace-nowrap text-sm md:text-base">Start First Analysis</Link>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {history.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}>
                <Link href={`/results/${item.id}`} className="card-3d p-5 relative group block transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-medium text-sm">{item.resume_filename || 'Resume'}</p>
                      <p className="text-white/40 text-xs mt-0.5">{new Date(item.created_at).toLocaleString()}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/20 flex-shrink-0 mt-1" />
                  </div>
                  <div className="space-y-2.5">
                    <ScoreBar score={item.match_score} label="Match Score" />
                    <ScoreBar score={item.ats_score} label="ATS Score" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
