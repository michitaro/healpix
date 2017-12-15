// js implementation of healpix
// http://iopscience.iop.org/article/10.1086/427976/pdf
//
// notations
// ---------
// theta :  colatitude (pi/2 - delta)                [0 , pi]
// phi   :  longitutde (alpha)                       [0, 2 pi)
// t     :  coord. of x-axis in sphirical projection [0, 2 pi)
// u     :  coord. of y-axis in sphirical projection [-1/2, 1/2]
// z     :  cos(theta)                               [-1, 1]
// a     :  phi                                      [0, 2 pi)
// f     :  base pixel index                         {0 .. 11}
// p     :  north-east axis in base pixel            [0, 1)
// q     :  north-west axis in base pixel            [0, 1)
// i     :  ring index                               {1 .. 4 nside - 1}
// j     :  pixel-in-ring index                      polar cap: {1 .. 4 i} ; equatorial belt: {1 .. 4 nside}


export type V3 = [number, number, number]


export function vec2pix_nest(nside: number, v: V3) {
    const { z, a } = vec2za(v[0], v[1], v[2])
    return za2pix_nest(nside, z, a)
}


export function vec2pix_ring(nside: number, v: V3) {
    const { z, a } = vec2za(v[0], v[1], v[2])
    return nest2ring(nside, za2pix_nest(nside, z, a))
}


export function ang2pix_nest(nside: number, theta: number, phi: number) {
    const z = Math.cos(theta)
    return za2pix_nest(nside, z, phi)
}


export function ang2pix_ring(nside: number, theta: number, phi: number) {
    const z = Math.cos(theta)
    return nest2ring(nside, za2pix_nest(nside, z, phi))
}


export function nest2ring(nside: number, ipix: number) {
    const { f, x, y } = nest2fxy(nside, ipix)
    return fxy2ring(nside, f, x, y)
}


// export function ring2nest(nside: number, ipix: number) {
//     throw new Error('not implemented')
// }


export function pix2vec_nest(nside: number, ipix: number) {
    const { f, x, y } = nest2fxy(nside, ipix)
    const { t, u } = fxy2tu(nside, f, x, y)
    const { z, a } = tu2za(t, u)
    return za2vec(z, a)
}


// export function pix2vec_ring(nside: number, ipix: number) {
//     return pix2vec_nest(nside, ring2nest(nside, ipix))
// }


// export function query_disc_nest(nside: number, v: V3) {
//     const { z, a } = vec2za(v[0], v[1], v[2])
// }


export function corners_nest(nside: number, ipix: number) {
    const { f, x, y } = nest2fxy(nside, ipix)
    const { t, u } = fxy2tu(nside, f, x, y)
    const d = PI_4 / nside
    const xyzs: V3[] = []
    for (const [tt, uu] of [
        [0, d],
        [-d, 0],
        [0, -d],
        [d, 0],
    ]) {
        const { z, a } = tu2za(t + tt, u + uu)
        xyzs.push(za2vec(z, a))
    }
    return xyzs
}


// export function corners_ring(nside: number, ipix: number) {
// }


// pixel area
export function nside2pixarea(nside: number) {
    return PI / (3 * nside * nside)
}


// average pixel size
export function nside2resol(nside: number) {
    return Math.sqrt(PI / 3) / nside
}


function za2pix_nest(nside: number, z: number, a: number) {
    const { t, u } = za2tu(z, a)
    const { f, p, q } = tu2fpq(t, u)
    return fpq2idx_nest(nside, f, p, q)
}


const PI2 = 2 * Math.PI
const PI = Math.PI
const PI_2 = Math.PI / 2
const PI_4 = Math.PI / 4
const PI_8 = Math.PI / 8


function sigma(z: number): number {
    if (z < 0)
        return -sigma(-z)
    else
        return 2 - Math.sqrt(3 * (1 - z))
}


// (z, phi) -> sphirical projection
function za2tu(z: number, a: number) {
    if (Math.abs(z) <= 2. / 3.) { // equatorial belt
        const t = a
        const u = 3 * PI_8 * z
        return { t, u }
    }
    else { // polar caps
        const p_t = a % (PI_2)
        const sigma_z = sigma(z)
        const t = a - (Math.abs(sigma_z) - 1) * (p_t - PI_4)
        const u = PI_4 * sigma_z
        return { t, u }
    }
}


