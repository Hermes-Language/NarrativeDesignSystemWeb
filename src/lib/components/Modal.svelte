<script lang="ts">
    import { fade, scale } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';
    import { Close } from '@icon-park/svg';
    
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
        aria-label="Close modal"
    >
        <div 
            class="modal-box" 
            transition:scale={{ duration: 400, start: 0.95, opacity: 0, easing: cubicOut }}
        >
            <div class="modal-header">
                <span class="modal-title">{title}</span>
                <button class="close-icon" onclick={close} aria-label="Close">
                    {@html Close({ size: 24 })}
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
        background: rgba(247, 243, 240, 0.8); /* 使用设计稿背景色作为半透明遮罩 */
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        backdrop-filter: blur(4px);
    }

    .modal-box {
        background: white;
        border: 1px solid var(--border-color);
        width: 600px;
        min-height: 400px;
        padding: 2.5rem;
        display: flex;
        flex-direction: column;
        position: relative;
        box-shadow: 0 20px 50px rgba(0,0,0,0.05);
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 2rem;
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
