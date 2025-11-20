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
        // Dark theme with purple and orange highlights - inspired by thevariable.com
        background: {
          DEFAULT: "#0A0A0A", // True black
          dark: "#000000", // Pure black
          subtle: "#1A1A1A", // Dark grey
          card: "#121212", // Card background
        },
        foreground: {
          DEFAULT: "#F5F5F5", // Off-white text
          muted: "#A1A1A1", // Muted grey
          subtle: "#737373", // Subtle grey
        },
        purple: {
          DEFAULT: "#8B5CF6", // Vibrant purple
          hover: "#7C3AED",
          light: "#A78BFA",
          dark: "#6D28D9",
          glow: "rgba(139, 92, 246, 0.5)",
        },
        orange: {
          DEFAULT: "#F97316", // Vibrant orange
          hover: "#EA580C",
          light: "#FB923C",
          dark: "#C2410C",
          glow: "rgba(249, 115, 22, 0.5)",
        },
        accent: {
          DEFAULT: "#8B5CF6", // Purple as primary accent
          hover: "#7C3AED",
          light: "#A78BFA",
          dark: "#6D28D9",
        },
        success: {
          DEFAULT: "#10B981", // Emerald
          light: "#34D399",
          dark: "#059669",
        },
        warning: {
          DEFAULT: "#F59E0B", // Amber
          light: "#FBBF24",
          dark: "#D97706",
        },
        neutral: {
          50: "#F5F5F5",
          100: "#E5E5E5",
          200: "#D4D4D4",
          300: "#A1A1A1",
          400: "#737373",
          500: "#525252",
          600: "#404040",
          700: "#262626",
          800: "#171717",
          900: "#0A0A0A",
        },
      },
      fontFamily: {
        // Slab font + Playfair combination inspired by thevariable.com
        display: ["var(--font-playfair)", "serif"], // Elegant display font
        headline: ["var(--font-roboto-slab)", "serif"], // Slab headline font
        body: ["var(--font-roboto-slab)", "serif"], // Slab body font
        ui: ["var(--font-roboto-slab)", "serif"], // Slab UI elements
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
        "soft": "0 2px 8px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.6)",
        "medium": "0 4px 16px rgba(0, 0, 0, 0.6), 0 2px 4px rgba(0, 0, 0, 0.8)",
        "hard": "0 8px 32px rgba(0, 0, 0, 0.8), 0 4px 8px rgba(0, 0, 0, 0.9)",
        "editorial": "0 0 0 1px rgba(255, 255, 255, 0.1), 0 2px 4px rgba(0, 0, 0, 0.6)",
        "glow": "0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.1)",
        "orange-glow": "0 0 20px rgba(249, 115, 22, 0.3), 0 0 40px rgba(249, 115, 22, 0.1)",
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
