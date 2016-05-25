/*global MovieMasher:true*/
'use strict';

MovieMasher.Filter.register('chromakey',  {
  render: function(contexts, scope, evaluated) {
    var drawing = contexts[0]; // one input
    var rgb, matrix, yuv, pixels, frame, data, color, colors, blend, similarity, pixels_offset, i;
    blend = evaluated.blend;
    similarity = evaluated.similarity;
    color = evaluated.color;
    colors = color.substr(4, color.length - 5).split(',');
    rgb = { r: colors[0], g: colors[1], b: colors[2] };
    yuv = MovieMasher.Colors.rgb2yuv(rgb);
    var width = drawing.canvas.width;
    var height = drawing.canvas.height;
    for (i = 0; i < 3; i++) colors[i] = Number(colors[i]);
    frame = drawing.context.getImageData(0, 0, width, height);
    data = frame.data;
    pixels = data.length / 4;
    while(pixels--){
        pixels_offset = pixels * 4;
        matrix = [MovieMasher.Colors.rgb2yuv(MovieMasher.Filter.rgb_at_index(pixels_offset, data))];
        // more accurate, but so slow...
        // matrix = MovieMasher.Filter.rgb_matrix(pixels_offset, data, width, height);
        // for (i = 0; i < matrix.length; i++) matrix[i] = MovieMasher.Colors.rgb2yuv(matrix[i]);
        data[pixels_offset + 3]  = MovieMasher.Colors.yuv_blend(matrix, yuv, similarity, blend);
    }
    drawing.context.putImageData(frame, 0, 0);
    return contexts;
  },
  parameters: [
    { name: "color", value: "color" },
    { name: "similarity", value: "similarity" },
    { name: "blend", value: "blend" }
  ],
});
