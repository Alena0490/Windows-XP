import { useState } from 'react';

// Basic
import tickSound from '../sounds/tick.mp3';
import winSound from '../sounds/win.mp3';
import loseSound from '../sounds/lose.mp3';

import keyDown from '../sounds/key-down.wav'
import keyUp from '../sounds/key-up.wav'
import stickyKey from '../sounds/sticky-key.wav'

import bubbles from '../sounds/bubbles.mp3'

import startApp from '../sounds/Windows XP Start.wav';
import startAppShort from '../sounds/Windows Navigation Start.wav';
import minimize from '../sounds/Windows XP Minimize.wav';
import startXP from '../sounds/Windows XP Startup.wav';
import balloon from '../sounds/Windows XP Balloon.wav';
import error from '../sounds/Windows XP Error.wav';
import info from '../sounds/Windows XP Notify.wav'
import exclamation from '../sounds/Windows XP Exclamation.wav';
import criticalError from '../sounds/Windows XP Critical Stop.wav';
import startMenu from '../sounds/Windows XP Menu Command.wav';
import logOff from '../sounds/Windows XP Logoff Sound.wav';
import shutDown from '../sounds/Windows XP Shutdown.wav';
import shuffleSound from '../components/solitaire/sounds/shuffle3.wav';
import flipSound from '../components/solitaire/sounds/src_assets_audio_flip2.wav';
import ding from '../sounds/Windows XP Ding.wav'

// Aquarium
import aquariumSysStart from '../sounds/aquarium/Aquarium SysStart.wav';
import aquariumSysExit from '../sounds/aquarium/Aquarium SysExit.wav';
import aquariumOpen from '../sounds/aquarium/Aquarium Open.wav';
import aquariumClose from '../sounds/aquarium/Aquarium Close.wav';
import aquariumInfo from '../sounds/aquarium/Aquarium Asterisk.wav'
import aquariumError from '../sounds/aquarium/Aquarium Error.wav';
import aquariumCritStop from '../sounds/aquarium/Aquarium CritStop.wav';
import aquariumExclamation from '../sounds/aquarium/Aquarium Exclamation.wav';
import aquariumMinimize from '../sounds/aquarium/Aquarium Minimize.wav';
import aquariumMaximize from '../sounds/aquarium/Aquarium Maximize.wav';
import aquariumMenuCmd from '../sounds/aquarium/Aquarium MenuCMD.wav';
import aquariumDefault from '../sounds/aquarium/Aquarium Default.wav';
import aquariumAsterisk from '../sounds/aquarium/Aquarium Asterisk.wav';
import aquariumQuestion from '../sounds/aquarium/Aquarium Question.wav';
import aquariumRecycle from '../sounds/aquarium/Aquarium Recycle.wav';
import aquariumRestoreDown from '../sounds/aquarium/Aquarium RestoreDown.wav';
import aquariumRestoreUp from '../sounds/aquarium/Aquarium RestoreUp.wav';
import aquariumMenuPopUp from '../sounds/aquarium/Aquarium MenuPopUp.wav';
import aquariumMp3Done from '../sounds/aquarium/Aquarium MP3Done.wav';
import aquariumMSpeakErr from '../sounds/aquarium/Aquarium MSpeakErr.wav';
import aquariumMSpeakOK from '../sounds/aquarium/Aquarium MSpeakOK.wav';
import aquariumPdj from '../sounds/aquarium/Aquarium PDJ.wav';

