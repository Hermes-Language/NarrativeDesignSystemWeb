<script lang="ts">
    import { fade } from 'svelte/transition';
    import { Down } from '@icon-park/svg';
    
    let { label = "Options", items = [] } = $props();
    
    let isOpen = $state(false);

    function toggle() {
        isOpen = !isOpen;
    }

    function close() {
        isOpen = false;
    }
</script>

<div class="dropdown">
    <button class="dropdown-trigger" onclick={toggle}>
        {label} <span class="arrow" class:open={isOpen}>{@html Down({ size: 14 })}</span>
    </button>

    {#if isOpen}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="dropdown-backdrop" role="presentation" onclick={close}></div>
        <div class="dropdown-menu" transition:fade={{ duration: 100 }}>
            {#each items as item}
                {#if item.href}
                    <a href={item.href} class="dropdown-item" onclick={close}>{item.label}</a>
                {:else}
                    <button class="dropdown-item" onclick={() => { item.onClick?.(); close(); }}>
                        {item.label}
                    </button>
                {/if}
            {/each}
        </div>
    {/if}
</div>

<style>
    .dropdown {
        position: relative;
        display: inline-block;
    }

    .dropdown-trigger {
        background: none;
        border: 1px solid var(--border-color);
        padding: 0.5rem 1rem;
        font-family: var(--font-serif);
        font-size: 1.1rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .arrow {
        font-family: var(--font-sans);
        font-size: 0.8rem;
        transition: transform 0.2s;
    }

    .arrow.open {
        transform: rotate(180deg);
    }

    .dropdown-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 90;
    }

    .dropdown-menu {
        position: absolute;
        top: calc(100% + 0.5rem);
        right: 0;
        background: var(--bg-color);
        border: 1px solid var(--border-color);
        min-width: 160px;
        z-index: 100;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }

    .dropdown-item {
        display: block;
        width: 100%;
        padding: 0.75rem 1rem;
        text-align: left;
        background: none;
        border: none;
        font-family: var(--font-serif);
        font-size: 1rem;
        color: var(--text-color);
        text-decoration: none;
        cursor: pointer;
        transition: background 0.2s;
    }

    .dropdown-item:hover {
        background-color: var(--hover-bg);
    }

    .dropdown-item:not(:last-child) {
        border-bottom: 1px solid var(--border-color);
    }
</style>
