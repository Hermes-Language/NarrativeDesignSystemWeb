<script lang="ts">
	import { ChevronDown } from '@lucide/svelte';
    import { fade, slide } from 'svelte/transition';

    interface NavItem {
        name: string;
        href?: string;
        children?: NavItem[];
    }

    let { items = [] as NavItem[], vertical = false } = $props();
    let activeDropdown = $state<string | null>(null);
    const transitionFn = $derived(vertical ? slide : fade);

    function toggleDropdown(name: string, e: Event) {
        e.stopPropagation();
        activeDropdown = activeDropdown === name ? null : name;
    }

    // Close dropdown when clicking outside
    function handleGlobalClick() {
        activeDropdown = null;
    }
</script>

<svelte:window onclick={handleGlobalClick} />

<nav class="navbar" class:vertical>
    {#each items as item (item.name)}
        <div class="nav-item-container">
            {#if item.children}
                <button 
                    class="nav-link dropdown-trigger" 
                    onclick={(e) => toggleDropdown(item.name, e)}
                    aria-expanded={activeDropdown === item.name}
                >
                    {item.name}
                    <span class="chevron" class:open={activeDropdown === item.name}>
                        <ChevronDown size={12} />
                    </span>
                </button>
                
                {#if activeDropdown === item.name}
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <div 
                        class="dropdown-menu" 
                        transition:transitionFn={{ duration: 150 }}
                        onclick={(e) => e.stopPropagation()}
                    >
                        {#each item.children as child (child.name)}
                            <a href={child.href ?? '#'} class="dropdown-item" onclick={() => activeDropdown = null}>{child.name}</a>
                        {/each}
                    </div>
                {/if}
            {:else}
                <a href={item.href ?? '#'} class="nav-link">{item.name}</a>
            {/if}
        </div>
    {/each}
</nav>

<style>
    .navbar {
        display: flex;
        gap: 2.5rem;
    }

    .nav-item-container {
        position: relative;
        display: flex;
        align-items: center;
    }

    .navbar.vertical {
        flex-direction: column;
        gap: 0;
        align-items: stretch;
        width: 100%;
    }

    .navbar.vertical .nav-item-container {
        flex-direction: column;
        align-items: stretch;
    }

    .navbar.vertical .nav-link {
        padding: 1rem 0;
        width: 100%;
        text-align: center;
        border-bottom: 1px solid var(--hover-bg);
        font-size: 1.2rem;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .dropdown-trigger {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.4rem;
        font-family: inherit;
        font-size: inherit;
        color: inherit;
    }

    .navbar.vertical .dropdown-trigger {
        width: 100%;
        padding: 1rem 0;
        border-bottom: 1px solid var(--hover-bg);
    }

    .navbar.vertical .nav-item-container:last-child .nav-link,
    .navbar.vertical .nav-item-container:last-child .dropdown-trigger {
        border-bottom: none;
    }

    .chevron {
        display: flex;
        align-items: center;
        transition: transform 0.3s;
        opacity: 0.5;
    }

    .chevron.open {
        transform: rotate(180deg);
    }

    .dropdown-menu {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: var(--panel-bg);
        border: 1px solid var(--border-color);
        min-width: 160px;
        padding: 0.5rem 0;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        z-index: 100;
        margin-top: 0.5rem;
    }

    .navbar.vertical .dropdown-menu {
        position: static;
        transform: none;
        width: 100%;
        box-shadow: none;
        border: none;
        background: var(--hover-bg);
        margin-top: 0;
        padding: 0;
    }

    .dropdown-item {
        display: block;
        padding: 0.75rem 1.5rem;
        font-family: var(--font-serif);
        font-size: 1rem;
        text-decoration: none;
        color: var(--text-color);
        transition: background 0.2s;
    }

    .dropdown-item:hover {
        background: var(--hover-bg);
    }

    .navbar.vertical .dropdown-item {
        padding: 1rem 0;
        text-align: center;
        border-bottom: 1px solid rgba(0,0,0,0.05);
        font-size: 1.1rem;
    }

    .nav-link {
        font-family: var(--font-serif);
        font-size: 1.1rem;
        text-decoration: none;
        color: var(--text-color);
        transition: opacity 0.2s;
        white-space: nowrap;
    }

    .nav-link:hover {
        opacity: 0.6;
    }

    @media (max-width: 768px) {
        .navbar:not(.vertical) {
            width: 100%;
            justify-content: center;
            overflow-x: auto;
            padding-bottom: 0.5rem;
            gap: 1.5rem;
            scrollbar-width: none;
            -ms-overflow-style: none;
        }
        .navbar:not(.vertical)::-webkit-scrollbar {
            display: none;
        }
    }
</style>