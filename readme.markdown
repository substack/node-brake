# brake

throttle a stream with backpressure

[![build status](https://secure.travis-ci.org/substack/node-brake.png)](http://travis-ci.org/substack/node-brake)

# example

Take a bulk readable stream stream and throttle it down to 10 bytes per second:

``` js
var Readable = require('readable-stream').Readable;
var brake = require('brake');

var bulk = new Readable;
bulk._read = function () {};

bulk.push(Array(1001).join('A'));
bulk.push(null);

bulk.pipe(brake(10)).pipe(process.stdout);
```

There's also a `brake` command as part of this package:

```
$ brake 30 readme.markdown | pv > /dev/null
1.53kB 0:00:51 [30.3B/s] [                                       <=>   ]
```

# methods

``` js
var brake = require('brake')
```

## var b = brake(rate, opts)

Return a transform stream `b` that applies
backpressure when more data than the rate allows is written.

* `opts.rate` - how many bytes to emit for each interval of length `period`

* `opts.period` - How often to check the output length in milliseconds.
Default value: 1000.

If `opts` is a number, its value will be used for the `opts.period`.

# usage

```
usage:
    
    brake OPTIONS [rate] {file | -}
    brake OPTIONS [rate] [period] {file | -}
    brake OPTIONS {file | -}

OPTIONS:

  -r, --rate     How many bytes to emit for each interval of length `period`
  
  -p, --period   How often to check the output length in milliseconds.
                 default value: 1000

```

# install

To get the library, with [npm](http://npmjs.org) do:

```
npm install brake
```

To get the command, with [npm](http://npmjs.org) do:

```
npm install -g brake
```

# license

MIT
