'use strict';

const media = {
  'color': {
    "label": "Color",
    "type": "theme",
    "id": "com.moviemasher.theme.color",
    "properties": {
      "color": { "type": "rgb", "value": "0xFFFF00" }
    },
    "filters": [{
      "id": "color"
    }]
  },  
  'title': {
    "id": "com.moviemasher.theme.text",
    "type": "theme",
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
let masher;
function populateTextarea() {
  if (!masher) return;
  const textarea = document.getElementById('textarea');
  textarea.value = JSON.stringify(masher.mash, null, '\t');
}
function add_media(id){
  if (!masher) return;

  masher.add(media[id], 'video');
  populateTextarea();
}
function handleEventMasher(event) {
  // console.log("handleEventMasher", event);

  if (event.detail.type === "duration") {
    let range = document.getElementById('range');
    const value = masher.position;
    // console.log("handleEventMasher changing range", range, value);
    range.value = value;
  }
}

function handleFetch(fonts) {

  const canvas = document.getElementById('canvas');
  if (canvas && MovieMasher && MovieMasher.supported) {
    canvas.addEventListener("masher", handleEventMasher);
    masher = MovieMasher.player();
    // console.log("masher", masher);

    // register a default font, since we're allowing a module that uses fonts
    MovieMasher.register("font", fonts);
    // console.log(fonts)
    masher.canvas_context = canvas.getContext('2d');
    masher.mash = {};
    populateTextarea();
  }
}
function handleLoadBody() {
  fetch('media/font/blackout/font.json').then((response) => { return response.json()}).then(handleFetch);
}
