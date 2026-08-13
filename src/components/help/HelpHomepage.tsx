import './HelpAnsSupport.css'

import Customization from '../../img/Customization.webp'
import Go from '../../img/Go.webp'
import Hardware from '../../img/Hardware.webp'
import NetworkConnections from '../../img/NetworkConnections.webp'
import News from '../../img/News.webp'

interface HelpHomepageProps {
    onNavigate: (view: 'home' | 'whatsnew' | 'musicvideo' | 'networking' | 'remotework' | 'customize' | 'print' | 'fixingproblem' | 'support' | 'tools' | 'performance' | 'windowsbasics' | 'securitybasics' | 'systemadministration' | 'accessibility' | 'hardware' | 'feedback') => void;
}

const HelpHomepage = ({ onNavigate }: HelpHomepageProps) => {
    
  return (
    <div className='help-page'>
        <div className="column">
            <h3>Pick Help Topic</h3>
            <div className="topic">
                <img src={News} alt="News" />
                <ul>
                    <li onClick={() => onNavigate('whatsnew')}>What's new in Windows XP</li>
                    <li onClick={() => onNavigate('musicvideo')}>Music, video, games, and photos</li>
                    <li onClick={() => onNavigate('windowsbasics')}>Windows basics</li>
                    <li onClick={() => onNavigate('securitybasics')}>Protecting your PC: security basics</li>
                </ul>
            </div>
            <div className="topic">
                <img src={NetworkConnections} alt="" />
                <ul>
                    <li onClick={() => onNavigate('networking')}>Networking and the Web</li>
                    <li onClick={() => onNavigate('remotework')}>Working remotely</li>
                    <li onClick={() => onNavigate('systemadministration')}>System administration</li>
                </ul>
            </div>
            <div className="topic">
                <img src={Customization} alt="Customization" />
                <ul>
                    <li onClick={() => onNavigate('customize')}>Customizing your computer</li>
                    <li onClick={() => onNavigate('accessibility')}>Accessibility</li>
                </ul>
            </div>
            <div className="topic">
                <img src={Hardware} alt="Hardware" />
                <ul>
                    <li onClick={() => onNavigate('print')}>Printing and faxing</li>
                    <li onClick={() => onNavigate('performance')}>Performance and maintenance</li>
                    <li onClick={() => onNavigate('hardware')}>Hardware</li>
                    <li onClick={() => onNavigate('fixingproblem')}>Fixing a problem</li>
                    <li onClick={() => onNavigate('feedback')}>Send your feedback to Microsoft</li>
                </ul>
            </div>
        </div>

        <div className="column right">
            <h3>Ask for Assistance</h3>
            <ul>
                <li><img src={Go} alt="Go" /> Invite a friend to connect to your computer with <strong>Remote Assistance</strong></li>
                <li onClick={() => onNavigate('support')}><img src={Go} alt="Go" /> Get <strong>support</strong>, or find information in <strong>Windows XP newsgroups</strong></li>
            </ul>
            <h3>Pick a Task</h3>
            <ul>
                <li><img src={Go} alt="Go" /> Keep your computer up-to-date with <strong>Windows Update</strong></li>
                <li><img src={Go} alt="Go" /> Find <strong>compatible hardware and software</strong> for Windows XP</li>
                <li><img src={Go} alt="Go" /> Undo changes to your computer with <strong>System Restore</strong></li>
                <li onClick={() => onNavigate('tools')}><img src={Go} alt="Go" /> Use <strong>Tools</strong> to view your computer information and diagnose problems</li>
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