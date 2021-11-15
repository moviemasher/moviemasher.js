import { InputCommand, InputCommandPromise } from "../declarations"
import { Mash } from "../Mash/Mash/Mash"
import { CommandType } from "../Setup/Enums"
import { Time } from "./Time"



const Commander = {
  visibleInputsAtTime: (mash: Mash, time: Time): InputCommandPromise => {
    return mash.inputCommandPromise(CommandType.File, time)

  }
}

export { Commander }
