<script lang="ts">
    import { onMount } from 'svelte';

    let { 
        src = "", 
        title = "Unknown Track",
        artist = "Hermes AI"
    } = $props();

    let audio: HTMLAudioElement;
    let paused = $state(true);
    let currentTime = $state(0);
    let duration = $state(0);
    let volume = $state(1);
    let muted = $state(false);

    function togglePlay() {
        if (paused) {
            audio.play();
        } else {
            audio.pause();
        }
        paused = !paused;
    }

    function formatTime(seconds: number) {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    function handleSeek(e: Event) {
        const target = e.target as HTMLInputElement;
        audio.currentTime = parseFloat(target.value);
    }

    function handleVolume(e: Event) {
        const target = e.target as HTMLInputElement;
        volume = parseFloat(target.value);
        audio.volume = volume;
    }
</script>

<div class="audio-player">
    <audio 
        bind:this={audio} 
        {src} 
        bind:paused 
        bind:currentTime 
        bind:duration 
        bind:muted
    ></audio>

    <div class="info">
        <span class="title">{title}</span>
        <span class="artist">{artist}</span>
    </div>

    <div class="controls">
        <button class="play-pause" onclick={togglePlay} aria-label={paused ? 'Play' : 'Pause'}>
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

        <div class="progress-container">
            <span class="time">{formatTime(currentTime)}</span>
            <input 
                type="range" 
                min="0" 
                max={duration || 0} 
                step="0.1" 
                value={currentTime} 
                oninput={handleSeek}
                class="seeker"
            />
            <span class="time">{formatTime(duration)}</span>
        </div>

        <div class="volume-container">
            <button class="mute-toggle" onclick={() => muted = !muted}>
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
            <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume} 
                oninput={handleVolume}
                class="volume-slider"
            />
        </div>
    </div>
</div>

<style>
    .audio-player {
        background: #fff;
        border: 1px solid var(--border-color);
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
        max-width: 600px;
    }

    .info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .title {
        font-family: var(--font-serif);
        font-size: 1.2rem;
        font-weight: 500;
    }

    .artist {
        font-family: var(--font-sans);
        font-size: 0.85rem;
        color: #666;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .controls {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        flex-wrap: wrap;
    }

    @media (max-width: 480px) {
        .controls {
            gap: 1rem;
            justify-content: space-between;
        }
        
        .volume-control {
            width: 100%;
            margin-top: 0.5rem;
        }
    }

    .play-pause {
        background: var(--border-color);
        color: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.2s;
    }

    .play-pause:hover {
        transform: scale(1.05);
    }

    .progress-container {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .time {
        font-family: var(--font-sans);
        font-size: 0.75rem;
        color: #888;
        min-width: 35px;
    }

    input[type="range"] {
        -webkit-appearance: none;
        appearance: none;
        background: transparent;
        cursor: pointer;
    }

    .seeker {
        flex: 1;
        height: 2px;
        background: #eee;
    }

    .seeker::-webkit-slider-runnable-track {
        height: 2px;
        background: #eee;
    }

    .seeker::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: 12px;
        width: 12px;
        border-radius: 50%;
        background: var(--border-color);
        margin-top: -5px;
    }

    .volume-container {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .mute-toggle {
        background: none;
        border: none;
        cursor: pointer;
        color: #666;
        padding: 0;
        display: flex;
        align-items: center;
    }

    .volume-slider {
        width: 60px;
        height: 2px;
        background: #eee;
    }

    .volume-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: 8px;
        width: 8px;
        border-radius: 50%;
        background: #666;
        margin-top: -3px;
    }
</style>