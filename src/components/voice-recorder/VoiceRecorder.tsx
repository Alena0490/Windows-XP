import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import useDraggable from '../../hooks/useDraggable';
import useSound from '../../hooks/useSound';
import useVoiceRecorderCore from './hooks/useVoiceRecorder';
import {applyGain, bufferToWavBlob, echoBuffer, resampleBuffer, reverseBuffer } from './hooks/Audioeffects'

import WindowSystemMenu from '../WindowsSystemMenu'
import VoiceRecorderMenu from './VoiceRecorderMenu'
import AboutDialog from '../AboutDialog'
import CriticalError from '../CriticalError';
import SaveAsModal from '../SaveAsModal';
import PropertiesModal from './PropertiesModal';
import OpenModal from '../files/open-modal/OpenModal';
import type { FMItem } from '../files/data/types';

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
    onOpenFM?: () => void;
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

    // local audio URL picked via the OpenModal — fed through the same one-shot
    // load pipeline the FileManager picker uses (initialAudioUrl).
    const [localPickedUrl, setLocalPickedUrl] = useState<string | null>(null);
    const [openPickerOpen, setOpenPickerOpen] = useState(false);
    const effectiveInitialUrl = initialAudioUrl ?? localPickedUrl;

    // recorder core: playback/record state, refs, and controls
    const {
    isRecording, recordPosition, length, isPlaying,
        canvasRef, audioRef, chunksRef,
        getAudioContext, getDecodedBuffer,
        startRecording, handleStop, play, skip, resetRecording, setLength, setRecordPosition
    } = useVoiceRecorderCore(effectiveInitialUrl, () => {
        if (initialAudioUrl) onInitialAudioConsumed?.();
        else setLocalPickedUrl(null);
    });

    // modal + system menu state
    const [openModal, setOpenModal] = useState<'about' | 'properties' | null>(null);
    const [systemMenuOpen, setSystemMenuOpen] = useState(false);

    // save/exit flow state
    const [pendingAction, setPendingAction] = useState<'exit' | 'new' | null>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [savedName, setSavedName] = useState<string | null>(null);
    const [saveAsOpen, setSaveAsOpen] = useState(false);

    const recorderIconRef = useRef<HTMLImageElement>(null);

    // audio effect handlers — decode current buffer, transform, re-encode as WAV
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
        const echoed = echoBuffer(getAudioContext(), decoded, 0.3, 0.5);
        const wavBlob = bufferToWavBlob(echoed);

        audioRef.current.src = URL.createObjectURL(wavBlob);
        chunksRef.current = [wavBlob];
        setLength(echoed.duration);
        setHasChanges(true);
    };

    const applySpeedChange = async (speedFactor: number) => {
        if (length === 0) return;

        const decoded = await getDecodedBuffer();
        const resampled = resampleBuffer(getAudioContext(), decoded, speedFactor);
        const wavBlob = bufferToWavBlob(resampled);

        audioRef.current.src = URL.createObjectURL(wavBlob);
        chunksRef.current = [wavBlob];
        setLength(resampled.duration);
        setHasChanges(true);
    };

    // play exclamation when unsaved-changes dialog opens
    useEffect(() => {
        if (pendingAction) {
            if (themeSound) themeSound.playExclamation();
            else sounds.playExclamation();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pendingAction]);

    // mark buffer dirty as soon as recording starts
    useEffect(() => {
        if (isRecording) setHasChanges(true);
    }, [isRecording]);

    // session lifecycle: reset / exit / new
    const handleFullReset = () => {
        resetRecording();
        setSavedName(null);
        setHasChanges(false);
    };

    const handleExit = () => {
        if (hasChanges) { setPendingAction('exit'); return; }
        onClose();
    };

    const handleNew = () => {
        if (hasChanges) { setPendingAction('new'); return; }
        handleFullReset()
    };

    // save flow: writeFile pushes the current blob to disk, save routes through Save As if no name yet
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

    // unsaved-changes dialog: Yes saves then continues, No discards then continues
    const handleUnsavedYes = () => {
        handleSave();
        const action = pendingAction;
        setPendingAction(null);
        if (action === 'new') handleFullReset();
        else onClose();
    };

    const handleUnsavedNo = () => {
        const action = pendingAction;
        setPendingAction(null);
        setHasChanges(false);
        if (action === 'new') handleFullReset();
        else onClose();
    };

    // resolve a file's playable URL — audio items in the FM tree carry it on trackData.url
    const handleOpenPicked = (item: FMItem) => {
        const url = item.trackData?.url ?? item.url;
        if (!url) return;
        setLocalPickedUrl(url);
        setOpenPickerOpen(false);
        setSavedName(item.name);
        setHasChanges(false);
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
            {/* Title Bar */}
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
            {/* Menu Bar */}
            <VoiceRecorderMenu
                onClose={handleExit}
                onOpenAbout={() => setOpenModal('about')}
                onOpenProperties={() => setOpenModal('properties')}
                globalVolume={globalVolume}
                globalMuted={globalMuted}
                plusTheme={plusTheme}
                handleNew={handleNew}
                onOpenFM={() => setOpenPickerOpen(true)}
                onSave={handleSave}
                onSaveAs={handleSaveAs}
                onIncreaseVolume={() => applyVolumeChange(1.25)}
                onDecreaseVolume={() => applyVolumeChange(0.75)}
                onIncreaseSpeed={() => applySpeedChange(2)}
                onDecreaseSpeed={() => applySpeedChange(0.5)}
                onAddEcho={applyEcho}
                onReverse={applyReverse}     
            />
        
        {/* Recorder Body */}
        <div className="recorder-body">
            {/* Position / Waveform / Length */}
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

            {/* Scrubber */}
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
      
            {/* Transport Buttons */}
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
        {/* About Modal */}
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

        {/* Unsaved Changes Modal */}
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

        {/* Properties Modal */}
        {openModal === 'properties' && createPortal(
            <PropertiesModal onClose={() => setOpenModal(null)} />,
            document.body
        )}

        {/* Save As Modal */}
        {saveAsOpen && createPortal(
            <SaveAsModal
                title='Save As'
                initialName={savedName ?? 'Sound.webm'}
                onSave={handleSaveAsConfirm}
                onClose={() => setSaveAsOpen(false)}
            />,
            document.body
        )}

        {/* Open Modal (replaces the FileManager picker for File → Open...) */}
        {openPickerOpen && createPortal(
            <OpenModal
                title='Open'
                initialPath={['localdisc', 'c-documents', 'c-admin', 'music']}
                fileTypes={[
                    { label: 'Sounds (*.wav, *.mp3)', extensions: ['.wav', '.mp3'] },
                    { label: 'All Files', extensions: [] },
                ]}
                onOpen={handleOpenPicked}
                onClose={() => setOpenPickerOpen(false)}
            />,
            document.body
        )}
    </div>
  )
}

export default VoiceRecorder