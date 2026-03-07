<script lang="ts">
    import * as m from '$lib/paraglide/messages.js';
    import { fade } from 'svelte/transition';
    import StateSwitch from './StateSwitch.svelte';
    import Modal from './Modal.svelte';

    export interface LanguageDef {
        language: string;
        support: string[];
        most_used?: boolean;
    }

    let {
        show = $bindable(false),
        value = "",
        onvalueChange,
        languages = [] as LanguageDef[],
        disabledLanguages = [] as string[],
        showModeSwitch = true,
        translationMode = $bindable("Neural")
    } = $props<{
        show: boolean;
        value: string;
        onvalueChange?: (val: string) => void;
        languages: LanguageDef[];
        disabledLanguages?: string[];
        showModeSwitch?: boolean;
        translationMode?: string;
    }>();

    let mostUsedList = $derived(languages.filter((l: LanguageDef) => l.most_used));

    function select(lang: LanguageDef) {
        if (disabledLanguages.includes(lang.language)) return;
        if (onvalueChange) {
            onvalueChange(lang.language);
        }
        show = false;
    }

    function close() {
        show = false;
    }
</script>

<Modal bind:show title="Select Language">
    {#if showModeSwitch}
        <div class="panel-header">
            <StateSwitch 
                options={[
                    { id: 'Machine', label: 'Machine' },
                    { id: 'Neural', label: 'Neural' }
                ]} 
                bind:activeId={translationMode}
            />
        </div>
    {/if}
    <div class="panel-content">
        <div class="side-column">
            <span class="column-label">{m.most_used()}</span>
            {#each mostUsedList as lang (lang.language)}
                {@const isDisabled = disabledLanguages.includes(lang.language)}
                <button 
                    class="panel-item" 
                    class:active={value === lang.language} 
                    disabled={isDisabled}
                    onclick={() => select(lang)}
                >
                    {lang.language}
                </button>
            {/each}
        </div>
        <div class="main-column">
            <span class="column-label">{m.all_languages()}</span>
            <div class="panel-grid">
                {#each languages as lang (lang.language)}
                    {@const isSupported = !showModeSwitch || lang.support.some((s: string) => s.toLowerCase() === translationMode.toLowerCase())}
                    {@const isDisabled = disabledLanguages.includes(lang.language)}
                    <button 
                        class="panel-item" 
                        class:active={value === lang.language} 
                        disabled={!isSupported || isDisabled}
                        onclick={() => select(lang)}
                    >
                        {lang.language}
                    </button>
                {/each}
            </div>
        </div>
    </div>
</Modal>

<style>
    .panel-header {
        padding-top: var(--spacing-md);
        padding-bottom: var(--spacing-sm);
        display: flex;
        justify-content: center;
        flex-shrink: 0;
    }

    :global(.modal-body .state-switch) {
        width: 100%;
        max-width: 320px;
    }

    .panel-content {
        display: flex;
        justify-content: flex-start;
        gap: 3rem;
        flex: 1;
        padding-top: var(--spacing-sm);
    }

    @media (max-width: 600px) {
        .panel-content {
            flex-direction: column;
            gap: 2rem;
        }
    }

    .side-column {
        flex: 0 0 140px;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
    }

    .main-column {
        flex: 1;
    }

    .column-label {
        display: block;
        font-family: var(--font-sans);
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--secondary-text);
        margin-bottom: var(--spacing-sm);
        padding-left: 0.8rem; /* Align with button text, accounting for its horizontal padding */
    }

    .panel-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--spacing-sm);
    }

    @media (max-width: 900px) {
        .panel-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 400px) {
        .panel-grid {
            grid-template-columns: 1fr;
        }
    }

    .panel-item {
        display: block;
        width: 100%;
        padding: 0.6rem 0.8rem;
        text-align: left;
        background: none;
        border: none;
        font-family: var(--font-serif);
        font-size: 1.1rem;
        cursor: pointer;
        color: var(--text-color);
        transition: all var(--transition-fast);
        border-radius: var(--radius-sm);
    }

    .panel-item:hover:not(:disabled) {
        background-color: var(--hover-bg);
    }

    .panel-item:disabled {
        opacity: 0.25;
        cursor: not-allowed;
    }

    .panel-item.active {
        background-color: var(--text-color);
        color: var(--bg-color);
    }
</style>
