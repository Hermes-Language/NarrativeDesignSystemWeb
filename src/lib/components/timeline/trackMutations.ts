import type { TimelineBlock, TimelineTrack } from './types.js';

export function addBlockToTrack(
    tracks: TimelineTrack[],
    trackId: string,
    newBlock: TimelineBlock
): TimelineTrack[] {
    return tracks.map((track) => {
        if (track.id === trackId) {
            return { ...track, blocks: [...track.blocks, newBlock] };
        }
        return track;
    });
}

export function addTrackToTimeline(tracks: TimelineTrack[], track: TimelineTrack): TimelineTrack[] {
    return [...tracks, track];
}

export function updateSpeakerNameInTracks(
    tracks: TimelineTrack[],
    trackId: string,
    name: string
): TimelineTrack[] {
    return tracks.map((track) => (track.id === trackId ? { ...track, speaker: name } : track));
}

export function updateSpeakerConfigInTracks(
    tracks: TimelineTrack[],
    trackId: string,
    updates: Partial<TimelineTrack>,
    estimateVisualDuration: (text: string) => number
): TimelineTrack[] {
    return tracks.map((track) => {
        if (track.id !== trackId) return track;

        const shouldResetBlocks =
            (updates.voice !== undefined && updates.voice !== track.voice) ||
            (updates.emotion !== undefined && updates.emotion !== track.emotion) ||
            (updates.prompt !== undefined && updates.prompt !== track.prompt);

        return {
            ...track,
            ...updates,
            blocks: shouldResetBlocks
                ? track.blocks.map((block) => ({
                      ...block,
                      state: 'none' as const,
                      audioUrl: undefined,
                      duration: block.type === 'audio' ? block.duration : estimateVisualDuration(block.text)
                  }))
                : track.blocks
        };
    });
}

export function deleteBlocksFromTracks(tracks: TimelineTrack[], blockIds: string[]): TimelineTrack[] {
    return tracks.map((track) => ({
        ...track,
        blocks: track.blocks.filter((block) => !blockIds.includes(block.id))
    }));
}

export function updateBlockInTracks(
    tracks: TimelineTrack[],
    blockId: string,
    updates: Partial<TimelineBlock>
): TimelineTrack[] {
    return tracks.map((track) => ({
        ...track,
        blocks: track.blocks.map((block) => (block.id === blockId ? { ...block, ...updates } : block))
    }));
}

export function updateBlockTextInTracks(
    tracks: TimelineTrack[],
    blockId: string,
    text: string,
    estimateVisualDuration: (text: string) => number
): TimelineTrack[] {
    return tracks.map((track) => ({
        ...track,
        blocks: track.blocks.map((block) => {
            if (block.id !== blockId) return block;

            const hasChanged = block.text !== text;
            const newState = hasChanged ? 'none' : block.state;
            const newDuration = newState === 'none' ? estimateVisualDuration(text) : block.duration;

            return { ...block, text, state: newState, duration: newDuration };
        })
    }));
}

export function updateBlockStartInTracks(
    tracks: TimelineTrack[],
    blockId: string,
    start: number
): TimelineTrack[] {
    return updateBlockInTracks(tracks, blockId, { start });
}

export function updateBlockDurationInTracks(
    tracks: TimelineTrack[],
    blockId: string,
    duration: number
): TimelineTrack[] {
    return updateBlockInTracks(tracks, blockId, { duration });
}

export function updateBlockEnvelopeInTrack(
    tracks: TimelineTrack[],
    trackId: string,
    blockId: string,
    envelope: { time: number; value: number }[]
): TimelineTrack[] {
    return tracks.map((track) => {
        if (track.id !== trackId) return track;

        return {
            ...track,
            blocks: track.blocks.map((block) => {
                if (block.id === blockId) {
                    return { ...block, envelope };
                }
                return block;
            })
        };
    });
}

