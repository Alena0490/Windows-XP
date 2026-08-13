export interface IndexEntry {
  keyword: string;
  id: string;
  title: string;
}

export const helpIndex: IndexEntry[] = [
  // WhatsNew
  { keyword: "what's new topics", id: 'whatsnew:topics', title: "What's new topics" },
  { keyword: 'taking a tour or tutorial', id: 'whatsnew:tour', title: 'Taking a tour or tutorial' },
  { keyword: 'windows xp articles: walk through ways to use your pc', id: 'whatsnew:walkthrough', title: 'Windows XP articles: Walk through ways to use your PC' },
  { keyword: 'activation, license, and registration', id: 'whatsnew:activation', title: 'Activation, license, and registration' },
  { keyword: 'programs included with windows xp', id: 'whatsnew:components', title: 'Programs included with Windows XP' },
  { keyword: "what's new", id: 'whatsnew:whatsnew', title: "What's new" },
  { keyword: "what's new in windows xp security", id: 'whatsnew:security', title: "What's new in Windows XP security" },

  // MusicVideo
  { keyword: 'music and sounds', id: 'musicvideo:musicsounds', title: 'Music and sounds' },
  { keyword: 'video', id: 'musicvideo:video', title: 'Video' },
  { keyword: 'games', id: 'musicvideo:games', title: 'Games' },
  { keyword: 'photos and digital images', id: 'musicvideo:photos', title: 'Photos and digital images' },

  // NetworkingWeb
  { keyword: 'e-mail and the web', id: 'networking:email', title: 'E-mail and the Web' },
  { keyword: 'networking', id: 'networking:networking', title: 'Networking' },
  { keyword: 'sharing files, printers, and other resources', id: 'networking:sharing', title: 'Sharing files, printers, and other resources' },
  { keyword: 'passwords and security', id: 'networking:passwords', title: 'Passwords and security' },
  { keyword: 'home or small office networking', id: 'networking:homeoffice', title: 'Home or small office networking' },
  { keyword: 'fixing networking or web problems', id: 'networking:fixing', title: 'Fixing networking or Web problems' },

  // WorkingRemotely
  { keyword: 'working with content offline', id: 'remotework:offline', title: 'Working with content offline' },
  { keyword: 'remote desktop', id: 'remotework:remotedesktop', title: 'Remote Desktop' },
  { keyword: 'laptop hints', id: 'remotework:laptop', title: 'Laptop hints' },
  { keyword: 'power options', id: 'remotework:power', title: 'Power options' },
  { keyword: 'power options for laptops', id: 'remotework:powerlaptop', title: 'Power options for laptops' },
  { keyword: 'synchronizing files with synchronization manager', id: 'remotework:syncmanager', title: 'Synchronizing files with Synchronization Manager' },
  { keyword: 'synchronizing files with briefcase', id: 'remotework:briefcase', title: 'Synchronizing files with Briefcase' },
  { keyword: 'getting help remotely', id: 'remotework:helpremotely', title: 'Getting help remotely' },
  { keyword: 'getting connected', id: 'remotework:connected', title: 'Getting connected' },

  // CustomizeComputer
  { keyword: 'your desktop', id: 'customize:desktop', title: 'Your desktop' },
  { keyword: 'your desktop icons', id: 'customize:desktopicons', title: 'Your desktop icons' },
  { keyword: 'your start menu', id: 'customize:startmenu', title: 'Your Start menu' },
  { keyword: 'background and themes', id: 'customize:background', title: 'Background and themes' },
  { keyword: 'screen savers and screen settings', id: 'customize:screensaver', title: 'Screen savers and screen settings' },
  { keyword: 'files, folders, and programs', id: 'customize:files', title: 'Files, folders, and programs' },
  { keyword: 'keyboard and mouse', id: 'customize:keyboard', title: 'Keyboard and mouse' },
  { keyword: 'multiple monitors', id: 'customize:monitors', title: 'Multiple monitors' },
  { keyword: 'fonts and text', id: 'customize:fonts', title: 'Fonts and text' },
  { keyword: 'date, time, region, and language', id: 'customize:datetime', title: 'Date, time, region, and language' },
  { keyword: 'sounds and audio devices', id: 'customize:sounds', title: 'Sounds and audio devices' },
  { keyword: 'using handwriting or speech recognition', id: 'customize:handwriting', title: 'Using handwriting or speech recognition' },
  { keyword: 'customizing the way you work', id: 'customize:workway', title: 'Customizing the way you work' },
  { keyword: 'sharing your computer', id: 'customize:sharing', title: 'Sharing your computer' },
  { keyword: 'fixing customizing problems', id: 'customize:fixing', title: 'Fixing customizing problems' },
  { keyword: 'customizing your computer using group policy', id: 'customize:policy', title: 'Customizing your computer using Group Policy' },

  // PrintingFaxing
  { keyword: 'printing', id: 'print:printing', title: 'Printing' },
  { keyword: 'network printers', id: 'print:network', title: 'Network printers' },
  { keyword: 'fixing a printing problem', id: 'print:fixing', title: 'Fixing a printing problem' },
  { keyword: 'faxing', id: 'print:faxing', title: 'Faxing' },

  // PerformanceMaintenance
  { keyword: 'maintaining your computer', id: 'performance:maintaining', title: 'Maintaining your computer' },
  { keyword: "managing your computer's performance", id: 'performance:managing', title: "Managing your computer's performance" },
  { keyword: 'keeping your system safe', id: 'performance:safe', title: 'Keeping your system safe' },
  { keyword: 'freeing up disk space', id: 'performance:freeingspace', title: 'Freeing up disk space' },
  { keyword: 'using backup', id: 'performance:backup', title: 'Using Backup' },
  { keyword: 'using system restore to undo changes', id: 'performance:systemrestore', title: 'Using System Restore to undo changes' },
  { keyword: 'conserving power on your computer', id: 'performance:power', title: 'Conserving power on your computer' },
  { keyword: 'scheduling tasks', id: 'performance:scheduling', title: 'Scheduling tasks' },
  { keyword: 'advanced performance and maintenance tools', id: 'performance:advancedtools', title: 'Advanced performance and maintenance tools' },
  { keyword: 'fixing performance and maintenance problems', id: 'performance:fixing', title: 'Fixing performance and maintenance problems' },

  // WindowsBasics
  { keyword: 'core windows tasks', id: 'windowsbasics:core', title: 'Core Windows tasks' },
  { keyword: 'searching for information', id: 'windowsbasics:searching', title: 'Searching for information' },
  { keyword: 'protecting your computer', id: 'windowsbasics:protecting', title: 'Protecting your computer' },
  { keyword: 'tips for using help', id: 'windowsbasics:tips', title: 'Tips for using Help' },

  // SecurityBasics
  { keyword: 'use windows to help keep your computer more secure', id: 'securitybasics:windows', title: 'Use Windows to help keep your computer more secure' },
  { keyword: 'be security savvy: what you should do', id: 'securitybasics:savvy', title: 'Be security savvy: what you should do' },
  { keyword: "use the security center to check your computer's security settings", id: 'securitybasics:securitycenter', title: "Use the Security Center to check your computer's security settings" },
  { keyword: 'help protect your computer online', id: 'securitybasics:online', title: 'Help protect your computer online' },
  { keyword: 'share your computer more safely', id: 'securitybasics:sharing', title: 'Share your computer more safely' },
  { keyword: 'make your home network more secure', id: 'securitybasics:network', title: 'Make your home network more secure' },

  // SystemAdministration
  { keyword: 'security and administration tools', id: 'systemadministration:security', title: 'Security and administration tools' },
  { keyword: 'passwords and user accounts', id: 'systemadministration:passwords', title: 'Passwords and user accounts' },
  { keyword: 'computer management', id: 'systemadministration:computer', title: 'Computer management' },
  { keyword: 'getting system information', id: 'systemadministration:sysinfo', title: 'Getting system information' },
  { keyword: 'backing up files and folders', id: 'systemadministration:backup', title: 'Backing up files and folders' },
  { keyword: 'disk management', id: 'systemadministration:diskmgmt', title: 'Disk management' },
  { keyword: 'file encryption', id: 'systemadministration:fileencryption', title: 'File encryption' },
  { keyword: 'removable storage', id: 'systemadministration:removablestorage', title: 'Removable Storage' },
  { keyword: 'remote assistance', id: 'systemadministration:remoteassistance', title: 'Remote Assistance' },
  { keyword: 'digital signatures', id: 'systemadministration:digitalsignatures', title: 'Digital signatures' },
  { keyword: 'access control', id: 'systemadministration:accesscontrol', title: 'Access Control' },

  // Accessibility
  { keyword: 'understanding windows xp accessibility features', id: 'accessibility:understanding', title: 'Understanding Windows XP accessibility features' },
  { keyword: 'features for people who are deaf or hard-of-hearing', id: 'accessibility:deaf', title: 'Features for people who are deaf or hard-of-hearing' },
  { keyword: 'features for people who are blind or have impaired vision', id: 'accessibility:blind', title: 'Features for people who are blind or have impaired vision' },
  { keyword: 'features for people who have a mobility impairment', id: 'accessibility:mobility', title: 'Features for people who have a mobility impairment' },
  { keyword: 'customizing your keyboard and mouse', id: 'accessibility:customize', title: 'Customizing your keyboard and mouse' },
  { keyword: 'windows keyboard shortcuts overview', id: 'accessibility:shortcuts', title: 'Windows keyboard shortcuts overview' },
  { keyword: 'using handwriting or speech recognition', id: 'accessibility:handwriting', title: 'Using handwriting or speech recognition' },

  // Hardware
  { keyword: 'installing and configuring hardware', id: 'hardware:installing', title: 'Installing and configuring hardware' },
  { keyword: 'scanners and cameras', id: 'hardware:scanners', title: 'Scanners and cameras' },
  { keyword: 'game controllers', id: 'hardware:gamecontrollers', title: 'Game controllers' },
  { keyword: 'modems', id: 'hardware:modems', title: 'Modems' },
  { keyword: 'monitors', id: 'hardware:monitors', title: 'Monitors' },
  { keyword: 'laptops', id: 'hardware:laptops', title: 'Laptops' },
  { keyword: 'cds and other storage devices', id: 'hardware:cds', title: 'CDs and other storage devices' },
  { keyword: 'keyboard, mouse, and pointing devices', id: 'hardware:keyboardmouse', title: 'Keyboard, mouse, and pointing devices' },
  { keyword: 'microphones and speakers', id: 'hardware:mics', title: 'Microphones and speakers' },
  { keyword: 'wireless link', id: 'hardware:wirelesslink', title: 'Wireless Link overview' },
  { keyword: 'printers', id: 'hardware:printers', title: 'Printers' },
  { keyword: 'using hardware profiles', id: 'hardware:hardwareprofiles', title: 'Using hardware profiles' },
  { keyword: 'fixing a hardware problem', id: 'hardware:fixingproblem', title: 'Fixing a hardware problem' },
  { keyword: 'bluetooth devices (wireless)', id: 'hardware:bluetooth', title: 'Bluetooth devices (wireless)' },

  // FixingProblem
  { keyword: 'troubleshooting problems', id: 'fixingproblem:troubleshooting', title: 'Troubleshooting problems' },
  { keyword: 'application and software problems', id: 'fixingproblem:appsoftware', title: 'Application and software problems' },
  { keyword: 'games, sound, and video problems', id: 'fixingproblem:games', title: 'Games, sound, and video problems' },
  { keyword: 'e-mail and messaging problems', id: 'fixingproblem:email', title: 'E-mail and messaging problems' },
  { keyword: 'networking problems', id: 'fixingproblem:networking', title: 'Networking problems' },
  { keyword: 'printing problems', id: 'fixingproblem:printing', title: 'Printing problems' },
  { keyword: 'performance and maintenance problems', id: 'fixingproblem:performance', title: 'Performance and maintenance problems' },
  { keyword: 'hardware and system device problems', id: 'fixingproblem:hardware', title: 'Hardware and system device problems' },
  { keyword: 'startup and shut down problems', id: 'fixingproblem:startupshutdown', title: 'Startup and Shut Down problems' },
];
