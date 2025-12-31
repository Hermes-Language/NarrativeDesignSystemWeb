<script lang="ts">
    import { onMount } from 'svelte';
    import { SunOne, Moon } from '@icon-park/svg';

    let theme = $state('light');
    let isAnimating = $state(false);
    let animationColor = $state('');

    onMount(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        theme = savedTheme;
        document.documentElement.setAttribute('data-theme', theme);
    });

    async function toggleTheme() {
        if (isAnimating) return;
        
        const nextTheme = theme === 'light' ? 'dark' : 'light';
        animationColor = nextTheme === 'dark' ? '#000000' : '#f7f3f0';
        
        isAnimating = true;

        setTimeout(() => {
            theme = nextTheme;
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        }, 400);

        setTimeout(() => {
            isAnimating = false;
        }, 850);
    }
</script>

<div class="theme-toggle-wrapper">
    <button class="theme-toggle" onclick={toggleTheme} aria-label="Toggle theme">
        {#if theme === 'light'}
            {@html Moon({ size: 20 })}
        {:else}
            {@html SunOne({ size: 20 })}
        {/if}
    </button>

    {#if isAnimating}
        <div 
            class="theme-curtain" 
            style="background-color: {animationColor};"
        ></div>
    {/if}
</div>

<style>
    .theme-toggle-wrapper {
        display: flex;
        align-items: center;
    }

    .theme-toggle {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--text-color);
        display: flex;
        align-items: center;
        padding: 0.5rem;
        transition: opacity 0.2s;
    }

    .theme-toggle:hover {
        opacity: 0.6;
    }

    .theme-curtain {
        position: fixed;
        top: -100%;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 9999;
        pointer-events: none;
        animation: curtain-fall 0.8s cubic-bezier(0.77, 0, 0.175, 1) forwards;
    }

    @keyframes curtain-fall {
        0% {
            top: -100%;
        }
        50% {
            top: 0;
        }
        100% {
            top: 100%;
        }
    }
</style>
