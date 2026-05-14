
import { useState } from 'react'

import './MediaPlayer.css'

const PlayIcon = () => (
    <svg viewBox='370.5 3605 8 8' aria-hidden='true'>
        <defs>
            <linearGradient id='playIconGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='var(--gradient-primary-start)' />
                <stop offset='100%' stopColor='var(--gradient-primary-end)' />
            </linearGradient>
        </defs>
        <polygon fill='url(#playIconGradient)' points='371 3605 371 3613 378 3609' />
    </svg>
);

const PlayIconSecondary = () => (
    <svg viewBox='370.5 3605 8 8' aria-hidden='true'>
        <defs>
            <linearGradient id='playIconSecondaryGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='#5679bb' />
                <stop offset='100%' stopColor='#849cce' />
            </linearGradient>
        </defs>
        <polygon fill='url(#playIconSecondaryGradient)' points='371 3605 371 3613 378 3609' />
    </svg>
);

const PauseIcon = () => (
    <svg viewBox='0 0 16 16' aria-hidden='true'>
        <defs>
            <linearGradient id='pauseIconGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='var(--gradient-primary-start)' />
                <stop offset='100%' stopColor='var(--gradient-primary-end)' />
            </linearGradient>
        </defs>
        <rect x='3' y='2' width='3' height='12' fill='url(#pauseIconGradient)' />
        <rect x='10' y='2' width='3' height='12' fill='url(#pauseIconGradient)' />
    </svg>
);

const StopIcon = () => (
    <svg viewBox='10 3605 8 8' aria-hidden='true'>
        <defs>
            <linearGradient id='stopIconGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='var(--gradient-primary-start)' />
                <stop offset='100%' stopColor='var(--gradient-primary-end)' />
            </linearGradient>
        </defs>
        <rect fill='url(#stopIconGradient)' x='11' y='3605' width='6' height='8' />
    </svg>
);

const SkipForwardIcon = () => (
    <svg viewBox='0 0 16 16' aria-hidden='true'>
        <defs>
            <linearGradient id='skipForwardGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='#5679bb' />
                <stop offset='100%' stopColor='#849cce' />
            </linearGradient>
        </defs>
        <path fill='url(#skipForwardGradient)' d='M10.00244,8.29091,2,12.30348V4.29335ZM14,2H12V14h2Z' />
    </svg>
);

const SkipBackIcon = () => (
    <svg viewBox='0 0 16 16' aria-hidden='true'>
        <defs>
            <linearGradient id='skipBackGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='#5679bb' />
                <stop offset='100%' stopColor='#849cce' />
            </linearGradient>
        </defs>
        <g transform='translate(16,0) scale(-1,1)'>
            <path fill='url(#skipBackGradient)' d='M10.00244,8.29091,2,12.30348V4.29335ZM14,2H12V14h2Z' />
        </g>
    </svg>
);

const FullscreenIcon = () => (
    <svg viewBox='0 0 100 100' aria-hidden='true'>
        <rect x="32" y="32" width="36" height="36" fill="none" stroke="#ffffff" stroke-width="10" />
        <path fill='#ffffff' d='M 50 6  L 65 21 L 35 21 Z' /> 
        <path fill='#ffffff' d='M 50 94 L 65 79 L 35 79 Z' /> 
        <path fill='#ffffff' d='M 6  50 L 21 35 L 21 65 Z' /> 
        <path fill='#ffffff' d='M 94 50 L 79 35 L 79 65 Z' /> 
    </svg>
);

const SoundIcon = () => (
    <svg viewBox='0 0 100 60' aria-hidden='true'>
        <defs>
            <linearGradient id='soundIconGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='var(--gradient-primary-start)' />
                <stop offset='100%' stopColor='var(--gradient-primary-end)' />
            </linearGradient>
        </defs>
        <path fill='url(#soundIconGradient)' d='M 24 22 L 34 22 L 52 4 L 52 56 L 34 38 L 24 38 Z' />
        <rect fill='url(#soundIconGradient)' x="61" y="17" width="22" height="9" transform="rotate(-18 48 13)" />
        <rect fill='url(#soundIconGradient)' x="61" y="26" width="22" height="9" />           
        <rect fill='url(#soundIconGradient)' x="61" y="35" width="22" height="9" transform="rotate(18 48 47)" />
    </svg>
);

const MediaPlayerApp = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className='media-player-app'>
        <aside className='left-menu'>
            <ul>
                <li>Now<br/>Playing</li>
                <li>Media<br/>Guide</li>
                <li>Copy<br/>from CD</li>
                <li>Media<br/>Library</li>
                <li>Radio<br/>Tuner</li>
                <li>Copy to CD<br/>or Device</li>
                <li>Skin<br/>Chooser</li>
            </ul>
        </aside>
        <div className="song-wrap">
            <div className="song-title">
                <span className="company">Microsoft</span>
                <span className="song">Windows Welcome Music</span>
            </div>
            <div className="song-cover"></div>
            <div className="song-buttons">
                <button className='asterisk'>✱</button>
                <button className='move-back'>◀</button>
                <button className='move-next'>▶</button>
                <span>Ambience:Random</span>
                <button className='fullscreen'>
                    <FullscreenIcon />
                </button>
            </div>
        </div>

        <div className="song-info">
            <button className='play-song' title='play song'>
                <PlayIconSecondary/>
            </button>
            <span className="song-name">Song:</span>
            <span className="track"></span>
        </div>

        <aside className='playlist'>
            <span className="open-playlist">
                <button className='show-playlists' title='show playlists'>
                    ▶
                </button>
            </span>
            <span className="total-time">Total Time:</span>
        </aside>
        <div className="player-button">
            <button
                className="play-button play"
                onClick={() => setIsPlaying(prev => !prev)}
            >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button className="play-button stop" onClick={() => setIsPlaying(false)}>
                <StopIcon />
            </button>
            <button className="play-button back">
                <SkipBackIcon />
            </button>
            <button className="play-button forward">
                <SkipForwardIcon />
            </button>
            <button className="play-button sound">
                <SoundIcon />
            </button>
        </div>
    </div>
  )
}

export default MediaPlayerApp