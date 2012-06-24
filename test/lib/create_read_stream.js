var Stream = require('stream');

module.exports = function (n) {
    var s = new Stream;
    s.readable = true
    s.pause = function () {
        clearInterval(iv);
    };
    s.resume = function () {
        iv = createInterval();
    };
    s.end = function () {
        clearInterval(iv);
        s.emit('end');
    };
    
    var iv = createInterval();
    var x = 0;
    function createInterval () {
        return setInterval(function () {
            s.emit('data', String(x));
            x = x ^ 1;
        }, n);
    }
    return s;
};
