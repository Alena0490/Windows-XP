import { useEffect, useRef } from 'react';
import './OutlookExpress.css';

export interface StationeryOption {
    id: string;
    label: string;
}

const STATIONERY_OPTIONS: StationeryOption[] = [
    { id: 'nature', label: 'Nature' },
    { id: 'clear-day', label: 'Clear Day' },
    { id: 'maize', label: 'Maize' },
    { id: 'sunflower', label: 'Sunflower' },
    { id: 'citrus-punch', label: 'Citrus Punch' },
    { id: 'blank', label: 'Blank' },
    { id: 'leaves', label: 'Leaves' },
];

interface StationeryMenuProps {
    anchorRef: React.RefObject<HTMLElement | null>;
    selectedId?: string;
    onSelect: (id: string | null) => void;
    onSelectStationeryDialog: () => void;
    onWebPage: () => void;
    onRequestClose: () => void;
}

const StationeryMenu = ({
    anchorRef,
    selectedId,
    onSelect,
    onSelectStationeryDialog,
    onWebPage,
    onRequestClose,
}: StationeryMenuProps) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handlePointerDown = (e: MouseEvent) => {
            const target = e.target as Node;
            if (
                menuRef.current && !menuRef.current.contains(target) &&
                anchorRef.current && !anchorRef.current.contains(target)
            ) {
                onRequestClose();
            }
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onRequestClose();
        };
        document.addEventListener('mousedown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [anchorRef, onRequestClose]);

    return (
        <div className="stationery-menu" ref={menuRef} role="menu">
            {STATIONERY_OPTIONS.map((opt, i) => (
                <li
                    key={opt.id}
                    className={`stationery-item${opt.id === selectedId ? ' selected' : ''}`}
                    role="menuitemradio"
                    aria-checked={opt.id === selectedId}
                    onClick={() => { onSelect(opt.id); onRequestClose(); }}
                >
                    <span className="mnemonic">{i + 1}</span>&nbsp; {opt.label}
                </li>
            ))}

            <div className="stationery-sep" />

            <li
                className="stationery-item"
                onClick={() => { onSelectStationeryDialog(); onRequestClose(); }}
            >
                <span className="mnemonic">S</span>elect Stationery...
            </li>

            <div className="stationery-sep" />

            <li
                className="stationery-item"
                onClick={() => { onSelect(null); onRequestClose(); }}
            >
                <span className="mnemonic">N</span>o Stationery
            </li>
            <li
                className="stationery-item"
                onClick={() => { onWebPage(); onRequestClose(); }}
            >
                <span className="mnemonic">W</span>eb Page...
            </li>
        </div>
    );
};

export default StationeryMenu;
