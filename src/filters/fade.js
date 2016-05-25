/*global MovieMasher:true*/
'use strict';

MovieMasher.Filter.register('fade', {
  render: function(contexts, scope, evaluated, filter_config) {
    //console.log('fade.render', contexts, scope, evaluated);
    var bot_ctx = contexts[0];
    var new_context = MovieMasher.Filter.create_drawing_like(bot_ctx, MovieMasher.Filter.label(filter_config) + ' ' + scope.mm_t);
    new_context.context.globalAlpha = scope.mm_t;
    new_context.context.drawImage(bot_ctx.canvas, 0, 0);
    new_context.context.globalAlpha = 1;
    return [new_context];
  }
});
