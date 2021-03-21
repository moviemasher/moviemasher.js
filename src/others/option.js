
import { copy_keys_recursize } from "./util"

const Option = {
  mash: {
    minframes: 1,
    quantize: 10,
    transition_seconds: 1,
    frame_seconds: 2,
    image_seconds: 2,
    theme_seconds: 3,
    default: { label: 'Untitled Mash', quantize: 1, backcolor: 'rgb(0,0,0)' },
  },
  player: {
    autoplay: 0,
    buffertime: 10,
    fps: 30,
    loop: 1,
    minbuffertime: 1,
    unbuffertime: 1,
    volume: 0.75,
    position_precision: 3,
  },
  timeline: {
    hscrollpadding: 20,
  },
}
Option.set = function(opts){
  copy_keys_recursize(opts, Option);
}

export default Option
