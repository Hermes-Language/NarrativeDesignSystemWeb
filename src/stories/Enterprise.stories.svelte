<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Table from '../lib/components/Table.svelte';
  import Tabs from '../lib/components/Tabs.svelte';
  import Select from '../lib/components/Select.svelte';
  import Switch from '../lib/components/Switch.svelte';

  const { Story } = defineMeta({
    title: 'Hermes/Content/Enterprise',
    tags: ['autodocs'],
  });
</script>

<Story name="Data Table">
  <Table 
    headers={['ID', 'Project Name', 'Status', 'Last Updated']}
    data={[
      { id: '001', name: 'Hermes UI', status: 'Active', date: '2023-10-27' },
      { id: '002', name: 'Narrative Engine', status: 'Pending', date: '2023-10-25' },
      { id: '003', name: 'Voice Synthesis', status: 'Completed', date: '2023-10-20' }
    ]}
  />
</Story>

<Story name="Tabs & Controls">
  <div style="display: flex; flex-direction: column; gap: 2rem; max-width: 400px;">
    <Tabs 
      items={[
        { id: 'tab1', label: 'General' },
        { id: 'tab2', label: 'Security' },
        { id: 'tab3', label: 'Advanced' }
      ]}
      activeId="tab1"
    />
    <Select 
      label="Select Language"
      options={[
        { value: 'en', label: 'English' },
        { value: 'zh', label: 'Chinese' },
        { value: 'ja', label: 'Japanese' }
      ]}
    />
    <Switch label="Enable AI Processing" checked={true} />
  </div>
</Story>