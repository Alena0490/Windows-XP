import { useState } from 'react';
import { CARD_BACKS } from './data/dataSolitaire';
import { useDraggableDialog } from '../../hooks/useDraggableDialog';
import SolitaireIcon from '../../img/Solitaire.webp'
import './CardBackModal.css'
import '../../App.css'

interface CardBackModalProps {
    style?: React.CSSProperties;
    onClose: () => void;
    cardBack: string;
    setCardBack: (back: string) => void;
}

const CardBackModal = ({ onClose, style, cardBack, setCardBack }: CardBackModalProps) => {
      const { dialogRef, onMouseDown, draggableStyle } = useDraggableDialog();
    const [selected, setSelected] = useState(
        CARD_BACKS.indexOf(cardBack)
    );

    const handleOk = () => {
        setCardBack(CARD_BACKS[selected]);
        onClose();
    };

    return (
         <div
            className='app-window card-modal-window'
            style={{ ...style, ...draggableStyle }}
            ref={dialogRef}
            tabIndex={-1}
            onMouseDown={onMouseDown}
        >
            <div className='title-bar solitaire-modal-title'>
                <span className='title-bar-text solitaire-modal-text'>
                    <img src={SolitaireIcon} alt='' aria-hidden='true' />
                    Select Card Back
                </span>
                <div className='title-bar-buttons solitaire-title-controls xp-title-controls'>
                    <button
                        type='button'
                        className='xp-title-control btn-help'
                        aria-label='Help'
                    />
                    <button
                        type='button'
                        className='xp-title-control btn-close'
                        onClick={onClose}
                        aria-label='Close'
                    >
                        ✕
                    </button>
                </div>
            </div>

            <div className='solitaire-dialog-body'>
                <div className='card-back-options'>
                    <input 
                        type="radio" 
                        id="card-back-1" 
                        name="card-back" 
                        value="0"     
                        checked={selected === 0}
                        onChange={() => setSelected(0)}
                    />
                    <input 
                        type="radio" 
                        id="card-back-2" 
                        name="card-back" 
                        value="1" 
                        checked={selected === 1}
                        onChange={() => setSelected(1)}
                    />
                    <input 
                        type="radio" 
                        id="card-back-3" 
                        name="card-back" 
                        value="2" 
                        checked={selected === 2}
                        onChange={() => setSelected(2)}
                    />
                    <input 
                        type="radio" 
                        id="card-back-4" 
                        name="card-back" 
                        value="3" 
                        checked={selected === 3}
                        onChange={() => setSelected(3)}
                    />
                    <input 
                        type="radio" 
                        id="card-back-5" 
                        name="card-back" 
                        value="4" 
                        checked={selected === 4}
                        onChange={() => setSelected(4)}
                    />
                    <input 
                        type="radio" 
                        id="card-back-6" 
                        name="card-back" 
                        value="5" 
                        checked={selected === 5}
                        onChange={() => setSelected(5)}
                    />
                    <input 
                        type="radio" 
                        id="card-back-7" 
                        name="card-back" 
                        value="6" 
                        checked={selected === 6}
                        onChange={() => setSelected(6)}
                    />
                    <input 
                        type="radio" 
                        id="card-back-8" 
                        name="card-back" 
                        value="7" 
                        checked={selected === 7}
                        onChange={() => setSelected(7)}
                    />
                    <input 
                        type="radio" 
                        id="card-back-9" 
                        name="card-back" 
                        value="8" 
                        checked={selected === 8}
                        onChange={() => setSelected(8)}
                    />
                    <input 
                        type="radio" 
                        id="card-back-10" 
                        name="card-back" 
                        value="9" 
                        checked={selected === 9}
                        onChange={() => setSelected(9)}
                    />
                    <input 
                        type="radio" 
                        id="card-back-11" 
                        name="card-back" 
                        value="10" 
                        checked={selected === 10}
                        onChange={() => setSelected(10)}
                    />
                    <input 
                        type="radio" 
                        id="card-back-12" 
                        name="card-back" 
                        value="11" 
                        checked={selected === 11}
                        onChange={() => setSelected(11)}
                    />
                </div>
                <div className="buttons">
                    <button 
                        type='button' 
                        className='luna-btn' 
                        onClick={handleOk}
                    >
                        OK
                    </button>
                    <button 
                        type='button' 
                        className='luna-btn secondary' 
                        onClick={onClose} autoFocus
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CardBackModal
