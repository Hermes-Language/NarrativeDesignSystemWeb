export function getAudioDuration(file: File): Promise<number> {
    return new Promise((resolve) => {
        const audio = new Audio();
        const url = URL.createObjectURL(file);
        audio.src = url;
        audio.onloadedmetadata = () => {
            resolve(audio.duration);
            URL.revokeObjectURL(url);
        };
    });
}

export function probeAudioDurationFromUrl(
    audioUrl: string,
    fallbackDuration = 2.0,
    timeoutMs = 5000
): Promise<number> {
    return new Promise((resolve) => {
        const audioProbe = new Audio(audioUrl);
        let settled = false;

        const finish = (duration: number) => {
            if (settled) return;
            settled = true;
            resolve(duration);
        };

        audioProbe.onloadedmetadata = () => {
            finish(audioProbe.duration);
        };

        audioProbe.onerror = () => {
            finish(fallbackDuration);
        };

        setTimeout(() => {
            finish(fallbackDuration);
        }, timeoutMs);
    });
}
