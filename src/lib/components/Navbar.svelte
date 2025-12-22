<script lang="ts">
    interface NavItem {
        name: string;
        href: string;
    }

    let { items = [] as NavItem[], vertical = false } = $props();
</script>

<nav class="navbar" class:vertical>
    {#each items as item}
        <a href={item.href} class="nav-link">{item.name}</a>
    {/each}
</nav>

<style>
    .navbar {
        display: flex;
        gap: 2rem;
    }

    .navbar.vertical {
        flex-direction: column;
        gap: 0;
        align-items: stretch;
        width: 100%;
    }

    .navbar.vertical .nav-link {
        padding: 1rem 0;
        width: 100%;
        text-align: center;
        border-bottom: 1px solid #f5f5f5;
        font-size: 1.2rem;
    }

    .navbar.vertical .nav-link:last-child {
        border-bottom: none;
    }

    .nav-link {
        font-family: var(--font-serif);
        font-size: 1.1rem;
        text-decoration: none;
        color: var(--text-color);
        transition: opacity 0.2s;
        white-space: nowrap;
    }

    .nav-link:hover {
        opacity: 0.6;
    }

    @media (max-width: 768px) {
        .navbar:not(.vertical) {
            width: 100%;
            justify-content: center;
            overflow-x: auto;
            padding-bottom: 0.5rem;
            gap: 1.5rem;
            /* Hide scrollbar but keep functionality */
            scrollbar-width: none;
            -ms-overflow-style: none;
        }
        .navbar:not(.vertical)::-webkit-scrollbar {
            display: none;
        }
    }
</style>