/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#145C4D",
        accent: "#2BB3C0",
        bg: "#F4EDE2",
        muted: "#D2C7B8",
        textc: "#1F2933",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // si prefieres Nunito, dime
      },
    },
  },
  plugins: [],
};
