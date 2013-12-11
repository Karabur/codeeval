'use strict';

var util = require('util'),
    fs = require('fs');

var input = (function () {
    var inFile = process.argv[2];
    return fs.readFileSync(inFile, 'utf8');
})();

function out(res) { util.print(res)}

out('1 2 3');