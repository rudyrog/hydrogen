const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        //"main-bg-dark": ` linear-gradient( to bottom, rgba(0, 0 ,0, 0.955), rgba(0, 0 ,0, 0.955)), url("/images/doodle-bg-white.png");`,

        "main-bg": `
    linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.955),
      rgba(255, 255, 255, 0.955)
    ),
  `,

        "main-bg-dark": `
    /* Highlight at top */
    radial-gradient(
      50% 58% at 50% 7%,
      #00A1FF1A 2%,
      #073AFF00 99%
    ),
    
    /* Left middle gradients */
    radial-gradient(
      18% 28% at 24% 50%,
      #00171AA1 7%,
      #073AFF00 100%
    ),
    radial-gradient(
      18% 28% at 18% 71%,
      #00181E59 6%,
      #073AFF00 100%
    ),
    
    /* Center gradients */
    radial-gradient(
      70% 53% at 36% 76%,
      #00181A82 0%,
      #073AFF00 100%
    ),
    radial-gradient(
      42% 53% at 15% 94%,
      #00021796 7%,
      #073AFF00 100%
    ),
    radial-gradient(
      42% 53% at 34% 72%,
      #080D1736 7%,
      #073AFF00 100%
    ),
    
    /* Bottom gradients */
    radial-gradient(
      18% 28% at 35% 87%,
      #002113FF 7%,
      #073AFF00 100%
    ),
    radial-gradient(
      31% 43% at 7% 98%,
      #000817FF 15%,
      #073AFF00 100%
    ),
    
    /* Right side gradients */
    radial-gradient(
      21% 37% at 72% 23%,
      #00121C94 5%,
      #073AFF00 100%
    ),
    radial-gradient(
      35% 56% at 91% 74%,
      #05000EA8 9%,
      #073AFF00 100%
    ),
    radial-gradient(
      74% 86% at 67% 38%,
      #00071EA1 10%,
      #073AFF00 100%
    ),
    
    /* Base overlay */
    linear-gradient(
      to bottom,
      #000000ef,
      #000000ef
    ),
    
  `,
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
};
