var Stream = require('stream');
var brake = require('../');

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
        }, 5);
    }
    return s;
})();

bulk
    .pipe(brake(10))
    .pipe(process.stdout, { end : false })
;