// sphirical projection -> (z, phi)
function tu2za(t: number, u: number) {
    const abs_u = Math.abs(u)
    if (abs_u >= PI_2) { // error
        return { z: sign(u), a: 0 }
    }
    if (abs_u <= Math.PI / 4) { // equatorial belt
        const z = 8 / (3 * PI) * u
        const a = t
        return { z, a }
    }
    else { // polar caps
        const t_t = t % (Math.PI / 2)
        const a = t - (abs_u - PI_4) / (abs_u - PI_2) * (t_t - PI_4)
        const z = sign(u) * (1 - 1 / 3 * square(2 - 4 * abs_u / PI))
        return { z, a }
    }
}


// (x, y, z) -> (z = cos(theta), phi)
function vec2za(x: number, y: number, z: number) {
    const r2 = x * x + y * y
    if (r2 == 0)
        return { z: z < 0 ? -1 : 1, a: 0 }
    else {
        const a = (Math.atan2(y, x) + PI2) % PI2
        z /= Math.sqrt(z * z + r2)
        return { z, a }
    }
}


// (z = cos(theta), phi) -> (x, y, z)
function za2vec(z: number, a: number): V3 {
    const sin_theta = Math.sqrt(1 - z * z)
    const x = sin_theta * Math.cos(a)
    const y = sin_theta * Math.sin(a)
    return [x, y, z]
}


// sphirical projection -> f, p, q
// f: base pixel index
// p: coord in north east axis of base pixel
// q: coord in north west axis of base pixel
function tu2fpq(t: number, u: number) {
    t /= PI_4
    u /= PI_4
    t += -4
    u += 5
    const pp = (u + t) / 2
    const qq = (u - t) / 2
    const PP = Math.floor(pp)
    const QQ = Math.floor(qq)
    const V = 5 - (PP + QQ)
    const H = PP - QQ + 4
    const f = 4 * V + (H >> 1) % 4
    const p = pp % 1
    const q = qq % 1
    return { f, p, q }
}


// f, p, q -> nest index
function fpq2idx_nest(nside: number, f: number, p: number, q: number) {
    const x = Math.floor(nside * p) // north east
    const y = Math.floor(nside * q) // north west
    return f * nside * nside + bit_combine(x, y)
}

// x = (...x2 x1 x0)_2 <- in binary
// y = (...y2 y1 y0)_2
// p = (...y2 x2 y1 x1 y0 x0)_2
// returns p
export function bit_combine(x: number, y: number) {
    assert(x < (1 << 16))
    assert(y < (1 << 15))
    return (
        // (python)
        // n = 14
        // ' | '.join(['x & 1'] + [f'(x & 0x{2 ** (i+1):x} | y & 0x{2 ** i:x}) << {i + 1}' for i in range(n)] + [f'y & 0x{2**n:x} << {n+1}'])
        x & 1 | (x & 0x2 | y & 0x1) << 1 | (x & 0x4 | y & 0x2) << 2 |
        (x & 0x8 | y & 0x4) << 3 | (x & 0x10 | y & 0x8) << 4 | (x & 0x20 | y & 0x10) << 5 |
        (x & 0x40 | y & 0x20) << 6 | (x & 0x80 | y & 0x40) << 7 | (x & 0x100 | y & 0x80) << 8 |
        (x & 0x200 | y & 0x100) << 9 | (x & 0x400 | y & 0x200) << 10 | (x & 0x800 | y & 0x400) << 11 |
        (x & 0x1000 | y & 0x800) << 12 | (x & 0x2000 | y & 0x1000) << 13 | (x & 0x4000 | y & 0x2000) << 14 |
        (x & 0x8000 | y & 0x4000) << 15 | y & 0x8000 << 16
    )
}


