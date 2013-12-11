'use strict';

var fs = require('fs'),
    path = require('path'),
    clc = require('cli-color'),
    sh = require('exec-sync');

var good = clc.green,
    bad = clc.red,
    cyan = clc.cyan;

/** @const*/ var TMP = 'tmp-input';

var baseDir = path.normalize(process.argv[2] + '/');

runSuite();

//init watchers
var watcher = fs.watch(baseDir);
watcher.on('change', listener);
console.log('Watching for changes...');

function listener(e, filename) {
    if (e !== 'change') return;
    if (path.extname(filename) !== '.js' && path.extname(filename) !== '.test') return;
    console.log('Change detected in ' + filename, e);
    runSuite();
}

function runSuite() {
    console.log(cyan('=== Running test suite ==='));
    var solver = fs.readdirSync(baseDir).filter(function (file) { return path.extname(file) === '.js'})[0];
    console.log('Solver assumed: ' + good(solver));

    var tests = fs.readdirSync(baseDir).filter(function (file) { return path.extname(file) === '.test'}).map(function (test) {
        var testContent = fs.readFileSync(baseDir + '/' + test, {encoding: 'utf8'}).split('####\n');

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
    fs.writeFileSync(TMP, test.input);
    try {
        var result = sh('node ' + baseDir + solver + ' ' + TMP);
        fs.unlinkSync(TMP);

        return compareResult(test.output, result);
    } catch (e) {
        console.log(bad('Error executing solver:' + e));
    }
    return false;
}

function compareResult(expect, actual) {
    return expect.trim() == actual.trim();
}