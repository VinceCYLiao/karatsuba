// a = X1B^m + X0
// b = Y1B^m + Y0
// z2 = X1Y1
// z0 = X0Y0
// z1 = (X1X0)(Y1Y0) -z2 - z0
// a*b = z2*B^2m + z1*B^m + z0
function karatsuba(str1, str2) {
  let n1 = str1.length;
  let n2 = str2.length;

  if (n1 === 1 || n2 === 1) {
    let res = String(parseInt(str1, 10) * parseInt(str2, 10));
    return res;
  }

  let length = Math.min(n1, n2);

  str1 = leftPadZero(str1, length - n1);
  str2 = leftPadZero(str2, length - n2);

  let m = Math.floor(length / 2);

  let [high1, low1] = splitHighLow(str1, m);
  let [high2, low2] = splitHighLow(str2, m);

  let z2 = karatsuba(high1, high2);
  let z0 = karatsuba(low1, low2);
  let z1 = stringDiff(
    karatsuba(stringSum(high1, low1), stringSum(high2, low2)),
    stringSum(z2, z0)
  );

  let z2Pow = rightPadZero(z2, 2 * m);
  let z1Pow = rightPadZero(z1, m);

  let res = stringSum(z2Pow, stringSum(z1Pow, z0));

  return res;
}

// split input into high/low part based on m
function splitHighLow(str, m) {
  let index = str.length - m;
  return [str.substring(0, index), str.substring(index, str.length)];
}

//compute the sum of number in string type
function stringSum(str1, str2) {
  let n1 = str1.length;
  let n2 = str2.length;

  // make sure str2 is always the longest one.
  if (n1 > n2) {
    [str1, str2] = [str2, str1];
    [n1, n2] = [n2, n1];
  }
  [str1, str2] = [reverseString(str1), reverseString(str2)];
  // container of the result
  let sum = "";
  let carry = 0;
  for (i = 0; i < n1; i++) {
    let s = charToNum(str1[i]) + charToNum(str2[i]) + carry;
    if (s >= 10) {
      carry = Math.floor(s / 10);
      s = s % 10;
    } else {
      carry = 0;
    }
    sum = sum + numToChar(s);
  }

  for (i = n1; i < n2; i++) {
    let s = charToNum(str2[i]) + carry;
    if (s >= 10) {
      carry = Math.floor(s / 10);
      s = s % 10;
    } else {
      carry = 0;
    }
    sum = sum + numToChar(s);
  }

  if (carry) {
    sum = sum + numToChar(carry);
  }

  sum = reverseString(sum);

  return sum;
}

// compute the diff of two numbers in string type
// This function is for calculating the part of : z1 = (X1X0)(Y1Y0) -z2 - z0,
// which outcome(z1) is always positive, so no need to consider about negative case here.
function stringDiff(str1, str2) {
  let n1 = str1.length;
  let n2 = str2.length;
  if (n1 < n2) {
    [str1, str2] = [str2, str1];
    [n1, n2] = [n2, n1];
  }
  [str1, str2] = [reverseString(str1), reverseString(str2)];

  // result container
  let diff = "";
  let carry = 0;
  for (i = 0; i < n2; i++) {
    let d = charToNum(str1[i]) - charToNum(str2[i]) - carry;
    if (d < 0) {
      d = d + 10;
      carry = 1;
    } else {
      carry = 0;
    }

    diff += d;
  }

  for (i = n2; i < n1; i++) {
    let d = charToNum(str1[i]) - carry;
    if (d < 0) {
      d = d + 10;
      carry = 1;
    } else {
      carry = 0;
    }

    diff += d;
  }

  diff = reverseString(diff);

  return diff;
}

// transform string into number using ascii code
// can also just use parseInt
function charToNum(str) {
  if (str.length != 1) throw Error("not a char");

  return str.codePointAt(0) - 48;
}

// transform single digit number into string
// can just use String();
function numToChar(num) {
  if (num < 0 || num > 9) throw Error("Not valid num");

  return String.fromCodePoint(num + 48);
}

function reverseString(string) {
  return string.split("").reverse().join("");
}

function leftPadZero(str, num) {
  for (i = 0; i < num; i++) {
    str = "0" + str;
  }

  return str;
}

function rightPadZero(str, num) {
  for (i = 0; i < num; i++) {
    str = str + "0";
  }

  return str;
}

function stripLeadingZero(str) {
  return str.replace(/0*/, "");
}

function main() {
  let res = karatsuba(
    "3141592653589793238462643383279502884197169399375105820974944592",
    "2718281828459045235360287471352662497757247093699959574966967627"
  );

  console.log(stripLeadingZero(res));
}

main();
