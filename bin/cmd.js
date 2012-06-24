#!/usr/bin/env node
var brake = require('../');
var fs = require('fs');

var argv = require('optimist')
    .alias('r', 'rate')
    .alias('p', 'period')
    .alias('s', 'smooth')
    .alias('m', 'maxSize')
    .alias('maxsize', 'maxSize')
    .argv
;
if (!argv.rate) argv.rate = argv._.shift();
if (!argv.rate) {
    return fs.createReadStream(__dirname + '/usage.txt')
        .pipe(process.stderr);
    ;
}
if (!argv.period && /^\d+$/.test(argv._[0])) {
    argv.period = argv._.shift();
}

if (argv._[0]) {
    fs.createReadStream(argv._[0])
        .pipe(brake(argv))
        .pipe(process.stdout)
    ;
}
else {
    process.stdin
        .pipe(brake(argv))
        .pipe(process.stdout)
    ;
    process.stdin.resume();
}
