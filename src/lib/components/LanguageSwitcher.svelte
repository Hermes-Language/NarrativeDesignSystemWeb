<script lang="ts">
    import LanguagePicker, { type LanguageDef } from './LanguagePicker.svelte';
	import { ArrowDown, ArrowLeftRight } from '@lucide/svelte';

    let { 
        source = $bindable(""), 
        target = $bindable(""),
        sourceLanguages = [
            { language: "English", support: ["machine", "neural"], most_used: true },
            { language: "Chinese", support: ["machine", "neural"], most_used: true },
            { language: "Japanese", support: ["machine", "neural"], most_used: true },
            { language: "French", support: ["machine", "neural"] },
            { language: "German", support: ["machine", "neural"] },
            { language: "Spanish", support: ["machine", "neural"] },
            { language: "Korean", support: ["machine", "neural"] },
            { language: "Russian", support: ["machine", "neural"] }
        ] as LanguageDef[],
        targetLanguages = [
            { language: "English", support: ["machine", "neural"], most_used: true },
            { language: "Chinese", support: ["machine", "neural"], most_used: true },
            { language: "Japanese", support: ["machine", "neural"], most_used: true },
            { language: "French", support: ["machine", "neural"] },
            { language: "German", support: ["machine", "neural"] },
            { language: "Spanish", support: ["machine", "neural"] },
            { language: "Korean", support: ["machine", "neural"] },
            { language: "Russian", support: ["machine", "neural"] }
        ] as LanguageDef[],
        showModeSwitch = true,
        disabledLanguages = []
    } = $props<{
        source: string;
        target: string;
        sourceLanguages?: LanguageDef[];
        targetLanguages?: LanguageDef[];
        showModeSwitch?: boolean;
        disabledLanguages?: string[];
    }>();

    let pickerShow = $state(false);
    let pickerType = $state<'source' | 'target'>('source');
    let translationMode = $state("Neural"); // "Machine" | "Neural"

    function swap() {
        const temp = source;
        source = target;
        target = temp;
    }

    function openPicker(type: 'source' | 'target') {
        pickerType = type;
        pickerShow = true;
    }

    let pickerValue = $derived.by(() => {
        return pickerType === 'source' ? source : target;
    });

    function handlePickerSelect(val: string) {
        if (pickerType === 'source') {
            source = val;
        } else {
            target = val;
        }
    }
</script>

<div class="language-switcher">
    <!-- Source Language Dropdown -->
    <div class="dropdown-container">
        <button class="lang-trigger" onclick={() => openPicker('source')}>
            {source || "Select"} <span class="chevron" class:open={pickerShow && pickerType === 'source'}><ArrowDown size={18} /></span>
        </button>
    </div>
    
    <button class="swap-button" onclick={swap} aria-label="Swap languages">
        <ArrowLeftRight size={24} />
    </button>

    <!-- Target Language Dropdown -->
    <div class="dropdown-container">
        <button class="lang-trigger" onclick={() => openPicker('target')}>
            {target || "Select"} <span class="chevron" class:open={pickerShow && pickerType === 'target'}><ArrowDown size={18} /></span>
        </button>
    </div>
</div>

<LanguagePicker 
    bind:show={pickerShow}
    value={pickerValue}
    onvalueChange={handlePickerSelect}
    languages={pickerType === 'source' ? sourceLanguages : targetLanguages}
    disabledLanguages={[...disabledLanguages, pickerType === 'source' ? target : source]}
    {showModeSwitch}
    bind:translationMode
/>

<style>
    .language-switcher {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8rem;
        margin: var(--spacing-lg) 0;
        user-select: none;
        position: relative;
        z-index: 100;
        /* Ensure specific height or padding to prevent collapsing */
        padding: var(--spacing-md);
    }

    @media (max-width: 600px) {
        .language-switcher {
            gap: 1rem;
            justify-content: center;
            width: 100%;
            margin: 1rem 0;
            padding: 0.5rem;
        }
    }

    .dropdown-container {
        position: relative;
        min-width: 160px;
        display: flex;
        justify-content: center;
    }

    @media (max-width: 600px) {
        .dropdown-container {
            min-width: 100px;
            flex: 1;
        }
    }

    .lang-trigger {
        width: 100%;
        background: none;
        border: none;
        font-family: var(--font-serif);
        font-size: 1.5rem;
        color: var(--text-color);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: var(--spacing-xs) var(--spacing-sm);
        transition: opacity var(--transition-fast);
        white-space: nowrap;
    }

    @media (max-width: 600px) {
        .lang-trigger {
            font-size: 1.2rem;
            padding: 0.25rem;
            gap: 0.25rem;
        }
    }

    .lang-trigger:hover {
        opacity: 0.6;
    }

    .chevron {
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform var(--transition-normal) ease;
    }

    .chevron.open {
        transform: rotate(180deg);
    }

    .swap-button {
        background: none;
        border: none;
        cursor: pointer;
        padding: var(--spacing-sm);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-color);
        transition: transform var(--transition-normal) ease, opacity var(--transition-fast);
        flex-shrink: 0;
    }

    .swap-button:hover {
        transform: rotate(180deg);
        opacity: 0.6;
    }

    @media (max-width: 600px) {
        .swap-button {
            padding: 0.25rem;
        }
        :global(.swap-button svg) {
            width: 24px;
            height: 24px;
        }
    }
</style>
