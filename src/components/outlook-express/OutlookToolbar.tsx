import { useState, useRef } from 'react';
import StationeryMenu from './StationeryMenu';

import CreateMailIcon from '../../img/OECreateMail.webp'
import SendRecvIcon from '../../img/OESendAndReceive.webp'
import AddressesIcon from '../../img/AddressBook.webp'
import FindIcon from './img/OEFind.webp'
import './OutlookExpress.css'

interface OutlookToolbarProps {
    onCreateMail?: (stationery: string | null) => void;
    onSendRecv?: () => void;
    onAddresses?: () => void;
    onFind?: () => void;
    sendRecvDisabled?: boolean;
}

const OutlookToolbar = ({
    onCreateMail,
    onSendRecv,
    onAddresses,
    onFind,
    sendRecvDisabled = true,
}: OutlookToolbarProps) => {
    const [stationeryMenuOpen, setStationeryMenuOpen] = useState(false);
    const [stationery, setStationery] = useState<string | null>(null);
    const createMailCaretRef = useRef<HTMLButtonElement>(null);

    return (
        <div className="outlook-toolbar">
            <div className="toolbar-btn-group">
                <button
                    className="toolbar-btn split-main"
                    onClick={() => onCreateMail?.(stationery)}
                >
                    <img src={CreateMailIcon} alt="" />
                    <span>Create Mail</span>
                </button>

                <button
                    ref={createMailCaretRef}
                    className={`toolbar-btn split-caret${stationeryMenuOpen ? ' open' : ''}`}
                    aria-label="Select stationery"
                    aria-haspopup="menu"
                    aria-expanded={stationeryMenuOpen}
                    onClick={() => setStationeryMenuOpen(prev => !prev)}
                >
                    <span className="toolbar-caret" />
                </button>

                {stationeryMenuOpen && (
                    <StationeryMenu
                        anchorRef={createMailCaretRef}
                        selectedId={stationery ?? undefined}
                        onSelect={setStationery}
                        onSelectStationeryDialog={() => {}}
                        onWebPage={() => {}}
                        onRequestClose={() => setStationeryMenuOpen(false)}
                    />
                )}
            </div>

            <div className="toolbar-sep" />

            <button className="toolbar-btn split" onClick={onSendRecv} disabled={sendRecvDisabled}>
                <img src={SendRecvIcon} alt="" />
                <span>Send/Recv</span>
                <span className="toolbar-caret disabled" />
            </button>

            <div className="toolbar-sep" />

            <button className="toolbar-btn" onClick={onAddresses}>
                <img src={AddressesIcon} alt="" />
                <span>Addresses</span>
            </button>

            <button className="toolbar-btn split" onClick={onFind}>
                <img src={FindIcon} alt="" />
                <span>Find</span>
                <span className="toolbar-caret" />
            </button>
        </div>
    )
}

export default OutlookToolbar