/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'bounce-slow': 'bounce-slow 7s infinite',
      },
      keyframes: {
        'bounce-slow': {
          '0%, 100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
        },
      },
    },
  },
  // Ensure both plugins are inside this array
  plugins: [
    require('daisyui'),
    require('@tailwindcss/typography'),
  ],
  // Optional: ensures DaisyUI themes are loaded correctly
  daisyui: {
    themes: ["light"], 
  },
}