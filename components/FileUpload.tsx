import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Play } from 'lucide-react';
import { getSampleCSV } from '../utils/csvParser';

interface FileUploadProps {
  onUpload: (content: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
      setError("Please upload a valid CSV file.");
      return;
    }
    setError(null);
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      onUpload(text);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const loadDemo = () => {
    onUpload(getSampleCSV());
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Workflow Steps */}
      <div className="flex justify-between mb-8 text-sm text-slate-500 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 font-medium text-blue-600">
           <span className="bg-blue-100 px-2 py-0.5 rounded-full">1</span> Upload CSV
        </div>
        <div className="flex items-center gap-2">
           <span className="bg-slate-100 px-2 py-0.5 rounded-full">2</span> View Directory
        </div>
        <div className="flex items-center gap-2">
           <span className="bg-slate-100 px-2 py-0.5 rounded-full">3</span> Export Pages
        </div>
      </div>

      <div 
        className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-white hover:border-blue-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".csv"
          onChange={handleChange}
        />

        <div className="flex flex-col items-center justify-center gap-4">
          <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            {fileName ? <CheckCircle size={32} /> : <Upload size={32} />}
          </div>
          
          <h3 className="text-xl font-semibold text-slate-800">
            {fileName ? "File Processed" : "Upload Gutter Business Data"}
          </h3>
          
          <p className="text-slate-500 max-w-sm">
            {fileName 
              ? `Generating directory from ${fileName}...` 
              : "Drag and drop your CSV file here to instantly create your directory and landing pages."}
          </p>

          {!fileName && (
             <button 
             onClick={() => fileInputRef.current?.click()}
             className="mt-2 px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
           >
             Select CSV File
           </button>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-500 mt-4 bg-red-50 px-4 py-2 rounded-lg">
              <AlertCircle size={16} />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-slate-400 mb-4 text-sm uppercase tracking-wide font-semibold">No file yet? Try it out:</p>
        <button 
          onClick={loadDemo}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors bg-blue-50 px-4 py-2 rounded-lg"
        >
          <Play size={18} />
          Load Demo Gutter Companies
        </button>
      </div>
    </div>
  );
};