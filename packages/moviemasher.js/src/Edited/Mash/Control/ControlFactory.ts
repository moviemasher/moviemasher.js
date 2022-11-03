import { ControlObject } from "./Control";
import { ControlClass } from "./ControlClass";


export const controlInstance = (object: ControlObject) => (
  new ControlClass(object)
)
