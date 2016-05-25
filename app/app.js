/*jshint unused:false */
/*global MovieMasher:true*/
'use strict';
var mm_player;
function mm_update_textarea() {
  var textarea = document.getElementById('mm-textarea');
  textarea.value = JSON.stringify(mm_player.mash, null, '\t');
}
function add_media(id){
  var media = {
    'title': {
      "label": "Title",
      "type": "theme",
      "id": "com.moviemasher.theme.text",
      "properties": {
        "string": { "type": "string", "value": "Title" },
        "size": { "type": "fontsize", "value": 0.2 },
        "x": { "type": "number", "value": 0 },
        "y": { "type": "number", "value": 0 },
        "color": { "type": "rgba", "value": "rgba(255,255,255,1)" },
        "shadowcolor": { "type": "rgba", "value": "rgba(0,0,0,0)" },
        "shadowx": { "type": "number", "value": 0 },
        "shadowy": { "type": "number", "value": 0 },
        "background": { "type": "rgb", "value": "rgb(0,0,0)" },
        "fontface": { "type": "font", "value": "com.moviemasher.font.default" }
      },
      "filters": [{
        "id": "color",
        "parameters":[{
          "name": "color",
          "value":"background"
        },{
          "name": "size",
          "value":"mm_dimensions"
        },{
          "name": "duration",
          "value":"mm_duration"
        },{
          "name": "rate",
          "value":"mm_fps"
        }]
      },{
        "id": "drawtext",
        "parameters":[{
          "name": "fontcolor",
          "value":"color"
        },{
          "name": "shadowcolor",
          "value":"shadowcolor"
        },{
          "name": "fontsize",
          "value":"mm_vert(size)"
        },{
          "name": "x",
          "value":"mm_horz(x)"
        },{
          "name": "y",
          "value":"mm_vert(y)"
        },{
          "name": "shadowx",
          "value":"mm_horz(shadowx)"
        },{
          "name": "shadowy",
          "value":"mm_vert(shadowy)"
        },{
          "name": "fontfile",
          "value":"mm_fontfile(fontface)"
        },{
          "name": "textfile",
          "value":"mm_textfile(string)"
        }]
      }]
    },
    'cable': {
      'label': 'Cable',
      'type': 'image',
      'id': 'cable',
      'url': 'media/img/cable.jpg'
    },
    'frog': {
      'label': 'Frog',
      'type': 'image',
      'id': 'frog',
      'url': 'media/img/frog.jpg'
    },
    'globe': {
      'label': 'Globe',
      'type': 'image',
      'id': 'globe',
      'url': 'media/img/globe.jpg'
    }
  };
  if (mm_player) {
    mm_player.add(media[id], 'video');
    mm_update_textarea();
  }
}
function mm_load() {
  var canvas = document.getElementById('mm-canvas');
  if (canvas && MovieMasher && MovieMasher.supported) {
    mm_player = MovieMasher.player();
    // register the filters we use
    MovieMasher.register(MovieMasher.Constant.filter, [
      { "id":"color", "source": "../dist/filters/color.js" },
      { "id":"drawtext", "source": "../dist/filters/drawtext.js" },
      { "id":"overlay", "source": "../dist/filters/overlay.js" },
      { "id":"scale", "source": "../dist/filters/scale.js" },
      { "id":"setsar", "source": "../dist/filters/setsar.js" }
    ]);
    // register at least a default font, since we're allowing a module that uses fonts
    MovieMasher.register(MovieMasher.Constant.font, {
      "label": "Blackout Two AM",
      "id":"com.moviemasher.font.default",
      "source": "media/font/default.ttf",
      "family":"Blackout Two AM"
    });
    mm_player.canvas_context = canvas.getContext('2d');
    mm_player.mash = {};
    mm_update_textarea();
  }
}
