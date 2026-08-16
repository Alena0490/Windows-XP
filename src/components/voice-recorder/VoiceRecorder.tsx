import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import useDraggable from '../../hooks/useDraggable';
import useSound from '../../hooks/useSound';

import WindowSystemMenu from '../WindowsSystemMenu'
import VoiceRecorderMenu from './VoiceRecorderMenu'
import AboutDialog from '../AboutDialog'
import CriticalError from '../CriticalError';

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
    plusTheme
}:VoiceRecorderProps) => {
    const { position, handleMouseDown } = useDraggable(400, 150);
    const sounds = useSound(globalVolume, globalMuted);
    const themeSound = plusTheme === 'aquarium' ? sounds.aquarium
    : plusTheme === 'davinci' ? sounds.daVinci
    : plusTheme === 'nature' ? sounds.nature
    : plusTheme === 'space' ? sounds.space
    : null;

    const [openModal, setOpenModal] = useState<'about' | 'properties' | null>(null);
    const [systemMenuOpen, setSystemMenuOpen] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recordPosition, setRecordPosition] = useState(0);
    const [length, setLength] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const [pendingAction, setPendingAction] = useState<'exit' | null>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [savedName, setSavedName] = useState<string | null>(null);

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
            const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
            audioRef.current.src = URL.createObjectURL(blob);
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
            mediaRecorderRef.current?.stop();
            streamRef.current?.getTracks().forEach((t) => t.stop());

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
            setRecordPosition(0);
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

    useEffect(() => {
        if (pendingAction) {
            if (themeSound) themeSound.playExclamation();
            else sounds.playExclamation();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pendingAction]);

    const play = () => {
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

    const handleSave = () => {
        const name = savedName ?? 'Sound.webm';
        const a = document.createElement('a');
        a.download = name;
        a.href = audioRef.current.src;
        a.click();
        setSavedName(name);
        setHasChanges(false);
    };

    const handleUnsavedYes = () => {
        handleSave();
        setPendingAction(null);
        onClose();
    };

    const handleUnsavedNo = () => {
        setPendingAction(null);
        setHasChanges(false);
        onClose();
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
    </div>
  )
}

export default VoiceRecorder