import { useRef } from "react";
import { createPortal } from 'react-dom';
import AboutDialog from '../AboutDialog';

interface KeyboardMenuProps {
    windowPosition: { x: number; y: number };
    openModal: 'about' | null;
    setOpenModal: React.Dispatch<React.SetStateAction<'about' | null>>;
}

const KeyboardMenu = ({windowPosition, openModal, setOpenModal}:KeyboardMenuProps) => {
const menuRef = useRef<HTMLElement>(null);

    const modalStyle = {
        position: 'fixed' as const,
        top: windowPosition.y + 145,
        left: windowPosition.x + 90,
    };

  return (
    <menu className='keyboard-menu app-menu ' ref={menuRef}>
        <ul>
            <li><span className="mnemonic">F</span>ile</li>
            <li><span className="mnemonic">K</span>eyboard</li>
            <li><span className="mnemonic">S</span>ettings</li>
            <li><span className="mnemonic">H</span>elp</li>
        </ul>      

          {openModal === 'about' && createPortal(
                <AboutDialog
                    title='Notepad'
                    onClose={() => setOpenModal(null)}
                    style={modalStyle}
                />,
                document.body
            )}
    </menu>
  )
}

export default KeyboardMenu
