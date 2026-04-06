<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { 
        Settings, Play, Plus, Pause, CircleCheck, CircleAlert, Loader,
        MousePointer2 as CursorIcon, Hand as HandIcon, Scissors as RazorIcon, Pencil as PenIcon,
        Undo2 as UndoIcon, Redo2 as RedoIcon, MessageSquare as TtsIcon, Music as AudioIcon,
        Maximize as FullScreenIcon, Minimize as ExitFullScreenIcon
    } from '@lucide/svelte';
    import SpeakerSettings from './SpeakerSettings.svelte';
    import BlockSettings from './BlockSettings.svelte';
    import Waveform from './Waveform.svelte';
    import StateSwitch from './StateSwitch.svelte';
    import * as m from '../paraglide/messages.js';
    import { createId } from '../utils/createId.js';
    import type {
        TimelineBlock,
        TimelineBlockType,
        TimelineMode,
        TimelineRenderContext,
        TimelineTool,
        TimelineTrack
    } from './timeline/types.js';
    import { clamp, estimateVisualDuration as estimateVisualDurationForScale, formatTime, getEnvelopeValue } from './timeline/math.js';
    import { pushHistorySnapshot, redoHistory, undoHistory } from './timeline/history.js';
    import { getAudioDuration, probeAudioDurationFromUrl } from './timeline/audio.js';
    import {
        addBlockToTrack,
        addTrackToTimeline,
        collectAllBlockIds,
        deleteBlocksFromTracks,
        findBlockById,
        findBlockWithTrack,
        resolveDragCollisionInTrack,
        sortBlockEnvelopeInTrack,
        splitBlockAtTime,
        updateBlockDurationInTracks,
        updateBlockEnvelopeInTrack,
        updateBlockInTracks,
        updateBlockStartInTracks,
        updateBlockTextInTracks,
        updateSpeakerConfigInTracks,
        updateSpeakerNameInTracks
    } from './timeline/trackMutations.js';

    let { 
        mode = 'TTS' as TimelineMode, // 'TTS' | 'Subtitle'
        tracks = $bindable([
            { id: '1', speaker: 'Narrator', blocks: [], prompt: '', voice: 'en-US', emotion: 0.5 },
            { id: '2', speaker: 'Hero', blocks: [], prompt: '', voice: 'en-US', emotion: 0.7 }
        ] as TimelineTrack[]),
        globalAudioUrl = '', // Single audio for subtitle mode
        onRender = (_: TimelineRenderContext) => Promise.resolve('https://www.w3schools.com/html/horse.ogg') // Default fallback
    } = $props();

    let selectedBlockIds = $state<string[]>([]);
    let selectedTrackId = $state<string>(tracks[0]?.id || '');
    let marqueeRect = $state<{x: number, y: number, w: number, h: number} | null>(null);
    let isMarqueeSelecting = false;
    let marqueeStartPos = { x: 0, y: 0 };
    let pixelsPerSecond = $state(20); // Scale: 1s = 20px
    let timelineWidth = $state(4000); // Expanded
    let playheadTime = $state(0); // in seconds
    let isPlaying = $state(false);
    let audioElement: HTMLAudioElement | undefined = $state();
    let currentTtsBlock = $state<TimelineBlock | null>(null);

    let currentTool = $state<TimelineTool>('pointer');
    let pendingBlockType = $state<TimelineBlockType>('tts');
    let isFullScreen = $state(false);
    let isMobileMenuOpen = $state(false);

    // Envelope drawing state
    let isDraggingEnvelope = $state(false);
    let envelopeTargetBlockId = $state<string | null>(null);
    let envelopePointIndex = $state<number | null>(null);

    // History System for Undo/Redo
    let history = $state<string[]>([]); 
    let historyIndex = $state(-1);

    function pushHistory() {
        const next = pushHistorySnapshot(tracks, history, historyIndex);
        history = next.history;
        historyIndex = next.historyIndex;
    }

    function undo() {
        const next = undoHistory(history, historyIndex);
        historyIndex = next.historyIndex;
        if (next.tracks) {
            tracks = next.tracks;
        }
    }

    function redo() {
        const next = redoHistory(history, historyIndex);
        historyIndex = next.historyIndex;
        if (next.tracks) {
            tracks = next.tracks;
        }
    }

    let audioInput: HTMLInputElement;
    let currentReplaceBlockId = $state<string | null>(null);
    let isDraggingOverTimeline = $state(false);

    // Playback Engine for NLE (Non-Linear Editing)
    let playbackInterval: number | null = null;
    let lastTickTime: number = 0;

    function togglePlayback() {
        if (!audioElement) return;
        
        if (isPlaying) {
            stopPlayback();
        } else {
            startPlayback();
        }
    }

    function startPlayback() {
        isPlaying = true;
        lastTickTime = performance.now();
        
        // Start the visual clock
        playbackInterval = window.setInterval(updatePlaybackTick, 16);
        
        // Initial check for audio
        syncAudioToPlayhead();
    }

    function stopPlayback() {
        isPlaying = false;
        if (playbackInterval) {
            clearInterval(playbackInterval);
            playbackInterval = null;
        }
        if (audioElement) {
            audioElement.pause();
        }
        currentTtsBlock = null;
    }

    function updatePlaybackTick() {
        if (!isPlaying) return;
        
        const now = performance.now();
        const delta = (now - lastTickTime) / 1000;
        lastTickTime = now;
        
        // Move the playhead forward
        playheadTime += delta;
        
        // Sync audio
        syncAudioToPlayhead();
    }

    function syncAudioToPlayhead() {
        if (!audioElement) return;

        if (mode === 'Subtitle') {
            if (audioElement.src !== globalAudioUrl) {
                audioElement.src = globalAudioUrl;
            }
            // Continuous audio sync
            if (Math.abs(audioElement.currentTime - playheadTime) > 0.1) {
                audioElement.currentTime = playheadTime;
            }
            if (audioElement.paused) {
                audioElement.play().catch(() => {});
            }
        } else {
            // TTS Mode: Find if we are inside any block
            const allBlocks = tracks.flatMap(t => t.blocks)
                .filter(b => b.state === 'rendered' && b.audioUrl);
            
            const targetBlock = allBlocks.find(b => 
                (playheadTime >= b.start && playheadTime < b.start + b.duration)
            );

            if (targetBlock) {
                const relativeStart = playheadTime - targetBlock.start;
                
                // Calculate and apply volume automation
                const blockBaseVolume = targetBlock.volume ?? 1.0;
                const envGain = getEnvelopeValue(targetBlock.envelope, relativeStart, 1.0);
                // HTML5 Audio volume is capped at 1.0
                audioElement.volume = clamp(blockBaseVolume * envGain, 0, 1.0);

                if (currentTtsBlock?.id !== targetBlock.id) {
                    currentTtsBlock = targetBlock;
                    audioElement.src = targetBlock.audioUrl!;
                    audioElement.playbackRate = targetBlock.playbackRate || 1.0;
                    audioElement.oncanplay = () => {
                        if (isPlaying) {
                            audioElement!.currentTime = relativeStart;
                            audioElement!.play().catch(() => {});
                        }
                        audioElement!.oncanplay = null;
                    };
                } else {
                    // Already on the right block, just ensure sync
                    if (audioElement.playbackRate !== (targetBlock.playbackRate || 1.0)) {
                        audioElement.playbackRate = targetBlock.playbackRate || 1.0;
                    }
                    if (Math.abs(audioElement.currentTime - relativeStart) > 0.1) {
                        audioElement.currentTime = relativeStart;
                    }
                    if (audioElement.paused) {
                        audioElement.play().catch(() => {});
                    }
                }
            } else {
                // In a gap
                if (!audioElement.paused) {
                    audioElement.pause();
                }
                currentTtsBlock = null;
            }
        }
    }

    function handleAudioUpdate() {
        // In the NLE engine, we drive playheadTime from the interval,
        // but we can use this to keep them perfectly locked if needed.
    }

    function handleAudioEnd() {
        // NLE doesn't care if a single file ends, it cares about the playhead.
    }

    // UI Dragging & State
    let isDragging = $state(false);
    let isResizing = $state(false);
    let isScrubbing = $state(false);
    let dragTargetId = $state<string | null>(null);
    let dragTrackId = $state<string | null>(null);
    let dragStartX = 0;
    let initialStart = 0;
    let initialDuration = 0;

    // Resizing details
    let resizeBlockId: string | null = null;
    let resizeStartPos = 0;
    let resizeStartDuration = 0;

    let editingBlockId = $state<string | null>(null);
    let editingSpeakerId = $state<string | null>(null);
    let activeSettingsTrackId = $state<string | null>(null);
    let activeSettingsBlockId = $state<string | null>(null);
    let scrollLeft = $state(0);

    function estimateBlockDuration(text: string): number {
        return estimateVisualDurationForScale(text, pixelsPerSecond);
    }

    function addBlock(trackId: string, e: MouseEvent | PointerEvent) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const startTime = (offsetX / pixelsPerSecond);
        
        if (pendingBlockType === 'audio' && currentTool === 'pen') {
            currentReplaceBlockId = null; // Ensure we are adding new
            audioInput.click();
            // We need to store where to put it
            // For now, addAudioBlocks uses a target track and start time
            // So we can just let audioInput handle it by setting a temporary state
            tempDropInfo = { trackId, startTime };
            return;
        }

        const defaultText = 'New Content Block';
        const newBlock: TimelineBlock = {
            id: createId('block'),
            start: startTime,
            duration: estimateBlockDuration(defaultText),
            text: defaultText,
            state: 'none',
            type: pendingBlockType,
            volume: 1.0,
            envelope: []
        };

        tracks = addBlockToTrack(tracks, trackId, newBlock);
        
        selectedBlockIds = [newBlock.id];
        pushHistory();
    }
    
    let tempDropInfo = $state<{trackId: string, startTime: number} | null>(null);

    function addTrack() {
        const newTrack: TimelineTrack = {
            id: createId('track'),
            speaker: `Speaker ${tracks.length + 1}`,
            blocks: [],
            prompt: '',
            voice: 'en-US',
            emotion: 0.5
        };
        tracks = addTrackToTimeline(tracks, newTrack);
        pushHistory();
    }

    function selectBlock(blockId: string, trackId: string, e: MouseEvent | PointerEvent) {
        e.stopPropagation();
        
        if (currentTool === 'razor') {
            splitBlockAtX(blockId, trackId, e.clientX);
            return;
        }

        selectedTrackId = trackId;
        if (e.shiftKey || e.ctrlKey || e.metaKey) {
            if (selectedBlockIds.includes(blockId)) {
                selectedBlockIds = selectedBlockIds.filter(id => id !== blockId);
            } else {
                selectedBlockIds = [...selectedBlockIds, blockId];
            }
        } else {
            selectedBlockIds = [blockId];
            activeSettingsBlockId = null; // Close settings when selecting a different block
        }
    }

    function editBlock(blockId: string, e: MouseEvent | PointerEvent) {
        e.stopPropagation();
        editingBlockId = blockId;
    }

    function editSpeaker(trackId: string, e: MouseEvent | PointerEvent) {
        e.stopPropagation();
        editingSpeakerId = trackId;
    }

    function updateSpeakerName(trackId: string, name: string, saveHistory = true) {
        tracks = updateSpeakerNameInTracks(tracks, trackId, name);
        if (saveHistory) pushHistory();
    }

    function updateSpeakerConfig(trackId: string, updates: Partial<TimelineTrack>) {
        tracks = updateSpeakerConfigInTracks(tracks, trackId, updates, estimateBlockDuration);
        pushHistory();
    }

    function deleteSelectedBlock() {
        if (selectedBlockIds.length === 0) return;
        tracks = deleteBlocksFromTracks(tracks, selectedBlockIds);
        selectedBlockIds = [];
        activeSettingsBlockId = null;
        pushHistory();
    }

    function updateBlock(blockId: string, updates: Partial<TimelineBlock>) {
        tracks = updateBlockInTracks(tracks, blockId, updates);
        pushHistory();
    }

    function updateBlockText(blockId: string, text: string, saveHistory = true) {
        tracks = updateBlockTextInTracks(tracks, blockId, text, estimateBlockDuration);
        if (saveHistory) pushHistory();
    }

    function handleScroll(e: Event) {
        const target = e.target as HTMLElement;
        scrollLeft = target.scrollLeft;
    }

    function focus(node: HTMLInputElement) {
        node.focus();
        node.select();
    }

    function startResizing(blockId: string, _: 'end', e: PointerEvent) {
        e.stopPropagation();
        e.preventDefault();
        isResizing = true;
        resizeBlockId = blockId;
        resizeStartPos = e.clientX;

        const targetBlock = findBlockById(tracks, blockId);
        if (targetBlock) {
            resizeStartDuration = targetBlock.duration;
        }

        window.addEventListener('pointermove', handleResizeMove);
        window.addEventListener('pointerup', stopResizing);
    }

    function handleResizeMove(e: PointerEvent) {
        if (!isResizing || !resizeBlockId) return;
        
        const deltaX = e.clientX - resizeStartPos;
        const deltaSeconds = deltaX / pixelsPerSecond;
        let newDuration = resizeStartDuration + deltaSeconds;

        // Find block to get sourceDuration limit
        const targetBlock = findBlockById(tracks, resizeBlockId);
        
        if (targetBlock) {
            // Min 0.1s, Max sourceDuration if it exists
            const maxDuration = targetBlock.sourceDuration || 9999;
            newDuration = Math.max(0.1, Math.min(newDuration, maxDuration));

            tracks = updateBlockDurationInTracks(tracks, resizeBlockId, newDuration);
        }
    }

    function stopResizing() {
        isResizing = false;
        resizeBlockId = null;
        window.removeEventListener('pointermove', handleResizeMove);
        window.removeEventListener('pointerup', stopResizing);
    }

    function startDragging(blockId: string, trackId: string, e: PointerEvent) {
        if (editingBlockId === blockId) return;
        e.stopPropagation();
        e.preventDefault(); // Prevent native drag
        
        if (!selectedBlockIds.includes(blockId)) {
            selectedBlockIds = [blockId];
            activeSettingsBlockId = null; 
        }

        isDragging = true;
        dragTargetId = blockId;
        dragTrackId = trackId;
        dragStartX = e.clientX;
        
        const block = findBlockById(tracks, blockId);
        if (block) {
            initialStart = block.start;
        }
    }

    function handleEnvelopePointerDown(blockId: string, trackId: string, e: PointerEvent) {
        e.stopPropagation();
        
        const blockRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const relativeX = e.clientX - blockRect.left;
        const relativeY = e.clientY - blockRect.top;
        
        const block = tracks.find(t => t.id === trackId)?.blocks.find(b => b.id === blockId);
        if (!block) return;
        
        const timeOffset = (relativeX / blockRect.width) * block.duration;
        const value = 1.5 - (relativeY / blockRect.height * 1.5); // Range 0-1.5
        
        let envelope = [...(block.envelope || [])];
        
        // Check if there is an existing point very close (simple hit test)
        const closePointIndex = envelope.findIndex(p => Math.abs(p.time - timeOffset) < 0.1);
        
        if (closePointIndex === -1) {
            // Add new point
            envelope.push({ time: timeOffset, value: clamp(value, 0, 1.5) });
            envelope.sort((a, b) => a.time - b.time);
            updateBlock(blockId, { envelope });
            
            // Start dragging the new point
            const newIndex = envelope.findIndex(p => p.time === timeOffset);
            startDraggingEnvelopePoint(blockId, trackId, newIndex, e);
        } else {
            startDraggingEnvelopePoint(blockId, trackId, closePointIndex, e);
        }
    }

    let cachedBlockRect: DOMRect | null = null;
    function startDraggingEnvelopePoint(blockId: string, trackId: string, index: number, e: PointerEvent) {
        e.stopPropagation();
        isDraggingEnvelope = true;
        envelopeTargetBlockId = blockId;
        envelopePointIndex = index;
        dragTrackId = trackId;
        
        // Cache the block rect for smoother dragging
        const target = (e.currentTarget as HTMLElement).parentElement; 
        if (target) {
            const blockEl = target.closest('.timeline-block');
            if (blockEl) {
                cachedBlockRect = blockEl.getBoundingClientRect();
            }
        }
    }

    function startScrubbing(e: PointerEvent) {
        e.preventDefault();
        isScrubbing = true;
        if (isPlaying) {
            audioElement?.pause();
        }
        updatePlayhead(e);
    }

    function updatePlayhead(e: PointerEvent) {
        const ruler = document.querySelector('.ruler-content');
        if (ruler) {
            const rect = ruler.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            playheadTime = Math.max(0, offsetX / pixelsPerSecond);
            
            // Sync audio immediately if we are playing or scrubbing
            syncAudioToPlayhead();
        }
    }

    function handleMouseMove(e: PointerEvent) {
        if (isScrubbing) {
            updatePlayhead(e);
            return;
        }

        if (isDraggingEnvelope && envelopeTargetBlockId && envelopePointIndex !== null && dragTrackId && cachedBlockRect) {
            const block = tracks.find(t => t.id === dragTrackId)?.blocks.find(b => b.id === envelopeTargetBlockId);
            if (!block) return;
            
            const relativeX = (e.clientX - cachedBlockRect.left);
            const relativeY = (e.clientY - cachedBlockRect.top);
            
            const newTime = clamp((relativeX / cachedBlockRect.width) * block.duration, 0, block.duration);
            const newValue = clamp(1.5 - (relativeY / cachedBlockRect.height * 1.5), 0, 1.5);

            const newEnvelope = [...(block.envelope || [])];
            newEnvelope[envelopePointIndex] = { time: newTime, value: newValue };

            tracks = updateBlockEnvelopeInTrack(tracks, dragTrackId, envelopeTargetBlockId, newEnvelope);
            return;
        }

        if (isMarqueeSelecting) {
            const tracksArea = document.querySelector('.tracks-area');
            if (!tracksArea) return;
            const rect = tracksArea.getBoundingClientRect();
            const currentX = e.clientX - rect.left + tracksArea.scrollLeft;
            const currentY = e.clientY - rect.top + tracksArea.scrollTop;
            
            marqueeRect = {
                x: Math.min(marqueeStartPos.x, currentX),
                y: Math.min(marqueeStartPos.y, currentY),
                w: Math.abs(marqueeStartPos.x - currentX),
                h: Math.abs(marqueeStartPos.y - currentY)
            };
            
            updateMarqueeSelection();
            return;
        }

        if (!dragTargetId || !dragTrackId) return;

        // Optimization: Use transform instead of left/width for dragging if possible
        // But for now, just ensure we don't do expensive calculations if not needed
        const deltaX = (e.clientX - dragStartX) / pixelsPerSecond;
        const currentTrack = tracks.find(t => t.id === dragTrackId);
        if (!currentTrack) return;

        // Collision logic
        const otherBlocks = currentTrack.blocks.filter(b => b.id !== dragTargetId);

        if (isDragging) {
            let newStart = Math.max(0, initialStart + deltaX);
            
            // Allow overlapping during drag for better UX, will resolve on MouseUp
            tracks = updateBlockStartInTracks(tracks, dragTargetId, newStart);
        } else if (isResizing) {
            let newDuration = Math.max(0.5, initialDuration + deltaX);
            const block = currentTrack.blocks.find(b => b.id === dragTargetId);
            if (block) {
                const end = block.start + newDuration;
                const collision = otherBlocks.some(b => 
                    (block.start < (b.start + b.duration)) && (end > b.start)
                );
                if (collision) return;
            }

            tracks = updateBlockDurationInTracks(tracks, dragTargetId, newDuration);
        }
    }

    function resolveDragCollision(trackId: string, blockId: string) {
        tracks = resolveDragCollisionInTrack(tracks, trackId, blockId);
    }

    function handleMouseUp() {
        if (isScrubbing && isPlaying) {
            // Resume the tick engine after scrubbing
            lastTickTime = performance.now();
            if (!playbackInterval) {
                playbackInterval = window.setInterval(updatePlaybackTick, 16);
            }
            syncAudioToPlayhead();
        }
        
        if (isDraggingEnvelope && envelopeTargetBlockId && dragTrackId) {
            // Final sort of points
            tracks = sortBlockEnvelopeInTrack(tracks, dragTrackId, envelopeTargetBlockId);
            pushHistory();
        }

        // Capture IDs before clearing them
        const targetId = dragTargetId;
        const trackId = dragTrackId;
        const wasDragging = isDragging;
        const wasResizing = isResizing;

        isDragging = false;
        isResizing = false;
        isScrubbing = false;
        isDraggingEnvelope = false;
        envelopeTargetBlockId = null;
        envelopePointIndex = null;
        dragTargetId = null;

        if (wasDragging && targetId && trackId) {
            resolveDragCollision(trackId, targetId);
            pushHistory();
        } else if (wasResizing) {
            pushHistory();
        }

        isMarqueeSelecting = false;
        marqueeRect = null;
    }

    function handleKeydown(e: KeyboardEvent) {
        // Prevent shortcuts if typing in an input or textarea
        if (
            e.target instanceof HTMLInputElement || 
            e.target instanceof HTMLTextAreaElement ||
            (e.target instanceof HTMLElement && e.target.isContentEditable)
        ) {
            return;
        }

        if (e.code === 'Space') {
            e.preventDefault();
            togglePlayback();
        }

        // Undo/Redo
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
            e.preventDefault();
            if (e.shiftKey) {
                redo();
            } else {
                undo();
            }
            return;
        }

        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
            e.preventDefault();
            redo();
            return;
        }

        // Tool Shortcuts
        if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
            if (e.key.toLowerCase() === 'v') currentTool = 'pointer';
            if (e.key.toLowerCase() === 'h') currentTool = 'hand';
            if (e.key.toLowerCase() === 'c') currentTool = 'razor';
            if (e.key.toLowerCase() === 'p') currentTool = 'pen';
        }

        if (e.ctrlKey && e.key.toLowerCase() === 'a') {
            e.preventDefault();
            selectedBlockIds = collectAllBlockIds(tracks);
            return;
        }

        if (e.key.toLowerCase() === 'a' && !e.ctrlKey) {
            e.preventDefault();
            audioInput?.click();
            return;
        }

        if (mode === 'TTS' && e.key.toLowerCase() === 'r' && selectedBlockIds.length > 0) {
            e.preventDefault();
            renderSelected();
        }
        if (e.key.toLowerCase() === 's' && selectedBlockIds.length === 1) {
            e.preventDefault();
            const selectedId = selectedBlockIds[0];
            activeSettingsBlockId = activeSettingsBlockId === selectedId ? null : selectedId;
        }
        if ((e.key === 'Delete' || e.key === 'Backspace') && selectedBlockIds.length > 0) {
            e.preventDefault();
            deleteSelectedBlock();
        }
    }

    let isPanning = false;
    let panStartPos = { x: 0, y: 0 };
    let panStartScroll = { left: 0, top: 0 };

    function handleTracksAreaMouseDown(e: PointerEvent) {
        if (currentTool === 'hand') {
            isPanning = true;
            panStartPos = { x: e.clientX, y: e.clientY };
            const tracksArea = document.querySelector('.tracks-area');
            if (tracksArea) {
                panStartScroll = { left: tracksArea.scrollLeft, top: tracksArea.scrollTop };
            }
            window.addEventListener('pointermove', handlePanMove);
            window.addEventListener('pointerup', stopPanning);
            return;
        }

        if (currentTool === 'pen') {
            // Find track and time
            const tracksArea = document.querySelector('.tracks-area');
            if (tracksArea) {
                const rect = tracksArea.getBoundingClientRect();
                const offsetY = e.clientY - rect.top + tracksArea.scrollTop;
                const trackIndex = Math.floor(offsetY / 50);
                const targetTrack = tracks[trackIndex];
                if (targetTrack) {
                    addBlock(targetTrack.id, e);
                }
            }
            return;
        }

        // Only start marquee if clicking on the background (not a block)
        if (!(e.target as HTMLElement).classList.contains('track-lane') && 
            !(e.target as HTMLElement).classList.contains('tracks-area')) return;
        
        isMarqueeSelecting = true;
        const tracksArea = document.querySelector('.tracks-area');
        if (!tracksArea) return;
        const rect = tracksArea.getBoundingClientRect();
        
        marqueeStartPos = { 
            x: e.clientX - rect.left + tracksArea.scrollLeft, 
            y: e.clientY - rect.top + tracksArea.scrollTop 
        };
        marqueeRect = { x: marqueeStartPos.x, y: marqueeStartPos.y, w: 0, h: 0 };
        
        if (!e.shiftKey && !e.ctrlKey && !e.metaKey) {
            selectedBlockIds = [];
        }
    }

    function handlePanMove(e: PointerEvent) {
        if (!isPanning) return;
        const dx = e.clientX - panStartPos.x;
        const dy = e.clientY - panStartPos.y;
        const tracksArea = document.querySelector('.tracks-area');
        if (tracksArea) {
            tracksArea.scrollLeft = panStartScroll.left - dx;
            tracksArea.scrollTop = panStartScroll.top - dy;
        }
    }

    function stopPanning() {
        isPanning = false;
        window.removeEventListener('pointermove', handlePanMove);
        window.removeEventListener('pointerup', stopPanning);
    }

    function updateMarqueeSelection() {
        if (!marqueeRect) return;
        
        const rect = marqueeRect;
        const newSelectedIds: string[] = [];
        
        tracks.forEach((track, index) => {
            const trackTop = index * 50; // track height
            const trackBottom = trackTop + 50;
            
            // Check vertical overlap
            if (rect.y < trackBottom && rect.y + rect.h > trackTop) {
                track.blocks.forEach(block => {
                    const blockLeft = block.start * pixelsPerSecond;
                    const blockRight = blockLeft + (block.duration * pixelsPerSecond);
                    
                    // Check horizontal overlap
                    if (rect.x < blockRight && rect.x + rect.w > blockLeft) {
                        newSelectedIds.push(block.id);
                    }
                });
            }
        });
        
        selectedBlockIds = newSelectedIds;
    }

    function handleDragOver(e: DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = 'copy';
        }
    }

    function handleDragEnter(e: DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        isDraggingOverTimeline = true;
    }

    function handleDragLeave(e: DragEvent) {
        e.preventDefault();
        // Only set false if we're leaving the tracks area specifically
        if ((e.target as HTMLElement).classList.contains('tracks-area')) {
            isDraggingOverTimeline = false;
        }
    }

    async function addAudioBlocks(files: File[], startTime: number, trackIdOrIndex: string | number) {
        const audioFiles = files.filter(f => f.type.startsWith('audio/'));
        if (audioFiles.length === 0) return;

        let trackIndex = typeof trackIdOrIndex === 'number' 
            ? trackIdOrIndex 
            : tracks.findIndex(t => t.id === trackIdOrIndex);
        
        if (trackIndex === -1) trackIndex = 0;
        const targetTrack = tracks[trackIndex];
        if (!targetTrack) return;

        let currentStartTime = startTime;

        for (const file of audioFiles) {
            const duration = await getAudioDuration(file);
            const audioUrl = URL.createObjectURL(file);
            
            const newBlock: TimelineBlock = {
                id: createId('block'),
                start: currentStartTime,
                duration: duration,
                text: file.name,
                state: 'rendered',
                audioUrl: audioUrl,
                type: 'audio',
                fileName: file.name,
                playbackRate: 1.0,
                sourceDuration: duration
            };

            tracks = addBlockToTrack(tracks, targetTrack.id, newBlock);
            
            // If dropping multiple, place them sequentially? Or stack them?
            // Usually sequential is safer if dropped on a single point.
            currentStartTime += duration + 0.5; // add a small gap
        }
        pushHistory();
    }

    async function handleFileDrop(e: DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        isDraggingOverTimeline = false;

        const files = Array.from(e.dataTransfer?.files || []);
        const tracksArea = document.querySelector('.tracks-area');
        if (!tracksArea) return;
        const rect = tracksArea.getBoundingClientRect();
        const offsetX = e.clientX - rect.left + tracksArea.scrollLeft;
        const offsetY = e.clientY - rect.top + tracksArea.scrollTop;
        
        const trackIndex = Math.floor(offsetY / 50);
        const startTime = offsetX / pixelsPerSecond;

        await addAudioBlocks(files, startTime, trackIndex);
    }

    function handleFileSelect(e: Event) {
        const target = e.target as HTMLInputElement;
        const files = Array.from(target.files || []);
        if (files.length > 0) {
            if (currentReplaceBlockId) {
                replaceAudioForBlock(currentReplaceBlockId, files[0]);
                currentReplaceBlockId = null;
            } else if (tempDropInfo) {
                addAudioBlocks(files, tempDropInfo.startTime, tempDropInfo.trackId);
                tempDropInfo = null;
            } else {
                // Use playhead time and selected track if uploaded via 'A' shortcut
                addAudioBlocks(files, playheadTime, selectedTrackId);
            }
        }
        // Clear input to allow re-selecting same file
        target.value = '';
    }

    async function replaceAudioForBlock(blockId: string, file: File) {
        if (!file.type.startsWith('audio/')) return;
        const duration = await getAudioDuration(file);
        const audioUrl = URL.createObjectURL(file);

        tracks = updateBlockInTracks(tracks, blockId, {
            audioUrl,
            duration: duration,
            sourceDuration: duration,
            fileName: file.name,
            state: 'rendered'
        });
        pushHistory();
    }

    function splitBlockAtX(blockId: string, trackId: string, clientX: number) {
        const tracksArea = document.querySelector('.tracks-area');
        if (!tracksArea) return;
        const rect = tracksArea.getBoundingClientRect();
        const offsetX = clientX - rect.left + tracksArea.scrollLeft;
        const splitTime = offsetX / pixelsPerSecond;

        tracks = splitBlockAtTime(tracks, trackId, blockId, splitTime, () => createId('block'));
        pushHistory();
    }

    async function renderSelected() {
        if (selectedBlockIds.length === 0) return;

        // For now, render the first selected block. 
        // In a full implementation, we would loop through all or queue them.
        const selectedId = selectedBlockIds[0];

        const selected = findBlockWithTrack(tracks, selectedId);
        if (!selected) return;

        const { block: targetBlock, track: targetTrack } = selected;

        try {
            // Pass complete context: speaker config + block-specific text/params
            const renderContext = {
                block: { ...targetBlock },
                speaker: {
                    id: targetTrack.id,
                    name: targetTrack.speaker,
                    prompt: targetTrack.prompt,
                    voice: targetTrack.voice,
                    emotion: targetTrack.emotion
                }
            };

            const audioUrl = await onRender(renderContext);

            const duration = await probeAudioDurationFromUrl(audioUrl, 2.0, 5000);

            tracks = updateBlockInTracks(tracks, selectedId, { state: 'rendered', audioUrl, duration });
            pushHistory();
        } catch (error) {
            console.error("Render failed:", error);
            tracks = updateBlockInTracks(tracks, selectedId, { state: 'failed' });
        }
    }

    async function toggleFullScreen() {
        const container = document.querySelector('.timeline-container');
        if (!container) return;

        if (!document.fullscreenElement) {
            try {
                await container.requestFullscreen();
                // If it's a mobile device, try to lock orientation to landscape
                if (window.screen.orientation && 'lock' in window.screen.orientation) {
                    await (window.screen.orientation as unknown as { lock: (s: string) => Promise<void> }).lock('landscape').catch((e: Error) => {
                        console.warn("Orientation lock failed:", e);
                    });
                }
            } catch (err) {
                const error = err as Error;
                console.error(`Error: ${error.message}`);
                isFullScreen = !isFullScreen;
            }
        } else {
            if (window.screen.orientation && 'unlock' in window.screen.orientation) {
                window.screen.orientation.unlock();
            }
            document.exitFullscreen();
        }
    }

    onMount(() => {
        const fsHandler = () => {
            isFullScreen = !!document.fullscreenElement;
        };
        document.addEventListener('fullscreenchange', fsHandler);
        pushHistory(); // Capture initial state
        window.addEventListener('keydown', handleKeydown);
        window.addEventListener('pointermove', handleMouseMove);
        window.addEventListener('pointerup', handleMouseUp);
        return () => {
            document.removeEventListener('fullscreenchange', fsHandler);
            window.removeEventListener('keydown', handleKeydown);
            window.removeEventListener('pointermove', handleMouseMove);
            window.removeEventListener('pointerup', handleMouseUp);
        };
    });
