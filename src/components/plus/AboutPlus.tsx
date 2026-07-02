import { useDraggableDialog } from '../../hooks/useDraggableDialog';
import './AboutPlus.css'
import '../App.css';

interface AboutPlusProps {
    onClose: () => void;
    style?: React.CSSProperties;
}

const AboutPlus = ({ onClose, style }: AboutPlusProps) => {
  const { dialogRef, draggableStyle, onMouseDown } = useDraggableDialog();

  return (
<div
        id='about'
        className='app-window plus-window'
        style={{ ...style, ...draggableStyle }}
        ref={dialogRef}
        tabIndex={-1}
        onMouseDown={onMouseDown}
    >
        <div className='title-bar wmp-title'>
            <span className='title-bar-text'>
                About Microsoft Plus! for Windows XP
            </span>
            <div className='title-bar-buttons xp-title-controls'>
                <button
                    type='button'
                    className='xp-title-control btn-close'
                    onClick={onClose}
                    aria-label='Close'
                >
                    ✕
                </button>
            </div>
            <div className="plus-modal-content">
                <div className="flow-right">
                    <p>Microsoft (R) Plus! for Windows (R) XP</p>
                    <p>Version 1.00.00.0554</p>
                    <p>Product ID: 55705-980-0000007-04885</p>
                    <p>Copyright (C) 2001 Microsoft Corporation.</p>
                    <p>All rights reserved.</p>
                </div>
                <p className='warning'>
                    Warning: This computer program is protected by copyright law and international
                    treaties. Unauthorized reproduction or distribution of this program, or any portion
                    of it, may result in severe civil and criminal penalties, and will be prosecuted to
                    the maximum extent possible under the law.
                </p>

                <p className='authors'>
                    Images provided by Bettmann/Corbis; Tiziana and Gianni Baldizzone/Corbis; D.
                    Robert and Lorri Franz/Corbis; Craig Aurness/Corbis; Danny Lehman/Corbis;
                    R.W. Jones/Corbis; Warren Morgan/Corbis; Seth Joel/Corbis; Culver Pictures,
                    Inc.; Henk Dawson/Digital Kitchen; Mel Yates/FPG International, LLC;
                    Vega/FPG International LLC; Pat O'Hara/O'Hara Photography; Denis
                    Olson/O'Hara Photography; PhotoAlto; PhotoDisc, Inc.; World
                    Prospective/Stone; Stephen Frink/Stone; Holly Harris/Stone;
                    Fisher/Thatcher/Stone; Kim Westerskov/Stone.
                </p>
            </div>
        </div>


    </div>
  )
}

export default AboutPlus