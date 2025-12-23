<script lang="ts">
    import { fade, scale } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';
    import { Upload } from '@icon-park/svg';

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
                {@html Upload({ size: 48, strokeWidth: 2 })}
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
