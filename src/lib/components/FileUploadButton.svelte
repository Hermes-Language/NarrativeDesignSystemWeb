<script lang="ts">
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
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
        color: #999;
        text-decoration: underline;
        cursor: pointer;
        padding: 0;
        font-family: var(--font-sans);
        font-size: 0.85rem;
        transition: color 0.2s;
    }

    .link-btn:hover {
        color: #000;
    }
</style>