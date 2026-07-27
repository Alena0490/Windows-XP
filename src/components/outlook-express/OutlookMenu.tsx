import { useState, useEffect, useRef } from 'react';
import MenuLogo from '../../img/logo.webp'
import '../AppMenu.css';

type OpenMenu = 'file' | 'edit' | 'view' | 'tools' | 'message' | 'help' | null;

interface OutlookMenuProps {
    onClose: () => void;
    onOpenIE?: (url?: string) => void;
    onOpenLayout?: () => void;
    onOpenAbout?: () => void;
    onCreateMail?: (stationery: string | null) => void;
}

const OutlookMenu = ({ onClose, onOpenIE, onOpenLayout, onOpenAbout, onCreateMail }: OutlookMenuProps) => {
    const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
    const menuRef = useRef<HTMLMenuElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpenMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggle = (menu: OpenMenu) => setOpenMenu(openMenu === menu ? null : menu);
    const hover = (menu: OpenMenu) => { if (openMenu !== null) setOpenMenu(menu); };

    return (
        <menu ref={menuRef} className='app-menu is-white'>
            <ul>
                <li onClick={() => toggle('file')} onMouseEnter={() => hover('file')}>
                    <span className='mnemonic'>F</span>ile
                    <ul className={`submenu ${openMenu === 'file' ? 'open' : ''}`}>
                        <li className='has-submenu'><span className='mnemonic'>N</span>ew
                            <ul className='submenu'>
                                <li onClick={() => { onCreateMail?.(null); toggle('file'); }}>
                                    Mail Message <span>Ctrl+N</span>
                                </li>
                                <li className='is-disabled'>Contact... <span>Ctrl+Shift+C</span></li>
                                <li className='is-disabled'>Folder... <span>Ctrl+Shift+E</span></li>
                                <li className='is-disabled'>Folder Bar</li>
                                <li className='is-disabled'>News Server...</li>
                            </ul>
                        </li>
                        <li className='is-disabled'><span className='mnemonic'>O</span>pen <span>Ctrl+O</span></li>
                        <li className='is-disabled'>Save&#160;<span className='mnemonic'>A</span>s...</li>
                        <li className='is-disabled'>Save Att<span className='mnemonic'>a</span>chments...</li>
                        <li className='is-disabled'>Save as&#160;<span className='mnemonic'>S</span>tationery...</li>
                        <li className='separator' aria-hidden='true' />
                        <li className='has-submenu'><span className='mnemonic'>F</span>older
                            <ul className='submenu'>
                                <li className='is-disabled'><span className='mnemonic'>N</span>ew... <span>Ctrl+Shift+E</span></li>
                                <li className='is-disabled'><span className='mnemonic'>D</span>elete</li>
                                <li className='is-disabled'><span className='mnemonic'>R</span>ename</li>
                                <li className='separator' aria-hidden='true' />
                                <li className='is-disabled'>Com<span className='mnemonic'>p</span>act</li>
                                <li className='is-disabled'>Compact&#160;<span className='mnemonic'>A</span>ll Folders</li>
                                <li className='separator' aria-hidden='true' />
                                <li className='is-disabled'>A<span className='mnemonic'>l</span>l Folders...</li>
                                <li className='is-disabled'>P<span className='mnemonic'>r</span>operties</li>
                            </ul>
                        </li>
                        <li className='separator' aria-hidden='true' />
                        <li className='has-submenu'><span className='mnemonic'>I</span>mport
                            <ul className='submenu'>
                                <li className='is-disabled'><span className='mnemonic'>A</span>ddress Book...</li>
                                <li className='is-disabled'><span className='mnemonic'>O</span>ther Address Book...</li>
                                <li className='is-disabled'><span className='mnemonic'>M</span>essages...</li>
                                <li className='is-disabled'>Mail&#160;<span className='mnemonic'>A</span>ccount Settings...</li>
                                <li className='is-disabled'>News&#160;<span className='mnemonic'>N</span>ewsgroup Settings...</li>
                            </ul>
                        </li>
                        <li className='has-submenu'><span className='mnemonic'>E</span>xport
                            <ul className='submenu'>
                                <li className='is-disabled'><span className='mnemonic'>A</span>ddress Book...</li>
                                <li className='is-disabled'><span className='mnemonic'>M</span>essages...</li>
                            </ul>
                        </li>
                        <li className='separator' aria-hidden='true' />
                        <li className='is-disabled'><span className='mnemonic'>P</span>rint <span>Ctrl+P</span></li>
                        <li className='separator' aria-hidden='true' />
                        <li className='is-disabled'>Switch&#160;<span className='mnemonic'>I</span>dentity...</li>
                        <li className='has-submenu'>I<span className='mnemonic'>d</span>entities
                            <ul className='submenu'>
                                <li className='is-disabled'><span className='mnemonic'>A</span>dd New Identity...</li>
                                <li className='is-disabled'><span className='mnemonic'>M</span>anage Identities...</li>
                            </ul>
                        </li>
                        <li className='separator' aria-hidden='true' />
                        <li className='is-disabled'>P<span className='mnemonic'>r</span>operties <span>Alt+Enter</span></li>
                        <li className='separator' aria-hidden='true' />
                        <li className='is-disabled'><span className='mnemonic'>W</span>ork Offline</li>
                        <li className='is-disabled'>Exit and Log Off I<span className='mnemonic'>d</span>entity</li>
                        <li onClick={onClose}>E<span className='mnemonic'>x</span>it</li>
                    </ul>
                </li>

                <li onClick={() => toggle('edit')} onMouseEnter={() => hover('edit')}>
                    <span className='mnemonic'>E</span>dit
                    <ul className={`submenu ${openMenu === 'edit' ? 'open' : ''}`}>
                        <li className='is-disabled'><span className='mnemonic'>C</span>opy <span>Ctrl+C</span></li>
                        <li className='is-disabled'>Select&#160;<span className='mnemonic'>A</span>ll <span>Ctrl+A</span></li>
                        <li className='separator' aria-hidden='true' />
                        <li className='has-submenu'><span className='mnemonic'>F</span>ind
                            <ul className='submenu'>
                                <li className='is-disabled'>Message in&#160;<span className='mnemonic'>T</span>his Folder... <span>F3</span></li>
                                <li className='is-disabled'><span className='mnemonic'>M</span>essage... <span>Ctrl+Shift+F</span></li>
                                <li className='is-disabled'><span className='mnemonic'>P</span>eople... <span>Ctrl+E</span></li>
                            </ul>
                        </li>
                        <li className='separator' aria-hidden='true' />
                        <li className='is-disabled'><span className='mnemonic'>M</span>ove to Folder... <span>Ctrl+Shift+V</span></li>
                        <li className='is-disabled'>Cop<span className='mnemonic'>y</span> to Folder...</li>
                        <li className='separator' aria-hidden='true' />
                        <li className='is-disabled'><span className='mnemonic'>D</span>elete <span>Ctrl+D</span></li>
                        <li className='is-disabled'>Empty&#160;'<span className='mnemonic'>D</span>eleted Items' Folder</li>
                        <li className='separator' aria-hidden='true' />
                        <li className='is-disabled'>Mark as&#160;<span className='mnemonic'>R</span>ead <span>Ctrl+Q</span></li>
                        <li className='is-disabled'>Mark as&#160;<span className='mnemonic'>U</span>nread</li>
                        <li className='is-disabled'>Mark Con<span className='mnemonic'>v</span>ersation as Read <span>Ctrl+T</span></li>
                        <li className='is-disabled'>Mark A<span className='mnemonic'>l</span>l Read <span>Ctrl+Shift+A</span></li>
                    </ul>
                </li>

                <li onClick={() => toggle('view')} onMouseEnter={() => hover('view')}>
                    <span className='mnemonic'>V</span>iew
                    <ul className={`submenu ${openMenu === 'view' ? 'open' : ''}`}>
                        <li className='has-submenu'>Current&#160;<span className='mnemonic'>V</span>iew
                            <ul className='submenu'>
                                <li className='checked is-disabled'>Show&#160;<span className='mnemonic'>A</span>ll Messages</li>
                                <li className='is-disabled'>Hide&#160;<span className='mnemonic'>R</span>ead Messages</li>
                                <li className='is-disabled'>Hide Read or&#160;<span className='mnemonic'>I</span>gnored Messages</li>
                                <li className='separator' aria-hidden='true' />
                                <li className='is-disabled'><span className='mnemonic'>G</span>roup Messages by Conversation</li>
                            </ul>
                        </li>
                        <li className='has-submenu'><span className='mnemonic'>S</span>ort By
                            <ul className='submenu'>
                                <li className='is-disabled'>P<span className='mnemonic'>r</span>iority</li>
                                <li className='is-disabled'>Att<span className='mnemonic'>a</span>chment</li>
                                <li className='is-disabled'>Fla<span className='mnemonic'>g</span></li>
                                <li className='checked is-disabled'><span className='mnemonic'>F</span>rom</li>
                                <li className='is-disabled'>S<span className='mnemonic'>u</span>bject</li>
                                <li className='is-disabled'>R<span className='mnemonic'>e</span>ceived</li>
                                <li className='is-disabled'>Sen<span className='mnemonic'>t</span></li>
                                <li className='is-disabled'>S<span className='mnemonic'>i</span>ze</li>
                                <li className='is-disabled'><span className='mnemonic'>W</span>atch/Ignore</li>
                                <li className='separator' aria-hidden='true' />
                                <li className='checked is-disabled'><span className='mnemonic'>A</span>scending</li>
                                <li className='is-disabled'><span className='mnemonic'>D</span>escending</li>
                            </ul>
                        </li>
                        <li className='is-disabled'>Co<span className='mnemonic'>l</span>umns...</li>
                        <li className='separator' aria-hidden='true' />
                        <li onClick={() => { onOpenLayout?.(); setOpenMenu(null); }}>
                            <span className='mnemonic'>L</span>ayout...
                        </li>
                        <li className='separator' aria-hidden='true' />
                        <li className='has-submenu'>Te<span className='mnemonic'>x</span>t Size
                            <ul className='submenu'>
                                <li className='is-disabled'>Lar<span className='mnemonic'>g</span>est</li>
                                <li className='is-disabled'>Lar<span className='mnemonic'>e</span>r</li>
                                <li className='checked is-disabled'><span className='mnemonic'>M</span>edium</li>
                                <li className='is-disabled'>Smalle<span className='mnemonic'>r</span></li>
                                <li className='is-disabled'>Smalles<span className='mnemonic'>t</span></li>
                            </ul>
                        </li>
                        <li className='has-submenu'><span className='mnemonic'>E</span>ncoding
                            <ul className='submenu'>
                                <li className='checked is-disabled'><span className='mnemonic'>A</span>uto-Select</li>
                                <li className='separator' aria-hidden='true' />
                                <li className='is-disabled'><span className='mnemonic'>W</span>estern European</li>
                                <li className='is-disabled'><span className='mnemonic'>C</span>entral European</li>
                                <li className='is-disabled'>C<span className='mnemonic'>y</span>rillic</li>
                                <li className='is-disabled'><span className='mnemonic'>G</span>reek</li>
                                <li className='is-disabled'><span className='mnemonic'>J</span>apanese</li>
                                <li className='is-disabled'>K<span className='mnemonic'>o</span>rean</li>
                                <li className='is-disabled'>Chinese&#160;<span className='mnemonic'>S</span>implified</li>
                                <li className='is-disabled'>Chinese&#160;<span className='mnemonic'>T</span>raditional</li>
                                <li className='is-disabled'><span className='mnemonic'>U</span>nicode (UTF-8)</li>
                            </ul>
                        </li>
                        <li className='separator' aria-hidden='true' />
                        <li className='is-disabled'><span className='mnemonic'>P</span>revious Message <span>Ctrl+&lt;</span></li>
                        <li className='has-submenu'><span className='mnemonic'>N</span>ext
                            <ul className='submenu'>
                                <li className='is-disabled'><span className='mnemonic'>M</span>essage <span>Ctrl+&gt;</span></li>
                                <li className='is-disabled'><span className='mnemonic'>U</span>nread Message <span>Ctrl+U</span></li>
                                <li className='is-disabled'>Unread&#160;<span className='mnemonic'>T</span>hread</li>
                                <li className='is-disabled'>Unread&#160;<span className='mnemonic'>N</span>ewsgroup <span>Ctrl+Shift+U</span></li>
                            </ul>
                        </li>
                        <li className='is-disabled'>Go to&#160;<span className='mnemonic'>F</span>older <span>Ctrl+Y</span></li>
                        <li className='separator' aria-hidden='true' />
                        <li className='is-disabled'>E<span className='mnemonic'>x</span>pand</li>
                        <li className='is-disabled'>C<span className='mnemonic'>o</span>llapse</li>
                        <li className='separator' aria-hidden='true' />
                        <li className='is-disabled'>Sto<span className='mnemonic'>p</span> <span>Esc</span></li>
                        <li className='is-disabled'><span className='mnemonic'>R</span>efresh <span>F5</span></li>
                    </ul>
                </li>

                <li onClick={() => toggle('tools')} onMouseEnter={() => hover('tools')}>
                    <span className='mnemonic'>T</span>ools
                    <ul className={`submenu ${openMenu === 'tools' ? 'open' : ''}`}>
                        <li className='has-submenu'>Send and&#160;<span className='mnemonic'>R</span>eceive
                            <ul className='submenu'>
                                <li className='is-disabled'>Send and Receive&#160;<span className='mnemonic'>A</span>ll <span>Ctrl+M</span></li>
                                <li className='is-disabled'>Recei<span className='mnemonic'>v</span>e All</li>
                                <li className='is-disabled'>Sen<span className='mnemonic'>d</span> All</li>
                            </ul>
                        </li>
                        <li className='separator' aria-hidden='true' />
                        <li className='is-disabled'>Synchronize A<span className='mnemonic'>l</span>l</li>
                        <li className='is-disabled'>Synchronize&#160;<span className='mnemonic'>F</span>older</li>
                        <li className='has-submenu'><span className='mnemonic'>M</span>ark for Offline
                            <ul className='submenu'>
                                <li className='is-disabled'>Download&#160;<span className='mnemonic'>M</span>essage Later</li>
                                <li className='is-disabled'>Download Message and Its&#160;<span className='mnemonic'>R</span>eplies Later</li>
                            </ul>
                        </li>
                        <li className='separator' aria-hidden='true' />
                        <li className='is-disabled'><span className='mnemonic'>A</span>ddress Book <span>Ctrl+Shift+B</span></li>
                        <li className='is-disabled'>Add Sen<span className='mnemonic'>d</span>er to Address Book</li>
                        <li className='separator' aria-hidden='true' />
                        <li className='has-submenu'>Message&#160;<span className='mnemonic'>R</span>ules
                            <ul className='submenu'>
                                <li className='is-disabled'>M<span className='mnemonic'>a</span>il...</li>
                                <li className='is-disabled'><span className='mnemonic'>N</span>ews...</li>
                                <li className='separator' aria-hidden='true' />
                                <li className='is-disabled'><span className='mnemonic'>B</span>locked Senders List...</li>
                            </ul>
                        </li>
                        <li className='separator' aria-hidden='true' />
                        <li className='has-submenu'><span className='mnemonic'>W</span>indows Messenger
                            <ul className='submenu'>
                                <li className='is-disabled'><span className='mnemonic'>O</span>pen Windows Messenger</li>
                                <li className='is-disabled'>O<span className='mnemonic'>p</span>tions...</li>
                            </ul>
                        </li>
                        <li className='has-submenu'>My&#160;<span className='mnemonic'>O</span>nline Status
                            <ul className='submenu'>
                                <li className='checked is-disabled'><span className='mnemonic'>O</span>nline</li>
                                <li className='is-disabled'><span className='mnemonic'>B</span>usy</li>
                                <li className='is-disabled'>Be&#160;<span className='mnemonic'>R</span>ight Back</li>
                                <li className='is-disabled'>A<span className='mnemonic'>w</span>ay</li>
                                <li className='is-disabled'>On the&#160;<span className='mnemonic'>P</span>hone</li>
                                <li className='is-disabled'>Out to&#160;<span className='mnemonic'>L</span>unch</li>
                                <li className='separator' aria-hidden='true' />
                                <li className='is-disabled'>Appear&#160;<span className='mnemonic'>F</span>fline</li>
                            </ul>
                        </li>
                        <li className='separator' aria-hidden='true' />
                        <li className='is-disabled'>Ac<span className='mnemonic'>c</span>ounts...</li>
                        <li className='is-disabled'><span className='mnemonic'>O</span>ptions...</li>
                    </ul>
                </li>

                <li onClick={() => toggle('message')} onMouseEnter={() => hover('message')}>
                    <span className='mnemonic'>M</span>essage
                    <ul className={`submenu ${openMenu === 'message' ? 'open' : ''}`}>
                        <li onClick={() => { onCreateMail?.(null); toggle('message'); }}>
                            <span className='mnemonic'>N</span>ew Message <span>Ctrl+N</span>
                        </li>
                        <li className='has-submenu'>New Message&#160;<span className='mnemonic'>U</span>sing
                            <ul className='submenu'>
                                <li onClick={() => onCreateMail?.('leaves')}><span className='mnemonic'>1</span>&#160;Leaves</li>
                                <li onClick={() => onCreateMail?.('citrus-punch')}><span className='mnemonic'>2</span>&#160;Citrus Punch</li>
                                <li onClick={() => onCreateMail?.('sunflower')}><span className='mnemonic'>3</span>&#160;Sunflower</li>
                                <li onClick={() => onCreateMail?.('maize')}><span className='mnemonic'>4</span>&#160;Maize</li>
                                <li onClick={() => onCreateMail?.('clear-day')}><span className='mnemonic'>5</span>&#160;Clear Day</li>
                                <li onClick={() => onCreateMail?.('nature')}><span className='mnemonic'>6</span>&#160;Nature</li>
                                <li onClick={() => onCreateMail?.(null)}><span className='mnemonic'>7</span>&#160;Blank</li>
                                <li className='separator' aria-hidden='true' />
                                <li className='is-disabled'><span className='mnemonic'>S</span>elect Stationery...</li>
                                <li className='separator' aria-hidden='true' />
                                <li onClick={() => onCreateMail?.(null)}><span className='mnemonic'>N</span>o Stationery</li>
                                <li className='is-disabled'><span className='mnemonic'>W</span>eb Page...</li>
                            </ul>
                        </li>
                        <li className='separator' aria-hidden='true' />
                        <li className='is-disabled'>Reply to&#160;<span className='mnemonic'>S</span>ender <span>Ctrl+R</span></li>
                        <li className='is-disabled'>Reply to&#160;<span className='mnemonic'>A</span>ll <span>Ctrl+Shift+R</span></li>
                        <li className='is-disabled'><span className='mnemonic'>F</span>orward <span>Ctrl+F</span></li>
                        <li className='is-disabled'>Forward as&#160;<span className='mnemonic'>A</span>ttachment</li>
                        <li className='separator' aria-hidden='true' />
                        <li className='is-disabled'>Create Rule from Message...</li>
                        <li className='is-disabled'><span className='mnemonic'>B</span>lock Sender...</li>
                        <li className='separator' aria-hidden='true' />
                        <li className='is-disabled'>F<span className='mnemonic'>l</span>ag Message</li>
                        <li className='is-disabled'><span className='mnemonic'>W</span>atch Conversation</li>
                        <li className='is-disabled'><span className='mnemonic'>I</span>gnore Conversation</li>
                        <li className='separator' aria-hidden='true' />
                        <li className='is-disabled'>Com<span className='mnemonic'>b</span>ine and Decode...</li>
                    </ul>
                </li>

                <li onClick={() => toggle('help')} onMouseEnter={() => hover('help')}>
                    <span className='mnemonic'>H</span>elp
                    <ul className={`submenu ${openMenu === 'help' ? 'open' : ''}`}>
                        <li className='is-disabled'><span className='mnemonic'>C</span>ontents and Index <span>F1</span></li>
                        <li
                            onClick={() => {
                                onOpenIE?.(
                                    'https://github.com/Alena0490/Windows-XP'
                                );
                                setOpenMenu(null);
                            }}
                        ><span className='mnemonic'>R</span>ead Me</li>
                        <li className='separator' aria-hidden='true' />
                        <li className='has-submenu'><span className='mnemonic'>M</span>icrosoft on the Web
                            <ul className='submenu'>
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
                                <li  onClick={() => {
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
                                <li onClick={() => { onOpenIE?.('https://web.archive.org/web/20020204184251/http://lc2.law5.hotmail.passport.com/cgi-bin/login'); setOpenMenu(null); }}><span className='mnemonic'>H</span>otmail</li>
                                <li onClick={() =>{onOpenIE?.('https://web.archive.org/web/20021130084022/http://www.msn.com/'); setOpenMenu(null); }}>MSN&#160;<span className='mnemonic'>H</span>ome</li>
                            </ul>
                        </li>
                        <li className='separator' aria-hidden='true' />
                        <li onClick={onOpenAbout}><span className='mnemonic'>A</span>bout Microsoft Outlook Express</li>
                    </ul>
                </li>
            </ul>
            <span className='oe-logo'>
                <img className='menu-logo' src={MenuLogo} alt='' />
            </span>
        </menu>
    )
}

export default OutlookMenu
