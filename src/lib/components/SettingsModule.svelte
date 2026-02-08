<script lang="ts">
    import Input from './Input.svelte';
    import Select from './Select.svelte';
    import Slider from './Slider.svelte';
    import Button from './Button.svelte';
    import FileUploadButton from './FileUploadButton.svelte';

    let { 
        type = 'prompt', // 'prompt' | 'controls' | 'content' | 'overrides' | 'audio_control'
        data = {} as any,
        onchange = undefined as ((updates: any) => void) | undefined,
        onreplace = undefined as (() => void) | undefined,
        useVoiceUpload = false
    } = $props();

    const voiceOptions = [
        { value: 'en-US', label: 'English (US)' },
        { value: 'zh-CN', label: 'Chinese (Mandarin)' },
        { value: 'ja-JP', label: 'Japanese' }
    ];
</script>

<div class="settings-module">
    {#if type === 'prompt' || type === 'content'}
        <div class="input-full">
            <Input 
                multiline={true}
                placeholder={type === 'prompt' ? "Write your prompt..." : "Enter text..."}
                value={data.text || data.prompt}
                oninput={(e: any) => onchange?.({ [type === 'prompt' ? 'prompt' : 'text']: e.target.value })}
                rows={5}
                style="font-size: 0.75rem; padding: 10px 12px; border: none; height: 100%;"
            />
        </div>
    {:else if type === 'controls'}
        <div class="controls-grid">
            {#if useVoiceUpload}
                <div class="voice-upload-container">
                    <span class="field-label">Voice</span>
                    <FileUploadButton 
                        variant="link" 
                        label={data.voice || "Click to Upload"} 
                        onUpload={(f: File) => onchange?.({ voice: f.name })}
                    />
                </div>
            {:else}
                <Select 
                    label="Voice"
                    options={voiceOptions}
                    value={data.voice}
                    onchange={(e: any) => onchange?.({ voice: e.target.value })}
                />
            {/if}
            <Slider 
                label="Emotion"
                min={0}
                max={1}
                step={0.1}
                value={data.emotion}
                oninput={(e: any) => onchange?.({ emotion: parseFloat(e.target.value) })}
            />
        </div>
    {:else if type === 'overrides'}
        <div class="controls-grid">
            <Slider 
                label="Volume"
                min={0}
                max={1.5}
                step={0.05}
                value={data.volume ?? 1.0}
                oninput={(e: any) => onchange?.({ volume: parseFloat(e.target.value) })}
            />
            <Slider 
                label="Emphasis"
                min={0}
                max={1}
                step={0.1}
                value={0.5}
            />
        </div>
    {:else if type === 'audio_control'}
        <div class="controls-grid">
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="audio-info clickable" onclick={() => onreplace?.()}>
                <span class="label">File Name (Click to Replace)</span>
                <span class="filename">{data.fileName}</span>
            </div>
            
            <Slider 
                label="Volume"
                min={0}
                max={1.5}
                step={0.05}
                value={data.volume ?? 1.0}
                oninput={(e: any) => onchange?.({ volume: parseFloat(e.target.value) })}
            />

            <Slider 
                label="Playback Speed"
                min={0.5}
                max={2.0}
                step={0.1}
                value={data.playbackRate || 1.0}
                oninput={(e: any) => onchange?.({ playbackRate: parseFloat(e.target.value) })}
            />
        </div>
    {/if}
</div>

<style>
    .settings-module {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .audio-info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        margin-bottom: 0.5rem;
    }

    .audio-info.clickable {
        cursor: pointer;
        padding: 4px 0;
        border-radius: 4px;
        transition: background 0.2s;
    }

    .audio-info.clickable:hover {
        background: rgba(0, 0, 0, 0.03);
    }

    .voice-upload-container {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .field-label {
        font-size: 0.7rem;
        font-weight: 800;
        text-transform: uppercase;
        color: var(--secondary-text);
        letter-spacing: 0.05em;
    }

    .filename {
        font-size: 0.8rem;
        font-weight: 500;
        word-break: break-all;
        opacity: 0.8;
    }

    .input-full {
        flex: 1;
        height: 100%;
    }

    :global(.settings-module textarea) {
        resize: none !important;
        background: transparent !important;
        height: 100% !important;
        min-height: 120px;
        font-family: inherit;
    }

    .controls-grid {
        padding: 10px 12px;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .info-text {
        font-size: 10px;
        color: #666;
        opacity: 0.7;
        margin-bottom: 0.25rem;
    }

    :global(.settings-popover label) {
        font-size: 10px !important;
        font-weight: 800;
        margin-bottom: 2px !important;
        opacity: 0.5;
        text-transform: uppercase;
    }
</style>