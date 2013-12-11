'use strict';

var util = require('util'),
    fs = require('fs');

var input = (function () {
    var inFile = process.argv[2];
    return fs.readFileSync(inFile, 'utf8');
})();

function out(res) { util.print(res)}
function outLine(res) { out(res + '\n')}

input.split('\n').forEach(solve);

function solve(line) {
    line = line.split(' ');
    var a = line[0], b = line[1], n = line[2];
    var res = [];
    for (var i = 1; i <= n; i++) {
        var el = '';
        if (i % a === 0) el = 'F';
        if (i % b === 0) el += 'B';
        res.push(el || i)
    }
    outLine(res.join(' '));
}