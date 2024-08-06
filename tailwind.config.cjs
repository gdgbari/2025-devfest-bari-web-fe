const websiteConfig = require("./src/config");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
  theme: {

    extend: {
      colors: {
        black: "#1e1e1e",
        red: {
          dark: "#8C2820",
          DEFAULT: "#EA4335",
          half: "#FF7DAF",
          pastel: "#F8D8D8",
        },
        blue: {
          dark: "#285092",
          DEFAULT: "#4285F4",
          half: "#57CAFF",
          pastel: "#C3ECF6",
        },
        green: {
          dark: "#1F6532",
          DEFAULT: "#34A853",
          half: "#5CDB6D",
          pastel: "#CCF6C5",
        },
        yellow: {
          dark: "#956700",
          DEFAULT: "#F9AB00",
          half: "#FFD427",
          pastel: "#FFE7A5",
        },
      },
      spacing: {
        128: "32rem",
        "8xl": "88rem",
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#EA4335",
          "primary-content": "#ffffff",
          "secondary": "#FF7DAF",
          "accent": "#57CAFF",
          "neutral": "#C4C4C4",
          "base-100": "#1e1e1e",
          "base-200": "#BDBCBC",
          "base-300": "#DDDDDD",
          "base-content": "#1e1e1e",
          "info": "#C3ECF6",
          "success": "#34A853",
          "warning": "#F9AB00",
          "error": "#EA4335",
        },
      },
    ],
  },
  safelist: [
    "md:text-end",
    "left-0",
    "left-[-16rem]",
    "bg-black/30",
    "bg-black/0",
    "xl:grid-cols-1",
    "xl:grid-cols-2",
    "xl:grid-cols-3",
    "xl:grid-cols-4",
    "xl:grid-cols-5",
    "xl:grid-cols-6",
    "xl:grid-rows-13",
    "xl:col-span-1",
    "xl:col-span-2",
    "xl:col-span-3",
    "xl:col-span-4",
    "xl:col-span-5",
    "xl:col-span-6",
    "xl:row-span-2",
    "bg-[url(/assets/images/gallery/01.webp)]",
    "bg-[url(/assets/images/gallery/02.webp)]",
    "bg-[url(/assets/images/gallery/03.webp)]",
    "bg-[url(/assets/images/gallery/04.webp)]",
    "bg-[url(/assets/images/gallery/05.webp)]",
    "bg-[url(/assets/images/gallery/06.webp)]",
    "bg-[url(/assets/images/gallery/07.webp)]",
    "bg-[url(/assets/images/gallery/08.webp)]",
    "bg-[url(/assets/images/gallery/09.webp)]",
    "bg-[url(/assets/images/gallery/10.webp)]",
    "xl:grid-cols-[200px_repeat(5,_minmax(0,_1fr))]"
  ],
};
