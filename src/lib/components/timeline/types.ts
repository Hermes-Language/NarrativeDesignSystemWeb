export type TimelineBlockState = 'rendered' | 'failed' | 'none';
export type TimelineBlockType = 'tts' | 'audio';
export type TimelineMode = 'TTS' | 'Subtitle';
export type TimelineTool = 'pointer' | 'hand' | 'razor' | 'pen';

export interface EnvelopePoint {
    time: number;
    value: number;
}

export interface TimelineBlock {
    id: string;
    start: number;
    duration: number;
    text: string;
    state: TimelineBlockState;
    audioUrl?: string;
    type?: TimelineBlockType;
    fileName?: string;
    playbackRate?: number;
    volume?: number;
    envelope?: EnvelopePoint[];
    sourceDuration?: number;
}

export interface TimelineTrack {
    id: string;
    speaker: string;
    blocks: TimelineBlock[];
    prompt?: string;
    voice?: string;
    emotion?: number;
}

export interface TimelineRenderSpeakerContext {
    id: string;
    name: string;
    prompt?: string;
    voice?: string;
    emotion?: number;
}

export interface TimelineRenderContext {
    block: TimelineBlock;
    speaker: TimelineRenderSpeakerContext;
}
