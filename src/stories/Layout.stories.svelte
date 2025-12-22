<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Container from '../lib/components/Container.svelte';
  import Card from '../lib/components/Card.svelte';
  import Header from '../lib/components/Header.svelte';
  import Navbar from '../lib/components/Navbar.svelte';
  import Sidebar from '../lib/components/Sidebar.svelte';
  import Typography from '../lib/components/Typography.svelte';

  const { Story } = defineMeta({
    title: 'Hermes/Layout',
    tags: ['autodocs'],
  });
</script>

<Story name="Header & Navbar">
  <div style="border: 1px solid #eee; margin-bottom: 2rem;">
    <Header />
  </div>
  <div style="padding: 1rem; background: #fafafa;">
    <Typography element="h3">Standalone Navbar</Typography>
    <Navbar items={[
      { name: 'Home', href: '#' },
      { name: 'About', href: '#' },
      { name: 'Contact', href: '#' }
    ]} />
  </div>
</Story>

<Story name="Container & Card">
  <Container size="medium">
    <Card>
      <Typography element="h3">Card Title</Typography>
      <Typography element="p">This is a card inside a medium container. It provides a clean boundary for content.</Typography>
    </Card>
  </Container>
</Story>

<Story name="Sidebar">
  <div style="height: 400px; border: 1px solid #eee; display: flex;">
    <Sidebar />
    <div style="padding: 2rem; flex: 1;">
        <Typography element="h2">Main Content Area</Typography>
        <Typography element="p">The sidebar is fixed to the left, providing navigation for complex applications.</Typography>
    </div>
  </div>
</Story>