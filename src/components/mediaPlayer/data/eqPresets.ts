export interface EqPreset {
    name: string;
    values: number[];
}

export const EQ_PRESETS: EqPreset[] = [
    { name: 'Default',       values: [50,50,50,50,50,50,50,50,50,50] },
    { name: 'Rock',          values: [60,55,50,45,45,50,55,60,60,55] },
    { name: 'Rap',           values: [65,60,55,50,45,45,50,55,55,50] },
    { name: 'Grunge',        values: [45,45,50,55,55,55,55,55,50,45] },
    { name: 'Metal',         values: [60,60,55,50,50,50,55,60,60,60] },
    { name: 'Dance',         values: [45,50,55,55,50,50,55,55,50,45] },
    { name: 'Techno',        values: [60,50,45,50,55,60,60,60,55,50] },
    { name: 'Country',       values: [40,45,50,55,55,60,55,55,50,45] },
    { name: 'Jazz',          values: [45,50,55,55,50,50,55,55,50,45] },
    { name: 'Acoustic',      values: [45,50,55,55,55,50,50,55,55,50] },
    { name: 'Folk',          values: [40,50,55,55,50,50,55,55,50,45] },
    { name: 'New Age',       values: [45,50,50,55,55,55,55,50,50,45] },
    { name: 'Classical',     values: [35,40,45,55,60,60,55,50,45,40] },
    { name: 'Blues',         values: [45,55,60,60,55,50,50,55,55,50] },
    { name: 'Oldies',        values: [40,45,55,60,55,50,45,45,40,35] },
    { name: 'Reggae',        values: [45,50,55,60,60,55,50,50,45,45] },
    { name: 'Opera',         values: [40,45,50,55,60,60,55,50,50,45] },
    { name: 'Swing',         values: [40,45,50,55,60,55,55,55,50,45] },
    { name: 'Spoken Word',   values: [55,55,50,45,45,45,45,50,50,55] },
    { name: 'Music 56 kB',   values: [50,50,50,50,50,50,50,50,45,40] },
    { name: 'Music 28 kB',   values: [50,50,50,50,50,50,50,45,40,35] },
];