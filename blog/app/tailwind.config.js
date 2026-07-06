/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 墨 — base neutral scale (blue-tinted near-black)
        ink: {
          50: '#f6f8fa',
          100: '#e7ecf1',
          200: '#cbd5df',
          300: '#a3b2c2',
          400: '#71839a',
          500: '#4e6076',
          600: '#3a4a5e',
          700: '#2a3648',
          800: '#1a2332',
          900: '#111827',
          950: '#0a0f1a',
        },
        // 電光 — terminal cyan
        primary: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        // 紅 — hinomaru red accent
        accent: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans JP', 'sans-serif'],
        display: ['Space Grotesk', 'Noto Sans JP', 'sans-serif'],
        logo: ['Space Grotesk', 'sans-serif'],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'Menlo',
          'Monaco',
          'monospace',
        ],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-dark':
          'linear-gradient(rgba(34, 211, 238, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.04) 1px, transparent 1px)',
        'grid-light':
          'linear-gradient(rgba(8, 145, 178, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(8, 145, 178, 0.06) 1px, transparent 1px)',
      },
      boxShadow: {
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        glow: '0 0 20px rgba(34, 211, 238, 0.15)',
        'glow-strong': '0 0 30px rgba(34, 211, 238, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        blink: 'blink 1.1s step-end infinite',
        'scan-in': 'scanIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        scanIn: {
          '0%': { transform: 'translateY(14px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
