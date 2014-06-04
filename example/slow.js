var Readable = require('readable-stream').Readable;
var brake = require('../');

var bulk = new Readable;
bulk._read = function () {};

for (var i = 0; i < 1000; i++) {
    bulk.push(String(i % 2));
}
bulk.push(null);

bulk.pipe(brake(10)).pipe(process.stdout);
