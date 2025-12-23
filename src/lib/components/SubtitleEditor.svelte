<script lang="ts">
    import { fade, slide } from 'svelte/transition';
    import { Close, Right } from '@icon-park/svg';
    import Button from './Button.svelte';
    import Typography from './Typography.svelte';
    import TimeInput from './TimeInput.svelte';

    interface Subtitle {
        id: string;
        start: string;
        end: string;
        text: string;
    }

    let { 
        subtitles = $bindable([] as Subtitle[]),
        onchange = undefined 
    } = $props();

    function addSubtitle() {
        const lastSub = subtitles[subtitles.length - 1];
        const newStart = lastSub ? lastSub.end : "00:00:00";
        
        subtitles = [...subtitles, {
            id: Math.random().toString(36).substr(2, 9),
            start: newStart,
            end: newStart,
            text: ""
        }];
        onchange?.(subtitles);
    }

    function removeSubtitle(id: string) {
        subtitles = subtitles.filter(s => s.id !== id);
        onchange?.(subtitles);
    }

    function updateSubtitle(id: string, field: keyof Subtitle, value: string) {
        subtitles = subtitles.map(s => s.id === id ? { ...s, [field]: value } : s);
        onchange?.(subtitles);
    }
</script>

<div class="subtitle-editor">
    <div class="header">
        <Typography element="h3">Subtitles</Typography>
        <Button variant="text" onclick={addSubtitle}>+ Add Block</Button>
    </div>

    <div class="subtitle-list">
        {#if subtitles.length === 0}
            <div class="empty-state" transition:fade>
                <Typography element="p">No subtitles yet. Click "Add Block" to start.</Typography>
            </div>
        {/if}

        {#each subtitles as sub (sub.id)}
            <div class="subtitle-item" transition:slide|local>
                <div class="time-inputs">
                    <TimeInput 
                        bind:value={sub.start} 
                        onchange={(val: string) => updateSubtitle(sub.id, 'start', val)}
                    />
                    <span class="separator">{@html Right({ size: 14 })}</span>
                    <TimeInput 
                        bind:value={sub.end} 
                        onchange={(val: string) => updateSubtitle(sub.id, 'end', val)}
                    />
                </div>
                
                <textarea 
                    value={sub.text} 
                    oninput={(e) => updateSubtitle(sub.id, 'text', (e.target as HTMLTextAreaElement).value)}
                    placeholder="Enter subtitle text..."
                    class="text-field"
                ></textarea>

                <button class="remove-btn" onclick={() => removeSubtitle(sub.id)} aria-label="Remove">
                    {@html Close({ size: 16 })}
                </button>
            </div>
        {/each}
    </div>
</div>

<style>
    .subtitle-editor {
        border: 1px solid var(--border-color);
        background: #fff;
        display: flex;
        flex-direction: column;
        width: 100%;
        max-height: 500px;
    }

    .header {
        padding: 1rem 1.5rem;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .subtitle-list {
        overflow-y: auto;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .empty-state {
        padding: 2rem;
        text-align: center;
        color: #999;
    }

    .subtitle-item {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1rem;
        background: #fcfcfc;
        border: 1px solid #eee;
        position: relative;
    }

    .time-inputs {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    @media (max-width: 480px) {
        .time-inputs {
            flex-direction: column;
            align-items: flex-start;
        }
        
        .separator {
            display: none;
        }
    }

    .separator {
        color: #ccc;
    }

    .text-field {
        font-family: var(--font-serif);
        font-size: 1rem;
        border: none;
        background: transparent;
        resize: none;
        min-height: 60px;
        padding: 0;
        outline: none;
    }

    .remove-btn {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: none;
        border: none;
        color: #ccc;
        cursor: pointer;
        padding: 4px;
        transition: color 0.2s;
    }

    .remove-btn:hover {
        color: #ff4444;
    }

    /* Custom Scrollbar */
    .subtitle-list::-webkit-scrollbar {
        width: 6px;
    }
    .subtitle-list::-webkit-scrollbar-track {
        background: transparent;
    }
    .subtitle-list::-webkit-scrollbar-thumb {
        background: #eee;
    }
</style>