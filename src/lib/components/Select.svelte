<script lang="ts">
    import { Down } from '@icon-park/svg';
    let { 
        label = "", 
        options = [], 
        value = $bindable(""), 
        variant = 'underline',
        ...rest 
    } = $props();
</script>

<div class="select-container {variant}">
    {#if label}
        <label for={label}>{label}</label>
    {/if}
    <div class="select-wrapper">
        <select id={label} bind:value {...rest}>
            {#each options as option}
                <option value={option.value}>{option.label}</option>
            {/each}
        </select>
        <span class="arrow">{@html Down({ size: 14 })}</span>
    </div>
</div>

<style>
    .select-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        margin-bottom: 1.5rem;
    }

    label {
        font-family: var(--font-serif);
        font-size: 1.2rem;
        margin-bottom: 0.5rem;
        color: var(--secondary-text);
    }

    .select-wrapper {
        position: relative;
        display: flex;
        align-items: center;
    }

    select {
        font-family: var(--font-serif);
        font-size: 1.5rem;
        background: none;
        border: none;
        outline: none;
        color: var(--text-color);
        width: 100%;
        appearance: none;
        cursor: pointer;
        padding-right: 2rem;
    }

    @media (max-width: 600px) {
        select {
            font-size: 1.2rem;
        }
    }

    .arrow {
        position: absolute;
        right: 0;
        font-family: var(--font-sans);
        pointer-events: none;
        font-size: 1rem;
    }

    .underline select {
        border-bottom: 1px solid var(--border-color);
        padding: 0.5rem 0;
    }

    .box select {
        border: 1px solid var(--border-color);
        padding: 1rem;
    }

    .box .arrow {
        right: 1rem;
    }
</style>
