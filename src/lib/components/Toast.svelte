<script lang="ts" context="module">
    import { writable } from 'svelte/store';

    export type ToastType = 'info' | 'success' | 'error';
    export interface ToastMessage {
        id: number;
        message: string;
        type: ToastType;
    }

    const toasts = writable<ToastMessage[]>([]);

    export function addToast(message: string, type: ToastType = 'info', duration = 3000) {
        const id = Date.now();
        toasts.update(all => [{ id, message, type }, ...all]);
        setTimeout(() => {
            toasts.update(all => all.filter(t => t.id !== id));
        }, duration);
    }
</script>

<script lang="ts">
    import { flip } from 'svelte/animate';
    import { fade, fly } from 'svelte/transition';
</script>

<div class="toast-container">
    {#each $toasts as toast (toast.id)}
        <div 
            class="toast {toast.type}" 
            animate:flip={{ duration: 300 }}
            in:fly={{ y: 20, duration: 400 }}
            out:fade={{ duration: 200 }}
        >
            <span class="message">{toast.message}</span>
        </div>
    {/each}
</div>

<style>
    .toast-container {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        z-index: 2000;
        pointer-events: none;
    }

    @media (max-width: 600px) {
        .toast-container {
            bottom: 1rem;
            right: 1rem;
            left: 1rem;
        }
        .toast {
            min-width: 0;
            width: 100%;
            font-size: 1rem;
            padding: 0.75rem 1rem;
        }
    }

    .toast {
        pointer-events: auto;
        background: var(--text-color);
        color: var(--bg-color);
        padding: 1rem 1.5rem;
        border: 1px solid var(--border-color);
        font-family: var(--font-serif);
        font-size: 1.1rem;
        min-width: 200px;
    }

    .success { background: var(--text-color); border-left: 4px solid #4caf50; }
    .error { background: var(--text-color); border-left: 4px solid #f44336; }
    .info { background: var(--text-color); border-left: 4px solid #2196f3; }

    .message {
        display: block;
    }
</style>
