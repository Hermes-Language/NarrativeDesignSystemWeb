<script lang="ts">
    import { fade } from 'svelte/transition';
    import { Upload } from '@icon-park/svg';
    import Typography from './Typography.svelte';

    let { 
        onUpload = undefined,
        accept = "*",
        multiple = false,
        label = "Drag and drop files here",
        sublabel = "or click to browse"
    } = $props();

    let isDragging = $state(false);
    let fileInput: HTMLInputElement;

    function handleDragOver(e: DragEvent) {
        e.preventDefault();
        isDragging = true;
    }

    function handleDragLeave(e: DragEvent) {
        e.preventDefault();
        isDragging = false;
    }

    function handleDrop(e: DragEvent) {
        e.preventDefault();
        isDragging = false;
        const files = e.dataTransfer?.files;
        if (files && files.length > 0) {
            onUpload?.(multiple ? files : files[0]);
        }
    }

    function handleChange(e: Event) {
        const target = e.target as HTMLInputElement;
        const files = target.files;
        if (files && files.length > 0) {
            onUpload?.(multiple ? files : files[0]);
        }
    }

    function handleClick() {
        fileInput.click();
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div 
    class="file-drop-zone" 
    class:dragging={isDragging}
    onclick={handleClick}
    ondragover={handleDragOver}
    ondragleave={handleDragLeave}
    ondrop={handleDrop}
>
    <input 
        type="file" 
        bind:this={fileInput} 
        {accept} 
        {multiple} 
        onchange={handleChange} 
        style="display: none;"
    />
    
    <div class="content">
        <div class="icon">
            {@html Upload({ size: 32, strokeWidth: 2 })}
        </div>
        <Typography element="p" style="margin: 0; font-weight: 500;">{label}</Typography>
        <Typography element="p" style="margin: 0; opacity: 0.5; font-size: 0.85rem;">{sublabel}</Typography>
    </div>

    {#if isDragging}
        <div class="overlay" transition:fade={{ duration: 100 }}>
            <Typography element="p">Drop to upload</Typography>
        </div>
    {/if}
</div>

<style>
    .file-drop-zone {
        position: relative;
        width: 100%;
        min-height: 160px;
        border: 1px dashed var(--border-color);
        background: #fafafa;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        padding: 2rem;
        text-align: center;
    }

    .file-drop-zone:hover {
        border-color: #000;
        background: #f5f5f5;
    }

    .file-drop-zone.dragging {
        border-color: #000;
        background: #f0f0f0;
        border-style: solid;
    }

    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
    }

    .icon {
        color: #999;
        margin-bottom: 0.5rem;
    }

    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
    }
</style>