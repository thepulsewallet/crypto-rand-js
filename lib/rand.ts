'use strict'

import BN = require('bn.js')

export namespace Rand {
  // Custom random bytes generator.
  let randomBytesImp = null;
  let randomPrimeImp = null;
  let randomSafePrimeImp = null;

  /**
   * Set your randomBytes generator.
   * @param _randomBytesImp
   */
  export function config_randomBytesImp(_randomBytesImp){
    randomBytesImp = _randomBytesImp
  }

  export function config_randomPrimeImp(_randomPrimeImp) {
    randomPrimeImp = _randomPrimeImp
  }

  export function config_randomSafePrimeImp(_randomSafePrimeImp) {
    randomSafePrimeImp = _randomSafePrimeImp
  }

  export async function randomBytes(byteSize: number): Promise<Buffer>{
    return randomBytesImp(byteSize)
  }

  export async function randomBN(byteSize: number): Promise<BN> {
    const buf = await randomBytes(byteSize)
    return new BN(buf.toString('hex'), 16)
  }

  export async function randomBNStrict(byteSize: number): Promise<BN> {
    while (true) {
      let buf = await randomBytes(byteSize)
      let hByte = buf.readUInt8(0)
      if (hByte >= 127) {
        return new BN(buf.toString('hex'), 16)
      }
    }
  }

  export async function randomPrime(byteSize: number): Promise<BN> {
    return await randomPrimeImp(byteSize)
  }

  export async function randomPrimeStrict(byteSize: number): Promise<BN> {
    while (true) {
      let r = await Rand.randomPrime(byteSize)
      if(r.bitLength() === (byteSize * 8)){
        return r
      }
    }
  }

  export async function randomSafePrime(byteSize: number): Promise<BN> {
    return await randomSafePrimeImp(byteSize)
  }

  export async function randomSafePrimeStrict(byteSize: number): Promise<BN> {
    while (true) {
      let r = await Rand.randomSafePrime(byteSize)
      if(r.bitLength() === (byteSize * 8)){
        return r
      }
    }
  }

  export async function randomPrime256Bit(): Promise<BN> {
    return await randomPrime(32)
  }


  export async function randomPrimeStrict256Bit(): Promise<BN> {
    return await randomPrimeStrict(32)
  }


  export async function randomBNLt(max: BN): Promise<BN> {
    let byteLen = 1
    if (max.bitLength() % 8 === 0) {
      byteLen = max.bitLength() / 8
    } else {
      byteLen = Math.floor(max.bitLength() / 8) + 1
    }
    let r = await randomBN(byteLen)
    r = r.mod(max)
    // to fix the bug in lib "bn.js" while byteLen === 1
    // @ts-ignore
    if (r.red) {
      // @ts-ignore
      return r.fromRed()
    } else {
      return r
    }
  }

  // for pailliar cryptosystem
  // Deprecated
  export async function randomBNLtGCD(max: BN): Promise<BN> {
    while (true) {
      let r = await randomBNLt(max)
      if (r.gcd(max).eqn(1)) {
        return r
      }
    }
  }
  export async function randomBNLtCoPrime(max: BN): Promise<BN> {
    while (true) {
      let r = await randomBNLt(max)
      if (r.gcd(max).eqn(1)) {
        return r
      }
    }
  }

}
