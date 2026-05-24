import { useState } from 'react';
import Close from '../../img/tileClose.png';
import Clock from '../../img/Clock.webp';
import Calendar from '../../img/Calendar1.webp';
import URLIcon from '../../img/URL.webp';
import { favourites } from './data/IEData';
import '../files/HistorySidebar.css';

interface HistoryEntry {
    url: string;
    visitedAt?: Date;
}

interface IEHistoryProps {
    history: string[];
    historyIndex: number;
    navigateTo: (url: string) => void;
    onClose: () => void;
}

// Group URLs by day relative to today
const groupByDay = (entries: HistoryEntry[]): Record<string, HistoryEntry[]> => {
    const groups: Record<string, HistoryEntry[]> = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // Sunday start

    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    entries.forEach(entry => {
        const visited = entry.visitedAt ? new Date(entry.visitedAt) : new Date();
        visited.setHours(0, 0, 0, 0);

        let label: string;
        if (visited.getTime() === today.getTime()) {
            label = 'Today';
        } else if (visited.getTime() === yesterday.getTime()) {
            label = 'Yesterday';
        } else if (visited >= weekStart) {
            label = weekDays[visited.getDay()];
        } else {
            label = 'Last Week';
        }

        if (!groups[label]) groups[label] = [];
        groups[label].push(entry);
    });

    return groups;
};

// Sort groups in IE display order
const GROUP_ORDER = ['Last Week', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Yesterday', 'Today'];

const IEHistory = ({ history, historyIndex, navigateTo, onClose }: IEHistoryProps) => {
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({ Today: true });

    // ── Map URLs to entries with default visitedAt = now (session history) ──
    const entries: HistoryEntry[] = history.map(url => ({ url, visitedAt: new Date() }));
    const grouped = groupByDay(entries);
    const sortedLabels = Object.keys(grouped).sort(
        (a, b) => GROUP_ORDER.indexOf(a) - GROUP_ORDER.indexOf(b)
    );

    // Return favicon for the given URL, falling back to the default URL icon
    const getFavicon = (url: string): string => {
        for (const group of favourites) {
            const item = group.items.find(i => i.url === url);
            if (item) return item.icon;
        }
        return URLIcon;
    };

    const toggleGroup = (label: string) => {
        setExpandedGroups(prev => ({ ...prev, [label]: !prev[label] }));
    };

    return (
        <div className='history-wrap ie-history-wrap'>
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

                {/* ── Grouped items ── */}
                {sortedLabels.map(label => (
                    <div key={label} className='history-group'>
                        <button
                            type='button'
                            className='history-group-header'
                            onClick={() => toggleGroup(label)}
                        >
                            <img src={Calendar} alt='' className='history-calendar-icon' />
                            <span>{label}</span>
                        </button>

                        {expandedGroups[label] && (
                            <div className='history-items'>
                                {grouped[label].map((entry, index) => {
                                    const globalIndex = history.indexOf(entry.url);
                                    return (
                                        <button
                                            key={index}
                                            type='button'
                                            className={`history-item${globalIndex === historyIndex ? ' is-active' : ''}`}
                                            onClick={() => navigateTo(entry.url)}
                                        >
                                            <img src={getFavicon(entry.url)} alt='' className='history-item-icon' />
                                            <span>{entry.url}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}

            </div>
        </div>
    );
};

export default IEHistory;