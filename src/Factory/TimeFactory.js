import { Factory } from "./Factory";
import { Errors } from "../Errors";
import { Is } from '../Is'
import { Time } from "../Time";

class TimeFactoryClass extends Factory {
  create(frame, fps) { return new Time(frame, fps) }
  createFromSeconds(seconds = 0, fps = 1, rounding = 'round') {
    if (!Is.number(seconds) || seconds < 0) throw(Errors.seconds + seconds + seconds.constructor.name)
    if (!Is.integer(fps) || fps < 1) throw(Errors.fps)
    
    return this.create(Math[rounding](seconds * fps), fps)
  }
}
const TimeFactory = new TimeFactoryClass
export { TimeFactory }