</script>

<div class="timeline-container" 
    class:is-fullscreen={isFullScreen}
    class:tool-pointer={currentTool === 'pointer'}
    class:tool-hand={currentTool === 'hand'}
    class:tool-razor={currentTool === 'razor'}
    class:tool-pen={currentTool === 'pen'}
>
    <audio 
        bind:this={audioElement} 
        ontimeupdate={handleAudioUpdate}
        onended={handleAudioEnd}
        onpause={() => isPlaying = false}
        onplay={() => isPlaying = true}
    ></audio>

    <div class="timeline-header">
        <div class="sidebar-header">
            <span class="header-label">{m.tracks()}</span>
        </div>
        <div class="controls-area">
            <div class="play-btn-wrapper">
                <button 
                    class="icon-btn play-btn" 
                    onclick={togglePlayback} 
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                    {#if isPlaying}
                        <Pause size={16} color="currentColor" />
                    {:else}
                        <Play size={16} color="currentColor" />
                    {/if}
                </button>
            </div>
            
            <div class="mode-info desktop-only">
                Mode: <span class="mode-tag">{mode}</span>
            </div>

            <div class="header-tools-group">
                <div class="history-controls-container">
                    <button class="icon-btn" onclick={undo} title="Undo" disabled={historyIndex <= 0}>
                        <UndoIcon size={16} />
                    </button>
                    <button class="icon-btn" onclick={redo} title="Redo" disabled={historyIndex >= history.length - 1}>
                        <RedoIcon size={16} />
                    </button>
                </div>

                <div class="tool-switcher-container">
                    <StateSwitch 
                        class="timeline-tool-switch"
                        options={[
                            { id: 'pointer', label: 'P', icon: CursorIcon },
                            { id: 'hand', label: 'H', icon: HandIcon },
                            { id: 'razor', label: 'R', icon: RazorIcon },
                            { id: 'pen', label: '✎', icon: PenIcon }
                        ]}
                        bind:activeId={currentTool}
                    />
                </div>

                {#if currentTool === 'pen'}
                    <div class="type-switcher-container">
                        <StateSwitch 
                            class="timeline-type-switch"
                            options={[
                                { id: 'tts', label: 'TTS', icon: TtsIcon },
                                { id: 'audio', label: 'Audio', icon: AudioIcon }
                            ]}
                            bind:activeId={pendingBlockType}
                        />
                    </div>
                {/if}
            </div>

            <div class="header-actions-right">
                <button 
                    class="icon-btn expand-btn portrait-only" 
                    onclick={() => isMobileMenuOpen = !isMobileMenuOpen}
                    class:active={isMobileMenuOpen}
                >
                    <Settings size={18} />
                </button>

                <button 
                    class="render-top-btn" 
                    onclick={renderSelected}
                    disabled={selectedBlockIds.length === 0}
                >
                    <span class="desktop-only">{m.render_shortcut()}</span>
                    <span class="phone-only">RD</span>
                </button>

                <button 
                    class="icon-btn fullscreen-btn" 
                    onclick={toggleFullScreen}
                    title={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                >
                    {#if isFullScreen}
                        <ExitFullScreenIcon size={16} />
                    {:else}
                        <FullScreenIcon size={16} />
                    {/if}
                </button>
            </div>
        </div>
    </div>

    {#if isMobileMenuOpen}
        <div class="mobile-toolbar portrait-only" transition:fade={{ duration: 100 }}>
            <div class="mobile-tool-row">
                <StateSwitch 
                    options={[
                        { id: 'pointer', label: 'P', icon: CursorIcon },
                        { id: 'hand', label: 'H', icon: HandIcon },
                        { id: 'razor', label: 'R', icon: RazorIcon },
                        { id: 'pen', label: '✎', icon: PenIcon }
                    ]}
                    bind:activeId={currentTool}
                />
            </div>
            {#if currentTool === 'pen'}
                <div class="mobile-tool-row">
                    <StateSwitch 
                        options={[
                            { id: 'tts', label: 'TTS' },
                            { id: 'audio', label: 'Audio' }
                        ]}
                        bind:activeId={pendingBlockType}
                    />
                </div>
            {/if}

            <div class="mobile-action-row">
                <div class="history-controls">
                    <button class="icon-btn" onclick={undo} disabled={historyIndex <= 0}>
                        <UndoIcon size={16} />
                    </button>
                    <button class="icon-btn" onclick={redo} disabled={historyIndex >= history.length - 1}>
                        <RedoIcon size={16} />
                    </button>
                </div>
            </div>
        </div>
    {/if}

    <div class="time-ruler">
        <div class="sidebar-spacer"></div>
        <div class="ruler-viewport">
            <div 
                class="ruler-content" 
                style="width: {timelineWidth}px; transform: translateX(-{scrollLeft}px); touch-action: none;"
                onpointerdown={startScrubbing}
            >
                {#each Array(Math.floor(timelineWidth / (pixelsPerSecond * 10))) as _, i (i)}
                    <div class="tick" style="left: {i * 10 * pixelsPerSecond}px">
                        <span class="tick-label">{formatTime(i * 10)}</span>
                    </div>
                {/each}
            </div>
        </div>
    </div>

    <div class="timeline-body">
        <div class="tracks-sidebar">
            {#each tracks as track (track.id)}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div 
                    class="track-sidebar-cell" 
                    class:selected={selectedTrackId === track.id}
                    onclick={() => selectedTrackId = track.id}
                >
                    <div class="speaker-info">
                        {#if editingSpeakerId === track.id}
                            <input 
                                type="text"
                                class="edit-input speaker-edit"
                                value={track.speaker}
                                oninput={(e) => updateSpeakerName(track.id, (e.target as HTMLInputElement).value, false)}
                                onblur={() => { editingSpeakerId = null; pushHistory(); }}
                                onkeydown={(e) => e.key === 'Enter' && (editingSpeakerId = null)}
                                use:focus
                            />
                        {:else}
                            <span 
                                class="speaker-name" 
                                ondblclick={(e) => editSpeaker(track.id, e)}
                                role="presentation"
                            >
                                {track.speaker}
                            </span>
                        {/if}
                    </div>
                    
                    {#if mode === 'TTS'}
                        <div class="track-actions">
                            <button 
                                class="settings-btn" 
                                title="Speaker Settings"
                                onclick={() => activeSettingsTrackId = activeSettingsTrackId === track.id ? null : track.id}
                            >
                                <Settings size={14} />
                            </button>

                            {#if activeSettingsTrackId === track.id}
                                <SpeakerSettings 
                                    prompt={track.prompt}
                                    voice={track.voice}
                                    emotion={track.emotion}
                                    onchange={(updates: Partial<TimelineTrack>) => updateSpeakerConfig(track.id, updates)}
                                />
                            {/if}
                        </div>
                    {/if}
                </div>
            {/each}

            {#if mode === 'TTS'}
                <div class="add-track-row">
                    <button class="add-track-btn" onclick={addTrack} title="Add Speaker">
                        <Plus size={16} />
                    </button>
                </div>
            {/if}
        </div>
        
        <div 
            class="tracks-area" 
            class:drag-over={isDraggingOverTimeline}
            class:tool-hand={currentTool === 'hand'}
            class:tool-pen={currentTool === 'pen'}
            class:tool-razor={currentTool === 'razor'}
            style="touch-action: none;"
            onscroll={handleScroll}
            onpointerdown={handleTracksAreaMouseDown}
            ondragenter={handleDragEnter}
            ondragleave={handleDragLeave}
            ondragover={handleDragOver}
            ondrop={handleFileDrop}
            role="presentation"
        >
            {#if isDraggingOverTimeline}
                <div class="drop-indicator-overlay">
                    <div class="drop-msg">{m.drop_audio_to_add()}</div>
                </div>
            {/if}

            {#if marqueeRect}
                <div class="marquee-overlay" style="
                    left: {marqueeRect.x}px; 
                    top: {marqueeRect.y}px; 
                    width: {marqueeRect.w}px; 
                    height: {marqueeRect.h}px;
                "></div>
            {/if}

            {#each tracks as track (track.id)}
                <div 
                    class="track-lane" 
                    class:selected={selectedTrackId === track.id}
                    onclick={() => selectedTrackId = track.id}
                    ondblclick={(e) => addBlock(track.id, e)}
                    onkeydown={null}
                    role="presentation"
                >
                    {#each track.blocks as block (block.id)}
                        <!-- svelte-ignore a11y_click_events_have_key_events -->
                        <div 
                            class="timeline-block state-{block.state}"
                            class:selected={selectedBlockIds.includes(block.id)}
                            class:editing={editingBlockId === block.id}
                            class:dragging={dragTargetId === block.id}
                            class:is-tts={mode === 'TTS'}
                            class:is-audio={block.type === 'audio'}
                            class:is-rendered={block.state === 'rendered'}
                            class:tool-razor={currentTool === 'razor'}
                            style="left: {block.start * pixelsPerSecond}px; width: {block.duration * pixelsPerSecond}px; touch-action: none;"
                            onclick={(e) => selectBlock(block.id, track.id, e)}
                            ondblclick={(e) => editBlock(block.id, e)}
                            onpointerdown={(e) => {
                                if (currentTool === 'pointer') {
                                    startDragging(block.id, track.id, e);
                                } else if (currentTool === 'pen') {
                                    handleEnvelopePointerDown(block.id, track.id, e);
                                }
                            }}
                            ondragstart={(e) => e.preventDefault()}
                            oncontextmenu={(e) => {
                                e.preventDefault();
                                activeSettingsBlockId = activeSettingsBlockId === block.id ? null : block.id;
                            }}
                            role="button"
                            tabindex="0"
                        >
                            {#if block.audioUrl}
                                <div class="block-waveform">
                                    <Waveform 
                                        src={block.audioUrl} 
                                        color={block.type === 'audio' ? '#ff9800' : '#4caf50'} 
                                    />
                                </div>
                            {/if}

                            <!-- Envelope SVG Layer -->
                            {#if currentTool === 'pen'}
                                <svg class="envelope-overlay" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    {#if !block.envelope || block.envelope.length === 0}
                                        <line 
                                            x1="0" y1="{100 - ((block.volume || 1.0) / 1.5 * 100)}" 
                                            x2="100" y2="{100 - ((block.volume || 1.0) / 1.5 * 100)}" 
                                            stroke="rgba(0, 123, 255, 0.5)" 
                                            stroke-width="1.5"
                                            stroke-dasharray="4 2"
                                            vector-effect="non-scaling-stroke"
                                        />
                                    {:else}
                                        {@const sortedEnv = [...block.envelope].sort((a,b) => a.time - b.time)}
                                        <polyline 
                                            points="
                                                0,{100 - (sortedEnv[0].value / 1.5 * 100)} 
                                                {sortedEnv.map(p => `${(p.time / block.duration) * 100},${100 - (p.value / 1.5 * 100)}`).join(' ')} 
                                                100,{100 - (sortedEnv[sortedEnv.length - 1].value / 1.5 * 100)}
                                            " 
                                            fill="none" 
                                            stroke="#007bff" 
                                            stroke-width="2.5"
                                            stroke-linejoin="round"
                                            stroke-linecap="round"
                                            vector-effect="non-scaling-stroke"
                                        />
                                    {/if}
                                </svg>
                                
                                <!-- Use SVG group for better relative local coords during drag -->
                                <div class="envelope-handles-layer">
                                    {#each block.envelope || [] as point, i (i)}
                                        <div 
                                            class="envelope-handle"
                                            class:active={isDraggingEnvelope && envelopePointIndex === i && envelopeTargetBlockId === block.id}
                                            style="left: {(point.time / block.duration) * 100}%; top: {100 - (point.value / 1.5 * 100)}%;"
                                            onpointerdown={(e) => {
                                                e.stopPropagation();
                                                startDraggingEnvelopePoint(block.id, track.id, i, e);
                                            }}
                                        ></div>
                                    {/each}
                                </div>
                            {/if}
                            
                            <div class="block-info">
                                <div class="block-header">
                                    {#if block.state === 'rendered'}
                                        <span class="status-icon"><CircleCheck size={10} color="currentColor" /></span>
                                        <span class="block-duration">{block.duration.toFixed(1)}s</span>
                                    {:else if block.state === 'failed'}
                                        <span class="status-icon"><CircleAlert size={10} color="currentColor" /></span>
                                    {:else}
                                        <span class="status-icon"><Loader size={10} class="animate-spin" color="currentColor" /></span>
                                    {/if}
                                </div>

                                {#if editingBlockId === block.id}
                                    <input 
                                        type="text"
                                        class="edit-input"
                                        value={block.text}
                                        oninput={(e) => updateBlockText(block.id, (e.target as HTMLInputElement).value, false)}
                                        onblur={() => { editingBlockId = null; pushHistory(); }}
                                        onkeydown={(e) => e.key === 'Enter' && (editingBlockId = null)}
                                        use:focus
                                    />
                                {/if}
                                <span class="block-text" style="display: {editingBlockId === block.id ? 'none' : 'block'}">
                                    {block.type === 'audio' ? block.fileName : block.text}
                                </span>
                            </div>

                            {#if currentTool === 'pointer'}
                                <div 
                                    class="resize-handle end" 
                                    onpointerdown={(e) => startResizing(block.id, 'end', e)}
                                    role="presentation"
                                ></div>
                            {/if}

                            {#if activeSettingsBlockId === block.id}
                                <div class="popover-anchor">
                                    <BlockSettings 
                                        text={block.text} 
                                        {mode} 
                                        type={block.type}
                                        fileName={block.fileName}
                                        playbackRate={block.playbackRate || 1.0}
                                        onchange={(updates: Partial<TimelineBlock>) => {
                                            updateBlock(block.id, updates);
                                        }}
                                        onreplace={() => {
                                            currentReplaceBlockId = block.id;
                                            audioInput.click();
                                        }}
                                    />
                                </div>
                            {/if}
                        </div>
                    {/each}
                </div>
            {/each}
            
            <!-- Playhead -->
            <div class="playhead" style="left: {playheadTime * pixelsPerSecond}px">
                <div class="playhead-cap"></div>
            </div>
        </div>
    </div>

    <input 
        type="file" 
        bind:this={audioInput} 
        onchange={handleFileSelect} 
        accept="audio/*" 
        multiple 
        style="display: none;" 
    />
</div>

<style>
    .timeline-container {
        display: flex;
        flex-direction: column;
        border: 1px solid var(--border-color);
        background: var(--bg-color);
        font-family: var(--font-sans);
        --track-height: 50px;
        --sidebar-width: 150px;
        --header-height: 36px;
        overflow: visible; /* CRITICAL: Allow child components to float outside */
    }

    .timeline-container.is-fullscreen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw !important;
        height: 100vh !important;
        z-index: 9999;
        margin: 0;
        border: none;
        background: var(--bg-color);
    }

    /* Landscape Mode for handheld devices */
    @media (max-width: 900px) and (orientation: portrait) {
        .timeline-container.is-fullscreen {
            width: 100vh !important;
            height: 100vw !important;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(90deg);
            transform-origin: center;
        }
    }

    .timeline-container.is-fullscreen .timeline-body {
        flex: 1;
    }

    /* Header Styles */
    .timeline-header {
        display: grid;
        grid-template-columns: var(--sidebar-width) 1fr;
        height: var(--header-height);
        background: var(--bg-color);
        border-bottom: 1px solid var(--border-color);
    }

    .sidebar-header {
        border-right: 1px solid var(--border-color);
        display: flex;
        align-items: center;
        padding: 0 0.75rem;
    }

    .header-label {
        font-weight: 800;
        text-transform: uppercase;
        font-size: 10px;
        letter-spacing: 0.1em;
        opacity: 0.8;
    }

    .controls-area {
        display: flex;
        align-items: center;
        padding: 0 0.5rem;
        gap: 0.5rem;
        position: relative;
        overflow-x: auto;
        scrollbar-width: none;
    }

    .controls-area::-webkit-scrollbar {
        display: none;
    }

    /* Toolbelt styles */
    .header-tools-group {
        display: flex;
        align-items: center;
        gap: 0;
        flex-shrink: 0;
        border: 1px solid #000;
        height: 30px;
        overflow: hidden;
        background: var(--bg-color);
    }

    :global([data-theme='dark']) .header-tools-group {
        border-color: #fff;
    }

    .history-controls-container {
        display: flex;
        align-items: center;
        border-right: 1px solid #000;
        height: 100%;
        padding: 0 4px;
    }

    :global([data-theme='dark']) .history-controls-container {
        border-right-color: #fff;
    }

    .history-controls-container .icon-btn {
        width: 28px;
        height: 28px;
        border: none;
    }

    .history-controls-container .icon-btn:hover:not(:disabled) {
        background: rgba(0,0,0,0.05);
    }

    :global([data-theme='dark']) .history-controls-container .icon-btn:hover:not(:disabled) {
        background: rgba(255,255,255,0.1);
    }

    .tool-switcher-container {
        display: flex;
        align-items: center;
        height: 100%;
    }

    .type-switcher-container {
        display: flex;
        align-items: center;
        height: 100%;
        border-left: 1px solid #000;
    }

    :global([data-theme='dark']) .type-switcher-container {
        border-left-color: #fff;
    }

    .header-actions-right {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-left: auto;
        flex-shrink: 0;
    }

    .play-btn {
        background: #000;
        color: #fff;
        border: 1px solid #000;
        width: 32px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        flex-shrink: 0;
        transition: none;
    }

    :global([data-theme='dark']) .play-btn {
        background: #fff;
        color: #000;
        border-color: #fff;
    }

    .play-btn:active {
        transform: scale(0.95);
    }

    .mode-info {
        font-size: 0.8rem;
        opacity: 0.8;
    }

    .mode-tag {
        font-weight: bold;
        color: var(--primary-color, #007bff);
    }

    :global(.timeline-tool-switch) {
        margin: 0 !important;
        border: none !important; /* Managed by group container */
        width: auto !important;
    }

    :global(.timeline-tool-switch .state-item) {
        padding: 0 !important;
        width: 32px !important;
        height: 28px !important;
        font-size: 0.7rem !important;
        border: none !important;
        border-right: 1px solid #000 !important;
        border-radius: 0 !important;
        background: #fff !important;
        color: #000 !important;
    }

    :global([data-theme='dark'] .timeline-tool-switch .state-item) {
        background: #000 !important;
        color: #fff !important;
        border-right-color: #fff !important;
    }

    /* Pen Type Switcher Styles */
    :global(.timeline-type-switch) {
        border: none !important; /* Managed by group container */
        border-left: 1px solid #000 !important; /* Separator from tools */
        width: auto !important;
        background: #fff !important;
    }

    :global([data-theme='dark'] .timeline-type-switch) {
        border-left-color: #fff !important;
        background: #000 !important;
    }

    :global(.timeline-type-switch .state-item) {
        width: 48px !important;
        height: 28px !important;
        padding: 0 !important;
        font-size: 8px !important;
        font-weight: 900 !important;
        text-transform: uppercase !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        align-items: center !important;
        gap: 0 !important;
        line-height: 1 !important;
        border: none !important;
        border-right: 1px solid #000 !important;
    }
    
    :global(.timeline-type-switch .state-item:last-child) {
        border-right: none !important;
    }

    :global([data-theme='dark'] .timeline-type-switch .state-item) {
        border-right-color: #fff !important;
    }

    @media (max-width: 768px) {
        :global(.timeline-type-switch .state-item) {
            width: 40px !important;
        }
    }

    :global(.timeline-tool-switch .state-item:last-child) {
        border-right: none !important;
    }

    :global(.timeline-tool-switch .state-item.active),
    :global(.timeline-type-switch .state-item.active) {
        background: #000 !important;
        color: #fff !important;
        box-shadow: none !important;
    }

    :global([data-theme='dark'] .timeline-tool-switch .state-item.active),
    :global([data-theme='dark'] .timeline-type-switch .state-item.active) {
        background: #fff !important;
        color: #000 !important;
    }

    /* History Controls */
    .history-controls {
        display: flex;
        gap: 0;
        background: #fff;
        border: 1px solid #000;
        height: 30px;
        overflow: hidden;
    }

    :global([data-theme='dark']) .history-controls {
        background: #000;
        border-color: #fff;
    }

    .icon-btn {
        background: transparent;
        color: inherit;
        border: none;
        width: 32px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-right: 1px solid #000;
    }

    .icon-btn:last-child {
        border-right: none;
    }

    .icon-btn:disabled {
        opacity: 0.2;
        cursor: not-allowed;
    }

    .icon-btn:active:not(:disabled) {
        background: #000;
        color: #fff;
    }

    :global(.timeline-type-switch) {
        margin-left: 0.5rem !important;
        border: 1px solid #000 !important;
        width: auto !important;
    }

    :global(.timeline-type-switch .state-item) {
        width: 50px !important;
        min-width: 0 !important;
        padding: 0 4px !important;
        font-weight: 800 !important;
        text-transform: uppercase !important;
        font-size: 9px !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 1px !important;
        height: 28px !important;
    }

    /* Touch specific visibility */
    .touch-only {
        display: none;
    }

    .phone-only {
        display: none;
    }

    @media (pointer: coarse) {
        .touch-only {
            display: flex;
        }
    }

    .fullscreen-btn {
        margin-left: 4px; /* Ensure spacing from Expand button */
        border: 1px solid var(--border-color);
        background: var(--bg-color);
    }

    .expand-btn {
        margin-left: auto;
        border: 1px solid var(--border-color);
        background: var(--bg-color);
    }

    .expand-btn.active {
        background: #000;
        color: #fff;
    }

    /* Mobile Toolbar Tray */
    .mobile-toolbar {
        background: #fff;
        border-bottom: 2px solid #000;
        padding: 8px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        z-index: 100;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    :global([data-theme='dark']) .mobile-toolbar {
        background: #1a1a1a;
        border-bottom-color: #fff;
    }

    .mobile-tool-row {
        display: flex;
        gap: 4px;
    }

    .mobile-action-row {
        display: flex;
        align-items: center;
        gap: 8px;
        justify-content: space-between;
    }

    .mobile-render-btn {
        background: #000;
        color: #fff;
        border: none;
        padding: 0 12px;
        height: 28px;
        font-weight: 900;
        font-size: 10px;
        flex-shrink: 0;
    }

    :global([data-theme='dark']) .mobile-render-btn {
        background: #fff;
        color: #000;
    }

    /* Desktop/Phone visibility helpers */
    .desktop-only {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .touch-only {
        display: none;
    }

    .phone-only {
        display: none;
    }

    .portrait-only {
        display: none;
    }

    @media (max-width: 768px) {
        .desktop-only {
            display: none !important;
        }
        .phone-only {
            display: flex;
        }
        .sidebar-header {
            width: 80px !important;
        }
        .sidebar-spacer {
            width: 80px !important;
        }
        .tracks-sidebar {
            width: 80px !important;
        }
        .timeline-header {
            grid-template-columns: 80px 1fr !important;
        }

        /* Portrait Specific: Hide tools in header, show expand button */
        @media (orientation: portrait) {
            .header-tools-group {
                display: none;
            }
            .portrait-only {
                display: flex;
            }
            .history-controls {
                display: none; /* Hide in header to save space in portrait */
            }
        }

        /* Landscape Specific: Show flat tools in header */
        @media (orientation: landscape) {
            .header-tools-group {
                display: flex;
            }
            .portrait-only {
                display: none !important;
            }
        }
    }

    @media (pointer: coarse) {
        .touch-only {
            display: flex;
        }
    }

    .render-top-btn {
        margin-left: 4px;
        padding: 0 10px;
        height: 30px;
        background: #000;
        color: #fff;
        border: 1px solid #000;
        font-size: 11px;
        font-weight: 800;
        text-transform: uppercase;
        cursor: pointer;
        transition: none;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    :global([data-theme='dark']) .render-top-btn {
        background: #fff;
        color: #000;
        border-color: #fff;
    }

    .render-top-btn:hover:not(:disabled) {
        background: var(--border-color);
    }

    .render-top-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }

    /* Ruler Styles */
    .time-ruler {
        display: flex;
        background: #1a1a1a;
        color: white;
        height: 24px;
        font-size: 0.65rem;
        border-bottom: 1px solid var(--border-color);
    }

    .sidebar-spacer {
        width: var(--sidebar-width);
        flex-shrink: 0;
        border-right: 1px solid var(--border-color);
        background: var(--bg-color);
    }

    .ruler-viewport {
        flex: 1;
        overflow-x: auto;
        scrollbar-width: none;
    }

    .ruler-content {
        position: relative;
        height: 100%;
    }

    .tick {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 1px;
        background: rgba(255, 255, 255, 0.4); /* Brighter ticks */
    }

    .tick-label {
        position: absolute;
        top: 4px;
        left: 4px;
        text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        white-space: nowrap;
    }

    /* Body Styles */
    .timeline-body {
        display: flex;
        flex: 1;
        overflow: visible; /* CRITICAL: allow popovers to escape */
        min-height: 400px; /* Ensure space for popovers */
    }

    .tracks-sidebar {
        width: var(--sidebar-width);
        border-right: 1px solid var(--border-color);
        background: var(--bg-color);
        display: flex;
        flex-direction: column;
        position: relative;
        z-index: 100; /* Ensure sidebar is above tracks-area */
    }

    .track-sidebar-cell {
        height: var(--track-height);
        border-bottom: 1px solid var(--border-color);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 0.5rem;
        flex-shrink: 0;
        position: relative;
        cursor: pointer;
        transition: background 0.2s;
    }

    .track-sidebar-cell:hover {
        background: rgba(0, 0, 0, 0.02);
    }

    .track-sidebar-cell.selected {
        background: rgba(0, 123, 255, 0.08);
        border-left: 4px solid #007bff;
        padding-left: calc(0.5rem - 4px);
    }

    .track-actions {
        position: relative;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .speaker-info {
        flex: 1;
        overflow: hidden;
    }

    .speaker-edit {
        font-weight: 600;
    }

    .add-track-row {
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid var(--border-color);
    }

    .add-track-btn {
        background: transparent;
        border: 1px solid var(--border-color);
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0.5;
        transition: all 0.2s;
    }

    .add-track-btn:hover {
        opacity: 1;
        background: var(--border-color);
    }

    .speaker-name {
        font-weight: 500;
        font-size: 0.9rem;
    }

    .settings-btn {
        background: transparent;
        border: 1px solid var(--border-color);
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0.5;
        transition: opacity 0.2s;
    }

    .settings-btn:hover {
        opacity: 1;
    }

    .tracks-area {
        flex: 1;
        overflow: auto;
        position: relative;
        transition: background 0.2s;
    }

    .tracks-area.tool-hand {
        cursor: grab;
    }

    .tracks-area.tool-hand:active {
        cursor: grabbing;
    }

    .tracks-area.tool-pen {
        cursor: crosshair;
    }

    .tracks-area.tool-razor {
        cursor: cell;
    }

    .tracks-area.drag-over {
        background: rgba(0, 123, 255, 0.05);
    }

    .drop-indicator-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 123, 255, 0.05);
        border: 2px dashed #007bff;
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
    }

    .drop-msg {
        background: #007bff;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
    }

    .track-lane {
        height: var(--track-height);
        border-bottom: 1px solid var(--border-color);
        min-width: 4000px;
        position: relative;
        background-image: 
            linear-gradient(to right, var(--border-color) 1px, transparent 1px);
        background-size: 100px 100%;
    }

    /* Block Styles */
    .timeline-block {
        position: absolute;
        top: 2px;
        bottom: 2px;
        border: 1px solid var(--border-color);
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 0.35rem;
        cursor: grab;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1;
        overflow: visible; /* FIXED: Changed from hidden to allow popovers to show */
        font-size: 0.7rem;
    }

    .timeline-block.tool-razor {
        cursor: cell;
    }

    .timeline-block.tool-razor:hover {
        border-color: #ff3e00;
        box-shadow: 0 0 0 1px #ff3e00 inset;
    }

    .timeline-block.tool-pen:hover {
        border-color: #007bff;
        box-shadow: 0 0 0 1px #007bff inset;
    }

    .timeline-block.dragging {
        transition: none !important;
        z-index: 1000;
        cursor: grabbing;
        opacity: 0.9;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .timeline-block.is-rendered {
        border-color: rgba(76, 175, 80, 0.3);
    }

    .timeline-block.is-rendered:hover {
        border-color: #4caf50;
    }

    .timeline-block.is-rendered .envelope-overlay {
        opacity: 0.8; /* Ensure envelope is clearly visible on green blocks */
    }

    .block-waveform {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        opacity: 0.5;
        pointer-events: none;
        z-index: 0;
        display: flex;
        align-items: center;
        overflow: hidden;
        transition: opacity 0.2s;
    }

    .tool-pen .block-waveform {
        opacity: 0.15; /* Dim waveform in pen mode to focus on envelope */
        filter: blur(4px);
    }

    .tool-pen .block-info {
        opacity: 0.2;
        filter: blur(2px);
    }

    :global([data-theme='dark']) .block-waveform {
        opacity: 0.6;
        color: #4a9eff;
    }

    .block-info {
        position: relative;
        z-index: 1; /* Keep text above waveform */
        display: flex;
        flex-direction: column;
        height: 100%;
        pointer-events: none;
        justify-content: center; /* Center content vertically */
    }

    .block-header {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        margin-bottom: 2px;
    }

    .status-icon {
        display: flex;
        align-items: center;
        opacity: 0.7;
    }

    .state-none .status-icon {
        animation: spin 2s linear infinite;
    }

    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    .timeline-block:active {
        cursor: grabbing;
    }

    .block-info {
        display: flex;
        flex-direction: column;
        width: 100%;
        z-index: 2;
        overflow: hidden; /* Info (text) still needs to be clipped */
    }

    .timeline-block.editing {
        cursor: text;
        z-index: 100;
        background: var(--bg-color) !important;
        color: var(--text-color) !important;
        outline: 2px solid #007bff;
    }

    .timeline-block.editing .block-info {
        pointer-events: auto;
    }

    .popover-anchor {
        position: absolute;
        left: 0;
        top: 100%;
        width: 0;
        height: 0;
        z-index: 10000;
    }

    .envelope-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 5;
    }

    .tool-pen .envelope-overlay {
        background: rgba(0, 123, 255, 0.03); 
    }

    .envelope-handles-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 10;
        will-change: transform; /* Hardware acceleration */
    }

    .envelope-handle {
        position: absolute;
        width: 10px;
        height: 10px;
        background: #fff;
        border: 2px solid #007bff;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        cursor: pointer;
        pointer-events: auto;
        transition: border-color 0.1s;
    }

    .envelope-handle:hover, .envelope-handle.active {
        background: #007bff;
        border-color: #fff;
        box-shadow: 0 0 8px rgba(0, 123, 255, 0.5);
        z-index: 11;
    }

    .edit-input {
        background: transparent;
        border: none;
        color: inherit;
        font-family: inherit;
        font-size: 0.8rem;
        width: 100%;
        padding: 0;
        outline: none;
    }

    .block-text {
        font-size: 0.8rem;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        user-select: none;
    }

    .block-duration {
        font-size: 0.6rem;
        opacity: 0.6;
        font-family: var(--font-mono);
        font-weight: bold;
    }

    .resize-handle {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        width: 12px; /* Touch optimized */
        cursor: col-resize;
        background: transparent;
        transition: background 0.2s;
        z-index: 10;
        touch-action: none;
    }

    .resize-handle:hover {
        background: rgba(0, 123, 255, 0.4);
    }

    /* States */
    .state-none {
        background: rgba(255, 255, 255, 0.9);
        color: black;
        border-style: dashed;
        /* Remove opacity to prevent inheritance issues with popovers */
    }

    :global([data-theme='dark']) .state-none {
        background: rgba(30, 30, 30, 0.9);
        color: #888;
        border-color: #444;
    }

    .state-rendered {
        background: #1a1a1a;
        color: white;
        border-color: #000;
        box-shadow: inset 0 -2px 0 rgba(255,255,255,0.1);
    }

    :global([data-theme='dark']) .state-rendered {
        background: #e0e0e0;
        color: black;
        border-color: #fff;
    }

    .state-failed {
        background: #fff;
        color: #e53935;
        border-color: #e53935;
    }

    :global([data-theme='dark']) .state-failed {
        background: #2c1a1a;
        color: #ef5350;
        border-color: #ef5350;
    }

    /* Selection */
    .timeline-block.selected {
        border: 2px solid #007bff;
        box-shadow: 0 0 8px rgba(0, 123, 255, 0.3);
        z-index: 2;
    }

    .timeline-block.is-audio {
        background: #f0f7ff;
        border-color: #4a9eff;
        border-style: solid;
        color: #0056b3;
    }

    :global([data-theme='dark']) .timeline-block.is-audio {
        background: #1a2635;
        border-color: #4a9eff;
        color: #99c9ff;
    }

    .marquee-overlay {
        position: absolute;
        background: rgba(0, 123, 255, 0.1);
        border: 1px solid #007bff;
        pointer-events: none;
        z-index: 20000;
    }

    /* Playhead */
    .playhead {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 2px;
        background: #007bff;
        pointer-events: none;
        z-index: 10;
        box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
    }

    .playhead-cap {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 12px;
        height: 8px;
        background: #007bff;
        clip-path: polygon(0 0, 100% 0, 50% 100%);
    }
</style>