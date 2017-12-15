// do the following command first
// $ python spec/testcase.py > spec/testcase.json


import * as _ from 'lodash'
import * as healpix_typed from '../src'
const healpix = healpix_typed as any
const testcase = require('../spec/testcase.json')


function main() {
    for (const funcname in testcase) {
        for (const { args, expected } of testcase[funcname]) {
            const result = healpix[funcname](...args)
            const pretty_args = args.map(JSON.stringify).join(', ')
            console.log(`${funcname}(${pretty_args}) => ${JSON.stringify(result)}  (expected: ${JSON.stringify(expected)})`)
            console.assert(equal(result, expected))
        }
    }
}


function equal(a: any, b: any): boolean {
    if (typeof a != typeof b)
        return false
    if (typeof a == 'number') {
        return equal_number(a, b)
    }
    if (Array.isArray(a) && Array.isArray(a)) {
        return _.zip(a, b).every(([ca, cb]) => equal(ca, cb))
    }
    throw new Error, `unknwon type: ${a} and ${b}`
}


function equal_number(a: number, b: number) {
    if (Number.isInteger(a) && Number.isInteger(b)) {
        return a == b
    }
    else {
        return Math.sign(a) == Math.sign(b) && Math.abs(a / b - 1) <= 1.e-9
    }
}


main()