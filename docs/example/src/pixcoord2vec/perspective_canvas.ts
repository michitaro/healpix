import { mat4, vec4 } from 'gl-matrix'

type V3 = [number, number, number]
type LineTo = (v: V3) => void


export class PerspectiveCanvas {
    private ctx: CanvasRenderingContext2D
    // @ts-ignore
    private pvm: mat4

    phi = 0
    theta = 0

    constructor(readonly el: HTMLCanvasElement) {
        this.ctx = el.getContext('2d')!
    }

    clear() {
        this.ctx.clearRect(0, 0, this.el.width, this.el.height)
        this.setMatrix()
    }

    path(cb: (lineTo: LineTo) => void) {
        const ctx = this.ctx
        ctx.beginPath()
        ctx.strokeStyle = '#777'
        cb(v => {
            const ndc = vec4.transformMat4(vec4.create(), [v[0], v[1], v[2], 1], this.pvm)
            const s = this.ctx.canvas.height / 2
            const x = ndc[0] / ndc[3]
            const y = ndc[1] / ndc[3]
            this.ctx.lineTo(s + s * x, s - s * y)
        })
        ctx.stroke()
    }

    private setMatrix() {
        const aspect = this.el.width / this.el.height
        const fov = 0.8
        const pv = mat4.create()
        mat4.perspective(pv, fov, aspect, 5, 0.1)
        mat4.translate(pv, pv, [0, 0, -3.5])
        const m = mat4.create()
        mat4.rotateX(m, m, Math.PI / 2 - this.theta)
        mat4.rotateY(m, m, this.phi)
        mat4.rotateX(m, m, Math.PI / 2)
        this.pvm = mat4.mul(mat4.create(), pv, m)
    }
}