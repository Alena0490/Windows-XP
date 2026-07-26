import { useState } from 'react';
import { useDraggableDialog } from '../../hooks/useDraggableDialog';

import WindowsLayoutIcon from './img/WindowsLayoutBW.webp'
import WindowsLayoutPreview from './img/WindowsLayout.webp'
import './WindowsLayoutDialog.css';
import '../../App.css';

interface WindowLayoutDialogProps {
    showContacts: boolean;
    showFolders: boolean;
    onApply: (settings: { contacts: boolean; folderList: boolean }) => void;
    onClose: () => void;
    style?: React.CSSProperties;
}

const WindowLayoutDialog = ({
    showContacts,
    showFolders,
    onApply,
    onClose,
    style,
}: WindowLayoutDialogProps) => {
    const { dialogRef, draggableStyle, onMouseDown } = useDraggableDialog();

    const [draft, setDraft] = useState({
        contacts: showContacts,
        folderList: showFolders,
    });

    const isDirty =
        draft.contacts !== showContacts ||
        draft.folderList !== showFolders;

    const handleOk = () => {
        onApply(draft);
        onClose();
    };

    const handleApply = () => {
        onApply(draft);
    };

    return (
        <div
            className='app-window layout-dialog'
            style={{ ...style, ...draggableStyle }}
            ref={dialogRef}
            tabIndex={-1}
            onMouseDown={onMouseDown}
        >
            <div className='title-bar'>
                <img src={WindowsLayoutIcon} alt="" />
                <span className='title-bar-text'>Window Layout Properties</span>
                <div className='title-bar-buttons xp-title-controls'>
                    <button
                        type='button'
                        className='xp-title-control btn-help'
                        aria-label='Help'
                    >
                        ?
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

            <div className='layout-dialog-body'>
                <div className='layout-tab'>Layout</div>

                 <div className='layout-content'>
                    <fieldset className='layout-section'>
                        <legend>Basic</legend>
                        <div className='layout-section-flex'>
                            <img className='layout-section-icon' src={WindowsLayoutIcon} alt='' />
                            <div className='layout-section-content'>
                                <p>
                                    You can show or hide parts of Outlook Express to best suit
                                    your needs. Check the components below to view them.
                                </p>
                                <div className='layout-checkboxes'>
                                    <label>
                                        <input
                                            type='checkbox'
                                            checked={draft.contacts}
                                            onChange={(e) => setDraft(d => ({ ...d, contacts: e.target.checked }))}
                                        />
                                        Contacts
                                    </label>
                                    <label>
                                        <input type='checkbox' disabled />
                                        Outlook Bar
                                    </label>
                                    <label>
                                        <input type='checkbox' disabled />
                                        Views Bar
                                    </label>
                                    <label>
                                        <input type='checkbox' checked disabled />
                                        Folder Bar
                                    </label>
                                    <label>
                                        <input type='checkbox' checked disabled />
                                        Status Bar
                                    </label>
                                    <label>
                                        <input
                                            type='checkbox'
                                            checked={draft.folderList}
                                            onChange={(e) => setDraft(d => ({ ...d, folderList: e.target.checked }))}
                                        />
                                        Folder List
                                    </label>
                                    <label>
                                        <input type='checkbox' checked disabled />
                                        Toolbar
                                    </label>
                                </div>
                                <button className='luna-btn customize-btn' disabled>
                                    Customize Toolbar...
                                </button>
                            </div>
                        </div>
                            </fieldset>

                            <fieldset className='layout-section preview-section'>
                                <legend>Preview Pane</legend>
                                <div className='layout-section-flex'>
                                    <img className='layout-section-icon' src={WindowsLayoutPreview} alt='' />
                                    <div className='layout-section-content'>
                                        <p>
                                            Use the preview pane to quickly view a message without
                                            opening a separate window.
                                        </p>
                                        <label className='disabled'>
                                            <input type='checkbox' disabled />
                                            Show preview pane
                                        </label>
                                        <div className='preview-radios'>
                                            <label className='disabled'>
                                                <input type='radio' name='preview-position' disabled />
                                                Below messages
                                            </label>
                                            <label className='disabled'>
                                                <input type='radio' name='preview-position' disabled />
                                                Beside messages
                                            </label>
                                        </div>
                                        <label className='disabled'>
                                            <input type='checkbox' disabled />
                                            Show preview pane header
                                        </label>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                <div className='layout-buttons'>
                    <button className='luna-btn' onClick={handleOk}>OK</button>
                    <button className='luna-btn secondary' onClick={onClose}>Cancel</button>
                    <button className='luna-btn secondaryt' onClick={handleApply} disabled={!isDirty}>Apply</button>
                </div>
            </div>
        </div>
    );
};

export default WindowLayoutDialog;