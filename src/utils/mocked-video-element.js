export default function createdMockedVideoElement({ duration = 0, currentTime = 0, muted = false, playbackRate = 1, paused = false, volume = 1, src = '' } = {}) {
    return {
        // <video> attributes
        currentTime,
        duration,
        muted,
        playbackRate,
        paused,
        volume,
        src,
        listeners: {},
        // Spies
        playCalled: false,
        pauseCalled: false,
        addEventListener(type, fn) {
            if (!this.listeners[type]) {
                this.listeners[type] = [];
            } else if (this.listeners[type].indexOf(fn) !== -1) {
                throw new Error(
                  `Mocked video element: trying to register event '${type}' twice with the same function.`
                );
            }
            this.listeners[type].push(fn);
        },
        removeEventListener(type, fn) {
            if (!this.listeners[type]) {
                throw new Error(`Mocked video element: trying to remove a non-existing listener for event '${type}'.`);
            }
            this.listeners[type] = this.listeners[type].filter(listener => listener !== fn);
        },
        emit(type) {
            if (!this.listeners[type]) {
                return;
            }
            this.listeners[type].forEach(fn => {
                fn.call(this, { type, target: this });
            });
        },
        play() {
            this.playCalled = true;
        },
        pause() {
            this.pauseCalled = true;
        }
    };
}
