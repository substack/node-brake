var test = require('tap').test;
var brake = require('../');
var createReadStream = require('./lib/create_read_stream');
var pv = require('./lib/pv');

test('3 bytes / 20 ms', function (t) {
    t.plan(1);
    
    var s = createReadStream(150);
    s.pipe(brake(3, 20)).pipe(pv(function (err, rate) {
        if (err) t.fail(err);
        t.ok(rate > 130 && rate < 160, rate + ' ~~ 150'); // 150 = 3 * 1000 / 20
        s.end();
    }));
});
