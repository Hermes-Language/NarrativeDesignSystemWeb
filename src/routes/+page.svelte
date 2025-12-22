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
    import TranslationArea from '$lib/components/TranslationArea.svelte';
    import FileUploader from '$lib/components/FileUploader.svelte';
    import AudioPlayer from '$lib/components/AudioPlayer.svelte';
    import SubtitleEditor from '$lib/components/SubtitleEditor.svelte';
    import DatePicker from '$lib/components/DatePicker.svelte';
    import TimeInput from '$lib/components/TimeInput.svelte';
    import Slider from '$lib/components/Slider.svelte';
    import AudiobookDesigner from '$lib/components/AudiobookDesigner.svelte';
    import FileDropZone from '$lib/components/FileDropZone.svelte';
    import FileUploadButton from '$lib/components/FileUploadButton.svelte';

    let email = $state("");
    let password = $state("");
    let chatValue = $state("");
    let sourceText = $state("");
    let targetText = $state("");
    let selectedVoice = $state("en-US");
    let showModal = $state(false);
    let showDrawer = $state(false);
    let activeTab = $state("tab1");

    let selectedDate = $state("2025-12-23");
    let selectedTime = $state("14:30:00");
    let sliderValue = $state(50);

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

    function handleFileUpload(file: any) {
        addToast(`File "${file.name}" uploaded successfully!`, 'success');
    }
</script>

<Header />

<main>
    <Container size="large">
        <div class="welcome-section">
            <Typography element="h1" align="center">Welcome back, Juila.<br/>What can I help you today?</Typography>
            
            <LanguageSwitcher />
            
            <TranslationArea bind:sourceText bind:targetText />
        </div>
    </Container>

    <Container size="large">
        <AudiobookDesigner bind:blocks={audiobookBlocks} />
    </Container>

    <hr />

    <Container size="medium">
        <Typography element="h2" align="center">Component Showcase</Typography>
        
        <div class="showcase">
            <section>
                <Typography element="h3">Buttons</Typography>
                <div class="row">
                    <Button>Text Button</Button>
                    <Button variant="box">Box Button</Button>
                </div>
            </section>

            <section>
                <Typography element="h3">Inputs</Typography>
                <Input label="Underline Input" placeholder="Type here..." />
                <Input label="Box Input" variant="box" placeholder="Type here..." />
                <Input label="Multiline Box" variant="box" multiline placeholder="Type here..." />
            </section>

            <section>
                <Typography element="h3">File Uploads</Typography>
                <div style="display: flex; flex-direction: column; gap: 2rem;">
                    <div>
                        <Typography element="p" style="margin-bottom: 1rem; opacity: 0.6;">Static Drop Zone:</Typography>
                        <FileDropZone onUpload={(f: any) => handleFileUpload(f)} />
                    </div>
                    <div style="display: flex; gap: 2rem; align-items: center;">
                        <div>
                            <Typography element="p" style="margin-bottom: 0.5rem; opacity: 0.6;">Button Trigger:</Typography>
                            <FileUploadButton variant="box" onUpload={(f: any) => handleFileUpload(f)} />
                        </div>
                        <div>
                            <Typography element="p" style="margin-bottom: 0.5rem; opacity: 0.6;">Link Trigger:</Typography>
                            <FileUploadButton variant="link" label="Click here to upload" onUpload={(f: any) => handleFileUpload(f)} />
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <Typography element="h3">Specialized Components</Typography>
                <Typography element="p">Language Switcher:</Typography>
                <LanguageSwitcher />
                
                <Typography element="p">Chat Input:</Typography>
                <ChatInput bind:value={chatValue} />
            </section>

            <section>
                <Typography element="h3">Data & Selection</Typography>
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
                <Typography element="h3">Navigation & Feedback</Typography>
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
                <Typography element="h3">Overlays & Tables</Typography>
                <div class="row">
                    <Button variant="box" onclick={() => showModal = true}>Open Modal</Button>
                    <Button variant="box" onclick={() => showDrawer = true}>Open Drawer</Button>
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
                        <Button variant="text" onclick={() => showModal = false}>Cancel</Button>
                        <Button variant="box" onclick={() => showModal = false}>Save Changes</Button>
                    {/snippet}
                </Modal>

                <Drawer bind:show={showDrawer} title="Activity History">
                    <Typography element="p">Recent interactions with Hermes AI.</Typography>
                    <div class="history-list">
                        {#each Array(5) as _, i}
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
                <Typography element="h3">Media & Editing</Typography>
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
        </div>
    </Container>
</main>

<Toast />

<FileUploader onUpload={handleFileUpload} />

<style>
    main {
        padding-top: 4rem;
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

    .showcase {
        display: flex;
        flex-direction: column;
        gap: 4rem;
    }

    .row {
        display: flex;
        gap: 2rem;
        align-items: center;
    }

    section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
</style>

