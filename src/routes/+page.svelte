<main class="draft-home">
	<header class="top-frame">
		<div class="brand-row">
			<span class="logo-box" aria-hidden="true">H</span>
			<p>Hermes / Narrative Design System</p>
		</div>
		<nav class="main-nav" aria-label="Primary navigation">
			<a href="/">Main</a>
			<a href="/design">Foundation</a>
			<a href="/example">Components</a>
			<a href="/document">Document</a>
		</nav>
	</header>

	<section class="hero" aria-labelledby="home-title">
		<h1 id="home-title">Narrative Design System</h1>
		<p>A Light-Luxury System For Narrative Products</p>
	</section>

	<div class="scroll-indicator" aria-hidden="true"></div>

	<section class="nds-content" aria-label="NDS Introduction">
		<section class="intro-block">
			<p class="kicker">What is NDS</p>
			<h2>一个面向叙事型产品的系统化设计语言</h2>
			<p>
				NDS 把 Foundation、组件和页面模式连接成一套统一的设计语义。它不是单个页面模板，
				而是从排版、色彩、动效到业务交互都可复用的产品级规范。
			</p>
		</section>

		<section class="foundation-grid" aria-label="Foundation Modules">
			<article class="foundation-card">
				<h3>Typography</h3>
				<p>以 serif 为核心叙事字体，建立稳定层级与阅读节奏。</p>
			</article>
			<article class="foundation-card">
				<h3>Color System</h3>
				<p>高对比中性色为骨架，语义色作为状态反馈而非装饰。</p>
			</article>
			<article class="foundation-card">
				<h3>Spacing & Layout</h3>
				<p>通过垂直节奏和结构化留白控制信息密度与视觉秩序。</p>
			</article>
			<article class="foundation-card">
				<h3>Motion</h3>
				<p>动效仅用于状态过渡与因果提示，保持克制和可理解性。</p>
			</article>
		</section>

		<section class="token-panel" aria-label="Core Tokens">
			<h3>Core Tokens</h3>
			<div class="token-table">
				<div class="row"><span>bg-color</span><span>#f7f3f0</span><span>Canvas / Surface</span></div>
				<div class="row"><span>text-color</span><span>#000000</span><span>Primary Text</span></div>
				<div class="row"><span>panel-bg</span><span>#ffffff</span><span>Container Surface</span></div>
				<div class="row"><span>font-serif</span><span>EB Garamond</span><span>Narrative Voice</span></div>
			</div>
		</section>

		<section class="scope-panel" aria-label="Component Scope">
			<h3>Component Scope</h3>
			<div class="scope-grid">
				<div>
					<p class="scope-title">Foundation Components</p>
					<p>Button, Input, Badge, Typography, Card</p>
				</div>
				<div>
					<p class="scope-title">Authoring Components</p>
					<p>Timeline, SubtitleEditor, Annotation, AdvancedTextArea</p>
				</div>
				<div>
					<p class="scope-title">Media Components</p>
					<p>AudioPlayer, Waveform, VideoPreviewer, AudiobookDesigner</p>
				</div>
			</div>
		</section>

		<section class="quick-links" aria-label="Quick Links">
			<a href="/design">Read Foundations</a>
			<a href="/example">Browse Components</a>
			<a href="/document">Open Storybook</a>
		</section>
	</section>
</main>

