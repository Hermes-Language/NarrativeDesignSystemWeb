<script lang="ts">
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
            <span class="arrow">→</span>
        {/if}
    </a>
{:else}
    <button {type} class="button {variant}" {onclick} {...rest}>
        {@render children?.()}
        {#if variant === 'text'}
            <span class="arrow">→</span>
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
