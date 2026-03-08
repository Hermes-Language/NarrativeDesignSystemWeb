<script lang="ts">
    import * as m from '../paraglide/messages.js';
    import { fly, fade } from 'svelte/transition';
    import { onMount } from 'svelte';
    
    let {
        show = $bindable(false),
        children,
        background = "var(--bg-color)",
        lottiePath = ""
    } = $props();

    let lottieContainer = $state<HTMLElement | null>(null);
    let lottieInstance = $state<any>(null);

    async function initLottie() {
        if (lottieContainer && lottiePath) {
            const lottieModule = await import('lottie-web');
            const lottie = (lottieModule as any).default || lottieModule;
            lottieInstance = lottie.loadAnimation({
                container: lottieContainer,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: lottiePath
            });
        }
    }

    onMount(() => {
        initLottie();
        return () => {
            if (lottieInstance) {
                lottieInstance.destroy();
            }
        };
    });

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
                {#if lottiePath}
                    <div bind:this={lottieContainer} class="lottie-container"></div>
                {/if}
                <div class="overlay-text">
                    {@render children?.()}
                </div>
            </div>

            <div class="unlock-bar">
                <div class="line"></div>
                <span class="unlock-text">{m.swipe_to_unlock()}</span>
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
        overflow: hidden;
    }

    .lock-screen-content {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
        padding: 0;
    }

    .inner-content {
        flex: 1;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
    }

    .lottie-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
    }

    .overlay-text {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;
        padding: 10% 10% 15% 10%;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    .unlock-bar {
        position: absolute;
        bottom: var(--spacing-lg);
        left: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-md);
        color: var(--secondary-text);
        padding: var(--spacing-sm);
        z-index: 10;
        user-select: none;
        pointer-events: none;
    }

    .line {
        flex: 1;
        max-width: 300px;
        height: 1px;
        background: var(--border-color);
    }

    .unlock-text {
        font-family: var(--font-serif);
        font-size: var(--font-size-base);
        letter-spacing: 0.05em;
        white-space: nowrap;
    }

    @media (max-width: 600px) {
        .overlay-text {
            align-items: center;
            padding: 10%;
        }
        :global(.overlay-text h1) {
            font-size: 2.5rem !important;
            text-align: center !important;
        }
    }
</style>
