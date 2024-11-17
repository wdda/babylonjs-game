export default class Canvas {
    static setCanvas() {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        window.onresize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        window.addEventListener("orientationchange", () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }, false)

        return canvas
    }
}