// x = (...x2 x1 x0)_2 <- in binary
// y = (...y2 y1 y0)_2
// p = (...y2 x2 y1 x1 y0 x0)_2
// returns x, y
export function bit_decombine(p: number) {
    assert(p <= 0x7fffffff)
    // (python)
    // ' | '.join(f'(p & 0x{2**(2*i):x}) >> {i}' for i in range(16))
    const x = (p & 0x1) >> 0 | (p & 0x4) >> 1 | (p & 0x10) >> 2 |
        (p & 0x40) >> 3 | (p & 0x100) >> 4 | (p & 0x400) >> 5 |
        (p & 0x1000) >> 6 | (p & 0x4000) >> 7 | (p & 0x10000) >> 8 |
        (p & 0x40000) >> 9 | (p & 0x100000) >> 10 | (p & 0x400000) >> 11 |
        (p & 0x1000000) >> 12 | (p & 0x4000000) >> 13 | (p & 0x10000000) >> 14 | (p & 0x40000000) >> 15
    // (python)
    // ' | '.join(f'(p & 0x{2**(2*i + 1):x}) >> {i+1}' for i in range(15))
    const y = (p & 0x2) >> 1 | (p & 0x8) >> 2 | (p & 0x20) >> 3 |
        (p & 0x80) >> 4 | (p & 0x200) >> 5 | (p & 0x800) >> 6 |
        (p & 0x2000) >> 7 | (p & 0x8000) >> 8 | (p & 0x20000) >> 9 |
        (p & 0x80000) >> 10 | (p & 0x200000) >> 11 | (p & 0x800000) >> 12 |
        (p & 0x2000000) >> 13 | (p & 0x8000000) >> 14 | (p & 0x20000000) >> 15
    return { x, y }
}


// f: base pixel index
// x: north east index in base pixel
// y: north west index in base pixel
function nest2fxy(nside: number, ipix: number) {
    const nside2 = nside * nside
    const f = Math.floor(ipix / nside2) // base pixel index
    const k = ipix % nside2             // nested pixel index in base pixel
    const { x, y } = bit_decombine(k)
    return { f, x, y }
}


// function fxy2ij(nside: number, f: number, x: number, y: number) {
//     const f_row = Math.floor(f / 4) // {0 .. 2}
//     const f1 = f_row + 2            // {2 .. 4}
//     const v = x + y
//     const i = f1 * nside - v - 1
//     if (i < nside) { // north polar cap
//         const f_col = f % 4
//         const j = (i * f_col) + nside - y
//         return { i, j }
//     }
//     if (i < 3 * nside) { // equatorial belt
//         const h = x - y
//         const f2 = 2 * (f % 4) - (f_row % 2) + 1  // {0 .. 7}
//         const k = (f2 * nside + h + (8 * nside)) % (8 * nside)
//         const j = (k >> 1) + 1
//         return { i, j }
//     }
//     else { // south polar cap
//         const i_i = 4 * nside - i
//         const i_f_col = 3 - (f % 4)
//         const j = 4 * i_i - (i_i * i_f_col) - y
//         return { i, j }
//     }
// }


function fxy2ring(nside: number, f: number, x: number, y: number) {
    const f_row = Math.floor(f / 4) // {0 .. 2}
    const f1 = f_row + 2            // {2 .. 4}
    const v = x + y
    const i = f1 * nside - v - 1

    if (i < nside) { // north polar cap
        const f_col = f % 4
        const ipix = 2 * i * (i - 1) + (i * f_col) + nside - y - 1
        return ipix
    }
    if (i < 3 * nside) { // equatorial belt
        const h = x - y
        const f2 = 2 * (f % 4) - (f_row % 2) + 1  // {0 .. 7}
        const k = (f2 * nside + h + (8 * nside)) % (8 * nside)
        const offset = 2 * nside * (nside - 1)
        const ipix = offset + (i - nside) * 4 * nside + (k >> 1)
        return ipix
    }
    else { // south polar cap
        const i_i = 4 * nside - i
        const i_f_col = 3 - (f % 4)
        const j = 4 * i_i - (i_i * i_f_col) - y
        const i_j = 4 * i_i - j + 1
        const ipix = 12 * nside * nside - 2 * i_i * (i_i - 1) - i_j
        return ipix
    }
}


// f, x, y -> sphirical projection
function fxy2tu(nside: number, f: number, x: number, y: number) {
    const f_row = Math.floor(f / 4)
    const f1 = f_row + 2
    const f2 = 2 * (f % 4) - (f_row % 2) + 1
    const v = x + y
    const h = x - y
    const i = f1 * nside - v - 1
    const k = (f2 * nside + h + (8 * nside))
    const t = k / nside * PI_4
    const u = PI_2 - i / nside * PI_4
    return { t, u }
}


const sign: (x: number) => number = (<any>Math).sign || function (x: number) {
    return x > 0 ? 1 : (x < 0 ? -1 : 0)
}


function square(x: number) {
    return x * x
}


function assert(condition: boolean) {
    console.assert(condition)
    if (!condition) {
        throw new Error('assertion error')
    }
}