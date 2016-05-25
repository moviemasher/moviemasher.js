/*global MovieMasher:true*/
'use strict';

MovieMasher.Filter.register('overlay', {
  render: function(contexts, scope, evaluated){
    if (2 > contexts.length) return console.error('overlay.apply with insufficient contexts', contexts);
    var bot_ctx = contexts[0];
    var top_ctx = contexts[1];
    if (! bot_ctx) return console.error('overlay.apply with no bot_ctx', contexts);
    if (! top_ctx) return console.error('overlay.apply with no top_ctx', contexts);
    bot_ctx.context.drawImage(top_ctx.canvas, evaluated.x, evaluated.y);
    return [bot_ctx];
  },
  parse: function(contexts, scope){
    //console.error('overlay.parse', scope);
    scope.overlay_w = contexts[1].canvas.width;
    scope.overlay_h = contexts[1].canvas.height;
    return scope;
  }
});
