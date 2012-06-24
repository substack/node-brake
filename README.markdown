brake
=====

Throttle a stream with backpressure.

example
=======

Take a bulk readable stream stream and throttle it down to 10 bytes per second:

``` js
var Stream = require('stream');
var brake = require('brake');

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
```

methods
=======

``` js
var brake = require('brake')
```

## var b = brake(rate, opts)
## var b = brake(rate, period)
## var b = brake(opts)

Return a readable/writable, pause-able/resumable stream that applies
backpressure when more data than the rate allows are written.

options:

* rate - how many bytes to emit for each interval of length `period`

* period - How often to check the output length in milliseconds.
Default value: 1000.

* smooth - If set, set the rate to 1 and divide the period by the rate.
Defaults to `true` when `opts.period` is not specified.

* maxSize - if set, throw an error if the total size of the pending writes
exceed this value

When more bytes than the rate allows are written, `.write()` returns false and
will start buffering data.

## b.pause()

Explicitly turn on buffering. Writes will return `false` until `.resume()` is
called.

## b.resume()

Un-pause a stream, triggering the interval to see if data can be emitted.

install
=======

With [npm](http://npmjs.org) do:

```
npm install brake
```

license
=======

MIT
