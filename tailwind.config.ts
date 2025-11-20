import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Editorial Boldness aesthetic - avoiding generic blues/purples
        background: {
          DEFAULT: "#FAFAF9", // Warm off-white
          dark: "#0A0A0A", // True black
          subtle: "#F5F5F4", // Stone-50
        },
        foreground: {
          DEFAULT: "#1C1917", // Stone-900
          muted: "#57534E", // Stone-600
          subtle: "#78716C", // Stone-500
        },
        accent: {
          DEFAULT: "#DC2626", // Bold red - our primary accent
          hover: "#B91C1C",
          light: "#FEE2E2",
          dark: "#991B1B",
        },
        success: {
          DEFAULT: "#059669", // Emerald-600
          light: "#D1FAE5",
          dark: "#047857",
        },
        warning: {
          DEFAULT: "#D97706", // Amber-600
          light: "#FEF3C7",
          dark: "#B45309",
        },
        neutral: {
          50: "#FAFAF9",
          100: "#F5F5F4",
          200: "#E7E5E4",
          300: "#D6D3D1",
          400: "#A8A29E",
          500: "#78716C",
          600: "#57534E",
          700: "#44403C",
          800: "#292524",
          900: "#1C1917",
        },
      },
      fontFamily: {
        // Distinctive font choices - avoiding Inter, Roboto, etc.
        display: ["var(--font-fraunces)", "serif"], // Editorial display font
        headline: ["var(--font-sora)", "sans-serif"], // Modern headline font
        body: ["var(--font-work-sans)", "sans-serif"], // Readable body font
        ui: ["var(--font-outfit)", "sans-serif"], // UI elements
      },
      fontSize: {
        // Type scale with clear hierarchy
        "display-lg": ["5rem", { lineHeight: "1", letterSpacing: "-0.02em" }],
        "display-md": ["3.75rem", { lineHeight: "1", letterSpacing: "-0.02em" }],
        "display-sm": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "heading-xl": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "heading-lg": ["1.875rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        "heading-md": ["1.5rem", { lineHeight: "1.4", letterSpacing: "-0.01em" }],
        "heading-sm": ["1.25rem", { lineHeight: "1.5", letterSpacing: "0" }],
        "body-lg": ["1.125rem", { lineHeight: "1.7", letterSpacing: "0" }],
        "body-md": ["1rem", { lineHeight: "1.6", letterSpacing: "0" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5", letterSpacing: "0" }],
        "ui-lg": ["0.9375rem", { lineHeight: "1.5", letterSpacing: "0.01em" }],
        "ui-md": ["0.875rem", { lineHeight: "1.5", letterSpacing: "0.01em" }],
        "ui-sm": ["0.8125rem", { lineHeight: "1.4", letterSpacing: "0.01em" }],
      },
      spacing: {
        "18": "4.5rem",
        "112": "28rem",
        "128": "32rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        "soft": "0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)",
        "medium": "0 4px 16px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.06)",
        "hard": "0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08)",
        "editorial": "0 0 0 1px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-down": "slideDown 0.4s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
