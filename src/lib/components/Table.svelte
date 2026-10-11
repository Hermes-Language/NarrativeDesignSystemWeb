<script lang="ts">
    let { headers = [], data = [] } = $props();
</script>

<div class="table-wrapper">
    <table>
        <thead>
            <tr>
                {#each headers as header (header)}
                    <th>{header}</th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each data as row, i (i)}
                <tr>
                    {#each Object.values(row) as cell, i (i)}
                        <td>{cell}</td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style>
    .table-wrapper {
        width: 100%;
        overflow-x: auto;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        font-family: var(--font-serif);
    }

    th {
        text-align: left;
        padding: 1rem;
        border-bottom: 1px solid var(--border-color);
        color: var(--secondary-text);
        font-weight: 400;
        font-size: 1.1rem;
    }

    td {
        padding: 1.5rem 1rem;
        border-bottom: 1px solid var(--hover-bg);
        font-size: 1.2rem;
    }

    tr:hover td {
        background-color: var(--hover-bg);
    }
</style>
