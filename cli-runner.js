'use strict';

var fs = require('fs'),
    path = require('path'),
    clc = require('cli-color');

var good = clc.green,
    bad = clc.red,
    cyan = clc.cyan;

runSuite();

//init watchers
var watcher = fs.watch('.');
watcher.on('change', listener);
var testWatcher = fs.watch('./tests');
testWatcher.on('change', listener);
console.log('Watching for changes...');

function listener(e, filename) {
    if (e !== 'change') return;
    console.log('Change detected in ' + filename, e);
    runSuite();
}

function runSuite() {
    console.log(cyan('=== Running test suite ==='));
    var solver = fs.readdirSync('.').filter(function (file) { return path.extname(file) === '.js'})[0];
    console.log('Solver assumed: ' + good(solver));

    var tests = fs.readdirSync('tests').map(function (test) {
        var testContent = fs.readFileSync('tests/' + test, {encoding: 'utf8'}).split('####\n');

        return {
            name: test,
            input: testContent[0],
            output: testContent[1]
        }
    });

    console.log('Tests found:' + good(tests.length));
    var fails = [];

    console.log('Tests failed:' + bad(fails.length));
    if (!fails.length) {
        console.log(good('All tests passed'));
    } else {
        console.log(bad('Testing failed.'));
        console.log(bad('Failed tests: '+ fails.join(', ')));
    }
}
