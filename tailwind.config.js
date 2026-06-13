/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8E7',
        'cream-dark': '#F5E6C8',
        sketch: '#2D2D2D',
        'sketch-light': '#555555',
        gloob: {
          pink: '#FF6B9D',
          blue: '#4ECDC4',
          yellow: '#FFE66D',
          purple: '#A78BFA',
          green: '#6BCB77',
          orange: '#FF8C42',
        },
      },
      fontFamily: {
        cartoon: ['Bangers', 'cursive'],
        hand: ['Patrick Hand', 'cursive'],
        comic: ['Comic Neue', 'cursive'],
      },
      animation: {
        'wiggle': 'wiggle 0.5s ease-in-out',
        'bounce-slow': 'bounce 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'sketch-in': 'sketchIn 0.4s ease-out',
        'pop': 'pop 0.3s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'doodle-spin': 'doodleSpin 1s ease-in-out',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        sketchIn: {
          '0%': { opacity: '0', transform: 'scale(0.8) rotate(-5deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' },
        },
        pop: {
          '0%': { transform: 'scale(0)' },
          '70%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        doodleSpin: {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(180deg) scale(1.2)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
