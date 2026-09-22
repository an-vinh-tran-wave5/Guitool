/** @type {import('tailwindcss').Config} */

// Every color below resolves to a CSS custom property (defined in
// src/index.css for both the dark theme, `:root`'s default, and the light
// theme, `:root[data-theme="light"]`) rather than a literal hex value.
// `<alpha-value>` is Tailwind's placeholder for opacity modifiers like
// `bg-ink-800/80` — it only works when the color function is `rgb(var(...) /
// <alpha-value>)` with the CSS variable holding space-separated R G B
// numbers, not a hex string. This is what lets every existing `bg-ink-*` /
// `text-parchment-*` / `border-brass-*` / etc. class in the app respond to
// the active theme without any component needing a `dark:` variant of its
// own — see useTheme.tsx and the "Dark mode & language" README section.
function themedColor(name) {
  return {
    100: `rgb(var(--color-${name}-100) / <alpha-value>)`,
    200: `rgb(var(--color-${name}-200) / <alpha-value>)`,
    300: `rgb(var(--color-${name}-300) / <alpha-value>)`,
    400: `rgb(var(--color-${name}-400) / <alpha-value>)`,
    500: `rgb(var(--color-${name}-500) / <alpha-value>)`,
    600: `rgb(var(--color-${name}-600) / <alpha-value>)`,
    700: `rgb(var(--color-${name}-700) / <alpha-value>)`,
    800: `rgb(var(--color-${name}-800) / <alpha-value>)`,
    900: `rgb(var(--color-${name}-900) / <alpha-value>)`,
    950: `rgb(var(--color-${name}-950) / <alpha-value>)`,
  }
}

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Vintage tube-amp tolex + modern metal palette
        ink: themedColor('ink'),
        brass: themedColor('brass'),
        ember: themedColor('ember'),
        parchment: themedColor('parchment'),
      },
      fontFamily: {
        display: ['"Oswald"', '"Arial Narrow"', 'sans-serif'],
        body: ['"Work Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        grain: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.035) 1px, transparent 0)",
        'brass-sheen': 'linear-gradient(135deg, #f1e3b8 0%, #c9a24b 45%, #84612c 100%)',
      },
      boxShadow: {
        panel: '0 1px 0 rgba(255,255,255,0.04) inset, 0 12px 30px -12px rgba(0,0,0,0.6)',
        knob: '0 2px 4px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06) inset',
      },
      letterSpacing: {
        widest2: '0.2em',
      },
    },
  },
  plugins: [],
}
