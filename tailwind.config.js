/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                green: {
                    DEFAULT: '#50C878',
                    dark: '#3aA85E',
                    light: '#d4f5e0',
                },
                yellow: {
                    DEFAULT: '#F4B400',
                    light: '#fff6cc',
                },
                bg: {
                    DEFAULT: 'rgba(255, 253, 248, 0.9)',
                    alt: 'rgba(247, 245, 238, 0.7)',
                },
                text: {
                    DEFAULT: '#1a1a2e',
                    muted: '#6b7280',
                },
                white: '#ffffff',
                card: '#ffffff',
            },
            fontFamily: {
                heading: ['Poppins', 'sans-serif'],
                body: ['Inter', 'sans-serif'],
            },
            borderRadius: {
                sm: '8px',
                md: '16px',
                lg: '24px',
                full: '999px',
            },
            boxShadow: {
                sm: '0 2px 8px rgba(0, 0, 0, 0.06)',
                md: '0 8px 32px rgba(0, 0, 0, 0.10)',
                lg: '0 20px 60px rgba(0, 0, 0, 0.14)',
                'primary': '0 4px 20px rgba(80, 200, 120, 0.35)',
                'primary-hover': '0 8px 32px rgba(80, 200, 120, 0.45)',
            },
            transitionProperty: {
                'all': 'all',
            },
            transitionTimingFunction: {
                'default': 'cubic-bezier(0.4, 0, 0.2, 1)',
            },
            transitionDuration: {
                '350': '350ms',
            },
        },
    },
    plugins: [],
}
