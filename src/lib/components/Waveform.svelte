<script lang="ts">
    import { onMount, tick } from 'svelte';

    let { src, color = 'currentColor' } = $props();
    let canvas: HTMLCanvasElement | undefined = $state();

    async function draw() {
        if (!src || !canvas) return;
        
        try {
            const response = await fetch(src);
            if (!response.ok) return;
            const arrayBuffer = await response.arrayBuffer();
            
            // Use a local audio context to decode
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
            const rawData = audioBuffer.getChannelData(0);
            
            const ctx = canvas.getContext('2d', { alpha: true });
            if (!ctx) return;

            // Internal resolution
            canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            canvas.height = canvas.offsetHeight * window.devicePixelRatio;
            const width = canvas.width;
            const height = canvas.height;
            
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = color;

            // Calculate peaks
            const barGap = 2 * window.devicePixelRatio;
            const barWidth = 2 * window.devicePixelRatio;
            const samples = Math.floor(width / (barWidth + barGap));
            const blockSize = Math.floor(rawData.length / samples);

            for (let i = 0; i < samples; i++) {
                const start = i * blockSize;
                let max = 0;
                for (let j = 0; j < blockSize; j++) {
                    const abs = Math.abs(rawData[start + j]);
                    if (abs > max) max = abs;
                }
                
                const h = Math.max(4, max * height * 0.8);
                const x = i * (barWidth + barGap);
                const y = (height - h) / 2;
                
                // Draw simple bar
                ctx.fillRect(x, y, barWidth, h);
            }
            
            await audioCtx.close();
        } catch (e) {
            console.error("Waveform draw error:", e);
        }
    }

    $effect(() => {
        if (src && canvas) {
            draw();
        }
    });
</script>

<canvas bind:this={canvas}></canvas>

<style>
    canvas {
        width: 100%;
        height: 100%;
        display: block;
        pointer-events: none;
    }
</style>
