/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';
import tailwindcssAnimate from 'tailwindcss-animate';

export default {
	corePlugins: {
		preflight: false,
		container: false,
	},
	important: true,
	// prefix: 'tw-',
	darkMode: ['class'],
	content: [
		'./index.html',
		'./src/**/*.{js,ts,jsx,tsx}',
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
		'./@/**/*.{ts,tsx,js,jsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			fontFamily: {
				apple: [
				'-apple-system',
				'BlinkMacSystemFont',
				'Segoe UI',
				'Roboto',
				'Helvetica Neue',
				'Arial',
				'sans-serif',
				],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
			},
			zIndex: {
				'1000': '1000', 
				'infinite': '9999999',
			},
			transitionProperty: {
				...defaultTheme.transitionProperty,
				width: 'max-width',
				height: 'height',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
		},
		spacing: {
			'0': '0px',
			'px': '1px',
			'0.5': '2px',
			'1': '4px',
			'1.5': '6px',
			'2': '8px',
			'2.5': '10px',
			'3': '12px',
			'3.5': '14px',
			'4': '16px',
			'5': '20px',
			'6': '24px',
			'7': '28px',
			'8': '32px',
			'9': '36px',
			'10': '40px',
			'11': '44px',
			'12': '48px',
			'14': '56px',
			'16': '64px',
			'20': '80px',
			'24': '96px',
			'28': '112px',
			'32': '128px',
			'36': '144px',
			'40': '160px',
			'44': '176px',
			'48': '192px',
			'52': '208px',
			'56': '224px',
			'60': '240px',
			'64': '256px',
			'72': '288px',
			'80': '320px',
			'96': '384px',
		},
		fontSize: {
			xs: ['12px', '16px'], // font-size: 12px; line-height: 16px;
			sm: ['14px', '20px'], // font-size: 14px; line-height: 20px;
			base: ['16px', '24px'], // font-size: 16px; line-height: 24px;
			lg: ['18px', '28px'], // font-size: 18px; line-height: 28px;
			xl: ['20px', '28px'], // font-size: 20px; line-height: 28px;
			'2xl': ['24px', '32px'], // font-size: 24px; line-height: 32px;
			'3xl': ['30px', '36px'], // font-size: 30px; line-height: 36px;
			'4xl': ['36px', '40px'], // font-size: 36px; line-height: 40px;
			'5xl': ['48px', '1'], // font-size: 48px; line-height: 1;
			'6xl': ['60px', '1'], // font-size: 60px; line-height: 1;
			'7xl': ['72px', '1'], // font-size: 72px; line-height: 1;
			'8xl': ['96px', '1'], // font-size: 96px; line-height: 1;
			'9xl': ['128px', '1'], // font-size: 128px; line-height: 1;
		}
	},
	plugins: [tailwindcssAnimate],
};
