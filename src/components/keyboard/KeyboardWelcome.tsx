import { useState } from 'react';
import KeyboardIcon from '../../img/keyboard/Keyboard2.webp';
import Keyboard from '../../img/keyboard/On-Screen Keyboard.webp';
import './KeyboardWelcome.css'

interface KeyboardWelcomeProps {
    onClose: (dontShowAgain: boolean) => void;
    style?: React.CSSProperties;
}

const KeyboardWelcome = ({ onClose}: KeyboardWelcomeProps) => {
    const [dontShowAgain, setDontShowAgain] = useState(false);

    return (
        <div id="about" className="app-window about-dialog welcome-dialog">
            <div className="title-bar">
                <span className="title-bar-text">
                    <img className="file-icon" src={KeyboardIcon} alt="" aria-hidden="true" />
                    On-Screen Keyboard
                </span>
                <div className="title-bar-buttons xp-title-controls">
                    <button
                        type="button"
                        className="xp-title-control btn-close"
                        onClick={() => onClose(dontShowAgain)}
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>
            </div>

            <div className="about-body keyboard-body">
                <img src={Keyboard} alt='On-Screen Keyboard' />

                <div className="keyboard-text">
                    <p>
                        On-Screen Keyboard provides a minimum level of functionality for
                        mobility-impaired users. Mobility-impaired users will need a utility
                        program with higher functionality for daily use.
                    </p>
                    <p style={{ marginTop: '0.75rem' }}>
                        For a list of Windows-based accessibility utilities, see the{' '}
                        <a href="https://alena-pumprova.cz/" target="_blank" rel="noopener noreferrer">
                            Microsoft Web site
                        </a>
                    </p>
                </div>

            </div>

            <div className="about-footer">
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '1rem' }}>
                    <input
                        type="checkbox"
                        checked={dontShowAgain}
                        onChange={(e) => setDontShowAgain(e.target.checked)}
                    />
                    Do not show this message again
                </label>

                <button
                    type="button"
                    className="luna-btn"
                    onClick={() => onClose(dontShowAgain)}
                    autoFocus
                >
                    OK
                </button>
            </div>
        </div>
    );
};

export default KeyboardWelcome;