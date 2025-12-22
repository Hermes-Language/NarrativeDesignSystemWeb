<script lang="ts">
    let { sourceText = $bindable(""), targetText = $bindable("") } = $props();

    const placeholder = "输入些东西，或者使用快捷键直接粘贴到这。当这里出现了文字将会自动翻译或者拖拽文件过来";
</script>

<div class="translation-container">
    <div class="main-area">
        <div class="side left">
            <textarea 
                bind:value={sourceText} 
                {placeholder}
            ></textarea>
            <div class="toolbar">
                <button aria-label="Settings">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="12" x2="15" y2="12"></line><line x1="17" y1="16" x2="23" y2="16"></line>
                    </svg>
                </button>
                <button aria-label="History">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </button>
                <button aria-label="Upload">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                </button>
            </div>
        </div>

        <div class="divider"></div>

        <div class="side right">
            <div class="result-text">
                {targetText}
            </div>
            <div class="toolbar">
                <button aria-label="Listen">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</div>

<style>
    .translation-container {
        width: 100%;
        height: 60vh;
        min-height: 400px;
        margin-top: 2rem;
    }

    @media (max-width: 768px) {
        .translation-container {
            height: auto;
        }
    }

    .main-area {
        display: flex;
        height: 100%;
        position: relative;
    }

    @media (max-width: 768px) {
        .main-area {
            flex-direction: column;
        }
    }

    .side {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 0 2rem;
    }

    @media (max-width: 768px) {
        .side {
            padding: 1rem 0;
            min-height: 200px;
        }
    }

    .divider {
        width: 1px;
        background-color: var(--border-color);
        height: 100%;
    }

    @media (max-width: 768px) {
        .divider {
            width: 100%;
            height: 1px;
        }
    }

    textarea {
        flex: 1;
        border: none;
        background: transparent;
        outline: none;
        font-family: var(--font-serif);
        font-size: 1.5rem;
        color: var(--text-color);
        resize: none;
        padding-top: 1rem;
    }

    textarea::placeholder {
        color: #bbb;
    }

    .result-text {
        flex: 1;
        font-family: var(--font-serif);
        font-size: 1.5rem;
        color: var(--text-color);
        padding-top: 1rem;
    }

    .toolbar {
        display: flex;
        gap: 1.5rem;
        padding: 2rem 0;
    }

    .toolbar button {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--text-color);
        padding: 0;
        opacity: 0.8;
        transition: opacity 0.2s;
    }

    .toolbar button:hover {
        opacity: 1;
    }
</style>
