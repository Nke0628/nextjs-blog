import React, { useState } from 'react'

import Link from 'next/link'

import LottieIcon from '@/components/atoms/LottieIcon'
import Logo from '@/components/atoms/Logo'
import ThemeToggle from '@/components/atoms/ThemeToggle'

const DOG_LOTTIE_SRC = '/dog.lottie'

const Header: React.FC = ({}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const headerLinkList = [
    {
      text: 'articles',
      link: '/articles/page/1',
    },
    {
      text: 'tags',
      link: '/tags',
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
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/85 dark:bg-ink-950/85 border-b border-ink-200 dark:border-ink-800">
        {/* 上端のアクセントライン */}
        <div className="h-[2px] w-full bg-gradient-to-r from-primary-500 via-primary-300 to-accent-500" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link
                href="/"
                className="flex items-center gap-2 text-xl md:text-2xl font-logo font-bold text-ink-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-300 transition-colors duration-200 tracking-tight"
              >
                <Logo />
                <span>
                  DevMane
                  <span className="text-primary-500 dark:text-primary-400 animate-blink">
                    _
                  </span>
                </span>
              </Link>
              <div className="hidden md:block ml-10">
                <nav className="flex space-x-6 font-mono text-sm">
                  {headerLinkList.map((headerLink, index) => (
                    <Link
                      key={index}
                      href={headerLink.link}
                      className="group text-ink-500 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white transition-colors duration-200"
                    >
                      <span className="text-primary-500 dark:text-primary-400 opacity-60 group-hover:opacity-100 transition-opacity">
                        /
                      </span>
                      {headerLink.text}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <LottieIcon src={DOG_LOTTIE_SRC} className="w-24 h-14 -mr-7" />
              <ThemeToggle />
              <div className="md:hidden">
                <button
                  onClick={() => {
                    setIsOpen(!isOpen)
                  }}
                  className="p-2 rounded-md border border-transparent hover:border-ink-300 dark:hover:border-ink-700 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors duration-200"
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
              <nav className="flex flex-col space-y-1 font-mono text-sm">
                {headerLinkList.map((headerLink, index) => (
                  <Link
                    key={index}
                    href={headerLink.link}
                    className="px-4 py-2 rounded-md text-ink-500 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 hover:text-ink-900 dark:hover:text-white transition-all duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-primary-500 dark:text-primary-400">
                      /
                    </span>
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
