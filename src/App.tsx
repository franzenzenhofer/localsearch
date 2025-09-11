import React from 'react'
import { SearchIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { useDarkMode } from './hooks/useDarkMode'
import { useSearch } from './hooks/useSearch'
import { SearchResults } from './components/SearchResults'
import { FileUpload } from './components/FileUpload'

function App() {
  const [darkMode, toggleDarkMode] = useDarkMode()
  const { 
    query, 
    setQuery, 
    results, 
    isSearching, 
    fileCount,
    performSearch,
    handleFileUpload 
  } = useSearch()

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-indigo-900">
        <div className="container">
          <header className="header">
            <h1>LocalSearch</h1>
            <p>Private, offline folder search</p>
            <button 
              onClick={toggleDarkMode}
              className="theme-toggle"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <SunIcon className="theme-icon" />
              ) : (
                <MoonIcon className="theme-icon" />
              )}
            </button>
          </header>

          <main className="space-y-8">
            <div className="search-section">
              <div className="search-bar">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && performSearch()}
                    placeholder="Search your files..."
                    className="w-full pl-10 pr-4 py-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm
                             border border-slate-200/50 dark:border-slate-700/50 rounded-xl
                             focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50
                             placeholder:text-slate-400 dark:placeholder:text-slate-500
                             text-slate-900 dark:text-slate-100 transition-all"
                  />
                </div>
                <button
                  onClick={performSearch}
                  disabled={!query.trim() || fileCount === 0}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300
                           dark:disabled:bg-slate-700 text-white rounded-xl font-medium
                           transition-colors disabled:cursor-not-allowed"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>

            <FileUpload onUpload={handleFileUpload} fileCount={fileCount} />
            
            <SearchResults results={results} isLoading={isSearching} />
          </main>
        </div>
      </div>
    </div>
  )
}

export default App