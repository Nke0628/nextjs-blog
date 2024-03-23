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
    <div className="flex justify-end">
      <div className="mr-auto">
        {currentPage != 1 && (
          <Link href={`/articles/page/${Number(currentPage) - 1}`}>
            <button className="bg-gray-500 py-2 px-4 rounded inline-flex items-center text-white">
              <span>前へ</span>
            </button>
          </Link>
        )}
      </div>
      <div className="text-right">
        {currentPage != totalPages && (
          <Link href={`/articles/page/${Number(currentPage) + 1}`}>
            <button className="bg-gray-500 py-2 px-4 rounded inline-flex items-center text-white">
              <span>次へ</span>
            </button>
          </Link>
        )}
      </div>
    </div>
  )
}

export default Pagination
