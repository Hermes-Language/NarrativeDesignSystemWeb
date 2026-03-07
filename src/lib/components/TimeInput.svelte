<script lang="ts">
    import * as m from '$lib/paraglide/messages.js';
    let { 
        value = $bindable("00:00:00"), 
        label = "",
        onchange = undefined 
    } = $props();

    let parts = $derived(value.split(':'));
    let hh = $derived(parts[0] || "00");
    let mm = $derived(parts[1] || "00");
    let ss = $derived(parts[2] || "00");

    function updatePart(index: number, newVal: string) {
        let val = newVal.replace(/\D/g, '').slice(0, 2).padStart(2, '0');
        
        // Validation
        if (index > 0) { // mm or ss
            const num = parseInt(val);
            if (num > 59) val = "59";
        } else { // hh
            const num = parseInt(val);
            if (num > 99) val = "99";
        }

        const newParts = [...parts];
        while (newParts.length < 3) newParts.push("00");
        newParts[index] = val;
        
        value = newParts.join(':');
        onchange?.(value);
    }

    function handleBlur(index: number, e: Event) {
        const target = e.target as HTMLInputElement;
        updatePart(index, target.value);
    }
</script>

<div class="time-input-container">
    {#if label}
        <span class="time-label">{label}</span>
    {/if}
    <div class="time-fields">
        <input 
            type="text" 
            value={hh} 
            onblur={(e) => handleBlur(0, e)}
            onkeydown={(e) => e.key === 'Enter' && handleBlur(0, e)}
            maxlength="2"
            aria-label="Hours"
        />
        <span class="sep">:</span>
        <input 
            type="text" 
            value={mm} 
            onblur={(e) => handleBlur(1, e)}
            onkeydown={(e) => e.key === 'Enter' && handleBlur(1, e)}
            maxlength="2"
            aria-label="Minutes"
        />
        <span class="sep">:</span>
        <input 
            type="text" 
            value={ss} 
            onblur={(e) => handleBlur(2, e)}
            onkeydown={(e) => e.key === 'Enter' && handleBlur(2, e)}
            maxlength="2"
            aria-label="Seconds"
        />
    </div>
</div>

<style>
    .time-input-container {
        display: inline-flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .time-label {
        font-family: var(--font-serif);
        font-size: 0.9rem;
        color: var(--secondary-text);
    }

    .time-fields {
        display: flex;
        align-items: center;
        background: var(--panel-bg);
        border: 1px solid var(--border-color);
        padding: 0.25rem 0.5rem;
        gap: 0.25rem;
    }

    input {
        width: 2ch;
        border: none;
        background: transparent;
        font-family: var(--font-sans);
        font-size: 0.9rem;
        text-align: center;
        padding: 0;
        outline: none;
        color: var(--text-color);
    }

    .sep {
        font-family: var(--font-sans);
        font-size: 0.9rem;
        color: var(--secondary-text);
        user-select: none;
    }

    input:focus {
        font-weight: 600;
    }
</style>