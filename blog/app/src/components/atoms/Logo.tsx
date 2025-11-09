import React from 'react'

const Logo: React.FC = () => {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block"
    >
      <defs>
        <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" className="text-primary-500">
            <animate
              attributeName="stop-color"
              values="#3b82f6;#8b5cf6;#3b82f6"
              dur="3s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" className="text-accent-500">
            <animate
              attributeName="stop-color"
              values="#8b5cf6;#3b82f6;#8b5cf6"
              dur="3s"
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>
      </defs>

      <rect width="100" height="100" fill="currentColor" rx="20" opacity="0.1" />

      <path
        d="M 30 35 L 20 50 L 30 65"
        stroke="url(#logo-grad)"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 70 35 L 80 50 L 70 65"
        stroke="url(#logo-grad)"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="45"
        y1="65"
        x2="55"
        y2="35"
        stroke="url(#logo-grad)"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default Logo
