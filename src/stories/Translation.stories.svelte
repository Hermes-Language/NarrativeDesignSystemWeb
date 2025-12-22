<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TranslationArea from '../lib/components/TranslationArea.svelte';

  const { Story } = defineMeta({
    title: 'Hermes/Content/TranslationArea',
    component: TranslationArea,
    tags: ['autodocs'],
  });
</script>

<Story name="Default" args={{
  sourceText: 'Hello, how are you today?',
  targetText: '你好，今天过得怎么样？'
}} />

<Story name="Empty" args={{
  sourceText: '',
  targetText: ''
}} />