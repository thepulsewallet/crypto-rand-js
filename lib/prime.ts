'use strict'

import BN = require('bn.js')

export namespace Prime {
  const smallPrimes = [
    2,
    3,
    5,
    7,
    11,
    13,
    17,
    19,
    23,
    29,
    31,
    37,
    41,
    43,
    47,
    53,
    59,
    61,
    67,
    71,
    73,
    79,
    83,
    89,
    97,
    101,
    103,
    107,
    109,
    113,
    127,
    131,
    137,
    139,
    149,
    151,
    157,
    163,
    167,
    173,
    179,
    181,
    191,
    193,
    197,
    199,
    211,
    223,
    227,
    229,
    233,
    239,
    241,
    251,
    257,
    263,
    269,
    271,
    277,
    281,
    283,
    293,
    307,
    311,
    313,
    317,
    331,
    337,
    347,
    349,
    353,
    359,
    367,
    373,
    379,
    383,
    389,
    397,
    401,
    409,
    419,
    421,
    431,
    433,
    439,
    443,
    449,
    457,
    461,
    463,
    467,
    479,
    487,
    491,
    499,
    503,
    509,
    521,
    523,
    541,
    547,
    557,
    563,
    569,
    571,
    577,
    587,
    593,
    599,
    601,
    607,
    613,
    617,
    619,
    631,
    641,
    643,
    647,
    653,
    659,
    661,
    673,
    677,
    683,
    691,
    701,
    709,
    719,
    727,
    733,
    739,
    743,
    751,
    757,
    761,
    769,
    773,
    787,
    797,
    809,
    811,
    821,
    823,
    827,
    829,
    839,
    853,
    857,
    859,
    863,
    877,
    881,
    883,
    887,
    907,
    911,
    919,
    929,
    937,
    941,
    947,
    953,
    967,
    971,
    977,
    983,
    991,
    997,
    1009,
    1013,
    1019,
    1021,
    1031,
    1033,
    1039,
    1049,
    1051,
    1061,
    1063,
    1069,
    1087,
    1091,
    1093,
    1097,
    1103,
    1109,
    1117,
    1123,
    1129,
    1151,
    1153,
    1163,
    1171,
    1181,
    1187,
    1193,
    1201,
    1213,
    1217,
    1223,
    1229
  ]

  function defaultTrial(n: number): number{
    // choose a number of iterations sufficient to reduce the
    // probability of accepting a composite below 2**-80
    // (from menezes et al. table 4.4):
    let t = 40
    const nBit = Math.log2(n)
    for (let pair of [
      [100, 27],
      [150, 18],
      [200, 15],
      [250, 12],
      [300, 9],
      [350, 8],
      [400, 7],
      [450, 6],
      [550, 5],
      [650, 4],
      [850, 3],
      [1300, 2]
    ]) {
      if (nBit < pair[0]) {
        break
      }
      t = pair[1]
    }
    return t
  }


  function isPrime(n) {
    /**
     * for small prime
     */
    if(n > 0 && n < 10000) throw "Input number must be in fields [0, 10000]: " + n
    if (n === 1) {
      return false
    }
    let r = Math.floor(Math.sqrt(n))
    for (let i = 2; i <= r; i++) {
      if (n % i === 0)
        return false
    }
    return true
  }

  export function isProbablyPrime(n: BN): boolean {
    /**
     * return true if x is prime, false otherwise.
     *
     * We use the Miller–Rabin primality test, as given in: https://en.wikipedia.org/wiki/Miller%E2%80%93Rabin_primality_test.
     * This test is not exact:
     * there are composite values n for which it returns True.
     * in testing the odd numbers from 10000001 to 19999999,
     * about 66 composites got past the first test, 5 got past the second test, and none got past the third.
     * Since factors of 2, 3, 5, 7, and 11 were detected during preliminary screening,
     * the number of numbers tested by miller-rabin was (19999999 - 10000001)*(2/3)*(4/5)*(6/7) = 4.57 million.
     */
    // if n < 1000, try simple test
    if (n.ltn(10000)) {
      return isPrime(n.toNumber())
    }

    // const
    const one = new BN('1', 10)
    const two = new BN('2', 10)
    const nSub1 = n.subn(1)

    // try gcd,  and remain 1/2 * 2/3 * 4/5 * 6/7 = 0.2286
    const m = 2 * 3 * 5 * 7 * 11
    if (!n.gcd(new BN(m.toString(), 10)).eqn(1)) {
      return false
    }

    // get d, s
    let d = n.subn(1)
    let s = new BN('0', 10)
    while (d.modn(2) === 0) {
      d.idivn(2)
      s.iaddn(1)
    }

    // try Miller-Rabbin test
    const ctx = BN.red(n)

    let nNumber = Infinity
    try {
      nNumber = n.toNumber()
    }catch (err){
      // when n bits > 53, set number to Infinity
    }

    const t = defaultTrial(nNumber)
    let k = 0
    while (k < t) {
      let a = new BN(smallPrimes[k].toString(), 10)
      k = k + 1
      if (!a.gcd(n).eqn(1)) {
        return false
      }
      a = a.toRed(ctx)
      // @ts-ignore
      let x = a.redPow(d)
      if (x.eq(one) || x.eq(nSub1)) {
        continue
      }
      let r = 1
      const sInt = s.toNumber()
      for (; r < sInt; r++) {
        x = x.redPow(two)
        if (x.eq(nSub1)) {
          // continue " while(k < t) "
          break
        }
      }
      if (r >= sInt) {
        return false
      }
    }
    return true
  }
}
