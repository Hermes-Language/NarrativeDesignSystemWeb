<script lang="ts">
    let { src = "", name = "", size = 'md' } = $props();

    let initials = $derived(name.split(' ').map(n => n[0]).join('').toUpperCase());
</script>

<div class="avatar {size}">
    {#if src}
        <img {src} alt={name} />
    {:else}
        <span class="initials">{initials}</span>
    {/if}
</div>

<style>
    .avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--hover-bg);
        border: 1px solid var(--border-color);
        border-radius: 0;
        overflow: hidden;
        font-family: var(--font-serif);
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .sm { width: 32px; height: 32px; font-size: 0.8rem; }
    .md { width: 48px; height: 48px; font-size: 1.1rem; }
    .lg { width: 80px; height: 80px; font-size: 1.8rem; }

    .initials {
        color: var(--secondary-text);
    }
</style>
