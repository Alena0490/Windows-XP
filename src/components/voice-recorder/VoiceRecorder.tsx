import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import useDraggable from '../../hooks/useDraggable';
import useSound from '../../hooks/useSound';

import WindowSystemMenu from '../WindowsSystemMenu'
import VoiceRecorderMenu from './VoiceRecorderMenu'
import AboutDialog from '../AboutDialog'
import CriticalError from '../CriticalError';
import SaveAsModal from '../SaveAsModal';
import PropertiesModal from './PropertiesModal';

import Next from './img/Next.webp'
import Play from './img/Play.webp'
import Prev from './img/Prev.webp'
import Record from './img/Record.webp'
import RecorderIcon from '../../img/VolumeAlt.webp'
import Stop from './img/Stop.webp'


import '../../App.css'
import './VoiceRecorder.css'

interface VoiceRecorderProps {
    onClose: () => void;
    isMinimized: boolean;
    setIsMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;
    isFullscreen: boolean;
    toggleFullscreen: () => void;
    onMouseDown?: () => void;
    isActive?: boolean;
    globalVolume: number;
    globalMuted: boolean;
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
    onOpenFM: () => void;
    initialAudioUrl?: string | null;
    onInitialAudioConsumed?: () => void;
}

const VoiceRecorder = ({
    onClose,
    isMinimized,
    setIsMinimized,
    isFullscreen,
    toggleFullscreen,
    onMouseDown,
    isActive,
    globalVolume,
    globalMuted,
    plusTheme,
    onOpenFM,
    initialAudioUrl,
    onInitialAudioConsumed,
}:VoiceRecorderProps) => {
    const { position, handleMouseDown } = useDraggable(400, 150);
    const sounds = useSound(globalVolume, globalMuted);
    const themeSound = plusTheme === 'aquarium' ? sounds.aquarium
    : plusTheme === 'davinci' ? sounds.daVinci
    : plusTheme === 'nature' ? sounds.nature
    : plusTheme === 'space' ? sounds.space
    : null;

    // const playStart = () => themeSound ? themeSound.playOpen() : sounds.playStart();

    const [openModal, setOpenModal] = useState<'about' | 'properties' | null>(null);
    const [systemMenuOpen, setSystemMenuOpen] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recordPosition, setRecordPosition] = useState(0);
    const [length, setLength] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const [pendingAction, setPendingAction] = useState<'exit' | 'new' | null>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [savedName, setSavedName] = useState<string | null>(null);
    const [saveAsOpen, setSaveAsOpen] = useState(false);

    const recorderIconRef = useRef<HTMLImageElement>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const audioRef = useRef<HTMLAudioElement>(new Audio());
    const streamRef = useRef<MediaStream | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const mediaElementSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
    const animationRef = useRef<number | null>(null);

    const getAudioContext = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new AudioContext();
        }
        return audioContextRef.current;
    };

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

    // basic thin line
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(canvas.width, midY);
    ctx.stroke();

    // discrete vertical fluctuations only in areas with significant amplitude
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

        if (max < 0.03) continue; // silence, skip (only the basic line)

        const x = b * barSpacing + barSpacing / 2;
        const height = Math.min(max, 0.5) * midY;

        ctx.beginPath();
        ctx.moveTo(x, midY - height);
        ctx.lineTo(x, midY + height);
        ctx.stroke();
    }

    animationRef.current = requestAnimationFrame(drawWaveform);
};

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
        };

        recorder.onstop = () => {
            refreshAudioSrc();
        };

        recorder.start();
        mediaRecorderRef.current = recorder;

        setIsRecording(true);
        setRecordPosition(0);
        setLength(60);
        setHasChanges(true);

        intervalRef.current = setInterval(() => {
            setRecordPosition(prev => prev + 0.25);
        }, 250);
    };

    const handleStop = () => {
        if (isRecording) {
            mediaRecorderRef.current?.pause();
            refreshAudioSrc();

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

    const getDecodedBuffer = async (): Promise<AudioBuffer> => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const arrayBuffer = await blob.arrayBuffer();
        const audioContext = getAudioContext();
        return audioContext.decodeAudioData(arrayBuffer);
    };

    const applyGain = (buffer: AudioBuffer, factor: number): AudioBuffer => {
        for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
            const data = buffer.getChannelData(channel);
            for (let i = 0; i < data.length; i++) {
                data[i] = Math.max(-1, Math.min(1, data[i] * factor));
            }
        }
        return buffer;
    };

    const reverseBuffer = (buffer: AudioBuffer): AudioBuffer => {
        for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
            const data = buffer.getChannelData(channel);
            data.reverse();
        }
        return buffer;
    };

    const echoBuffer = (buffer: AudioBuffer, delaySeconds: number, decay: number): AudioBuffer => {
        const audioContext = getAudioContext();
        const delaySamples = Math.floor(delaySeconds * buffer.sampleRate);
        const newLength = buffer.length + delaySamples;

        const newBuffer = audioContext.createBuffer(
            buffer.numberOfChannels,
            newLength,
            buffer.sampleRate
        );

        for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
            const oldData = buffer.getChannelData(channel);
            const newData = newBuffer.getChannelData(channel);

            for (let i = 0; i < oldData.length; i++) {
                newData[i] += oldData[i];
            }

            for (let i = 0; i < oldData.length; i++) {
                const echoIndex = i + delaySamples;
                newData[echoIndex] += oldData[i] * decay;
            }

            for (let i = 0; i < newLength; i++) {
                newData[i] = Math.max(-1, Math.min(1, newData[i]));
            }
        }

        return newBuffer;
    };

    const resampleBuffer = (buffer: AudioBuffer, speedFactor: number): AudioBuffer => {
        const audioContext = getAudioContext();
        const newLength = Math.floor(buffer.length / speedFactor);
        const newBuffer = audioContext.createBuffer(
            buffer.numberOfChannels,
            newLength,
            buffer.sampleRate
        );

        for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
            const oldData = buffer.getChannelData(channel);
            const newData = newBuffer.getChannelData(channel);
            for (let i = 0; i < newLength; i++) {
                const oldIndex = i * speedFactor;
                const index0 = Math.floor(oldIndex);
                const index1 = Math.min(index0 + 1, oldData.length - 1);
                const frac = oldIndex - index0;
                newData[i] = oldData[index0] * (1 - frac) + oldData[index1] * frac;
            }
        }

        return newBuffer;
    };

    const bufferToWavBlob = (buffer: AudioBuffer): Blob => {
        const numChannels = buffer.numberOfChannels;
        const sampleRate = buffer.sampleRate;
        const numSamples = buffer.length;
        const bytesPerSample = 2;
        const blockAlign = numChannels * bytesPerSample;
        const dataSize = numSamples * blockAlign;

        const arrayBuffer = new ArrayBuffer(44 + dataSize);
        const view = new DataView(arrayBuffer);

        const writeString = (offset: number, str: string) => {
            for (let i = 0; i < str.length; i++) {
                view.setUint8(offset + i, str.charCodeAt(i));
            }
        };

        writeString(0, 'RIFF');
        view.setUint32(4, 36 + dataSize, true);
        writeString(8, 'WAVE');
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * blockAlign, true);
        view.setUint16(32, blockAlign, true);
        view.setUint16(34, 16, true);
        writeString(36, 'data');
        view.setUint32(40, dataSize, true);

        let offset = 44;
        for (let i = 0; i < numSamples; i++) {
            for (let channel = 0; channel < numChannels; channel++) {
                const sample = buffer.getChannelData(channel)[i];
                const clamped = Math.max(-1, Math.min(1, sample));
                view.setInt16(offset, clamped * 0x7fff, true);
                offset += 2;
            }
        }

        return new Blob([arrayBuffer], { type: 'audio/wav' });
    };

    const refreshAudioSrc = () => {
        if (chunksRef.current.length === 0) return;
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        audioRef.current.src = URL.createObjectURL(blob);
    };

    const applyVolumeChange = async (factor: number) => {
        if (length === 0) return;

        const decoded = await getDecodedBuffer();
        const adjusted = applyGain(decoded, factor);
        const wavBlob = bufferToWavBlob(adjusted);

        audioRef.current.src = URL.createObjectURL(wavBlob);
        chunksRef.current = [wavBlob];
        setHasChanges(true);
    };

    const applyReverse = async () => {
        if (length === 0) return;

        const decoded = await getDecodedBuffer();
        const reversed = reverseBuffer(decoded);
        const wavBlob = bufferToWavBlob(reversed);

        audioRef.current.src = URL.createObjectURL(wavBlob);
        chunksRef.current = [wavBlob];
        setHasChanges(true);
    };

    const applyEcho = async () => {
        if (length === 0) return;

        const decoded = await getDecodedBuffer();
        const echoed = echoBuffer(decoded, 0.3, 0.5);
        const wavBlob = bufferToWavBlob(echoed);

        audioRef.current.src = URL.createObjectURL(wavBlob);
        chunksRef.current = [wavBlob];
        setLength(echoed.duration);
        setHasChanges(true);
    };

    const applySpeedChange = async (speedFactor: number) => {
        if (length === 0) return;

        const decoded = await getDecodedBuffer();
        const resampled = resampleBuffer(decoded, speedFactor);
        const wavBlob = bufferToWavBlob(resampled);

        audioRef.current.src = URL.createObjectURL(wavBlob);
        chunksRef.current = [wavBlob];
        setLength(resampled.duration);
        setHasChanges(true);
    };

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

    useEffect(() => {
        drawIdleLine();
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, []);

    const loadedAudioUrlRef = useRef<string | null>(null);

    useEffect(() => {
        if (!initialAudioUrl) return;
        if (loadedAudioUrlRef.current === initialAudioUrl) return;
        loadedAudioUrlRef.current = initialAudioUrl;
        const audio = audioRef.current;
        audio.src = initialAudioUrl;
        const onLoaded = () => {
            setLength(isFinite(audio.duration) ? audio.duration : 0);
            setRecordPosition(0);
            setHasChanges(false);
            setSavedName(null);
            onInitialAudioConsumed?.();
        };
        audio.addEventListener('loadedmetadata', onLoaded, { once: true });
        audio.load();
    }, [initialAudioUrl, onInitialAudioConsumed]);

    useEffect(() => {
        if (pendingAction) {
            if (themeSound) themeSound.playExclamation();
            else sounds.playExclamation();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pendingAction]);

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

    const skip = (delta: number) => {
        const target = Math.min(Math.max(recordPosition + delta, 0), length);
        audioRef.current.currentTime = target;
        setRecordPosition(target);
    };

    const handleExit = () => {
        if (hasChanges) { setPendingAction('exit'); return; }
        onClose();
    };

    const resetRecording = () => {
        audioRef.current.pause();
        audioRef.current.src = '';
        chunksRef.current = [];
        setRecordPosition(0);
        setLength(0);
        setIsPlaying(false);
        setSavedName(null);
        setHasChanges(false);
        mediaRecorderRef.current = null;
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
    };

    const handleNew = () => {
        if (hasChanges) { setPendingAction('new'); return; }
        resetRecording();
    };

    const writeFile = (name: string) => {
        const a = document.createElement('a');
        a.download = name;
        a.href = audioRef.current.src;
        a.click();
        setSavedName(name);
        setHasChanges(false);
    };

    const handleSave = () => {
        if (savedName) writeFile(savedName);
        else setSaveAsOpen(true);
    };

    const handleSaveAs = () => setSaveAsOpen(true);

    const handleSaveAsConfirm = (name: string) => {
        writeFile(name);
        setSaveAsOpen(false);
    };

    const handleUnsavedYes = () => {
        handleSave();
        const action = pendingAction;
        setPendingAction(null);
        if (action === 'new') resetRecording();
        else onClose();
    };

    const handleUnsavedNo = () => {
        const action = pendingAction;
        setPendingAction(null);
        setHasChanges(false);
        if (action === 'new') resetRecording();
        else onClose();
    };

  return (
         <div
            className={[
                'app-window',
                'recorder-window',
                isActive && (!openModal || openModal === 'about') && 'app-window--active',
                isMinimized && 'recorder--minimized',
                isMinimized && 'app-window--minimized',
                isFullscreen && 'recorder--fullscreen',
                isFullscreen && 'app-window--fullscreen',
            ].filter(Boolean).join(' ')}
            style={isFullscreen ? {} : { left: position.x, top: position.y }}
            onMouseDown={onMouseDown}
        >
             <div className='title-bar' onMouseDown={handleMouseDown}>
                <span className='title-bar-text'>
                    <img 
                        className='recorder-icon' 
                        src={RecorderIcon} 
                        alt='Outlook Express'
                        ref={recorderIconRef}
                        onClick={() => setSystemMenuOpen(prev => !prev)} 
                    />
                    {systemMenuOpen && (
                        <WindowSystemMenu
                            open={systemMenuOpen}
                            onRequestClose={() => setSystemMenuOpen(false)}
                            triggerRef={recorderIconRef}
                            isFullscreen={isFullscreen}
                            onRestore={() => toggleFullscreen()}
                            onMove={() => {}}
                            onSize={() => {}}
                            onMinimize={() => setIsMinimized(true)}
                            onMaximize={() => { setIsMinimized(false); toggleFullscreen(); }}
                            onClose={handleExit}
                        />
                    )}
                    Sound - Sound Recorder
                </span>
                <div className='title-bar-buttons xp-title-controls'>
                    <button
                        type='button'
                        className='xp-title-control btn-minimize'
                        onClick={() => setIsMinimized(true)}
                        aria-label='Minimize'
                    >
                        _
                    </button>
                    <button
                        type='button'
                        className={`xp-title-control ${isFullscreen ? 'btn-restore' : 'btn-maximize'}`}
                        onClick={() => {
                            setIsMinimized(false);
                            toggleFullscreen();
                        }}
                        aria-label={isFullscreen ? 'Restore' : 'Maximize'}
                        disabled
                    >
                        {isFullscreen ? '❐' : '□'}
                    </button>
                    <button
                        type='button'
                        className='xp-title-control btn-close'
                        onClick={handleExit}
                        aria-label='Close'
                    >
                        ✕
                    </button>
                </div>
            </div>
            <VoiceRecorderMenu
                onClose={handleExit}
                onOpenAbout={() => setOpenModal('about')}
                onOpenProperties={() => setOpenModal('properties')}
                globalVolume={globalVolume}
                globalMuted={globalMuted}
                plusTheme={plusTheme}
                handleNew={handleNew}
                onOpenFM={onOpenFM}
                onSave={handleSave}
                onSaveAs={handleSaveAs}
                onIncreaseVolume={() => applyVolumeChange(1.25)}
                onDecreaseVolume={() => applyVolumeChange(0.75)}
                onIncreaseSpeed={() => applySpeedChange(2)}
                onDecreaseSpeed={() => applySpeedChange(0.5)}
                onAddEcho={applyEcho}
                onReverse={applyReverse}     
            />
        
        <div className="recorder-body">
            <div className="top-bar">
                <div className="inner-box">
                    <p>Position:</p>
                    <p>{recordPosition.toFixed(2)} sec.</p>
                </div>

                <div className="inner-box middle">
                    <canvas ref={canvasRef} width={140} height={40} />
                </div>

                <div className="inner-box">
                    <p>Length:</p>
                    <p>{length.toFixed(2)} sec.</p>
                </div>
            </div>

            <div className="recorder-slider">
                <input
                    type="range"
                    min="0"
                    max={length || 0}
                    step="0.01"
                    value={recordPosition}
                    onChange={(e) => {
                        const value = Number(e.target.value);
                        audioRef.current.currentTime = value;
                        setRecordPosition(value);
                    }}
                    disabled={isRecording || length === 0}
                />
            </div>
      
            <div className="recorder-buttons">
                <button aria-label='Prev' onClick={() => skip(-0.5)} disabled={isRecording || length === 0}>
                    <img src={Prev} alt="" />
                </button>
                <button aria-label='Next' onClick={() => skip(0.5)} disabled={isRecording || length === 0}>
                    <img src={Next} alt="" />
                </button>
                <button aria-label='Play' onClick={play} disabled={isRecording || isPlaying || length === 0}>
                    <img src={Play} alt="" />
                </button>
                <button aria-label='Stop' onClick={handleStop} disabled={!isRecording && !isPlaying}>
                    <img src={Stop} alt="" />
                </button>
                <button aria-label='Record' onClick={startRecording} disabled={isRecording}>
                    <img src={Record} alt="" />
                </button>
            </div>
        </div>
        {openModal === 'about' && createPortal(
            <AboutDialog
                title='Sound Recorder'
                onClose={() => setOpenModal(null)}
                style={{
                    position: 'fixed',
                    top: position.y + 120,
                    left: position.x + 150,
                }}
            />,
            document.body
        )}

        {pendingAction && createPortal(
            <CriticalError
                type='unsavedChanges'
                titleBarOverride='Sound Recorder'
                messageOverride={[
                    'The current sound has changed.',
                    'Do you want to save the changes?',
                ]}
                onClose={() => setPendingAction(null)}
                onYes={handleUnsavedYes}
                onNo={handleUnsavedNo}
                onCancel={() => setPendingAction(null)}
            />,
            document.body
        )}

        {openModal === 'properties' && createPortal(
            <PropertiesModal onClose={() => setOpenModal(null)} />,
            document.body
        )}

        {saveAsOpen && createPortal(
            <SaveAsModal
                title='Save As'
                initialName={savedName ?? 'Sound.webm'}
                onSave={handleSaveAsConfirm}
                onClose={() => setSaveAsOpen(false)}
            />,
            document.body
        )}
    </div>
  )
}

export default VoiceRecorder