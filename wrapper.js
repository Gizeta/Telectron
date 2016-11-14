var ffi = require('ffi');

var lib = ffi.Library(__dirname + '/wrapper', {
    'init': ['int', []],
    'destroy': ['void', []],
    'call': ['int', ['string']],
    'dtmf': ['int', ['string']]
});

module.exports = lib;
