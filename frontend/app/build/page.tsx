'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { generateDocx, ResumeData } from '@/lib/resumeGenerator';
import { Download, FileText, Plus, Trash2, Printer, Palette } from 'lucide-react';
import toast from 'react-hot-toast';
import { useReactToPrint } from 'react-to-print';

export default function BuildResumePage() {
  const [data, setData] = useState<ResumeData>({
    personal: { fullName: '', email: '', phone: '', linkedin: '', github: '', location: '' },
    summary: '',
    experience: [{ company: '', role: '', location: '', startDate: '', endDate: '', current: false, bullets: '' }],
    education: [{ institution: '', degree: '', graduationDate: '', gpa: '' }],
    projects: [{ name: '', description: '', technologies: '' }],
    skills: ''
  });

  const [accentColor, setAccentColor] = useState('#000000');
  const [fontFamily, setFontFamily] = useState('"Times New Roman", Times, serif');
  const [layout, setLayout] = useState<'standard' | 'modern' | 'centered'>('standard');
  const [activeMobileTab, setActiveMobileTab] = useState<'editor' | 'preview'>('editor');

  const printRef = useRef<HTMLDivElement>(null);

  const handleDownloadDocx = async () => {
    try {
      if (!data.personal.fullName) {
        toast.error('Please enter at least your full name.');
        return;
      }
      toast.success('Generating DOCX (Professional Format)...');
      await generateDocx(data);
    } catch (e) {
      toast.error('Failed to generate DOCX.');
      console.error(e);
    }
  };

  const handleDownloadPdf = useReactToPrint({
    content: () => printRef.current,
    documentTitle: data.personal.fullName ? `${data.personal.fullName}_Resume` : 'Resume',
    onBeforeGetContent: () => { 
      toast.success('Preparing high-quality PDF...'); 
    }
  });

  const HeaderStyle = () => {
    if (layout === 'modern') return { borderBottom: `2px solid ${accentColor}`, color: accentColor };
    if (layout === 'centered') return { borderBottom: `1px solid ${accentColor}50`, color: accentColor, textAlign: 'center' as const };
    return { borderBottom: '1px solid black', color: 'black' };
  };

  return (
    <div className="min-h-screen gradient-bg grid-bg flex flex-col">
      <Navbar />
      <main className="relative z-10 pt-20 pb-36 md:pb-10 px-4 max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 w-full flex-1">
        
        {/* Mobile Tab Switcher */}
        <div className="lg:hidden flex bg-black/40 p-1.5 rounded-2xl w-full sticky top-16 z-40 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden mt-4">
          <button 
            onClick={() => setActiveMobileTab('editor')}
            className={`flex-1 py-3 text-sm font-display font-semibold transition-all rounded-xl flex items-center justify-center gap-2 ${activeMobileTab === 'editor' ? 'bg-purple-500/30 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.3)] border border-purple-500/50' : 'text-white/50 hover:bg-white/5'}`}
          >
            <FileText className="w-4 h-4" /> Edit Details
          </button>
          <button 
            onClick={() => setActiveMobileTab('preview')}
            className={`flex-1 py-3 text-sm font-display font-semibold transition-all rounded-xl flex items-center justify-center gap-2 ${activeMobileTab === 'preview' ? 'bg-blue-500/30 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.3)] border border-blue-500/50' : 'text-white/50 hover:bg-white/5'}`}
          >
            <Printer className="w-4 h-4" /> Live Preview
          </button>
        </div>

        {/* Editor Side */}
        <div className={`lg:w-1/2 space-y-6 overflow-y-auto max-h-[85vh] pr-2 custom-scrollbar no-print ${activeMobileTab === 'editor' ? 'block' : 'hidden lg:block'}`}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-glow text-white hidden lg:block">
              Resume <span className="gradient-text">Builder</span>
            </h1>
            <p className="text-white/50 mb-6 mt-1">
              Top-tier ATS-optimized format. Leave fields blank to skip them.
            </p>

            <div className="space-y-6">
              {/* Design Settings */}
              <div className="card-3d p-6 border-pink-500/30">
                <h2 className="font-display font-semibold mb-4 text-xl flex items-center gap-2"><Palette className="w-5 h-5 text-pink-400"/> Design & Theme</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/50 block mb-2">Accent Color</label>
                    <div className="flex gap-2">
                      {['#000000', '#2563eb', '#7c3aed', '#059669', '#e11d48'].map(c => (
                        <button key={c} onClick={() => setAccentColor(c)} className={`w-8 h-8 rounded-full border-2 transition-all ${accentColor === c ? 'border-white scale-110 shadow-glow' : 'border-transparent hover:scale-105'}`} style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-white/50 block mb-2">Typography</label>
                    <select className="input-3d text-sm w-full bg-black/40 text-white" value={fontFamily} onChange={e => setFontFamily(e.target.value)}>
                      <option value='"Times New Roman", Times, serif'>Classic Serif (ATS Best)</option>
                      <option value='"Inter", sans-serif'>Modern Sans-Serif</option>
                      <option value='"Space Grotesk", sans-serif'>Space (Creative)</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-white/50 block mb-2">Layout Variant</label>
                    <div className="flex gap-2 w-full">
                      {['standard', 'modern', 'centered'].map((l) => (
                        <button key={l} onClick={() => setLayout(l as any)} className={`flex-1 py-2 px-1 rounded-xl text-xs sm:text-sm font-medium transition-all capitalize border ${layout === l ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-glow' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white'}`}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal */}
              <div className="card-3d p-6">
                <h2 className="font-display font-semibold mb-4 text-xl">1. Personal Info</h2>
                <div className="space-y-3">
                  <input className="input-3d text-sm" placeholder="Full Name" value={data.personal.fullName} onChange={e => setData({...data, personal: {...data.personal, fullName: e.target.value}})} />
                  <div className="grid grid-cols-2 gap-3">
                    <input className="input-3d text-sm" placeholder="Location City, ST" value={data.personal.location} onChange={e => setData({...data, personal: {...data.personal, location: e.target.value}})} />
                    <input className="input-3d text-sm" placeholder="Phone" value={data.personal.phone} onChange={e => setData({...data, personal: {...data.personal, phone: e.target.value}})} />
                    <input className="input-3d text-sm col-span-2" placeholder="Email Address" value={data.personal.email} onChange={e => setData({...data, personal: {...data.personal, email: e.target.value}})} />
                    <input className="input-3d text-sm" placeholder="LinkedIn URL" value={data.personal.linkedin} onChange={e => setData({...data, personal: {...data.personal, linkedin: e.target.value}})} />
                    <input className="input-3d text-sm" placeholder="GitHub URL" value={data.personal.github} onChange={e => setData({...data, personal: {...data.personal, github: e.target.value}})} />
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="card-3d p-6">
                <h2 className="font-display font-semibold mb-4 text-xl">2. Summary (Optional)</h2>
                <textarea className="input-3d text-sm min-h-[100px]" placeholder="A brief professional summary..." value={data.summary} onChange={e => setData({...data, summary: e.target.value})} />
              </div>

              {/* Experience */}
              <div className="card-3d p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-display font-semibold text-xl">3. Experience</h2>
                  <button onClick={() => setData({...data, experience: [...data.experience, { company: '', role: '', location: '', startDate: '', endDate: '', current: false, bullets: '' }]})} className="text-purple-400 text-sm flex items-center gap-1 hover:text-purple-300"><Plus className="w-4 h-4"/> Add</button>
                </div>
                {data.experience.map((exp, i) => (
                  <div key={i} className="mb-6 border-l-2 border-purple-500/30 pl-4 relative">
                    {i > 0 && <button onClick={() => setData({...data, experience: data.experience.filter((_, idx) => idx !== i)})} className="absolute top-0 right-0 p-1 text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4"/></button>}
                    <div className="grid grid-cols-2 gap-3 mb-3 pr-6">
                      <input className="input-3d text-sm" placeholder="Company" value={exp.company} onChange={e => {const n = [...data.experience]; n[i].company = e.target.value; setData({...data, experience: n})}} />
                      <input className="input-3d text-sm" placeholder="Role (e.g. Software Engineer)" value={exp.role} onChange={e => {const n = [...data.experience]; n[i].role = e.target.value; setData({...data, experience: n})}} />
                      <input className="input-3d text-sm" placeholder="Start Date (e.g. Jan 2020)" value={exp.startDate} onChange={e => {const n = [...data.experience]; n[i].startDate = e.target.value; setData({...data, experience: n})}} />
                      <input className="input-3d text-sm" placeholder="End Date (e.g. Present)" value={exp.endDate} onChange={e => {const n = [...data.experience]; n[i].endDate = e.target.value; setData({...data, experience: n})}} />
                      <input className="input-3d text-sm col-span-2" placeholder="Location" value={exp.location} onChange={e => {const n = [...data.experience]; n[i].location = e.target.value; setData({...data, experience: n})}} />
                    </div>
                    <textarea className="input-3d text-sm min-h-[100px]" placeholder="- Achieved X by doing Y resulting in Z% improvement..." value={exp.bullets} onChange={e => {const n = [...data.experience]; n[i].bullets = e.target.value; setData({...data, experience: n})}} />
                  </div>
                ))}
              </div>

              {/* Education */}
              <div className="card-3d p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-display font-semibold text-xl">4. Education</h2>
                  <button onClick={() => setData({...data, education: [...data.education, { institution: '', degree: '', graduationDate: '', gpa: '' }]})} className="text-purple-400 text-sm flex items-center gap-1 hover:text-purple-300"><Plus className="w-4 h-4"/> Add</button>
                </div>
                {data.education.map((edu, i) => (
                  <div key={i} className="mb-4 grid grid-cols-2 gap-3 relative pr-6">
                    {i > 0 && <button onClick={() => setData({...data, education: data.education.filter((_, idx) => idx !== i)})} className="absolute top-2 right-0 p-1 text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4"/></button>}
                    <input className="input-3d text-sm" placeholder="Institution" value={edu.institution} onChange={e => {const n = [...data.education]; n[i].institution = e.target.value; setData({...data, education: n})}} />
                    <input className="input-3d text-sm" placeholder="Degree (e.g. B.S. CS)" value={edu.degree} onChange={e => {const n = [...data.education]; n[i].degree = e.target.value; setData({...data, education: n})}} />
                    <input className="input-3d text-sm" placeholder="Graduation (e.g. May 2024)" value={edu.graduationDate} onChange={e => {const n = [...data.education]; n[i].graduationDate = e.target.value; setData({...data, education: n})}} />
                    <input className="input-3d text-sm" placeholder="GPA (Optional)" value={edu.gpa} onChange={e => {const n = [...data.education]; n[i].gpa = e.target.value; setData({...data, education: n})}} />
                  </div>
                ))}
              </div>

              {/* Projects */}
              <div className="card-3d p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-display font-semibold text-xl">5. Projects</h2>
                  <button onClick={() => setData({...data, projects: [...data.projects, { name: '', description: '', technologies: '' }]})} className="text-purple-400 text-sm flex items-center gap-1 hover:text-purple-300"><Plus className="w-4 h-4"/> Add</button>
                </div>
                {data.projects.map((proj, i) => (
                  <div key={i} className="mb-4 border-l-2 border-purple-500/30 pl-4 relative">
                    {i > 0 && <button onClick={() => setData({...data, projects: data.projects.filter((_, idx) => idx !== i)})} className="absolute top-0 right-0 p-1 text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4"/></button>}
                    <div className="grid grid-cols-2 gap-3 mb-3 pr-6">
                      <input className="input-3d text-sm" placeholder="Project Name" value={proj.name} onChange={e => {const n = [...data.projects]; n[i].name = e.target.value; setData({...data, projects: n})}} />
                      <input className="input-3d text-sm" placeholder="Technologies (e.g. React, Node.js)" value={proj.technologies} onChange={e => {const n = [...data.projects]; n[i].technologies = e.target.value; setData({...data, projects: n})}} />
                    </div>
                    <textarea className="input-3d text-sm min-h-[80px]" placeholder="- Developed an innovative app that..." value={proj.description} onChange={e => {const n = [...data.projects]; n[i].description = e.target.value; setData({...data, projects: n})}} />
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div className="card-3d p-6">
                <h2 className="font-display font-semibold mb-4 text-xl">6. Technical Skills</h2>
                <textarea className="input-3d text-sm min-h-[80px]" placeholder="Programming Languages, Tools, Frameworks (e.g. JavaScript, Python, AWS, Docker...)" value={data.skills} onChange={e => setData({...data, skills: e.target.value})} />
              </div>

            </div>
          </motion.div>
        </div>

        {/* Live Preview & Export Side */}
        <div className={`lg:w-1/2 flex-col no-print lg:h-[85vh] ${activeMobileTab === 'preview' ? 'flex' : 'hidden lg:flex'}`}>
          <div className="flex items-center justify-end gap-3 mb-4 shrink-0">
            <button onClick={handleDownloadPdf} className="btn-3d px-6 py-3 text-sm flex items-center gap-2">
              <Printer className="w-4 h-4" /> Save as PDF
            </button>
            <button onClick={handleDownloadDocx} className="btn-3d px-6 py-3 text-sm flex items-center gap-2 bg-blue-600 border-blue-400 shadow-[0_6px_0_#2563eb]">
              <FileText className="w-4 h-4" /> Save DOCX (ATS)
            </button>
          </div>
          
          {/* Scrollable Container for Preview */}
          <div className="flex-1 bg-[#525659] rounded-lg shadow-2xl overflow-y-auto custom-scrollbar flex justify-center p-4 sm:p-8">
            {/* Actual Printable Document Container which looks like a real piece of paper */}
            <div 
              ref={printRef}
              className="w-full max-w-[850px] bg-white text-black shadow-lg"
              style={{ fontFamily, minHeight: '1100px', padding: '40px 60px' }}
            >
              {/* Personal Info */}
              <div className={`mb-6 ${layout === 'modern' ? 'text-left' : 'text-center'}`}>
                <h1 className="font-bold uppercase mb-2 leading-tight" style={{ fontSize: layout === 'modern' ? '2.5rem' : '2.2rem', color: layout === 'modern' ? accentColor : 'black' }}>
                  {data.personal.fullName || 'YOUR NAME'}
                </h1>
                <p className="text-[14px]" style={{ color: layout === 'modern' ? '#4b5563' : 'black' }}>
                  {[data.personal.location, data.personal.email, data.personal.phone, data.personal.linkedin, data.personal.github].filter(Boolean).join('  |  ')}
                </p>
              </div>

              {/* Summary */}
              {data.summary?.trim() && (
                <div className="mb-4">
                  <h2 className="text-[16px] uppercase font-bold mb-2 pb-0.5" style={HeaderStyle()}>Professional Summary</h2>
                  <p className="text-[14px] leading-relaxed">{data.summary}</p>
                </div>
              )}

              {/* Experience */}
              {data.experience.some(e => e.company || e.role) && (
                <div className="mb-4">
                  <h2 className="text-[16px] uppercase font-bold mb-2 pb-0.5" style={HeaderStyle()}>Experience</h2>
                  {data.experience.map((exp, i) => {
                    if (!exp.company && !exp.role) return null;
                    return (
                      <div key={i} className="mb-3">
                        <div className="flex justify-between items-baseline">
                          <span className="text-[15px] font-bold" style={{ color: layout === 'modern' ? accentColor : 'black' }}>{exp.role || 'Role'}</span>
                          <span className="text-[14px] font-bold">
                            {exp.startDate} – {exp.endDate}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline mb-1">
                          <span className="text-[14px] italic text-gray-800">{exp.company || 'Company'}</span>
                          <span className="text-[14px]">{exp.location}</span>
                        </div>
                        {exp.bullets?.trim() && (
                          <ul className="list-disc ml-5 text-[14px] leading-relaxed space-y-1">
                            {exp.bullets.split('\n').filter(b => b.trim()).map((b, idx) => (
                              <li key={idx} className="pl-1">{b}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Projects */}
              {data.projects.some(p => p.name) && (
                <div className="mb-4">
                  <h2 className="text-[16px] uppercase font-bold mb-2 pb-0.5" style={HeaderStyle()}>Projects</h2>
                  {data.projects.map((proj, i) => {
                    if (!proj.name) return null;
                    return (
                      <div key={i} className="mb-3 text-[14px] leading-relaxed">
                        <p>
                          <span className="font-bold" style={{ color: layout === 'modern' ? accentColor : 'black' }}>{proj.name}</span>
                          {proj.technologies && <span className="italic"> | {proj.technologies}</span>}
                        </p>
                        {proj.description?.trim() && (
                          <ul className="list-disc ml-5 space-y-1 mt-1">
                            {proj.description.split('\n').filter(b => b.trim()).map((b, idx) => (
                              <li key={idx} className="pl-1">{b}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Education */}
              {data.education.some(e => e.institution) && (
                <div className="mb-4">
                  <h2 className="text-[16px] uppercase font-bold mb-2 pb-0.5" style={HeaderStyle()}>Education</h2>
                  {data.education.map((edu, i) => {
                    if (!edu.institution) return null;
                    return (
                      <div key={i} className="mb-3">
                        <div className="flex justify-between items-baseline">
                          <span className="text-[15px] font-bold" style={{ color: layout === 'modern' ? accentColor : 'black' }}>{edu.institution}</span>
                          <span className="text-[14px] font-bold">{edu.graduationDate}</span>
                        </div>
                        <div>
                          <span className="text-[14px] italic text-gray-800">{edu.degree}</span>
                          {edu.gpa && <span className="text-[14px]"> | GPA: {edu.gpa}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Skills */}
              {data.skills?.trim() && (
                <div className="mb-4">
                  <h2 className="text-[16px] uppercase font-bold mb-2 pb-0.5" style={HeaderStyle()}>Technical Skills</h2>
                  <p className="text-[14px] leading-relaxed">{data.skills}</p>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
