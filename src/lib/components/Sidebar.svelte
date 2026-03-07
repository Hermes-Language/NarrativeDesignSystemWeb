<script lang="ts">
    let { title = "History", items = [] } = $props();
</script>

<aside class="sidebar">
    <div class="sidebar-header">
        {title}
    </div>
    <div class="sidebar-content">
        {#each items as item (item.date)}
            <div class="history-item">
                <span class="date">{item.date}</span>
                <div class="line"></div>
            </div>
        {/each}
    </div>
</aside>

<style>
    .sidebar {
        width: 250px;
        height: 100%;
        border-right: 1px solid var(--border-color);
        padding: 2rem 1rem;
        display: flex;
        flex-direction: column;
    }

    .sidebar-header {
        font-family: var(--font-serif);
        font-size: 1.2rem;
        margin-bottom: 2rem;
    }

    .history-item {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }

    .date {
        font-family: var(--font-serif);
        font-size: 1rem;
        color: var(--text-color);
    }

    .line {
        width: 1px;
        height: 100px;
        background-color: var(--border-color);
        margin-left: auto;
    }
</style>
