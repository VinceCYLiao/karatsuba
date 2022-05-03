const { performance } = require("perf_hooks");
// a = X1B^m + X0
// b = Y1B^m + Y0
// z2 = X1Y1
// z0 = X0Y0
// z1 = (X1X0)(Y1Y0) -z2 - z0
// a*b = z2*B^2m + z1*B^m + z0
function splitHighLow(num, m) {
    let baseM = Math.pow(10, m);
    return [Math.floor(num / baseM), num % baseM];
}

function karatsuba(num1, num2) {
    if (num1 < 10 || num2 < 10) {
        return num1 * num2;
    }

    let length = Math.min(String(num1).length, String(num2).length);
    let m = Math.ceil(length / 2);

    let [high1, low1] = splitHighLow(num1, m);
    let [high2, low2] = splitHighLow(num2, m);
    console.log(high2, low2);
    // let z2 = high1 * high2;
    // let z1 = (high1 + low1) * (high2 + low2);
    // let z0 = low1 * low2;
    let z2 = karatsuba(high1, high2);
    let z1 = karatsuba((high1 + low1), (high2 + low2));
    let z0 = karatsuba(low1, low2);

    let res = z2 * Math.pow(10, 2 * m) + (z1 - z2 - z0) * Math.pow(10, m) + z0;
    console.log(res);
    return res;
}
let [, , num1, num2] = process.argv;
let start = performance.now();
karatsuba(Number(num1), Number(num2));
let end = performance.now();
console.log(start - end);