/*global MovieMasher:true*/
'use strict';

MovieMasher.Filter.register('convolution', {
 render: function(contexts, scope, evaluated) {
    var __parse_options = function(evaluated){
      var result = { bias: {}, rdiv: {}, matrix: {} };
      var index, j, y, i, channel, rgbas = 'rgba';
      for (i = 0; i < 4; i++){
        index = String(i);
        channel = rgbas[i];
        result.matrix[channel] = evaluated[index + 'm'].split(' ');
        y = result.matrix[channel].length;
        for (j = 0; j < y; j++) {
          result.matrix[channel][j] = parseInt(result.matrix[channel][j]);
        }
        result.rdiv[channel] = evaluated[index + 'rdiv'] || 1;
        if (-1 < String(result.rdiv[channel]).indexOf('/')) {
          result.rdiv[channel] = result.rdiv[channel].split('/');
          result.rdiv[channel] = parseFloat(result.rdiv[channel][0]) / parseFloat(result.rdiv[channel][1]);
        } else result.rdiv[channel] = parseFloat(result.rdiv[channel]);
        result.bias[channel] = (evaluated[index + 'bias'] || 0);
      }
      return result;
    };
    var __3x3 = function(options, in_data, out_data, width, height) {
      var rgbas = 'rgba';
      var pixel, rgb_matrix, bias, matrix, rdiv, sum, y, i, z, channel;
      z = width * height;
      for (pixel = 0; pixel < z; pixel++){
        rgb_matrix = MovieMasher.Filter.rgb_matrix_from_pixel(pixel, in_data, width, height);
        for (i = 0; i < 4; i++){
          channel = rgbas[i];
          rdiv = options.rdiv[channel];
          matrix = options.matrix[channel];
          bias = options.bias[channel];
          sum = 0;
          for (y = 0; y < 9; y++) {
            sum += rgb_matrix[y][channel] * matrix[y];
          }
          sum = Math.floor(sum * rdiv + bias + 0.5);
          out_data[pixel * 4 + i] = sum;
        }
      }
    };
    var options = __parse_options(evaluated);
    var width, height, data, drawing = contexts[0];
    width = drawing.canvas.width;
    height = drawing.canvas.height;
    data = drawing.context.getImageData(0,0,width,height).data;
    var output = drawing.context.createImageData(width, height);
    __3x3(options, data, output.data, width, height);
    drawing.context.putImageData(output, 0, 0);
    return contexts;
  }
});
