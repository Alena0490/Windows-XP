import './HelpAnsSupport.css'

import Customization from '../../img/Customization.webp'
import Go from '../../img/Go.webp'
import Hardware from '../../img/Hardware.webp'
import NetworkConnections from '../../img/NetworkConnections.webp'
import News from '../../img/News.webp'

const HelpHomepage = () => {
    
  return (
    <div className='help-page'>
        <div className="column">
            <h3>Pick Help Topic</h3>
            <div className="topic">
                <img src={News} alt="News" />
                <ul>
                    <li>What's new in Windows XP</li>
                    <li>Music, video, games, and photos</li>
                    <li>Windows basics</li>
                </ul>
            </div>
            <div className="topic">
                <img src={NetworkConnections} alt="" />
                <ul>
                    <li>Networking and the Web</li>
                    <li>Working remotely</li>
                    <li>Security and administration</li>
                </ul>
            </div>
            <div className="topic">
                <img src={Customization} alt="Customization" />
                <ul>
                    <li>Customizing your computer</li>
                    <li>Accessibility</li>
                </ul>
            </div>
            <div className="topic">
                <img src={Hardware} alt="Hardware" />
                <ul>
                    <li>Printing and faxing</li>
                    <li>Performance and maintenance</li>
                    <li>Hardware</li>
                    <li>Fixing a problem</li>
                    <li>Send your feedback to Microsoft</li>
                </ul>
            </div>
        </div>

        <div className="column">
            <h3>Ask for Assistance</h3>
            <ul>
                <li><img src={Go} alt="Go" /> Invite a friend to connect to your computer with <strong>Remote Assistance</strong></li>
                <li><img src={Go} alt="Go" /> Get <strong>support</strong>, or find information in <strong>Windows XP newsgroups</strong></li>
            </ul>
            <h3>Pick a Task</h3>
            <ul>
                <li><img src={Go} alt="Go" /> Keep your computer up-to-date with <strong>Windows Update</strong></li>
                <li><img src={Go} alt="Go" /> Find <strong>compatible hardware and software</strong> for Windows XP</li>
                <li><img src={Go} alt="Go" /> Undo changes to your computer with <strong>System Restore</strong></li>
                <li><img src={Go} alt="Go" /> Use <strong>Tools</strong> to view your computer information and diagnose problems</li>
            </ul>
            <h3>Did You Know?</h3>
            <p className="info">
                When you are connected to the Internet, this area will display links to timely help and support information. If you want to connect to the Internet now, <strong>start the New Connection Wizard</strong> and see how to establish a Web connection through an Internet service provider.
            </p>
        </div>
    </div>
  )
}

export default HelpHomepage