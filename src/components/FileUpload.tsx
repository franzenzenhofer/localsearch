import { useRef } from 'react';
import { CloudArrowUpIcon, DocumentPlusIcon } from '@heroicons/react/24/outline';

interface FileUploadProps {
  onUpload: (files: File[]) => void;
  fileCount: number;
}

export function FileUpload({ onUpload, fileCount }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      onUpload(files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div
        onClick={handleClick}
        className="relative border-2 border-dashed border-slate-300 dark:border-slate-600
                   rounded-xl p-8 text-center cursor-pointer
                   hover:border-blue-400 dark:hover:border-blue-500
                   transition-colors duration-200
                   bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.txt,.md,.csv,.html"
          onChange={handleFileSelect}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        
        <CloudArrowUpIcon className="mx-auto h-12 w-12 text-slate-400" />
        
        <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-slate-100">
          Upload files to search
        </h3>
        
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Drag and drop files here, or click to select files
        </p>
        
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
          Supports PDF, DOCX, TXT, MD, CSV, HTML files
        </p>
        
        <button
          type="button"
          className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700
                     text-white text-sm font-medium rounded-lg transition-colors"
        >
          <DocumentPlusIcon className="h-4 w-4 mr-2" />
          Select Files
        </button>
      </div>

      {fileCount > 0 && (
        <div className="text-center py-3 bg-green-50 dark:bg-green-900/20 rounded-lg
                        border border-green-200 dark:border-green-800">
          <p className="text-sm font-medium text-green-700 dark:text-green-300">
            {fileCount} files indexed and ready to search
          </p>
        </div>
      )}
    </div>
  );
}