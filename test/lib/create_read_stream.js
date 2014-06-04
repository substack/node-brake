var Readable = require('readable-stream').Readable;

module.exports = function (n) {
    var s = new Readable;
    s._read = function () {};
    
    s.end = function () {
        clearInterval(iv);
        s.push(null);
    };
    
    var x = 0;
    var iv = setInterval(function () {
        s.push(String(x));
        x = x ^ 1;
    }, 1000/n);
    return s;
};
