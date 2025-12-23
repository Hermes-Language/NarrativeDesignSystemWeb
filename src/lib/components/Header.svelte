<script lang="ts">
    import { fade, slide } from 'svelte/transition';
    import { Down, User } from '@icon-park/svg';
    import Navbar from './Navbar.svelte';

    const navItems = [
        { name: 'Translate', href: '/translate' },
        { name: 'Dictionary', href: '/dictionary' },
        { name: 'Assistant', href: '/assistant' },
        { name: 'Reader', href: '/reader' },
        { name: 'Editor', href: '/editor' },
        { name: 'Advanced', href: '/advanced' }
    ];

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
                {@html Down({ size: 12 })}
            </span>
        </button>
        <a href="/" class="desktop-logo">Hermes</a>
    </div>
    
    <div class="nav-container">
        <Navbar items={navItems} />
    </div>

    <div class="profile">
        <button aria-label="Profile">
            {@html User({ size: 24 })}
        </button>
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
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem 2rem;
        background-color: var(--bg-color);
        position: relative;
        z-index: 1000;
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
    }

    .nav-container {
        display: block;
    }

    .mobile-menu {
        display: none;
    }

    @media (max-width: 768px) {
        header {
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
            background: #fff;
            padding: 1rem 2rem;
            border-bottom: 1px solid var(--border-color);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
            z-index: 1001;
        }

        .menu-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.05);
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
