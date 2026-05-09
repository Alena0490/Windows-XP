import { FILE_SYSTEM } from '../../data/FileManagerData';
import Close from '../../img/tileClose.png'
import Clock from '../../img/Clock.webp'
import Calendar from '../../img/Calendar1.webp'
import './HistorySidebar.css';

interface HistorySidebarProps {
    navHistory: string[][];
    historyIndex: number;
    navigateTo: (path: string[]) => void;
    onClose: () => void;
}

const HistorySidebar = ({ navHistory, historyIndex, navigateTo, onClose }: HistorySidebarProps) => {
    const getNodeAtPath = (path: string[]) => {
        let node = FILE_SYSTEM;
        for (const id of path) {
            const child = node.children?.find(c => c.id === id);
            if (!child) break;
            node = child;
        }
        return node;
    };

    return (
        <div className='history-wrap'>
            <div className='history-panel'>

                {/* ── Header ── */}
                <div className='history-header'>
                    <span className='history-title'>History</span>
                    <button
                        type='button'
                        className='history-close'
                        aria-label='Close history'
                        onClick={onClose}
                    >
                        <img src={Close} alt='' />
                    </button>
                </div>

                {/* ── View / Search ── */}
                <div className='history-toolbar'>
                    <button type='button' className='history-view-btn' aria-label='View options'>
                        View <span className='arrow-down'>▾</span>
                    </button>
                    <button type='button' className='history-search-btn' aria-label='Search history'>
                        <img src={Clock} alt='' className='history-search-icon' />
                        Search
                    </button>
                </div>

                {/* ── Today ── */}
                <div className='history-group-header'>
                    <img src={Calendar} alt='' className='history-calendar-icon' />
                    <span>Today</span>
                </div>

                {/* ── Items ── */}
                <div className='history-items'>
                    {navHistory.map((path, index) => {
                        const node = getNodeAtPath(path);
                        return (
                            <button
                                key={index}
                                type='button'
                                className={`history-item${index === historyIndex ? ' is-active' : ''}`}
                                onClick={() => navigateTo(path)}
                            >
                                <img src={node.icon} alt='' className='history-item-icon' />
                                <span>{node.name}</span>
                            </button>
                        );
                    })}
                </div>

            </div>
        </div>
    );
};

export default HistorySidebar;