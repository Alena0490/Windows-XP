import { useState } from 'react'
import { createPortal } from 'react-dom'

import useSound from '../../hooks/useSound'
import CriticalError from '../CriticalError'
import type { ErrorType } from '../CriticalError'

import Connection from './img/connection.webp'

import './HelpAnsSupport.css'
import './WhatsNew.css'

interface FeedbackProps {
    globalVolume?: number;
    globalMuted?: boolean;
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
    isFullscreen?: boolean;
    onToggleFullscreen?: () => void;
}

const Feedback = ({
    globalVolume = 1,
    globalMuted = false,
    plusTheme,
}: FeedbackProps) => {
  const sounds = useSound(globalVolume, globalMuted);
  const themeSound = plusTheme === 'aquarium' ? sounds.aquarium
      : plusTheme === 'davinci' ? sounds.daVinci
      : plusTheme === 'nature' ? sounds.nature
      : plusTheme === 'space' ? sounds.space
      : null;
  void themeSound;

  const [errorType] = useState<ErrorType | null>(null);

  return (
    <div className="whatsnew-page">
      <div className="whatsnew-body">
        <div className='whatsnew-content full-width'>
            <div className="whats-new-article">
                <div className="connection-notice">
                    <img src={Connection} alt="" />
                    <div className="connection-text">
                        <h3>Internet Connection is Required</h3>
                        <p>To view this page, you must be connected to the Internet. To connect to the Internet now, click <strong>Connect</strong>.</p>
                        <p className="article-link">Tell me more about connecting to the Internet</p>
                    </div>
                    <button className="luna-btn secondary">Connect</button>
                </div>

                <p>
                    Let us know how we can improve Microsoft products. Send your
                    thoughts, comments, and suggestions using our online feedback form.
                </p>
            </div>
        </div>
      </div>

      {errorType && createPortal(
        <CriticalError
          type={errorType}
          onClose={() => {}}
          onYes={() => {}}
          onNo={() => {}}
        />,
        document.body
      )}
    </div>
  )
}

export default Feedback
