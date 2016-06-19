/*global MovieMasher:true*/
'use strict';

MovieMasher.Filter.register('blend', {
  render: function(contexts, scope, evaluated){
    if (2 > contexts.length) return console.error('blend.apply with insufficient contexts', contexts);
    var bot_ctx = contexts[0];
    var top_ctx = contexts[1];
    if (! bot_ctx) return console.error('blend.apply with no bot_ctx', contexts);
    if (! top_ctx) return console.error('blend.apply with no top_ctx', contexts);
    var mode = MovieMasher.Util.array_key(MovieMasher.Constant.property_types.mode.values, evaluated.all_mode, 'composite');
    bot_ctx.context.globalCompositeOperation = mode;
    bot_ctx.context.drawImage(top_ctx.canvas, 0, 0);
    bot_ctx.context.globalCompositeOperation = 'normal';
    return [bot_ctx];
  }
});
