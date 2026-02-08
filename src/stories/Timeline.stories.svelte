<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Timeline from '../lib/components/Timeline.svelte';

  const { Story } = defineMeta({
    title: 'Hermes/Content/Timeline (Pro Editor)',
    component: Timeline,
    tags: ['autodocs'],
    parameters: {
      layout: 'fullscreen',
      viewport: {
        defaultViewport: 'responsive'
      }
    }
  });
</script>

<script>
  // Standard industrial theme setup
  const shortcuts = [
    { key: 'Space', desc: 'Play / Pause' },
    { key: 'V', desc: 'Pointer Tool' },
    { key: 'H', desc: 'Hand Tool' },
    { key: 'C', desc: 'Razor Tool (Cut)' },
    { key: 'P', desc: 'Pen Tool' },
    { key: 'Delete / BS', desc: 'Delete Selected' },
    { key: 'Ctrl + A', desc: 'Select All' },
    { key: 'A', desc: 'Add Audio' },
    { key: 'R', desc: 'Render TTS' },
    { key: 'Ctrl + Z', desc: 'Undo' },
    { key: 'Ctrl + Shift + Z', desc: 'Redo' },
  ];
</script>

<Story name="Professional Desktop">
  <div class="story-wrapper">
    <div class="timeline-container">
      <Timeline />
    </div>
    <div class="shortcut-legend">
      {#each shortcuts as { key, desc }}
        <div class="legend-item">
          <span class="key">{key}</span>
          <span class="desc">{desc}</span>
        </div>
      {/each}
    </div>
  </div>
</Story>

<Story name="Mobile Portrait" parameters={{
  viewport: { defaultViewport: 'iphonex' }
}}>
  <div style="height: 100vh; width: 100%;">
    <Timeline />
  </div>
</Story>

<Story name="Mobile Landscape (Pro)" parameters={{
  viewport: { defaultViewport: 'iphonexl' }
}}>
  <div style="height: 100vh; width: 100%;">
    <Timeline />
  </div>
</Story>

<style>
  :global(body) {
    padding: 0 !important;
    margin: 0 !important;
    background: #f7f3f0;
  }

  .story-wrapper {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .timeline-container {
    flex: 1;
    overflow: hidden;
  }

  .shortcut-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    padding: 12px;
    background: #000;
    color: #fff;
    font-family: 'Inter', sans-serif;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-top: 1px solid #333;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    border: 1px solid #333;
  }

  .key {
    font-weight: 900;
    color: #4caf50;
  }

  .desc {
    opacity: 0.7;
  }

  :global([data-theme='dark']) .shortcut-legend {
    background: #fff;
    color: #000;
    border-top-color: #eee;
  }

  :global([data-theme='dark']) .legend-item {
    border-color: #eee;
  }
</style>
