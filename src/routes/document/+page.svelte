<script lang="ts">
    import { dev } from '$app/environment';
    import { onMount } from 'svelte';

    // In development, we point to the Storybook dev server
    // In production, we point to the static build folder
    const storybookUrl = dev ? 'http://localhost:6006' : '/storybook/index.html';
    
    let iframeElement: HTMLIFrameElement;

    onMount(() => {
        // Optional: Handle any iframe communication if needed
    });
</script>

<svelte:head>
    <title>Storyboard | Hermes Narrative Design</title>
</svelte:head>

<div class="document-wrapper">
    <iframe 
        bind:this={iframeElement}
        src={storybookUrl} 
        title="Hermes Storyboard"
        frameborder="0"
    ></iframe>
</div>

<style>
    :global(body, html) {
        margin: 0;
        padding: 0;
        height: 100%;
        overflow: hidden;
    }

    .document-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: #fff;
        z-index: 9999;
    }

    iframe {
        width: 100%;
        height: 100%;
        border: none;
    }
</style>
