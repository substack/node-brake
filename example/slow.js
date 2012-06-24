var Stream = require('stream');
var throttle = require('../');

var bulk = (function () {
    var s = new Stream;
    s.readable = true
    s.pause = function () {
        clearInterval(iv);
    };
    s.resume = function () {
        iv = createInterval();
    };
    
    var iv = createInterval();
    var x = 0;
    function createInterval () {
        return setInterval(function () {
            s.emit('data', String(x));
            x = x ^ 1;
        }, 10);
    }
    return s;
})();

bulk
    .pipe(throttle(0.5))
    .pipe(process.stdout, { end : false })
;
