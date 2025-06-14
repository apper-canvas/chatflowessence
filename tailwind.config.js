/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#128C7E',
        secondary: '#25D366',
        accent: '#34B7F1',
        surface: '#FFFFFF',
        background: '#F0F2F5',
        success: '#25D366',
        warning: '#FFA500',
        error: '#DC3545',
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
        message: '18px'
      },
      animation: {
        'typing': 'typing 1.4s ease-in-out infinite',
        'scale-bounce': 'scale-bounce 0.2s ease-out'
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
        }
      }
    },
  },
  plugins: [],
}