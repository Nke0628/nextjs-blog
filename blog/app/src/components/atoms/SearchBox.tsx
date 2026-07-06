import React, { useState } from 'react'

type Props = {
  placeholder?: string
  defaultValue?: string
  onSearch: (query: string) => void
  className?: string
}

const SearchBox: React.FC<Props> = ({
  placeholder = '記事を検索...',
  defaultValue = '',
  onSearch,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState<string>(defaultValue)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSearch(searchQuery.trim())
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <span
          aria-hidden="true"
          className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-primary-500 dark:text-primary-400 pointer-events-none"
        >
          /
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-10 py-2.5 font-mono text-sm bg-white/70 dark:bg-ink-900/70 backdrop-blur-sm border border-ink-300 dark:border-ink-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent focus:shadow-glow text-ink-900 dark:text-white placeholder-ink-400 dark:placeholder-ink-500 transition-all duration-200"
          aria-label="記事検索"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-ink-400 dark:text-ink-400 hover:text-primary-600 dark:hover:text-primary-300 transition-colors duration-200"
          aria-label="検索"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </button>
      </div>
    </form>
  )
}

export default SearchBox
