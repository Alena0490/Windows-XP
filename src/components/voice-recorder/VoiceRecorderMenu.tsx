import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import useSound from '../../hooks/useSound';
import '../AppMenu.css';

type OpenMenu = 'file' | 'edit' | 'effects' | 'help' | null;

interface VoiceRecorderMenuProps {
    onClose: () => void;
    onMenuCommand?: () => void;
    onOpenAbout?: () => void;
    onOpenProperties?: () => void;
    globalVolume: number;
    globalMuted: boolean;
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
    handleNew: () => void;
    onOpenFM: () => void;
    onSave: () => void;
    onSaveAs: () => void;
    onIncreaseVolume: () => void;
    onDecreaseVolume: () => void;
    onIncreaseSpeed: () => void;
    onDecreaseSpeed: () => void;
    onAddEcho: () => void;
    onReverse: () => void;
}

const VoiceRecorderMenu = ({
    onClose,
    onMenuCommand,
    onOpenAbout,
    onOpenProperties,
    globalVolume,
    globalMuted,
    plusTheme,
    handleNew,
    onOpenFM,
    onSave,
    onSaveAs,
    onIncreaseVolume,
    onDecreaseVolume,
    onIncreaseSpeed,
    onDecreaseSpeed,
    onAddEcho,
    onReverse
}:VoiceRecorderMenuProps) => {
    const sounds = useSound(globalVolume, globalMuted);
    const themeSound = plusTheme === 'aquarium' ? sounds.aquarium
        : plusTheme === 'davinci' ? sounds.daVinci
        : plusTheme === 'nature' ? sounds.nature
        : plusTheme === 'space' ? sounds.space
        : null;
    const playStartMenu = () => themeSound ? themeSound.playMenuCmd() : sounds.playStartMenu();
    const handleAction = (action: () => void) => { playStartMenu(); action(); setOpenMenu(null); };
    const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
    const [anchorPos, setAnchorPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const menuRef = useRef<HTMLMenuElement>(null);
    const fileRef = useRef<HTMLLIElement>(null);
    const editRef = useRef<HTMLLIElement>(null);
    const effectsRef = useRef<HTMLLIElement>(null);
    const helpRef = useRef<HTMLLIElement>(null);

    // close open submenu on outside mousedown
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (menuRef.current?.contains(target)) return;
            if (target.closest('.recorder-submenu-portal')) return;
            setOpenMenu(null);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // submenu positioning + open/toggle helpers
    const anchorPosFor = (menu: OpenMenu) => {
        const el =
            menu === 'file' ? fileRef.current :
            menu === 'edit' ? editRef.current :
            menu === 'effects' ? effectsRef.current :
            menu === 'help' ? helpRef.current : null;
        if (!el) return { top: 0, left: 0 };
        const rect = el.getBoundingClientRect();
        return { top: rect.bottom, left: rect.left };
    };

    const openAt = (menu: OpenMenu) => {
        setAnchorPos(anchorPosFor(menu));
        setOpenMenu(menu);
    };

    const toggle = (menu: OpenMenu) => {
        onMenuCommand?.();
        if (openMenu === menu) setOpenMenu(null);
        else openAt(menu);
    };

    const hover = (menu: OpenMenu) => { if (openMenu !== null) openAt(menu); };

    // renders a submenu into a portal so it escapes the menu bar's overflow
    const renderSubmenu = (which: OpenMenu, children: React.ReactNode) => {
        if (openMenu !== which) return null;
        return createPortal(
            <div
                className='app-menu recorder-menu is-white recorder-submenu-portal'
                onMouseDown={(e) => e.stopPropagation()}
            >
                <ul
                    className='submenu open'
                    style={{ position: 'fixed', top: anchorPos.top, left: anchorPos.left }}
                >
                    {children}
                </ul>
            </div>,
            document.body
        );
    };

    return (
        <menu ref={menuRef} className='app-menu recorder-menu is-white' role='menu'>
            <ul>
                {/* File */}
                <li ref={fileRef} onClick={() => toggle('file')} onMouseEnter={() => hover('file')}>
                    <span className='mnemonic'>F</span>ile
                    {renderSubmenu('file', (
                        <>
                            <li onClick={() => handleAction(handleNew)}><span className='mnemonic'>N</span>ew</li>
                            <li onClick={() => handleAction(onOpenFM)}><span className='mnemonic'>O</span>pen...</li>
                            <li onClick={() => handleAction(onSave)}><span className='mnemonic'>S</span>ave</li>
                            <li onClick={() => handleAction(onSaveAs)}>Save&nbsp;<span className='mnemonic'>A</span>s...</li>
                            <li className='is-disabled'>Re<span className='mnemonic'>v</span>ert...</li>
                            <li onClick={() => handleAction(() => onOpenProperties?.())}>Proper<span className='mnemonic'>t</span>ies</li>
                            <li className='separator' aria-hidden tabIndex={-1}></li>
                            <li onClick={() => handleAction(onClose)}>E<span className='mnemonic'>x</span>it</li>
                        </>
                    ))}
                </li>

                {/* Edit */}
                <li ref={editRef} onClick={() => toggle('edit')} onMouseEnter={() => hover('edit')}>
                    <span className='mnemonic'>E</span>dit
                    {renderSubmenu('edit', (
                        <>
                            <li className='is-disabled'><span className='mnemonic'>C</span>opy <span>Ctrl+C</span></li>
                            <li className='is-disabled'>Paste&nbsp;<span className='mnemonic'>I</span>nsert <span>Ctrl+V</span></li>
                            <li className='is-disabled'>Paste&nbsp;<span className='mnemonic'>M</span>ix</li>
                            <li className='separator' aria-hidden tabIndex={-1}></li>
                            <li className='is-disabled'>Insert&nbsp;<span className='mnemonic'>F</span>ile...</li>
                            <li className='is-disabled'>Mi<span className='mnemonic'>x</span>&nbsp;With File...</li>
                            <li className='separator' aria-hidden tabIndex={-1}></li>
                            <li className='is-disabled'>Delete&nbsp;<span className='mnemonic'>B</span>efore Current Position</li>
                            <li className='is-disabled'>Delete&nbsp;<span className='mnemonic'>A</span>fter Current Position</li>
                            <li className='separator' aria-hidden tabIndex={-1}></li>
                            <li className='is-disabled'>Audio&nbsp;<span className='mnemonic'>P</span>roperties</li>
                        </>
                    ))}
                </li>

                {/* Effects */}
                <li ref={effectsRef} onClick={() => toggle('effects')} onMouseEnter={() => hover('effects')}>
                    Eff<span className='mnemonic'>e</span>cts
                    {renderSubmenu('effects', (
                        <>
                            <li onClick={() => handleAction(onIncreaseVolume)}><span className='mnemonic'>I</span>ncrease Volume (by 25%)</li>
                            <li onClick={() => handleAction(onDecreaseVolume)}><span className='mnemonic'>D</span>ecrease Volume</li>
                            <li className='separator' aria-hidden tabIndex={-1}></li>
                            <li onClick={() => handleAction(onIncreaseSpeed)}>I<span className='mnemonic'>n</span>crease Speed (by 100%)</li>
                            <li onClick={() => handleAction(onDecreaseSpeed)}>D<span className='mnemonic'>e</span>crease Speed</li>
                            <li className='separator' aria-hidden tabIndex={-1}></li>
                            <li onClick={onAddEcho}>Add&nbsp;<span className='mnemonic'>E</span>cho</li>
                            <li onClick={onReverse}><span className='mnemonic'>R</span>everse</li>
                        </>
                    ))}
                </li>

                {/* Help */}
                <li ref={helpRef} onClick={() => toggle('help')} onMouseEnter={() => hover('help')}>
                    <span className='mnemonic'>H</span>elp
                    {renderSubmenu('help', (
                        <>
                            <li className='is-disabled'><span className='mnemonic'>H</span>elp Topics</li>
                            <li className='separator' aria-hidden tabIndex={-1}></li>
                            <li onClick={() => handleAction(() => onOpenAbout?.())}><span className='mnemonic'>A</span>bout Sound Recorder</li>
                        </>
                    ))}
                </li>
            </ul>
        </menu>
    )
}

export default VoiceRecorderMenu
