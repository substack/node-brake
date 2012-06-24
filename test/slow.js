var test = require('tap').test;
var brake = require('../');
var Stream = require('stream');

function createReadStream (n) {
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
}

function pv (cb) {
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
    }, 3000);
    return s;
}

test('10 bytes / sec', function (t) {
    t.plan(1);
    
    var s = createReadStream(5);
    s.pipe(brake(10)).pipe(pv(function (err, rate) {
        if (err) t.fail(err);
        t.equal(rate, 10);
        s.end();
    }));
});
