<script lang="ts">
    import * as m from '../paraglide/messages.js';
	import { Send } from "@lucide/svelte";

    let { value = $bindable(""), placeholder = m.type_placeholder(), onsend = undefined } = $props();

    function handleSend() {
        if (value.trim()) {
            onsend?.(value);
            value = "";
        }
    }
</script>

<div class="chat-input-container">
    <textarea {placeholder} bind:value></textarea>
    <button class="send-button" onclick={handleSend} aria-label={m.send()}>
        <Send size={16} />
    </button>
</div>

<style>
    .chat-input-container {
        position: relative;
        border: 1px solid var(--border-color);
        background: var(--bg-color);
        padding: var(--spacing-md);
    }

    textarea {
        width: 100%;
        min-height: 150px;
        border: none;
        outline: none;
        font-family: var(--font-serif);
        font-size: 1.5rem;
        resize: none;
        background: transparent;
        color: var(--text-color);
    }

    @media (max-width: 600px) {
        .chat-input-container {
            padding: var(--spacing-sm);
        }
        textarea {
            font-size: 1.2rem;
            min-height: 100px;
        }
        .send-button {
            bottom: var(--spacing-sm);
            right: var(--spacing-sm);
        }
    }

    .send-button {
        position: absolute;
        bottom: var(--spacing-md);
        right: var(--spacing-md);
        background: var(--text-color);
        color: var(--bg-color);
        border: none;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform var(--transition-fast);
        border-radius: var(--radius-none);
    }

    .send-button:hover {
        transform: scale(1.1);
    }

    .send-button svg {
        transform: rotate(-45deg) translate(2px, -2px);
    }
</style>
