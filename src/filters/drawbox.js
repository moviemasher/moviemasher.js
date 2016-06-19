/*global MovieMasher:true*/
'use strict';

MovieMasher.Filter.register('drawbox', {
  render: function(contexts, scope, evaluated, filter_config) {
    var context, drawing = contexts[0]; // one input
    var color, x, y, width, height;
    color = (MovieMasher.Util.isnt(evaluated.color) ? 'black' : evaluated.color);
    x = evaluated.x || 0;
    y = evaluated.y || 0;
    width = evaluated.width || drawing.canvas.width;
    height = evaluated.height || drawing.canvas.height;
    context = MovieMasher.Filter.create_drawing_like(drawing, MovieMasher.Filter.label(filter_config) + ' ' + color + ' ' + width + 'x' + height + ' ' + x + ',' + y);
    context.context.fillStyle = color;
    context.context.fillRect(x, y, width, height);
    drawing.context.drawImage(context.canvas, 0, 0);
    return contexts;
  }
});
