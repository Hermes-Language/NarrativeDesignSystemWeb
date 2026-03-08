<script lang="ts">
    import * as m from '../paraglide/messages.js';
    import { fade } from 'svelte/transition';
    import type { Snippet } from 'svelte';

    interface VideoSource {
        src: string;
        type?: string;
    }

    let { 
        src = "", 
        sources = [] as VideoSource[],
        currentTime = $bindable(0), 
        duration = $bindable(0), 
        paused = $bindable(true),
        volume = $bindable(1),
        muted = $bindable(false),
        playbackRate = $bindable(1),
        showControls = true,
        autoHideControls = true,
        width = "100%",
        aspectRatio = "16/9",
        topLeft = undefined,
        topRight = undefined,
        customControls = undefined
    } = $props<{
        src?: string;
        sources?: VideoSource[];
        currentTime: number;
        duration: number;
        paused: boolean;
        volume: number;
        muted: boolean;
        playbackRate?: number;
        showControls?: boolean;
        autoHideControls?: boolean;
        width?: string;
        aspectRatio?: string;
        topLeft?: Snippet;
        topRight?: Snippet;
        customControls?: Snippet;
    }>();

    let video: HTMLVideoElement;
    let controlsVisible = $state(true);
    let hideTimer: ReturnType<typeof setTimeout>;

    function handleMouseMove() {
        if (!autoHideControls) return;
        controlsVisible = true;
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => {
            if (!paused) controlsVisible = false;
        }, 2000);
    }

    function togglePlay() {
        if (paused) {
            video.play();
        } else {
            video.pause();
        }
    }

    function seek(amount: number) {
        if (!video) return;
        video.currentTime += amount;
    }

    $effect(() => {
        if (paused && autoHideControls) {
            controlsVisible = true;
        }
    });
</script>

<div 
    class="video-previewer" 
    style="width: {width}; aspect-ratio: {aspectRatio}"
    onmousemove={handleMouseMove}
    onmouseleave={() => autoHideControls && !paused && (controlsVisible = false)}
    role="presentation"
>
    <!-- Video Element -->
    <video 
        bind:this={video}
        bind:currentTime 
        bind:duration 
        bind:paused 
        bind:volume 
        bind:muted 
        bind:playbackRate
        onclick={togglePlay}
        playsinline
        aria-label={m.video_preview()}
    >
        {#if src}
            <source {src} />
        {/if}
        {#each sources as source (source.src)}
            <source src={source.src} type={source.type} />
        {/each}
        <track kind="captions" />
        Your browser does not support the video tag.
    </video>

    <!-- Overlay Controls -->
    {#if showControls && controlsVisible}
        <div class="video-overlay" transition:fade={{ duration: 200 }}>
            <div class="overlay-top">
                {@render topLeft?.()}
                {@render topRight?.()}
            </div>

            <div class="overlay-center" onclick={togglePlay} aria-hidden="true">
                {#if paused}
                    <div class="play-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"></path>
                        </svg>
                    </div>
                {/if}
            </div>

            <div class="overlay-bottom">
                <div class="progress-bar-area">
                    <input 
                        type="range" 
                        min="0" 
                        max={duration || 0} 
                        step="0.01" 
                        bind:value={currentTime} 
                        class="seek-slider"
                        aria-label={m.seek_video()}
                    />
                </div>
                
                <div class="controls-row">
                    <div class="left-controls">
                        <button class="icon-btn" onclick={togglePlay} aria-label={paused ? m.play() : m.pause()} title={paused ? m.play() : m.pause()}>
                            {#if paused}
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8 5v14l11-7z"></path>
                                </svg>
                            {:else}
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>
                                </svg>
                            {/if}
                        </button>
                        
                        <div class="time-display">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </div>
                    </div>

                    <div class="right-controls">
                        {@render customControls?.()}
                        
                        <div class="volume-control">
                           <button class="icon-btn" onclick={() => muted = !muted} aria-label={muted ? m.unmute() : m.mute()} title={muted ? m.unmute() : m.mute()}>
                               {#if muted || volume === 0}
                                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                       <path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6"></path>
                                   </svg>
                               {:else}
                                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                       <path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                                   </svg>
                               {/if}
                           </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>

<script lang="ts" module>
    export function formatTime(seconds: number) {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
</script>

<style>
    .video-previewer {
        position: relative;
        background: var(--accent-color, #000);
        overflow: hidden;
        border: 1px solid var(--border-color);
        box-shadow: 4px 4px 0px var(--accent-color);
    }

    video {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: contain;
    }

    .video-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(to top, var(--overlay-bg) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.4) 100%);
        display: flex;
        flex-direction: column;
        color: var(--bg-color, #fff);
        font-family: var(--font-sans);
        z-index: 10;
        pointer-events: none;
    }

    .video-overlay * {
        pointer-events: auto;
    }

    .overlay-top {
        padding: var(--spacing-sm);
        display: flex;
        justify-content: space-between;
    }

    .overlay-center {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    .play-icon {
        background: var(--hover-bg);
        backdrop-filter: blur(4px);
        border-radius: 50%;
        padding: var(--spacing-md);
        border: 2px solid var(--border-color);
        color: var(--text-color);
        transition: transform 0.2s;
    }

    .play-icon:hover {
        transform: scale(1.1);
    }

    .overlay-bottom {
        padding: var(--spacing-sm) var(--spacing-md);
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
    }

    .progress-bar-area {
        width: 100%;
    }

    .seek-slider {
        width: 100%;
        cursor: pointer;
        height: 4px;
        accent-color: var(--accent-color, #fff);
    }

    .controls-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .left-controls, .right-controls {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
    }

    .icon-btn {
        background: none;
        border: none;
        color: var(--text-color);
        cursor: pointer;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .icon-btn:hover {
        color: var(--accent-color);
    }

    .time-display {
        font-size: 0.85rem;
    }
</style>
