var Stream = require('stream');

module.exports = function (cb) {
    var s = new Stream;
    s.writable = true;
    
    var bytes = 0;
    s.write = function (buf) {
        bytes += buf.length;
    };
    s.end = function () {
        clearTimeout(to);
        cb('stream ended');
    };
    
    var to = setTimeout(function () {
        cb(null, bytes / 3);
        cb = function () {};
    }, 3000);
    return s;
};
