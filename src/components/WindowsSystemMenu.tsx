import { useEffect, useRef } from 'react';
import './AppMenu.css';

interface WindowSystemMenuProps {
    open: boolean;
    onRequestClose: () => void;
    triggerRef: React.RefObject<HTMLElement | null>;
    isFullscreen: boolean;
    onRestore: () => void;
    onMove: () => void;
    onSize: () => void;
    onMinimize: () => void;
    onMaximize: () => void;
    onClose: () => void;
}

const WindowSystemMenu = ({
    open,
    onRequestClose,
    triggerRef,
    isFullscreen,
    onRestore,
    onMove,
    onSize,
    onMinimize,
    onMaximize,
    onClose,
}: WindowSystemMenuProps) => {
    const menuRef = useRef<HTMLMenuElement>(null);

    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            const target = e.target as Node;
            if (menuRef.current?.contains(target)) return;
            if (triggerRef.current?.contains(target)) return;
            onRequestClose();
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open, onRequestClose, triggerRef]);

    return (
        <menu ref={menuRef} className='app-menu is-white context-menu'>
            <ul className={`submenu ${open ? 'open' : ''}`}>
                <li
                    className={!isFullscreen ? 'is-disabled' : ''}
                    onClick={isFullscreen ? () => { onRestore(); onRequestClose(); } : undefined}
                >
                    <span className='symbol'>2</span><span className='mnemonic'>R</span>estore
                </li>
                <li onClick={() => { onMove(); onRequestClose(); }}>
                    <span className='symbol'></span>
                    <span className='mnemonic'>M</span>ove
                </li>
                <li onClick={() => { onSize(); onRequestClose(); }}>
                    <span className='symbol'></span>
                    <span className='mnemonic'>S</span>ize
                </li>
                <li onClick={() => { onMinimize(); onRequestClose(); }}>
                    <span className='symbol'>0</span>Mi<span className='mnemonic'>n</span>imize
                </li>
                <li
                    className={isFullscreen ? 'is-disabled' : ''}
                    onClick={!isFullscreen ? () => { onMaximize(); onRequestClose(); } : undefined}
                >
                    <span className='symbol'>1</span>Ma<span className='mnemonic'>x</span>imize
                </li>
                <li className='separator' aria-hidden='true' />
                <li onClick={() => { onClose(); onRequestClose(); }}>
                    <span className='symbol'>r</span><span className='mnemonic'>C</span>lose <span>Alt+F4</span>
                </li>
            </ul>
        </menu>
    );
};

export default WindowSystemMenu;