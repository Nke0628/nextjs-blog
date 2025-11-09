import React, { useState } from 'react'

import Link from 'next/link'

import ThemeToggle from '@/components/atoms/ThemeToggle'

const Header: React.FC = ({}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const headerLinkList = [
    {
      text: 'articles',
      link: '/articles/page/1',
    },
    {
      text: 'dev',
      link: '/dev',
    },
    {
      text: 'profile',
      link: '/profile',
    },
  ]
  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link
                href="/"
                className="text-3xl hover:scale-110 transition-transform duration-200"
              >
                🐕
              </Link>
              <div className="hidden md:block ml-10">
                <nav className="flex space-x-8">
                  {headerLinkList.map((headerLink, index) => (
                    <Link
                      key={index}
                      href={headerLink.link}
                      className="relative font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 group"
                    >
                      {headerLink.text}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="md:hidden">
                <button
                  onClick={() => {
                    setIsOpen(!isOpen)
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                  aria-label="Toggle menu"
                >
                  {!isOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
              </div>
            </div>
          </div>
          {isOpen && (
            <div className="md:hidden pb-4 animate-slide-down">
              <nav className="flex flex-col space-y-2">
                {headerLinkList.map((headerLink, index) => (
                  <Link
                    key={index}
                    href={headerLink.link}
                    className="font-semibold px-4 py-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {headerLink.text}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  )
}

export default Header
