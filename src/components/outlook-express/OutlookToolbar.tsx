import CreateMailIcon from '../../img/OECreateMail.webp'
import SendRecvIcon from '../../img/OESendAndReceive.webp'
import AddressesIcon from '../../img/AddressBook.webp'
import FindIcon from './img/OEFind.webp'
import './OutlookExpress.css'

interface OutlookToolbarProps {
    onCreateMail?: () => void;
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
    return (
        <div className="outlook-toolbar">
            <button className="toolbar-btn split" onClick={onCreateMail}>
                <img src={CreateMailIcon} alt="" />
                <span>Create Mail</span>
                <span className="toolbar-caret" />
            </button>

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