import sys
import argparse
import json
import random
import math
import healpy


random.seed(0)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '--out', '-o', type=argparse.FileType('w'), default=sys.stdout)
    args = parser.parse_args()

    testcase = {}
    vec2pix_nest(testcase)
    vec2pix_ring(testcase)
    ang2pix_nest(testcase)
    ang2pix_ring(testcase)
    nest2ring(testcase)
    # ring2nest(testcase)
    pix2vec_nest(testcase)
    # pix2vec_ring(testcase)
    nside2pixarea(testcase)
    nside2resol(testcase)
    

    json.dump(testcase, args.out, indent=2)


def vec2pix_nest(testcase):
    cs = []
    for norder in range(16):
        nside = 1 << norder
        for i in range(1000):
            v = random_vec()
            cs.append(dict(
                args=(nside, v),
                expected=healpy.vec2pix(nside, *v, nest=True).tolist()
            ))
    testcase['vec2pix_nest'] = cs


def vec2pix_ring(testcase):
    cs = []
    for norder in range(16):
        nside = 1 << norder
        for i in range(1000):
            v = random_vec()
            cs.append(dict(
                args=(nside, v),
                expected=healpy.vec2pix(nside, *v).tolist()
            ))
    testcase['vec2pix_ring'] = cs


def ang2pix_nest(testcase):
    cs = []
    for norder in range(16):
        nside = 1 << norder
        for i in range(1000):
            theta = random.uniform(0, math.pi)
            phi = random.uniform(0, 2 * math.pi)
            args = (nside, theta, phi)
            cs.append(dict(
                args=args,
                expected=healpy.ang2pix(*args, nest=True).tolist()
            ))
    testcase['ang2pix_nest'] = cs


def ang2pix_ring(testcase):
    cs = []
    for norder in range(16):
        nside = 1 << norder
        for i in range(1000):
            theta = random.uniform(0, math.pi)
            phi = random.uniform(0, 2 * math.pi)
            args = (nside, theta, phi)
            cs.append(dict(
                args=args,
                expected=healpy.ang2pix(*args).tolist()
            ))
    testcase['ang2pix_ring'] = cs


def nest2ring(testcase):
    cs = []
    for norder in range(16):
        nside = 1 << norder
        for i in range(1000):
            ipix = random.randrange(12 * nside * nside)
            args = (nside, ipix)
            cs.append(dict(
                args=args,
                expected=healpy.nest2ring(*args).tolist()
            ))
    testcase['nest2ring'] = cs


def pix2vec_nest(testcase):
    cs = []
    for norder in range(16):
        nside = 1 << norder
        for i in range(1000):
            ipix = random.randrange(12 * nside * nside)
            args = (nside, ipix)
            cs.append(dict(
                args=args,
                expected=healpy.pix2vec(*args, nest=True)
            ))
    testcase['pix2vec_nest'] = cs


def pix2vec_ring(testcase):
    cs = []
    for norder in range(16):
        nside = 1 << norder
        for i in range(1000):
            ipix = random.randrange(12 * nside * nside)
            args = (nside, ipix)
            cs.append(dict(
                args=args,
                expected=healpy.pix2vec(*args, nest=False)
            ))
    testcase['pix2vec_ring'] = cs


# def ring2nest(testcase):
#     cs = []
#     for norder in range(16):
#         nside = 1 << norder
#         for i in range(1000):
#             ipix = random.randrange(12 * nside * nside)
#             args = (nside, ipix)
#             cs.append(dict(
#                 args=args,
#                 expected=healpy.ring2nest(*args).tolist()
#             ))
#     testcase['ring2nest'] = cs


def nside2pixarea(testcase):
    cs = []
    for norder in range(16):
        nside = 1 << norder
        args = (nside,)
        cs.append(dict(
            args=args,
            expected=healpy.nside2pixarea(*args)
        ))
    testcase['nside2pixarea'] = cs


def nside2resol(testcase):
    cs = []
    for norder in range(16):
        nside = 1 << norder
        args = (nside,)
        cs.append(dict(
            args=args,
            expected=healpy.nside2resol(*args)
        ))
    testcase['nside2resol'] = cs


def random_vec():
    return [
        random.uniform(-1, 1),
        random.uniform(-1, 1),
        random.uniform(-1, 1),
    ]


if __name__ == '__main__':
    main()
