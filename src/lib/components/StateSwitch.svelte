<script lang="ts">
    interface Option {
        id: string;
        label: string;
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
            : states.map(s => ({ id: s, label: s }))
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
            onclick={() => select(item.id)}
            type="button"
        >
            {item.label}
        </button>
    {/each}
</div>

<style>
    .state-switch {
        display: flex;
        width: 100%;
        background: var(--panel-bg);
        box-sizing: border-box;
    }

    .state-item {
        flex: 1;
        padding: 0.6rem 1rem;
        border: 1px solid var(--border-color);
        background: var(--panel-bg);
        color: var(--text-color);
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
    }

    @media (max-width: 600px) {
        .state-item {
            font-size: 0.9rem;
            padding: 0.5rem;
        }
    }

    .state-item:first-child {
        margin-left: 0;
    }

    .state-item.active {
        background: var(--text-color);
        color: var(--bg-color);
        z-index: 1;
        border-bottom-color: var(--text-color);
    }

    .state-item:hover:not(.active) {
        background: var(--hover-bg);
        z-index: 2;
    }
</style>