import Link from 'next/link'
import React, { useState } from 'react'

type Props = {}

const Header: React.FC<Props> = ({}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const headerLinkList = [
    {
      text: 'articles',
      link: '',
    },
    {
      text: 'dev',
      link: '',
    },
    {
      text: 'profile',
      link: '',
    },
  ]
  return (
    <>
      <header className="py-4">
        <div className="flex justify-between items-center">
          <div className="flex">
            <div className="text-xl">
              <Link href="/">🐕</Link>
            </div>
            <div className="hidden md:block">
              <nav className="ml-10 flex space-x-4">
                {headerLinkList.map((headerLink, index) => (
                  <a className="font-bold" key={index} href={headerLink.link}>
                    {headerLink.text}
                  </a>
                ))}
              </nav>
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => {
                setIsOpen(!isOpen)
              }}
            >
              {!isOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  aria-hidden="true"
                  className="block h-6 w-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  aria-hidden="true"
                  className="block h-6 w-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              )}
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden">
            <nav className="">
              {headerLinkList.map((headerLink, index) => (
                <a
                  className="font-bold block px-1 py-2"
                  key={index}
                  href={headerLink.link}
                >
                  {headerLink.text}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  )
}

export default Header