// daVinci
import daVinciSysStart from '../sounds/da-vinci/daVinci SysStart.wav';
import daVinciSysExit from '../sounds/da-vinci/daVinci SysExit.wav';
import daVinciOpen from '../sounds/da-vinci/daVinci Open.wav';
import daVinciClose from '../sounds/da-vinci/daVinci Close.wav';
import daVinciInfo from '../sounds/da-vinci/daVinci Asterisk.wav'
import daVinciError from '../sounds/da-vinci/daVinci Error.wav';
import daVinciCritStop from '../sounds/da-vinci/daVinci CritStop.wav';
import daVinciExclamation from '../sounds/da-vinci/daVinci Exclamation.wav';
import daVinciMinimize from '../sounds/da-vinci/daVinci Minimize.wav';
import daVinciMaximize from '../sounds/da-vinci/daVinci Maximize.wav';
import daVinciMenuCmd from '../sounds/da-vinci/daVinci MenuCMD.wav';
import daVinciDefault from '../sounds/da-vinci/daVinci Default.wav';
import daVinciAsterisk from '../sounds/da-vinci/daVinci Asterisk.wav';
import daVinciQuestion from '../sounds/da-vinci/daVinci Question.wav';
import daVinciRecycle from '../sounds/da-vinci/daVinci Recycle.wav';
import daVinciRestoreDown from '../sounds/da-vinci/daVinci RestoreDown.wav';
import daVinciRestoreUp from '../sounds/da-vinci/daVinci RestoreUp.wav';
import daVinciMenuPopUp from '../sounds/da-vinci/daVinci MenuPopUp.wav';
import daVinciMp3Done from '../sounds/da-vinci/daVinci MP3Done.wav';
import daVinciMSpeakErr from '../sounds/da-vinci/daVinci MSpeakErr.wav';
import daVinciMSpeakOK from '../sounds/da-vinci/daVinci MSpeakOK.wav';
import daVinciPdj from '../sounds/da-vinci/daVinci PDJ.wav';

// Nature
import natureSysStart from '../sounds/nature/Nature SysStart.wav';
import natureSysExit from '../sounds/nature/Nature SysExit.wav';
import natureOpen from '../sounds/nature/Nature Open.wav';
import natureClose from '../sounds/nature/Nature Close.wav';
import natureInfo from '../sounds/nature/Nature Asterisk.wav'
import natureError from '../sounds/nature/Nature Error.wav';
import natureCritStop from '../sounds/nature/Nature CritStop.wav';
import natureExclamation from '../sounds/nature/Nature Exclamation.wav';
import natureMinimize from '../sounds/nature/Nature Minimize.wav';
import natureMaximize from '../sounds/nature/Nature Maximize.wav';
import natureMenuCmd from '../sounds/nature/Nature MenuCMD.wav';
import natureDefault from '../sounds/nature/Nature Default.wav';
import natureAsterisk from '../sounds/nature/Nature Asterisk.wav';
import natureQuestion from '../sounds/nature/Nature Question.wav';
import natureRecycle from '../sounds/nature/Nature Recycle.wav';
import natureRestoreDown from '../sounds/nature/Nature RestoreDown.wav';
import natureRestoreUp from '../sounds/nature/Nature RestoreUp.wav';
import natureMenuPopUp from '../sounds/nature/Nature MenuPopUp.wav';
import natureMp3Done from '../sounds/nature/Nature MP3Done.wav';
import natureMSpeakErr from '../sounds/nature/Nature MSpeakErr.wav';
import natureMSpeakOK from '../sounds/nature/Nature MSpeakOK.wav';

// Space
import spaceSysStart from '../sounds/space/Space SysStart.wav';
import spaceSysExit from '../sounds/space/Space SysExit.wav';
import spaceOpen from '../sounds/space/Space Open.wav';
import spaceClose from '../sounds/space/Space Close.wav';
import spaceInfo from '../sounds/space/Space Asterisk.wav'
import spaceError from '../sounds/space/Space Error.wav';
import spaceCritStop from '../sounds/space/Space CritStop.wav';
import spaceExclamation from '../sounds/space/Space Exclamation.wav';
import spaceMinimize from '../sounds/space/Space Minimize.wav';
import spaceMaximize from '../sounds/space/Space Maximize.wav';
import spaceMenuCmd from '../sounds/space/Space MenuCMD.wav';
import spaceDefault from '../sounds/space/Space Default.wav';
import spaceAsterisk from '../sounds/space/Space Asterisk.wav';
import spaceQuestion from '../sounds/space/Space Question.wav';
import spaceRecycle from '../sounds/space/Space Recycle.wav';
import spaceRestoreDown from '../sounds/space/Space RestoreDown.wav';
import spaceRestoreUp from '../sounds/space/Space RestoreUp.wav';
import spaceMenuPopUp from '../sounds/space/Space MenuPopUp.wav';
import spaceMp3Done from '../sounds/space/Space MP3Done.wav';
import spaceMSpeakErr from '../sounds/space/Space MSpeakErr.wav';
import spaceMSpeakOK from '../sounds/space/Space MSpeakOK.wav';
import spacePdj from '../sounds/space/Space PDJ.wav';

