<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import AudiobookDesigner from '../lib/components/AudiobookDesigner.svelte';

  const { Story } = defineMeta({
    title: 'Hermes/Content/AudiobookDesigner',
    component: AudiobookDesigner,
    tags: ['autodocs'],
  });
</script>

<Story name="Default" args={{
  blocks: [
    { 
      id: '1', 
      label: 'Narrator', 
      content: 'Once upon a time, in a land far away...', 
      prompt: 'Read with a deep, mysterious voice.', 
      voice: 'en-US-Standard-B', 
      emotion: 0.8 
    },
    { 
      id: '2', 
      label: 'Hero', 
      content: 'I will find the treasure, no matter the cost!', 
      prompt: 'Energetic and determined.', 
      voice: 'en-US-Wavenet-D', 
      emotion: 0.9 
    }
  ]
}} />

<Story name="Empty" args={{
  blocks: []
}} />