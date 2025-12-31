<script lang="ts">
    let { checked = $bindable(false), label = "" } = $props();
</script>

<div class="switch-container">
    {#if label}
        <span class="label-text">{label}</span>
    {/if}
    <label class="switch">
        <input type="checkbox" bind:checked />
        <span class="slider"></span>
    </label>
</div>

<style>
    .switch-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 1rem;
        font-family: var(--font-serif);
        font-size: 1.2rem;
    }

    .switch {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 24px;
    }

    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: transparent;
        border: 1px solid var(--border-color);
        transition: .4s;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 16px;
        width: 16px;
        left: 3px;
        bottom: 3px;
        background-color: var(--text-color);
        transition: .4s;
    }

    input:checked + .slider {
        background-color: var(--text-color);
    }

    input:checked + .slider:before {
        transform: translateX(26px);
        background-color: var(--bg-color);
    }
</style>
