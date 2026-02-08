<script lang="ts">
    import { fade } from 'svelte/transition';
    import { Close } from '@icon-park/svg';
    import Typography from './Typography.svelte';
    import SettingsModule from './SettingsModule.svelte';
    import StateSwitch from './StateSwitch.svelte';
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
            <button class="remove-btn" onclick={onremove} aria-label="Remove block">
                {@html Close({ size: 16 })}
            </button>
        {/if}
    </div>

    <div class="block-body">
        <textarea 
            class="main-content" 
            bind:value={data.content} 
            placeholder="Enter the text to be read..."
        ></textarea>

        <div class="sidebar">
            <StateSwitch 
                options={[
                    { id: 'prompt', label: 'Prompt' },
                    { id: 'control', label: 'Control' }
                ]} 
                bind:activeId={activeTab}
                class="sidebar-tabs"
            />

            <div class="tab-content">
                {#if activeTab === 'prompt'}
                    <SettingsModule 
                        type="prompt" 
                        data={{ prompt: data.prompt }} 
                        onchange={(updates: any) => data.prompt = updates.prompt}
                    />
                {:else}
                    <div class="control-panel" in:fade={{ duration: 150 }}>
                        <SettingsModule 
                            type="controls" 
                            useVoiceUpload={true}
                            data={{ voice: data.voice, emotion: data.emotion }} 
                            onchange={(updates: any) => {
                                if (updates.voice) data.voice = updates.voice;
                                if (updates.emotion !== undefined) data.emotion = updates.emotion;
                            }}
                        />
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

    @media (max-width: 600px) {
        .label-input {
            font-size: 1.4rem;
        }
    }

    .label-input:focus {
        border-bottom: 1px solid var(--border-color);
    }

    .remove-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: var(--secondary-text);
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
        background: var(--panel-bg);
        color: var(--text-color);
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
        background: var(--panel-bg);
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
    }

    @media (max-width: 768px) {
        .sidebar {
            width: 100%;
            border-top: 1px solid var(--border-color);
        }
    }

    :global(.sidebar-tabs) {
        border: none !important;
        width: 100% !important;
    }

    :global(.sidebar-tabs .state-item) {
        border-top: none !important;
        border-left: none !important;
        border-radius: 0 !important;
        font-size: 1.1rem !important;
        padding: 0.6rem !important;
        font-family: var(--font-serif) !important;
        box-sizing: border-box !important;
    }

    :global(.sidebar-tabs .state-item:last-child) {
        border-right: none !important;
    }

    .tab-content {
        flex: 1;
        padding: 0.5rem;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        overflow: hidden;
    }

    :global(.audiobook-block .settings-module) {
        height: 100%;
    }

    :global(.audiobook-block .settings-module .input-full) {
        height: 100%;
        min-height: 120px;
    }

    .control-panel {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
</style>