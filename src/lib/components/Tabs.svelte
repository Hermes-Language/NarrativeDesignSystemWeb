<script lang="ts">
    let { items = [], activeId = $bindable(""), children = undefined } = $props();
</script>

<div class="tabs-container">
    <div class="tabs-header">
        {#each items as item}
            <button 
                class="tab-button" 
                class:active={activeId === item.id}
                onclick={() => activeId = item.id}
            >
                {item.label}
            </button>
        {/each}
    </div>
    <div class="tabs-content">
        {@render children?.()}
    </div>
</div>

<style>
    .tabs-container {
        width: 100%;
    }

    .tabs-header {
        display: flex;
        gap: 3rem;
        border-bottom: 1px solid var(--hover-bg);
        margin-bottom: 2rem;
    }

    @media (max-width: 600px) {
        .tabs-header {
            gap: 1.5rem;
            overflow-x: auto;
            scrollbar-width: none;
        }
        .tabs-header::-webkit-scrollbar {
            display: none;
        }
        .tab-button {
            font-size: 1.1rem;
            white-space: nowrap;
        }
    }

    .tab-button {
        background: none;
        border: none;
        font-family: var(--font-serif);
        font-size: 1.2rem;
        padding: 1rem 0;
        cursor: pointer;
        color: var(--secondary-text);
        position: relative;
        transition: color 0.2s;
    }

    .tab-button:hover {
        color: var(--text-color);
    }

    .tab-button.active {
        color: var(--text-color);
    }

    .tab-button.active:after {
        content: "";
        position: absolute;
        bottom: -1px;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: var(--text-color);
    }
</style>
