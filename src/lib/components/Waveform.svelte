<script lang="ts">
    import { onDestroy } from 'svelte';

    interface WindowWithWebkit extends Window {
        webkitAudioContext?: typeof AudioContext;
    }

    let { src, color = 'currentColor' } = $props();
    let canvas: HTMLCanvasElement | undefined = $state();

    let rawData: Float32Array | null = null;
    let requestId = 0;
    let fetchController: AbortController | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let drawRafId: number | null = null;
    let decoderContext: AudioContext | null = null;
    let peaksBySampleCount: Record<number, Float32Array> = {};

    function getDecoderContext() {
        if (decoderContext && decoderContext.state !== 'closed') {
            return decoderContext;
        }

        const AudioContextClass = window.AudioContext || (window as unknown as WindowWithWebkit).webkitAudioContext;
        if (!AudioContextClass) return null;
        decoderContext = new AudioContextClass();
        return decoderContext;
    }

    function clearCanvas() {
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function resizeCanvas() {
        if (!canvas) return;
        const dpr = Math.max(1, window.devicePixelRatio || 1);
        const nextWidth = Math.max(1, Math.floor(canvas.offsetWidth * dpr));
        const nextHeight = Math.max(1, Math.floor(canvas.offsetHeight * dpr));

        if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
            canvas.width = nextWidth;
            canvas.height = nextHeight;
        }
    }

    function getPeaks(data: Float32Array, samples: number) {
        const cached = peaksBySampleCount[samples];
        if (cached) return cached;

        const peaks = new Float32Array(samples);
        const blockSize = Math.max(1, Math.floor(data.length / samples));

        for (let i = 0; i < samples; i++) {
            const start = i * blockSize;
            const end = Math.min(data.length, start + blockSize);
            let max = 0;
            for (let j = start; j < end; j++) {
                const abs = Math.abs(data[j]);
                if (abs > max) max = abs;
            }
            peaks[i] = max;
        }

        peaksBySampleCount[samples] = peaks;
        return peaks;
    }

    function drawWaveform() {
        if (!canvas) return;

        resizeCanvas();

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);
        if (!rawData) return;

        const dpr = Math.max(1, window.devicePixelRatio || 1);
        const barGap = 2 * dpr;
        const barWidth = 2 * dpr;
        const samples = Math.max(1, Math.floor(width / (barWidth + barGap)));
        const minBarHeight = Math.max(2 * dpr, 4);
        const peaks = getPeaks(rawData, samples);

        ctx.fillStyle = color;

        for (let i = 0; i < samples; i++) {
            const h = Math.max(minBarHeight, peaks[i] * height * 0.8);
            const x = i * (barWidth + barGap);
            const y = (height - h) / 2;
            ctx.fillRect(x, y, barWidth, h);
        }
    }

    function scheduleDraw() {
        if (drawRafId !== null) {
            cancelAnimationFrame(drawRafId);
        }

        drawRafId = requestAnimationFrame(() => {
            drawRafId = null;
            drawWaveform();
        });
    }

    async function loadSource(url: string) {
        const currentRequestId = ++requestId;

        fetchController?.abort();
        const controller = new AbortController();
        fetchController = controller;

        try {
            const response = await fetch(url, { signal: controller.signal });
            if (!response.ok) return;

            const arrayBuffer = await response.arrayBuffer();
            const audioCtx = getDecoderContext();
            if (!audioCtx) return;

            const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

            // Ignore stale decode results when src changes quickly.
            if (currentRequestId !== requestId) return;

            rawData = audioBuffer.getChannelData(0).slice();
            peaksBySampleCount = {};
            scheduleDraw();
        } catch (error) {
            if ((error as DOMException).name === 'AbortError') {
                return;
            }
            console.error('Waveform draw error:', error);
        }
    }

    $effect(() => {
        if (!canvas) return;

        if (typeof ResizeObserver !== 'undefined') {
            resizeObserver?.disconnect();
            resizeObserver = new ResizeObserver(() => {
                scheduleDraw();
            });
            resizeObserver.observe(canvas);
        }

        return () => {
            resizeObserver?.disconnect();
            resizeObserver = null;
        };
    });

    $effect(() => {
        if (!src) {
            rawData = null;
            peaksBySampleCount = {};
            clearCanvas();
            return;
        }

        void loadSource(src);
    });

    $effect(() => {
        if (!canvas) return;

        const currentColor = color;
        const hasData = rawData !== null;
        if (currentColor || hasData) {
            scheduleDraw();
        }
    });

    onDestroy(() => {
        fetchController?.abort();
        resizeObserver?.disconnect();

        if (drawRafId !== null) {
            cancelAnimationFrame(drawRafId);
            drawRafId = null;
        }

        if (decoderContext && decoderContext.state !== 'closed') {
            void decoderContext.close();
        }

        decoderContext = null;
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
