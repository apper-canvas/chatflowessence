/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7f5',
          100: '#b3e8e1',
          200: '#80d9cd',
          300: '#4dcab9',
          400: '#26b5a3',
          500: '#128C7E',
          600: '#0f7a6e',
          700: '#0c675e',
          800: '#09544e',
          900: '#06413e'
        },
        secondary: {
          50: '#e8f9f0',
          100: '#c2efd4',
          200: '#9ce5b8',
          300: '#76db9c',
          400: '#50d180',
          500: '#25D366',
          600: '#20bd5a',
          700: '#1ba74e',
          800: '#169142',
          900: '#117b36'
        },
        accent: {
          50: '#e8f6fe',
          100: '#c1e7fc',
          200: '#9ad8fa',
          300: '#73c9f8',
          400: '#4cbaf6',
          500: '#34B7F1',
          600: '#2ca4d9',
          700: '#2491c1',
          800: '#1c7ea9',
          900: '#146b91'
        },
        surface: '#FFFFFF',
        background: {
          DEFAULT: '#F8FAFC',
          secondary: '#F1F5F9',
          tertiary: '#E2E8F0'
        },
        success: '#25D366',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#34B7F1',
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      borderRadius: {
        message: '18px',
        '2xl': '1rem',
        '3xl': '1.5rem'
      },
      backdropBlur: {
        xs: '2px'
      },
      animation: {
        'typing': 'typing 1.4s ease-in-out infinite',
        'scale-bounce': 'scale-bounce 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'bounce-gentle': 'bounce-gentle 2s infinite',
        'pulse-soft': 'pulse-soft 2s infinite',
        'float': 'float 6s ease-in-out infinite'
      },
      keyframes: {
        typing: {
          '0%, 60%, 100%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-10px)' }
        },
        'scale-bounce': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.98)' },
          '100%': { transform: 'scale(1)' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      boxShadow: {
        'glow': '0 0 20px rgba(37, 211, 102, 0.3)',
        'glow-primary': '0 0 20px rgba(18, 140, 126, 0.3)',
        'glow-accent': '0 0 20px rgba(52, 183, 241, 0.3)',
        'glass': '0 8px 32px rgba(31, 38, 135, 0.37)',
        'soft': '0 2px 15px rgba(0, 0, 0, 0.08)'
      }
    },
  },
  plugins: [],
}