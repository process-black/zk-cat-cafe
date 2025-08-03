/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'delius-unicase': ["var(--font-delius-unicase)", "cursive"],
        'sour-gummy': ["var(--font-sour-gummy)", "cursive"],
      },
    },
  },
  plugins: [],
};
