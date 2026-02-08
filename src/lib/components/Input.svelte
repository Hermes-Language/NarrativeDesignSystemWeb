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
        margin-bottom: 0.75rem;
    }

    label {
        font-family: var(--font-serif);
        font-size: 0.75rem;
        font-weight: 800;
        margin-bottom: 0.25rem;
        color: var(--secondary-text);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    input, textarea {
        font-family: var(--font-sans);
        font-size: 0.8rem;
        background: none;
        border: none;
        outline: none;
        color: var(--text-color);
        width: 100%;
    }

    @media (max-width: 600px) {
        input, textarea {
            font-size: 0.75rem;
        }
    }

    textarea {
        resize: vertical;
        min-height: 48px;
    }

    .underline input {
        border-bottom: 1px solid var(--border-color);
        padding: 0.25rem 0;
    }

    .underline input::placeholder {
        color: var(--secondary-text);
    }

    .box input, .box textarea {
        border: 1px solid var(--border-color);
        padding: 0.4rem;
    }

    .box textarea {
        min-height: 80px;
    }
</style>
