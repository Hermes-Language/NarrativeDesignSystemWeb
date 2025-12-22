<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ChatInput from '../lib/components/ChatInput.svelte';
  import LanguageSwitcher from '../lib/components/LanguageSwitcher.svelte';
  import Typography from '../lib/components/Typography.svelte';

  const { Story } = defineMeta({
    title: 'Hermes/Content/Specialized',
    tags: ['autodocs'],
  });
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