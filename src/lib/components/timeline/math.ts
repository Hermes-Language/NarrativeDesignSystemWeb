import type { EnvelopePoint } from './types.js';

export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

export function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function estimateVisualDuration(text: string, pixelsPerSecond: number): number {
    if (!text) return 1.0;
    const pixelsPerChar = 9;
    const estimatedWidth = text.length * pixelsPerChar + 20;
    return estimatedWidth / pixelsPerSecond;
}

export function getEnvelopeValue(
    envelope: EnvelopePoint[] | undefined,
    time: number,
    defaultVal: number
): number {
    if (!envelope || envelope.length === 0) return defaultVal;

    const sorted = [...envelope].sort((a, b) => a.time - b.time);

    if (time <= sorted[0].time) return sorted[0].value;
    if (time >= sorted[sorted.length - 1].time) return sorted[sorted.length - 1].value;

    for (let i = 0; i < sorted.length - 1; i++) {
        const p1 = sorted[i];
        const p2 = sorted[i + 1];
        if (time >= p1.time && time <= p2.time) {
            const t = (time - p1.time) / (p2.time - p1.time);
            return p1.value + (p2.value - p1.value) * t;
        }
    }

    return defaultVal;
}
