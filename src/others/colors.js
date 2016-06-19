var Colors = {
  yuv2rgb: function(yuv) {
    var k, rgb = {};
    for(k in yuv) yuv[k] = parseInt(yuv[k]);
    rgb.r = yuv.y + 1.4075 * (yuv.v - 128);
    rgb.g = yuv.y - 0.3455 * (yuv.u - 128) - (0.7169 * (yuv.v - 128));
    rgb.b = yuv.y + 1.7790 * (yuv.u - 128);
    for (k in rgb) rgb[k] = Math.min(255, Math.max(0, Math.floor(rgb[k])));
    return rgb;
  },
  rgb2hex: function(rgb){
    var r, g, b;
    r = rgb.r.toString(16);
    g = rgb.g.toString(16);
    b = rgb.b.toString(16);
    if (r.length < 2) r = "0" + r;
    if (g.length < 2) g = "0" + g;
    if (b.length < 2) b = "0" + b;
    return "#" + r + g + b;
  },
  yuv_blend: function(yuvs, yuv2, similarity, blend){
    var du, dv, diff = 0.0, i, z = yuvs.length;
    for (i = 0; i < z; i++){
      du = (yuvs[i].u - yuv2.u);
      dv = (yuvs[i].v - yuv2.v);
      diff += Math.sqrt((du * du + dv * dv) / (255.0 * 255.0));
    }
    diff = (diff / Number(z));
    if (blend > 0.0001) {
      return Math.min(1.0, Math.max(0.0, (diff - similarity) / blend)) * 255.0;
    }
    return (diff > similarity) ? 255 : 0;
  },
  rgb2yuv: function(rgb) {
    var k, yuv = {};
    for(k in rgb) rgb[k] = parseInt(rgb[k]);
    yuv.y = rgb.r * 0.299000 + rgb.g * 0.587000 + rgb.b * 0.114000;
    yuv.u = rgb.r * -0.168736 + rgb.g * -0.331264 + rgb.b * 0.500000 + 128;
    yuv.v = rgb.r * 0.500000 + rgb.g * -0.418688 + rgb.b * -0.081312 + 128;
    for(k in yuv) yuv[k] = Math.floor(yuv[k]);
    return yuv;
  },
};
MovieMasher.Colors = Colors;
