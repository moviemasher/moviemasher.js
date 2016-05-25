/*global MovieMasher:true*/
'use strict';

MovieMasher.Filter.register('scale', {
  render: function(contexts, scope, evaluated, filter_config){
    var in_ctx, out_ctx, out_width, in_width, out_height, in_height;
    out_width = evaluated.w || evaluated.width;
    out_height = evaluated.h || evaluated.height;
    // console.error('scale.render output dimensions', evaluated, scope, out_width, out_height);
    if (2 > out_width + out_height) console.error('scale.render invalid output dimensions', evaluated, scope, out_width, out_height);
    else {
      in_ctx = contexts[0];
      if (! in_ctx) console.error('scale.render invalid input context', evaluated, scope, contexts);
      else {
        in_width = scope.mm_in_w;
        in_height = scope.mm_in_h;
        if (-1 === out_width) out_width = in_width * (out_height / in_height);
        if (-1 === out_height) out_height = in_height * (out_width / in_width);
        out_ctx = MovieMasher.Filter.create_drawing(out_width, out_height, MovieMasher.Filter.label(filter_config) + ' ' + out_width + 'x' + out_height, in_ctx.container);
        in_ctx.drawings.push(out_ctx);
        out_ctx.context.drawImage(in_ctx.canvas, 0, 0, in_width, in_height, 0, 0, out_width, out_height);
      }
    }
    return [out_ctx];
  },
  parse: function(contexts, scope){
    //console.log('scale.parse', scope);
    var context = contexts[0];
    scope.in_h = scope.mm_in_h = context.canvas.height;
    scope.in_w = scope.mm_in_w = context.canvas.width;
    return scope;
  }
});
