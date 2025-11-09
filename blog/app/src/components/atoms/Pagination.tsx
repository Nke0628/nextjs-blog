import React from 'react'

import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalCount: number
  pageSize: number
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalCount,
  pageSize,
}) => {
  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="flex justify-between items-center gap-4">
      <div>
        {currentPage != 1 && (
          <Link href={`/articles/page/${Number(currentPage) - 1}`}>
            <button className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 py-2 px-4 rounded-lg inline-flex items-center text-gray-700 dark:text-gray-300 text-sm font-medium transition-colors duration-200">
              <span>← 前へ</span>
            </button>
          </Link>
        )}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-500">
        {currentPage} / {totalPages}
      </div>
      <div>
        {currentPage != totalPages && (
          <Link href={`/articles/page/${Number(currentPage) + 1}`}>
            <button className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 py-2 px-4 rounded-lg inline-flex items-center text-gray-700 dark:text-gray-300 text-sm font-medium transition-colors duration-200">
              <span>次へ →</span>
            </button>
          </Link>
        )}
      </div>
    </div>
  )
}

export default Pagination
