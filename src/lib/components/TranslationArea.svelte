<script lang="ts">
    import { SettingConfig, History, Upload, VolumeNotice } from '@icon-park/svg';
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
                    {@html SettingConfig({ size: 20 })}
                </button>
                <button aria-label="History">
                    {@html History({ size: 20 })}
                </button>
                <button aria-label="Upload">
                    {@html Upload({ size: 20 })}
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
                    {@html VolumeNotice({ size: 20 })}
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
            padding: 1.5rem 0;
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

    @media (max-width: 768px) {
        textarea {
            font-size: 1.2rem;
            min-height: 120px;
        }
    }

    textarea::placeholder {
        color: var(--secondary-text);
    }

    .result-text {
        flex: 1;
        font-family: var(--font-serif);
        font-size: 1.5rem;
        color: var(--text-color);
        padding-top: 1rem;
    }

    @media (max-width: 768px) {
        .result-text {
            font-size: 1.2rem;
            min-height: 120px;
        }
    }

    .toolbar {
        display: flex;
        gap: 1.5rem;
        padding: 2rem 0;
    }

    @media (max-width: 768px) {
        .toolbar {
            padding: 1rem 0;
            gap: 1rem;
        }
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
