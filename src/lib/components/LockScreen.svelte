<script lang="ts">
    import { fly, fade } from 'svelte/transition';
    import { Close, Lock } from '@icon-park/svg';
    
    let {
        show = $bindable(false),
        children,
        background = "#f7f3f0"
    } = $props();

    let startY = 0;
    let currentY = 0;
    let isDragging = $state(false);
    let offsetY = $state(0);

    function handleStart(e: TouchEvent | MouseEvent) {
        isDragging = true;
        startY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        offsetY = 0;
    }

    function handleMove(e: TouchEvent | MouseEvent) {
        if (!isDragging) return;
        currentY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const deltaY = currentY - startY;
        
        // Only allow upward swipe
        if (deltaY < 0) {
            offsetY = deltaY;
        }
    }

    function handleEnd() {
        if (!isDragging) return;
        isDragging = false;
        
        // If swiped up more than 150px, unlock
        if (offsetY < -150) {
            close();
        }
        offsetY = 0;
    }

    function close() {
        show = false;
    }
</script>

{#if show}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div 
        class="lock-screen-overlay" 
        transition:fade={{ duration: 300 }}
        style="background: {background}; cursor: {isDragging ? 'grabbing' : 'default'}"
        onmousedown={handleStart}
        onmousemove={handleMove}
        onmouseup={handleEnd}
        ontouchstart={handleStart}
        ontouchmove={handleMove}
        ontouchend={handleEnd}
    >
        <div 
            class="lock-screen-content" 
            style="transform: translateY({offsetY}px); transition: {isDragging ? 'none' : 'transform 0.3s ease-out'}"
            transition:fly={{ y: -1000, duration: 800, opacity: 1 }}
        >
            <div class="inner-content">
                {@render children?.()}
            </div>

            <div class="unlock-bar">
                <div class="line"></div>
                <span class="unlock-text">Swipe up to unlock</span>
                <div class="line"></div>
            </div>
        </div>
    </div>
{/if}

<style>
    .lock-screen-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 9999;
        display: flex;
        flex-direction: column;
    }

    .lock-screen-content {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
        padding: 0;
    }

    .unlock-bar {
        position: absolute;
        bottom: 2rem;
        left: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1.5rem;
        color: #999;
        padding: 1rem;
        z-index: 10;
        user-select: none;
        pointer-events: none;
    }

    .line {
        flex: 1;
        max-width: 300px;
        height: 1px;
        background: #ddd;
    }

    .unlock-text {
        font-family: var(--font-serif);
        font-size: 1rem;
        letter-spacing: 0.05em;
        white-space: nowrap;
    }

    .inner-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;
        padding: 10% 10% 15% 10%;
    }
</style>
