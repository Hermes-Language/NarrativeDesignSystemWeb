<script lang="ts">
    import AudiobookBlock from './AudiobookBlock.svelte';
    import Typography from './Typography.svelte';

    interface BlockData {
        id: string;
        label: string;
        content: string;
        prompt: string;
        voice: string;
        emotion: number;
    }

    let { 
        blocks = $bindable([] as BlockData[])
    } = $props();

    function addBlock() {
        const newId = Math.random().toString(36).substr(2, 9);
        blocks = [...blocks, {
            id: newId,
            label: `Reader ${blocks.length + 1}`,
            content: '',
            prompt: '',
            voice: '',
            emotion: 0.5
        }];
    }

    function removeBlock(id: string) {
        blocks = blocks.filter(b => b.id !== id);
    }

    // Initialize with one block if empty
    if (blocks.length === 0) {
        addBlock();
    }
</script>

<div class="audiobook-designer">
    <div class="designer-header">
        <Typography element="h2">Design your audiobook</Typography>
    </div>

    <div class="blocks-list">
        {#each blocks as block, i (block.id)}
            <AudiobookBlock 
                bind:data={blocks[i]} 
                onremove={() => removeBlock(block.id)}
            />
        {/each}
    </div>

    <div class="separator">
        <div class="line"></div>
        <button class="add-btn" onclick={addBlock}>
            Click here to add new block
        </button>
        <div class="line"></div>
    </div>
</div>

<style>
    .audiobook-designer {
        max-width: 1000px;
        margin: 0 auto;
        padding: 2rem;
    }

    @media (max-width: 768px) {
        .audiobook-designer {
            padding: 1rem;
        }
    }

    .designer-header {
        margin-bottom: 3rem;
        text-align: center;
    }

    @media (max-width: 600px) {
        .designer-header {
            margin-bottom: 1.5rem;
        }
        :global(.designer-header h2) {
            font-size: 1.5rem !important;
        }
    }

    .blocks-list {
        display: flex;
        flex-direction: column;
    }

    .separator {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin: 1rem 0 3rem 0;
        opacity: 0.5;
        transition: opacity 0.2s;
    }

    .separator:hover {
        opacity: 1;
    }

    .line {
        flex: 1;
        height: 1px;
        background: var(--border-color);
    }

    .add-btn {
        background: none;
        border: none;
        font-family: var(--font-sans);
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--secondary-text);
        cursor: pointer;
        white-space: nowrap;
    }

    .add-btn:hover {
        color: var(--text-color);
    }
</style>