// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue':'#00246B',
        'custom-lightblue': '#CADCFC'
      }
    },
  },
  plugins: [],
}