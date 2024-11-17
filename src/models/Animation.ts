import BezierEasing from "bezier-easing"

export default class Animation {
  easeOutCubic: any
  easeInSine: any
  easeOutSine: any
  constructor () {
    this.easeOutCubic = BezierEasing(0.33, 1, 0.68, 1)
    this.easeInSine = BezierEasing(0.12, 0, 0.39, 0)
    this.easeOutSine = BezierEasing(0.61, 1, 0.88, 1)
  }

  animate(options: any) {
    let start: number, previousTimeStamp: number;

    const step = (timestamp: number) => {
      if (start === undefined) {
        start = timestamp
      }

      const runtime = timestamp - start;

      if (previousTimeStamp !== timestamp) {
        const relativeProgress = runtime / options.duration
        const easedProgress = options.easing(relativeProgress)
        options.draw(easedProgress)
      }

      if (runtime < options.duration) {
        previousTimeStamp = timestamp
        requestAnimationFrame(step)
      }
    }

    return requestAnimationFrame(step)
  }
}
