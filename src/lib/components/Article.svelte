<script lang="ts">
	import DOMPurify from 'isomorphic-dompurify';
	import { marked } from 'marked';

	type ArticleProps = {
		markdown?: string;
		class?: string;
		style?: string;
	};

	marked.setOptions({
		gfm: true,
		breaks: true
	});

	let {
		markdown = '',
		class: className = '',
		style = ''
	}: ArticleProps = $props();

	const renderedHtml = $derived(renderMarkdown(markdown));

	function renderMarkdown(markdownText: string): string {
		if (!markdownText.trim()) {
			return '';
		}

		const rawHtml = marked.parse(markdownText, { async: false }) as string;

		return DOMPurify.sanitize(rawHtml, {
			USE_PROFILES: { html: true },
			FORBID_TAGS: ['style', 'script'],
			FORBID_ATTR: ['style']
		});
	}
</script>

<article class="article {className}" {style}>
	{@html renderedHtml}
</article>

<style>
	.article {
		font-family: var(--font-serif);
		color: var(--text-color);
		line-height: 1.75;
		max-width: 72ch;
		font-size: 1.1rem;
	}

	.article :global(h1),
	.article :global(h2),
	.article :global(h3),
	.article :global(h4),
	.article :global(h5),
	.article :global(h6) {
		line-height: 1.25;
		margin: 2rem 0 1rem;
		font-weight: 500;
	}

	.article :global(h1) {
		font-size: 2.8rem;
	}

	.article :global(h2) {
		font-size: 2rem;
	}

	.article :global(h3) {
		font-size: 1.5rem;
	}

	.article :global(p) {
		margin: 0 0 1.25rem;
	}

	.article :global(ul),
	.article :global(ol) {
		padding-left: 1.25rem;
		margin: 0 0 1.25rem;
	}

	.article :global(ul.contains-task-list) {
		list-style: none;
		padding-left: 0;
	}

	.article :global(li) {
		margin: 0.35rem 0;
	}

	.article :global(.task-list-item) {
		display: flex;
		align-items: flex-start;
		gap: 0.6rem;
	}

	.article :global(.task-list-item input[type='checkbox']) {
		appearance: none;
		width: 1rem;
		height: 1rem;
		border: 1px solid var(--border-color);
		border-radius: 0;
		margin-top: 0.35rem;
		background: var(--panel-bg);
		position: relative;
		flex-shrink: 0;
	}

	.article :global(.task-list-item input[type='checkbox']:checked::after) {
		content: '';
		position: absolute;
		left: 0.25rem;
		top: 0.02rem;
		width: 0.3rem;
		height: 0.58rem;
		border-right: 2px solid var(--text-color);
		border-bottom: 2px solid var(--text-color);
		transform: rotate(45deg);
	}

	.article :global(blockquote) {
		margin: 1.5rem 0;
		padding: 0.2rem 1rem;
		border-left: 3px solid var(--border-color);
		color: var(--secondary-text);
	}

	.article :global(a) {
		color: var(--text-color);
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.article :global(table) {
		width: 100%;
		display: block;
		overflow-x: auto;
		border-collapse: collapse;
		font-family: var(--font-serif);
		margin: 1.75rem 0;
		border: 1px solid var(--border-color);
		background: var(--panel-bg);
	}

	.article :global(thead) {
		background: color-mix(in oklab, var(--hover-bg) 70%, var(--panel-bg));
	}

	.article :global(th) {
		text-align: left;
		padding: 0.9rem 1rem;
		border-bottom: 1px solid var(--border-color);
		font-size: 1.05rem;
		font-weight: 500;
		white-space: nowrap;
	}

	.article :global(td) {
		padding: 1rem;
		border-bottom: 1px solid color-mix(in oklab, var(--border-color) 25%, transparent);
		font-size: 1.05rem;
		vertical-align: top;
	}

	.article :global(tr:last-child td) {
		border-bottom: none;
	}

	.article :global(tbody tr:hover td) {
		background: var(--hover-bg);
	}

	.article :global(pre) {
		background: var(--panel-bg);
		border: 1px solid var(--border-color);
		padding: 1rem;
		overflow-x: auto;
		margin: 1.5rem 0;
	}

	.article :global(button),
	.article :global(input:not([type='checkbox']):not([type='radio'])),
	.article :global(select),
	.article :global(textarea) {
		font-family: var(--font-sans);
		font-size: 0.82rem;
		color: var(--text-color);
		border: 1px solid var(--border-color);
		background: var(--panel-bg);
		border-radius: 0;
		padding: 0.45rem 0.55rem;
		outline: none;
		transition: background-color var(--transition-fast), opacity var(--transition-fast);
	}

	.article :global(button) {
		font-family: var(--font-serif);
		font-size: 1.05rem;
		padding: 0.6rem 1rem;
		cursor: pointer;
	}

	.article :global(button:hover),
	.article :global(input:hover),
	.article :global(select:hover),
	.article :global(textarea:hover) {
		background: var(--hover-bg);
	}

	.article :global(button:focus-visible),
	.article :global(input:focus-visible),
	.article :global(select:focus-visible),
	.article :global(textarea:focus-visible) {
		box-shadow: 0 0 0 2px color-mix(in oklab, var(--text-color) 22%, transparent);
	}

	.article :global(textarea) {
		resize: vertical;
		min-height: 5rem;
	}

	.article :global(img),
	.article :global(video) {
		max-width: 100%;
		height: auto;
		border: 1px solid var(--border-color);
		background: var(--panel-bg);
	}

	.article :global(code) {
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
			'Courier New', monospace;
		font-size: 0.9em;
	}

	.article :global(:not(pre) > code) {
		background: color-mix(in oklab, var(--text-color) 8%, var(--bg-color));
		padding: 0.1rem 0.3rem;
	}

	.article :global(hr) {
		border: none;
		border-top: 1px solid var(--border-color);
		margin: 2rem 0;
	}

	@media (max-width: 768px) {
		.article {
			font-size: 1rem;
		}

		.article :global(h1) {
			font-size: 2.1rem;
		}

		.article :global(h2) {
			font-size: 1.65rem;
		}

		.article :global(h3) {
			font-size: 1.3rem;
		}
	}
</style>