<style>
	.draft-home {
		min-height: 100vh;
		background: #dddddd;
		color: #000;
		display: flex;
		flex-direction: column;
		font-family: var(--font-serif);
	}

	.top-frame {
		margin: 1.9rem 1.5rem 0;
		padding: 0.8rem 1rem;
		border: 1px solid rgba(0, 0, 0, 0.45);
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1.2rem;
	}

	.brand-row {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		min-width: 0;
	}

	.logo-box {
		width: 2rem;
		height: 2rem;
		border: 1px solid #000;
		background: #000;
		color: #fff;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 1.4rem;
		line-height: 1;
	}

	.brand-row p {
		margin: 0;
		font-size: clamp(1.15rem, 1.55vw, 2rem);
		line-height: 1.1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.main-nav {
		display: inline-flex;
		align-items: center;
		gap: clamp(0.7rem, 1.8vw, 2rem);
		font-size: clamp(1.1rem, 1.75vw, 2rem);
	}

	.main-nav a {
		color: #000;
		text-decoration: none;
	}

	.main-nav a:hover {
		text-decoration: underline;
	}

	.hero {
		min-height: 68vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		padding: 2rem 1rem 4rem;
	}

	.hero h1 {
		margin: 0;
		font-weight: 500;
		font-size: clamp(3.5rem, 8.1vw, 8rem);
		line-height: 1.03;
	}

	.hero p {
		margin: 1rem 0 0;
		font-size: clamp(1.1rem, 2.45vw, 3.2rem);
		line-height: 1.2;
	}

	.scroll-indicator {
		width: 1.65rem;
		height: 1.65rem;
		margin: 0 auto 2.6rem;
		border-right: 1px solid rgba(0, 0, 0, 0.48);
		border-bottom: 1px solid rgba(0, 0, 0, 0.48);
		transform: rotate(45deg);
	}

	.nds-content {
		margin: 0 1.5rem 2.5rem;
		border-top: 1px solid rgba(0, 0, 0, 0.35);
		padding-top: 2rem;
		display: grid;
		gap: 2rem;
	}

	.intro-block {
		max-width: 74ch;
	}

	.kicker {
		margin: 0;
		font-family: var(--font-sans);
		font-size: 0.76rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		opacity: 0.7;
	}

	.intro-block h2 {
		margin: 0.45rem 0 0;
		font-size: clamp(1.6rem, 2.7vw, 2.8rem);
		font-weight: 500;
		line-height: 1.2;
	}

	.intro-block p {
		margin: 0.85rem 0 0;
		font-size: clamp(1rem, 1.2vw, 1.25rem);
		line-height: 1.7;
	}

	.foundation-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0.8rem;
	}

	.foundation-card {
		border: 1px solid rgba(0, 0, 0, 0.36);
		padding: 1rem;
		background: rgba(255, 255, 255, 0.2);
	}

	.foundation-card h3 {
		margin: 0;
		font-size: 1.2rem;
		font-weight: 500;
	}

	.foundation-card p {
		margin: 0.55rem 0 0;
		line-height: 1.6;
	}

	.token-panel,
	.scope-panel {
		border: 1px solid rgba(0, 0, 0, 0.36);
		padding: 1rem;
		background: rgba(255, 255, 255, 0.18);
	}

	.token-panel h3,
	.scope-panel h3 {
		margin: 0;
		font-size: 1.3rem;
		font-weight: 500;
	}

	.token-table {
		margin-top: 0.85rem;
		border-top: 1px solid rgba(0, 0, 0, 0.36);
	}

	.token-table .row {
		display: grid;
		grid-template-columns: 1.2fr 1fr 1.3fr;
		gap: 0.8rem;
		padding: 0.65rem 0;
		border-bottom: 1px solid rgba(0, 0, 0, 0.2);
		font-size: 0.98rem;
	}

	.scope-grid {
		margin-top: 0.85rem;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.8rem;
	}

	.scope-grid > div {
		border: 1px solid rgba(0, 0, 0, 0.25);
		padding: 0.8rem;
	}

	.scope-title {
		margin: 0;
		font-family: var(--font-sans);
		font-size: 0.77rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		opacity: 0.78;
	}

	.scope-grid p {
		margin: 0.5rem 0 0;
		line-height: 1.6;
	}

	.quick-links {
		display: flex;
		gap: 1.2rem;
		padding-bottom: 0.4rem;
		font-size: clamp(1rem, 1.5vw, 1.5rem);
	}

	.quick-links a {
		color: #000;
		text-decoration: none;
		border-bottom: 1px solid rgba(0, 0, 0, 0.35);
	}

	.quick-links a:hover {
		border-color: #000;
	}

	@media (max-width: 980px) {
		.top-frame {
			flex-direction: column;
			align-items: flex-start;
		}

		.main-nav {
			flex-wrap: wrap;
			font-size: 1.1rem;
		}

		.foundation-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.scope-grid {
			grid-template-columns: 1fr;
		}

		.token-table .row {
			grid-template-columns: 1fr;
			gap: 0.35rem;
		}

		.quick-links {
			flex-wrap: wrap;
			font-size: 1.1rem;
		}
	}

	@media (max-width: 640px) {
		.foundation-grid {
			grid-template-columns: 1fr;
		}

		.hero {
			min-height: 62vh;
		}
	}
</style>
