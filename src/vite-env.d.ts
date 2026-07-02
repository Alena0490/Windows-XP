/// <reference types="vite/client" />

declare module '*.wav' {
    const src: string;
    export default src;
}

declare module '*.mp3' {
    const src: string;
    export default src;
}

declare module '*.md?raw' {
    const content: string;
    export default content;
}

declare module '*.md' {
    const content: string;
    export default content;
}
