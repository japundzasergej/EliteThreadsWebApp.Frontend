import { transition } from "@angular/animations";
import withMT from "@material-tailwind/html/utils/withMT";
import { transform } from "typescript";

/** @type {import('tailwindcss').Config} */
module.exports = withMT({
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      animation: {
        "content-rise-reset": "content-rise-reset 4s linear infinite",
        "opacity-transition": "opacity-transition 200ms ease-in",
      },
      keyframes: {
        "opacity-transition": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        "content-rise-reset": {
          "0%": {
            transform: "translateY(200%)",
          },
          "30%": {
            transform: "translateY(0)",
          },
          "90%": {
            transform: "translateY(0)",
          },
          "100%": {
            transform: "translateY(-350%)",
          },
        },
      },
      fontFamily: {
        raleway: "Raleway, sans-serif",
        roboto: "Roboto, sans-serif",
      },
      screens: {
        widescreen: "1400px",
        large: "1190px",
      },
    },
  },
  daisyui: {
    themes: ["night"],
  },
  plugins: [
    require("daisyui"),
    function ({ addUtilities }) {
      const newUtilities = {
        ".child-m": {
          "& > *:not(:last-child)": {
            "margin-right": "0.5rem",
          },
          "@media (max-width: 1400px)": {
            "& > *:not(:last-child)": {
              "margin-right": "0",
            },
            "& > :nth-child(1), & > :nth-child(3)": {
              "margin-right": "0.5rem",
            },
            "& > :nth-child(3), & > :nth-child(4)": {
              "margin-top": "0.5rem",
            },
          },
        },
      };

      addUtilities(newUtilities);
    },
  ],
});
