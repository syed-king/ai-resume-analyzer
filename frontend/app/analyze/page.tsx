'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import UploadZone from '@/components/UploadZone';
import { resumeApi, analysisApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { Sparkles, ChevronDown, FileText } from 'lucide-react';

interface Resume { id: number; filename: string; parsed_skills?: string; }

export default function AnalyzePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [jobDesc, setJobDesc] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [step, setStep] = useState<'upload' | 'parse' | 'analyze'>('upload');
  const [uploadedResume, setUploadedResume] = useState<Resume | null>(null);
  const [existingResumes, setExistingResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const [useExisting, setUseExisting] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (user) resumeApi.list().then(r => setExistingResumes(r.data));
  }, [user, loading, router]);

  const handleAnalyze = async () => {
    if (!jobDesc.trim() || jobDesc.trim().length < 50) {
      toast.error('Please paste a job description (at least 50 characters)');
      return;
    }
    const resumeId = useExisting ? selectedResumeId : uploadedResume?.id;
    if (!resumeId) { toast.error('Please upload or select a resume first'); return; }

    setAnalyzing(true);
    try {
      const r = await analysisApi.run(resumeId, jobDesc);
      toast.success('Analysis complete! 🎉');
      router.push(`/results/${r.data.id}`);
    } catch {
      toast.error('Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileUpload = async (f: File) => {
    setFile(f);
    setStep('parse');
    try {
      const r = await resumeApi.upload(f);
      setUploadedResume(r.data);
      setStep('analyze');
      toast.success('Resume parsed successfully! ✨');
    } catch {
      toast.error('Failed to parse resume. Check format.');
      setStep('upload');
      setFile(null);
    }
  };

  if (loading || !user) return null;

  return (
    <div className="min-h-screen gradient-bg grid-bg">
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb w-80 h-80 bg-purple-600 top-[-5%] left-[-5%]" />
        <div className="orb w-72 h-72 bg-pink-600 bottom-[5%] right-[-5%]" style={{ animationDelay: '2s' }} />
      </div>
      <Navbar />
      <main className="relative z-10 pt-24 pb-28 md:pb-10 px-4 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display font-bold text-3xl md:text-4xl mb-2">
            Analyze Your <span className="gradient-text text-glow">Resume</span>
          </h1>
          <p className="text-white/50">Upload your resume and paste the job description to get your AI match score.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Resume */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="card-3d p-6">
              <h2 className="font-display font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" /> Your Resume
              </h2>

              {/* Toggle: new or existing */}
              {existingResumes.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {['Upload New', 'Use Existing'].map((opt, i) => (
                    <button key={opt} onClick={() => { setUseExisting(i === 1); setFile(null); setUploadedResume(null); setStep('upload'); }}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${useExisting === (i === 1) ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300' : 'bg-white/5 border border-white/10 text-white/50 hover:text-white'}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {useExisting ? (
                <div className="space-y-2">
                  {existingResumes.map(r => (
                    <button key={r.id} onClick={() => setSelectedResumeId(r.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all text-sm ${selectedResumeId === r.id ? 'border-purple-500/50 bg-purple-500/10 text-purple-200' : 'border-white/10 bg-white/5 text-white/60 hover:border-purple-500/30'}`}>
                      {r.filename}
                    </button>
                  ))}
                </div>
              ) : (
                <>
                  <UploadZone file={file} onFile={handleFileUpload} onClear={() => { setFile(null); setUploadedResume(null); setStep('upload'); }} />
                  {step === 'parse' && (
                    <div className="mt-3 flex items-center gap-2 text-white/50 text-sm">
                      <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                      Parsing resume with AI…
                    </div>
                  )}
                  {uploadedResume && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs">
                      ✓ Parsed: {JSON.parse(uploadedResume.parsed_skills || '[]').slice(0, 5).join(', ')}{JSON.parse(uploadedResume.parsed_skills || '[]').length > 5 ? '…' : ''}
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </motion.div>

          {/* Right: Job Description */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="card-3d p-6 h-full flex flex-col">
              <h2 className="font-display font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-400" /> Job Description
              </h2>
              <textarea
                value={jobDesc}
                onChange={e => setJobDesc(e.target.value)}
                placeholder="Paste the full job description here…

Include requirements, responsibilities, and tech stack for best results."
                className="input-3d flex-1 resize-none min-h-[240px] text-sm leading-relaxed"
              />
              <p className="text-white/30 text-xs mt-2">{jobDesc.length} characters · Aim for 200+</p>
            </div>
          </motion.div>
        </div>

        {/* Analyze Button */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mt-6">
          <AnimatePresence mode="wait">
            {analyzing ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-3d p-6 text-center">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  <span className="font-display font-medium">AI is analyzing your resume…</span>
                </div>
                <p className="text-white/40 text-sm">Computing semantic similarity, skill gaps, and ATS score. This may take 15–30s on first run.</p>
              </motion.div>
            ) : (
              <motion.button
                key="btn"
                onClick={handleAnalyze}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="btn-3d w-full py-4 text-base flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Analyze with AI
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}
