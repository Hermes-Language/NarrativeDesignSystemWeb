<script lang="ts">
    import { ArrowRight } from '@lucide/svelte';
    let { 
        variant = 'text', 
        href = undefined, 
        type = 'button' as 'button' | 'reset' | 'submit', 
        onclick = undefined,
        arrow = true,
        children,
        ...rest 
    } = $props();
</script>

{#if href}
    <a {href} class="button {variant}" {onclick} {...rest}>
        {@render children?.()}
        {#if variant === 'text' && arrow}
            <span class="arrow"><ArrowRight size={16} /></span>
        {/if}
    </a>
{:else}
    <button {type} class="button {variant}" {onclick} {...rest}>
        {@render children?.()}
        {#if variant === 'text' && arrow}
            <span class="arrow"><ArrowRight size={16} /></span>
        {/if}
    </button>
{/if}

<style>
    .button {
        font-family: var(--font-serif);
        font-size: var(--font-size-lg);
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        color: var(--text-color);
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: var(--spacing-xs);
        transition: opacity var(--transition-fast);
    }

    @media (max-width: 600px) {
        .button {
            font-size: 1.2rem;
        }
        .box {
            font-size: var(--font-size-base);
            padding: 0.6rem 1.2rem;
        }
    }

    .button:hover {
        opacity: 0.7;
    }

    .text {
        border-bottom: 1px solid transparent;
    }

    .text:hover {
        border-bottom: 1px solid var(--text-color);
    }

    .box {
        border: 1px solid var(--border-color);
        padding: 0.75rem var(--spacing-md);
        font-size: 1.1rem;
    }

    .arrow {
        font-family: var(--font-sans);
        font-weight: 300;
    }
</style>
