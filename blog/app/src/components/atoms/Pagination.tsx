import React from 'react'

import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalCount: number
  pageSize: number
  basePath?: string
}

const buttonClass =
  'font-mono text-sm inline-flex items-center gap-2 rounded-md border border-ink-300 dark:border-ink-700 hover:border-primary-400 dark:hover:border-primary-400/60 bg-white/60 dark:bg-ink-900/60 hover:shadow-glow py-2 px-4 text-ink-600 dark:text-ink-300 hover:text-primary-700 dark:hover:text-primary-300 transition-all duration-300'

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalCount,
  pageSize,
  basePath = '/articles/page',
}) => {
  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="flex justify-between items-center gap-4">
      <div>
        {currentPage != 1 && (
          <Link href={`${basePath}/${Number(currentPage) - 1}`}>
            <button className={buttonClass}>
              <span>←</span>
              <span>前へ</span>
            </button>
          </Link>
        )}
      </div>
      <div className="font-mono text-xs text-ink-400 dark:text-ink-400">
        <span className="text-primary-600 dark:text-primary-400">
          {currentPage}
        </span>
        <span className="mx-1">/</span>
        {totalPages}
      </div>
      <div>
        {currentPage != totalPages && (
          <Link href={`${basePath}/${Number(currentPage) + 1}`}>
            <button className={buttonClass}>
              <span>次へ</span>
              <span>→</span>
            </button>
          </Link>
        )}
      </div>
    </div>
  )
}

export default Pagination
