import { useState, useEffect, useRef } from 'react';
import AboutDialog from '../AboutDialog';
import useSound from '../../hooks/useSound';
import './FileManagerMenu.css'

const FileManagerMenu = () => {

    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [hoveredItem, setHoveredItem] = useState<number | null>(null); // 
    const [openModal, setOpenModal] = useState<'about' | null>(null);

    const { playStartMenu } = useSound();

    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpenMenu(null);
                setHoveredItem(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const closeMenu = () => {
        setOpenMenu(null);
        setHoveredItem(null);
    };

    return (
        <menu className='file-menubar' ref={menuRef}>
            <ul className='file-menu-list'>
                {['File', 'Edit', 'View', 'Favourites', 'Tools', 'Help'].map(label => (
                    <li
                        key={label}
                        className={`file-menu-item ${openMenu === label ? 'is-open' : ''}`}
                    >
                        <button
                            type='button'
                            className='file-menu-trigger'
                            onClick={() => {
                                playStartMenu();
                                setOpenMenu(openMenu === label ? null : label);
                            }}
                        >
                            {label}
                        </button>

                        {openMenu === 'File' && label === 'File' && (
                            <ul className='file-submenu'>
                                <li className='file-submenu-item' onClick={closeMenu}>
                                    <span className='file-submenu-label'>Create Shortcut</span>
                                </li>
                                <li className='separator' />
                                <li className='file-submenu-item' onClick={closeMenu}>
                                    <span className='file-submenu-label'>Close</span>
                                </li>
                            </ul>
                        )}
                    </li>
                ))}
            </ul>

            {openModal === 'about' && (
                <AboutDialog
                    title='File Manager'
                    onClose={() => setOpenModal(null)}
                />
            )}
        </menu>
    );
}

export default FileManagerMenu