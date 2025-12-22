<script lang="ts">
    let { value = $bindable(""), placeholder = "Type something here...", onsend = undefined } = $props();

    function handleSend() {
        if (value.trim()) {
            onsend?.(value);
            value = "";
        }
    }
</script>

<div class="chat-input-container">
    <textarea {placeholder} bind:value></textarea>
    <button class="send-button" onclick={handleSend} aria-label="Send">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
        </svg>
    </button>
</div>

<style>
    .chat-input-container {
        position: relative;
        border: 1px solid var(--border-color);
        background: white;
        padding: 1.5rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.05);
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
    }

    .send-button {
        position: absolute;
        bottom: 1.5rem;
        right: 1.5rem;
        background: black;
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.2s;
    }

    .send-button:hover {
        transform: scale(1.1);
    }

    .send-button svg {
        transform: rotate(-45deg) translate(2px, -2px);
    }
</style>
