<script lang="ts">
    let { checked = $bindable(false), label = "" } = $props();
</script>

<label class="checkbox-container">
    <input type="checkbox" bind:checked />
    <span class="checkmark"></span>
    {#if label}
        <span class="label-text">{label}</span>
    {/if}
</label>

<style>
    .checkbox-container {
        display: flex;
        align-items: center;
        cursor: pointer;
        font-family: var(--font-serif);
        font-size: 1.2rem;
        user-select: none;
        gap: 0.75rem;
        margin-bottom: 1rem;
    }

    input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
    }

    .checkmark {
        height: 20px;
        width: 20px;
        border: 1px solid var(--border-color);
        background-color: transparent;
        display: inline-block;
        position: relative;
        transition: background-color 0.2s;
    }

    .checkbox-container:hover input ~ .checkmark {
        background-color: #eee;
    }

    input:checked ~ .checkmark {
        background-color: var(--text-color);
    }

    .checkmark:after {
        content: "";
        position: absolute;
        display: none;
        left: 6px;
        top: 2px;
        width: 5px;
        height: 10px;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
    }

    input:checked ~ .checkmark:after {
        display: block;
    }

    .label-text {
        color: var(--text-color);
    }
</style>
