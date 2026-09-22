import { addIconSelectors } from '@iconify/tailwind';
import tailwindcssAnimated from 'tailwindcss-animated';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			gridTemplateColumns: {
				sidebar: '256px auto'
			}
		}
	},
	plugins: [tailwindcssAnimated, addIconSelectors(['mdi'])]
};
