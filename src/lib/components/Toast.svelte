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
    import { fly } from 'svelte/transition';
    import { cubicInOut, cubicOut } from 'svelte/easing';
</script>

<div class="toast-container">
    {#each $toasts as toast (toast.id)}
        <div 
            class="toast {toast.type}" 
            animate:flip={{ duration: 300 }}
            in:fly={{ x: 100, duration: 600, easing: cubicOut }}
            out:fly={{ x: 100, duration: 400, easing: cubicInOut }}
        >
            <div class="toast-content">
                <span class="message-reveal">{toast.message}</span>
            </div>
            <div class="toast-line"></div>
        </div>
    {/each}
</div>

<style>
    .toast-container {
        position: fixed;
        bottom: 1.5rem;
        right: 0;
        display: flex;
        flex-direction: column;
        gap: 0;
        z-index: 2000;
        pointer-events: none;
    }

    .toast {
        position: relative;
        pointer-events: auto;
        background: var(--bg-color);
        color: var(--text-color);
        padding: 0.75rem 1.5rem;
        border: 1px solid var(--border-color);
        border-right: none;
        font-family: var(--font-serif);
        font-size: 1rem;
        min-width: 280px;
        margin-bottom: 8px;
        overflow: hidden;
        display: flex;
        align-items: center;
        box-shadow: -4px 4px 15px rgba(0,0,0,0.08);
    }

    :global([data-theme='dark']) .toast {
        background: var(--bg-color);
        color: var(--text-color);
        border: 1px solid var(--border-color);
        border-right: none;
        box-shadow: -4px 4px 15px rgba(0,0,0,0.4);
    }

    .success .toast-line { background: #4caf50; }
    .error .toast-line { background: #f44336; }
    .info .toast-line { background: #2196f3; }

    .toast-line {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 4px;
    }

    .toast-content {
        overflow: hidden;
    }

    .message-reveal {
        display: block;
        animation: text-reveal 0.8s cubic-bezier(0.77, 0, 0.175, 1) forwards;
        transform: translateY(100%);
    }

    @keyframes text-reveal {
        0% {
            transform: translateY(100%);
        }
        100% {
            transform: translateY(0);
        }
    }

    @media (max-width: 600px) {
        .toast {
            min-width: 0;
            width: 100vw;
            padding: 0.75rem 1rem;
        }
    }
</style>
