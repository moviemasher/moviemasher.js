import { Errors } from "../Setup"
import { Is } from "../Utilities/Is"
import { Time } from "../Utilities/Time"

class TimeFactory {
  static createFromFrame(frame:number, fps:number) : Time {
    return new Time(frame, fps)
  }

  static createFromSeconds(seconds = 0, fps = 1, rounding = 'round') : Time {
    if (!Is.number(seconds) || seconds < 0) throw Errors.seconds
    if (!Is.integer(fps) || fps < 1) throw Errors.fps

    const rounded = this.roundingFunction(rounding)(seconds * fps)
    return this.createFromFrame(rounded, fps)
  }

  static roundingFunction(rounding:string = 'round') : Function {
    switch (rounding) {
      case 'ceil': return Math.ceil
      case 'floor': return Math.floor
      default: return Math.round
    }
  }
}

export { TimeFactory }
