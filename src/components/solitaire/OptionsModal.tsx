import { useDraggableDialog } from '../../hooks/useDraggableDialog';
// import SolitaireIcon from '../../img/Solitaire.webp'
import './SolitaireModal.css'
import '../../App.css'

interface OptionsModalProps {
    style?: React.CSSProperties;
    onClose: () => void;
    draw: 'one' | 'three';
    setDraw: (d: 'one' | 'three') => void;
    timedGame: boolean;
    setTimedGame: (value: boolean) => void;
    showStatusBar: boolean;
    setShowStatusBar: (value: boolean) => void;
    outlineDragging: boolean;
    setOutlineDragging: (value: boolean) => void;
    scoring: 'standard' | 'vegas' | 'none';
    setScoring: (value: 'standard' | 'vegas' | 'none') => void;
    cumulativeScore: boolean;
    setCumulativeScore: (value: boolean) => void;
}

const OptionsModal = ({ 
    onClose, 
    style, 
    draw, 
    setDraw, 
    timedGame, 
    setTimedGame, 
    showStatusBar, 
    setShowStatusBar,
    outlineDragging,
    setOutlineDragging, 
    scoring,
    setScoring,
    cumulativeScore,
    setCumulativeScore,
}: OptionsModalProps) => {
    const { dialogRef, onMouseDown, draggableStyle } = useDraggableDialog();

        const handleOk = () => {
            onClose();
        };


    return (
         <div
            className='app-window card-modal-window option-modal'
            style={{ ...style, ...draggableStyle }}
            ref={dialogRef}
            tabIndex={-1}
            onMouseDown={onMouseDown}
        >
            <div className='title-bar solitaire-modal-title'>
                <span className='title-bar-text solitaire-modal-text'>
                    {/* <img src={SolitaireIcon} alt='' aria-hidden='true' /> */}
                    Options
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
                <div className='option-inputs'>
                    {/* LEFT COLUMN */}
                    <div className='draw'>
                        <fieldset>
                            <legend>Draw</legend>

                            <div className='option-row'>
                                <input type='radio' id='one' name='draw' value='one' checked={draw === 'one'} onChange={() => setDraw('one')}/>
                                <label htmlFor='one'>Draw One</label>
                            </div>

                            <div className='option-row'>
                                <input type='radio' id='three' name='draw' value='three' checked={draw === 'three'} onChange={() => setDraw('three')}/>
                                <label htmlFor='three'>Draw Three</label>
                            </div>
                        </fieldset>

                        <div className='option-checks'>
                            <div className='option-row'>
                                <input type='checkbox' id='timed' checked={timedGame} onChange={e => setTimedGame(e.target.checked)}/>
                                <label htmlFor='timed'>Timed game</label>
                            </div>

                            <div className='option-row'>
                                <input type='checkbox' id='status-bar' checked={showStatusBar} onChange={e => setShowStatusBar(e.target.checked)}/>
                                <label htmlFor='status-bar'>Status bar</label>
                            </div>

                            <div className='option-row'>
                                <input type='checkbox' id='outline' checked={outlineDragging} onChange={e => setOutlineDragging(e.target.checked)}/>
                                <label htmlFor='outline'>Outline dragging</label>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLLUMN */}
                    <div className='scoring'>
                        <fieldset>
                            <legend>Scoring</legend>

                            <div className='option-row'>
                                <input type='radio' id='standard' name='scoring' value='standard' checked={scoring === 'standard'} onChange={() => setScoring('standard')}/>
                                <label htmlFor='standard'>Standard</label>
                            </div>

                            <div className='option-row'>
                                <input type='radio' id='vegas' name='scoring' value='vegas' checked={scoring === 'vegas'} onChange={() => setScoring('vegas')}/>
                                <label htmlFor='vegas'>Vegas</label>
                            </div>

                            <div className='option-row'>
                                <input type='radio' id='none' name='scoring' value='none' checked={scoring === 'none'} onChange={() => setScoring('none')}/>
                                <label htmlFor='none'>None</label>
                            </div>
                        </fieldset>

                        <div className='cumulative-score-wrapper'>
                            <div className='option-row'>
                                <input
                                    type='checkbox'
                                    id='cumulative'
                                    checked={cumulativeScore}
                                    disabled={scoring !== 'vegas'}
                                    onChange={e => setCumulativeScore(e.target.checked)}
                                />
                                <label
                                    htmlFor='cumulative'
                                    style={{ opacity: scoring !== 'vegas' ? 0.45 : 1 }}
                                >
                                    Cumulative Score
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BUTTONS */}
                <div className='buttons'>
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

export default OptionsModal
