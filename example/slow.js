var Stream = require('stream');
var throttle = require('../');

var important = (function () {
    var s = new Stream;
    s.readable = true;
    s.pause = function () {
        console.log('0 PAUSE');
    };
    s.resume = function () {
        console.log('0 RESUME');
    };
     
    setInterval(function () {
        s.emit('data', '1');
    }, 100);
    return s;
})();

var bulk = (function () {
    var s = new Stream;
    s.readable = true
    s.pause = function () {
        console.log('1 PAUSE');
    };
    s.resume = function () {
        console.log('1 RESUME');
    };
    
    setInterval(function () {
        s.emit('data', '0');
    }, 10);
    return s;
})();

var MD = require('mux-demux');
var md = new MD;
console.dir(md);

important.pipe(md.createWriteStream('important'));
bulk.pipe(md.createWriteStream('bulk'));

md.getMuxDemuxStream()
    .pipe(throttle(3, { period : 100, maxSize : 1000 }))
    .pipe(process.stdout, { end : false })
;
