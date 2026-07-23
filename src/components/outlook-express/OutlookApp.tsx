import { useState } from 'react'
import Msn from './img/MSNLINK.gif'
import LocalFolders from './img/LocalFolders.webp'
import Inbox from './img/InboxClassic.webp'
import Outbox from './img/OutboxClassic.webp'
import Sent from './img/SentClassic.webp'
import Drafts from './img/Drafts.webp'
import Deleted from './img/Deleted.webp'
import WorkOnline from './img/WorkOnline.webp'
import OEClassic from './img/OEClassis.webp'

import XPScrollbar from '../XPScrollbar';
import './OutlookExpress.css'

const OutlookApp = () => {
    const [showTipOfTheDay, setShowTipTipOfTheDay] = useState(true)

  return (
    <div className='outlook-body'>
        <div className="outlook-top-bar">

        </div>

        <XPScrollbar className="outlook-main">
            <div className="outlook-title">
                <img src={OEClassic} alt="" />
                Outlook Express
            </div>
                <div className="outlook-flex">
                    <aside>
                        <div className="folders">
                            <div className="folders-heading">
                                <span>Folders</span>
                                <button 
                                    className='heading-close'
                                    aria-label='Close section'
                                >&#x2716;</button>
                            </div>
                            <div className="folders-body">
                                <ul className="win32-tree">
                                    {/* Root: Outlook Express */}
                                    <li className="root-node">
                                        <details open>
                                            <summary>
                                                <img src={OEClassic} alt="" />
                                                <span>Outlook Express</span>
                                            </summary>
                                            
                                            <ul>
                                                {/* Second level: Local Folders */}
                                                <li>
                                                    <details open>
                                                        <summary>
                                                            <img src={LocalFolders} alt="" />
                                                            <span>Local Folders</span>
                                                        </summary>
                                                        
                                                        <ul>
                                                            {/* Koncové složky */}
                                                            <li className="local"><img src={Inbox} alt="" /><span>Inbox</span></li>
                                                            <li className="local"><img src={Outbox} alt="" /><span>Outbox</span></li>
                                                            <li className="local"><img src={Sent} alt="" /><span>Sent Items</span></li>
                                                            <li className="local"><img src={Deleted} alt="" /><span>Deleted Items</span></li>
                                                            <li className="local last-node"><img src={Drafts} alt="" /><span>Drafts</span></li>
                                                        </ul>
                                                    </details>
                                                </li>
                                            </ul>
                                        </details>
                                    </li>
                                </ul>
                            </div>

                        </div>
                        <div className="contents">
                            <div className="contents-heading">
                                <span><span className='mnemonic'>C</span>ontacts</span>
                                <button 
                                    className='heading-close'
                                    aria-label='Close section'
                                >&#x2716;</button>
                            </div>
                            <div className="contents-body">
                                There are no contacts to display. Click on Contacts to create a new contact.
                            </div>
                        </div>
                    </aside>
                    <div className="outlook-page">
                        <span className="white"><span className='none'>Go to <img src={Msn} alt="msn" /></span></span>
                        <span className="black"></span>
                        <div className="gray-bar">
                            <a href="#">Find a message...</a>
                            <span>Identities</span>
                        </div>
                        <div className="inner-flex">
                            <div className="e-mail"></div>
                            <div className="tip-of-the-day">
                                <div className='tip-title'>
                                    Tip the day
                                    <button
                                        className='tip-close'
                                        aria-label='close tip ot the day'
                                    >&#x2716;</button>
                                </div>
                                <div className="oe-tip-body"></div>
                                <div className="tip-switch">
                                    <button className="prev">Previous</button>
                                    <button className="next">Next</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </XPScrollbar>

        <div className="oe-status-bar">
            <span className='inbox-status'></span>
            <span><img src={WorkOnline} alt="" />Working Online</span>
            <span><img src={OEClassic} alt="" />No new messages</span>
        </div>
    </div>
  )
}

export default OutlookApp