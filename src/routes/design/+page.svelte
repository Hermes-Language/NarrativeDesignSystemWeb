<script lang="ts">
	import Article from '$lib/components/Article.svelte';
	import Button from '$lib/components/Button.svelte';
	import Container from '$lib/components/Container.svelte';

	let { data } = $props<{ data: { markdown: string } }>();
</script>

<main class="design-page">
	<Container size="large">
		<div class="topbar">
			<Button href="/" variant="text">返回首页</Button>
			<p class="meta">Source: static/NDS.md</p>
		</div>

		<Article markdown={data.markdown} class="design-article" />
	</Container>
</main>

<style>
	.design-page {
		padding: 2rem 0 4rem;
	}

	.topbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1.25rem;
		padding-bottom: 0.9rem;
		border-bottom: 1px solid var(--border-color);
	}

	.meta {
		margin: 0;
		font-family: var(--font-sans);
		font-size: 0.78rem;
		letter-spacing: 0.03em;
		text-transform: uppercase;
		color: var(--secondary-text);
	}

	:global(.design-article) {
		max-width: 100%;
	}

	@media (max-width: 768px) {
		.design-page {
			padding-top: 1rem;
		}

		.topbar {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>