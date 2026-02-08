# Hermes Storyboard Documentation

The Storyboard (powered by [Storybook](https://storybook.js.org/)) is the central component library and interactive documentation site for the Hermes Narrative Design System.

---

## 🚀 Getting Started

### 1. Running the Local Storyboard
To start the interactive documentation server during development:
```bash
pnpm storybook
```
This will start the Storyboard on `http://localhost:6006`.

### 2. Building for Production
To generate a static build of the Storyboard:
```bash
pnpm build-storybook
```
The output will be located in `build/storybook`.

---

## 📱 Mobile & Touch Features
The Storyboard includes built-in tools to test the system's professional mobile capabilities:

- **Touch Emulation**: Use the Storybook toolbar to toggle "Pointer" mode to test `PointerEvents` logic.
- **Orientation Testing**: Use the "Viewport" tool to switch between **Portrait** and **Landscape** modes. 
- **Landscape-First UI**: Observe how components (like the `Timeline`) flatten their headers and rearrange tool groupings when the viewport width exceeds height on mobile presets.

---

## 🔌 API & Integration Testing

### Testing the `onRender` Workflow
The Storyboard provides a way to test your integration logic. In the **Timeline** story, the `onRender` prop is configured with a simulated delay to test the UI's "Loading" and "Success" states.

When integrating, ensure your `onRender` function:
1. Receives the `context` object containing both `block` and `speaker` data.
2. Returns a `Promise<string>` that resolves to a playable audio URL.
3. Handles errors by throwing, which will trigger the `failed` state in the Timeline UI.

**Example `onRender` Implementation:**
```typescript
async function handleTtsGeneration({ block, speaker }) {
    // block: The specific block being rendered
    // speaker: The track's speaker configuration (voice, emotion, etc.)
    const response = await api.generate(block.text, speaker.voice);
    return response.audioUrl;
}
```

### State Binding
The `tracks` prop is `$bindable()`. You can monitor real-time changes to the timeline data structure by binding to it in your parent component:

```svelte
<Timeline bind:tracks={myProjectTracks} />
```

---

## 📦 Adding New Stories
When adding new components to the library:
1. Create a `*.stories.svelte` file in `src/stories/`.
2. Use the `Layout` wrapper to ensure high-contrast theme compatibility.
3. Ensure the story includes mobile-specific viewports to verify touch-target sizes (44px min).

---
© 2026 Hermes Language. All rights reserved.
