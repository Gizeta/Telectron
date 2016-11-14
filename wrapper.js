var ffi = require('ffi');

var lib = ffi.Library(__dirname + '/pjsua-wrapper/x64/Release/pjsua-wrapper.dll', {
    'init': ['int', []],
    'destroy': ['void', []],
    'call': ['int', ['string']],
    'dtmf': ['int', ['string']]
});

module.exports = lib;
