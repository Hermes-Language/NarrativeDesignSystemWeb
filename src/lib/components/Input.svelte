<script lang="ts">
    let {
        label = "",
        value = $bindable(""),
        type = "text",
        placeholder = "",
        variant = 'underline',
        multiline = false,
        ...rest
    } = $props();
</script>

<div class="input-container {variant}">
    {#if label}
        <label for={label}>{label}</label>
    {/if}
    
    {#if multiline}
        <textarea
            id={label}
            {placeholder}
            bind:value
            {...rest}
        ></textarea>
    {:else}
        <input
            id={label}
            {type}
            {placeholder}
            bind:value
            {...rest}
        />
    {/if}
</div>

<style>
    .input-container {
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

    input, textarea {
        font-family: var(--font-serif);
        font-size: 1.5rem;
        background: none;
        border: none;
        outline: none;
        color: var(--text-color);
        width: 100%;
    }

    @media (max-width: 600px) {
        input, textarea {
            font-size: 1.2rem;
        }
    }

    textarea {
        resize: vertical;
        min-height: 100px;
    }

    .underline input {
        border-bottom: 1px solid var(--border-color);
        padding: 0.5rem 0;
    }

    .underline input::placeholder {
        color: var(--secondary-text);
    }

    .box input, .box textarea {
        border: 1px solid var(--border-color);
        padding: 1rem;
    }

    .box textarea {
        min-height: 200px;
    }
</style>
