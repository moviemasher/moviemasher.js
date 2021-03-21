

import Constant from "../others/constant"
import Filter from "../others/filter"
import {array_key} from "../others/util"


const Blend = {
  render: function(contexts, scope, evaluated){
    if (2 > contexts.length) return console.error('blend.apply with insufficient contexts', contexts);
    var bot_ctx = contexts[0];
    var top_ctx = contexts[1];
    if (! bot_ctx) return console.error('blend.apply with no bot_ctx', contexts);
    if (! top_ctx) return console.error('blend.apply with no top_ctx', contexts);
    var mode = array_key(Constant.property_types.mode.values, evaluated.all_mode, 'composite');
    bot_ctx.context.globalCompositeOperation = mode;
    bot_ctx.context.drawImage(top_ctx.canvas, 0, 0);
    bot_ctx.context.globalCompositeOperation = 'normal';
    return [bot_ctx];
  }
}
Filter.register('blend', Blend);
export default Blend