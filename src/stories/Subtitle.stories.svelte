<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SubtitleEditor from '../lib/components/SubtitleEditor.svelte';
  import AudioPlayer from '../lib/components/AudioPlayer.svelte';

  const { Story } = defineMeta({
    title: 'Hermes/Media/SubtitleEditor',
    component: SubtitleEditor,
    tags: ['autodocs'],
  });
</script>

<Story name="Standard Editor" args={{
  subtitles: [
    { id: '1', start: '00:00:01', end: '00:00:05', text: 'The first line of the story.' },
    { id: '2', start: '00:00:06', end: '00:00:10', text: 'The second line follows shortly after.' }
  ]
}} />

<Story name="With Audio Player">
  <div style="display: flex; flex-direction: column; gap: 2rem;">
    <AudioPlayer title="Sample Story" artist="Hermes AI" />
    <SubtitleEditor subtitles={[
      { id: '1', start: '00:00:00', end: '00:00:05', text: 'Audio and subtitles working together.' }
    ]} />
  </div>
</Story>