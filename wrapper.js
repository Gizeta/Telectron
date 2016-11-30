import ffi from'ffi';

let lib = ffi.Library(__dirname + '/wrapper', {
    'init': ['int', []],
    'destroy': ['void', []],
    'call': ['int', ['string']],
    'dtmf': ['int', ['string']],
    'setStateChangedCallback': ['void', ['pointer']]
});

let stateCallback = ffi.Callback('void', ['int'], (statusCode) => {
    switch (statusCode) {
        case 0:
        case 6:
            window.app.changeCallState("");
            break;
        case 1:
        case 2:
            window.app.changeCallState("calling");
            break;
        case 3:
            window.app.changeCallState("ringing");
            break;
        case 4:
        case 5:
            window.app.changeCallState("connected");
            break;
    }
});
lib.setStateChangedCallback(stateCallback);

// avoid GC
window.stateCallback = stateCallback;

module.exports = lib;
