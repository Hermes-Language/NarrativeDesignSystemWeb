<script lang="ts">
    import * as m from '$lib/paraglide/messages.js';

    interface Annotation {
        id: string | number;
        content: string;
        author?: string;
        timestamp?: number;
        color?: string;
    }

    let { 
        annotations = $bindable([] as Annotation[]),
        active = $bindable(false),
        position = { x: 0, y: 0 },
        children,
        onAddAnnotation = (content: string) => {},
        onRemoveAnnotation = (id: string | number) => {}
    } = $props();

    let isHovering = $state(false);
    let wrapperElement: HTMLElement;
    let newAnnotationText = $state("");

    function toggleActive(e?: Event) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        active = !active;
    }

    function closePopover(e?: Event) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        active = false;
    }

    function add() {
        if (newAnnotationText.trim()) {
            onAddAnnotation(newAnnotationText);
            newAnnotationText = "";
        }
    }
</script>

<span 
    class="annotation-wrapper" 
    class:has-annotations={annotations.length > 0}
    bind:this={wrapperElement}
    role="presentation"
>
    <!-- The content being annotated (Force span for true inline behavior) -->
    <span class="content-container" onclick={toggleActive} role="button" tabindex="0" onkeydown={(e) => e.key === 'Enter' && toggleActive()}>
        {@render children()}
        
        <!-- Annotation Badge/Indicator -->
        {#if annotations.length > 0}
            <span class="annotation-indicator"></span>
        {/if}
    </span>

    <!-- Floating Popover (Moved out of span flow but stays absolute) -->
    {#if active}
        <div 
            class="annotation-popover" 
            onclick={(e) => e.stopPropagation()} 
            aria-hidden="true"
        >
            <div class="popover-header">
                <span class="popover-title">Annotations</span>
                <button class="close-pop-btn" onclick={closePopover}>✕</button>
            </div>
            
            <div class="annotations-list">
                {#each annotations as annotation (annotation.id)}
                    <div class="annotation-item" style="--note-color: {annotation.color || 'var(--accent-color)'}">
                        <div class="note-content">{annotation.content}</div>
                        <div class="note-meta">
                            {#if annotation.author}
                                <span>{annotation.author}</span>
                            {/if}
                            <button class="delete-note-btn" onclick={() => onRemoveAnnotation(annotation.id)}>{m.remove()}</button>
                        </div>
                    </div>
                {:else}
                    <div class="empty-annotations">{m.no_shortcuts()}</div>
                {/each}
            </div>

            <div class="annotation-input-area">
                <textarea 
                    placeholder={m.add_annotation()} 
                    bind:value={newAnnotationText}
                    onkeydown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), add())}
                ></textarea>
                <button class="add-note-btn" onclick={add} disabled={!newAnnotationText.trim()}>{m.add_annotation()}</button>
            </div>
        </div>
    {/if}
</span>

<style>
    .annotation-wrapper {
        position: relative;
        display: inline !important; /* Force true inline flow */
        cursor: pointer;
        line-height: inherit;
    }

    .content-container {
        position: relative;
        display: inline !important; /* Force true inline flow */
        outline: none;
        transition: none;
        vertical-align: baseline;
    }

    .has-annotations .content-container {
        text-underline-offset: 4px;
        text-decoration: underline wavy var(--accent-color);
        background-color: transparent !important;
        border: none !important;
        padding: 0 !important;
        margin: 0 !important;
    }

    .annotation-indicator {
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(50%, -50%);
        background: #FF0000;
        width: 6px;
        height: 6px;
        display: inline-flex;
        border-radius: 50%;
        z-index: 10;
        pointer-events: none;
    }

    .annotation-popover {
        position: absolute;
        top: calc(100% + 12px);
        left: 50%;
        transform: translateX(-50%);
        width: 280px;
        background: var(--panel-bg);
        border: 1px solid var(--border-color);
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        border-radius: var(--radius-sm);
        z-index: 1100;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        padding: var(--spacing-sm);
        /* Simplified animation for better performance */
        opacity: 1;
    }

    .popover-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-xs);
        border-bottom: 2px solid var(--hover-bg);
        padding-bottom: 6px;
    }

    .popover-title {
        font-family: var(--font-serif);
        font-weight: bold;
        font-size: 1rem;
        color: var(--text-color);
    }

    .close-pop-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px; /* Increased hit area for X */
        font-size: 1rem;
        color: var(--secondary-text);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 0.1s;
    }

    .close-pop-btn:hover {
        color: var(--text-color);
    }

    .annotations-list {
        max-height: 200px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
        margin: var(--spacing-sm) 0;
    }

    .annotation-item {
        padding: var(--spacing-sm);
        border-left: 3px solid var(--note-color);
        background: var(--hover-bg);
        font-size: 0.9rem;
        border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    }

    .note-content {
        line-height: 1.4;
        color: var(--text-color);
    }

    .note-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.75rem;
        color: var(--secondary-text);
        margin-top: 8px;
    }

    .delete-note-btn {
        background: none;
        border: none;
        color: #ff4444;
        cursor: pointer;
        padding: 2px 4px;
        font-weight: 500;
    }

    .delete-note-btn:hover {
        text-decoration: underline;
    }

    .empty-annotations {
        font-size: 0.85rem;
        color: var(--secondary-text);
        text-align: center;
        padding: var(--spacing-lg) var(--spacing-sm);
    }

    .annotation-input-area {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
        margin-top: var(--spacing-sm);
        padding-top: var(--spacing-sm);
        border-top: 1px solid var(--border-color);
    }

    textarea {
        width: 100%;
        min-height: 80px;
        font-family: var(--font-sans);
        font-size: 0.9rem;
        padding: var(--spacing-xs);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-none);
        resize: none;
        background: var(--bg-color);
        color: var(--text-color);
        transition: border-color 0.2s;
    }

    textarea:focus {
        border-color: var(--accent-color);
        outline: none;
    }

    .add-note-btn {
        background: var(--text-color);
        color: var(--bg-color);
        border: none;
        padding: 8px;
        font-family: var(--font-sans);
        font-size: 0.85rem;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        cursor: pointer;
        transition: opacity 0.2s;
    }

    .add-note-btn:hover:not(:disabled) {
        opacity: 0.8;
    }

    .add-note-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }
</style>
