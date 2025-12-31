<script lang="ts">
    let { padding = "2rem", children } = $props();
</script>

<div class="card" style="padding: {padding}">
    {@render children?.()}
</div>

<style>
    .card {
        border: 1px solid var(--border-color);
        background-color: var(--bg-color);
        width: 100%;
    }
</style>
