export const applyGain = (buffer: AudioBuffer, factor: number): AudioBuffer => {
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        const data = buffer.getChannelData(channel);
        for (let i = 0; i < data.length; i++) {
            data[i] = Math.max(-1, Math.min(1, data[i] * factor));
        }
    }
    return buffer;
};

export const reverseBuffer = (buffer: AudioBuffer): AudioBuffer => {
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        const data = buffer.getChannelData(channel);
        data.reverse();
    }
    return buffer;
};

export const echoBuffer = (
    audioContext: AudioContext,
    buffer: AudioBuffer,
    delaySeconds: number,
    decay: number
): AudioBuffer => {
    const delaySamples = Math.floor(delaySeconds * buffer.sampleRate);
    const newLength = buffer.length + delaySamples;

    const newBuffer = audioContext.createBuffer(
        buffer.numberOfChannels,
        newLength,
        buffer.sampleRate
    );

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        const oldData = buffer.getChannelData(channel);
        const newData = newBuffer.getChannelData(channel);

        for (let i = 0; i < oldData.length; i++) {
            newData[i] += oldData[i];
        }

        for (let i = 0; i < oldData.length; i++) {
            const echoIndex = i + delaySamples;
            newData[echoIndex] += oldData[i] * decay;
        }

        for (let i = 0; i < newLength; i++) {
            newData[i] = Math.max(-1, Math.min(1, newData[i]));
        }
    }

    return newBuffer;
};

export const resampleBuffer = (
    audioContext: AudioContext,
    buffer: AudioBuffer,
    speedFactor: number
): AudioBuffer => {
    const newLength = Math.floor(buffer.length / speedFactor);
    const newBuffer = audioContext.createBuffer(
        buffer.numberOfChannels,
        newLength,
        buffer.sampleRate
    );

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        const oldData = buffer.getChannelData(channel);
        const newData = newBuffer.getChannelData(channel);
        for (let i = 0; i < newLength; i++) {
            const oldIndex = i * speedFactor;
            const index0 = Math.floor(oldIndex);
            const index1 = Math.min(index0 + 1, oldData.length - 1);
            const frac = oldIndex - index0;
            newData[i] = oldData[index0] * (1 - frac) + oldData[index1] * frac;
        }
    }

    return newBuffer;
};

export const bufferToWavBlob = (buffer: AudioBuffer): Blob => {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const numSamples = buffer.length;
    const bytesPerSample = 2;
    const blockAlign = numChannels * bytesPerSample;
    const dataSize = numSamples * blockAlign;

    const arrayBuffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(arrayBuffer);

    const writeString = (offset: number, str: string) => {
        for (let i = 0; i < str.length; i++) {
            view.setUint8(offset + i, str.charCodeAt(i));
        }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, dataSize, true);

    let offset = 44;
    for (let i = 0; i < numSamples; i++) {
        for (let channel = 0; channel < numChannels; channel++) {
            const sample = buffer.getChannelData(channel)[i];
            const clamped = Math.max(-1, Math.min(1, sample));
            view.setInt16(offset, clamped * 0x7fff, true);
            offset += 2;
        }
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
};