<script lang="ts">
    import { fade } from 'svelte/transition';
    import Typography from './Typography.svelte';
    import FileUploadButton from './FileUploadButton.svelte';
    import { addToast } from './Toast.svelte';

    interface BlockData {
        id: string;
        label: string;
        content: string;
        prompt: string;
        voice: string;
        emotion: number;
    }

    let { 
        data = $bindable({} as BlockData),
        onremove = undefined
    } = $props();

    let activeTab = $state('prompt'); // 'prompt' | 'control'
</script>

<div class="audiobook-block">
    <div class="block-header">
        <input 
            class="label-input" 
            bind:value={data.label} 
            placeholder="Reader Name"
        />
        {#if onremove}
            <button class="remove-btn" onclick={onremove} aria-label="Remove block">×</button>
        {/if}
    </div>

    <div class="block-body">
        <textarea 
            class="main-content" 
            bind:value={data.content} 
            placeholder="Enter the text to be read..."
        ></textarea>

        <div class="sidebar">
            <div class="tabs">
                <button 
                    class="tab" 
                    class:active={activeTab === 'prompt'} 
                    onclick={() => activeTab = 'prompt'}
                >
                    Prompt
                </button>
                <button 
                    class="tab" 
                    class:active={activeTab === 'control'} 
                    onclick={() => activeTab = 'control'}
                >
                    Control
                </button>
            </div>

            <div class="tab-content">
                {#if activeTab === 'prompt'}
                    <textarea 
                        class="prompt-area" 
                        bind:value={data.prompt} 
                        placeholder="Write your prompt here..."
                    ></textarea>
                {:else}
                    <div class="control-panel" in:fade={{ duration: 150 }}>
                        <div class="control-item">
                            <span class="label">Voice:</span>
                            <FileUploadButton 
                                variant="link" 
                                label={data.voice || "Click Here to Upload"} 
                                onUpload={(f: File) => {
                                    data.voice = f.name;
                                    addToast(`Voice file "${f.name}" uploaded`, 'success');
                                }} 
                            />
                        </div>
                        <div class="control-item">
                            <span class="label">Emotion:</span>
                            <input 
                                type="number" 
                                step="0.1" 
                                bind:value={data.emotion} 
                                class="underlined-input"
                            />
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
    .audiobook-block {
        margin-bottom: 3rem;
        width: 100%;
    }

    .block-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    .label-input {
        font-family: var(--font-serif);
        font-size: 1.8rem;
        font-weight: 400;
        color: var(--text-color);
        border: none;
        background: none;
        padding: 0;
        margin: 0;
        outline: none;
        width: auto;
        min-width: 100px;
    }

    .label-input:focus {
        border-bottom: 1px solid #ccc;
    }

    .remove-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: #ccc;
        cursor: pointer;
        padding: 0 0.5rem;
    }

    .remove-btn:hover {
        color: #ff4444;
    }

    .block-body {
        display: flex;
        gap: 1px;
        border: 1px solid var(--border-color);
        background: var(--border-color); /* For the divider line */
        min-height: 200px;
    }

    @media (max-width: 768px) {
        .block-body {
            flex-direction: column;
        }
    }

    .main-content {
        flex: 1;
        background: #fff;
        border: none;
        padding: 1.5rem;
        font-family: var(--font-serif);
        font-size: 1.1rem;
        resize: none;
        outline: none;
        min-height: 150px;
    }

    .sidebar {
        width: 240px;
        background: #fff;
        display: flex;
        flex-direction: column;
    }

    @media (max-width: 768px) {
        .sidebar {
            width: 100%;
            border-top: 1px solid var(--border-color);
        }
    }

    .tabs {
        display: flex;
        border-bottom: 1px solid var(--border-color);
    }

    .tab {
        flex: 1;
        padding: 0.5rem;
        border: none;
        background: #fff;
        font-family: var(--font-sans);
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        cursor: pointer;
        transition: all 0.2s;
    }

    .tab.active {
        background: #000;
        color: #fff;
    }

    .tab-content {
        flex: 1;
        padding: 1rem;
        display: flex;
        flex-direction: column;
    }

    .prompt-area {
        flex: 1;
        border: none;
        resize: none;
        outline: none;
        font-family: var(--font-serif);
        font-size: 0.9rem;
        color: #666;
        font-style: italic;
    }

    .control-panel {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .control-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-family: var(--font-sans);
        font-size: 0.8rem;
    }

    .label {
        font-weight: 600;
    }

    .underlined-input {
        border: none;
        border-bottom: 1px solid #000;
        width: 30px;
        text-align: right;
        font-family: var(--font-sans);
        font-size: 0.8rem;
        outline: none;
    }
</style>