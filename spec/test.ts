// do the following command first
// $ python spec/generate-testcase.py > spec/testcase.json


import * as _ from 'lodash'
import * as healpix_typed from '../src'
const healpix = healpix_typed as any
const testcase = require('../spec/testcase.json')


function main() {
    for (const funcname in testcase) {
        for (const { args, expected } of testcase[funcname]) {
            const pretty_args = args.map(JSON.stringify).join(', ')
            console.log(`testing: ${funcname}(${pretty_args})...`)
            const result = healpix[funcname](...args)
            const ok = equal(result, expected)
            if (!ok) {
                console.log(`${funcname}(${pretty_args}) => ${JSON.stringify(result, undefined, 2)}`)
                console.log(`expected: ${JSON.stringify(expected, undefined, 2)}`)
                throw new Error('test failed')
            }
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
    if (typeof (a) == 'object' && typeof (b) == 'object') {
        const a_keys = Object.keys(a)
        return a_keys.length == Object.keys(b).length && a_keys.every(k => equal(a[k], b[k]))
    }
    throw new Error, `unknwon type: ${a} and ${b}`
}


function equal_number(a: number, b: number) {
    if (Number.isInteger(a) && Number.isInteger(b)) {
        return a == b
    }
    else {
        return Math.abs((a - 1) / (b - 1) - 1) <= 1.e-9 || Math.abs((a + 1) / (b + 1) - 1) <= 1.e-9
    }
}


main()