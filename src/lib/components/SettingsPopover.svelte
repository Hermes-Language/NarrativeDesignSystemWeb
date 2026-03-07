<script lang="ts">
    import { fade } from 'svelte/transition';
    import Tabs from './Tabs.svelte';

    let { 
        items = [], // { id, label, component, props }
        activeId = $bindable(''),
        width = '240px',
        maxHeight = '250px',
        anchor = 'left', // 'left' | 'right'
        onitemchange = undefined
    } = $props();

    $effect(() => {
        if (!activeId && items.length > 0) {
            activeId = items[0].id;
        }
    });

    const tabList = $derived(items.map(item => ({ id: item.id, label: item.label })));
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
    class="settings-popover anchor-{anchor}" 
    style="width: {width};"
    transition:fade={{ duration: 150 }}
    onclick={(e) => e.stopPropagation()}
    onmousedown={(e) => e.stopPropagation()}
>
    <Tabs items={tabList} bind:activeId>
        <div class="popover-scroll-area" style="max-height: {maxHeight};">
            <div class="popover-content">
                {#each items as item (item.id)}
                    {#if activeId === item.id}
                        {@const Component = item.component}
                        <Component 
                            {...item.props} 
                            onchange={(updates: Record<string, any>) => onitemchange?.(item.id, updates)} 
                        />
                    {/if}
                {/each}
            </div>
        </div>
    </Tabs>
</div>

<style>
    .settings-popover {
        position: absolute;
        top: 4px;
        background: var(--panel-bg);
        color: var(--text-color);
        border: 1px solid var(--border-color);
        box-shadow: 4px 4px 0px var(--overlay-bg);
        z-index: 10001;
        display: flex;
        flex-direction: column;
        pointer-events: auto;
    }

    .anchor-left { left: 0; }
    .anchor-right { left: 100%; top: 0; }

    .popover-scroll-area {
        overflow-y: auto;
        overflow-x: hidden;
        display: flex;
        flex-direction: column;
    }

    /* Scrollbar Styling */
    .popover-scroll-area::-webkit-scrollbar {
        width: 4px;
    }
    .popover-scroll-area::-webkit-scrollbar-track {
        background: transparent;
    }
    .popover-scroll-area::-webkit-scrollbar-thumb {
        background: var(--border-color);
        opacity: 0.2;
    }

    .popover-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 120px;
    }

    /* Common Global Overrides for Settings Popovers */
    :global(.settings-popover .tabs-header) {
        border-bottom: 1px solid var(--border-color);
        background: var(--hover-bg);
        gap: 0 !important;
        margin-bottom: 0 !important;
    }

    :global(.settings-popover .tab-button) {
        flex: 1;
        padding: var(--spacing-xs);
        font-size: 0.85rem;
        font-weight: 500;
        font-family: var(--font-sans);
        border-right: 1px solid var(--border-color);
        border-radius: var(--radius-none);
        margin: 0;
    }

    :global(.settings-popover .tab-button:last-child) {
        border-right: none;
    }

    :global(.settings-popover .tab-button.active) {
        background: var(--text-color);
        color: var(--bg-color);
    }

    /* Standardized component sizes inside popover */
    :global(.settings-popover .input-container label),
    :global(.settings-popover .select-container label),
    :global(.settings-popover .slider-header .label) {
        font-size: 10px !important;
        font-weight: 800;
        margin-bottom: 2px !important;
        opacity: 0.5;
        text-transform: uppercase;
        font-family: var(--font-sans);
    }

    :global(.settings-popover .input-container) {
        margin-bottom: 0 !important;
    }

    :global(.settings-popover .slider-wrapper) {
        height: 12px !important;
    }

    :global(.settings-popover select) {
        padding: 2px 0 !important;
        font-size: 12px !important;
        background: transparent;
        border: 1px solid rgba(0,0,0,0.2);
    }

    :global([data-theme='dark'] .settings-popover select) {
        border-color: rgba(255,255,255,0.2);
        color: #fff;
    }
</style>
