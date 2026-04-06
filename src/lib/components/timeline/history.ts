import type { TimelineTrack } from './types.js';

export interface TimelineHistoryState {
    history: string[];
    historyIndex: number;
}

export interface TimelineHistoryResult extends TimelineHistoryState {
    tracks: TimelineTrack[] | null;
}

export function pushHistorySnapshot(
    tracks: TimelineTrack[],
    history: string[],
    historyIndex: number,
    maxSize = 50
): TimelineHistoryState {
    const snapshot = JSON.stringify(tracks);
    let nextHistory = history;
    let nextHistoryIndex = historyIndex;

    if (nextHistoryIndex < nextHistory.length - 1) {
        nextHistory = nextHistory.slice(0, nextHistoryIndex + 1);
    }

    nextHistory = [...nextHistory, snapshot];

    if (nextHistory.length > maxSize) {
        nextHistory = nextHistory.slice(1);
    } else {
        nextHistoryIndex++;
    }

    return {
        history: nextHistory,
        historyIndex: nextHistoryIndex
    };
}

export function undoHistory(history: string[], historyIndex: number): TimelineHistoryResult {
    if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        return {
            history,
            historyIndex: nextIndex,
            tracks: JSON.parse(history[nextIndex]) as TimelineTrack[]
        };
    }

    return {
        history,
        historyIndex,
        tracks: null
    };
}

export function redoHistory(history: string[], historyIndex: number): TimelineHistoryResult {
    if (historyIndex < history.length - 1) {
        const nextIndex = historyIndex + 1;
        return {
            history,
            historyIndex: nextIndex,
            tracks: JSON.parse(history[nextIndex]) as TimelineTrack[]
        };
    }

    return {
        history,
        historyIndex,
        tracks: null
    };
}
