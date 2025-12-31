<script lang="ts">
    import { Right } from '@icon-park/svg';
    let { 
        variant = 'text', 
        href = undefined, 
        type = 'button' as 'button' | 'reset' | 'submit', 
        onclick = undefined,
        children,
        ...rest 
    } = $props();
</script>

{#if href}
    <a {href} class="button {variant}" {onclick} {...rest}>
        {@render children?.()}
        {#if variant === 'text'}
            <span class="arrow">{@html Right({ size: 16 })}</span>
        {/if}
    </a>
{:else}
    <button {type} class="button {variant}" {onclick} {...rest}>
        {@render children?.()}
        {#if variant === 'text'}
            <span class="arrow">{@html Right({ size: 16 })}</span>
        {/if}
    </button>
{/if}

<style>
    .button {
        font-family: var(--font-serif);
        font-size: 1.5rem;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        color: var(--text-color);
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        transition: opacity 0.2s;
    }

    @media (max-width: 600px) {
        .button {
            font-size: 1.2rem;
        }
        .box {
            font-size: 1rem;
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
        padding: 0.75rem 1.5rem;
        font-size: 1.1rem;
    }

    .arrow {
        font-family: var(--font-sans);
        font-weight: 300;
    }
</style>
