<script lang="ts">
    import * as m from '$lib/paraglide/messages.js';
    import { fade, scale } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';
	import { X } from '@lucide/svelte';
    
    let { 
        show = $bindable(false), 
        title = "Title",
        children,
        footer = undefined
    } = $props();

    function close() {
        show = false;
    }
</script>

{#if show}
    <div 
        class="modal-backdrop"
        role="button"
        tabindex="0"
        onclick={(e) => { if (e.target === e.currentTarget) close(); }}
        onkeydown={(e) => { if ((e.key === 'Escape' || e.key === 'Enter') && e.target === e.currentTarget) close(); }}
        transition:fade={{ duration: 300 }}
        aria-label={m.close_modal()}
    >
        <div 
            class="modal-box" 
            transition:scale={{ duration: 400, start: 0.95, opacity: 0, easing: cubicOut }}
        >
            <div class="modal-header">
                <span class="modal-title">{title}</span>
                <button class="close-icon" onclick={close} aria-label={m.close()}>
                    <X size=20/>
                </button>
            </div>
            <div class="modal-body">
                {@render children?.()}
            </div>
            {#if footer}
                <div class="modal-footer">
                    {@render footer()}
                </div>
            {/if}
        </div>
    </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: var(--overlay-bg);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
    }

    .modal-box {
        background: var(--panel-bg);
        border: 1px solid var(--border-color);
        width: 600px;
        max-width: 90vw;
        min-height: 400px;
        padding: var(--spacing-lg);
        display: flex;
        flex-direction: column;
        position: relative;
        box-shadow: 0 20px 50px rgba(0,0,0,0.05);
    }

    @media (max-width: 600px) {
        .modal-box {
            width: 100vw;
            height: 100vh;
            max-width: 100vw;
            max-height: 100vh;
            padding: var(--spacing-md);
            border: none;
        }
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: var(--spacing-xl);
    }

    .modal-title {
        font-family: var(--font-serif);
        font-size: 1.8rem;
        color: var(--text-color);
    }

    .close-icon {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        color: var(--text-color);
        transition: opacity 0.2s;
    }

    .close-icon:hover {
        opacity: 0.5;
    }

    .modal-body {
        flex: 1;
    }

    .modal-footer {
        margin-top: 2rem;
        display: flex;
        justify-content: flex-end;
        gap: 1.5rem;
    }
</style>
