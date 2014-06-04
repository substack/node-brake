var Readable = require('readable-stream').Readable;
var brake = require('../');

var bulk = new Readable;
bulk._read = function () {};

bulk.push(Array(1001).join('A'));
bulk.push(null);

bulk.pipe(brake(3, 20)).pipe(process.stdout);
