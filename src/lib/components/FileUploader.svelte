<script lang="ts">
    import { fade, scale } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';

    let isDragging = $state(false);
    let { onUpload = undefined } = $props();

    function handleDragOver(e: DragEvent) {
        e.preventDefault();
        isDragging = true;
    }

    function handleDragLeave(e: DragEvent) {
        e.preventDefault();
        // Only set to false if we're leaving the backdrop itself
        if (e.target === e.currentTarget) {
            isDragging = false;
        }
    }

    function handleDrop(e: DragEvent) {
        e.preventDefault();
        isDragging = false;
        const files = e.dataTransfer?.files;
        if (files && files.length > 0) {
            onUpload?.(files[0]);
        }
    }

    // Global window listeners to catch drag start
    function handleWindowDragEnter(e: DragEvent) {
        e.preventDefault();
        isDragging = true;
    }
</script>

<svelte:window ondragenter={handleWindowDragEnter} />

{#if isDragging}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div 
        class="upload-overlay" 
        role="presentation"
        transition:fade={{ duration: 300 }}
        ondragover={handleDragOver}
        ondragleave={handleDragLeave}
        ondrop={handleDrop}
    >
        <div class="drop-zone" transition:scale={{ duration: 400, start: 0.95, easing: cubicOut }}>
            <div class="icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
            </div>
            <span class="text">Drop file to here</span>
        </div>
    </div>
{/if}

<style>
    .upload-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(247, 243, 240, 0.85);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
        cursor: copy;
    }

    .drop-zone {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
        pointer-events: none;
    }

    .icon {
        color: var(--text-color);
        opacity: 0.5;
    }

    .text {
        font-family: var(--font-serif);
        font-size: 2.5rem;
        color: var(--text-color);
        letter-spacing: 0.02em;
    }
</style>
