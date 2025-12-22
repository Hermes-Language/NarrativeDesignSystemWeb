<script lang="ts">
    import { fade } from 'svelte/transition';

    let { 
        source = $bindable("English"), 
        target = $bindable("Chinese") 
    } = $props();

    const languages = [
        "English", "Chinese", "Japanese", "French", "German", "Spanish", "Korean", "Russian"
    ];

    let sourceOpen = $state(false);
    let targetOpen = $state(false);

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
            {source} <span class="chevron" class:open={sourceOpen}>↓</span>
        </button>
        {#if sourceOpen}
            <div class="dropdown-menu" transition:fade={{ duration: 100 }}>
                {#each languages as lang}
                    <button class="dropdown-item" class:active={source === lang} onclick={() => selectSource(lang)}>
                        {lang}
                    </button>
                {/each}
            </div>
        {/if}
    </div>
    
    <button class="swap-button" onclick={swap} aria-label="Swap languages">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 10H3M3 10l4-4M3 10l4 4" />
            <path d="M7 14h14M21 14l-4-4M21 14l4 4" />
        </svg>
    </button>

    <!-- Target Language Dropdown -->
    <div class="dropdown-container">
        <button class="lang-trigger" onclick={() => { targetOpen = !targetOpen; sourceOpen = false; }}>
            {target} <span class="chevron" class:open={targetOpen}>↓</span>
        </button>
        {#if targetOpen}
            <div class="dropdown-menu" transition:fade={{ duration: 100 }}>
                {#each languages as lang}
                    <button class="dropdown-item" class:active={target === lang} onclick={() => selectTarget(lang)}>
                        {lang}
                    </button>
                {/each}
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

    .dropdown-menu {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        border: 1px solid var(--border-color);
        margin-top: 0.5rem;
        min-width: 160px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        z-index: 101;
    }

    .dropdown-item {
        display: block;
        width: 100%;
        padding: 0.75rem 1.5rem;
        text-align: center;
        background: none;
        border: none;
        font-family: var(--font-serif);
        font-size: 1.1rem;
        cursor: pointer;
        color: var(--text-color);
        transition: background 0.2s;
    }

    .dropdown-item:hover {
        background-color: #f9f9f9;
    }

    .dropdown-item.active {
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
