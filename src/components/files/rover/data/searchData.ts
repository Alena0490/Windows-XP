export type SearchView = 'home' | 'pictures' | 'documents' | 'files' | 'internet' | 'preferences' | 'results';

export const mainItems = [
    { id: 'pictures',  label: 'Pictures, music, or video',                      icon: 'Go',           roverAnim: 'attention' },
    { id: 'documents', label: 'Documents (word processing, spreadsheet, etc.)', icon: 'Go',           roverAnim: 'reading'   },
    { id: 'files',     label: 'All files and folders',                          icon: 'Go',           roverAnim: 'attention' },
    { id: 'help',      label: 'Information in Help and Support Center',         icon: 'Help',         roverAnim: 'reading'   },
] as const;

export const alsoItems = [
    { id: 'internet',    label: 'Search the Internet', icon: 'SearchInternet', roverAnim: 'attention' },
    { id: 'preferences', label: 'Change preferences',  icon: 'Properties',     roverAnim: 'idle'      },
] as const;

export type SearchMainItem = typeof mainItems[number];
export type SearchAlsoItem = typeof alsoItems[number];