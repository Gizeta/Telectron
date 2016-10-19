import os from 'os';

export function randomString() {
    return Math.floor(Math.random() * 1e6).toString();
}

export function randomSeq() {
    return Math.floor(Math.random() * 1e5);
}

export function randomSsrc() {
    return Math.floor(Math.random() * (1 << 30));
}

export function getLocalIP() {
    let interfaces = os.networkInterfaces();
    for (let k in interfaces) {
        for (let k2 in interfaces[k]) {
            let address = interfaces[k][k2];
            if (address.family === 'IPv4' && !address.internal) {
                return address.address;
            }
        }
    }
}