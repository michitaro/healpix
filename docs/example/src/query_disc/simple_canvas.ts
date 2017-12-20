type LineTo = (x: number, y: number) => void


export class SimpleCanvas {
    readonly ctx: CanvasRenderingContext2D
    readonly minX: number
    readonly maxX: number
    readonly minY: number
    readonly maxY: number

    constructor(
        readonly el: HTMLCanvasElement,
        minX: number,
        maxX: number,
        minY: number,
        maxY: number,
        margin = 0,
    ) {
        this.ctx = el.getContext('2d')!
        const w = maxX - minX
        const h = maxY - minY
        this.minX = minX - w * margin
        this.maxX = maxX + w * margin
        this.minY = minY - h * margin
        this.maxY = maxY + h * margin
    }

    clear() {
        this.ctx.clearRect(0, 0, this.el.width, this.el.height)
    }

    world2screen(x: number, y: number) {
        const sx = this.ctx.canvas.width
        const sy = this.ctx.canvas.height
        const x1 = (x - this.minX) / (this.maxX - this.minX)
        const x2 = sx * x1
        const y1 = (y - this.minY) / (this.maxY - this.minY)
        const y2 = sy * (1 - y1)
        return [x2, y2]
    }

    onmousemove(cb: (x: number, y: number) => void) {
        this.el.addEventListener('mousemove', e => {
            const { left, top, width, height } = this.el.getBoundingClientRect()
            const x0 = (e.clientX - left) / width
            const x = x0 * (this.maxX - this.minX) + this.minX
            const y0 = 1 - (e.clientY - top) / height
            const y = y0 * (this.maxY - this.minY) + this.minY
            cb(x, y)
        })
    }
}