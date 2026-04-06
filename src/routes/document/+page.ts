import { dev } from '$app/environment';
import { redirect } from '@sveltejs/kit';

export const prerender = true;

export const load = async () => {
	const storybookUrl = dev ? 'http://localhost:6006' : '/storybook/index.html';
	throw redirect(307, storybookUrl);
};
