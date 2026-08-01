import React, { useState } from 'react';
import { X, Upload, CheckCircle2, AlertCircle } from 'lucide-react';

interface UploadDatasetModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const UploadDatasetModal: React.FC<UploadDatasetModalProps> = ({
  onClose,
  onSuccess
}) => {
  const [selectedFile, setSelectedFile] = useState<string>('messages.csv');
  const [csvText, setCsvText] = useState<string>('');
  const [statusMsg, setStatusMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleFileUpload = async () => {
    if (!csvText.trim()) {
      setStatusMsg('Please paste or upload non-empty CSV content.');
      return;
    }
    setIsSubmitting(true);
    setStatusMsg('');

    try {
      const res = await fetch('/api/upload-dataset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: selectedFile,
          csv_content: csvText
        })
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMsg(`Successfully saved to dataset/${selectedFile}`);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1000);
      } else {
        setStatusMsg(data.error || 'Failed to upload dataset.');
      }
    } catch (err: any) {
      setStatusMsg(err.message || 'Error connecting to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file.name);
      const reader = new FileReader();
      reader.onload = (evt) => {
        setCsvText(evt.target?.result as string || '');
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#080808] border border-[#1A1A1A] w-full max-w-lg rounded shadow-2xl overflow-hidden p-6 space-y-4">
        
        <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 font-mono">
            <Upload className="w-4 h-4 text-emerald-400" /> Upload Dataset CSV File
          </h3>
          <button onClick={onClose} className="p-1 text-slate-500 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-400 font-mono text-[11px] mb-1">Target Dataset File</label>
            <select
              value={selectedFile}
              onChange={(e) => setSelectedFile(e.target.value)}
              className="w-full bg-[#050505] border border-[#1A1A1A] rounded p-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
            >
              <option value="messages.csv">messages.csv</option>
              <option value="users.csv">users.csv</option>
              <option value="groups.csv">groups.csv</option>
              <option value="business_accounts.csv">business_accounts.csv</option>
              <option value="user_business_history.csv">user_business_history.csv</option>
              <option value="message_history.csv">message_history.csv</option>
              <option value="images.csv">images.csv</option>
              <option value="voice_notes.csv">voice_notes.csv</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-mono text-[11px] mb-1">Local CSV Upload</label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full text-slate-400 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-mono file:bg-[#1A1A1A] file:text-slate-200 hover:file:bg-[#252525] cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-mono text-[11px] mb-1">CSV Content Payload Preview</label>
            <textarea
              rows={6}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder="message_id,sender_id,group_id,message_type,content,timestamp..."
              className="w-full bg-[#050505] border border-[#1A1A1A] rounded p-3 font-mono text-slate-200 text-[11px] focus:outline-none focus:border-emerald-500"
            />
          </div>

          {statusMsg && (
            <div className="p-3 bg-[#050505] rounded border border-[#1A1A1A] text-xs text-emerald-400 flex items-center gap-2 font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{statusMsg}</span>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-[#1A1A1A]">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#1A1A1A] text-slate-300 hover:bg-[#252525] rounded text-xs font-bold cursor-pointer transition"
          >
            Cancel
          </button>
          <button
            onClick={handleFileUpload}
            disabled={isSubmitting}
            className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black rounded text-xs font-bold cursor-pointer transition shadow-[0_0_12px_rgba(16,185,129,0.3)]"
          >
            {isSubmitting ? 'Uploading...' : 'Save Dataset CSV'}
          </button>
        </div>

      </div>
    </div>
  );
};
