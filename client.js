import sip from 'sip';
import util from 'util';
import * as rtp from './rtp';
import * as helper from './helper';

let dialogs = {};
let lastSession;
let timestamp = 0;

sip.start({}, (rq) => {
    if (rq.headers.to.params.tag) {
        let id = [rq.headers['call-id'], rq.headers.to.params.tag, rq.headers.from.params.tag].join(':');

        if (dialogs[id]) {
            dialogs[id](rq);
        }
        else {
            sip.send(sip.makeResponse(rq, 481, "Call doesn't exists"));
        }
    }
    else {
        sip.send(sip.makeResponse(rq, 405, 'Method not allowed'));
    }
});

function invite(uri) {
    sip.send({
        method: 'INVITE',
        uri: uri,
        headers: {
            to: {uri: uri},
            from: {uri: 'sip:' + helper.getLocalIP(), params: {tag: helper.randomString()}},
            'call-id': helper.randomString(),
            cseq: {method: 'INVITE', seq: helper.randomSeq()},
            'content-type': 'application/sdp',
            contact: [{uri: 'sip:' + helper.getLocalIP()}],
            'allow': 'INVITE, ACK, BYE',
            'user-agent': 'Telectron v0.0.1'
        },
        content:
            'v=0\r\n' +
            'o=- 13374 13374 IN IP4 ' + helper.getLocalIP() + '\r\n' +
            's=-\r\n' +
            'c=IN IP4 ' + helper.getLocalIP() + '\r\n' +
            't=0 0\r\n' +
            'm=audio ' + rtp.getPort() + ' RTP/AVP 0 8 96\r\n' +
            'a=rtpmap:0 PCMU/8000\r\n' +
            'a=rtpmap:8 PCMA/8000\r\n' +
            'a=rtpmap:96 telephone-event/8000\r\n' +
            'a=fmtp:96 0-16\r\n' +
            'a=sendrecv\r\n'
    }, (rs) => {
        if (rs.status >= 300) {
            console.error('call failed with status ' + rs.status);
        }
        else if (rs.status < 200) {
            console.log('call progress status ' + rs.status);
            if (rs.status == 180) {
                window.app.changeCallState("ringing...");
            }
        }
        else {
            console.log('call answered with tag ' + rs.headers.to.params.tag);
            window.app.changeCallState("calling...");
        }

        lastSession = rs;

        sip.send({
            method: 'ACK',
            uri: rs.headers.contact[0].uri,
            headers: {
                to: rs.headers.to,
                from: rs.headers.from,
                'call-id': rs.headers['call-id'],
                cseq: {method: 'ACK', seq: rs.headers.cseq.seq},
                'user-agent': 'Telectron v0.0.1'
            }
        });

        let matches = rs.content.match(/audio (\d+) RTP/);
        if (matches) {
            rtp.setPort(+matches[1]);
        }

        let id = [rs.headers['call-id'], rs.headers.from.params.tag, rs.headers.to.params.tag].join(':');

        if (!dialogs[id]) {
            dialogs[id] = (rq) => {
                if (rq.method === 'BYE') {
                    console.log('call received bye');

                    delete dialogs[id];

                    sip.send(sip.makeResponse(rq, 200, 'Ok'));

                    window.app.changeCallState('');
                }
                else {
                    sip.send(sip.makeResponse(rq, 405, 'Method not allowed'));
                }
            }
        }
    });
}

export function connect(uri) {
    invite(uri);
    window.connect_uri = uri;
}

export function disconnect() {
    sip.send({
        method: 'BYE',
        uri: lastSession.headers.contact[0].uri,
        headers: {
            to: lastSession.headers.to,
            from: lastSession.headers.from,
            'call-id': lastSession.headers['call-id'],
            cseq: {method: 'BYE', seq: lastSession.headers.cseq.seq + 1},
            'user-agent': 'Telectron v0.0.1'
        }
    });

    let id = [lastSession.headers['call-id'], lastSession.headers.from.params.tag, lastSession.headers.to.params.tag].join(':');
    delete dialogs[id];

    window.app.changeCallState('');
}

export function sendDtmf(data) {
    for (let t = 0xa0; t <= 0x5a0; t += 0xa0) {
        rtp.sendDtmf({
            timestamp,
            marker: t == 0xa0 ? true : false,
            payload: [data, 0x0a, t >> 8, t & 0xff]
        });
    }
    for (let i = 0; i < 3; i++) {
        rtp.sendDtmf({
            timestamp,
            marker: false,
            payload: [data, 0x8a, 0x06, 0x40]
        });
    }
    timestamp += 160;
}
