import Constant from "../others/constant"
import Filter from "../others/filter"
import Cache from "../others/cache"
import Registry from "../others/registry"


const DrawText = {
  render: function(contexts, _scope, evaluated, filter_config) {
    var path, loaded_font, context, drawing = contexts[0]; // one input
    context = Filter.create_drawing_like(drawing, Filter.label(filter_config) + ' ' + evaluated.fontsize + 'px ' + evaluated.x + ',' + evaluated.y + ' ' + evaluated.fontcolor + ' ' + evaluated.shadowcolor + ' ' + evaluated.shadowx + ',' + evaluated.shadowy);
    if (evaluated.shadowcolor){
      context.context.shadowColor = evaluated.shadowcolor;
      context.context.shadowOffsetX = evaluated.shadowx || 0; // integer
      context.context.shadowOffsetY = evaluated.shadowy || 0; // integer
      context.context.shadowBlur = 0; // sorry, no blur supported yet in ffmpeg
    }
    // console.log("DrawText.render evaluated.fontfile:", evaluated.fontfile)
    loaded_font = Cache.get(evaluated.fontfile)
    if (loaded_font){
          path = loaded_font.getPath((evaluated.text || evaluated.textfile), evaluated.x, Number(evaluated.y) + Number(evaluated.fontsize), evaluated.fontsize);
          path.fill = evaluated.fontcolor;
          path.draw(context.context);
        }
    drawing.context.drawImage(context.canvas, 0, 0);
    return contexts;
  },
  parse: function(contexts, scope) {
    scope.text_w = 0; // width of the text to draw
    scope.text_h = 0; // height of the text to draw
    scope.mm_fontfamily = function(font_id){
      var family = '', font = Registry.find(Constant.font, font_id);
      if (font) family = font.family || font.label;
      else console.warn('no registered font family with id', font_id, font);
      return family;
    };
    scope.mm_textfile = function(text) {
      return text;
    };
    scope.mm_fontfile = function(font_id){
      var url = '', font = Registry.find(Constant.font, font_id);
      if (font) url = font.source;
      else console.warn('no registered font url with id', font_id, font);
      return url;
    };
    return scope;
  },
  parameters:[
    {
      "name": "fontcolor",
      "value":"#000000"
    },{
      "name": "shadowcolor",
      "value":"#FFFFFF"
    },{
      "name": "fontsize",
      "value":"mm_vert(20)"
    },{
      "name": "x",
      "value":"0"
    },{
      "name": "y",
      "value":"0"
    },{
      "name": "shadowx",
      "value":"mm_horz(5)"
    },{
      "name": "shadowy",
      "value":"mm_vert(5)"
    },{
      "name": "fontfile",
      "value":"mm_fontfile(com.moviemasher.font.default)"
    },{
      "name": "textfile",
      "value":"Hello World"
    }
  ]
}
Filter.register('drawtext', DrawText);
export default DrawText