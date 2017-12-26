import * as healpix from '../../../../src'
import { SimpleCanvas } from "./simple_canvas"

const PI = Math.PI
const nside = 32
const radius = 0.4


window.addEventListener('load', e => {
    const gridCanvas = new SimpleCanvas(
        setupCanvas(document.getElementById('grid') as HTMLCanvasElement),
        -PI, PI, PI, 0, 0.05,
    )

    const overlayCanvas = new SimpleCanvas(
        setupCanvas(document.getElementById('overlay') as HTMLCanvasElement),
        -PI, PI, PI, 0, 0.05,
    )

    drawGrid(gridCanvas, nside)

    overlayCanvas.onmousemove((phi, theta) => {
        phi = (phi + 2 * PI) % (2 * PI)
        overlayCanvas.clear()
        const v = healpix.ang2vec(theta, phi)
        healpix.query_disc_inclusive_nest(nside, v, radius, ipix => {
            fillPixel(overlayCanvas, nside, ipix)
        })
    })
})


function drawGrid(canvas: SimpleCanvas, nside: number) {
    const npix = healpix.nside2npix(nside)
    const ctx = canvas.ctx
    ctx.strokeStyle = 'rgba(0, 0, 127, 0.25)'
    for (let ipix = 0; ipix < npix; ++ipix) {
        ctx.beginPath()
        pixelPath(canvas, nside, ipix)
        canvas.ctx.closePath()
        ctx.stroke()
    }
}


function fillPixel(canvas: SimpleCanvas, nside: number, ipix: number) {
    const ctx = canvas.ctx
    ctx.beginPath()
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
    pixelPath(canvas, nside, ipix, 8)
    ctx.fill()
}


function pixelPath(canvas: SimpleCanvas, nside: number, ipix: number, nstep = 8) {
    const v0 = healpix.pixcoord2vec_nest(nside, ipix, 0, 0)
    const phi0 = Math.atan2(v0[1], v0[0])

    const lineTo = (x: number, y: number) => {
        const [x1, y1] = canvas.world2screen(x, y)
        canvas.ctx.lineTo(x1, y1)
    }

    function clamp(x: number, a: number, b: number) {
        return x < a ? a : (x > b ? b : x)
    }

    function safe(x: number) {
        return clamp(x, 1.e-9, 1 - 1.e-9)
    }

    for (let i = 0; i < nstep; ++i) {
        const ne = i / nstep
        const [x, y, z] = rotateZ(healpix.pixcoord2vec_nest(nside, ipix, safe(ne), safe(0)), v0)
        const phi = Math.atan2(y, x) + phi0
        lineTo(phi, Math.acos(z))
    }
    for (let i = 0; i < nstep; ++i) {
        const nw = i / nstep
        const [x, y, z] = rotateZ(healpix.pixcoord2vec_nest(nside, ipix, safe(1), safe(nw)), v0)
        const phi = Math.atan2(y, x) + phi0
        lineTo(phi, Math.acos(z))
    }
    for (let i = 0; i < nstep; ++i) {
        const ne = 1 - i / nstep
        const [x, y, z] = rotateZ(healpix.pixcoord2vec_nest(nside, ipix, safe(ne), safe(1)), v0)
        const phi = Math.atan2(y, x) + phi0
        lineTo(phi, Math.acos(z))
    }
    for (let i = 0; i < nstep; ++i) {
        const nw = 1 - i / nstep
        const [x, y, z] = rotateZ(healpix.pixcoord2vec_nest(nside, ipix, safe(0), safe(nw)), v0)
        const phi = Math.atan2(y, x) + phi0
        lineTo(phi, Math.acos(z))
    }
}


type V3 = [number, number, number]
function rotateZ([x, y, z]: V3, [x0, y0, z0]: V3): V3 {
    return [
        x * x0 + y * y0,
        y * x0 - x * y0,
        z,
    ]
}


function setupCanvas(canvas: HTMLCanvasElement) {
    const { width, height } = canvas.getBoundingClientRect()
    canvas.width = width * devicePixelRatio
    canvas.height = height * devicePixelRatio
    return canvas
}