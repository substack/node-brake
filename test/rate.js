var test = require('tap').test;
var brake = require('../');
var createReadStream = require('./lib/create_read_stream');
var pv = require('./lib/pv');

test('10 bytes / sec', function (t) {
    t.plan(1);
    
    var s = createReadStream(20);
    var b = brake(10);
    s.pipe(b).pipe(pv(function (err, rate) {
        if (err) t.fail(err);
        t.equal(rate, 10);
        s.end();
    }));
});
