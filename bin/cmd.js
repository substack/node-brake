#!/usr/bin/env node
var brake = require('../');
var fs = require('fs');

var minimist = require('minimist')
var argv = minimist(process.argv.slice(2), {
    alias: { r: 'rate', p: 'period' }
});

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
}
