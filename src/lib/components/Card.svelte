<script lang="ts">
    let { padding = "2rem", children } = $props();
</script>

<div class="card" style="padding: {padding}">
    {@render children?.()}
</div>

<style>
    .card {
        border: 1px solid var(--border-color);
        background-color: white;
        width: 100%;
    }
</style>
