var test = require('tap').test;
var brake = require('../');
var createReadStream = require('./lib/create_read_stream');
var pv = require('./lib/pv');

test('max size', function (t) {
    t.plan(1);
    
    var s = createReadStream(5);
    delete s.pause;
    delete s.resume;
    s.pipe(brake(10, { maxSize : 100 }).on('error', function (err) {
        t.ok(/maximum buffer size exceeded/.test(err));
        s.end();
    }));
});
