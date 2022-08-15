'use strict'

import {Rand} from './lib/rand'
import {Prime} from './lib/prime'
import * as BN from 'bn.js'

Rand.config_randomBytesImp(
    function (byteSize) {
        const crypto = require("crypto")
        return crypto.randomBytes(byteSize);
    }
);

Rand.config_randomPrimeImp(
    async function (byteSize: number): Promise<BN> {
        while (true) {
            let r = await Rand.randomBN(byteSize)
            if (Prime.isProbablyPrime(r)) {
                return r
            }
        }
    },
);

Rand.config_randomSafePrimeImp(
    async function (byteSize: number): Promise<BN> {
        throw "no implementation for randomSafePrime"
    },
);

export {Rand, Prime}
