import { useState } from 'react';
import tickSound from '../sounds/tick.mp3';
import winSound from '../sounds/win.mp3';
import loseSound from '../sounds/lose.mp3';
import startApp from '../sounds/Windows XP Start.wav';
import startAppShort from '../sounds/Windows Navigation Start.wav';
import minimize from '../sounds/Windows XP Minimize.wav';
import startXP from '../sounds/Windows XP Startup.wav';
import balloon from '../sounds/Windows XP Balloon.wav';
import error from '../sounds/Windows XP Error.wav';
import exclamation from '../sounds/Windows XP Exclamation.wav';
import criticalError from '../sounds/Windows XP Critical Stop.wav';
import startMenu from '../sounds/Windows XP Menu Command.wav';
import logOff from '../sounds/Windows XP Logoff Sound.wav';
import shutDown from '../sounds/Windows XP Shutdown.wav';
import shuffleSound from '../components/solitaire/sounds/shuffle3.wav';
import flipSound from '../components/solitaire/sounds/src_assets_audio_flip2.wav';

const useSound = (globalVolume: number = 1, globalMuted: boolean = false) => {
    const [enabled, setEnabled] = useState(true);

    const playSound = (soundSrc: string) => {
        if (!enabled || globalMuted) return;
        const audio = new Audio(soundSrc);
        audio.volume = globalVolume;
        audio.play();
    };
    
    return {
        // Minesweeper
        playTick: () => playSound(tickSound),
        playWin: () => playSound(winSound),
        playLose: () => playSound(loseSound),
        // System
        playStart: () => playSound(startApp),
        playNavStart: () => playSound(startAppShort),
        playMinimize: () => playSound(minimize),
        playStartXP: () => playSound(startXP),
        playBalloon: () => playSound(balloon),
        playError: () => playSound(error),
        playExclamation: () => playSound(exclamation),
        playCriticalError: () => playSound(criticalError),
        playStartMenu: () => playSound(startMenu),
        playLogOff: () => playSound(logOff),
        playShutDown: () => playSound(shutDown),
        // Solitaire
        playShuffle: () => playSound(shuffleSound),
        playFlip: () => playSound(flipSound),
        enabled,
        toggleSound: () => setEnabled(prev => !prev),
    };
};

export default useSound;