<script lang="ts">
    import Header from '$lib/components/Header.svelte';
    import Container from '$lib/components/Container.svelte';
    import Typography from '$lib/components/Typography.svelte';
    import Input from '$lib/components/Input.svelte';
    import Button from '$lib/components/Button.svelte';
    import ChatInput from '$lib/components/ChatInput.svelte';
    import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
    import Select from '$lib/components/Select.svelte';
    import Checkbox from '$lib/components/Checkbox.svelte';
    import Switch from '$lib/components/Switch.svelte';
    import Modal from '$lib/components/Modal.svelte';
    import Tabs from '$lib/components/Tabs.svelte';
    import Table from '$lib/components/Table.svelte';
    import Badge from '$lib/components/Badge.svelte';
    import Avatar from '$lib/components/Avatar.svelte';
    import Toast, { addToast } from '$lib/components/Toast.svelte';
    import Drawer from '$lib/components/Drawer.svelte';
    import Dropdown from '$lib/components/Dropdown.svelte';
    import FileUploader from '$lib/components/FileUploader.svelte';
    import AudioPlayer from '$lib/components/AudioPlayer.svelte';
    import SubtitleEditor from '$lib/components/SubtitleEditor.svelte';
    import DatePicker from '$lib/components/DatePicker.svelte';
    import TimeInput from '$lib/components/TimeInput.svelte';
    import Slider from '$lib/components/Slider.svelte';
    import AudiobookDesigner from '$lib/components/AudiobookDesigner.svelte';
    import FileDropZone from '$lib/components/FileDropZone.svelte';
    import FileUploadButton from '$lib/components/FileUploadButton.svelte';
    import LockScreen from '$lib/components/LockScreen.svelte';
    import StateSwitch from '$lib/components/StateSwitch.svelte';
    import Timeline from '$lib/components/Timeline.svelte';
    import ProgressBar from '$lib/components/ProgressBar.svelte';
    import ShortcutHints from '$lib/components/ShortcutHints.svelte';
    import VideoPreviewer from '$lib/components/VideoPreviewer.svelte';
    import AnnotationWrapper from '$lib/components/AnnotationWrapper.svelte';
    import AdvancedTextArea from '$lib/components/AdvancedTextArea.svelte';
    import * as m from '$lib/paraglide/messages.js';

    let chatValue = $state("");
    let sourceText = $state("");
    let targetText = $state("");
    let selectedVoice = $state("en-US");
    let showModal = $state(false);
    let showDrawer = $state(false);
    let showLockScreen = $state(false);
    let activeTab = $state("tab1");
    let currentState = $state("State 1");

    let timelineMode = $state<'TTS' | 'Subtitle'>('TTS');
    let timelineTracks = $state([
        { id: '1', speaker: 'Narrator', blocks: [
            { id: 'b1', start: 2, duration: 8, text: 'Once upon a time in a digital world...', state: 'rendered' as const, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }
        ], prompt: '', voice: 'en-US', emotion: 0.5 },
        { id: '2', speaker: 'Hero', blocks: [
            { id: 'b2', start: 12, duration: 5, text: 'Is anyone there?', state: 'none' as const }
        ], prompt: '', voice: 'en-US', emotion: 0.7 }
    ]);

    let selectedDate = $state("2025-12-23");
    let selectedTime = $state("14:30:00");
    let sliderValue = $state(50);
    let progressValue = $state(35);
    let showShortcuts = $state(false);
    let videoTime = $state(0);
    let videoDuration = $state(0);
    let videoPaused = $state(true);
    let videoVolume = $state(0.7);
    let videoMuted = $state(false);
    let advancedText = $state("Selected this text to see the floating toolbar. It's a powerful tool for quick actions.");
    let annotations = $state<Array<{ id: number; content: string; author: string; color?: string }>>([
        { id: 1, content: "This is a very important point.", author: "Julia", color: "var(--accent-color)" }
    ]);

    let audiobookBlocks = $state([
        { id: '1', label: 'Reader 1', content: 'The quick brown fox jumps over the lazy dog.', prompt: 'Read with a calm, steady voice.', voice: 'en-US-Wavenet-D', emotion: 0.5 }
    ]);

    let subtitles = $state([
        { id: "1", start: "00:00:01", end: "00:00:04", text: "Welcome to the Hermes AI demonstration." },
        { id: "2", start: "00:00:05", end: "00:00:08", text: "This is a minimalist subtitle editor component." }
    ]);

    const voiceOptions = [
        { value: "en-US", label: "English (US)" },
        { value: "zh-CN", label: "Chinese (Simplified)" },
        { value: "ja-JP", label: "Japanese" }
    ];

    const tableData = [
        { id: "001", name: "Project Alpha", status: "Active", date: "2025-12-01" },
        { id: "002", name: "Project Beta", status: "Pending", date: "2025-12-15" },
        { id: "003", name: "Project Gamma", status: "Completed", date: "2025-11-20" }
    ];

    function handleFileUpload(file: File) {
        addToast(`File "${file.name}" uploaded successfully!`, 'success');
    }
