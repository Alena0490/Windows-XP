import { useState, useRef, useEffect } from 'react';

export default function useVoiceRecorderCore(
    initialAudioUrl?: string | null,
    onInitialAudioConsumed?: () => void
) {
    const [isRecording, setIsRecording] = useState(false);
    const [recordPosition, setRecordPosition] = useState(0);
    const [length, setLength] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const audioRef = useRef<HTMLAudioElement>(new Audio());
    const streamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const mediaElementSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
    const animationRef = useRef<number | null>(null);
    const loadedAudioUrlRef = useRef<string | null>(null);

    // lazily create a single AudioContext, reused across effects/playback
    const getAudioContext = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new AudioContext();
        }
        return audioContextRef.current;
    };

    // draws the flat green baseline shown when nothing is playing
    const drawIdleLine = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
    };

    // rAF loop: samples the analyser and draws the live waveform bars
    const drawWaveform = () => {
        const canvas = canvasRef.current;
        const analyser = analyserRef.current;
        if (!canvas || !analyser) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const bufferLength = analyser.fftSize;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 1;

        const midY = canvas.height / 2;

        ctx.beginPath();
        ctx.moveTo(0, midY);
        ctx.lineTo(canvas.width, midY);
        ctx.stroke();

        const barCount = 24;
        const barSpacing = canvas.width / barCount;
        const samplesPerBar = Math.floor(bufferLength / barCount);

        for (let b = 0; b < barCount; b++) {
            let max = 0;
            for (let i = 0; i < samplesPerBar; i++) {
                const index = b * samplesPerBar + i;
                const v = Math.abs(dataArray[index] - 128) / 128;
                if (v > max) max = v;
            }

            if (max < 0.03) continue;

            const x = b * barSpacing + barSpacing / 2;
            const height = Math.min(max, 0.5) * midY;

            ctx.beginPath();
            ctx.moveTo(x, midY - height);
            ctx.lineTo(x, midY + height);
            ctx.stroke();
        }

        animationRef.current = requestAnimationFrame(drawWaveform);
    };

    // re-encode current chunks into a fresh object URL on the audio element
    const refreshAudioSrc = () => {
        if (chunksRef.current.length === 0) return;
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        audioRef.current.src = URL.createObjectURL(blob);
    };

    // recording controls: resume a paused recorder or start a fresh mic stream
    const startRecording = async () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
            mediaRecorderRef.current.resume();
            setIsRecording(true);
            intervalRef.current = setInterval(() => {
                setRecordPosition(prev => prev + 0.25);
            }, 250);
            animationRef.current = requestAnimationFrame(drawWaveform);
            return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        chunksRef.current = [];

        const audioContext = getAudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analyserRef.current = analyser;
        animationRef.current = requestAnimationFrame(drawWaveform);

        const recorder = new MediaRecorder(stream);

        recorder.ondataavailable = (e) => {
            chunksRef.current.push(e.data);
            refreshAudioSrc();
        };

        recorder.onstop = () => {
            refreshAudioSrc();
        };

        recorder.start();
        mediaRecorderRef.current = recorder;

        setIsRecording(true);
        setRecordPosition(0);
        setLength(60);

        intervalRef.current = setInterval(() => {
            setRecordPosition(prev => prev + 0.25);
        }, 250);
    };

    // pauses the recorder if recording, stops playback if playing
    const handleStop = () => {
        if (isRecording) {
            mediaRecorderRef.current?.requestData();
            mediaRecorderRef.current?.pause();

            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }

            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }
            drawIdleLine();

            setIsRecording(false);
        } else if (isPlaying) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;

            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }
            drawIdleLine();

            setIsPlaying(false);
            setRecordPosition(0);
        }
    };

    // decode current chunks into an AudioBuffer for effects processing
    const getDecodedBuffer = async (): Promise<AudioBuffer> => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const arrayBuffer = await blob.arrayBuffer();
        const audioContext = getAudioContext();
        return audioContext.decodeAudioData(arrayBuffer);
    };

    // playback controls: route audio element through analyser + speakers
    const play = () => {
        refreshAudioSrc();
        const audioContext = getAudioContext();

        if (!mediaElementSourceRef.current) {
            mediaElementSourceRef.current = audioContext.createMediaElementSource(audioRef.current);
            mediaElementSourceRef.current.connect(audioContext.destination);
        }

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        mediaElementSourceRef.current.connect(analyser);
        analyserRef.current = analyser;

        audioRef.current.play();
        setIsPlaying(true);
        animationRef.current = requestAnimationFrame(drawWaveform);
    };

    // jump forward/backward, clamped to [0, length]
    const skip = (delta: number) => {
        const target = Math.min(Math.max(recordPosition + delta, 0), length);
        audioRef.current.currentTime = target;
        setRecordPosition(target);
    };

    // clear all buffers, release the mic stream, restore idle state
    const resetRecording = () => {
        audioRef.current.pause();
        audioRef.current.src = '';
        chunksRef.current = [];
        setRecordPosition(0);
        setLength(0);
        setIsPlaying(false);
        mediaRecorderRef.current = null;
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
    };

    // wire audio-element listeners once: ended resets, timeupdate drives the scrubber
    useEffect(() => {
        const audio = audioRef.current;

        const onEnded = () => {
            setIsPlaying(false);
            setRecordPosition(0);
        };

        const onTimeUpdate = () => {
            setRecordPosition(audio.currentTime);
        };

        audio.addEventListener('ended', onEnded);
        audio.addEventListener('timeupdate', onTimeUpdate);

        return () => {
            audio.removeEventListener('ended', onEnded);
            audio.removeEventListener('timeupdate', onTimeUpdate);
        };
    }, []);

    // paint the idle baseline on mount, cancel any pending rAF on unmount
    useEffect(() => {
        drawIdleLine();
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, []);

    // load audio when opened via File Manager (initialAudioUrl passed once, then consumed)
    useEffect(() => {
        if (!initialAudioUrl) return;
        if (loadedAudioUrlRef.current === initialAudioUrl) return;
        loadedAudioUrlRef.current = initialAudioUrl;
        const audio = audioRef.current;
        audio.src = initialAudioUrl;
        const onLoaded = () => {
            setLength(isFinite(audio.duration) ? audio.duration : 0);
            setRecordPosition(0);
            onInitialAudioConsumed?.();
        };
        audio.addEventListener('loadedmetadata', onLoaded, { once: true });
        audio.load();
    }, [initialAudioUrl, onInitialAudioConsumed]);

    return {
        isRecording,
        recordPosition,
        length,
        isPlaying,
        canvasRef,
        audioRef,
        chunksRef,
        getAudioContext,
        getDecodedBuffer,
        startRecording,
        handleStop,
        play,
        skip,
        resetRecording,
        refreshAudioSrc,
        setLength,
        setRecordPosition,
    };
}