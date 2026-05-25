export type SearchView =
    | 'home' | 'pictures' | 'documents' | 'files'
    | 'internet' | 'preferences' | 'results' | 'results-done'
    | 'indexing' | 'files-behavior' | 'internet-behavior'| 'results-found' | 'results-empty'; 

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


// PREFERNECES
export const preferenceItems = [
    { id: 'no-character',      label: 'Without an animated screen character',               icon: 'Go',         view: null                },
    { id: 'different-char',    label: 'With a different character',                         icon: 'Go',         view: null                },
    { id: 'indexing',          label: 'With Indexing Service (for faster local searches)',  icon: 'Go',         view: 'indexing'          },
    { id: 'files-behavior',    label: 'Change files and folders search behavior',           icon: 'Go',         view: 'files-behavior'    },
    { id: 'internet-behavior', label: 'Change Internet search behavior',                   icon: 'Go',         view: 'internet-behavior' },
    { id: 'no-balloon',        label: "Don't show balloon tips",                            icon: 'Go',         view: null                },
    { id: 'autocomplete',      label: 'Turn AutoComplete off',                             icon: 'Go',         view: null                },
] as const;

// SEARCHING
export type LookIn = 'my-computer' | 'local-disk' | 'documents' | 'desktop';

export const lookInOptions = [
    { id: 'my-computer', label: 'My Computer', icon: 'MyComputer' },
    { id: 'local-disk',  label: 'Local Disk (C:)', icon: 'LocalDisc' },
    { id: 'documents',   label: 'My Documents', icon: 'MyDocuments' },
    { id: 'desktop',     label: 'Desktop', icon: 'Desktop' },
] as const;

export const advancedSections = [
    { id: 'modified', label: 'When was it modified?' },
    { id: 'size',     label: 'What size is it?' },
    { id: 'advanced', label: 'More advanced options' },
] as const;

// MEDIA TYPES (Pictures, music, or video view)
export type MediaType = 'pictures' | 'music' | 'video';

export const mediaTypes = [
    { id: 'pictures', label: 'Pictures and Photos' },
    { id: 'music',    label: 'Music'               },
    { id: 'video',    label: 'Video'               },
] as const;

// MODIFIED OPTIONS (Documents view)
export type ModifiedOption = 'any' | 'last-week' | 'past-month' | 'past-year';

export const modifiedOptions = [
    { id: 'any',        label: "Don't remember"         },
    { id: 'last-week',  label: 'Within the last week'   },
    { id: 'past-month', label: 'Past month'             },
    { id: 'past-year',  label: 'Within the past year'   },
] as const;

export const internetSearchEngines = [
    'MSN', 'AltaVista', 'Google', 'Ask Jeeves', 'Fast',
    'DirectHit', 'Excite', 'GoTo', 'NorthernLight', 'Yahoo',
] as const;

export type InternetSearchEngine = typeof internetSearchEngines[number];
export type FilesBehavior        = 'standard' | 'advanced';
export type InternetSearchMode   = 'companion' | 'classic';
export type IndexingChoice       = 'yes' | 'no';