export const playBubbleSound = (volume: number, muted: boolean): HTMLAudioElement | null => {
    if (muted) return null;
    const audio = new Audio(bubbles);
    audio.volume = volume;
    audio.play().catch(() => {});
    return audio;
};

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

        // Keboard
        playKeyDown: () => playSound(keyDown),
        playKeyUp: () => playSound(keyUp),
        playStickyKey: () => playSound(stickyKey),

        // Aquarium Screensaver
        playBubbles: () => playSound(bubbles),

        // System
        playStart: () => playSound(startApp),
        playNavStart: () => playSound(startAppShort),
        playMinimize: () => playSound(minimize),
        playStartXP: () => playSound(startXP),
        playBalloon: () => playSound(balloon),
        playInfo: () => playSound(info),
        playError: () => playSound(error),
        playExclamation: () => playSound(exclamation),
        playCriticalError: () => playSound(criticalError),
        playStartMenu: () => playSound(startMenu),
        playLogOff: () => playSound(logOff),
        playShutDown: () => playSound(shutDown),
        playDefault: () => playSound(ding),

        // Solitaire
        playShuffle: () => playSound(shuffleSound),
        playFlip: () => playSound(flipSound),
        enabled,
        toggleSound: () => setEnabled(prev => !prev),

        // WINDOWS PLUS THEMES
        // Aquarium
        aquarium: {
            playSysStart: () => playSound(aquariumSysStart),
            playSysExit: () => playSound(aquariumSysExit),
            playOpen: () => playSound(aquariumOpen),
            playClose: () => playSound(aquariumClose),
            playInfo: () => playSound(aquariumInfo),
            playError: () => playSound(aquariumError),
            playCritStop: () => playSound(aquariumCritStop),
            playExclamation: () => playSound(aquariumExclamation),
            playMinimize: () => playSound(aquariumMinimize),
            playMaximize: () => playSound(aquariumMaximize),
            playMenuCmd: () => playSound(aquariumMenuCmd),
            playDefault: () => playSound(aquariumDefault),
            playDefaultAt: (vol: number, muted: boolean) => {
                if (!enabled || muted) return;
                const audio = new Audio(aquariumDefault);
                audio.volume = Math.max(0, Math.min(1, vol));
                audio.play();
            },
            playAsterisk: () => playSound(aquariumAsterisk),
            playQuestion: () => playSound(aquariumQuestion),
            playRecycle: () => playSound(aquariumRecycle),
            playRestoreDown: () => playSound(aquariumRestoreDown),
            playRestoreUp: () => playSound(aquariumRestoreUp),
            playMenuPopUp: () => playSound(aquariumMenuPopUp),
            playMp3Done: () => playSound(aquariumMp3Done),
            playMSpeakErr: () => playSound(aquariumMSpeakErr),
            playMSpeakOK: () => playSound(aquariumMSpeakOK),
            playPdj: () => playSound(aquariumPdj),
        },
        // daVinci
        daVinci: {
            playSysStart: () => playSound(daVinciSysStart),
            playSysExit: () => playSound(daVinciSysExit),
            playOpen: () => playSound(daVinciOpen),
            playClose: () => playSound(daVinciClose),
            playInfo: () => playSound(daVinciInfo),
            playError: () => playSound(daVinciError),
            playCritStop: () => playSound(daVinciCritStop),
            playExclamation: () => playSound(daVinciExclamation),
            playMinimize: () => playSound(daVinciMinimize),
            playMaximize: () => playSound(daVinciMaximize),
            playMenuCmd: () => playSound(daVinciMenuCmd),
            playDefault: () => playSound(daVinciDefault),
            playDefaultAt: (vol: number, muted: boolean) => {
                if (!enabled || muted) return;
                const audio = new Audio(daVinciDefault);
                audio.volume = Math.max(0, Math.min(1, vol));
                audio.play();
            },
            playAsterisk: () => playSound(daVinciAsterisk),
            playQuestion: () => playSound(daVinciQuestion),
            playRecycle: () => playSound(daVinciRecycle),
            playRestoreDown: () => playSound(daVinciRestoreDown),
            playRestoreUp: () => playSound(daVinciRestoreUp),
            playMenuPopUp: () => playSound(daVinciMenuPopUp),
            playMp3Done: () => playSound(daVinciMp3Done),
            playMSpeakErr: () => playSound(daVinciMSpeakErr),
            playMSpeakOK: () => playSound(daVinciMSpeakOK),
            playPdj: () => playSound(daVinciPdj),
        },
        // Nature
        nature: {
            playSysStart: () => playSound(natureSysStart),
            playSysExit: () => playSound(natureSysExit),
            playOpen: () => playSound(natureOpen),
            playClose: () => playSound(natureClose),
            playInfo: () => playSound(natureInfo),
            playError: () => playSound(natureError),
            playCritStop: () => playSound(natureCritStop),
            playExclamation: () => playSound(natureExclamation),
            playMinimize: () => playSound(natureMinimize),
            playMaximize: () => playSound(natureMaximize),
            playMenuCmd: () => playSound(natureMenuCmd),
            playDefault: () => playSound(natureDefault),
            playDefaultAt: (vol: number, muted: boolean) => {
                if (!enabled || muted) return;
                const audio = new Audio(natureDefault);
                audio.volume = Math.max(0, Math.min(1, vol));
                audio.play();
            },
            playAsterisk: () => playSound(natureAsterisk),
            playQuestion: () => playSound(natureQuestion),
            playRecycle: () => playSound(natureRecycle),
            playRestoreDown: () => playSound(natureRestoreDown),
            playRestoreUp: () => playSound(natureRestoreUp),
            playMenuPopUp: () => playSound(natureMenuPopUp),
            playMp3Done: () => playSound(natureMp3Done),
            playMSpeakErr: () => playSound(natureMSpeakErr),
            playMSpeakOK: () => playSound(natureMSpeakOK),
        },
        // Space
        space: {
            playSysStart: () => playSound(spaceSysStart),
            playSysExit: () => playSound(spaceSysExit),
            playOpen: () => playSound(spaceOpen),
            playClose: () => playSound(spaceClose),
            playInfo: () => playSound(spaceInfo),
            playError: () => playSound(spaceError),
            playCritStop: () => playSound(spaceCritStop),
            playExclamation: () => playSound(spaceExclamation),
            playMinimize: () => playSound(spaceMinimize),
            playMaximize: () => playSound(spaceMaximize),
            playMenuCmd: () => playSound(spaceMenuCmd),
            playDefault: () => playSound(spaceDefault),
            playDefaultAt: (vol: number, muted: boolean) => {
                if (!enabled || muted) return;
                const audio = new Audio(spaceDefault);
                audio.volume = Math.max(0, Math.min(1, vol));
                audio.play();
            },
            playAsterisk: () => playSound(spaceAsterisk),
            playQuestion: () => playSound(spaceQuestion),
            playRecycle: () => playSound(spaceRecycle),
            playRestoreDown: () => playSound(spaceRestoreDown),
            playRestoreUp: () => playSound(spaceRestoreUp),
            playMenuPopUp: () => playSound(spaceMenuPopUp),
            playMp3Done: () => playSound(spaceMp3Done),
            playMSpeakErr: () => playSound(spaceMSpeakErr),
            playMSpeakOK: () => playSound(spaceMSpeakOK),
            playPdj: () => playSound(spacePdj),
        },
    };
};

export default useSound;