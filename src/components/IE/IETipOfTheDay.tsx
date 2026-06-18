import { useState } from 'react';
import TipImage from '../../img/tips.gif';
import Close from '../../img/tileClose.png';
import '../files/TipOfTheDay.css';

interface TipProps {
    onClose: () => void;
}

const TIPS = [
    "To save a page or picture without opening it, right-click the link for the item you want, and then click **Save Target As**.",
    "To make Web pages load faster, click the **Tools** menu, click **Internet Options**, click the **Advanced** tab, then turn off sounds and pictures.",
    "When you add a Web page to your Favorites list, you can also make it available to read when you're not connected to the Internet.",
    "To move to the beginning of a document, press the **HOME** key.",
    "To move to the end of a document press **END**.",
    "To see a list of all Internet addresses you have typed during this session, click the small down arrow at the right end of the Address bar.",
    "You can set a different level of security for each Web site. On the **Tools** menu, click **Internet Options**, and then click the **Security** tab.",
    "You can close the current window by pressing **Ctrl+W**.",
    'To view the current Web page in full-screen mode, press **F11**. Press **F11** again to return to regular view.',
    'You can press the **BACKSPACE** key to quickly go back to the previous Web page.',
    'To stop a Web page from loading, press the **ESC** key on your keyboard.',
    'You can open a new browser window identical to the current one by pressing **Ctrl+N**.',


];

const IETipOfTheDay = ({ onClose }: TipProps) => {
    const [tipIndex, setTipIndex] = useState(0);

     const nextTip = () => {
        setTipIndex(prev => (prev + 1) % TIPS.length);
    };
    return (
        <div className='tip-body'>
            <button
                type='button'
                className='tip-close'
                aria-label='Close tip'
                onClick={onClose}
            >
                <img src={Close} alt='' />
            </button>
            <img src={TipImage} alt='' className='tip-icon' />
            <div className='tip-texts'>
                <p className='tip-bold'>Did you know...</p>
                <p className='tip-text'>
                    {TIPS[tipIndex].split(/\*\*(.*?)\*\*/).map((part, i) =>
                        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                    )}
                </p>
            </div>
            <button
                type='button'
                className='tip-next'
                onClick={nextTip}
            >
                Next tip
            </button>
        </div>
    );
};

export default IETipOfTheDay;