<script lang="ts">
    import { type Snippet, onMount, tick } from 'svelte';
    import { fly, scale } from 'svelte/transition';

    interface ToolbarAction {
        id: string;
        label: string;
        icon?: Snippet;
        onClick?: (selection: string, range: { start: number, end: number }) => void;
        popover?: Snippet<[{ 
            selection: string, 
            close: () => void,
            replace: (newText: string) => void
        }]>;
    }

    let { 
        value = $bindable(""), 
        placeholder = "Type here...",
        actions = [] as ToolbarAction[],
        minHeight = "200px",
        maxHeight = "auto"
    } = $props();

    let container: HTMLElement;
    let textarea: HTMLTextAreaElement;
    let mirrorDiv: HTMLDivElement;
    
    let toolbarVisible = $state(false);
    let toolbarPosition = $state({ top: 0, left: 0 });
    let currentSelection = $state("");
    let activeActionId = $state<string | null>(null);

    // Initialize mirror div for coordinate calculation
    onMount(() => {
        mirrorDiv = document.createElement('div');
        mirrorDiv.style.position = 'absolute';
        mirrorDiv.style.visibility = 'hidden';
        mirrorDiv.style.whiteSpace = 'pre-wrap';
        mirrorDiv.style.wordWrap = 'break-word';
        mirrorDiv.style.pointerEvents = 'none';
        mirrorDiv.style.top = '0';
        mirrorDiv.style.left = '0';
        document.body.appendChild(mirrorDiv);
        
        return () => {
            if (mirrorDiv && mirrorDiv.parentNode) {
                mirrorDiv.parentNode.removeChild(mirrorDiv);
            }
        };
    });

    function updateMirrorStyles() {
        if (!textarea || !mirrorDiv) return;
        const style = window.getComputedStyle(textarea);
        const propsToCopy = [
            'font-family', 'font-size', 'font-weight', 'line-height', 
            'padding-top', 'padding-bottom', 'padding-left', 'padding-right',
            'border-width', 'box-sizing', 'width', 'text-transform', 
            'letter-spacing', 'word-spacing'
        ] as const;
        
        propsToCopy.forEach(prop => {
            mirrorDiv.style.setProperty(prop, style.getPropertyValue(prop));
        });
        mirrorDiv.style.width = textarea.clientWidth + 'px';
    }

    function getCaretCoordinates(position: number) {
        if (!textarea || !mirrorDiv) return { top: 0, left: 0 };
        
        updateMirrorStyles();
        
        const text = textarea.value.substring(0, position);
        mirrorDiv.textContent = text;
        
        const span = document.createElement('span');
        span.textContent = textarea.value.substring(position, position + 1) || '.';
        mirrorDiv.appendChild(span);
        
        const textareaRect = textarea.getBoundingClientRect();
        const spanRect = span.getBoundingClientRect();
        const mirrorRect = mirrorDiv.getBoundingClientRect();
        
        // Relative to the textarea's top-left
        const top = span.offsetTop - textarea.scrollTop;
        const left = span.offsetLeft - textarea.scrollLeft;
        
        return { top, left };
    }

    function updatePosition() {
        if (!textarea || !toolbarVisible) return;
        
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        
        if (start !== null && end !== null && start !== end) {
            const middle = Math.floor((start + end) / 2);
            const coords = getCaretCoordinates(middle);
            
            // Offset to show above the selection
            toolbarPosition = {
                top: coords.top - 12, // 12px above the line
                left: coords.left
            };
        }
    }

    async function handleSelection() {
        if (!textarea) return;
        
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const hasSelection = start !== null && end !== null && start !== end;
        
        if (hasSelection) {
            const newSelection = textarea.value.substring(start, end);
            
            // Only reset if selection actually changed or we have an active popover
            if (activeActionId || (toolbarVisible && currentSelection !== newSelection)) {
                if (currentSelection !== newSelection) {
                    toolbarVisible = false;
                    activeActionId = null;
                    await tick();
                }
            }

            currentSelection = newSelection;
            toolbarVisible = true;
            updatePosition();
        } else {
            // When selection is cleared (e.g., clicking elsewhere in the textarea)
            // we should close the toolbar/popover unless we are clicking ON the toolbar itself
            setTimeout(() => {
                const isFocusInContainer = container.contains(document.activeElement);
                if (!isFocusInContainer) {
                    toolbarVisible = false;
                    activeActionId = null;
                }
            }, 50);
        }
    }

    function handleBlur() {
        // Handled by handleSelection's timeout
    }

    function handleScroll() {
        if (toolbarVisible) {
            updatePosition();
        }
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Escape') {
            closePopover();
        }
    }

    function handleClickOutside(e: MouseEvent) {
        if (!toolbarVisible) return;
        if (container && !container.contains(e.target as Node)) {
            closePopover();
        }
    }

    // New: Handle case where user clicks within textarea to clear selection
    function handleTextAreaClick() {
        if (textarea.selectionStart === textarea.selectionEnd) {
            toolbarVisible = false;
            activeActionId = null;
        }
    }

    $effect(() => {
        if (toolbarVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    });

    async function runAction(action: ToolbarAction) {
        if (action.popover) {
            // Store selection state before showing popover
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            
            activeActionId = action.id;
            
            // Re-apply selection to keep it visible while popover is open
            await tick();
            textarea.focus();
            textarea.setSelectionRange(start, end);
            
            updatePosition();
        } else {
            action.onClick?.(currentSelection, { 
                start: textarea.selectionStart, 
                end: textarea.selectionEnd 
            });
            toolbarVisible = false;
        }
    }

    function replaceSelection(newText: string) {
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        
        const before = value.substring(0, start);
        const after = value.substring(end);
        
        value = before + newText + after;
        
        // After replacing, clear selection and hide toolbar
        requestAnimationFrame(() => {
            textarea.focus();
            const newCursorPos = start + newText.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
            closePopover();
        });
    }

    function closePopover() {
        activeActionId = null;
        toolbarVisible = false;
        // Optional: refocus and clear selection on close if needed
        // textarea.focus();
    }
</script>

<div class="advanced-textarea-container" bind:this={container} onkeydown={handleKeyDown} role="presentation">
    <textarea
        bind:this={textarea}
        bind:value
        {placeholder}
        onselect={handleSelection}
        onmouseup={handleSelection}
        onkeyup={handleSelection}
        onclick={handleTextAreaClick}
        onscroll={handleScroll}
        style="min-height: {minHeight}; max-height: {maxHeight}"
        aria-label="Advanced text area"
    ></textarea>

    {#if toolbarVisible && actions.length > 0}
        <div 
            class="floating-toolbar" 
            class:has-popover={!!activeActionId}
            style="top: {toolbarPosition.top}px; left: {toolbarPosition.left}px"
            onclick={(e) => e.stopPropagation()}
            in:scale={{ duration: 150, start: 0.95 }}
            out:scale={{ duration: 100, start: 0.95 }}
            aria-hidden="true"
        >
            {#if activeActionId}
                {@const activeAction = actions.find(a => a.id === activeActionId)}
                <div class="popover-container" in:fly={{ y: 5, duration: 200 }}>
                    {#if activeAction?.popover}
                        {@render activeAction.popover({ 
                            selection: currentSelection, 
                            close: closePopover,
                            replace: replaceSelection
                        })}
                    {/if}
                </div>
            {:else}
                <div class="toolbar-content">
                    {#each actions as action (action.id)}
                        <button 
                            class="toolbar-btn" 
                            onclick={() => runAction(action)}
                            title={action.label}
                        >
                            {#if action.icon}
                                <span class="icon">{@render action.icon()}</span>
                            {:else}
                                {action.label}
                            {/if}
                        </button>
                    {/each}
                </div>
            {/if}
            <div class="toolbar-arrow"></div>
        </div>
    {/if}
</div>

<style>
    .advanced-textarea-container {
        position: relative;
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    textarea {
        width: 100%;
        padding: var(--spacing-md);
        font-family: var(--font-serif);
        font-size: 1.15rem;
        line-height: 1.6;
        border: 2px solid var(--border-color);
        background: var(--panel-bg);
        color: var(--text-color);
        resize: vertical;
        outline: none;
        transition: border-color 0.2s;
    }

    textarea:focus {
        border-color: var(--accent-color);
    }

    .floating-toolbar {
        position: absolute;
        background: var(--text-color);
        color: var(--bg-color);
        padding: 4px;
        border-radius: var(--radius-sm);
        display: flex;
        flex-direction: column;
        align-items: center;
        box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        z-index: 1000;
        transform: translate(-50%, -100%);
        pointer-events: auto;
        border: 1px solid var(--border-color);
        will-change: top, left, transform;
    }

    .floating-toolbar.has-popover {
        background: var(--panel-bg);
        color: var(--text-color);
        padding: 0;
        border: 2px solid var(--text-color); /* Thicker border for popover as seen in screenshot */
        border-radius: 0; /* Square edges for the "Definition" look */
    }

    .toolbar-content {
        display: flex;
        gap: 2px;
    }

    .popover-container {
        padding: var(--spacing-md);
        min-width: 240px;
    }

    .toolbar-btn {
        background: transparent;
        border: none;
        color: inherit;
        padding: 6px 12px;
        font-family: var(--font-sans);
        font-size: 0.9rem;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: background 0.2s, transform 0.1s;
    }

    .toolbar-btn:hover {
        background: rgba(255, 255, 255, 0.15);
    }

    .toolbar-btn:active {
        transform: scale(0.95);
    }

    .toolbar-arrow {
        position: absolute;
        bottom: -6px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid var(--text-color);
    }

    .has-popover .toolbar-arrow {
        border-top-color: var(--text-color);
        bottom: -8px;
    }

    .icon {
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
