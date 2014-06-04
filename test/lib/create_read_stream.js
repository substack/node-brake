var Readable = require('readable-stream').Readable;

module.exports = function (n) {
    var s = new Readable;
    s._read = function () {};
    
    s.end = function () {
        clearInterval(iv);
        s.push(null);
    };
    
    var iv = createInterval();
    var x = 0;
    function createInterval () {
        return setInterval(function () {
            s.push(String(x));
            x = x ^ 1;
        }, n);
    }
    return s;
};
