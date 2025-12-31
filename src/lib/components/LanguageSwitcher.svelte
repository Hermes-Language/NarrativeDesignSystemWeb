<script lang="ts">
    import { fade } from 'svelte/transition';
    import { Switch, Down } from '@icon-park/svg';
    import StateSwitch from './StateSwitch.svelte';

    let { 
        source = $bindable("English"), 
        target = $bindable("Chinese"),
        sourceLanguages = ["English", "Chinese", "Japanese", "French", "German", "Spanish", "Korean", "Russian"],
        targetLanguages = ["English", "Chinese", "Japanese", "French", "German", "Spanish", "Korean", "Russian"],
        mostUsed = ["English", "Chinese", "Japanese"],
        showModeSwitch = true
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
    </div>
    
    <button class="swap-button" onclick={swap} aria-label="Swap languages">
        {@html Switch({ size: 32, strokeWidth: 2 })}
    </button>

    <!-- Target Language Dropdown -->
    <div class="dropdown-container">
        <button class="lang-trigger" onclick={() => { targetOpen = !targetOpen; sourceOpen = false; }}>
            {target} <span class="chevron" class:open={targetOpen}>{@html Down({ size: 14 })}</span>
        </button>
    </div>
</div>

{#if sourceOpen || targetOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div 
        class="click-outside" 
        role="presentation" 
        onclick={() => { sourceOpen = false; targetOpen = false; }}
        transition:fade={{ duration: 200 }}
    ></div>

    <div class="language-panel" transition:fade={{ duration: 100 }}>
        <div class="drag-handle"></div>
        {#if showModeSwitch}
            <div class="panel-header">
                <StateSwitch 
                    options={[
                        { id: 'Machine', label: 'Machine' },
                        { id: 'Neural', label: 'Neural' }
                    ]} 
                    bind:activeId={translationMode}
                />
            </div>
        {/if}
        <div class="panel-content">
            <div class="side-column">
                <span class="column-label">Most Used</span>
                {#each mostUsed as lang}
                    <button 
                        class="panel-item" 
                        class:active={(sourceOpen ? source : target) === lang} 
                        onclick={() => sourceOpen ? selectSource(lang) : selectTarget(lang)}
                    >
                        {lang}
                    </button>
                {/each}
            </div>
            <div class="main-column">
                <span class="column-label">All Languages</span>
                <div class="panel-grid">
                    {#each (sourceOpen ? sourceLanguages : targetLanguages) as lang}
                        <button 
                            class="panel-item" 
                            class:active={(sourceOpen ? source : target) === lang} 
                            onclick={() => sourceOpen ? selectSource(lang) : selectTarget(lang)}
                        >
                            {lang}
                        </button>
                    {/each}
                </div>
            </div>
        </div>
    </div>
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

    @media (max-width: 600px) {
        .language-switcher {
            gap: 0.5rem;
            justify-content: space-between;
            width: 100%;
            margin: 1rem 0;
        }
    }

    .dropdown-container {
        position: relative;
        min-width: 140px;
    }

    @media (max-width: 600px) {
        .dropdown-container {
            min-width: 0;
            flex: 1;
        }
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

    @media (max-width: 600px) {
        .lang-trigger {
            font-size: 1.1rem;
            padding: 0.25rem;
        }
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
        position: fixed;
        top: 120px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--panel-bg);
        border: 1px solid var(--border-color);
        width: 640px;
        max-width: 95vw;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        z-index: 1100;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    @media (max-width: 600px) {
        .language-panel {
            top: auto;
            bottom: 0;
            left: 0;
            right: 0;
            transform: none;
            width: 100%;
            max-width: 100%;
            max-height: 85vh;
            border-left: none;
            border-right: none;
            border-bottom: none;
            border-top: 1px solid var(--border-color);
            border-radius: 0;
        }
    }

    .panel-header {
        padding: 1.5rem;
        border-bottom: 1px solid var(--border-color);
        display: flex;
        justify-content: center;
        flex-shrink: 0;
    }

    @media (max-width: 600px) {
        .panel-header {
            padding: 1rem;
        }
    }

    :global(.language-panel .state-switch) {
        max-width: 280px;
    }

    .panel-content {
        display: flex;
        justify-content: center;
        padding: 2rem 1.5rem;
        gap: 4rem;
        max-height: 60vh;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }

    @media (max-width: 600px) {
        .panel-content {
            flex-direction: column;
            justify-content: flex-start;
            align-items: stretch;
            gap: 2rem;
            padding: 1.5rem;
            max-height: none;
            flex: 1;
            overflow-y: auto;
        }
    }

    .side-column {
        flex: 0 0 120px;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    @media (max-width: 600px) {
        .side-column {
            flex: none;
        }
    }

    .main-column {
        flex: 0 1 auto;
    }

    .column-label {
        display: block;
        font-family: var(--font-sans);
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--secondary-text);
        margin-bottom: 1rem;
    }

    .panel-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.5rem;
    }

    @media (max-width: 600px) {
        .panel-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 400px) {
        .panel-grid {
            grid-template-columns: 1fr;
        }
    }

    .panel-item {
        display: block;
        width: 100%;
        padding: 0.75rem 1rem;
        text-align: left;
        background: none;
        border: none;
        font-family: var(--font-serif);
        font-size: 1.1rem;
        cursor: pointer;
        color: var(--text-color);
        transition: all 0.2s;
        border-radius: 0;
    }

    .panel-item:hover {
        background-color: var(--hover-bg);
    }

    .panel-item.active {
        background-color: var(--text-color);
        color: var(--bg-color);
        font-weight: 600;
    }

    .drag-handle {
        width: 40px;
        height: 4px;
        background: var(--border-color);
        opacity: 0.2;
        margin: 0.75rem auto 0;
        border-radius: 2px;
        flex-shrink: 0;
        display: none;
    }

    @media (max-width: 600px) {
        .drag-handle {
            display: block;
        }
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

    @media (max-width: 600px) {
        .swap-button {
            padding: 0.25rem;
        }
        :global(.swap-button svg) {
            width: 24px !important;
            height: 24px !important;
        }
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
        background: var(--overlay-bg);
        z-index: 1050;
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
    }
</style>
