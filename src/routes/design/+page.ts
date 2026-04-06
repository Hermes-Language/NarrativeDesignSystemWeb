import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const response = await fetch('/NDS.md');

	if (!response.ok) {
		return {
			markdown: '# Narrative Design System\n\n文档加载失败，请确认 static/NDS.md 存在。'
		};
	}

	return {
		markdown: await response.text()
	};
};