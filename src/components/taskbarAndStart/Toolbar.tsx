import { useState, useEffect, useRef } from 'react';
import './Toolbar.css';

export interface ToolbarItem {
    label: string;
    icon: string;
    onClick: () => void;
}

interface ToolbarProps {
    label: string;
    items: ToolbarItem[];
}

const Toolbar = ({ label, items }: ToolbarProps) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    return (
        <div className="links-toolbar" ref={ref}>
            <span className="links-toolbar__label">{label}</span>
            <button
                type="button"
                className={`links-toolbar__chevron${open ? ' is-open' : ''}`}
                onClick={() => setOpen(prev => !prev)}
            >
                »
            </button>

            {open && (
                <div className="links-toolbar__menu">
                    {items.map((item, i) => (
                        <div
                            key={i}
                            className="links-toolbar__item"
                            onClick={() => { item.onClick(); setOpen(false); }}
                        >
                            <img src={item.icon} alt="" />
                            <span>{item.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Toolbar;