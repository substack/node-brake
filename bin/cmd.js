#!/usr/bin/env node
var brake = require('../');
var argv = require('optimist')
    .alias('r', 'rate')
    .alias('p', 'period')
    .alias('s', 'smooth')
    .alias('m', 'maxSize')
    .alias('maxsize', 'maxSize')
    .argv
;
if (!argv.rate) argv.rate = argv._[0];
if (!argv.rate) {
    return fs.createReadStream(__dirname + '/usage.txt')
        .pipe(process.stderr);
    ;
}

process.stdin
    .pipe(brake(argv))
    .pipe(process.stdout)
;
process.stdin.resume();
