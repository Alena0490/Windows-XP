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
                    <span className='symbol'>2</span>Restore
                </li>
                <li onClick={() => { onMove(); onRequestClose(); }}>
                    <span className='symbol'></span>
                    Move
                </li>
                <li onClick={() => { onSize(); onRequestClose(); }}>
                    <span className='symbol'></span>
                    Size
                </li>
                <li onClick={() => { onMinimize(); onRequestClose(); }}>
                    <span className='symbol'>0</span>Minimize
                </li>
                <li
                    className={isFullscreen ? 'is-disabled' : ''}
                    onClick={!isFullscreen ? () => { onMaximize(); onRequestClose(); } : undefined}
                >
                    <span className='symbol'>1</span>Maximize
                </li>
                <li className='separator' aria-hidden='true' />
                <li onClick={() => { onClose(); onRequestClose(); }}>
                    <span className='symbol'>r</span>Close <span>Alt+F4</span>
                </li>
            </ul>
        </menu>
    );
};

export default WindowSystemMenu;