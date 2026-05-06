import { useState } from 'react';
import { FILE_SYSTEM } from '../../data/FileManagerData';
import './FileManagerSidebar.css';

interface FileManagerSidebarProps {
    path: string[];
    navigateTo: (newPath: string[]) => void;
}

const FileManagerSidebar = ({ path, navigateTo }: FileManagerSidebarProps) => {
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

    const toggleGroup = (id: string) => {
        setCollapsed(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className='fm-sidebar'>

            {/* System Tasks */}
            <div className='fm-task-group'>
                <div className='fm-task-header' onClick={() => toggleGroup('system')}>
                    <span>System Tasks</span>
                    <span className='fm-task-chevron'>{collapsed['system'] ? '»' : '«'}</span>
                </div>
                {!collapsed['system'] && (
                    <div className='fm-task-body'>
                        <button type='button' className='fm-task-link' onClick={() => navigateTo([])}>
                            <img src={FILE_SYSTEM.icon} alt='' className='fm-task-icon' />
                            My Computer
                        </button>
                    </div>
                )}
            </div>

            {/* Other Places */}
            <div className='fm-task-group'>
                <div className='fm-task-header' onClick={() => toggleGroup('places')}>
                    <span>Other Places</span>
                    <span className='fm-task-chevron'>{collapsed['places'] ? '»' : '«'}</span>
                </div>
                {!collapsed['places'] && (
                    <div className='fm-task-body'>
                        {FILE_SYSTEM.children?.map(child => (
                            <button
                                key={child.id}
                                type='button'
                                className={`fm-task-link${path[0] === child.id ? ' active' : ''}`}
                                onClick={() => navigateTo([child.id])}
                            >
                                <img src={child.icon} alt='' className='fm-task-icon' />
                                {child.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Details */}
            <div className='fm-task-group'>
                <div className='fm-task-header' onClick={() => toggleGroup('details')}>
                    <span>Details</span>
                    <span className='fm-task-chevron'>{collapsed['details'] ? '»' : '«'}</span>
                </div>
                {!collapsed['details'] && (
                    <div className='fm-task-body fm-task-details'>
                        <img src={FILE_SYSTEM.icon} alt='' className='fm-details-icon' />
                        <div className='fm-details-name'>My Computer</div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default FileManagerSidebar;