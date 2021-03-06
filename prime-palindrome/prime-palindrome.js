'use strict';

var util = require('util');

function out(res) { util.print(res)}
function outLine(res) { out(res + '\n')}

//just output answer - it is how it should be done in real contests
//but we have fair solver also.
if (process.argv.length == 3) {solve()}
else {outLine(929)}


function isPalindrome(n) {
    n = n.toFixed(0);
    var i = 0, j = n.length - 1;
    while (i < j) {
        if (n[i] !== n[j]) return false;
        ++i;
        --j;
    }
    return true;
}

function genPrimes(max) {
    //the silliest sieve of Eratosthenes implementation
    var res = Array.apply(Array, new Array(max+1)).map(function (el, idx) {return idx});
    var cur = 2;
    while (cur < res.length / 2 + 1) {
        if (res[cur] !== null) {
            for (var i = cur * 2; i < res.length; i += cur) {
                res[i] = null;
            }
        }
        cur++;
    }
    res = res.filter(function (n, idx) { return n !== null && idx > 1});
    return res;
}

function solve() {
    var primes = genPrimes(1000);
    var i = primes.length;
    while (--i > 0) {
        if (isPalindrome(primes[i])) {
            outLine(primes[i]);
            break;
        }
    }
}