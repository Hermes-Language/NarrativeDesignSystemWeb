<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import AudiobookDesigner from '../lib/components/AudiobookDesigner.svelte';
  import AudiobookBlock from '../lib/components/AudiobookBlock.svelte';

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

<Story name="Single Block">
  <div style="max-width: 800px; margin: 0 auto; padding: 2rem;">
    <AudiobookBlock 
      data={{
        id: '1',
        label: 'Narrator',
        content: 'This is a single block of text for the audiobook designer.',
        prompt: 'Read with clarity.',
        voice: 'en-US-Standard-A',
        emotion: 0.5
      }}
      onremove={() => console.log('Remove clicked')}
    />
  </div>
</Story>