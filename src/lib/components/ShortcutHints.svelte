<script lang="ts">
    import * as m from '../paraglide/messages.js';
    import Modal from './Modal.svelte';

    interface Shortcut {
        id: string;
        key: string;
        description: string;
        category?: string;
    }

    let { 
        shortcuts = [] as Shortcut[],
        active = $bindable(true),
        onClose = () => {}
    } = $props<{
        shortcuts?: Shortcut[];
        active?: boolean;
        onClose?: () => void;
    }>();

    let groupedShortcuts = $derived(
        shortcuts.reduce((acc: Record<string, Shortcut[]>, shortcut: Shortcut) => {
            const category = shortcut.category || 'General';
            if (!acc[category]) acc[category] = [];
            acc[category].push(shortcut);
            return acc;
        }, {} as Record<string, Shortcut[]>)
    );
</script>

<Modal bind:show={active} title={m.keyboard_shortcuts()}>
    <div class="content">
        {#if Object.keys(groupedShortcuts).length === 0}
            <div class="empty-state">{m.no_shortcuts()}</div>
        {/if}
        {#each Object.entries(groupedShortcuts) as [category, list] (category)}
            {@const shortcutList = list as Shortcut[]}
            <section class="category">
                <h4>{category}</h4>
                <ul class="shortcut-list">
                    {#each shortcutList as shortcut (shortcut.id)}
                        <li class="shortcut-item">
                            <span class="description">{shortcut.description}</span>
                            <span class="key-binding">
                                {#each shortcut.key.split('+') as key (key)}
                                    <kbd>{key.trim()}</kbd>
                                    {#if key !== shortcut.key.split('+').at(-1)}
                                        <span class="plus">+</span>
                                    {/if}
                                {/each}
                            </span>
                        </li>
                    {/each}
                </ul>
            </section>
        {:else}
            <p class="empty-state">No shortcuts available.</p>
        {/each}
    </div>
</Modal>

<style>
    .content {
        flex: 1;
        overflow-y: auto;
    }

    .category {
        margin-bottom: var(--spacing-lg);
    }

    .category h4 {
        margin: 0 0 var(--spacing-sm) 0;
        font-family: var(--font-sans);
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--secondary-text);
        border-bottom: 1px solid var(--hover-bg);
        padding-bottom: 4px;
    }

    .shortcut-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .shortcut-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-xs) 0;
        border-bottom: 1px solid var(--hover-bg);
    }

    .shortcut-item:last-child {
        border-bottom: none;
    }

    .description {
        font-family: var(--font-sans);
        font-size: 0.95rem;
    }

    .key-binding {
        display: flex;
        align-items: center;
        gap: 4px;
    }

    kbd {
        background: var(--bg-color);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        padding: 2px 6px;
        font-family: monospace;
        font-size: 0.8rem;
        min-width: 24px;
        text-align: center;
        box-shadow: 1px 1px 0px var(--border-color);
        color: var(--text-color);
    }

    .plus {
        font-size: 0.8rem;
        color: var(--secondary-text);
    }

    .empty-state {
        text-align: center;
        color: var(--secondary-text);
        padding: var(--spacing-lg);
    }
</style>
