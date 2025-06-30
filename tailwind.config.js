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
          50: '#f0f5e8',
          100: '#dae9c8',
          200: '#c1dc9e',
          300: '#a6cd74',
          400: '#8fc151',
          500: '#7CB342',
          600: '#6ba23a',
          700: '#5a8b31',
          800: '#487428',
          900: '#2D5016'
        },
        accent: {
          50: '#fff3e0',
          100: '#ffe0b2',
          200: '#ffcc82',
          300: '#ffb74d',
          400: '#ffa726',
          500: '#F57C00',
          600: '#ef6c00',
          700: '#e65100',
          800: '#d84315',
          900: '#bf360c'
        },
        surface: '#FAFAF8',
        background: '#F5F5F0',
        success: '#43A047',
        warning: '#FFA726',
        error: '#E53935',
        info: '#1E88E5'
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif']
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #7CB342 0%, #2D5016 100%)',
        'gradient-accent': 'linear-gradient(135deg, #F57C00 0%, #bf360c 100%)',
        'gradient-surface': 'linear-gradient(135deg, #FAFAF8 0%, #F5F5F0 100%)'
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(45, 80, 22, 0.1)',
        'medium': '0 4px 16px rgba(45, 80, 22, 0.15)',
        'hard': '0 8px 32px rgba(45, 80, 22, 0.2)'
      }
    },
  },
  plugins: [],
}