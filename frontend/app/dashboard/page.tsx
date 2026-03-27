'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { analysisApi, resumeApi } from '@/lib/api';
import { Upload, TrendingUp, History, ArrowRight, Award } from 'lucide-react';

interface HistoryItem { id: number; resume_id: number; match_score: number; ats_score: number; created_at: string; resume_filename?: string; }

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 70 ? 'text-green-400 border-green-500/30 bg-green-500/10'
    : score >= 40 ? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10'
    : 'text-red-400 border-red-500/30 bg-red-500/10';
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${color}`}>
      {score.toFixed(0)}%
    </span>
  );
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [resumeCount, setResumeCount] = useState(0);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    Promise.all([analysisApi.history(), resumeApi.list()])
      .then(([h, r]) => { setHistory(h.data.slice(0, 5)); setResumeCount(r.data.length); })
      .finally(() => setFetching(false));
  }, [user]);

  if (loading || !user) return null;

  const bestScore = history.length ? Math.max(...history.map(h => h.match_score)) : 0;

  return (
    <div className="min-h-screen gradient-bg grid-bg">
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb w-80 h-80 bg-purple-600 top-[-5%] right-[10%]" />
        <div className="orb w-64 h-64 bg-blue-600 bottom-[10%] left-[-5%]" style={{ animationDelay: '3s' }} />
      </div>
      <Navbar />

      <main className="relative z-10 pt-24 pb-28 md:pb-8 px-4 max-w-6xl mx-auto">
        {/* Greeting */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display font-bold text-3xl md:text-4xl">
            Hey, <span className="gradient-text text-glow">{user.full_name?.split(' ')[0] || 'there'}</span> 👋
          </h1>
          <p className="text-white/50 mt-1">Here&apos;s your resume performance overview.</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Analyses Done', value: history.length, icon: TrendingUp, color: 'text-purple-400' },
            { label: 'Resumes Uploaded', value: resumeCount, icon: Upload, color: 'text-blue-400' },
            { label: 'Best Match Score', value: `${bestScore.toFixed(0)}%`, icon: Award, color: 'text-pink-400' },
          ].map(({ label, value, icon: Icon, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card-3d p-5 relative group"
            >
              <Icon className={`w-5 h-5 ${color} mb-3`} />
              <p className="font-display font-bold text-2xl">{value}</p>
              <p className="text-white/40 text-sm mt-0.5">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card-3d p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div>
            <h2 className="font-display font-semibold text-xl mb-1">Ready for your next analysis?</h2>
            <p className="text-white/50 text-sm">Upload a resume and paste a job description to get your AI match score.</p>
          </div>
          <Link href="/analyze" className="btn-3d px-6 py-3 flex items-center gap-2 whitespace-nowrap">
            New Analysis <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Recent History */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-xl">Recent Analyses</h2>
            <Link href="/history" className="text-purple-400 text-sm hover:text-purple-300 flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {fetching ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="card-3d p-4 h-16 shimmer" />)}
            </div>
          ) : history.length === 0 ? (
            <div className="card-3d p-10 text-center text-white/40">
              <History className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No analyses yet. Upload your first resume!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                >
                  <Link href={`/results/${item.id}`} className="card-3d p-4 flex items-center justify-between transition-all block group">
                    <div>
                      <p className="font-medium text-sm">{item.resume_filename || 'Resume'}</p>
                      <p className="text-white/40 text-xs mt-0.5">{new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right text-xs text-white/40">
                        <p>Match: <ScoreBadge score={item.match_score} /></p>
                        <p className="mt-1">ATS: <ScoreBadge score={item.ats_score} /></p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/20" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
