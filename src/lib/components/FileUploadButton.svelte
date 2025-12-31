<script lang="ts">
    import { Upload } from '@icon-park/svg';
    import Button from './Button.svelte';

    let { 
        onUpload = undefined,
        accept = "*",
        multiple = false,
        variant = "text",
        label = "Upload File"
    } = $props();

    let fileInput: HTMLInputElement;

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

<div class="file-upload-button">
    <input 
        type="file" 
        bind:this={fileInput} 
        {accept} 
        {multiple} 
        onchange={handleChange} 
        style="display: none;"
    />
    
    {#if variant === 'link'}
        <button class="link-btn" onclick={handleClick}>
            {label}
        </button>
    {:else}
        <Button {variant} onclick={handleClick}>
            <div class="btn-content">
                {@html Upload({ size: 16, strokeWidth: 3 })}
                {label}
            </div>
        </Button>
    {/if}
</div>

<style>
    .file-upload-button {
        display: inline-block;
    }

    .btn-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .link-btn {
        background: none;
        border: none;
        color: var(--secondary-text);
        text-decoration: underline;
        cursor: pointer;
        padding: 0;
        font-family: var(--font-sans);
        font-size: 0.85rem;
        transition: color 0.2s;
    }

    .link-btn:hover {
        color: var(--text-color);
    }
</style>