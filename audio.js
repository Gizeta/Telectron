import pcm from 'pcmjs';

const BUF_SIZE = 4000;
let buf = [];
let arr = [];
let isPlaying = false;
let audio;

function onPlayEnd() {
    isPlaying = false;
    if (buf.length > 0) {
        play([]);
    }
}

export function play(data) {
    if (isPlaying) {
        for (let i = 0; i < data.length; i++) {
            buf.push(data[i]);
        }
        return;
    }
    
    if (buf.length < BUF_SIZE) {
        for (let i = 0; i < data.length; i++) {
            buf.push(data[i]);
        }
        return;
    }

    arr = buf.slice(0);
    buf = [];

    isPlaying = true;
    audio = new Audio(pcm({}).toWav(arr).encode());
    audio.onended = onPlayEnd;
    audio.play();
}
