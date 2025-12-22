<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import AudioPlayer from '../lib/components/AudioPlayer.svelte';
  import FileUploader from '../lib/components/FileUploader.svelte';
  import FileDropZone from '../lib/components/FileDropZone.svelte';
  import FileUploadButton from '../lib/components/FileUploadButton.svelte';
  import Typography from '../lib/components/Typography.svelte';

  const { Story } = defineMeta({
    title: 'Hermes/Media',
    tags: ['autodocs'],
  });
</script>

<Story name="Audio Player">
  <AudioPlayer title="The Great Gatsby" artist="F. Scott Fitzgerald" />
</Story>

<Story name="File Uploaders">
  <div style="display: flex; flex-direction: column; gap: 3rem;">
    <div>
        <Typography element="h3">Static Drop Zone</Typography>
        <FileDropZone label="Drag your manuscript here" sublabel="PDF, DOCX up to 10MB" />
    </div>
    
    <div style="display: flex; gap: 2rem; align-items: center;">
        <div>
            <Typography element="h3">Button Trigger</Typography>
            <FileUploadButton variant="box" label="Choose File" />
        </div>
        <div>
            <Typography element="h3">Link Trigger</Typography>
            <FileUploadButton variant="link" label="Click here to upload" />
        </div>
    </div>

    <div>
        <Typography element="h3">Full Screen Uploader (Demo)</Typography>
        <Typography element="p">Drag a file anywhere on the screen to trigger the full-screen blur overlay.</Typography>
        <!-- FileUploader is usually global, so we just show the component logic here -->
    </div>
  </div>
</Story>