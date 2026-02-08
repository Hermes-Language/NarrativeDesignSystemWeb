<script lang="ts">
    import SettingsPopover from './SettingsPopover.svelte';
    import SettingsModule from './SettingsModule.svelte';

    let { 
        prompt = '', 
        voice = 'en-US', 
        emotion = 0.5,
        onchange
    } = $props();

    const modules = $derived([
        { 
            id: 'Prompt', 
            label: 'Prompt', 
            component: SettingsModule, 
            props: { type: 'prompt', data: { prompt } } 
        },
        { 
            id: 'Control', 
            label: 'Control', 
            component: SettingsModule, 
            props: { type: 'controls', data: { voice, emotion } } 
        }
    ]);

    function handleChange(moduleId: string, updates: any) {
        onchange?.(updates);
    }
</script>

<SettingsPopover 
    items={modules} 
    anchor="right"
    onitemchange={handleChange} 
/>
