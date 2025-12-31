<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Modal from '../lib/components/Modal.svelte';
  import Drawer from '../lib/components/Drawer.svelte';
  import Dropdown from '../lib/components/Dropdown.svelte';
  import Button from '../lib/components/Button.svelte';
  import Typography from '../lib/components/Typography.svelte';
  import ToastContainer, { addToast } from '../lib/components/Toast.svelte';

  const { Story } = defineMeta({
    title: 'Hermes/Overlay',
    tags: ['autodocs'],
  });
</script>

<script>
  let showModal = $state(false);
  let showDrawer = $state(false);
</script>

<Story name="Modal & Drawer">
  <div style="display: flex; gap: 1rem;">
    <Button onclick={() => showModal = true}>Open Modal</Button>
    <Button variant="box" onclick={() => showDrawer = true}>Open Drawer</Button>
  </div>

  <Modal bind:show={showModal} title="Interactive Modal">
    <Typography element="p">This is an interactive modal triggered by the button above.</Typography>
    <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end;">
        <Button variant="box" onclick={() => showModal = false}>Close</Button>
    </div>
  </Modal>

  <Drawer bind:show={showDrawer} title="Interactive Drawer">
    <Typography element="p">This is an interactive drawer sliding from the right.</Typography>
    <div style="margin-top: 1.5rem;">
        <Button variant="box" onclick={() => showDrawer = false}>Close Drawer</Button>
    </div>
  </Drawer>
  
  <!-- Static previews for documentation -->
  <div style="margin-top: 2rem; border: 1px solid #eee; padding: 2rem; position: relative; height: 300px; overflow: hidden;">
    <Typography element="h3">Modal Preview</Typography>
    <div style="background: rgba(0,0,0,0.05); padding: 2rem; border-radius: 8px;">
        <Typography element="h2">Modal Title</Typography>
        <Typography element="p">This is how a modal looks when opened.</Typography>
        <Button variant="box">Close</Button>
    </div>
  </div>
</Story>

<Story name="Dropdown">
  <div style="height: 200px;">
    <Dropdown 
      label="Options" 
      items={[
        { label: 'Edit Profile', onClick: () => {} },
        { label: 'Settings', onClick: () => {} },
        { label: 'Logout', onClick: () => {} }
      ]} 
    />
  </div>
</Story>

<Story name="Toasts">
  <div style="display: flex; gap: 1rem;">
    <Button onclick={() => addToast('Success message!', 'success')}>Success Toast</Button>
    <Button onclick={() => addToast('Error message!', 'error')}>Error Toast</Button>
    <Button onclick={() => addToast('Info message!', 'info')}>Info Toast</Button>
  </div>
  <ToastContainer />
</Story>