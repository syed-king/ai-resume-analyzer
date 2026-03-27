'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ScoreRing from '@/components/ScoreRing';
import { analysisApi } from '@/lib/api';
import { Download, ArrowLeft, Target, Zap, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface Analysis {
  id: number; match_score: number; skill_match_score: number;
  keyword_score: number; ats_score: number;
  missing_skills: string; matched_skills: string;
  suggestions: string; keyword_tips: string;
  job_description: string; created_at: string;
}

const iconMap: Record<string, string> = { critical:'🚨', warning:'⚠️', success:'✅', skill:'🎯', tip:'✏️', ats:'🤖', improvement:'💡', formatting:'📊' };
const colorMap: Record<string, string> = {
  critical: 'border-red-500/30 bg-red-500/5',
  warning:  'border-yellow-500/30 bg-yellow-500/5',
  success:  'border-green-500/30 bg-green-500/5',
  skill:    'border-purple-500/30 bg-purple-500/5',
  tip:      'border-blue-500/30 bg-blue-500/5',
  ats:      'border-cyan-500/30 bg-cyan-500/5',
};

export default function ResultsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (!params?.id) return;
    analysisApi.get(Number(params.id))
      .then(r => setAnalysis(r.data))
      .catch(() => router.push('/history'))
      .finally(() => setFetching(false));
  }, [params?.id, router]);

  const downloadReport = () => {
    if (!analysis) return;
    const missing = JSON.parse(analysis.missing_skills);
    const suggestions = JSON.parse(analysis.suggestions);
    const tips = JSON.parse(analysis.keyword_tips);
    const content = [
      '# AI Resume Analysis Report',
      `Date: ${new Date(analysis.created_at).toLocaleString()}`,
      '',
      '## Scores',
      `- Match Score: ${analysis.match_score.toFixed(1)}%`,
      `- Skill Match: ${analysis.skill_match_score.toFixed(1)}%`,
      `- Keyword Score: ${analysis.keyword_score.toFixed(1)}%`,
      `- ATS Score: ${analysis.ats_score.toFixed(1)}%`,
      '',
      '## Missing Skills',
      missing.map((s: string) => `- ${s}`).join('\n'),
      '',
      '## Suggestions',
      suggestions.map((s: any) => `- ${s.title}: ${s.description}`).join('\n'),
      '',
      '## Keyword Tips',
      tips.map((t: string) => `- ${t}`).join('\n'),
    ].join('\n');
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'resume-analysis-report.md'; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading || fetching || !user) {
    return (
      <div className="min-h-screen gradient-bg grid-bg flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!analysis) return null;

  const missing  = JSON.parse(analysis.missing_skills) as string[];
  const matched  = JSON.parse(analysis.matched_skills) as string[];
  const suggs    = JSON.parse(analysis.suggestions) as any[];
  const kwTips   = JSON.parse(analysis.keyword_tips) as string[];

  return (
    <div className="min-h-screen gradient-bg grid-bg">
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb w-80 h-80 bg-purple-600 top-[-5%] right-[-5%]" />
        <div className="orb w-64 h-64 bg-blue-600 bottom-[5%] left-[5%]" style={{ animationDelay: '3s' }} />
      </div>
      <Navbar />
      <main className="relative z-10 pt-24 pb-28 md:pb-10 px-4 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/history" className="text-white/40 hover:text-white text-sm flex items-center gap-1 mb-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to History
            </Link>
            <h1 className="font-display font-bold text-3xl text-glow text-white">Analysis <span className="gradient-text">Results</span></h1>
            <p className="text-white/40 text-sm mt-1">{new Date(analysis.created_at).toLocaleString()}</p>
          </div>
          <button onClick={downloadReport} className="btn-3d text-sm px-4 py-2 flex items-center gap-2 scale-90 origin-right">
            <Download className="w-4 h-4" /> Download Report
          </button>
        </div>

        {/* Score Cards Row */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Match Score', score: analysis.match_score, icon: Target },
            { label: 'Skill Match', score: analysis.skill_match_score, icon: Zap },
            { label: 'Keywords', score: analysis.keyword_score, icon: AlertTriangle },
            { label: 'ATS Score', score: analysis.ats_score, icon: Zap },
          ].map(({ label, score, icon: Icon }, i) => {
            const c = score >= 70 ? 'text-green-400' : score >= 40 ? 'text-yellow-400' : 'text-red-400';
            return (
              <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} className="card-3d p-5 text-center transition-transform hover:-translate-y-2">
                <p className="text-white/50 text-xs mb-3">{label}</p>
                <p className={`font-display font-bold text-3xl ${c}`}>{score.toFixed(0)}%</p>
              </motion.div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Score Ring */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
            className="card-3d p-8 flex flex-col items-center justify-center">
            <h2 className="font-display font-semibold mb-6">Overall Match Score</h2>
            <ScoreRing score={Math.round(analysis.match_score)} />
          </motion.div>

          {/* Skills */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }}
            className="card-3d p-6">
            <h2 className="font-display font-semibold mb-4">Skill Analysis</h2>
            {matched.length > 0 && (
              <div className="mb-4">
                <p className="text-green-400 text-xs font-medium mb-2">✓ Matched Skills</p>
                <div className="flex flex-wrap gap-2">
                  {matched.map(s => (
                    <span key={s} className="px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-300 text-xs">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {missing.length > 0 && (
              <div>
                <p className="text-red-400 text-xs font-medium mb-2">✗ Missing Skills</p>
                <div className="flex flex-wrap gap-2">
                  {missing.map(s => (
                    <span key={s} className="px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-xs">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {matched.length === 0 && missing.length === 0 && (
              <p className="text-white/40 text-sm">No specific technical skills detected in JD.</p>
            )}
          </motion.div>
        </div>

        {/* Suggestions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="mb-6">
          <h2 className="font-display font-semibold text-xl mb-4">AI Suggestions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {suggs.map((s: any, i: number) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.07 }}
                className={`card-3d p-5 border shadow-none hover:shadow-glow ${colorMap[s.type] || 'border-white/10'} relative group`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{s.icon || iconMap[s.type] || '💡'}</span>
                  <div>
                    <p className="font-display font-semibold text-sm mb-1">{s.title}</p>
                    <p className="text-white/50 text-xs leading-relaxed">{s.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Keyword Tips */}
        {kwTips.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <h2 className="font-display font-semibold text-xl mb-4">Keyword Tips</h2>
            <div className="card-3d p-5 space-y-2">
              {kwTips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-white/60">
                  <span className="text-purple-400 mt-0.5">•</span> {tip}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
