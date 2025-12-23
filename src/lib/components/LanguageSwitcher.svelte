<script lang="ts">
    import { fade } from 'svelte/transition';
    import { Switch, Down } from '@icon-park/svg';

    let { 
        source = $bindable("English"), 
        target = $bindable("Chinese"),
        sourceLanguages = ["English", "Chinese", "Japanese", "French", "German", "Spanish", "Korean", "Russian"],
        targetLanguages = ["English", "Chinese", "Japanese", "French", "German", "Spanish", "Korean", "Russian"],
        mostUsed = ["English", "Chinese", "Japanese"]
    } = $props();

    let sourceOpen = $state(false);
    let targetOpen = $state(false);
    let translationMode = $state("Neural"); // "Machine" | "Neural"

    function swap() {
        const temp = source;
        source = target;
        target = temp;
    }

    function selectSource(lang: string) {
        source = lang;
        sourceOpen = false;
    }

    function selectTarget(lang: string) {
        target = lang;
        targetOpen = false;
    }
</script>

<div class="language-switcher">
    <!-- Source Language Dropdown -->
    <div class="dropdown-container">
        <button class="lang-trigger" onclick={() => { sourceOpen = !sourceOpen; targetOpen = false; }}>
            {source} <span class="chevron" class:open={sourceOpen}>{@html Down({ size: 14 })}</span>
        </button>
        {#if sourceOpen}
            <div class="language-panel" transition:fade={{ duration: 100 }}>
                <div class="panel-header">
                    <div class="mode-selector">
                        <button class:active={translationMode === 'Machine'} onclick={() => translationMode = 'Machine'}>Machine</button>
                        <button class:active={translationMode === 'Neural'} onclick={() => translationMode = 'Neural'}>Neural</button>
                    </div>
                </div>
                <div class="panel-content">
                    <div class="side-column">
                        <span class="column-label">Most Used</span>
                        {#each mostUsed as lang}
                            <button class="panel-item" class:active={source === lang} onclick={() => selectSource(lang)}>
                                {lang}
                            </button>
                        {/each}
                    </div>
                    <div class="main-column">
                        <span class="column-label">All Languages</span>
                        <div class="panel-grid">
                            {#each sourceLanguages as lang}
                                <button class="panel-item" class:active={source === lang} onclick={() => selectSource(lang)}>
                                    {lang}
                                </button>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
        {/if}
    </div>
    
    <button class="swap-button" onclick={swap} aria-label="Swap languages">
        {@html Switch({ size: 32, strokeWidth: 2 })}
    </button>

    <!-- Target Language Dropdown -->
    <div class="dropdown-container">
        <button class="lang-trigger" onclick={() => { targetOpen = !targetOpen; sourceOpen = false; }}>
            {target} <span class="chevron" class:open={targetOpen}>{@html Down({ size: 14 })}</span>
        </button>
        {#if targetOpen}
            <div class="language-panel" transition:fade={{ duration: 100 }}>
                <div class="panel-header">
                    <div class="mode-selector">
                        <button class:active={translationMode === 'Machine'} onclick={() => translationMode = 'Machine'}>Machine</button>
                        <button class:active={translationMode === 'Neural'} onclick={() => translationMode = 'Neural'}>Neural</button>
                    </div>
                </div>
                <div class="panel-content">
                    <div class="side-column">
                        <span class="column-label">Most Used</span>
                        {#each mostUsed as lang}
                            <button class="panel-item" class:active={target === lang} onclick={() => selectTarget(lang)}>
                                {lang}
                            </button>
                        {/each}
                    </div>
                    <div class="main-column">
                        <span class="column-label">All Languages</span>
                        <div class="panel-grid">
                            {#each targetLanguages as lang}
                                <button class="panel-item" class:active={target === lang} onclick={() => selectTarget(lang)}>
                                    {lang}
                                </button>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>

{#if sourceOpen || targetOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="click-outside" role="presentation" onclick={() => { sourceOpen = false; targetOpen = false; }}></div>
{/if}

<style>
    .language-switcher {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 2rem;
        margin: 2rem 0;
        user-select: none;
        position: relative;
        z-index: 100;
    }

    .dropdown-container {
        position: relative;
        min-width: 180px;
    }

    .lang-trigger {
        width: 100%;
        background: none;
        border: none;
        font-family: var(--font-serif);
        font-size: 1.5rem;
        color: var(--text-color);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.5rem;
        transition: opacity 0.2s;
    }

    .lang-trigger:hover {
        opacity: 0.6;
    }

    .chevron {
        font-family: var(--font-sans);
        font-size: 0.9rem;
        transition: transform 0.3s ease;
    }

    .chevron.open {
        transform: rotate(180deg);
    }

    .language-panel {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        border: 1px solid var(--border-color);
        margin-top: 1rem;
        width: 560px;
        max-width: 95vw;
        box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        z-index: 101;
        display: flex;
        flex-direction: column;
    }

    .panel-header {
        padding: 1rem 1.5rem;
        border-bottom: 1px solid #f0f0f0;
        display: flex;
        justify-content: center;
    }

    .mode-selector {
        display: flex;
        background: #f5f5f5;
        padding: 0.25rem;
        border-radius: 6px;
        gap: 0.25rem;
    }

    .mode-selector button {
        border: none;
        background: none;
        padding: 0.4rem 1rem;
        font-family: var(--font-sans);
        font-size: 0.85rem;
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.2s;
        color: #666;
    }

    .mode-selector button.active {
        background: white;
        color: var(--text-color);
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .panel-content {
        display: flex;
        padding: 1.5rem;
        gap: 2rem;
    }

    .side-column {
        flex: 0 0 120px;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .main-column {
        flex: 1;
    }

    .column-label {
        display: block;
        font-family: var(--font-sans);
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #999;
        margin-bottom: 1rem;
    }

    .panel-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.5rem;
    }

    .panel-item {
        display: block;
        width: 100%;
        padding: 0.6rem 0.5rem;
        text-align: left;
        background: none;
        border: none;
        font-family: var(--font-serif);
        font-size: 0.95rem;
        cursor: pointer;
        color: var(--text-color);
        transition: all 0.2s;
        border-radius: 4px;
    }

    .panel-item:hover {
        background-color: #f9f9f9;
    }

    .panel-item.active {
        background-color: #f0f0f0;
        font-weight: 600;
    }

    .swap-button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-color);
        transition: transform 0.3s ease;
    }

    .swap-button:hover {
        transform: scale(1.1);
    }

    .click-outside {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 90;
    }
</style>
