import { MagnifyingGlassIcon, DocumentIcon, CalendarIcon } from '@heroicons/react/24/outline';
import type { SearchResult } from '../core/types.js';

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
}

export function SearchResults({ results, isLoading }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
        <span className="ml-3 text-slate-600 dark:text-slate-400">Searching...</span>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-slate-400" />
        <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-slate-100">
          No results found
        </h3>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Try uploading some documents or adjusting your search terms
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
          Found {results.length} result{results.length !== 1 ? 's' : ''}
        </h2>
      </div>
      
      <div className="space-y-4">
        {results.map((result) => (
          <div
            key={result.metadata.id}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl
                     border border-slate-200/50 dark:border-slate-700/50 p-6
                     hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3">
                  <DocumentIcon className="h-5 w-5 text-slate-400 flex-shrink-0" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 truncate">
                    {result.metadata.name}
                  </h3>
                </div>
                
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 truncate">
                  {result.metadata.path}
                </p>

                <div className="mt-3 flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                  <span className="flex items-center space-x-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{new Date(result.metadata.lastModified).toLocaleDateString()}</span>
                  </span>
                  <span>{formatFileSize(result.metadata.size)}</span>
                  <span className="uppercase font-medium">{result.metadata.type}</span>
                </div>

                {result.snippets.length > 0 && (
                  <div className="mt-4 p-3 bg-slate-50/80 dark:bg-slate-700/50 rounded-lg">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Content matches:
                    </h4>
                    {result.snippets.slice(0, 2).map((snippet, idx) => (
                      <p key={idx} className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                        {snippet.text}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <div className="ml-4 flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    {Math.round(result.score * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}