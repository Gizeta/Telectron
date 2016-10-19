import dgram from 'dgram';
import {parseRtpPacket} from 'rtp-parser';
import * as audio from './audio';
import * as helper from './helper';

let client = dgram.createSocket('udp4');
let clientPort = 0;
let serverPort = 0;

let seq = 1;
let ssrc = helper.randomSsrc();

client.on("message", (msg, rinfo) => {
    audio.play(parseRtpPacket(msg).payload);
});

client.bind(() => {
    clientPort = client.address().port;
});

export function getPort() {
    return clientPort;
}

export function setPort(port) {
    serverPort = port;
}

export function sendDtmf(data) {
    client.send(packDtmfRtp(data), serverPort, window.connect_uri.substring(window.connect_uri.indexOf('@') + 1));
    seq = (seq + 1) % 65536;
}

function packDtmfRtp(data) {
    var buf = [
        0x80,
        data.marker ? 0xe0 : 0x60,
        seq >> 8,
        seq & 0xff,
        data.timestamp >> 24,
        (data.timestamp >> 16) & 0xff,
        (data.timestamp >> 8) & 0xff,
        data.timestamp & 0xff,
        ssrc >> 24,
        (ssrc >> 16) & 0xff,
        (ssrc >> 8) & 0xff,
        ssrc & 0xff
    ];
    for (let v of data.payload) {
        buf.push(v);
    }
    return Buffer.from(buf);
}
