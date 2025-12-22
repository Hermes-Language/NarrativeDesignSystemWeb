<script lang="ts">
    let { size = 'medium', children } = $props();
</script>

<div class="container {size}">
    {@render children?.()}
</div>

<style>
    .container {
        margin: 0 auto;
        padding: 2rem;
        width: 100%;
        box-sizing: border-box;
    }

    @media (max-width: 768px) {
        .container {
            padding: 1rem;
        }
    }

    .small {
        max-width: 500px;
    }

    .medium {
        max-width: 800px;
    }

    .large {
        max-width: 1200px;
    }
</style>
