import { useEffect } from 'react';
import { useDraggableDialog } from '../../hooks/useDraggableDialog';

import '../../App.css'
import './FontView.css'

interface FontProps {
  isFullscreen: boolean;
  setIsFullscreen: (value: boolean | ((prev: boolean) => boolean)) => void;
  isMinimized: boolean;
  setIsMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;
  onClose: () => void;
  onMouseDown?: () => void;
  onTitleChange: (name: string, icon: string) => void;
  fontName: string; 
  displayName: string;
  fontIcon: string;
  fontUrl: string;    
}

const FontView = ({
  isFullscreen, 
  setIsFullscreen, 
  isMinimized, 
  setIsMinimized,
  onClose,
  onMouseDown,
  onTitleChange,
  fontName,
  displayName,
  fontIcon,
  fontUrl,
}:FontProps) => {

  const { dialogRef, onMouseDown: dragMouseDown, draggableStyle } = useDraggableDialog();

  // Sanitize the file name into a CSS-safe identifier. Real file names like
  // 'digital-7 (italic).ttf' contain dots, spaces and parens that aren't legal
  // CSS identifiers, so the preview text would silently fall back to the
  // default font even though the FontFace itself loaded. Using a sanitized
  // family on BOTH the FontFace and the inline style guarantees they match.
  const familyId = `FontView-${fontName.replace(/[^a-zA-Z0-9-]/g, '-')}`;

// Report title and icon to the parent
useEffect(() => {
    onTitleChange(fontName, fontIcon);
}, [fontName, fontIcon, onTitleChange]);

  // Loading the font
  useEffect(() => {
    const face = new FontFace(familyId, `url("${encodeURI(fontUrl)}")`);
    let cancelled = false;
    face.load().then(loaded => {
        if (!cancelled) document.fonts.add(loaded);
    }).catch(err => {
        console.warn(`FontView: failed to load ${fontName} from ${fontUrl}`, err);
    });
    return () => {
        cancelled = true;
        document.fonts.delete(face);
    };
  }, [familyId, fontName, fontUrl]);

  return (
    <div 
    className={[
      'app-window',
      'font-window',
          isMinimized && 'font--minimized',
          isMinimized && 'app-window--minimized',
          isFullscreen && 'font--fullscreen',
          isFullscreen && 'app-window--fullscreen',
      ].filter(Boolean).join(' ')}
      style={isFullscreen ? {} : draggableStyle}
      ref={dialogRef}
      onMouseDown={onMouseDown}
    >
      <div className='title-bar' onMouseDown={dragMouseDown}>
        <span className='title-bar-text'>
            <img className='file-icon' src={fontIcon} alt='Font Icon' />
            {displayName}
        </span>
        <div className='title-bar-buttons xp-title-controls'>
            <button
                type='button'
                className='xp-title-control btn-minimize'
                onClick={() => setIsMinimized(true)}
                aria-label='Minimize'
            >
                _
            </button>
            <button
                type='button'
                className={`xp-title-control ${isFullscreen ? 'btn-restore' : 'btn-maximize'}`}
                onClick={() => {
                    setIsMinimized(false);
                    setIsFullscreen(prev => !prev);
                }}
                aria-label={isFullscreen ? 'Restore' : 'Maximize'}
            >
                {isFullscreen ? '❐' : '□'}
            </button>
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
      <div className='font-info'>
        <div className='font-view-toolbar'>
            <button type='button' className='font-btn' onClick={onClose}>Done</button>
            <button type='button' className='font-btn'>Print</button>
        </div>

        <div className='font-preview'>
            <div className='font-preview-title' style={{ fontFamily: familyId }}>
                {displayName}
            </div>
            <hr />
            <div className='font-preview-charset' style={{ fontFamily: familyId }}>
                <div>abcdefghijklmnopqrstuvwxyz</div>
                <div>ABCDEFGHIJKLMNOPQRSTUVWXYZ</div>
                <div>1234567890.:,;(*!?')</div>
            </div>
            <hr />
            {[12, 18, 24, 36, 48, 60, 72].map(size => (
                <div key={size} className='font-preview-line'>
                    <span className='font-preview-size'>{size}</span>
                    <span style={{ fontFamily: familyId, fontSize: size }}>
                        Jackdaws love my big sphinx of quartz. 1234567890
                    </span>
                </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default FontView