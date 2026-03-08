<script lang="ts">
    import { fade, slide } from 'svelte/transition';
    import Navbar from './Navbar.svelte';
    import ThemeToggle from './ThemeToggle.svelte';
    import { type Snippet } from 'svelte';
    import * as m from "../paraglide/messages.js";
	import { ChevronDown, User } from '@lucide/svelte';

    let {
        navItems = [
            { 
                get name() { return m.translate() }, 
                children: [
                    { get name() { return m.text_translation() }, href: '/translate/text' },
                    { get name() { return m.doc_translation() }, href: '/translate/doc' },
                    { get name() { return m.web_translation() }, href: '/translate/web' }
                ]
            },
            { get name() { return m.dictionary() }, href: '/dictionary' },
            { 
                get name() { return m.assistant() }, 
                children: [
                    { get name() { return m.writing_assistant() }, href: '/assistant/writing' },
                    { get name() { return m.coding_assistant() }, href: '/assistant/coding' }
                ]
            },
            { get name() { return m.reader() }, href: '/reader' },
            { get name() { return m.editor() }, href: '/editor' },
            { get name() { return m.advanced() }, href: '/advanced' }
        ],
        actions = undefined
    } = $props<{
        navItems?: unknown[];
        actions?: Snippet;
        children?: Snippet;
    }>();

    let isMenuOpen = $state(false);

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }
</script>

<header>
    <div class="mobile-spacer"></div>

    <div class="logo">
        <button class="logo-btn" onclick={toggleMenu} aria-expanded={isMenuOpen}>
            Hermes
            <span class="chevron" class:open={isMenuOpen}>
                <ChevronDown size={12} />
            </span>
        </button>
        <a href="/" class="desktop-logo">Hermes</a>
    </div>
    
    <div class="nav-container">
        <Navbar items={navItems} />
    </div>

    <div class="actions">
        {@render actions?.()}
        <ThemeToggle />
        <div class="profile">
            <button aria-label="Profile">
                <User size={24} />
            </button>
        </div>
    </div>

    {#if isMenuOpen}
        <div class="mobile-menu" transition:slide={{ duration: 300 }}>
            <Navbar items={navItems} vertical={true} />
        </div>
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="menu-overlay" onclick={() => isMenuOpen = false} transition:fade={{ duration: 200 }}></div>
    {/if}
</header>

<style>
    header {
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        padding: var(--spacing-md) var(--spacing-lg);
        background-color: var(--bg-color);
        position: relative;
        z-index: 1000;
        gap: var(--spacing-lg);
    }

    .nav-container {
        display: flex;
        justify-content: center;
    }

    .actions {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        justify-self: end;
    }

    @media (max-width: 1024px) {
        header {
            gap: var(--spacing-sm);
            padding: var(--spacing-md) var(--spacing-sm);
        }
    }

    .mobile-spacer {
        display: none;
    }

    .logo-btn {
        display: none;
        background: none;
        border: none;
        font-family: var(--font-serif);
        font-size: 1.8rem;
        font-weight: 700;
        color: var(--text-color);
        cursor: pointer;
        align-items: center;
        gap: 0.5rem;
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

    .desktop-logo {
        font-family: var(--font-serif);
        font-size: 1.8rem;
        font-weight: 700;
        text-decoration: none;
        color: var(--text-color);
        white-space: nowrap;
    }

    .mobile-menu {
        display: none;
    }

    @media (max-width: 768px) {
        header {
            display: flex;
            justify-content: space-between;
            padding: 1rem;
        }

        .mobile-spacer {
            display: block;
            flex: 1;
        }

        .logo {
            flex: 2;
            display: flex;
            justify-content: center;
        }

        .logo-btn {
            display: flex;
        }

        .desktop-logo {
            display: none;
        }

        .nav-container {
            display: none;
        }

        .profile {
            flex: 1;
            display: flex;
            justify-content: flex-end;
        }

        .mobile-menu {
            display: block;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--bg-color);
            padding: 0;
            border-bottom: 1px solid var(--border-color);
            z-index: 1001;
        }

        .menu-overlay {
            position: fixed;
            top: 4rem; /* Height of header */
            left: 0;
            right: 0;
            bottom: 0;
            background-color: var(--overlay-bg);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            z-index: 999;
        }
    }

    .profile button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        color: var(--text-color);
    }
</style>
