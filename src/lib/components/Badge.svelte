<script lang="ts">
    let { variant = 'default', children } = $props();
</script>

<span class="badge {variant}">
    {#if variant === 'dot'}
        <span class="dot"></span>
    {/if}
    {@render children?.()}
</span>

<style>
    .badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.25rem 0.75rem;
        font-family: var(--font-serif);
        font-size: 0.9rem;
        border-radius: 2px;
    }

    .default {
        background-color: var(--text-color);
        color: white;
    }

    .outline {
        border: 1px solid var(--border-color);
        color: var(--text-color);
    }

    .dot {
        width: 6px;
        height: 6px;
        background-color: currentColor;
        border-radius: 50%;
    }
</style>
