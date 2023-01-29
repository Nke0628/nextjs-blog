import React, { useState } from 'react'

type Props = {}

const Header: React.FC<Props> = ({}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  return (
    <>
      <div className="py-4">
        <header className="flex justify-between items-center">
          <div className="flex">
            <div className="text-xl">🐻</div>
            <div className="hidden md:block">
              <nav className="ml-10 flex space-x-4">
                <a href="">posts</a>
                <a href="">work</a>
                <a href="">profile</a>
              </nav>
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => {
                setIsOpen(!isOpen)
              }}
            >
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                <path d="M24 6h-24v-4h24v4zm0 4h-24v4h24v-4zm0 8h-24v4h24v-4z" />
              </svg>
            </button>
          </div>
        </header>
        {isOpen && (
          <div className="">
            <nav className="">
              <a href="" className="block">
                posts
              </a>
              <a href="" className="block">
                work
              </a>
              <a href="" className="block">
                profile
              </a>
            </nav>
          </div>
        )}
      </div>
    </>
  )
}

export default Header
