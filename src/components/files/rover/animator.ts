// ── ROVER ANIMATOR — sprite-sheet animation playback ────────────────────────
// Drives a stack of overlay <div>s by shifting their background-position to
// the next frame in the sprite sheet. One Animator instance owns the DOM
// element(s) and the preloaded audio for the agent's data file.

export type AnimatorState = 'waiting' | 'exited';
export type AnimatorStateCallback = (animationName: string, state: AnimatorState) => void;

export interface AnimatorBranch {
    weight: number;
    frameIndex: number;
}

export interface AnimatorFrame {
    duration: number;
    images?: ReadonlyArray<readonly [number, number]>;
    sound?: string;
    exitBranch?: number;
    branching?: { branches: AnimatorBranch[] };
}

export interface AnimatorAnimation {
    frames: AnimatorFrame[];
    useExitBranching?: boolean;
}

export interface AnimatorData {
    overlayCount: number;
    framesize: readonly number[];
    sounds: string[];
    animations: Record<string, AnimatorAnimation>;
}

class Animator {
    private readonly root: HTMLElement;
    private readonly mapUrl: string;
    private readonly data: AnimatorData;
    private readonly overlays: HTMLElement[];
    private sounds: Record<string, HTMLAudioElement> = {};

    private currentAnimation: AnimatorAnimation | undefined;
    private currentFrame: AnimatorFrame | undefined;
    private currentFrameIndex = 0;
    private started = false;
    private exiting = false;
    private endCallback: AnimatorStateCallback | undefined;
    private loopHandle: number | undefined;

    currentAnimationName: string | undefined;

    constructor(
        root: HTMLElement,
        mapUrl: string,
        data: AnimatorData,
        sounds: Record<string, string>,
    ) {
        this.root = root;
        this.mapUrl = mapUrl;
        this.data = data;
        this.overlays = [this.setupElement(root)];

        // Multi-layer animations nest extra <div>s under the root, one per overlay
        let parent: HTMLElement = this.root;
        for (let i = 1; i < data.overlayCount; i++) {
            const inner = this.setupElement(document.createElement('div'));
            parent.appendChild(inner);
            this.overlays.push(inner);
            parent = inner;
        }

        this.preloadSounds(sounds);
    }

    // ── PUBLIC API ───────────────────────────────────────────────────────────

    animations(): string[] {
        return Object.keys(this.data.animations);
    }

    hasAnimation(name: string): boolean {
        return name in this.data.animations;
    }

    showAnimation(name: string, onStateChange: AnimatorStateCallback): boolean {
        if (!this.hasAnimation(name)) return false;

        this.exiting = false;
        this.currentAnimation = this.data.animations[name];
        this.currentAnimationName = name;
        this.currentFrameIndex = 0;
        this.currentFrame = undefined;
        this.endCallback = onStateChange;

        if (!this.started) {
            this.started = true;
            this.step();
        }

        return true;
    }

    exitAnimation(): void {
        this.exiting = true;
    }

    pause(): void {
        if (this.loopHandle !== undefined) {
            window.clearTimeout(this.loopHandle);
            this.loopHandle = undefined;
        }
    }

    resume(): void {
        this.step();
    }

    dispose(): void {
        this.pause();
        this.currentAnimation = undefined;
        this.currentFrame = undefined;
        this.currentAnimationName = undefined;
        this.endCallback = undefined;
        this.started = false;
        for (const audio of Object.values(this.sounds)) {
            audio.pause();
            audio.src = '';
        }
        this.sounds = {};
    }

    // ── INTERNALS ────────────────────────────────────────────────────────────

    private setupElement(el: HTMLElement): HTMLElement {
        const [w = 0, h = 0] = this.data.framesize;
        el.style.display = 'none';
        el.style.width = `${w}px`;
        el.style.height = `${h}px`;
        el.style.background = `url('${this.mapUrl}') no-repeat`;
        return el;
    }

    private preloadSounds(sounds: Record<string, string>): void {
        for (const name of this.data.sounds) {
            const uri = sounds[name];
            if (!uri) continue;
            this.sounds[name] = new Audio(uri);
        }
    }

    private step(): void {
        const animation = this.currentAnimation;
        if (!animation) return;

        const nextIndex = Math.min(this.getNextFrameIndex(), animation.frames.length - 1);
        const frameChanged = !this.currentFrame || this.currentFrameIndex !== nextIndex;
        this.currentFrameIndex = nextIndex;

        // Hold the current frame when waiting at the last frame with exit branching
        if (!(this.atLastFrame() && animation.useExitBranching)) {
            this.currentFrame = animation.frames[this.currentFrameIndex];
        }

        this.draw();
        this.playSound();

        this.loopHandle = window.setTimeout(() => this.step(), this.currentFrame?.duration ?? 100);

        const name = this.currentAnimationName;
        if (this.endCallback && name && frameChanged && this.atLastFrame()) {
            const state: AnimatorState =
                animation.useExitBranching && !this.exiting ? 'waiting' : 'exited';
            this.endCallback(name, state);
        }
    }

    private getNextFrameIndex(): number {
        if (!this.currentAnimation || !this.currentFrame) return 0;

        // Exit branch overrides random branching when an exit was requested
        if (this.exiting && this.currentFrame.exitBranch !== undefined) {
            return this.currentFrame.exitBranch;
        }

        const branching = this.currentFrame.branching;
        if (branching) {
            let rnd = Math.random() * 100;
            for (const branch of branching.branches) {
                if (rnd <= branch.weight) return branch.frameIndex;
                rnd -= branch.weight;
            }
        }

        return this.currentFrameIndex + 1;
    }

    private draw(): void {
        const images = this.currentFrame?.images ?? [];
        for (let i = 0; i < this.overlays.length; i++) {
            const overlay = this.overlays[i];
            const xy = images[i];
            if (xy) {
                overlay.style.backgroundPosition = `${-xy[0]}px ${-xy[1]}px`;
                overlay.style.display = 'block';
            } else {
                overlay.style.display = 'none';
            }
        }
    }

    private playSound(): void {
        const name = this.currentFrame?.sound;
        if (!name) return;
        const audio = this.sounds[name];
        // Browsers can reject playback before the first user gesture; swallow it
        if (audio) void audio.play().catch(() => undefined);
    }

    private atLastFrame(): boolean {
        return (
            !!this.currentAnimation &&
            this.currentFrameIndex >= this.currentAnimation.frames.length - 1
        );
    }
}

export default Animator;
