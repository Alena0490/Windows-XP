import { useState, useEffect, useRef } from 'react';
import '../AppMenu.css';

type OpenMenu = 'file' | 'edit' | 'view' | 'insert' | 'format' | 'tools' | 'message' | 'help' | null;
type Priority = 'high' | 'normal' | 'low';

interface NewMessageMenuProps {
    onClose: () => void;
    onOpenIE?: (url?: string) => void;
    onSend?: () => void;
    onSendLater?: () => void;
    onOpenAbout?: () => void;
    onInsertSignature?: () => void;
    isBusy?: boolean;
    onMenuCommand?: () => void;
    showBcc?: boolean;
    onToggleBcc?: () => void;
    onApplyStationery?: (id: string | null) => void;
    onOpenSendWebPage?: () => void;
}

const NewMailMenu = ({
    onClose,
    onOpenIE,
    onSend,
    onSendLater,
    onOpenAbout,
    onInsertSignature,
    onMenuCommand,
    isBusy,
    showBcc,
    onToggleBcc,
    onApplyStationery,
    onOpenSendWebPage,
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
                        <li className='has-submenu'>
                            <span className='mnemonic'>N</span>ew
                            <ul className='submenu'>
                                <li className='is-disabled'>
                                    <span className='mnemonic'>M</span>ail Message
                                </li>
                                <li className='is-disabled'>
                                    Contact... <span>Ctrl+Shift+C</span>
                                </li>
                                <li className='is-disabled'>
                                    Folder... <span>Ctrl+Shift+E</span>
                                </li>
                                <li className='is-disabled'>
                                    Folder Bar
                                </li>
                                <li className='is-disabled'>
                                    News Server...
                                </li>
                            </ul>
                        </li>
                        <li
                            onClick={() => { onSend?.(); toggle('file'); }}
                        >
                            <span className='mnemonic'>S</span>end Message <span>Alt+S</span>
                        </li>
                        <li
                            onClick={() => { onSendLater?.(); toggle('file'); }}
                        >
                            Send <span className='mnemonic'>L</span>ater
                        </li>
                        <li className='separator' />
                        <li className='is-disabled'>
                            <span className='mnemonic'>S</span>ave <span>Ctrl+S</span>
                        </li>
                        <li className='is-disabled'>
                            Save&#160;<span className='mnemonic'>A</span>s...
                        </li>
                        <li className='is-disabled'>
                            Save Att<span className='mnemonic'>a</span>chments...
                        </li>
                        <li className='is-disabled'>
                            Save as&#160;<span className='mnemonic'>S</span>tationery...
                        </li>
                        <li className='separator' />
                        <li className='is-disabled'>
                            <span className='mnemonic'>M</span>ove to Folder...
                        </li>
                        <li className='is-disabled'>
                            Cop<span className='mnemonic'>y</span> to Folder...
                        </li>
                        <li className='is-disabled'>
                            <span className='mnemonic'>D</span>elete Message <span>Ctrl+D</span>
                        </li>
                        <li className='separator' />
                        <li className='is-disabled'>
                            <span className='mnemonic'>P</span>rint... <span>Ctrl+P</span>
                        </li>
                        <li className='separator' />
                        <li className='is-disabled'>
                            P<span className='mnemonic'>r</span>operties <span>Alt+Enter</span>
                        </li>
                        <li className='separator' />
                        <li className='is-disabled'>
                            <span className='mnemonic'>W</span>ork Offline
                        </li>
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
                        <li className='separator' />
                        <li className='is-disabled'>
                            Select&#160;<span className='mnemonic'>A</span>ll <span>Ctrl+A</span>
                        </li>
                        <li className='separator' />
                        <li className='has-submenu'>
                            <span className='mnemonic'>F</span>ind
                            <ul className='submenu'>
                                <li className='is-disabled'>
                                    Message in&#160;<span className='mnemonic'>T</span>his Folder... <span>F3</span>
                                </li>
                                <li className='is-disabled'>
                                    <span className='mnemonic'>M</span>essage... <span>Ctrl+Shift+F</span>
                                </li>
                                <li className='is-disabled'>
                                    <span className='mnemonic'>P</span>eople... <span>Ctrl+E</span>
                                </li>
                            </ul>
                        </li>
                        <li className='separator' />
                        <li className='is-disabled'>
                            Remove Hyperlink
                        </li>
                    </ul>
                </li>

                {/* VIEW */}
                <li onClick={() => toggle('view')} onMouseEnter={() => hover('view')}>
                    <span className='mnemonic'>V</span>iew
                    <ul className={`submenu ${openMenu === 'view' ? 'open' : ''}`}>
                        <li className='is-disabled'>
                            <span className='mnemonic'>A</span>ll Headers
                        </li>
                        <li className='separator' />
                        <li className='has-submenu'>
                            <span className='mnemonic'>T</span>oolbars
                            <ul className='submenu'>
                                <li className='is-disabled'>
                                    <span className='mnemonic'>S</span>tandard Buttons
                                </li>
                                <li className='is-disabled'>
                                    Standard Buttons,&#160;<span className='mnemonic'>T</span>ext
                                </li>
                            </ul>
                        </li>
                        <li className='checked is-disabled'>
                            <span className='mnemonic'>S</span>tatus Bar
                        </li>
                        <li
                            className={showBcc ? 'checked' : ''}
                            onClick={() => { onToggleBcc?.(); toggle('view'); }}
                        >
                            <span className='mnemonic'>B</span>cc
                        </li>
                        <li className='separator' />
                        <li className='is-disabled'>
                            <span className='mnemonic'>S</span>ource Edit
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
                            <span className='mnemonic'>T</span>ext from File...
                        </li>
                        <li className='is-disabled'>
                            Pi<span className='mnemonic'>c</span>ture...
                        </li>
                        <li className='is-disabled'>
                            <span className='mnemonic'>H</span>orizontal Line
                        </li>
                        <li className='separator' />
                        <li className='is-disabled'>
                            My <span className='mnemonic'>B</span>usiness Card
                        </li>
                        <li
                            onClick={() => { onInsertSignature?.(); toggle('insert'); }}
                        >
                            <span className='mnemonic'>S</span>ignature
                        </li>
                        <li className='separator' />
                        <li className='is-disabled'>
                            H<span className='mnemonic'>y</span>perlink...
                        </li>
                    </ul>
                </li>

                {/* FORMAT */}
                <li onClick={() => toggle('format')} onMouseEnter={() => hover('format')}>
                    F<span className='mnemonic'>o</span>rmat
                    <ul className={`submenu ${openMenu === 'format' ? 'open' : ''}`}>
                        <li className='has-submenu is-disabled'>
                            St<span className='mnemonic'>y</span>le
                        </li>
                        <li className='is-disabled'>
                            <span className='mnemonic'>F</span>ont...
                        </li>
                        <li className='is-disabled'>
                            <span className='mnemonic'>P</span>aragraph...
                        </li>
                        <li className='separator' />
                        <li className='is-disabled'>
                            <span className='mnemonic'>I</span>ncrease Indent
                        </li>
                        <li className='is-disabled'>
                            <span className='mnemonic'>D</span>ecrease Indent
                        </li>
                        <li className='separator' />
                        <li className='has-submenu is-disabled'>
                            <span className='mnemonic'>B</span>ackground
                        </li>
                        <li className='has-submenu is-disabled'>
                            <span className='mnemonic'>E</span>ncoding
                        </li>
                        <li className='separator' />
                        <li className='checked is-disabled'>
                            <span className='mnemonic'>R</span>ich Text (HTML)
                        </li>
                        <li className='is-disabled'>
                            Plain Te<span className='mnemonic'>x</span>t
                        </li>
                        <li className='separator' />
                        <li className='has-submenu'>
                            <span className='mnemonic'>A</span>pply Stationery
                            <ul className='submenu'>
                                <li onClick={() => { onApplyStationery?.('leaves'); toggle('format'); }}><span className='mnemonic'>1</span>&#160;Leaves</li>
                                <li onClick={() => { onApplyStationery?.('citrus-punch'); toggle('format'); }}><span className='mnemonic'>2</span>&#160;Citrus Punch</li>
                                <li onClick={() => { onApplyStationery?.('sunflower'); toggle('format'); }}><span className='mnemonic'>3</span>&#160;Sunflower</li>
                                <li onClick={() => { onApplyStationery?.('maize'); toggle('format'); }}><span className='mnemonic'>4</span>&#160;Maize</li>
                                <li onClick={() => { onApplyStationery?.('clear-day'); toggle('format'); }}><span className='mnemonic'>5</span>&#160;Clear Day</li>
                                <li onClick={() => { onApplyStationery?.('nature'); toggle('format'); }}><span className='mnemonic'>6</span>&#160;Nature</li>
                                <li onClick={() => { onApplyStationery?.(null); toggle('format'); }}><span className='mnemonic'>7</span>&#160;Blank</li>
                                <li className='separator' />
                                <li className='is-disabled'><span className='mnemonic'>S</span>elect Stationery...</li>
                                <li className='separator' />
                                <li onClick={() => { onApplyStationery?.(null); toggle('format'); }}><span className='mnemonic'>N</span>o Stationery</li>
                                <li onClick={() => { onOpenSendWebPage?.(); toggle('format'); }}><span className='mnemonic'>W</span>eb Page...</li>
                            </ul>
                        </li>
                        <li className='separator' />
                        <li className='checked is-disabled'>
                            <span className='mnemonic'>S</span>end Pictures with Message
                        </li>
                    </ul>
                </li>

               {/* TOOLS */}
                <li onClick={() => toggle('tools')} onMouseEnter={() => hover('tools')}>
                    <span className='mnemonic'>T</span>ools
                    <ul className={`submenu ${openMenu === 'tools' ? 'open' : ''}`}>
                        <li className='is-disabled'>
                            <span className='mnemonic'>S</span>pelling... <span>F7</span>
                        </li>
                        <li className='separator' />
                        <li className='is-disabled'>
                            Request Read Receipt
                        </li>
                        <li className='is-disabled'>
                            <span className='mnemonic'>C</span>heck Names <span>Ctrl+K</span>
                        </li>
                        <li className='is-disabled'>
                            Select <span className='mnemonic'>R</span>ecipients...
                        </li>
                        <li className='separator' />
                        <li className='is-disabled'>
                            <span className='mnemonic'>A</span>ddress Book... <span>Ctrl+Shift+B</span>
                        </li>
                        <li className='separator' />
                        <li className='is-disabled'>
                            <span className='mnemonic'>E</span>ncrypt
                        </li>
                        <li className='is-disabled'>
                            Digitally <span className='mnemonic'>S</span>ign
                        </li>
                        <li className='is-disabled'>
                            Request Secure Receipt
                        </li>
                    </ul>
                </li>

                {/* MESSAGE */}
                <li onClick={() => toggle('message')} onMouseEnter={() => hover('message')}>
                    <span className='mnemonic'>M</span>essage
                    <ul className={`submenu ${openMenu === 'message' ? 'open' : ''}`}>
                        <li className='is-disabled'>
                            <span className='mnemonic'>N</span>ew <span>Ctrl+N</span>
                        </li>
                        <li className='has-submenu'>
                            <span className='mnemonic'>N</span>ew Using
                            <ul className='submenu'>
                                <li className='is-disabled'><span className='mnemonic'>1</span>&#160;Leaves</li>
                                <li className='is-disabled'><span className='mnemonic'>2</span>&#160;Citrus Punch</li>
                                <li className='is-disabled'><span className='mnemonic'>3</span>&#160;Sunflower</li>
                                <li className='is-disabled'><span className='mnemonic'>4</span>&#160;Maize</li>
                                <li className='is-disabled'><span className='mnemonic'>5</span>&#160;Clear Day</li>
                                <li className='is-disabled'><span className='mnemonic'>6</span>&#160;Nature</li>
                                <li className='is-disabled'><span className='mnemonic'>7</span>&#160;Blank</li>
                            </ul>
                        </li>
                        <li className='separator' />
                        <li className='has-submenu'>
                            <span className='mnemonic'>S</span>et Priority
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
