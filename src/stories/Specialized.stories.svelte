<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ChatInput from '../lib/components/ChatInput.svelte';
  import LanguageSwitcher from '../lib/components/LanguageSwitcher.svelte';
  import LockScreen from '../lib/components/LockScreen.svelte';
  import Typography from '../lib/components/Typography.svelte';
  import Button from '../lib/components/Button.svelte';

  const { Story } = defineMeta({
    title: 'Hermes/Content/Specialized',
    tags: ['autodocs'],
  });
</script>

<script>
  let showLock = $state(false);
</script>

<Story name="Chat Input">
  <div style="max-width: 600px; padding: 2rem; background: #f9f9f9;">
    <ChatInput placeholder="Ask Hermes anything..." />
  </div>
</Story>

<Story name="Language Switcher">
  <div style="padding: 2rem;">
    <Typography element="h3">Select Interface Language</Typography>
    <LanguageSwitcher />
  </div>
</Story>

<Story name="Lock Screen">
  <div style="padding: 2rem;">
    <Button onclick={() => showLock = true}>Show Lock Screen</Button>
    <LockScreen bind:show={showLock}>
      <div style="text-align: center; color: white;">
        <Typography element="h1" style="color: white; margin-bottom: 1rem; font-size: 4rem;">12:45</Typography>
        <Typography element="p" style="color: rgba(255,255,255,0.7); font-size: 1.2rem;">Tuesday, December 31</Typography>
      </div>
    </LockScreen>
  </div>
</Story>