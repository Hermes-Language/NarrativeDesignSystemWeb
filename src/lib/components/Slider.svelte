<script lang="ts">
    let { 
        value = $bindable(0), 
        min = 0, 
        max = 100, 
        step = 1, 
        label = "",
        showValue = true
    } = $props();

    let percentage = $derived(((value - min) / (max - min)) * 100);
</script>

<div class="slider-container">
    <div class="slider-header">
        {#if label}
            <span class="label">{label}</span>
        {/if}
        {#if showValue}
            <span class="value">{value}</span>
        {/if}
    </div>
    
    <div class="slider-wrapper">
        <div class="track">
            <div class="fill" style="width: {percentage}%"></div>
        </div>
        <input 
            type="range" 
            {min} 
            {max} 
            {step} 
            bind:value 
            aria-label={label || 'Slider'}
        />
    </div>
</div>

<style>
    .slider-container {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
        max-width: 300px;
    }

    .slider-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-family: var(--font-serif);
        font-size: 0.9rem;
        color: var(--secondary-text);
    }

    .value {
        font-family: var(--font-sans);
        font-weight: 500;
        color: var(--text-color);
    }

    .slider-wrapper {
        position: relative;
        height: 20px;
        display: flex;
        align-items: center;
    }

    .track {
        position: absolute;
        width: 100%;
        height: 2px;
        background: var(--border-color);
        opacity: 0.2;
        pointer-events: none;
    }

    .fill {
        position: absolute;
        height: 100%;
        background: var(--text-color);
    }

    input[type="range"] {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: 20px;
        background: transparent;
        cursor: pointer;
        z-index: 1;
        margin: 0;
    }

    input[type="range"]:focus {
        outline: none;
    }

    /* Thumb */
    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: 16px;
        width: 16px;
        border-radius: 0;
        background: var(--panel-bg);
        border: 1px solid var(--border-color);
        margin-top: 0;
        transform: translateY(0);
        transition: transform 0.1s ease, background-color 0.2s;
    }

    /* For Webkit, we often need to center the thumb manually if the track is custom */
    input[type="range"]::-webkit-slider-runnable-track {
        height: 20px;
        display: flex;
        align-items: center;
    }

    input[type="range"]::-moz-range-thumb {
        height: 14px;
        width: 14px;
        border-radius: 0;
        background: var(--panel-bg);
        border: 1px solid var(--border-color);
        transition: transform 0.1s ease;
    }

    input[type="range"]::-moz-range-track {
        height: 20px;
        display: flex;
        align-items: center;
    }

    input[type="range"]:active::-webkit-slider-thumb {
        transform: scale(1.2);
        background: var(--border-color);
    }

    input[type="range"]:active::-moz-range-thumb {
        transform: scale(1.2);
        background: var(--border-color);
    }
</style>