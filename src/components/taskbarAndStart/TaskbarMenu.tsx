import {useState, useEffect, useRef } from 'react';

import './TaskbarMenu.css'

export interface MenuItem {
    label?: string;
    onClick?: () => void;
    disabled?: boolean;
    separator?: boolean;
    checked?: boolean;
    hasSubmenu?: boolean;
    children?: MenuItem[];
}

interface TaskbarMenuProps {
    x: number;
    items: MenuItem[];
    onClose: () => void;
}

const TaskbarMenu = ({ x, items, onClose }: TaskbarMenuProps) => {
    const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
    const [submenuLeft, setSubmenuLeft] = useState(false);
    const [adjustedX, setAdjustedX] = useState(x);
    
    const ref = useRef<HTMLDivElement>(null);
    const submenuRef = useRef<HTMLDivElement>(null);

    // Switch submenu to left
    useEffect(() => {
        if (openSubmenu === null || !submenuRef.current) return;
        const rect = submenuRef.current.getBoundingClientRect();
        setSubmenuLeft(rect.right > window.innerWidth);
    }, [openSubmenu]);

    // Adjust the menu position
    useEffect(() => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const overflow = rect.right - window.innerWidth;
        if (overflow > 0) {
            setAdjustedX(x - rect.width); 
        } else {
            setAdjustedX(x);
        }
    }, [x]);

    useEffect(() => {
        const handlePointer = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) onClose();
        };
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('mousedown', handlePointer);
        window.addEventListener('keydown', handleKey);
        window.addEventListener('resize', onClose);
        window.addEventListener('blur', onClose);
        return () => {
            document.removeEventListener('mousedown', handlePointer);
            window.removeEventListener('keydown', handleKey);
            window.removeEventListener('resize', onClose);
            window.removeEventListener('blur', onClose);
        };
    }, [onClose]);

    return (
        <div ref={ref} className="xp-taskbar-menu" style={{ left: adjustedX }}>
            {items.map((item, i) =>
                item.separator ? (
                    <div key={i} className="xp-taskbar-menu__sep" />
                ) : (
                    <div
                        key={i}
                        className={`xp-taskbar-menu__item${item.disabled ? ' is-disabled' : ''}`}
                        onClick={() => {
                            if (item.disabled) return;
                            item.onClick?.();
                            onClose();
                        }}
                        onMouseEnter={() => setOpenSubmenu(i)}
                        onMouseLeave={() => setOpenSubmenu(null)}
                    >
                        {item.checked && <span className="xp-taskbar-menu__check">✓</span>}
                        <span className="xp-taskbar-menu__label">{item.label}</span>
                        {item.hasSubmenu && <span className="xp-taskbar-menu__arrow">▶</span>}

                        {/* Submenu */}
                        {item.children && openSubmenu === i && (
                            <div 
                                ref={submenuRef}
                                className={`xp-taskbar-submenu${submenuLeft ? ' open-left' : ''}`}
                            >
                                {item.children.map((child, ci) => (
                                    <div
                                        key={ci}
                                        className={`xp-taskbar-menu__item${child.disabled ? ' is-disabled' : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (child.disabled) return;
                                            child.onClick?.();
                                            onClose();
                                        }}
                                    >
                                        {child.checked && <span className="xp-taskbar-menu__check">✓</span>}
                                        <span className="xp-taskbar-menu__label">{child.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )
            )}
        </div>
    );
};

export default TaskbarMenu;