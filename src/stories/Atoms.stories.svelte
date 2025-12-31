<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Button from '../lib/components/Button.svelte';
  import Input from '../lib/components/Input.svelte';
  import Typography from '../lib/components/Typography.svelte';
  import Badge from '../lib/components/Badge.svelte';
  import Avatar from '../lib/components/Avatar.svelte';
  import Checkbox from '../lib/components/Checkbox.svelte';
  import Switch from '../lib/components/Switch.svelte';
  import Slider from '../lib/components/Slider.svelte';
  import TimeInput from '../lib/components/TimeInput.svelte';
  import DatePicker from '../lib/components/DatePicker.svelte';
  import StateSwitch from '../lib/components/StateSwitch.svelte';
  import ThemeToggle from '../lib/components/ThemeToggle.svelte';

  const { Story } = defineMeta({
    title: 'Hermes/Atoms',
    tags: ['autodocs'],
  });
</script>

<Story name="Typography">
  <div style="display: flex; flex-direction: column; gap: 1rem;">
    <Typography element="h1">Heading 1</Typography>
    <Typography element="h2">Heading 2</Typography>
    <Typography element="h3">Heading 3</Typography>
    <Typography element="p">This is a paragraph using the EB Garamond serif font, designed for narrative clarity and elegance.</Typography>
  </div>
</Story>

<Story name="Buttons">
  <div style="display: flex; gap: 1rem; align-items: center;">
    <Button>Text Button</Button>
    <Button variant="box">Box Button</Button>
  </div>
</Story>

<Story name="Inputs">
  <div style="display: flex; flex-direction: column; gap: 2rem; max-width: 400px;">
    <Input label="Underline Input" placeholder="Enter text..." />
    <Input label="Box Input" variant="box" placeholder="Enter text..." />
    <TimeInput label="Time Input" value="12:00:00" />
    <DatePicker label="Date Picker" value="2025-12-23" />
  </div>
</Story>

<Story name="Selection & Range">
  <div style="display: flex; flex-direction: column; gap: 2rem; max-width: 400px;">
    <div style="display: flex; gap: 2rem;">
        <Checkbox label="Checkbox" checked={true} />
        <Switch label="Switch" checked={true} />
    </div>
    <Slider label="Slider" value={50} />
  </div>
</Story>

<Story name="State Switch">
  <div style="display: flex; flex-direction: column; gap: 2rem; max-width: 400px;">
    <div>
      <Typography element="p" style="margin-bottom: 0.5rem; font-size: 0.8rem; font-weight: 600;">Two States</Typography>
      <StateSwitch 
        options={[{id: 'prompt', label: 'Prompt'}, {id: 'control', label: 'Control'}]} 
        activeId="prompt"
      />
    </div>
    <div>
      <Typography element="p" style="margin-bottom: 0.5rem; font-size: 0.8rem; font-weight: 600;">Three States</Typography>
      <StateSwitch 
        options={[
          {id: 'low', label: 'Low'}, 
          {id: 'medium', label: 'Medium'}, 
          {id: 'high', label: 'High'}
        ]} 
        activeId="medium"
      />
    </div>
  </div>
</Story>

<Story name="Status & Identity">
  <div style="display: flex; gap: 2rem; align-items: center;">
    <Badge>Active</Badge>
    <Badge variant="outline">Pending</Badge>
    <Avatar src="https://i.pravatar.cc/150?u=hermes" name="User" size="md" />
    <Avatar name="JD" size="md" />
  </div>
</Story>

<Story name="Theme Toggle">
  <div style="padding: 2rem; display: flex; justify-content: center; background: var(--bg-color);">
    <ThemeToggle />
  </div>
</Story>