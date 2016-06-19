/*global MovieMasher:true*/
'use strict';

MovieMasher.Filter.register('crop', {
  render: function(contexts, scope, evaluated, filter_config){
    var x, y, in_ctx, out_ctx, out_width, in_width, out_height, in_height;
    out_width = evaluated.w || evaluated.out_w;
    out_height = evaluated.h || evaluated.out_h;
    in_width = scope.mm_in_w;
    in_height = scope.mm_in_h;
    x = evaluated.x || 0;
    y = evaluated.y || 0;
    if (2 > out_width + out_height) console.error('crop.render invalid output dimensions', evaluated, scope, out_width, out_height);
    else if (! (in_width && in_height)) console.error('crop.render invalid input dimensions', evaluated, scope, in_width, in_height);
    else {
      in_ctx = contexts[0];
      if (! in_ctx) console.error('crop.render invalid input context', evaluated, scope, contexts);
      else {
        if (-1 === out_width) out_width = in_width * (out_height / in_height);
        if (-1 === out_height) out_height = in_height * (out_width / in_width);
        out_ctx = MovieMasher.Filter.create_drawing(out_width, out_height, MovieMasher.Filter.label(filter_config) + ' ' + out_width + 'x' + out_height + ' ' + x + ',' + y, in_ctx.container);
        in_ctx.drawings.push(out_ctx);
        out_ctx.context.drawImage(in_ctx.canvas, x, y, out_width, out_height, 0, 0, out_width, out_height);
      }
    }
    return [out_ctx];
  },
  parse: function(contexts, scope) {
    var context = contexts[0];
    scope.in_h = scope.mm_in_h = context.canvas.height;
    scope.in_w = scope.mm_in_w = context.canvas.width;
    if (! scope.x) scope.x = '((in_w - out_w) / 2)';
    if (! scope.y) scope.y = '((in_h - out_h) / 2)';
    return scope;
  }
});