</script>

<Header />

<main>
    <Container size="large">
        <div class="welcome-section">
            <Typography element="h1" align="center">{m.welcome_back({ name: 'Julia' })}<br/>{m.how_can_i_help()}</Typography>
            
            <LanguageSwitcher source={sourceText} target={targetText} />
        </div>
    </Container>

    <Container size="large">
        <AudiobookDesigner bind:blocks={audiobookBlocks} />
    </Container>

    <Container size="large">
        <div class="timeline-demo">
            <div class="section-header">
                <Typography element="h2">{m.timeline_editor()}</Typography>
                <div class="mode-switch">
                    <Typography element="span">{m.mode()}: </Typography>
                    <StateSwitch 
                        states={['TTS', 'Subtitle']} 
                        bind:activeState={timelineMode} 
                    />
                </div>
            </div>
            
            <Timeline 
                mode={timelineMode} 
                bind:tracks={timelineTracks} 
                globalAudioUrl="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
            />
            
            <div class="timeline-hint">
                <Typography element="p">
                    <b>{m.tips()}:</b> {m.timeline_tip_add()} 
                    {#if timelineMode === 'TTS'}
                        {m.timeline_tip_render()}
                    {/if}
                </Typography>
            </div>
        </div>
    </Container>

    <hr />

    <Container size="medium">
        <Typography element="h2" align="center">{m.component_showcase()}</Typography>
        
        <div class="showcase">
            <section>
                <Typography element="h3">{m.state_switch()}</Typography>
                <StateSwitch 
                    states={["State 1", "State 2", "State 3"]} 
                    bind:activeState={currentState} 
                />
                <Typography element="p" style="margin-top: 1rem">Active: {currentState}</Typography>
            </section>

            <section>
                <Typography element="h3">{m.buttons()}</Typography>
                <div class="row">
                    <Button>Text Button</Button>
                    <Button variant="box">Box Button</Button>
                </div>
            </section>

            <section>
                <Typography element="h3">{m.inputs()}</Typography>
                <Input label="Underline Input" placeholder="Type here..." />
                <Input label="Box Input" variant="box" placeholder="Type here..." />
                <Input label="Multiline Box" variant="box" multiline placeholder="Type here..." />
            </section>

            <section>
                <Typography element="h3">{m.file_uploads()}</Typography>
                <div style="display: flex; flex-direction: column; gap: 2rem;">
                    <div>
                        <Typography element="p" style="margin-bottom: 1rem; opacity: 0.6;">Static Drop Zone:</Typography>
                        <FileDropZone onUpload={(f: File) => handleFileUpload(f)} />
                    </div>
                    <div style="display: flex; gap: 2rem; align-items: center;">
                        <div>
                            <Typography element="p" style="margin-bottom: 0.5rem; opacity: 0.6;">Button Trigger:</Typography>
                            <FileUploadButton variant="box" onUpload={(f: File) => handleFileUpload(f)} />
                        </div>
                        <div>
                            <Typography element="p" style="margin-bottom: 0.5rem; opacity: 0.6;">Link Trigger:</Typography>
                            <FileUploadButton variant="link" label="Click here to upload" onUpload={(f: File) => handleFileUpload(f)} />
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <Typography element="h3">{m.specialized_components()}</Typography>
                <Typography element="p">Language Switcher (with Mode Switch):</Typography>
                <LanguageSwitcher source={sourceText} target={targetText}/>

                <Typography element="p" style="margin-top: 2rem">Language Switcher (Simple):</Typography>
                <LanguageSwitcher source={sourceText} target={targetText} showModeSwitch={false} />
                
                <Typography element="p" style="margin-top: 2rem">Chat Input:</Typography>
                <ChatInput bind:value={chatValue} />
            </section>

            <section>
                <Typography element="h3">{m.data_selection()}</Typography>
                <div class="row">
                    <DatePicker label="Release Date" bind:value={selectedDate} />
                    <TimeInput label="Start Time" bind:value={selectedTime} />
                </div>
                <div class="row">
                    <Slider label="Volume Level" bind:value={sliderValue} />
                </div>
                <div class="row">
                    <Select label="Voice Selection" options={voiceOptions} bind:value={selectedVoice} />
                </div>
                <div class="row">
                    <Checkbox label="Remember me" />
                    <Switch label="Dark Mode" />
                </div>
            </section>

            <section>
                <Typography element="h3">{m.navigation_feedback()}</Typography>
                <Tabs items={[
                    {id: 'tab1', label: 'Overview'},
                    {id: 'tab2', label: 'Settings'},
                    {id: 'tab3', label: 'History'}
                ]} bind:activeId={activeTab} />
                
                <div class="row">
                    <Badge>New</Badge>
                    <Badge variant="outline">Draft</Badge>
                    <Badge variant="dot">Online</Badge>
                </div>

                <div class="row">
                    <Avatar name="Julia Smith" size="sm" />
                    <Avatar name="Hermes AI" size="md" />
                    <Avatar name="Admin User" size="lg" />
                </div>
            </section>

            <section>
                <Typography element="h3">{m.overlays_tables()}</Typography>
                <div class="row">
                    <Button variant="box" onclick={() => showModal = true}>Open Modal</Button>
                    <Button variant="box" onclick={() => showDrawer = true}>Open Drawer</Button>
                    <Button variant="box" onclick={() => showLockScreen = true}>Open Lock Screen</Button>
                    <Dropdown label="Actions" items={[
                        { label: 'Edit Profile', onClick: () => addToast('Edit clicked') },
                        { label: 'Settings', href: '/settings' },
                        { label: 'Logout', onClick: () => addToast('Logged out', 'error') }
                    ]} />
                </div>

                <div class="row" style="margin-top: 1rem;">
                    <Button variant="text" onclick={() => addToast('Operation successful!', 'success')}>Trigger Success Toast</Button>
                    <Button variant="text" onclick={() => addToast('Something went wrong', 'error')}>Trigger Error Toast</Button>
                </div>

                <Modal bind:show={showModal} title="Device Settings">
                    <Typography>Configure your assistant preferences here.</Typography>
                    <Input label="Device Name" placeholder="Hermes-01" />
                    {#snippet footer()}
                        <Button variant="text" onclick={() => showModal = false}>{m.cancel()}</Button>
                        <Button variant="box" onclick={() => showModal = false}>{m.save()}</Button>
                    {/snippet}
                </Modal>

                <Drawer bind:show={showDrawer} title="Activity History">
                    <Typography element="p">Recent interactions with Hermes AI.</Typography>
                    <div class="history-list">
                        {#each Array(5) as _, i (i)}
                            <div class="history-card">
                                <Typography element="h3">Session {5-i}</Typography>
                                <Typography element="p">2025-12-23 14:30</Typography>
                            </div>
                        {/each}
                    </div>
                </Drawer>

                <Table 
                    headers={["ID", "Project Name", "Status", "Last Updated"]} 
                    data={tableData} 
                />
            </section>

            <section>
                <Typography element="h3">{m.media_editing()}</Typography>
                <div class="row">
                    <AudioPlayer 
                        title="Narrative Design Overview" 
                        artist="Hermes Voice Engine"
                        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
                    />
                </div>
                <div class="row" style="margin-top: 1rem;">
                    <SubtitleEditor bind:subtitles />
                </div>
            </section>

            <section>
                <Typography element="h3">{m.advanced_controls()}</Typography>
                
                <div class="showcase-item">
                    <Typography element="p">Progress Bar with Markers:</Typography>
                    <ProgressBar 
                        bind:value={progressValue} 
                        markers={[
                            { id: 1, position: 20, label: "Intro", color: "var(--info-color)" },
                            { id: 2, position: 55, label: "Main Scene", color: "var(--accent-color)" },
                            { id: 3, position: 85, label: "Outro", color: "var(--success-color)" }
                        ]}
                        showValue={true} 
                    />
                </div>

                <div class="showcase-item">
                    <Typography element="p">Shortcut Hints:</Typography>
                    <Button variant="box" onclick={() => showShortcuts = true}>
                        Show Keyboard Shortcuts (Cmd + /)
                    </Button>
                    <ShortcutHints 
                        bind:active={showShortcuts} 
                        onClose={() => showShortcuts = false}
                        shortcuts={[
                            { id: '1', key: 'Ctrl + S', description: 'Save current project', category: 'File' },
                            { id: '2', key: 'Ctrl + Z', description: 'Undo last action', category: 'Edit' },
                            { id: '3', key: 'Space', description: 'Play / Pause Video', category: 'Playback' },
                            { id: '4', key: 'L', description: 'Add Marker Scale', category: 'Playback' }
                        ]}
                    />
                </div>

                <div class="showcase-item">
                    <Typography element="p">Video Previewer with Overlay:</Typography>
                    <VideoPreviewer 
                        src="https://www.w3schools.com/html/mov_bbb.mp4"
                        bind:currentTime={videoTime}
                        bind:duration={videoDuration}
                        bind:paused={videoPaused}
                        bind:volume={videoVolume}
                        bind:muted={videoMuted}
                    >
                        {#snippet topLeft()}
                            <div style="background: var(--accent-color); color: var(--bg-color); padding: 2px 8px; font-size: 0.8rem;">LIVE PREVIEW</div>
                        {/snippet}
                    </VideoPreviewer>
                </div>

                <div class="showcase-item">
                    <Typography element="p">Annotation Wrapper:</Typography>
                    <AnnotationWrapper 
                        bind:annotations={annotations}
                        onAddAnnotation={(content: string) => {
                            annotations = [...annotations, { id: Date.now(), content, author: 'You' }];
                        }}
                        onRemoveAnnotation={(id: string | number) => {
                            annotations = annotations.filter(a => a.id !== id);
                        }}
                    >
                        <span>
                            Hover or click this block of text to see or add annotations.
                        </span>
                    </AnnotationWrapper>
                </div>

                <div class="showcase-item">
                    <Typography element="p">Advanced TextArea (Select text below to see dynamic popovers):</Typography>
                    <AdvancedTextArea 
                        bind:value={advancedText}
                        actions={[
                            { id: 'bold', label: 'Bold', onClick: (sel) => addToast(`Formatting: ${sel} as bold`) },
                            { 
                                id: 'dict', 
                                label: 'Dict', 
                                popover: dictPopover
                            },
                            { 
                                id: 'ai', 
                                label: 'AI Fix', 
                                popover: aiPopover
                            }
                        ]}
                    />
                </div>

                {#snippet dictPopover({ selection, close }: { selection: string; close: () => void })}
                    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                        <Typography element="h3" style="margin: 0; font-family: var(--font-serif);">{m.definition()}</Typography>
                        
                        <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
                            <div style="width: 3px; background: var(--text-color); align-self: stretch;"></div>
                            <Typography element="p" style="font-size: 0.9rem; margin: 0; line-height: 1.4;">
                                Showing results for: <b style="word-break: break-all;">{selection}</b>
                            </Typography>
                        </div>

                        <hr style="margin: 0.25rem 0; border: none; border-top: 1px solid var(--border-color); opacity: 0.3;" />
                        
                        <Typography element="p" style="font-size: 0.85rem; line-height: 1.6;">
                            1. To specify or state authoritatively.
                        </Typography>

                        <Button 
                            variant="text" 
                            style="margin-top: 0.5rem; justify-content: flex-start; padding-left: 0;"
                            onclick={close}
                        >
                            {m.close()} &nbsp; &rarr;
                        </Button>
                    </div>
                {/snippet}

                {#snippet aiPopover({ selection, close, replace }: { selection: string; close: () => void; replace: (t: string) => void })}
                    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                         <Typography element="h4" style="margin: 0;">{m.ai_assistant()}</Typography>
                         <Typography element="p" style="font-size: 0.8rem; opacity: 0.7;">Improve your narrative structure</Typography>
                         <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                            <Button variant="box" style="font-size: 0.8rem; justify-content: space-between;" onclick={() => { 
                                replace("A highly professional version of: " + selection);
                                addToast('Improved!'); 
                            }}>
                                Make it professional <span>✨</span>
                            </Button>
                            <Button variant="box" style="font-size: 0.8rem; justify-content: space-between;" onclick={() => { 
                                replace(selection.toLowerCase());
                                addToast('Simplified!'); 
                            }}>
                                Simplify <span>📝</span>
                            </Button>
                         </div>
                    </div>
                {/snippet}
            </section>
        </div>
    </Container>
</main>

<Toast />

<FileUploader onUpload={handleFileUpload} />

<LockScreen 
    bind:show={showLockScreen} 
    lottiePath="https://lottie.host/80164628-98e3-4b6e-8566-73f1d86d639b/4S7m7W1j0Y.json"
>
    <div style="text-align: right; max-width: 600px;">
        <Typography element="h1" style="font-size: 5rem; line-height: 1.1; font-weight: 700; margin: 0; color: #1a1a1a;">
            Do something<br/>to<br/>change the world
        </Typography>
    </div>
</LockScreen>

<style>
    main {
        padding-top: 4rem;
    }

    .welcome-section {
        display: flex;
        flex-direction: column;
        gap: 3rem;
        margin-bottom: 6rem;
    }

    .timeline-demo {
        margin: 4rem 0;
    }

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
    }

    .mode-switch {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .timeline-hint {
        margin-top: 1rem;
        opacity: 0.7;
    }

    @media (max-width: 600px) {
        .welcome-section {
            gap: 1.5rem;
            margin-bottom: 3rem;
        }
    }

    .history-list {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        margin-top: 2rem;
    }

    .history-card {
        padding: 1rem;
        border-bottom: 1px solid #eee;
    }

    hr {
        margin: 8rem 0;
        border: none;
        border-top: 1px solid #eee;
    }

    @media (max-width: 600px) {
        hr {
            margin: 4rem 0;
        }
        main {
            padding-top: 2rem;
        }
    }

    .showcase {
        display: flex;
        flex-direction: column;
        gap: 4rem;
    }

    .row {
        display: flex;
        gap: 2rem;
        align-items: center;
        flex-wrap: wrap;
    }

    section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .showcase-item {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 2rem;
        border: 1px dashed var(--border-color);
        padding: 2rem;
    }

    .showcase-item:first-of-type {
        margin-top: 0;
    }
</style>

