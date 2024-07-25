import type { Config } from "tailwindcss";

const config: Config = {
  mode: "jit",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        m: { max: "1068px" },
        s: { max: "768px" },
      },
      maxWidth: {
        "container-l": "1048px",
        "container-m": "744px",
        "container-s": "335px",
      },
    },
  },
  plugins: [],
};

export default config;
