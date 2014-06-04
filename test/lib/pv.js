var Writable = require('readable-stream').Writable;

module.exports = function (cb) {
    var s = new Writable;
    
    var bytes = 0;
    s._write = function (buf, enc, next) {
        bytes += buf.length;
        next();
    };
    
    s.once('finish', function () {
        clearTimeout(to);
        cb('stream ended');
    });
    
    var to = setTimeout(function () {
        cb(null, bytes / 3);
        cb = function () {};
    }, 3001);
    return s;
};
