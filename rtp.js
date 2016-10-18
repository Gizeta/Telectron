import dgram from 'dgram';
import {parseRtpPacket} from 'rtp-parser';
import * as audio from './audio';

let server = dgram.createSocket('udp4');
let port = 0;

server.on("message", (msg, rinfo) => {
    audio.play(parseRtpPacket(msg).payload);
});

server.bind(() => {
    port = server.address().port;
});

export function getPort() {
    return port;
}

export function createClient() {
    throw new Error("Not implement.");
}