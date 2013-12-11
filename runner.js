'use strict';

var fs = require('fs'),
    path = require('path'),
    clc = require('cli-color'),
    sh = require('exec-sync');

var good = clc.green,
    bad = clc.red,
    cyan = clc.cyan;

/** @const*/ var TMP = 'tmp-input';

runSuite();

//init watchers
var watcher = fs.watch('.');
watcher.on('change', listener.bind(null, false));
var testWatcher = fs.watch('./tests');
testWatcher.on('change', listener.bind(null, true));
console.log('Watching for changes...');

function listener(forced, e, filename) {
    if (e !== 'change' || filename == TMP) return;
    if (!forced && path.extname(filename) !== '.js') return;
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
            input: testContent[0] || '',
            output: testContent[1] || ''
        }
    });

    console.log('Tests found:' + good(tests.length));
    var fails = tests.filter(function (test) {
        return !runTest(solver, test);
    });

    console.log('Tests failed:' + bad(fails.length));
    if (!fails.length) {
        console.log(good('All tests passed'));
    } else {
        console.log(bad('Testing failed.'));
        console.log(bad('Failed tests:\n' + fails.map(function (test) { return test.name }).join('\n')));
    }
}

/** returns true if test passed */
function runTest(solver, test) {
    fs.writeFileSync('./' + TMP, test.input);
    try {
        var result = sh('node ' + solver + ' tmp-input');
        console.log('"' + result + '"');
        fs.unlinkSync('./' + TMP);

        return compareResult(test.output, result);
    } catch (e) {
        console.log(bad('Error executing solver:' + e));
    }
    return false;
}

function compareResult(expect, actual) {
    return expect.trim() == actual.trim();
}