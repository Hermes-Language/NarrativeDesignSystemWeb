<script lang="ts">
    interface Marker {
        id: string | number;
        position: number; // 0 to 100
        label?: string;
        color?: string;
    }

    let { 
        value = $bindable(0), 
        min = 0, 
        max = 100, 
        markers = [] as Marker[],
        showValue = false,
        height = "8px",
        interactive = true,
        onMarkerClick = (marker: Marker) => {}
    } = $props();

    let percentage = $derived(((value - min) / (max - min)) * 100);
    let hoveredMarkerId = $state<string | number | null>(null);

    function handleInput(e: Event) {
        if (!interactive) return;
        const target = e.target as HTMLInputElement;
        value = parseFloat(target.value);
    }

    function jumpToMarker(marker: Marker) {
        value = (marker.position / 100) * (max - min) + min;
        onMarkerClick(marker);
    }
</script>

<div class="progress-bar-container" style="--pb-height: {height}">
    <div class="progress-track-wrapper">
        <div class="track">
            <div class="fill" style="width: {percentage}%"></div>
            
            {#each markers as marker (marker.id)}
                <div 
                    class="marker-group" 
                    style="left: {marker.position}%"
                    onmouseenter={() => hoveredMarkerId = marker.id}
                    onmouseleave={() => hoveredMarkerId = null}
                    role="presentation"
                >
                    <button 
                        class="marker" 
                        style="background-color: {marker.color || 'var(--accent-color)'}"
                        onclick={() => jumpToMarker(marker)}
                        aria-label={marker.label || 'Marker'}
                    ></button>

                    {#if hoveredMarkerId === marker.id && marker.label}
                        <div class="marker-tooltip">
                            {marker.label}
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
        
        {#if interactive}
            <input 
                type="range" 
                {min} 
                {max} 
                step="0.01"
                bind:value 
                oninput={handleInput}
                class="progress-input"
            />
        {/if}
    </div>
    
    {#if showValue}
        <div class="value-display">
            {value.toFixed(1)}%
        </div>
    {/if}
</div>

<style>
    .progress-bar-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
    }

    .progress-track-wrapper {
        position: relative;
        height: var(--pb-height);
        width: 100%;
        display: flex;
        align-items: center;
    }

    .track {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--hover-bg);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-full);
        overflow: visible; /* Allow markers to potentially overflow if styled so */
        pointer-events: none;
    }

    .fill {
        height: 100%;
        background: var(--accent-color);
        border-radius: var(--radius-full);
        transition: width 0.1s ease-out;
    }

    .marker-group {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        pointer-events: auto;
        z-index: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .marker {
        width: 3px;
        height: calc(var(--pb-height) + 12px);
        background: var(--text-color);
        border: none;
        cursor: pointer;
        padding: 0;
        transition: transform 0.2s ease, width 0.2s ease;
        border-radius: 1px;
    }

    .marker:hover {
        width: 6px;
        transform: scaleY(1.1);
        z-index: 10;
    }

    .marker-tooltip {
        position: absolute;
        bottom: calc(100% + 10px);
        background: var(--text-color);
        color: var(--bg-color);
        padding: 4px 10px;
        border-radius: var(--radius-sm);
        font-family: var(--font-sans);
        font-size: 0.75rem;
        white-space: nowrap;
        pointer-events: none;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 100;
        animation: tooltip-fade 0.15s ease-out;
    }

    .marker-tooltip::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid var(--text-color);
    }

    @keyframes tooltip-fade {
        from { opacity: 0; transform: translateY(5px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .progress-input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
        z-index: 1;
        margin: 0;
    }

    .progress-input::-webkit-slider-runnable-track {
        height: 100%;
    }

    .value-display {
        font-family: var(--font-sans);
        font-size: 0.8rem;
        color: var(--secondary-text);
        text-align: right;
    }
</style>
