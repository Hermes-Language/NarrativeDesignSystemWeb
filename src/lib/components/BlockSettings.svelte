<script lang="ts">
    import SettingsPopover from './SettingsPopover.svelte';
    import SettingsModule from './SettingsModule.svelte';

    let { 
        text = '', 
        mode = 'TTS',
        type = 'tts', // 'tts' | 'audio'
        fileName = '',
        playbackRate = 1.0,
        onchange,
        onreplace
    } = $props();

    const modules = $derived([
        ...(type === 'audio' ? [
            { 
                id: 'Audio', 
                label: 'Audio', 
                component: SettingsModule, 
                props: { 
                    type: 'audio_control', 
                    data: { fileName, playbackRate },
                    onreplace: onreplace
                } 
            }
        ] : [
            { 
                id: 'Content', 
                label: 'Content', 
                component: SettingsModule, 
                props: { type: 'content', data: { text } } 
            },
            ...(mode === 'TTS' ? [{ 
                id: 'Override', 
                label: 'Override', 
                component: SettingsModule, 
                props: { type: 'overrides', data: {} } 
            }] : [])
        ])
    ]);

    function handleChange(moduleId: string, updates: any) {
        onchange?.(updates);
    }
</script>

<SettingsPopover 
    items={modules} 
    anchor="left"
    onitemchange={handleChange} 
/>