export function sortBlockEnvelopeInTrack(
    tracks: TimelineTrack[],
    trackId: string,
    blockId: string
): TimelineTrack[] {
    return tracks.map((track) => {
        if (track.id !== trackId) return track;

        return {
            ...track,
            blocks: track.blocks.map((block) => {
                if (block.id === blockId && block.envelope) {
                    return { ...block, envelope: [...block.envelope].sort((a, b) => a.time - b.time) };
                }
                return block;
            })
        };
    });
}

export function findBlockById(tracks: TimelineTrack[], blockId: string): TimelineBlock | undefined {
    for (const track of tracks) {
        const block = track.blocks.find((candidate) => candidate.id === blockId);
        if (block) return block;
    }
    return undefined;
}

export function findBlockWithTrack(
    tracks: TimelineTrack[],
    blockId: string
): { block: TimelineBlock; track: TimelineTrack } | null {
    for (const track of tracks) {
        const block = track.blocks.find((candidate) => candidate.id === blockId);
        if (block) {
            return { block, track };
        }
    }

    return null;
}

export function resolveDragCollisionInTrack(
    tracks: TimelineTrack[],
    trackId: string,
    blockId: string
): TimelineTrack[] {
    const track = tracks.find((candidate) => candidate.id === trackId);
    if (!track) return tracks;

    const block = track.blocks.find((candidate) => candidate.id === blockId);
    if (!block) return tracks;

    const duration = block.duration;
    const proposedStart = block.start;
    const others = track.blocks.filter((candidate) => candidate.id !== blockId);

    const hasCollision = others.some(
        (candidate) =>
            proposedStart < candidate.start + candidate.duration && proposedStart + duration > candidate.start
    );

    if (!hasCollision) return tracks;

    let candidates = [0];
    others.forEach((candidate) => {
        candidates.push(candidate.start + candidate.duration);
        candidates.push(Math.max(0, candidate.start - duration));
    });

    candidates = [...new Set(candidates)];

    const validCandidates = candidates.filter((start) => {
        const end = start + duration;
        return !others.some((candidate) => start < candidate.start + candidate.duration && end > candidate.start);
    });

    if (validCandidates.length === 0) return tracks;

    const bestStart = validCandidates.reduce((prev, curr) =>
        Math.abs(curr - proposedStart) < Math.abs(prev - proposedStart) ? curr : prev
    );

    return tracks.map((candidateTrack) => {
        if (candidateTrack.id !== trackId) return candidateTrack;

        return {
            ...candidateTrack,
            blocks: candidateTrack.blocks.map((candidateBlock) =>
                candidateBlock.id === blockId ? { ...candidateBlock, start: bestStart } : candidateBlock
            )
        };
    });
}

export function splitBlockAtTime(
    tracks: TimelineTrack[],
    trackId: string,
    blockId: string,
    splitTime: number,
    createBlockId: () => string
): TimelineTrack[] {
    return tracks.map((track) => {
        if (track.id !== trackId) return track;

        const blockIndex = track.blocks.findIndex((block) => block.id === blockId);
        if (blockIndex === -1) return track;

        const block = track.blocks[blockIndex];
        if (splitTime <= block.start || splitTime >= block.start + block.duration) return track;

        const part1Duration = splitTime - block.start;
        const part2Duration = block.duration - part1Duration;

        const block2: TimelineBlock = {
            ...(JSON.parse(JSON.stringify(block)) as TimelineBlock),
            id: createBlockId(),
            start: splitTime,
            duration: part2Duration
        };

        const block1: TimelineBlock = {
            ...block,
            duration: part1Duration
        };

        const newBlocks = [...track.blocks];
        newBlocks.splice(blockIndex, 1, block1, block2);

        return { ...track, blocks: newBlocks };
    });
}

export function collectAllBlockIds(tracks: TimelineTrack[]): string[] {
    return tracks.flatMap((track) => track.blocks.map((block) => block.id));
}
