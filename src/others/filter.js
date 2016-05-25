var Filter = {
  registered: {},
  find: function(filter_id){
    return MovieMasher.find(Constant.filter, filter_id);
  },
  load: function(filter_id){
    var filter, filter_config;
    filter_config = Filter.find(filter_id);
    if (filter_config) {
      filter = Filter.registered[filter_id];
      if (! filter) Loader.load_filter(filter_config.source);
    }
    return filter;
  },
  create_drawing: function(width, height, label, container){
    //console.log('create_drawing', width, height, label, container);
    var drawing = {drawings:[]};
    drawing.container = container;
    drawing.label = label;
    drawing.canvas = document.createElement("canvas");
    drawing.context = drawing.canvas.getContext('2d');
    if (1 <= width) drawing.canvas.width = width;
    if (1 <= height) drawing.canvas.height = height;
    if (drawing.container) {
      //console.log('creating element for ', drawing.label);
      drawing.span = document.createElement("span");
      drawing.span.setAttribute("alt", drawing.label);
      drawing.container.appendChild(drawing.span);
      drawing.span.appendChild(drawing.canvas);
    }
    return drawing;
  },
  create_drawing_like: function(drawing, label){
    var new_drawing = Filter.create_drawing(drawing.canvas.width, drawing.canvas.height, label, drawing.container);
    drawing.drawings.push(new_drawing);
    return new_drawing;
  },
  destroy_drawing: function(drawing){
    if (drawing.container) {
      //console.log('destroying element for ', drawing.label);
      if (! drawing.container.removeChild(drawing.span)) console.error('could not find span in container');
      if (! drawing.span.removeChild(drawing.canvas)) console.error('could not find canvas in span');
    }
    var key;
    for (key in drawing){
      drawing[key] = null;
    }
  },
  label: function(filter){
    return filter.description || filter.id;
  },
  register: function(id, object) {
    Filter.registered[id] = object;
  },
  rgb_at_pixel: function(pixel, data){
    var index = Filter.index_from_pixel(pixel);
    return Filter.rgb_at_index(index, data);
  },
  array_from_rgb: function(rgb){
    return [rgb.r, rgb.g, rgb.b, rgb.a];
  },
  rgb_at_index: function(index, data){
    var color = null;
    if (index >= 0) {
      if (index <= data.length - 4) {
        color = {
          r: data[index], g: data[index + 1],
          b: data[index + 2], a: data[index + 3],
        };
      }
    }
    return color;
  },
  pixel_from_point: function(pt, width){
    return pt.y * width + pt.x;
  },
  point_from_pixel: function(index, width){
    var pt = { x: 0, y: 0 };
    pt.x = index % width;
    pt.y = Math.floor(index / width);
    return pt;
  },
  pixel_from_index: function(index){
    return index / 4;
  },
  index_from_pixel: function(pixel){
    return pixel * 4;
  },
  point_from_index: function(index, width){
    var pixel = Filter.pixel_from_index(index);
    return Filter.point_from_pixel(pixel, width);
  },
  safe_pixel: function(pixel, x_dif, y_dif, width, height){
    var pt = Filter.point_from_pixel(pixel, width);
    pt.x = Math.max(0, Math.min(width - 1, pt.x + x_dif));
    pt.y = Math.max(0, Math.min(height - 1, pt.y + y_dif));
    return Filter.pixel_from_point(pt, width);
  },
  safe_pixels: function(pixel, width, height, size){
    if (!size) size = 3;
    var x, y, safe, pixels = [];
    var half_size = Math.floor(size / 2);
    for (y = 0; y < size; y++) {
      for (x = 0; x < size; x++) {
        safe = Filter.safe_pixel(pixel, x - half_size, y - half_size, width, height);
        pixels.push(safe);
      }
    }
    return pixels;
  },
  rgb_matrix_from_index: function(index, data, width, height, size){
    var pixel = Filter.pixel_from_index(index);
    return Filter.rgb_matrix_from_pixel(pixel, data, width, height, size);
  },
  rgb_matrix_from_pixel: function(pixel, data, width, height, size){
    var i, z;
    var pixels = Filter.safe_pixels(pixel, width, height, size);
    z = pixels.length;
    for (i = 0; i < z; i++){
      pixels[i] = Filter.rgb_at_pixel(pixels[i], data);
    }
    return pixels;
  },
};
MovieMasher.Filter = Filter;
