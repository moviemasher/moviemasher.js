import { Errors } from "../Setup"
import { Is } from "../Utilities/Is"
import { Time, roundWithMethod } from "../Utilities/Time"

class TimeFactory {
  static createFromFrame(frame = 0, fps = 1) : Time {
    return new Time(frame, fps)
  }

  static createFromSeconds(seconds = 0, fps = 1, rounding = 'round') : Time {
    if (!Is.number(seconds) || seconds < 0) throw Errors.seconds
    if (!Is.integer(fps) || fps < 1) throw Errors.fps

    const rounded = roundWithMethod(seconds * fps, rounding)
    return this.createFromFrame(rounded, fps)
  }
}

export { TimeFactory }
