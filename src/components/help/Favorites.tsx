// Favorites.tsx — kompletní přepis s funkčním seznamem

import { useState } from 'react'
import { createPortal } from 'react-dom'

import useSound from '../../hooks/useSound'
import CriticalError from '../CriticalError'
import type { ErrorType } from '../CriticalError'
import type { FavoriteItem } from './hooks/useFavorites'

import AddFavourite from '../../img/AddFavorite1.webp'
import Large from '../../img/HelpAndSupportChangeView2.webp'
import Printer from '../../img/Printer.webp'
import RestoreAllItems from '../../img/RestoreAllItems.webp'
import Small from '../../img/HelpAnSupport ChangeView1.webp'

import './HelpAnsSupport.css'
import './WhatsNew.css'
import './Feedback.css'

interface FavoritesProps {
    favorites: FavoriteItem[];
    onRemove: (id: string) => void;
    onRename: (id: string, title: string) => void;
    onDisplay: (id: string) => void;
    globalVolume?: number;
    globalMuted?: boolean;
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
    isFullscreen?: boolean;
    onToggleFullscreen?: () => void;
}

const Favorites = ({
    favorites,
    onRemove,
    onRename,
    onDisplay,
    globalVolume = 1,
    globalMuted = false,
    plusTheme,
    isFullscreen,
    onToggleFullscreen
}: FavoritesProps) => {
  const sounds = useSound(globalVolume, globalMuted);
  const themeSound = plusTheme === 'aquarium' ? sounds.aquarium
      : plusTheme === 'davinci' ? sounds.daVinci
      : plusTheme === 'nature' ? sounds.nature
      : plusTheme === 'space' ? sounds.space
      : null;
  const playExclamation = () => themeSound ? themeSound.playExclamation() : sounds.playExclamation();

  const [errorType, setErrorType] = useState<ErrorType | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const openError = (type: ErrorType) => {
    playExclamation();
    setErrorType(type);
  };

  const startRename = () => {
    if (!selectedId) return;
    const item = favorites.find(f => f.id === selectedId);
    if (!item) return;
    setEditingId(selectedId);
    setEditValue(item.title);
  };

  const confirmRename = () => {
    if (editingId && editValue.trim()) {
      onRename(editingId, editValue.trim());
    }
    setEditingId(null);
  };

  const handleRemove = () => {
    if (!selectedId) return;
    onRemove(selectedId);
    setSelectedId(null);
  };

  const handleDisplay = () => {
    if (!selectedId) return;
    onDisplay(selectedId);
  };

  return (
    <div className="whatsnew-page">
      <div className="whatsnew-body">
        <div className="whatsnew-tree">
          <div className="tree-box">
            <h4>Favorites</h4>
            <ul className="favorites-list">
                {favorites.map(item => (
                    <li
                        key={item.id}
                        className={selectedId === item.id ? 'is-selected' : ''}
                        onClick={() => setSelectedId(item.id)}
                        onDoubleClick={() => onDisplay(item.id)}
                    >
                        {editingId === item.id ? (
                            <input
                                autoFocus
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={confirmRename}
                                onKeyDown={(e) => { if (e.key === 'Enter') confirmRename(); }}
                            />
                        ) : (
                            item.title
                        )}
                    </li>
                ))}
            </ul>
          </div>

          <div className="favorites-actions">
            <button className="luna-btn secondary" disabled={!selectedId} onClick={startRename}>Rename</button>
            <button className="luna-btn secondary" disabled={!selectedId} onClick={handleRemove}>Remove</button>
            <button className="luna-btn secondary" disabled={!selectedId} onClick={handleDisplay}>Display</button>
          </div>
        </div>

        <div className="whatsnew-content">
            <div className="whatsnew-toolbar">
                <button disabled>
                <img src={AddFavourite} alt="" />
                <span>Add to <span className='mnemonic'>F</span>avorites</span>
                </button>
                <button onClick={onToggleFullscreen}>
                <img src={isFullscreen ? Small : Large} alt="" />
                <span>Change <span className='mnemonic'>V</span>iew</span>
                </button>
                <button onClick={() => openError('helpPrint')}>
                <img src={Printer} alt="" />
                <span><span className='mnemonic'>P</span>rint...</span>
                </button>
                <button onClick={() => openError('helpLocateInContents')}>
                <img src={RestoreAllItems} alt="" />
                <span>Locate in <span className='mnemonic'>C</span>ontents</span>
                </button>
            </div>

            <div className="whats-new-article">
                <h2>Favorites</h2>
                <p>
                    Add Help Topics, search results, and other pages to your Help
                    and Support Favorites list to make them easy to locate in the
                    future.
                </p>
            </div>
        </div>
      </div>

      {errorType && createPortal(
        <CriticalError
          type={errorType}
          onClose={() => setErrorType(null)}
          onYes={() => setErrorType(null)}
          onNo={() => setErrorType(null)}
        />,
        document.body
      )}
    </div>
  )
}

export default Favorites