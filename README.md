# HEALPix

## Introduction
* This module is an implementation of [HEALPix](http://healpix.sourceforge.net) in JavaScript / TypeScript.
* Most API interfaces are ported from wonderful [healpy](https://healpy.readthedocs.io/en/latest/)
* [Working demo](http://michitaro.github.io/healpix/)

## Example (code of [the working demo (pixcoord2vec)](http://michitaro.github.io/healpix/pixcoord2vec))
```typescript
import * as healpix from '@hscmap/healpix'
import { PerspectiveCanvas } from "./perspective_canvas"


function draw(canvas: PerspectiveCanvas, theta: number, phi: number) {
    const nstep = 8
    const nside = 4
    const npix = 12 * nside * nside

    canvas.phi = phi
    canvas.theta = theta
    canvas.clear()

    for (let ipix = 0; ipix < npix; ++ipix) {
        canvas.path(lineTo => {
            for (let i = 0; i < nstep; ++i) {
                const ne = i / nstep
                const v = healpix.pixcoord2vec_nest(nside, ipix, ne, 0)
                lineTo(v)
            }
            for (let i = 0; i <= nstep; ++i) {
                const nw = i / nstep
                const v = healpix.pixcoord2vec_nest(nside, ipix, 1, nw)
                lineTo(v)
            }
        })
    }
}


window.addEventListener('load', e => {
    const canvas = new PerspectiveCanvas(document.getElementById('main') as HTMLCanvasElement)
    draw(canvas, 0, 0)
    window.addEventListener('mousemove', e => {
        const theta = Math.PI * e.clientY / window.innerHeight
        const phi = Math.PI * e.clientX / window.innerHeight
        draw(canvas, theta, phi)
    })
})
```

## Install
```sh
npm install @hscmap/healpix
```

## Progress
|API                |status|
|-------------------|:------------------------------------:|
|nest2ring          |😀|
|ring2nest          |😀|
|vec2pix_nest       |😀|
|vec2pix_ring       |😀|
|ang2pix_nest       |😀|
|ang2pix_ring       |😀|
|pix2vec_nest       |😀|
|pix2vec_ring       |😀|
|query_disc_nest    |😓|
|query_disc_ring    ||
|corners_nest       |😀|
|corners_ring       |😀|
|nside2resol        |😀|
|nside2pixarea      |😀|

## See Also
* http://healpix.sourceforge.net
* https://healpy.readthedocs.io