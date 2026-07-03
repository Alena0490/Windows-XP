import { useState } from 'react';

import BinEmpty from '../img/RecycleBinEmpty.webp';
// import BinFull from './img/RecycleBinFull.webp';
import AqBinEmpty from '../img/Plus! AqRecEmpty.ico';
// import AqBinFull from './img/Plus! AqRecFull.ico';
import DvBinEmpty from '../img/Plus! DVRecEmpty.ico';
// import DvBinFull from './img/Plus! DVRecFull.ico';
import NaBinEmpty from '../img/Plus! NaRecEmpty.ico';
// import NaBinFull from './img/Plus! NaRecFull.ico';
import SpBinEmpty from '../img/Plus! SpRecEmpty.ico';
// import SpBinFull from './img/Plus! SpRecFull.ico';

export type PlusTheme = 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
export type Theme = 'luna' | 'homestead' | 'silver';
export type CursorTheme = 'default' | 'white' | 'gold' | 'silver' | 'hand' | 'modern' | 'nature' | 'aquarium' | 'davinci' | 'space';

interface ThemeSoundSet {
    playOpen: () => void;
    playMinimize: () => void;
    playCritStop: () => void;
    playSysExit: () => void;
}

interface SoundsShape {
    playStart: () => void;
    playMinimize: () => void;
    playCriticalError: () => void;
    playShutDown: () => void;
    playLogOff: () => void;
    aquarium: ThemeSoundSet;
    daVinci: ThemeSoundSet;
    nature: ThemeSoundSet;
    space: ThemeSoundSet;
}

interface UsePlusThemeParams {
    sounds: SoundsShape;
    onThemeChange: (theme: Theme) => void;
}

const usePlusTheme = ({ sounds, onThemeChange }: UsePlusThemeParams) => {
    const [plusTheme, setPlusTheme] = useState<PlusTheme>(() =>
        (localStorage.getItem('xp-plus-theme') as PlusTheme) ?? 'none'
    );

    const [cursorTheme, setCursorTheme] = useState<CursorTheme>(() => {
        const saved = localStorage.getItem('xp-plus-theme') as PlusTheme | null;
        return (saved && saved !== 'none') ? saved as CursorTheme : 'modern';
    });

    const { playStart: _playStart, playMinimize: _playMinimize, playCriticalError: _playCriticalError, playShutDown: _playShutDown, playLogOff: _playLogOff } = sounds;

    const themeSound = plusTheme === 'aquarium' ? sounds.aquarium
        : plusTheme === 'davinci' ? sounds.daVinci
        : plusTheme === 'nature' ? sounds.nature
        : plusTheme === 'space' ? sounds.space
        : null;

    const playStart         = () => themeSound ? themeSound.playOpen()      : _playStart();
    const playMinimize      = () => themeSound ? themeSound.playMinimize()  : _playMinimize();
    const playCriticalError = () => themeSound ? themeSound.playCritStop()  : _playCriticalError();
    const playShutDown      = () => themeSound ? themeSound.playSysExit()   : _playShutDown();
    const playLogOff        = () => themeSound ? themeSound.playSysExit()   : _playLogOff();

    const binIcon = plusTheme === 'aquarium' ? AqBinEmpty
        : plusTheme === 'davinci' ? DvBinEmpty
        : plusTheme === 'nature' ? NaBinEmpty
        : plusTheme === 'space' ? SpBinEmpty
        : BinEmpty;

    const setPlusThemeWithCursor = (theme: PlusTheme) => {
        setPlusTheme(theme);
        localStorage.setItem('xp-plus-theme', theme);
        if (theme === 'none') {
            setCursorTheme('modern');
            onThemeChange('luna');
        } else {
            setCursorTheme(theme as CursorTheme);
            switch (theme) {
                case 'aquarium': onThemeChange('luna'); break;
                case 'davinci':  onThemeChange('homestead'); break;
                case 'nature':   onThemeChange('homestead'); break;
                case 'space':    onThemeChange('silver'); break;
            }
        }
    };

    return {
        plusTheme,
        cursorTheme,
        binIcon,
        setPlusThemeWithCursor,
        playStart,
        playMinimize,
        playCriticalError,
        playShutDown,
        playLogOff,
    };
};

export default usePlusTheme;