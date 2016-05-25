/*global MovieMasher:true*/
'use strict';

MovieMasher.Filter.register('colorchannelmixer', {
  render: function(contexts, scope, evaluated) {
    var drawing = contexts[0]; // one input
    var rgbas = 'rgba'.split('');
    var key, first, second, j, i, z = rgbas.length;
    for (i = 0; i < z; i++) {
      first = rgbas[i];
      for (j = 0; j < z; j++) {
        second = rgbas[j];
        key = first + second;
        if (null === evaluated[key]) evaluated[key] = ( first === second ? 1 : 0);
      }
    }
    var red, green, blue, alpha, width, height, image_data, data;
    width = drawing.canvas.width;
    height = drawing.canvas.height;
    image_data = drawing.context.getImageData(0, 0, width, height);
    data = image_data.data;
    z = data.length;
    for (i = 0; i < z; i += 4) {
      red = data[i];
      green = data[i + 1];
      blue = data[i + 2];
      alpha = data[i + 3];
      data[i] = red*evaluated.rr + green*evaluated.rg + blue*evaluated.rb + alpha*evaluated.ra;
      data[i + 1] = red*evaluated.gr + green*evaluated.gg + blue*evaluated.gb + alpha*evaluated.ga;
      data[i + 2] = red*evaluated.br + green*evaluated.bg + blue*evaluated.bb + alpha*evaluated.ba;
      data[i + 3] = red*evaluated.ar + green*evaluated.ag + blue*evaluated.ab + alpha*evaluated.aa;
    }
    drawing.context.putImageData(image_data, 0, 0);
    return contexts;
  }
});
