<script lang="ts">
    import { fly, fade } from 'svelte/transition';
    
    let {
        show = $bindable(false),
        title = "",
        placement = 'right',
        children
    } = $props();

    function close() {
        show = false;
    }
</script>

{#if show}
    <div 
        class="drawer-backdrop" 
        role="button"
        tabindex="0"
        onclick={(e) => { if (e.target === e.currentTarget) close(); }}
        onkeydown={(e) => { if (e.key === 'Escape' && e.target === e.currentTarget) close(); }}
        transition:fade={{ duration: 200 }}
    >
        <div 
            class="drawer-content {placement}" 
            transition:fly={{ x: placement === 'right' ? 400 : -400, duration: 300 }}
        >
            <div class="drawer-header">
                <h2 class="drawer-title">{title}</h2>
                <button class="close-button" onclick={close}>✕</button>
            </div>
            <div class="drawer-body">
                {@render children?.()}
            </div>
        </div>
    </div>
{/if}

<style>
    .drawer-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.1);
        z-index: 1500;
        backdrop-filter: blur(1px);
    }

    .drawer-content {
        position: absolute;
        top: 0;
        height: 100%;
        width: 400px;
        background: var(--bg-color);
        border-left: 1px solid var(--border-color);
        padding: 2rem;
        box-shadow: -10px 0 30px rgba(0,0,0,0.05);
        display: flex;
        flex-direction: column;
    }

    .left {
        left: 0;
        border-left: none;
        border-right: 1px solid var(--border-color);
        box-shadow: 10px 0 30px rgba(0,0,0,0.05);
    }

    .right {
        right: 0;
    }

    .drawer-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 3rem;
    }

    .drawer-title {
        font-family: var(--font-serif);
        font-size: 1.8rem;
        margin: 0;
        font-weight: 400;
    }

    .close-button {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--text-color);
    }

    .drawer-body {
        flex: 1;
        overflow-y: auto;
    }
</style>
