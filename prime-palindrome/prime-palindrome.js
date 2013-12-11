'use strict';

var util = require('util');

function out(res) { util.print(res)}
function outLine(res) { out(res + '\n')}

var primes = genPrimes(1000);
var i = primes.length;
while (--i > 0) {

}

function genPrimes(max) {
    //the silliest sieve of Eratosthenes implementation
    var res = Array.apply(Array, new Array(max+1)).map(function (el, idx) {return idx});
    var cur = 2;
    while (cur < res.length / 2 + 1) {
        if (res[cur] !== null) {
            for (var i = cur * 2; i < res.length; i += cur) {
                console.log(i);
                res[i] = null;
            }
        }
        cur++;
    }
    res = res.filter(function (n, idx) { return n !== null && idx > 1});
    console.log(res);
    return res;
}