/*global MovieMasher:true*/
'use strict';

MovieMasher.Filter.register('convolution', {

 render: function(contexts, scope, evaluated) {
		// console.log('convolution.apply', contexts, evaluated);
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
		var __copy_line = function(line, channel, data, width){
			var result = new Uint8ClampedArray(width + 2);
			var i, index = 4 * line * width + channel;
			for (i = 0; i < width; i++){
				result[i + 1] = data[index];
				index += 4;
			}
			result[width + 1] = result[1];
			result[0] = result[width];
			return result;
		};
		var __3x3 = function(options, in_data, out_data) {
			var rgbas = 'rgba';
			var bias, matrix, rdiv, sum, y, i, x, channel, p0, p1, p2;
			for (i = 0; i < 4; i++){
				channel = rgbas[i];
				rdiv = options.rdiv[channel];
				matrix = options.matrix[channel];
				bias = options.bias[channel];
				p0 = __copy_line(1, i, in_data, width);
				p1 = __copy_line(0, i, in_data, width);
				for (y = 0; y < height; y++) {
					p2 = __copy_line(y + (y < height - 1 ? 1 : -1), i, in_data, width);
					for (x = 0; x < width; x++) {
						sum = p0[x] * matrix[0];
						sum += p0[x + 1] * matrix[1];
						sum += p0[x + 2] * matrix[2];
						sum += p1[x] * matrix[3];
						sum += p1[x + 1] * matrix[4];
						sum += p1[x + 2] * matrix[5];
						sum += p2[x] * matrix[6];
						sum += p2[x + 1] * matrix[7];
						sum += p2[x + 2] * matrix[8];
						sum = Math.floor(sum * rdiv + bias + 0.5);
						out_data[(y * width + x) * 4 + i] = sum;
					}
					p0 = p1;
					p1 = p2;
				}
			}
		};

		/*  var __clip_int8 = function(a){
		var stupid = new Uint8ClampedArray(1);
		stupid[0] = a;
		return stupid[0];

						if (a&(~0xFF)) {
				return Math.abs(a) % 255;
				//	return (-a)>>31;
			}
			return a;
  };
			*/


		var options = __parse_options(evaluated);
	//	console.log('options', options);
		var width, height, input, data, drawing = contexts[0];
		width = drawing.canvas.width;
		height = drawing.canvas.height;
		input = drawing.context.getImageData(0,0,width,height);
		data = input.data;
		var output = drawing.context.createImageData(width, height);
		var out = output.data;
		__3x3(options, data, out);
		/*
  var matrix = {};
  var w, h, i, z;
  w = h = Math.sqrt(options.matrix.r.length);
  for (i = 0; i < z; i++){
   matrix[channel] = [];
   for (j = 0; j < w; j++){
    matrix[channel].push(options.matrix[channel].slice(j * w, (j + 1) * w));
   }
  }
  var half = Math.floor(h / 2);
  for (y = 0; y < height - 1; y++) {
    for (x = 0; x < width - 1; x++) {
      var px = (y * width + x) * 4;
      var r = 0.0, g = 0.0, b = 0.0, a = 0.0;

      for (var cy = 0; cy < w; ++cy) {
        for (var cx = 0; cx < h; ++cx) {
          var cpx = ((y + (cy - half)) * width + (x + (cx - half))) * 4;
          r += Number(data[cpx + 0]) * matrix.r[cy][cx];
          g += Number(data[cpx + 1]) * matrix.g[cy][cx];
          b += Number(data[cpx + 2]) * matrix.b[cy][cx];
          a += Number(data[cpx + 3]) * matrix.a[cy][cx];

        }
      }
      out[px + 0] = __clip_int8(options.rdiv.r * r + options.bias.r + 0.5);
      out[px + 1] = __clip_int8(options.rdiv.g * g + options.bias.g + 0.5);
      out[px + 2] = __clip_int8(options.rdiv.b * b + options.bias.b + 0.5);
      out[px + 3] = 255;
      //__clip_int8(options.rdiv.a * a + options.bias.a + 0.5);
    }
  }
  for (i = 0; i < out.length; i++){
    if (out[i] < 0 || out[i] > 255) console.log('numbers', out[i]);
  }
  */
		drawing.context.putImageData(output, 0, 0);
		return contexts;
	}
});
