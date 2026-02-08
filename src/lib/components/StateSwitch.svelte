<script lang="ts">
    interface Option {
        id: string;
        label: string;
        icon?: string;
    }

    let { 
        options = [] as Option[], 
        states = [] as string[],
        activeId = $bindable(""),
        activeState = $bindable(""),
        class: className = ""
    } = $props();

    const items = $derived(
        options.length > 0 
            ? options 
            : states.map(s => ({ id: s, label: s } as Option))
    );

    function select(id: string) {
        activeId = id;
        activeState = id;
    }
</script>

<div class="state-switch {className}">
    {#each items as item}
        <button 
            class="state-item" 
            class:active={(activeId || activeState) === item.id}
            onpointerdown={() => select(item.id)}
            type="button"
            title={item.id}
        >
            {#if item.icon}
                {@html item.icon}
            {:else}
                {item.label}
            {/if}
        </button>
    {/each}
</div>

<style>
    .state-switch {
        display: flex;
        width: 100%;
        background: #fff;
        box-sizing: border-box;
    }

    .state-item {
        flex: 1;
        padding: 0.6rem 1rem;
        border: 1px solid #000;
        background: #fff;
        color: #000;
        font-family: var(--font-serif);
        font-size: 1.1rem;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: -1px;
        position: relative;
        border-radius: 0;
    }

    @media (max-width: 600px) {
        .state-item {
            font-size: 0.9rem;
            padding: 0.5rem;
            min-height: 44px; /* Touch target size */
        }
    }

    .state-item:first-child {
        margin-left: 0;
    }

    .state-item.active {
        background: #000;
        color: #fff;
        z-index: 1;
    }

    .state-item:hover:not(.active) {
        background: #f5f5f5;
        z-index: 2;
    }
</style>