import { useState, useEffect, useRef } from 'react';
import '../AppMenu.css';

type OpenMenu = 'file' | 'edit' | 'view' | 'insert' | 'format' | 'tools' | 'message' | 'help' | null;
type Priority = 'high' | 'normal' | 'low';

interface NewMessageMenuProps {
    onClose: () => void;
    onOpenIE?: (url?: string) => void;
    onSend?: () => void;
    onSendUsing?: (accountId: string) => void;
    onSendLater?: () => void;
    onSendLaterUsing?: (accountId: string) => void;
    onOpenAbout?: () => void;
    onInsertSignature?: () => void;
    isBusy?: boolean;
    onMenuCommand?: () => void;
    showBcc?: boolean;
    onToggleBcc?: () => void;
}

const NewMailMenu = ({
    onClose,
    onOpenIE,
    onSend,
    onSendUsing,
    onSendLater,
    onSendLaterUsing,
    onOpenAbout,
    onInsertSignature,
    onMenuCommand,
    isBusy,
    showBcc,
    onToggleBcc
}: NewMessageMenuProps) => {
    const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
    const menuRef = useRef<HTMLMenuElement>(null);


    // Message state
    const [priority, setPriority] = useState<Priority>('normal');

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpenMenu(null);
            }
        };
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpenMenu(null);
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    const toggle = (menu: OpenMenu) => { onMenuCommand?.(); setOpenMenu(openMenu === menu ? null : menu); };
    const hover = (menu: OpenMenu) => { if (openMenu !== null) setOpenMenu(menu); };

    return (
        <menu ref={menuRef} className='app-menu is-white' role='menu'>
            <ul>
                {/* FILE */}
                <li onClick={() => toggle('file')} onMouseEnter={() => hover('file')}>
                    <span className='mnemonic'>F</span>ile
                    <ul className={`submenu ${openMenu === 'file' ? 'open' : ''}`}>
                        <li
                            onClick={() => { onSend?.(); toggle('file'); }}
                        >
                            S<span className='mnemonic'>e</span>nd Message
                        </li>
                        <li className='has-submenu'>
                            Send Message <span className='mnemonic'>U</span>sing
                            <ul className='submenu'>
                                <li
                                    className='is-bullet'
                                    onClick={() => { onSendUsing?.('default'); onSend?.(); toggle('file'); }}
                                >
                                    <span className='mnemonic'>1</span>&#160;Default Account
                                </li>
                            </ul>
                        </li>
                        <li className='separator' />
                        <li
                            onClick={() => { onSendLater?.(); toggle('file'); }}
                        >
                            Send <span className='mnemonic'>L</span>ater
                        </li>

                        <li className='has-submenu'>
                            Send Later Using
                            <ul className='submenu'>
                                <li
                                    className='is-bullet'
                                    onClick={() => { onSendLaterUsing?.('default'); onSendLater?.(); toggle('file'); }}
                                >
                                    <span className='mnemonic'>1</span>&#160;Default Account
                                </li>
                            </ul>
                        </li>
                        <li className='separator' />
                        <li
                            onClick={onClose}
                        >
                            <span className='mnemonic'>C</span>lose
                        </li>
                    </ul>
                </li>

                {/* EDIT */}
                <li onClick={() => toggle('edit')} onMouseEnter={() => hover('edit')}>
                    <span className='mnemonic'>E</span>dit
                    <ul className={`submenu ${openMenu === 'edit' ? 'open' : ''}`}>
                        <li className='is-disabled'>
                            <span className='mnemonic'>U</span>ndo <span>Ctrl+Z</span>
                        </li>
                        <li className='separator' />
                        <li className='is-disabled'>
                            Cu<span className='mnemonic'>t</span> <span>Ctrl+X</span>
                        </li>
                        <li className='is-disabled'>
                            <span className='mnemonic'>C</span>opy <span>Ctrl+C</span>
                        </li>
                        <li className='is-disabled'>
                            <span className='mnemonic'>P</span>aste <span>Ctrl+V</span>
                        </li>
                    </ul>
                </li>

                {/* VIEW */}
                <li onClick={() => toggle('view')} onMouseEnter={() => hover('view')}>
                    <span className='mnemonic'>V</span>iew
                    <ul className={`submenu ${openMenu === 'view' ? 'open' : ''}`}>
                        <li className='has-submenu'>
                            <span className='mnemonic'>T</span>oolbar
                            <ul className='submenu'>
                                <li className='is-checked'>Standard Buttons</li>
                                <li>Standard Buttons, Text</li>
                            </ul>
                        </li>
                        <li className='separator' />
                        <li
                            className={showBcc ? 'checked' : ''}
                            onClick={() => { onToggleBcc?.(); toggle('view'); }}
                        >
                            <span className='mnemonic'>B</span>cc
                        </li>
                        <li className='is-disabled'>
                            <span className='mnemonic'>A</span>ll Headers
                        </li>
                        <li className='separator' />
                        <li className='is-disabled'>
                            <span className='mnemonic'>R</span>ich Text (HTML)
                        </li>
                        <li className='is-disabled'>
                            Plain Te<span className='mnemonic'>x</span>t
                        </li>
                        <li className='separator' />
                        <li className='has-submenu'>
                            <span className='mnemonic'>E</span>ncoding
                            <ul className='submenu'>
                                <li className='is-bullet'>Western European (Windows)</li>
                                <li>Unicode (UTF-8)</li>
                            </ul>
                        </li>
                    </ul>
                </li>

                {/* INSERT */}
                <li onClick={() => toggle('insert')} onMouseEnter={() => hover('insert')}>
                    <span className='mnemonic'>I</span>nsert
                    <ul className={`submenu ${openMenu === 'insert' ? 'open' : ''}`}>
                        <li className='is-disabled'>
                            <span className='mnemonic'>F</span>ile Attachment...
                        </li>
                        <li className='is-disabled'>
                            Pi<span className='mnemonic'>c</span>ture...
                        </li>
                        <li className='separator' />
                        <li className='is-disabled'>
                            <span className='mnemonic'>H</span>orizontal Line
                        </li>
                        <li className='is-disabled'>
                            H<span className='mnemonic'>y</span>perlink...
                        </li>
                        <li className='separator' />
                        <li
                            onClick={() => { onInsertSignature?.(); toggle('insert'); }}
                        >
                            <span className='mnemonic'>S</span>ignature
                        </li>
                        <li className='is-disabled'>
                            My <span className='mnemonic'>B</span>usiness Card
                        </li>
                    </ul>
                </li>

                {/* FORMAT */}
                <li onClick={() => toggle('format')} onMouseEnter={() => hover('format')}>
                    F<span className='mnemonic'>o</span>rmat 
                    <ul className={`submenu ${openMenu === 'format' ? 'open' : ''}`}>
                        <li className='has-submenu'>
                            <span className='mnemonic'>B</span>ackground
                            <ul className='submenu'>
                                <li className='is-disabled'>
                                    Pi<span className='mnemonic'>c</span>ture...
                                </li>
                                <li className='is-disabled'>
                                    Co<span className='mnemonic'>l</span>or
                                </li>
                                <li className='is-disabled'>
                                    <span className='mnemonic'>S</span>ound...
                                </li>
                            </ul>
                        </li>
                        <li className='is-disabled'>
                            St<span className='mnemonic'>y</span>le
                        </li>
                        <li className='has-submenu'>
                            <span className='mnemonic'>E</span>ncoding
                            <ul className='submenu'>
                                <li className='is-bullet'>Western European (Windows)</li>
                                <li>Unicode (UTF-8)</li>
                            </ul>
                        </li>
                        <li className='separator' />
                        <li className='is-disabled'>
                            Apply Station<span className='mnemonic'>e</span>ry
                        </li>
                    </ul>
                </li>

                {/* TOOLS */}
               <li onClick={() => toggle('tools')} onMouseEnter={() => hover('tools')}>
                    <span className='mnemonic'>T</span>ools
                    <ul className={`submenu ${openMenu === 'tools' ? 'open' : ''}`}>
                        <li className='is-disabled'>
                            <span className='mnemonic'>S</span>pelling <span>F7</span>
                        </li>

                        <li 
                            className='is-disabled' 
                        >
                            <span className='mnemonic'>C</span>heck Names
                        </li>

                        <li 
                            className='is-disabled' 
                        >
                            Select <span className='mnemonic'>R</span>ecipients...
                        </li>
                        <li className='separator' />

                        <li 
                            className='is-disabled' 
                        >
                            Digitally <span className='mnemonic'>S</span>ign
                        </li>

                        <li className='is-disabled'>
                            <span className='mnemonic'>E</span>ncrypt
                        </li>
                    </ul>
                </li>

                {/* MESSAGE */}
                <li onClick={() => toggle('message')} onMouseEnter={() => hover('message')}>
                    <span className='mnemonic'>M</span>essage
                    <ul className={`submenu ${openMenu === 'message' ? 'open' : ''}`}>
                        <li
                            onClick={() => { onSend?.(); toggle('message'); }}
                        >
                            S<span className='mnemonic'>e</span>nd Message
                        </li>
                        <li
                            onClick={() => { onSendLater?.(); toggle('message'); }}
                        >
                            Send <span className='mnemonic'>L</span>ater
                        </li>
                        <li className='separator' />
                        <li className='has-submenu'>
                            <span className='mnemonic'>P</span>riority
                            <ul className='submenu'>
                                <li
                                    className={priority === 'high' ? 'is-bullet' : ''}
                                    onClick={() => { setPriority('high'); toggle('message'); }}
                                >
                                    <span className='mnemonic'>H</span>igh
                                </li>
                                <li
                                    className={priority === 'normal' ? 'is-bullet' : ''}
                                    onClick={() => { setPriority('normal'); toggle('message'); }}
                                >
                                    <span className='mnemonic'>N</span>ormal
                                </li>
                                <li
                                    className={priority === 'low' ? 'is-bullet' : ''}
                                    onClick={() => { setPriority('low'); toggle('message'); }}
                                >
                                    <span className='mnemonic'>L</span>ow
                                </li>
                            </ul>
                        </li>
                        <li className='separator' />
                        <li className='is-disabled'>
                            Request <span className='mnemonic'>R</span>ead Receipt
                        </li>
                    </ul>
                </li>

                {/* HELP */}
                <li onClick={() => toggle('help')} onMouseEnter={() => hover('help')}>
                    <span className='mnemonic'>H</span>elp
                    <ul className={`submenu ${openMenu === 'help' ? 'open' : ''}`}>
                        <li 
                            className='is-disabled' 
                        >
                            <span className='mnemonic'>C</span>ontents and Index <span>F1</span>
                        </li>

                        <li
                            onClick={() => {
                                onOpenIE?.(
                                    'https://github.com/Alena0490/Windows-XP'
                                );
                                setOpenMenu(null);
                            }}
                        ><span className='mnemonic'>R</span>ead Me</li>
                        <li className='separator' aria-hidden='true' />
                        <li className='has-submenu'>
                            <span className='mnemonic'>M</span>icrosoft on the Web
                            <ul className='submenu submenu-ms-web'>
                                <li
                                    onClick={() => {
                                        onOpenIE?.(
                                            'https://web.archive.org/web/20021130084022/http://windowsupdate.microsoft.com/'
                                        );
                                        setOpenMenu(null);
                                    }}
                                ><span className='mnemonic'>W</span>indows Update</li>

                                <li
                                    onClick={() => {
                                        onOpenIE?.(
                                            'https://web.archive.org/web/20021129080341/http://www.microsoft.com/windows/ie/default.asp'
                                        );
                                        setOpenMenu(null);
                                    }}
                                ><span className='mnemonic'>P</span>roduct News</li>

                                <li
                                    onClick={() => {
                                        onOpenIE?.(
                                            'http://support.microsoft.com/default.aspx?scid=fh;[LN];faqs'
                                        );
                                        setOpenMenu(null);
                                    }}
                                ><span className='mnemonic'>F</span>requently Asked Questions</li>

                                <li
                                    onClick={() => {
                                        onOpenIE?.(
                                            'https://web.archive.org/web/20021111235858/http://customerservice.support.microsoft.com/'
                                        );
                                        setOpenMenu(null);
                                    }}
                                ><span className='mnemonic'>O</span>nline Support</li>

                                <li className='separator' aria-hidden='true' />
                                <li
                                    onClick={() => {
                                        onOpenIE?.(
                                            'https://web.archive.org/web/20030207144146/http://register.microsoft.com/contactus30/contactus.asp?domain=ie'
                                        );
                                        setOpenMenu(null);
                                    }}>Send&#160;<span className='mnemonic'>F</span>eedback</li>
                                <li
                                    onClick={() => {
                                        onOpenIE?.(
                                            'https://web.archive.org/web/20040814053928/http://msid.msn.com/mps_id_sharing/redirect.asp?aca.ninemsn.com.au/'
                                        );
                                    }}
                                ><span className='mnemonic'>B</span>est of the Web</li>

                                <li
                                    onClick={() => {
                                        onOpenIE?.(
                                            'https://web.archive.org/web/20040814053928/http://msid.msn.com/mps_id_sharing/redirect.asp?aca.ninemsn.com.au/'
                                        );
                                    }}
                                ><span className='mnemonic'>S</span>earch the Web</li>

                                <li className='separator' aria-hidden='true' />
                                <li 
                                    onClick={() => { onOpenIE?.('https://web.archive.org/web/20020204184251/http://lc2.law5.hotmail.passport.com/cgi-bin/login'); setOpenMenu(null); }}
                                >
                                    <span className='mnemonic'>H</span>otmail
                                </li>

                                <li 
                                    onClick={() =>{onOpenIE?.('https://web.archive.org/web/20021130084022/http://www.msn.com/'); setOpenMenu(null); }}
                                >
                                    MSN&#160;<span className='mnemonic'>H</span>ome
                                </li>
                            </ul>
                        </li>
                        <li className='separator' aria-hidden='true' />
                        <li 
                            onClick={onOpenAbout}
                        >
                            <span className='mnemonic'>A</span>bout Microsoft Outlook Express
                        </li>
                    </ul>
                </li>
            </ul>
            <div className={`app-menu-logo${isBusy ? ' is-animating' : ''}`} />
        </menu>
    )
}

export default NewMailMenu;
