<script lang="ts">
    let { 
        element = 'p', 
        align = 'left', 
        style = '',
        class: className = '',
        children 
    } = $props();
</script>

<svelte:element 
    this={element} 
    class="typography {element} {align} {className}"
    {style}
>
    {@render children?.()}
</svelte:element>

<style>
    .typography {
        font-family: var(--font-serif);
        color: var(--text-color);
        margin: 0 0 1.5rem 0;
        line-height: 1.2;
    }

    .h1 {
        font-size: 4rem;
        font-weight: 400;
    }

    .h2 {
        font-size: 2.5rem;
        font-weight: 400;
    }

    .h3 {
        font-size: 1.8rem;
        font-weight: 400;
    }

    @media (max-width: 768px) {
        .h1 { font-size: 2.5rem; }
        .h2 { font-size: 2rem; }
        .h3 { font-size: 1.5rem; }
    }

    .p {
        font-size: 1.2rem;
        line-height: 1.6;
    }

    .center { text-align: center; }
    .left { text-align: left; }
    .right { text-align: right; }
</style>
