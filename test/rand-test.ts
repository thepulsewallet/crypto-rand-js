'use strict'
import BN = require('bn.js')
import {Rand} from ".."
import * as assert from "assert";

/* Use you own random source
Rand.config(function (byteSize) {
  const crypto = require("crypto");
  return crypto.randomBytes(byteSize);
});
*/

describe('Generate random number:', function () {
  async function test (Cls, cases) {
    for (var i = 1; i <= 32; i++) {
      let r1 = await Rand.randomBytes(i)
      console.log(r1.length)
      console.log(r1)
      let r2 = await Rand.randomBN(i)
      console.log(r2.toString())
    }
  }

  it('it should support Random!', function () {
    test(null, [])
  })
})


describe('Generate random prime:', function () {
  async function test (Cls, cases) {
    for (let i = 1; i <= 32; i++) {
      let r = await Rand.randomPrime(32)
      console.log(r.toString())
    }
    for (let i = 1; i <= 32; i++) {
      let r = await Rand.randomPrime256Bit()
      console.log(r.toString())
    }
  }

  it('it should support random prime!', function () {
    test(null, [])
  })
})

describe('Generate random prime with specified byte length:', function () {
  async function test (Cls, cases) {
    for (let i = 1; i <= 32; i++) {
      let r = await Rand.randomPrimeStrict(i)
      console.log(r.toString())
    }
    for (let i = 1; i <= 32; i++) {
      let r = await Rand.randomPrimeStrict256Bit()
      console.log(r.toString())
    }
  }

  it('it should support random prime!', function () {
    test(null, [])
  })
})

describe('Generate random prime with specified bit length 1024:', function () {
  async function test (Cls, cases) {
    for (let i = 1; i <= 2; i++) {
      let r = await Rand.randomPrimeStrict(128)
      console.log(r.toString())
    }
    let r = await Rand.randomBN(256)
    console.log(r.toString())
  }

  it('it should support random prime!', function () {
    test(null, [])
  })
})


describe('Generate special random number:', function () {
  async function test (Cls, cases) {
    for (let i = 1; i <= 16; i++) {
      let max = new BN('88888888', 16)
      console.log("len:")
      console.log(max.bitLength())
      let r = await Rand.randomBNLt(max)
      console.log(r.toString())
      assert(r.lt(max), "lt")
      r = await Rand.randomBNLtGCD(max)
      console.log(r.toString())
      console.log(max.toString())
      assert(r.lt(max), "lt")
      assert(r.gcd(max).eqn(1), "gcd test failed")
    }
  }

  it('it should support special number!', function () {
    test(null, [])
  })
})
