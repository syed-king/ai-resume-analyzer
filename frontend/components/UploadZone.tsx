'use client';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';

interface Props {
  onFile: (file: File) => void;
  file: File | null;
  onClear: () => void;
}

export default function UploadZone({ onFile, file, onClear }: Props) {
  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) onFile(accepted[0]);
  }, [onFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    maxFiles: 1,
  });

  return (
    <AnimatePresence mode="wait">
      {file ? (
        <motion.div
          key="file"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass-card p-6 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{file.name}</p>
            <p className="text-white/40 text-xs">{(file.size / 1024).toFixed(0)} KB · Ready to analyze</p>
          </div>
          <button onClick={onClear} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      ) : (
        <motion.div
          key="drop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          {...(getRootProps() as any)}
          className={`glass-card p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 border-2 border-dashed ${
            isDragActive ? 'border-purple-500/60 bg-purple-500/5 shadow-glow' : 'border-white/10 hover:border-purple-500/30'
          }`}
        >
          <input {...getInputProps()} />
          <motion.div
            animate={{ y: isDragActive ? -8 : 0 }}
            transition={{ duration: 0.3 }}
            className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-4"
          >
            {isDragActive ? <FileText className="w-8 h-8 text-purple-400" /> : <Upload className="w-8 h-8 text-purple-400" />}
          </motion.div>
          <p className="font-display font-semibold text-lg mb-2">
            {isDragActive ? 'Drop it here!' : 'Drag & drop your resume'}
          </p>
          <p className="text-white/40 text-sm mb-4">or click to browse files</p>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/40">
            PDF or DOCX · Max 10MB
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
