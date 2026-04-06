import type { Preview } from '@storybook/sveltekit'
import '../src/app.css';
import '../src/stories/storybook-nds.css';

const preview: Preview = {
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'NDS Light',
      values: [
        { name: 'NDS Light', value: '#f7f3f0' },
        { name: 'NDS Paper', value: '#ffffff' },
        { name: 'NDS Dark', value: '#000000' }
      ]
    },
    options: {
      storySort: {
        order: ['Narrative Design System', 'Hermes']
      }
    },
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    docs: {
      canvas: {
        sourceState: 'shown'
      }
    }
  },
};

export default preview;