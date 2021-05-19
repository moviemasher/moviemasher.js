'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () {
            return e[k];
          }
        });
      }
    });
  }
  n['default'] = e;
  return Object.freeze(n);
}

const Default = {
    buffer: 10,
    fps: 30,
    loop: true,
    volume: 0.75,
    precision: 3,
    autoplay: false,
    mash: {
        label: "Untitled Mash",
        quantize: 10,
        backcolor: "rgb(0,0,0)",
    },
    media: {
        frame: { duration: 2 },
        image: { duration: 2 },
        theme: { duration: 3 },
        transition: { duration: 1 },
    }
};

const $invalid = "Invalid";
const $unknown = "Unknown";
const $expected = "Expected";
const $invalidArgument = `${$invalid} argument`;
const $invalidProperty = `${$invalid} property`;
const $deprecated = "deprecated in 4.1";
const $internal = "Internal Error ";
const Errors = {
    mash: `${$expected} mash`,
    action: `${$expected} Action`,
    actions: `${$expected} Actions`,
    internal: $internal,
    argument: `${$invalidArgument} `,
    type: `${$invalid} type `,
    selection: `${$invalid} selection `,
    unknown: {
        type: `${$unknown} type `,
        merger: `${$unknown} merger `,
        effect: `${$unknown} effect `,
        filter: `${$unknown} filter `,
        font: `${$unknown} font `,
        scaler: `${$unknown} scalar `,
    },
    uncached: "Uncached URL ",
    object: `${$invalidArgument} object `,
    array: `${$invalidArgument} array `,
    media: `${$invalidArgument} media `,
    id: `${$invalidArgument} id `,
    frame: `${$invalidArgument} frame `,
    frames: `${$invalidProperty} frames `,
    fps: `${$invalidArgument} fps `,
    seconds: `${$invalidArgument} seconds `,
    url: `${$invalidArgument} url `,
    time: `${$invalidArgument} Time`,
    timeRange: `${$invalidArgument} TimeRange`,
    mainTrackOverlap: `${$internal}: main track clips overlap without transition`,
    unknownMash: `${$unknown} Mash property `,
    property: `${$invalidArgument} property `,
    deprecation: {
        property_types: `property_types ${$deprecated} - please get MovieMasher.Property.types instead`,
        addModulesOfType: `addModulesOfType ${$deprecated} for unsupported type `,
        configure: {
            get: `configure ${$deprecated} - please get MovieMasher.defaults instead`,
            set: `configure ${$deprecated} - please supply mash.quantize and media.duration instead`,
        },
        canvas_context: {
            get: `canvas_context ${$deprecated} - please get videoContext instead`,
            set: `canvas_context ${$deprecated} - please set videoContext instead`,
        }
    },
    wrongClass: `${$expected} instance of `,
};

const byFrame = (a, b) => a.frame - b.frame;
const byTrack = (a, b) => a.track - b.track;
const byLabel = (a, b) => {
  if (a.label < b.label) return -1
  if (a.label > b.label) return 1
  return 0
};

const $action = "action";
const $add = "add";
const $audio = "audio";
const $frame = "frame";
const $duration = "duration";
const $effect = "effect";
const $filter = "filter";
const $font = "font";
const $image = "image";
const $load = "load";
const $merger = "merger";
const $module = "module";
const $redo = "redo";
const $scaler = "scaler";
const $theme = "theme";
const $transition = "transition";
const $truncate = "truncate";
const $undo = "undo";
const $video = "video";
const map = (type) => [type, type];
const ClipTypes = [$audio, $video, $image, $theme, $transition, $frame];
const ClipType = Object.fromEntries(ClipTypes.map(map));
const EventTypes = [$action, $load, $duration, $truncate, $add, $undo, $redo];
const EventType = Object.fromEntries(EventTypes.map(map));
const MediaTypes = [
    $audio, $image, $video,
    $theme, $transition,
    $scaler, $merger, $effect,
    $font, $filter
];
const MediaType = Object.fromEntries(MediaTypes.map(map));
const ModuleTypes = [$font, $effect, $scaler, $merger, $theme, $transition];
const ModuleType = Object.fromEntries(ModuleTypes.map(map));
const LoadTypes = [$font, $image, $audio, $module];
const LoadType = Object.fromEntries(LoadTypes.map(map));
const TrackTypes = [$audio, $video];
const TrackType = Object.fromEntries(TrackTypes.map(map));
const MoveTypes = [$effect, ...TrackTypes];
const MoveType = Object.fromEntries(MoveTypes.map(map));
const TransformTypes = [$merger, $scaler];
const TransformType = Object.fromEntries(TransformTypes.map(map));

const label$i = "Blackout Two AM";
const id$j = "com.moviemasher.font.default";
const type$c = "font";
const source = "../examples/javascript/media/font/blackout/theleagueof-blackout/webfonts/blackout_two_am-webfont.ttf";
const family = "Blackout Two AM";
var fontDefaultJson = {
  label: label$i,
  id: id$j,
  type: type$c,
  source: source,
  family: family
};

const label$h = "Blur";
const type$b = "effect";
const id$i = "com.moviemasher.effect.blur";
const properties$d = {
};
const filters$h = [
  {
    id: "convolution",
    parameters: [
      {
        name: "0m",
        value: "1 1 1 1 1 1 1 1 1"
      },
      {
        name: "1m",
        value: "1 1 1 1 1 1 1 1 1"
      },
      {
        name: "2m",
        value: "1 1 1 1 1 1 1 1 1"
      },
      {
        name: "3m",
        value: "1 1 1 1 1 1 1 1 1"
      },
      {
        name: "0rdiv",
        value: "1/9"
      },
      {
        name: "1rdiv",
        value: "1/9"
      },
      {
        name: "2rdiv",
        value: "1/9"
      },
      {
        name: "3rdiv",
        value: "1/9"
      }
    ]
  }
];
var effectBlurJson = {
  label: label$h,
  type: type$b,
  id: id$i,
  properties: properties$d,
  filters: filters$h
};

const label$g = "Chromakey";
const type$a = "effect";
const id$h = "com.moviemasher.effect.chromakey";
const properties$c = {
  chroma_blend: {
    type: "number",
    value: 0.01
  },
  chroma_similarity: {
    type: "number",
    value: 0.5
  },
  chroma_color: {
    type: "rgb",
    value: "rgb(0,255,0)"
  }
};
const filters$g = [
  {
    id: "chromakey",
    parameters: [
      {
        name: "color",
        value: "chroma_color"
      },
      {
        name: "blend",
        value: "chroma_blend"
      },
      {
        name: "similarity",
        value: "chroma_similarity"
      }
    ]
  }
];
var effectChromaKeyJson = {
  label: label$g,
  type: type$a,
  id: id$h,
  properties: properties$c,
  filters: filters$g
};

const label$f = "Emboss";
const type$9 = "effect";
const id$g = "com.moviemasher.effect.emboss";
const properties$b = {
};
const filters$f = [
  {
    id: "convolution",
    parameters: [
      {
        name: "0m",
        value: "-2 -1 0 -1 1 1 0 1 2"
      },
      {
        name: "1m",
        value: "-2 -1 0 -1 1 1 0 1 2"
      },
      {
        name: "2m",
        value: "-2 -1 0 -1 1 1 0 1 2"
      },
      {
        name: "3m",
        value: "-2 -1 0 -1 1 1 0 1 2"
      }
    ]
  }
];
var effectEmbossJson = {
  label: label$f,
  type: type$9,
  id: id$g,
  properties: properties$b,
  filters: filters$f
};

const label$e = "Grayscale";
const type$8 = "effect";
const id$f = "com.moviemasher.effect.grayscale";
const properties$a = {
};
const filters$e = [
  {
    id: "colorchannelmixer",
    parameters: [
      {
        name: "rr",
        value: 0.3
      },
      {
        name: "rg",
        value: 0.4
      },
      {
        name: "rb",
        value: 0.3
      },
      {
        name: "ra",
        value: 0
      },
      {
        name: "gr",
        value: 0.3
      },
      {
        name: "gg",
        value: 0.4
      },
      {
        name: "gb",
        value: 0.3
      },
      {
        name: "ga",
        value: 0
      },
      {
        name: "br",
        value: 0.3
      },
      {
        name: "bg",
        value: 0.4
      },
      {
        name: "bb",
        value: 0.3
      },
      {
        name: "ba",
        value: 0
      },
      {
        name: "ar",
        value: 0
      },
      {
        name: "ag",
        value: 0
      },
      {
        name: "ab",
        value: 0
      },
      {
        name: "aa",
        value: 1
      }
    ]
  }
];
var effectGrayscaleJson = {
  label: label$e,
  type: type$8,
  id: id$f,
  properties: properties$a,
  filters: filters$e
};

const label$d = "Sepia";
const type$7 = "effect";
const id$e = "com.moviemasher.effect.sepia";
const properties$9 = {
};
const filters$d = [
  {
    id: "colorchannelmixer",
    parameters: [
      {
        name: "rr",
        value: 0.393
      },
      {
        name: "rg",
        value: 0.769
      },
      {
        name: "rb",
        value: 0.189
      },
      {
        name: "ra",
        value: 0
      },
      {
        name: "gr",
        value: 0.349
      },
      {
        name: "gg",
        value: 0.686
      },
      {
        name: "gb",
        value: 0.168
      },
      {
        name: "ga",
        value: 0
      },
      {
        name: "br",
        value: 0.272
      },
      {
        name: "bg",
        value: 0.534
      },
      {
        name: "bb",
        value: 0.131
      },
      {
        name: "ba",
        value: 0
      },
      {
        name: "ar",
        value: 0
      },
      {
        name: "ag",
        value: 0
      },
      {
        name: "ab",
        value: 0
      },
      {
        name: "aa",
        value: 1
      }
    ]
  }
];
var effectSepiaJson = {
  label: label$d,
  type: type$7,
  id: id$e,
  properties: properties$9,
  filters: filters$d
};

const label$c = "Sharpen";
const type$6 = "effect";
const id$d = "com.moviemasher.effect.sharpen";
const properties$8 = {
};
const filters$c = [
  {
    id: "convolution",
    parameters: [
      {
        name: "0m",
        value: "0 -1 0 -1 5 -1 0 -1 0"
      },
      {
        name: "1m",
        value: "0 -1 0 -1 5 -1 0 -1 0"
      },
      {
        name: "2m",
        value: "0 -1 0 -1 5 -1 0 -1 0"
      },
      {
        name: "3m",
        value: "0 -1 0 -1 5 -1 0 -1 0"
      }
    ]
  }
];
var effectSharpenJson = {
  label: label$c,
  type: type$6,
  id: id$d,
  properties: properties$8,
  filters: filters$c
};

const label$b = "Text Box";
const type$5 = "effect";
const id$c = "com.moviemasher.effect.textbox";
const properties$7 = {
  string: {
    type: "string",
    value: "Text Box"
  },
  size: {
    type: "fontsize",
    value: 0.2
  },
  color: {
    type: "rgba",
    value: "rgba(255,0,0,1)"
  },
  fontface: {
    type: "font",
    value: "com.moviemasher.font.default"
  },
  shadowcolor: {
    type: "rgba",
    value: "rgba(0,0,0,0)"
  },
  shadowx: {
    type: "number",
    value: 0.015
  },
  shadowy: {
    type: "number",
    value: 0.015
  },
  x: {
    type: "number",
    value: 0
  },
  y: {
    type: "number",
    value: 0
  }
};
const filters$b = [
  {
    id: "drawtext",
    parameters: [
      {
        name: "fontcolor",
        value: "color"
      },
      {
        name: "shadowcolor",
        value: "shadowcolor"
      },
      {
        name: "fontsize",
        value: "mm_vert(size)"
      },
      {
        name: "x",
        value: "mm_horz(x)"
      },
      {
        name: "y",
        value: "mm_vert(y)"
      },
      {
        name: "shadowx",
        value: "mm_horz(shadowx)"
      },
      {
        name: "shadowy",
        value: "mm_vert(shadowy)"
      },
      {
        name: "fontfile",
        value: "mm_fontfile(fontface)"
      },
      {
        name: "textfile",
        value: "mm_textfile(string)"
      }
    ]
  }
];
var effectTextJson = {
  label: label$b,
  type: type$5,
  id: id$c,
  properties: properties$7,
  filters: filters$b
};

const label$a = "Blend";
const id$b = "com.moviemasher.merger.blend";
const properties$6 = {
  mode: {
    type: "mode",
    value: "normal"
  }
};
const filters$a = [
  {
    id: "blend",
    parameters: [
      {
        name: "all_mode",
        value: "mode"
      },
      {
        name: "repeatlast",
        value: "0"
      }
    ]
  }
];
var mergerBlendJson = {
  label: label$a,
  id: id$b,
  properties: properties$6,
  filters: filters$a
};

const label$9 = "Center";
const id$a = "com.moviemasher.merger.center";
const filters$9 = [
  {
    id: "overlay",
    parameters: [
      {
        name: "x",
        value: "floor((mm_width - overlay_w) / 2)"
      },
      {
        name: "y",
        value: "floor((mm_height - overlay_h) / 2)"
      }
    ]
  }
];
var mergerCenterJson = {
  label: label$9,
  id: id$a,
  filters: filters$9
};

const label$8 = "Constrained";
const type$4 = "merger";
const id$9 = "com.moviemasher.merger.constrained";
const properties$5 = {
  left: {
    type: "pixel",
    value: 0
  },
  top: {
    type: "pixel",
    value: 0
  }
};
const filters$8 = [
  {
    id: "overlay",
    parameters: [
      {
        name: "x",
        value: "left*(mm_width-overlay_w)"
      },
      {
        name: "y",
        value: "top*(mm_height-overlay_h)"
      }
    ]
  }
];
var mergerConstrainedJson = {
  label: label$8,
  type: type$4,
  id: id$9,
  properties: properties$5,
  filters: filters$8
};

const label$7 = "Top Left";
const id$8 = "com.moviemasher.merger.default";
const filters$7 = [
  {
    id: "overlay",
    parameters: [
      {
        name: "x",
        value: "0"
      },
      {
        name: "y",
        value: "0"
      }
    ]
  }
];
var mergerDefaultJson = {
  label: label$7,
  id: id$8,
  filters: filters$7
};

const label$6 = "Overlay";
const id$7 = "com.moviemasher.merger.overlay";
const properties$4 = {
  left: {
    type: "pixel",
    value: 0.5
  },
  top: {
    type: "pixel",
    value: 0.5
  }
};
const filters$6 = [
  {
    id: "overlay",
    parameters: [
      {
        name: "x",
        value: "((mm_width + overlay_w) * left) - overlay_w"
      },
      {
        name: "y",
        value: "((mm_height + overlay_h) * top) - overlay_h"
      }
    ]
  }
];
var mergerOverlayJson = {
  label: label$6,
  id: id$7,
  properties: properties$4,
  filters: filters$6
};

const label$5 = "Stretch";
const id$6 = "com.moviemasher.scaler.default";
const filters$5 = [
  {
    id: "scale",
    parameters: [
      {
        name: "width",
        value: "mm_width"
      },
      {
        name: "height",
        value: "mm_height"
      }
    ]
  },
  {
    id: "setsar",
    parameters: [
      {
        name: "sar",
        value: "1"
      },
      {
        name: "max",
        value: "1"
      }
    ]
  }
];
var scalerDefaultJson = {
  label: label$5,
  id: id$6,
  filters: filters$5
};

const label$4 = "Pan";
const type$3 = "scaler";
const id$5 = "com.moviemasher.scaler.pan";
const properties$3 = {
  scale: {
    type: "size1",
    value: 1.25
  },
  direction: {
    type: "direction8",
    value: 1
  }
};
const filters$4 = [
  {
    id: "crop",
    description: "crop down diagonals and center",
    parameters: [
      {
        name: "out_w",
        value: [
          {
            condition: "direction < 4",
            value: "mm_input_width"
          },
          {
            condition: "true",
            value: "mm_horz(scale, true) / mm_max(mm_horz(scale, true) / mm_input_width, mm_vert(scale, true) / mm_input_height)"
          }
        ]
      },
      {
        name: "out_h",
        value: [
          {
            condition: "direction < 4",
            value: "mm_input_height"
          },
          {
            condition: "true",
            value: "mm_vert(scale, true) / mm_max(mm_horz(scale, true) / mm_input_width, mm_vert(scale, true) / mm_input_height)"
          }
        ]
      },
      {
        name: "x",
        value: "(mm_input_width-out_w)/2"
      },
      {
        name: "y",
        value: "(mm_input_height-out_h)/2"
      }
    ]
  },
  {
    id: "scale",
    description: "scale (proudly for diagonals)",
    parameters: [
      {
        name: "w",
        value: [
          {
            condition: "direction < 4",
            value: "mm_input_width * mm_max(mm_horz(scale) / mm_input_width, mm_vert(scale) / mm_input_height)"
          },
          {
            condition: "true",
            value: "mm_horz(scale, true)"
          }
        ]
      },
      {
        name: "h",
        value: [
          {
            condition: "direction < 4",
            value: "mm_input_height * mm_max(mm_horz(scale) / mm_input_width, mm_vert(scale) / mm_input_height)"
          },
          {
            condition: "true",
            value: "mm_vert(scale, true)"
          }
        ]
      }
    ]
  },
  {
    id: "crop",
    description: "crop down and position over time",
    parameters: [
      {
        name: "w",
        value: "mm_width"
      },
      {
        name: "h",
        value: "mm_height"
      },
      {
        name: "x",
        value: [
          {
            condition: "direction",
            "in": [
              0,
              2
            ],
            value: "(in_w-mm_width)/2"
          },
          {
            condition: "direction",
            "in": [
              1,
              5
            ],
            value: "(in_w-mm_width)*mm_t"
          },
          {
            condition: "direction",
            is: 4,
            value: "(in_w-mm_width)*mm_t"
          },
          {
            condition: "direction",
            "in": [
              3,
              7
            ],
            value: "(in_w-mm_width)-((in_w-mm_width)*mm_t)"
          },
          {
            condition: "direction",
            is: 6,
            value: "floor(((in_w-mm_width)*(1.0-mm_t)))"
          }
        ]
      },
      {
        name: "y",
        value: [
          {
            condition: "direction",
            "in": [
              1,
              3
            ],
            value: "(in_h-mm_height)/2"
          },
          {
            condition: "direction",
            "in": [
              2,
              5
            ],
            value: "(in_h-mm_height)*mm_t"
          },
          {
            condition: "direction",
            is: 6,
            value: "ceil((in_h-mm_height)*mm_t)"
          },
          {
            condition: "direction",
            "in": [
              0,
              7
            ],
            value: "(in_h-mm_height)-((in_h-mm_height)*mm_t)"
          },
          {
            condition: "direction",
            is: 4,
            value: "(in_h-mm_height)-((in_h-mm_height) * mm_t)"
          }
        ]
      }
    ]
  },
  {
    id: "setsar",
    parameters: [
      {
        name: "sar",
        value: "1"
      },
      {
        name: "max",
        value: "1"
      }
    ]
  }
];
var scalerPanJson = {
  label: label$4,
  type: type$3,
  id: id$5,
  properties: properties$3,
  filters: filters$4
};

const label$3 = "Scale";
const type$2 = "scaler";
const id$4 = "com.moviemasher.scaler.scale";
const properties$2 = {
  scale: {
    type: "size1",
    value: 1
  }
};
const filters$3 = [
  {
    id: "scale",
    parameters: [
      {
        name: "width",
        value: "scale * mm_input_width * mm_max(mm_width / mm_input_width, mm_height / mm_input_height)"
      },
      {
        name: "height",
        value: "scale * mm_input_height * mm_max(mm_width / mm_input_width, mm_height / mm_input_height)"
      }
    ]
  },
  {
    id: "setsar",
    parameters: [
      {
        name: "sar",
        value: "1"
      },
      {
        name: "max",
        value: "1"
      }
    ]
  }
];
var scalerScaleJson = {
  label: label$3,
  type: type$2,
  id: id$4,
  properties: properties$2,
  filters: filters$3
};

const label$2 = "Color";
const type$1 = "theme";
const id$3 = "com.moviemasher.theme.color";
const properties$1 = {
  color: {
    type: "rgb",
    value: "#FFFF00"
  }
};
const filters$2 = [
  {
    id: "color"
  }
];
var themeColorJson = {
  label: label$2,
  type: type$1,
  id: id$3,
  properties: properties$1,
  filters: filters$2
};

const label$1 = "Title";
const type = "theme";
const id$2 = "com.moviemasher.theme.text";
const properties = {
  string: {
    type: "string",
    value: "Title"
  },
  size: {
    type: "fontsize",
    value: 0.3
  },
  x: {
    type: "number",
    value: 0
  },
  y: {
    type: "number",
    value: 0
  },
  color: {
    type: "rgba",
    value: "rgba(255,0,0,1)"
  },
  shadowcolor: {
    type: "rgba",
    value: "rgba(0,0,0,0)"
  },
  shadowx: {
    type: "number",
    value: 0.015
  },
  shadowy: {
    type: "number",
    value: 0.015
  },
  background: {
    type: "hex",
    value: "#ffffff"
  },
  fontface: {
    type: "font",
    value: "com.moviemasher.font.default"
  }
};
const filters$1 = [
  {
    id: "color",
    parameters: [
      {
        name: "color",
        value: "background"
      },
      {
        name: "size",
        value: "mm_dimensions"
      },
      {
        name: "duration",
        value: "mm_duration"
      },
      {
        name: "rate",
        value: "mm_fps"
      }
    ]
  },
  {
    id: "drawtext",
    parameters: [
      {
        name: "fontcolor",
        value: "color"
      },
      {
        name: "shadowcolor",
        value: "shadowcolor"
      },
      {
        name: "fontsize",
        value: "mm_vert(size)"
      },
      {
        name: "x",
        value: "mm_horz(x)"
      },
      {
        name: "y",
        value: "mm_vert(y)"
      },
      {
        name: "shadowx",
        value: "mm_horz(shadowx)"
      },
      {
        name: "shadowy",
        value: "mm_vert(shadowy)"
      },
      {
        name: "fontfile",
        value: "mm_fontfile(fontface)"
      },
      {
        name: "textfile",
        value: "mm_textfile(string)"
      }
    ]
  }
];
var themeTextJson = {
  label: label$1,
  type: type,
  id: id$2,
  properties: properties,
  filters: filters$1
};

// interface Defaults {
//   font: Object
//   merger: Object
//   scaler: Object
//   effect?: Object
// }

// TODO: rewrite as properties applied to class
class Module {
  // defaults: Defaults
  constructor() {
    this.defaults = {
      font: fontDefaultJson,
      merger: mergerDefaultJson,
      scaler: scalerDefaultJson,
    };
    this[ModuleType.theme] = [
      themeColorJson,
      themeTextJson,
    ];
    this[ModuleType.effect] = [
      effectBlurJson,
      effectChromaKeyJson,
      effectEmbossJson,
      effectGrayscaleJson,
      effectSepiaJson,
      effectSharpenJson,
      effectTextJson
    ];
    this[ModuleType.font] = [this.defaults.font];
    this[ModuleType.merger] = [
      mergerBlendJson,
      mergerCenterJson,
      mergerConstrainedJson,
      mergerOverlayJson,
      this.defaults.merger,
    ];
    this[ModuleType.scaler] = [
      scalerPanJson,
      scalerScaleJson,
      this.defaults.scaler,
    ];
    ModuleTypes.forEach(type => this[type] ||= []);
  }

  addModulesOfType(objects, type) {
    if (! ModuleTypes.includes(type)) {
      console.warn(Errors.deprecation.addModulesOfType + type);
      return
    }
    const array = this[type];
    let changed = false;
    objects.forEach(object => {
      const { id } = object;
      const is_default = id === 'com.moviemasher.' + type + '.default';
      const existing = this[type].find(object => object.id === id);
      if (existing) array.splice(array.indexOf(existing), 1);
      array.push(object);
      if (is_default) this.defaults[type] = object;
      changed = true;
    });
    if (changed) array.sort(byLabel);
    return changed
  }

  fontById(id) { return this.ofType(id, ModuleType.font) }

  scalerById(id) { return this.ofType(id, ModuleType.scaler) }

  mergerById(id) { return this.ofType(id, ModuleType.merger) }


  effectById(id) { return this.ofType(id, ModuleType.effect) }


  themeById(id) { return this.ofType(id, ModuleType.theme) }

  defaultOfType(type) { return { ...this.defaults[type], type } }

  objectWithDefaultId(type) {
    const module = this.defaultOfType(type);
    if (module) return { id: module.id, type }
  }

  ofType(id, type) {
    if (! ModuleTypes.includes(type)) {
      console.warn("Module.ofType unsupported type", type);
      return
    }
    if (!this[type]) console.log(this.constructor.name, "ofType", type);
    const module = this[type].find(object => object.id === id);
    if (module) return { ...module, type }
  }
}

const ModuleInstance = new Module;

const array = value => {
  if (defined(Array.isArray)) return Array.isArray(value)

  return instance(value, Array) 
};
const method = value => typeof value === 'function';

const object$1 = value => typeof value === 'object';
const string = value => typeof value === 'string';
const undefined$1 = value => typeof value === 'undefined';
const number = value => typeof value === 'number';
const boolean = value => typeof value === 'boolean';
const integer = value => Number.isInteger(value);
const length = value => !!value.length;
const nil = value => value === null;
const not = value => undefined$1(value) || nil(value);

const empty = value => {
  if (not(value)) return true
  if (array(value)) return emptyarray(value)
  if (string(value)) return emptystring(value)
  
  return emptyobject(value)
};
const emptystring = value => {
  return not(value) || !string(value) || !length(value)
};
const emptyarray = value => not(value) || !array(value) || !length(value);

const emptyobject = value => {
  return not(value) || !object$1(value) || !length(Object.keys(value))
};
const nonobject = value => value.constructor.name !== "Object";

const instanceOf = (value, klass) => Is.object(value) && value instanceof klass;
const defined = value => !Is.undefined(value);

const objectStrict = value => object$1(value) && !(not(value) || array(value));

const float = value => number(value) && !integer(value);
const nan = value => number(value) && isNaN(value);

const positive = value => integer(value) && value >= 0;

const Is = {
  nonobject,
  empty,
  emptyarray,
  emptyobject,
  emptystring,
  float,
  object: object$1, 
  undefined: undefined$1,
  boolean,
  number,
  integer,
  string,
  array,
  instanceOf,
  defined,
  method,
  nan,
  nil,
  not, 
  objectStrict,
  positive,
};

class Property {}

Object.defineProperties(Property.prototype, {
  modularPropertyTypeIds: { 
    get: function() { 
      if (Is.undefined(this.__modularPropertyTypeIds)) {
        const ids = Object.keys(this.propertyTypes);
        this.__modularPropertyTypeIds = ids.filter(id => 
          this.propertyTypes[id].modular
        );
      }
      return this.__modularPropertyTypeIds 
    }
  },
  orDefault: { value: function(property) {
    const { value, type } = property;
    return Is.defined(value) ? value : this.propertyTypeDefault(value, type)
  }},
  property_types: { // deprecated 
    get: function() {
      console.warn(Errors.deprecation.property_types);
      return this.propertyTypes
    }
  },
  propertyType: { value: function(type) { return this.propertyTypes[type] } },
  propertyTypeDefault: {
    value: function(type) {
      if (!Is.string(type) || Is.empty(type)) return
      
      const property_type = this.propertyType(type);
      if (!Is.object(property_type)) return
      
      if (Is.defined(property_type.value)) return property_type.value
      if (property_type.type) return new property_type.type()
    }
  },
  propertyTypes: { 
    value: {
      number: {
        type: Number,
        value: 0,
      },
      integer: {
        type: Number,
        value: 0,
      },
      rgba: {
        type: String,
        value: '#000000FF',
      },
      rgb: {
        type: String,
        value: '#000000',
      },
      font: {
        type: String,
        value: 'com.moviemasher.font.default',
        modular: true,
      },
      fontsize: {
        type: Number,
        value: 13,
      },
      direction4:{
        type: Number,
        values: [
          { id: 0, identifier: 'top', label: 'Top'},
          { id: 1, identifier: 'right', label: 'Right'},
          { id: 2, identifier: 'bottom', label: 'Bottom'},
          { id: 3, identifier: 'left', label: 'Left'},
        ],
        value: 0,
      },
      direction8:{
        type: Number,
        values: [
          { id: 0, identifier: "top", label: "Top"},
          { id: 1, identifier: "right", label: "Right"},
          { id: 2, identifier: "bottom", label: "Bottom"},
          { id: 3, identifier: "left", label: "Left"},
          { id: 4, identifier: "top_right", label: "Top Right"},
          { id: 5, identifier: "bottom_right", label: "Bottom Right"},
          { id: 6, identifier: "bottom_left", label: "Bottom Left"},
          { id: 7, identifier: "top_left", label: "Top Left"},
        ],
        value: 0,
      },
      string: {
        type: String,
        value: '',
      },
      pixel: {
        type: Number,
        value: 0.0,
      },
      mode: {
        type: String,
        value: 'normal',
        values: [
          {id: "burn", composite: "color-burn", label: "Color Burn"},
          {id: "dodge", composite: "color-dodge", label: "Color Dodge"},
          {id: "darken", composite: "darken", label: "Darken"},
          {id: "difference", composite: "difference", label: "Difference"},
          {id: "exclusion", composite: "exclusion", label: "Exclusion"},
          {id: "hardlight", composite: "hard-light", label: "Hard Light"},
          {id: "lighten", composite: "lighter", label: "Lighten"},
          {id: "multiply", composite: "multiply", label: "Multiply"},
          {id: "normal", composite: "normal", label: "Normal"},
          {id: "overlay", composite: "overlay", label: "Overlay"},
          {id: "screen", composite: "screen", label: "Screen"},
          {id: "softlight", composite: "soft-light", label: "Soft Light"},
          {id: "xor", composite: "xor", label: "Xor"},
        ]
      },
      text: {
        type: String,
        value: '',
      },
    },
  }
});

const PropertyInstance = new Property;

const Colors = {
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

class Context {
  createDrawing(width, height) {
    const context = this.createVideo();
    if (1 <= width) context.canvas.width = width;
    if (1 <= height) context.canvas.height = height;
    return context
  }

  createDrawingLike(drawing) {
    return this.createDrawing(drawing.canvas.width, drawing.canvas.height)
  }

  createAudio() { 
    const klass = window.AudioContext || window.webkitAudioContext;
    if (!klass) return
    
    return new klass
  } 

  createCanvas() { 
    return document && document.createElement("canvas") 
  }
  
  createVideo(canvas) { 
    const element = canvas || this.createCanvas();
    return element && element.getContext("2d") 
  }
}

const ContextFactoryInstance = new Context;

function Id() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => {
    const array = new Uint8Array(1);
    return  (c ^ crypto.getRandomValues(array)[0] & 15 >> c / 4).toString(16)
  })
}

const fromPoint = (pt, width) => pt.y * width + pt.x;

const toPoint = (index, width) => {
  return { x: index % width, y: Math.floor(index / width) }
};

const toIndex = pixel => pixel * 4;

const rgbAtIndex = (index, pixels) => {
  if (index < 0) return
  if (index > pixels.length - 4) return

  return {
    r: pixels[index], g: pixels[index + 1],
    b: pixels[index + 2], a: pixels[index + 3],
  }
};

const rgb = (pixel, data) => rgbAtIndex(toIndex(pixel), data);

const safePixel = (pixel, x_dif, y_dif, width, height) => {
  const pt = toPoint(pixel, width);
  pt.x = Math.max(0, Math.min(width - 1, pt.x + x_dif));
  pt.y = Math.max(0, Math.min(height - 1, pt.y + y_dif));
  return fromPoint(pt, width)
};

const safePixels = (pixel, width, height, size = 3) => {
  const pixels = [];
  const half_size = Math.floor(size / 2);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      pixels.push(safePixel(pixel, x - half_size, y - half_size, width, height));
    }
  }
  return pixels
};

const rgbs = (pixel, data, width, height, size) => {
  return safePixels(pixel, width, height, size).map(pixel => rgb(pixel, data))
};

const color = (value) => {
  const string = String(value);
  if (string.slice(0, 2) === "0x") return "#" + string.slice(2)

  return string
};

const Pixel = {
  color,
  rgbAtIndex,
  rgbs,
};

const unlessInstanceOf = (object, klass, error) => {
  if (!Is.instanceOf(object, klass)) throw error || Errors.wrongClass + klass.name
};

const Throw = {
  unlessInstanceOf,
};

const greatestCommonDenominator = (a, b) => {
    var t;
    while (b !== 0) {
      t = b;
      b = a % b;
      a = t;
    }
    return a
};
  
const lowestCommonMultiplier = (a, b) => { return (a * b / greatestCommonDenominator(a, b)) };

class Time {
  static get zero() { return new Time }

  static scaleTimes(time1, time2, rounding = "round") {
    if (time1.fps === time2.fps) return [time1, time2]

    var gcf = lowestCommonMultiplier(time1.fps, time2.fps);
    return [
      time1.scale(gcf, rounding),
      time2.scale(gcf, rounding)
    ]
  }
  
  constructor(frame = 0, fps = 1) {
    if (!Is.integer(frame) || frame < 0) throw(Errors.frame)
    if (!Is.integer(fps) || fps < 1) throw(Errors.fps)
    
    this.frame = frame;
    this.fps = fps;
  }

  add(time) {
    const [time1, time2] = Time.scaleTimes(this, time);
    return new Time(time1.frame + time2.frame, time1.fps)
  }

  addFrames(frames) {
    const time = this.copy;
    time.frame += frames;
    return time 
  }

  get copy() { return new Time(this.frame, this.fps) }

  get description() { return `${this.frame}@${this.fps}` }

  divide(number, rounding = "round") {
    if (!Is.number(number)) throw(Errors.argument)
    return new Time(Math[rounding](Number(this.frame) / number), this.fps)
  }
  
  equalsTime(time) {
    if (!(time instanceof Time)) throw(Errors.time)

    const [time1, time2] = Time.scaleTimes(this, time);
    return time1.frame === time2.frame
  }

  min(time) {
    if (! time instanceof Time) throw(Errors.time)
    
    const [time1, time2] = Time.scaleTimes(this, time);
    return new Time(Math.min(time1.frame, time2.frame), time1.fps)
  } 

  scale(fps = 1, rounding = "round") {
    if (this.fps === fps) return this
    //const scale = Number(this.fps) / Number(fps)
    const frame = Number(this.frame / this.fps) * Number(fps);
    return new Time(Math[rounding](frame), fps)
  }

  get seconds() { return Number(this.frame) / Number(this.fps) }
  
  subtract(time) {
    if (! time instanceof Time) throw(Errors.argument)
    const [time1, time2] = Time.scaleTimes(this, time);
  
    var subtracted = time2.frame;
    if (subtracted > time1.frame) {
      subtracted -= subtracted - time1.frame;
    }
    return new Time(time1.frame - subtracted, time1.fps)
  }

  subtractFrames(frames) {
    const time = this.copy;
    time.frame -= frames;
    return time 
  }

  toString() { return `[${this.description}]` }

  withFrame(frame) { 
    const time = this.copy;
    time.frame = frame;
    return time 
  }
}

class TimeFactory {
    static createFromFrame(frame, fps) {
        return new Time(frame, fps);
    }
    static createFromSeconds(seconds = 0, fps = 1, rounding = 'round') {
        if (!Is.number(seconds) || seconds < 0)
            throw Errors.seconds;
        if (!Is.integer(fps) || fps < 1)
            throw Errors.fps;
        const rounded = this.roundingFunction(rounding)(seconds * fps);
        return this.createFromFrame(rounded, fps);
    }
    static roundingFunction(rounding = 'round') {
        switch (rounding) {
            case 'ceil': return Math.ceil;
            case 'floor': return Math.floor;
            default: return Math.round;
        }
    }
}

class TimeRange extends Time {
  constructor(frame = 0, fps = 1, frames = 1) {
    if (!(Is.integer(frames) && frames >= 0)) {
      throw(frames)
    }
    super(frame, fps);
    this.frames = frames;
  }

  get description() { return `${this.frame}-${this.frames}@${this.fps}` }
  get end() { return this.frame + this.frames }
  get endTime() { return TimeFactory.createFromFrame(this.end, this.fps) }
  get lengthSeconds() { return Number(this.frames) / Number(this.fps) }
  get position() { return  Number(this.frame) / Number(this.frames) }
  get startTime() { return TimeFactory.createFromFrame(this.frame, this.fps) }
  get copy() {
    return new TimeRange(this.frame, this.fps, this.frames)
  }

  scale(fps = 1, rounding = "round") {
    if (this.fps === fps) return this.copy

    const value = Number(this.frames) / (Number(this.fps) / Number(fps));
    const time = super.scale(fps, rounding);
    return new TimeRange(time.frame, time.fps, Math.max(1, Math[rounding](value)))
  }

  intersects(timeRange) {
    const [range1, range2] = Time.scaleTimes(this, timeRange);

    if (range1.frame >= range2.end) return false

    return range1.end > range2.frame
  }

  minEndTime(endTime) {
    const [range, time] = Time.scaleTimes(this, endTime);
    range.frames = Math.min(range.frames, time.frame);
    return range
  }

  withFrame(frame) {
    const range = this.copy;
    range.frame = frame;
    return range
  }

  withFrames(frames) {
    const range = this.copy;
    range.frames = frames;
    return range
  }

}

const findBy = (array, object, key = 'id') => {
  if (! Is.array(array)) throw(Errors.array)
  if (Is.undefined(key)) throw(Errors.argument)

  const value = Is.object(object) ? object[key] : object;
  if (Is.undefined(value)) throw(Errors.argument)
  return array.find(item => item[key] === value)
};

const deleteFromArray = (array, value) => {
  const is_array = Is.array(array);
  const include = is_array && array.includes(value);
  if (include) array.splice(array.indexOf(value), 1);
};


const keyShouldBeCopied = (key) => {
  return key.substr(0,1) !== '$'
};
const deepCopy = (ob1, ob2) => {
  if (Is.object(ob1)){
    if (Is.undefined(ob2)) ob2 = {};
    for (var key in ob1) {
      if (keyShouldBeCopied(key)){
        const value1 = ob1[key];
        if (Is.object(value1)) {
          if (Is.array(value1)) ob2[key] = [...value1];
          else ob2[key] = deepCopy(value1, ob2[key]);
        } else ob2[key] = value1;
      }
    }
  }
  return ob2
};

const capitalize = value => {
  const string = Is.string(value) ? value : String(value);
  if (Is.emptystring(string)) return string

  return `${string[0].toUpperCase()}${string.substr(1)}`
};

const Utilities = {
  findBy,
  deleteFromArray,
  keyShouldBeCopied,
  deepCopy,
  capitalize,
};

class Base {
  constructor(object = {}) {
    if (!Is.objectStrict(object)) throw Errors.object

    this.object = object;
  }

  toJSON() { return this.object }

  toString() { return `[${this.constructor.name}]` }
}

class Action {
  constructor(object) {
    if (!Is.objectStrict(object)) throw Errors.argument + object

    const keys = Object.keys(object);
    const entries = keys.map(key => [key, { value: object[key] }]);
    Object.defineProperties(this, Object.fromEntries(entries));
  }

  get events() { return this.mash.events }

  get selectedClips() { 
    if (this.done) return this.redoSelectedClips

    return this.undoSelectedClips
  }

  get selectedEffects() { 
    if (this.done) return this.redoSelectedEffects
    
    return this.undoSelectedEffects
  }
  
  redo() {
    this.redoAction();
    this.done = true;
    this.events && this.events.emit(EventType.action, { action: this } );
  }

  redoAction() {} 

  undo() {
    this.undoAction();
    this.done = false;
    this.events && this.events.emit(EventType.action, { action: this } );
  }

  undoAction() {}
}

class AddTrackAction extends Action {
  redoAction(){
    this.mash.addTrack(this.trackType);
  }

  undoAction() {
    this.mash.removeTrack(this.trackType);
  }
}

class ChangeAction extends Action {
  constructor(object) {
    const redoValue = object.redoValue;
    delete object.redoValue;
    super(object);
    this.__redoValue = redoValue;
  }

  get redoValue() { return this.__redoValue }

  redoAction() {
    this.target[this.property] = this.redoValue;
  }

  undoAction() {
    this.target[this.property] = this.undoValue;
  }

  updateAction(redoValue) {
    this.__redoValue = redoValue;
    this.redo();
  }
}

class FreezeAction extends Action {
  redoAction() {
    this.trackClips.splice(this.index, 0, this.insertClip, this.frozenClip);
    this.freezeClip.frames -= this.frames;
  }

  undoAction() {
    this.freezeClip.frames += this.frames;
    this.trackClips.splice(this.index, 2);
  }
}

class ChangeFramesAction extends ChangeAction {
  redoAction() {
    this.mash.changeClipFrames(this.target, this.redoValue);
  }

  undoAction() {
    this.mash.changeClipFrames(this.target, this.undoValue);
  }
}

class ChangeTrimAction extends ChangeAction {
  redoAction() {
    this.mash.changeClipTrim(this.target, this.redoValue, this.frames + this.undoValue);
  }

  undoAction() {
    this.mash.changeClipTrim(this.target, this.undoValue, this.frames + this.undoValue);
  }
}

class AddEffectAction extends Action {
  redoAction() { this.effects.splice(this.index, 0, this.effect); }
  
  undoAction() { Utilities.deleteFromArray(this.effects, this.effect); }
}

class AddClipToTrackAction extends AddTrackAction {
  get clips() { return this.track.clips }

  get track() { return this.mash[this.trackType][this.trackIndex] }

  redoAction() {
    // create track if needed
    for (let i = 0; i < this.createTracks; i++) { super.redoAction(); } 
    this.mash.addClipsToTrack([this.clip], this.trackIndex, this.insertIndex);
  }

  undoAction() {
    this.mash.removeClipsFromTrack([this.clip]);
    for (let i = 0; i < this.createTracks; i++) { super.undoAction(); } 
  }
}

class MoveClipsAction extends Action {
  addClips(trackIndex, insertIndex) {
    this.mash.addClipsToTrack(this.clips, trackIndex, insertIndex);
  }

  redoAction() {
    if (this.redoFrames) {
      this.clips.forEach((clip, index) => clip.frame = this.redoFrames[index]);
    }
    this.addClips(this.trackIndex, this.insertIndex);
  }

  undoAction() {
    if (this.undoFrames) {
      this.clips.forEach((clip, index) => clip.frame = this.undoFrames[index]);
    }
    this.addClips(this.undoTrackIndex, this.undoInsertIndex);
  }
}

const track = { 
  track: { 
    get: function() { 
      if (Is.undefined(this.__track)) {
        const track = this.object.track; 
        this.__track = Is.defined(track) ? track : -1;
      }
      return this.__track 
    },
    set: function(value) { this.__track = value; }
  }, 
};

class RemoveClipsAction extends Action {
  get trackIndex() { return track.index }

  redoAction() {
    this.mash.removeClipsFromTrack(this.clips);
  }

  undoAction() {
    this.mash.addClipsToTrack(this.clips, this.trackIndex, this.index);
  }
}

class SplitAction extends Action {
  redoAction() {
    this.trackClips.splice(this.index, 0, this.insertClip);
    this.splitClip.frames = this.redoFrames;
  }

  undoAction() {
    this.splitClip.frames = this.undoFrames;
    this.trackClips.splice(this.index, 1);
  }
}

class MoveEffectsAction extends Action {
  redoAction() {
    this.effects.splice(0, this.effects.length, ...this.redoEffects);
  }

  undoAction() {
    this.effects.splice(0, this.effects.length, ...this.undoEffects);
  }
}

class Actions extends Base {
  constructor(object) {
    super(object);
    
    this.actions = [];
    this.index = -1;
  }

  get canRedo() { return this.index < this.actions.length - 1 }

  get canUndo() { return this.index > -1 }

  get currentAction() { return this.actions[this.index] }

  get currentActionLast() { return this.canUndo && !this.canRedo }

  get mash() { return this.object.mash }

  // TODO: remove
  get masher() { return this.object.masher }

  do(action) {
    if (!Is.instanceOf(action, Action)) throw(Errors.action)

    action.actions = this;
    const remove = this.actions.length - (this.index + 1);
    const removed = remove ? this.actions.splice(this.index + 1, remove) : [];
    
    this.actions.push(action);
    this.redo();
    return removed
  }

  redo() {
    this.index ++;
    const action = this.currentAction;
    action.redo();
    return action
  }

  undo(){
    const action = this.currentAction;
    this.index--;
    action.undo();
    return action
  }
}

const id$1 = { 
  id: { get: function() { return this.__id ||= this.initializeId } },
  initializeId: { get: function() { return this.object.id || Id() } },
};

/* eslint-disable no-unused-vars */
class Factory {
    constructor(baseClass) {
        this.baseClass = baseClass || Base;
        this.classesByType = new Map();
    }
    typeClass(type) {
        const typedClass = this.classesByType.get(type);
        if (!typedClass)
            return this.baseClass;
        return typedClass;
    }
    create(type) {
        if (typeof type === "string")
            return this.createFromType(type);
        return this.createFromObject(type);
    }
    createFromObject(object) {
        if (!Is.object(object))
            throw Errors.object;
        const Klass = this.typeClass(object.type);
        if (Is.instanceOf(object, Klass))
            return object;
        return new Klass(object);
    }
    createFromType(type) {
        const Klass = this.typeClass(type);
        return new Klass({ type });
    }
    install(type, klass) { this.classesByType.set(type, klass); }
}

const label = { label: { get: function() { return this.object.label } } };

const object = { 
  property: { value: function(key) { return this[key] || this.object[key] } },
  
};

const toJSONFromObject = {
  toJSON: { value: function() { return this.object } },
};

const sharedMedia = {
  ...object,
  ...toJSONFromObject,
  ...id$1,
  ...label,
  properties: { 
    get: function() { 
      if (Is.undefined(this.__properties)) this.__properties = this.propertiesInitialize; 
      return this.__properties 
    }
  },
  propertyNames: { get: function() { return Object.keys(this.properties) } },
  propertiesInitialize: { 
    get: function() {
      const object = { label: { type: 'string' } };
      if (this.propertiesTiming) Object.assign(object, this.propertiesTiming);
      if (this.propertiesAudible) Object.assign(object, this.propertiesAudible);
      if (this.propertiesModular) Object.assign(object, this.propertiesModular);
      return object
    }
  },
  source: { get: function() { return this.object.source } },
  initializeInstance: { value: function(clip, object) {
    const properties = this.properties; 
    if (!Is.object(properties) || Is.empty(properties)) return

    const names = this.propertyNames.filter(name => !Reflect.has(clip, name));
    if (!Is.emptyarray(names)) {
      const entries = names.map(name => [name, { 
        get: function() { 
          const key = `__${name}`;
          if (Is.undefined(this[key])) {
            const property = properties[name];
            this[key] = PropertyInstance.orDefault(property);
            //console.log("initialized", key, this[key])
          }
          return this[key]
        },
        set: function(value) { this[`__${name}`] = value; }
      }]);
      Object.defineProperties(clip, Object.fromEntries(entries));
      this.propertyNames.forEach(name => {
        if (Is.defined(object[name])) clip[name] = object[name];
      });
    }
  }},
};

class AudioProcessor extends Base {
  get audioContext() { return this.object.audioContext }
  
  process(url, buffer) {
    return new Promise((resolve, reject) => {
      return this.audioContext.decodeAudioData(
        buffer, 
        audioData => resolve(audioData), 
        error => reject(error)
      ) 
    })
  }
}

class Cache {
  constructor() {
    this.__cached_urls = {};
    this.__urls_by_md5 = {};
  }

  add(url, value){
    const key = this.key(url);
    // console.log("Cache.add", url, key)
    this.__cached_urls[key] = value;
    this.__urls_by_md5[key] = url;
  }

  cached(url) { return !!this.get(url) }

  get(url) { 
    const key = this.key(url);
    // console.log("Cache.get", url, key)
    return this.__cached_urls[key] 
  }

  key(url) {
    if(!(Is.string(url) && !Is.empty(url))) throw Errors.url + url
    return url
  }

  remove(url) {
    const key = this.key(url);
    // console.log("Cache.get", url, key)
    delete this.__cached_urls[key];
    delete this.__urls_by_md5[key];
  }
  urls() { return Object.values(this.__urls_by_md5) }
}

const CacheInstance = new Cache;

class FontProcessor {
  process(url, buffer) {
    const family = CacheInstance.key(url);
    const font_face = new FontFace(family, buffer);
    const promise = font_face.load();
    promise.then(() => {
      document.fonts.add(font_face);
      return { family }
    });
    return promise
  }
}

class ImageProcessor {
  process(url, buffer) {
    console.log("ImageProcessor.process", url);
  }
}

class ModuleProcessor {
  process(url, buffer) {
    
  }
}

class ProcessorFactory extends Factory {
  constructor() {
    super();
    this.install(LoadType.audio, AudioProcessor);
    this.install(LoadType.font, FontProcessor);
    this.install(LoadType.image, ImageProcessor);
    this.install(LoadType.module, ModuleProcessor);
  }
}

const ProcessorFactoryInstance = new ProcessorFactory;

class Loader extends Base {
  constructor(object) {
    super(object);
    // console.log("Loader", this.object)
    this.promises = {};
  }

  get type() { return this.object.type }

  loadedUrl(url) { return CacheInstance.cached(url) }

  loadedUrls(urls) { return urls.every(url => this.loadedUrl(url)) }

  loadUrl(url) {
    if (this.promises[url]) return this.promises[url]
    if (CacheInstance.cached(url)) return Promise.resolve(CacheInstance.get(url))

    const promise = this.requestUrl(url);
    this.promises[url] = promise;
    return promise.then(processed => {
      // console.log(this.constructor.name, "loadUrl", processed.constructor.name)
      CacheInstance.add(url, processed);
      delete this.promises[url];
      return processed
    })
  }

  loadUrls(urls) {
    return Promise.all(urls.map(url => this.loadUrl(url)))
  }
}

class AudioLoader extends Loader {
  constructor(object) {
    super(object);
    this.object.type ||= LoadType.audio;
  }

  get audioContext() { return this.object.audioContext }
  set audioContext(value) { this.object.audioContext = value; }

  async requestUrl(url) {
    return fetch(url).then(response => {
      console.log("AudioLoader.requestUrl fetch", url, response.constructor.name);
      return response.arrayBuffer()
    }).then(loaded => {
      console.log("AudioLoader.requestUrl arrayBuffer", url, loaded.constructor.name);
      const options = { type: this.type, audioContext: this.audioContext };
      const processor = ProcessorFactoryInstance.createFromObject(options);
      return processor.process(url, loaded)
    })
  }
}

class FontLoader extends Loader {
  constructor(object) {
    super(object);
    this.object.type ||= LoadType.font;
  }

  async requestUrl(url) {
    // console.log("FontLoader.requestUrl", url)
    
    return fetch(url).then(response => {
      // console.log("FontLoader.requestUrl fetch", url, response.constructor.name)
      return response.arrayBuffer()
    }).then(loaded => {
      // console.log("FontLoader.requestUrl arrayBuffer", url, loaded.constructor.name)
      const processor = ProcessorFactoryInstance.create(this.type);
      return processor.process(url, loaded)
    })
  }
}

class ImageLoader extends Loader {
  constructor(object) {
    super(object);
    this.object.type ||= LoadType.image;
  }
  
  requestUrl(url) {
    // console.log("ImageLoader.requestUrl", url)
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = event => resolve(event.target);
      image.onerror = event => reject(event);
      image.crossOrigin = "Anonymous";
      image.src = url;  
      return image
    })
  }
}

class ModuleLoader extends Loader {
  constructor(object) {
    super(object);
    this.object.type ||= LoadType.module;
  }
  requestUrl(url) { return Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespace(require(url)); }) }
}

class LoaderFactory extends Factory {
  constructor() {
    super();
    this.install(LoadType.audio, AudioLoader);
    this.install(LoadType.font, FontLoader);
    this.install(LoadType.image, ImageLoader);
    this.install(LoadType.module, ModuleLoader);
  }
}

const LoaderFactoryInstance = new LoaderFactory;

class UrlsByType {
  static get none() { return UrlsByTypeNone }

  constructor() { this.loaders = {}; }

  get loaded() { return this.urls.every(url => CacheInstance.cached(url)) }

  get urls() { return LoadTypes.flatMap(type => this[type]) }

  get urlsUnloaded() { return this.urls.filter(url => !CacheInstance.cached(url)) }

  concat(object) {
    if (!Is.instanceOf(object, UrlsByType)) {
      console.warn(this.constructor.name, "concat", object);
      return
    }
    LoadTypes.forEach(type => {
      const urls = this[type];
      urls.splice(0, urls.length, ...new Set([...urls, ...object[type]]));
    });
  }

  load(audioContext) {
    const promises = LoadTypes.flatMap(type => {
      const urls = this[type];
      if (urls.length === 0) return []

      if (Is.undefined(this.loaders[type])) {
        const options = { type: type, audioContext: audioContext };
        this.loaders[type] = LoaderFactoryInstance.createFromObject(options);
      }
      return this.loaders[type].loadUrls(urls)
    });
    if (promises.length) {
      // console.log(this.constructor.name, "load", promises.length)
      return Promise.all(promises)
    }

    // console.log(this.constructor.name, "load resolved")

    return Promise.resolve()
  }

}

const definition$1 = Object.fromEntries(LoadTypes.map(type => [type, {
  get: function() {
    const key = `__${type}`;
    if (Is.undefined(this[key])) this[key] = [];
    return this[key]
  }
}]));
Object.defineProperties(UrlsByType.prototype, definition$1);
const UrlsByTypeNone = new UrlsByType;

const inaudible$1 = {
  audible: { value: false },
  urlsAudibleInTimeRangeForClipByType: {
    value: function() { return UrlsByType.none }
  },
};

const visibleMedia = { 
  visible: { value: true },
  trackType: { value: TrackType.video },
};

const propertiesModular = { 
  propertiesModular: { 
    get: function() { 
      if (Is.undefined(this.__propertiesModular)) {
        this.__propertiesModular = this.object.properties || {};
      }
      return this.__propertiesModular 
    }
  }, 
  modularPropertiesByType: {
    get: function() {
      if (Is.undefined(this.__modularPropertiesByType)) {
        this.__modularPropertiesByType = this.initializeModularPropertiesByType;
      }
      return this.__modularPropertiesByType
    }
  },
  initializeModularPropertiesByType: {
    get: function() {
      const object = {};
      PropertyInstance.modularPropertyTypeIds.forEach(type => {
        Object.keys(this.propertiesModular).forEach(property => {
          if (type === this.propertiesModular[property].type) {
            object[type] ||= [];
            object[type].push(property);
          }
        });
      });
      return object
    }
  },
};

const modular = { 
  modular: { value: true },
  ...propertiesModular,
};

const parameters = {
  parameters: { get: function() { return this.object.parameters } },
};

function CoreFilter() {}

Object.defineProperties(CoreFilter.prototype, {
  scopeSet: { value: function() {}},
  draw: { value: function(evaluator) { return evaluator.context } },
});

const array_key = (array, value, key, id_key) => {
  return Utilities.findBy(array, value, id_key)[key];
};

class BlendFilter extends CoreFilter {
  draw(evaluator, evaluated, outputContext) {
    const context = evaluator.context;
    
    const mode = array_key(PropertyInstance.propertyTypes.mode.values, evaluated.all_mode, 'composite');
    outputContext.globalCompositeOperation = mode;
    outputContext.drawImage(context.canvas, 0, 0);
    outputContext.globalCompositeOperation = 'normal';
    return outputContext
  }
}
const BlendFilterInstance = new BlendFilter;

class ChromaKeyFilter extends CoreFilter {
  get parameters() { 
    return [
      { name: "color", value: "color" },
      { name: "similarity", value: "similarity" },
      { name: "blend", value: "blend" }
    ]
  }

  draw(evaluator, evaluated) {
    const context = evaluator.context;
    const canvas = context.canvas;
    const { width, height } = canvas;
    const { blend, color, similarity, accurate } = evaluated;
    const components = color.substr(4, color.length - 5).split(',');
    const colors = components.map(f => Number(f));
    const rgb = { r: colors[0], g: colors[1], b: colors[2] };
    const yuv = Colors.rgb2yuv(rgb);
    const frame = context.getImageData(0, 0, width, height);
    const pixels = frame.data;
    const yuvs = accurate ? (
      this.yuvsFromPixelsAccurate(pixels, width, height)
    ) : this.yuvsFromPixels(pixels);
    
    let offset = 0;
    yuvs.forEach(matrix => {
      pixels[offset + 3] = Colors.yuv_blend(matrix, yuv, similarity, blend);
      offset += 4;
    });
    context.putImageData(frame, 0, 0);
    return context
  }

  yuvsFromPixelsAccurate(pixels, width, height) {
    let index = pixels.length / 4;
    const array = [];
    while(index--) {
      const offset = index * 4;
      const rgbs = Pixel.rgbs(offset, pixels, width, height);
      array.push(rgbs.map(rgb => Colors.rgb2yuv(rgb)));
    }
    return array
  }

  yuvsFromPixels(pixels) {
    let index = pixels.length / 4;
    const array = [];
    while(index--) {
      const offset = index * 4;
      array.push([Colors.rgb2yuv(Pixel.rgbAtIndex(offset, pixels))]);
    }
    return array
  }
}
const ChromaKeyFilterInstance = new ChromaKeyFilter;

class ColorFilter extends CoreFilter {
  draw(evaluator, evaluated) {
    const { context } = evaluator;
    const { color } = evaluated;
    if (! Is.string(color)) return context

    const { canvas } = context;
    const { width, height } = canvas;

    context.fillStyle = Pixel.color(color);
    context.fillRect(0, 0, width, height);
    return context
  }

  get parameters() { 
    return [
      { name: "color", value: "color" },
      { name: "size", value: "mm_dimensions" },
      { name: "duration", value: "mm_duration" },
      { name: "rate", value: "mm_fps" },
    ]
  }
}
const ColorFilterInstance = new ColorFilter;

class ColorChannelMixerFilter extends CoreFilter {
  draw(evaluator, evaluated) {
    const context = evaluator.context;
    const rgbas = 'rgba'.split('');
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
    width = context.canvas.width;
    height = context.canvas.height;
    image_data = context.getImageData(0, 0, width, height);
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
    context.putImageData(image_data, 0, 0);
    return context
  }
}
const ColorChannelMixerFilterInstance = new ColorChannelMixerFilter;

const RBGA = 'rgba';

const parse = (evaluated) => {
  const result = { bias: {}, rdiv: {}, matrix: {} };
  RBGA.split('').forEach((channel, index) => {
    const matrix = evaluated[`${index}m`].split(' ').map(i => parseInt(i));
    result.matrix[channel] = matrix;
    result.rdiv[channel] = evaluated[`${index}rdiv`] || 1;
    if (String(result.rdiv[channel]).includes('/')) {
      const array = result.rdiv[channel].split('/');
      result.rdiv[channel] = parseFloat(array[0]) / parseFloat(array[1]);
    } else result.rdiv[channel] = parseFloat(result.rdiv[channel]);
    result.bias[channel] = evaluated[`${index}bias`] || 0;
  });
  // console.log(ConvolutionFilter.name, "parse", evaluated, result)
  return result
  
};

const matrix3 = (options, inputData, outputDdata, width, height) => {
  const area = width * height;
  for (let pixel = 0; pixel < area; pixel++) {
    const rgbs = Pixel.rgbs(pixel, inputData, width, height);
    RBGA.split('').forEach((channel, index) => {
      const rdiv = options.rdiv[channel];
      const matrix = options.matrix[channel];
      const bias = options.bias[channel];
      let sum = 0;
      for (let y = 0; y < 9; y++) sum += rgbs[y][channel] * matrix[y];
      
      sum = Math.floor(sum * rdiv + bias + 0.5);
      outputDdata[pixel * 4 + index] = sum;
    });
  }
};

class ConvolutionFilter extends CoreFilter {
 draw(evaluator, evaluated) {
    const options = parse(evaluated);
    const context = evaluator.context;
    const canvas = context.canvas;
    const { width, height } = canvas;
    const input = context.getImageData(0, 0, width, height);
    const output = context.createImageData(width, height);
    matrix3(options, input.data, output.data, width, height);
    context.putImageData(output, 0, 0);
    return context
  }
}

const ConvolutionFilterInstance = new ConvolutionFilter;

class CropFilter extends CoreFilter {
  draw(evaluator, evaluated) {
    const context = evaluator.context;
    const x = evaluated.x || 0;
    const y = evaluated.y || 0;
    const in_width = evaluator.get("mm_input_width");
    const in_height = evaluator.get("mm_input_height");
    let width = evaluated.w || evaluated.out_w;
    let height = evaluated.h || evaluated.out_h;
    if (2 > width + height) throw 'crop.draw invalid output dimensions'
    if (!(in_width && in_height)) throw 'crop.draw invalid input dimensions'
    
    if (-1 === width) width = in_width * (height / in_height);
    if (-1 === height) height = in_height * (width / in_width);

    const drawing = ContextFactoryInstance.createDrawing(width, height);
    drawing.drawImage(context.canvas, x, y, width, height, 0, 0, width, height);
    return [drawing]
  }
  scopeSet(evaluator) {
    const { width, height } = evaluator.context.canvas;
    evaluator.set("in_h", height);
    evaluator.set("mm_input_height", height);
    evaluator.set("in_w", width);
    evaluator.set("mm_input_width", width);
    if (Is.not(evaluator.get("x"))) evaluator.set("x", '((in_w - out_w) / 2)');
    if (Is.not(evaluator.get("y"))) evaluator.set("y", '((in_h - out_h) / 2)');
  }
}

const CropFilterInstance = new CropFilter;

class DrawBoxFilter extends CoreFilter {
  draw(evaluator, evaluated) {
    var context = evaluator.context;
    const color = (Is.undefined(evaluated.color) ? 'black' : evaluated.color);
    const x = evaluated.x || 0;
    const y = evaluated.y || 0;
    const width = evaluated.width || context.canvas.width;
    const height = evaluated.height || context.canvas.height;

    context.fillStyle = Pixel.color(color);
    context.fillRect(x, y, width, height);
    return context
  }
}

const DrawBoxFilterInstance = new DrawBoxFilter;

const mm_fontfile = font_id => ModuleInstance.fontById(font_id).source;
const mm_textfile = text => text;
const mm_fontfamily = font_id => CacheInstance.key(mm_fontfile(font_id));

class DrawTextFilter extends CoreFilter {
  get parameters() {
    return [
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
        "value":"mm_fontfile('com.moviemasher.font.default')"
      },{
        "name": "textfile",
        "value":"Hello World"
      }
    ]
  }

  draw(evaluator, evaluated) {
    // console.log(this.constructor.name, "draw", evaluator, evaluated)
    const context = evaluator.context;
    const family = mm_fontfamily(evaluator.get("fontface"));
    const { x, y, fontsize, fontcolor, text, textfile, shadowcolor } = evaluated;

    if (shadowcolor) {
      context.shadowColor = shadowcolor;
      const { shadowx, shadowy/*, shadowblur */ } = evaluated;
      // shadowblur not supported in ffmpeg
      // context.shadowBlur = shadowblur
      context.shadowOffsetX = shadowx || 0;
      context.shadowOffsetY = shadowy || 0;
    }

    context.font = `${fontsize}px "${family}"`;
    context.fillStyle = Pixel.color(fontcolor);
    context.fillText(text || textfile, x, Number(y) + Number(fontsize));

    if (shadowcolor) {
      context.shadowColor = null;
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
      // context.shadowBlur = 0
    }
    return context
  }
  scopeSet(evaluator) {
    evaluator.set("text_w", 0); // width of the text to draw
    evaluator.set("text_h", 0); // height of the text to draw
    evaluator.set("mm_fontfamily", mm_fontfamily);
    evaluator.set("mm_textfile", mm_textfile);
    evaluator.set("mm_fontfile", mm_fontfile);
  }
}

const DrawTextFilterInstance = new DrawTextFilter;

class FadeFilter extends CoreFilter{
  draw(evaluator) {
    const context = evaluator.context;
    const drawing = ContextFactoryInstance.createDrawingLike(context);
    drawing.globalAlpha = evaluator.get("mm_t");
    drawing.drawImage(context.canvas, 0, 0);
    drawing.globalAlpha = 1;
    return drawing
  }
}
const FadeFilterInstance = new FadeFilter;

class OverlayFilter extends CoreFilter {
  draw(evaluator, evaluated, outputContext) {
    if (Is.undefined(outputContext)) return

    const { context } = evaluator;    
    const { canvas } = context;
    const { x, y } = evaluated;
    outputContext.drawImage(canvas, x, y);
    return outputContext
  }
  scopeSet(evaluator) {
    const { context } = evaluator;
    if (Is.undefined(context)) throw Errors.internal + evaluator.constructor.name
    const { width, height } = context.canvas;
    evaluator.set("overlay_w", width);
    evaluator.set("overlay_h", height);
    
  }
}
const OverlayFilterInstance = new OverlayFilter;

class ScaleFilter extends CoreFilter {
  draw(evaluator, evaluated) {
    const context = evaluator.context;
    let width = evaluated.w || evaluated.width;
    let height = evaluated.h || evaluated.height;

    if (2 > width + height) return context
    
    const in_width = evaluator.get("mm_input_width");
    const in_height = evaluator.get("mm_input_height");
    if (-1 === width) width = in_width * (height / in_height);
    else if (-1 === height) height = in_height * (width / in_width);

    const drawing = ContextFactoryInstance.createDrawing(width, height);
    
    drawing.drawImage(context.canvas, 0, 0, in_width, in_height, 0, 0, width, height);
  
    return drawing
  }

  scopeSet(evaluator) {
    const { context } = evaluator;
    if (!context) throw 'context'
    const { canvas } = context;

    if (!canvas) throw 'canvas'

    const { width, height } = canvas;
    evaluator.set("in_h", height);
    evaluator.set("mm_input_height", height);
    evaluator.set("in_w", width);
    evaluator.set("mm_input_width", width);
  }
}
const ScaleFilterInstance = new ScaleFilter;

class SetSarFilter extends CoreFilter {}
const SetSarFilterInstance = new SetSarFilter;

const FilterTypes = [
  "blend",
  "chromakey",
  "colorchannelmixer",
  "color",
  "convolution",
  "crop",
  "drawbox",
  "drawtext",
  "fade",
  "overlay",
  "scale",
  "setsar",
];
const FilterType = Object.fromEntries(FilterTypes.map(type => [type, type]));

class FilterFactory extends Factory {
  constructor() {
    super();
    this.install(FilterType.blend, BlendFilterInstance);
    this.install(FilterType.chromakey, ChromaKeyFilterInstance);
    this.install(FilterType.colorchannelmixer, ColorChannelMixerFilterInstance);
    this.install(FilterType.color, ColorFilterInstance);
    this.install(FilterType.convolution, ConvolutionFilterInstance);
    this.install(FilterType.crop, CropFilterInstance);
    this.install(FilterType.drawbox, DrawBoxFilterInstance);
    this.install(FilterType.drawtext, DrawTextFilterInstance);
    this.install(FilterType.fade, FadeFilterInstance);
    this.install(FilterType.overlay, OverlayFilterInstance);
    this.install(FilterType.scale, ScaleFilterInstance);
    this.install(FilterType.setsar, SetSarFilterInstance);
  }

  create(type) { return this.typeClass(type) }

  createFromObject(object) { return this.create(object.id) }
}

Object.defineProperties(FilterFactory.prototype, {
  type: { value: FilterType },
  types: { value: FilterTypes },
});

const FilterFactoryInstance = new FilterFactory;

const drawFilters = {
  drawFilters: { value: function(evaluator, context) {
    // console.log(this.constructor.name, this.id, "draw", evaluator)
    this.coreFilter.scopeSet(evaluator);
    return this.coreFilter.draw(evaluator, this.evaluateScope(evaluator), context)
  }}
};

class Media extends Base {}

class FilterMedia extends Media {}

Object.defineProperties(FilterMedia.prototype, {
  type: { value: MediaType.filter },
  ...sharedMedia,
  ...modular,
  ...parameters,
  coreFilter: {
    get() {
      if (Is.undefined(this.__coreFilter)) {
        this.__coreFilter = FilterFactoryInstance.create(this.id);
        Throw.unlessInstanceOf(this.__coreFilter, CoreFilter);
      }
      return this.__coreFilter
    }
  },
  evaluateScope: {
    value(evaluator) {
      const evaluated = {};
      const definitions = this.parameters || this.coreFilter.parameters;
      if (Is.not(definitions)) return evaluated

      definitions.forEach(parameter => {
        const { name } = parameter;
        if (Is.not(name)) return

        evaluated[name] = evaluator.evaluate(parameter.value);
        evaluator.set(name, evaluated[name]);
      });
      return evaluated
    }
  },
  ...drawFilters,
});

const filters = { 
  filters: { 
    get: function() { return this.__filters ||= this.filtersInitialize } 
  }, 
  filtersInitialize: { 
    get: function() { 
      const array = this.object.filters || [];
      return array.map(object => new FilterMedia(object))
    }
  }
};

const html = { 
    html: { get: function() { return this.object.html } },
    inspector: { get: function() { return this.object.inspector } },
  };

const urlsFromFilters = {
  urlsVisibleInTimeRangeForClipByType: {
    value: function(timeRange, clip) {
      const urls = new UrlsByType;
      const properties_by_type = this.modularPropertiesByType;
      Object.keys(properties_by_type).forEach(type => {
        const modular_properties = properties_by_type[type];
        modular_properties.forEach(property => {
          const value = clip.property(property);
          // console.log(clip)
          if (Is.defined(value)) {
            const module = ModuleInstance.ofType(value, type);
            if (Is.defined(module)) {
              urls[type].push(module.source);
            }
          } else throw(Errors.unknown.type + type)
        });
      });

      return urls
    }
  },
};

// we no longer load filters - they must be registered or defined in full
// urlsVisibleInTimeRange(timeRange) {
//   const urls = super.urlsVisibleInTimeRange(timeRange)
//   if (Is.array(this.filters)) {
//     this.filters.forEach(filter => {
//       const filter_id = filter.id
//       if (!FilterFactory.created(filter_id)) {
//         // console.log(`!FilterFactory.created(${filter_id})`, filter)
//         const source = filter_config.source
//         if (source) urls.push(source)
//       }
//     })
//   }
//   return urls
// }

const transform$1 = {
  ...filters,
  ...urlsFromFilters,
  ...html,
  ...modular,
};

class EffectMedia extends Media {}

Object.defineProperties(EffectMedia.prototype, {
  type: { value: MediaType.effect },
  ...sharedMedia,
  ...transform$1,
  ...inaudible$1,
  ...visibleMedia,
});

class ScalerMedia extends Media {}

Object.defineProperties(ScalerMedia.prototype, {
  type: { value: MediaType.scaler },
  ...sharedMedia,
  ...transform$1,
  ...inaudible$1,
  ...drawFilters,
});

class MergerMedia extends Media {}

Object.defineProperties(MergerMedia.prototype, {
  type: { value: MediaType.merger },
  ...sharedMedia,
  ...transform$1,
  ...inaudible$1,
  ...drawFilters,
});

const modularFalse = { modular: { value: false } };

const invisible$1 = {
  visible: { value: false },
  urlsVisibleInTimeRangeForClipByType: {
    value: function() { return UrlsByType.none }
  },
};

const duration = { 
  duration: { 
    get: function() { 
      if (Is.undefined(this.__duration)) {
        this.__duration = Number(this.object.duration);
        this.__duration ||= Default.media[this.type].duration; 
      }
      return this.__duration 
    }
  }, 
};

const urlAudible = { 
  urlAudible: { 
    get: function() { 
      return this.object.audio || this.object.url || this.object.source 
    } 
  },
};

const propertiesTiming = {
  propertiesTiming: { value: {
    frame: { type: "number", value: 0 },
    frames: { type: "number", value: 0 },
  }}
};

const propertiesAudible = {
  propertiesAudible: { 
    value: {
      gain: {
        type: "number", value: 1.0,
      },
      trim: {
        type: "integer", value: 0,
      },
    } 
  }
};

const urlsAudible = {
  urlsAudibleInTimeRangeForClipByType: {
    value: function() {
      const urls = new UrlsByType;
      const url = this.urlAudible;
      if (url) urls.audio.push(url);
      return urls
    }
  },
};

const audible$1 = { 
  audible: { value: true },
  ...propertiesAudible,
  ...urlsAudible,
};

class AudioMedia extends Media {}

Object.defineProperties(AudioMedia.prototype, {
  type: { value: MediaType.audio },
  trackType: { value: TrackType.audio },
  ...sharedMedia,
  ...modularFalse,
  ...invisible$1,
  ...duration,
  ...urlAudible,
  ...audible$1,
  ...propertiesTiming,
});

class FontMedia extends Media {}

Object.defineProperties(FontMedia.prototype, {
  type: { value: MediaType.font },
  ...sharedMedia,
  ...filters,
  ...urlsFromFilters,
  ...inaudible$1,
});

const urlAudibleMute = { 
  urlAudible: { 
    get: function() { 
      switch (this.object.audio) {
        case undefined: return this.object.source
        case 0: return
      }
      return this.object.audio
    } 
  },
};

const urlsVisibleFrames = {
  fps: { get: function() { return this.__fps ||= this.object.fps || 10 } },

  framesMax: {
    get: function() { return Math.floor(this.fps * this.duration) }
  },

  begin: { get: function() { return this.__begin ||= this.object.begin || 1 } },

  pattern: {
    get: function() { return this.__pattern ||= this.object.pattern || '%.jpg' }
  },

  increment: {
    get: function() { return this.__increment ||= this.object.increment || 1 }
  },

  zeropadding: {
    get: function() {
      return this.__zeropadding ||= this.zeropaddingInitialize
    }
  },

  zeropaddingInitialize: {
    get: function() {
      const value = this.object.zeropadding;
      if (Is.defined(value)) return value

      const last_frame = this.begin + (this.increment * this.framesMax);
      return String(last_frame).length
    }
  },

  url: { get: function() { return this.__url ||= this.object.url || "" } },

  limitedTimeRange: { value: function(timeRange) {
    return timeRange.minEndTime(TimeFactory.createFromFrame(this.framesMax, this.fps))
  } },

  urlsVisibleInTimeRangeForClipByType: {
    value: function(timeRange, clip) {
      const urls = new UrlsByType;
      const max_frames = this.framesMax;
      const range = this.limitedTimeRange(timeRange);//.scale(this.fps)
      //console.log("range", range)

      let last_frame;
      for (let frame = range.frame; frame < range.end; frame++) {

        const time = TimeFactory.createFromFrame(frame, range.fps);
        const media_time = time.scale(this.fps);

        //console.log(time, media_time)
        if ((frame !== range.frame) && (last_frame === media_time.frame)) {
          continue
        }
        last_frame = media_time.frame;
        last_frame = Math.min(last_frame, max_frames - 1);
        let s = String((Math.min(last_frame, max_frames) * this.increment) + this.begin);
        if (this.zeropadding) s = s.padStart(this.zeropadding, '0');
        const url = (this.url + this.pattern).replaceAll('%', s);
        urls[LoadType.image].push(url);
      }
      return urls
    }
  }
};

class VideoMedia extends Media {}

Object.defineProperties(VideoMedia.prototype, {
  type: { value: MediaType.video },
  ...sharedMedia,
  ...modularFalse,
  ...visibleMedia,
  ...duration,
  ...urlAudibleMute,
  ...urlsVisibleFrames,
  ...audible$1,
  ...propertiesTiming,
});

const urlVisible = { 
  urlVisible: { 
    get: function() { 
      return this.object.url
    } 
  },
};

const urlsVisible = {
  urlsVisibleInTimeRange: { value: function() { return [this.urlVisible] } },
  urlsVisibleInTimeRangeForClipByType: { value: function(timeRange, clip) {
    const urls = new UrlsByType;
    const url = this.urlVisible;
    if (url) urls[LoadType.image].push(url);
    return urls
  }},
};

class ImageMedia extends Media {}

Object.defineProperties(ImageMedia.prototype, {
  type: { value: MediaType.image },
  ...sharedMedia,
  ...modularFalse,
  ...inaudible$1,
  ...visibleMedia,
  ...duration,
  ...propertiesTiming,
  ...urlVisible,
  ...urlsVisible,
});

class ThemeMedia extends Media {}

Object.defineProperties(ThemeMedia.prototype, {
  type: { value: MediaType.theme },
  ...sharedMedia,
  ...modular,
  ...inaudible$1,
  ...visibleMedia,
  ...duration,
  ...filters,
  ...propertiesModular,
  ...propertiesTiming,
  ...html,
  ...urlsFromFilters,
});

const urlsNone = {
  urlsVisibleInTimeRangeForClipByType: {
    value: function() { return UrlsByType.none }
  },
  urlsVisibleInTimeRangeForClipByType: {
    value: function() { return UrlsByType.none }
  },
};

class TransitionMedia extends Media {}

Object.defineProperties(TransitionMedia.prototype, {
  type: { value: MediaType.transition },
  ...sharedMedia,
  ...modular,
  ...inaudible$1,
  ...visibleMedia,
  ...propertiesTiming,
  ...duration,
  ...urlsNone,
});

class MediaFactory extends Factory {
  constructor() {
    super(Media);
    this.install(MediaType.audio, AudioMedia);
    this.install(MediaType.video, VideoMedia);
    this.install(MediaType.image, ImageMedia);
    this.install(MediaType.theme, ThemeMedia);
    this.install(MediaType.effect, EffectMedia);
    this.install(MediaType.scaler, ScalerMedia);
    this.install(MediaType.merger, MergerMedia);
    this.install(MediaType.font, FontMedia);
    this.install(MediaType.transition, TransitionMedia);
  }

  create(object) {
    if (Is.instanceOf(object, Media)) return object

    if (ModuleTypes.includes(object.type)) {
      const module = ModuleInstance.ofType(object.id, object.type);
      if (module) return super.create(module)
    }
    return super.create(object)
  }
}
const MediaFactoryInstance = new MediaFactory();

const createFromArgs = (frame, fps, frames) => new TimeRange(frame, fps, frames);

const createFromSeconds = (start, duration) => createFromArgs(start, 1, duration);

const createFromTime = (time, frames) => (
  createFromArgs(time.frame, time.fps, frames)
);

const createFromTimes = (startTime, endTime) => {
  const [time1, time2] = Time.scaleTimes(startTime, endTime);
  if (time2.frame <= time1.frame) throw Errors.argument

  return createFromArgs(time1.frame, time1.fps, time2.frame - time1.frame)
};

const create = (object = {}) => { 
  if (Is.instanceOf(object, TimeRange)) return object
  if (Is.instanceOf(object, Time)) return createFromTime(object)

  const { frame, fps, frames } = object;
  return createFromArgs(frame, fps, frames) 
};

const TimeRangeFactory = {
  create, createFromSeconds, createFromTime, createFromTimes
};

const toJSON = {
  toJSON: { value: function() {
    const object = { id: this.id, type: this.type, frame: this.frame  };
    if (Is.array(this.effects)) object.effects = this.effects;
    return { ...this.propertyValues, ...object } 
  } }
};

const id = { 
  id: {  get: function() { return this.object.id || this.media.id } }
};

const labelFromObjectOrMedia = { 
  label: { 
    get: function() { return this.__label ||= this.labelInitialize },
    set: function(value) { this.__label = value; }
  },
  labelInitialize: { 
    get: function() { return this.object.label || this.media.label }
  },
};

const media$1 = { 
  media: { 
    get: function() { 
      if (Is.undefined(this.__media)) {
        this.__media = MediaFactoryInstance.create(this.object.media);
      }
      return this.__media 
    }
  }, 
};

const propertyValues = {
  propertyValues: { get: function() {
    // console.log(this.constructor.name, "propertyValues", this.properties)
    return Object.fromEntries(Object.keys(this.properties).map(property => {
      const valueOrTransform = this[property];
      const transform = TransformTypes.includes(property);
      const value = transform ? valueOrTransform.id : valueOrTransform;
      
      return [property, value]
    }))
  }}
};

const propertiesFromMedia = { 
  properties: { get: function() { return this.media.properties } } 
};

const copy$1 = {
  copy: {
    get: function() {
      return new this.constructor({...this.toJSON(), media: this.media })
    }
  }
};

const load = {
  load: { value: function(mashTimeRange) {
    const urls = this.urlsVisibleInTimeRangeByType(mashTimeRange);
    return urls.load()
  }}
};

// clips and transforms
const editable = {
  ...object,
  propertyNames: { get: function() { return Object.keys(this.properties)} },
  properties: {
    get: function() { return this.__properties ||= this.propertiesInitialize }
  },
  propertiesInitialize: {
    get: function() { 
      const object = { ...this.media.properties };
      if (this.propertiesTransform) Object.assign(object, this.propertiesTransform);
      return object
    }
  },
};

const sharedClip = {
  ...editable,
  ...copy$1,
  ...toJSON,
  ...id,
  ...labelFromObjectOrMedia,
  ...track,
  time: {
    value: function(quantize) {
      return TimeFactory.createFromFrame(this.frame, quantize)
    }
  },
  timeRange: {
    value: function(quantize) {
      const options = { frame: this.frame, quantize, frames: this.frames };
      return TimeRangeFactory.create(options)
    }
  },
  timeRangeRelative: {
    value: function(mashTime) {
      const range = this.timeRange(mashTime.fps);
      const frame = mashTime.frame - this.frame;
      if (frame < 0) {
        console.log(this.constructor.name, "timeRangeRelative", mashTime, range);
        return
      }
      return range.withFrame(frame)
    }
  },
  ...media$1,
  ...propertyValues,
  ...propertiesFromMedia,
  ...load,
};

const inaudible = {
  audible: { value: false },
  urlsAudibleInTimeRangeByType: {
    value: function() { return UrlsByType.none }
  },
};

const visibleClip = { 
  visible: { value: true },

  trackType: { value: TrackType.video },

  scaledContextAtTimeForDimensions: {
    value: function(mashTime, dimensions, ...rest) {
      const context = this.contextAtTimeForDimensions(mashTime, dimensions, ...rest);
      // console.log("scaledContextAtTimeForDimensions", context)
      if (!this.scaler) return context

      const clipTimeRange = this.timeRangeRelative(mashTime);
      if (Is.undefined(clipTimeRange)) return
      
      return this.scaler.drawMediaFilters(clipTimeRange, context, dimensions)
    }
  },

  effectedContextAtTimeForDimensions: {
    value: function(mashTime, dimensions, ...rest) {
      let context = this.scaledContextAtTimeForDimensions(mashTime, dimensions, ...rest);
      if (!this.effects) return context

      const clipTimeRange = this.timeRangeRelative(mashTime);
      if (Is.undefined(clipTimeRange)) return
      
      this.effects.reverse().forEach(effect => 
        context = effect.drawMediaFilters(clipTimeRange, context, dimensions)
      );
      return context
    }
  },
  
  mergeContextAtTime: { 
    value: function(mashTime, context, ...rest) { 
      
      if (!this.merger) return context
      const effected = this.effectedContextAtTimeForDimensions(mashTime, context.canvas, ...rest);
      
      const clipTimeRange = this.timeRangeRelative(mashTime);
      if (Is.undefined(clipTimeRange)) return
      
      return this.merger.drawMerger(clipTimeRange, effected, context)
    }
  },
};

const urls = {
  urlsVisibleInTimeRangeByType: { 
    value: function(mashTimeRange) { 
      const range = this.mediaTimeRange(mashTimeRange);
      const urls = this.media.urlsVisibleInTimeRangeForClipByType(range, this); 
      if (this.merger) {
        urls.concat(this.merger.urlsVisibleInTimeRangeByType(range));
      }
      if (this.scaler) {
        urls.concat(this.scaler.urlsVisibleInTimeRangeByType(range));
      }
      if (this.effects) this.effects.forEach(effect => 
        urls.concat(effect.urlsVisibleInTimeRangeByType(range))
      );
      return urls
    }
  },
};

const idMutable = {
  id: { 
    get: function() { return this.__id ||= this.object.id },
    set: function(value) { 
      this.__id = value; 
      this.__media = null;
    }
  }
};

const drawMerger = {
  drawMerger: { value: function(clipTimeRange, inputContext, outputContext) {
    this.media.filters.forEach(filter => {
      filter.drawFilters(this.evaluator(clipTimeRange, inputContext, outputContext.canvas), outputContext);
    });
    return outputContext
  }}
};

const copy = {
  copy: { get: function() { return new this.constructor(this.toJSON()) } }
};

const urlsFromMedia = {
  urlsVisibleInTimeRangeByType: { 
    value: function(timeRange) { 
      return this.media.urlsVisibleInTimeRangeForClipByType(timeRange, this) 
    }
  },
};

const media = {
  media: { get: function() {
    return this.__media ||= this.mediaInitialize }
  },
  mediaInitialize: {
    get: function() {
      if (this.object.media) return MediaFactoryInstance.create(this.object.media)

      const module = ModuleInstance.ofType(this.id, this.type);
      if (! module) throw Errors.unknown[this.type] + this.type + ' ' + this.id

      return MediaFactoryInstance.create(module)
    }
  }
};

const KEYS_SIZED = ['mm_width', 'mm_height'];
const KEYS_GETTERS = [
  "mm_dimensions",
  "mm_duration",
  "mm_fps",
  "mm_height",
  "mm_t",
  "mm_width",
  "t",
];
const KEYS = [
  "ceil",
  "floor",
  "mm_cmp",
  "mm_horz",
  "mm_max",
  "mm_min",
  "mm_vert",
  ...KEYS_GETTERS,
  ...KEYS_SIZED
]; 

const THIS = "evaluator";

function Evaluator(timeRange, context, dimensions) { 
  if (!Is.instanceOf(timeRange, TimeRange)) throw Errors.argument + timeRange
  if (!Is.object(timeRange)) throw Errors.argument + context
  if (!Is.object(dimensions)) throw Errors.argument + dimensions

  this.timeRange = timeRange;
  this.context = context;
  this.dimensions = dimensions; 
  this.map = new Map;
}

const conditionalExpression = (conditional) => {
  const condition = conditional.condition;

  // not strict equality, since we may have strings and numbers
  if (Is.defined(conditional.is)) return `${condition}==${conditional.is}`
  
  const elements = conditional.in;
  if (Is.undefined(elements)) return condition

  // support supplying values as array or comma-delimited string
  const array = Is.string(elements) ? elements.split(',') : elements;
  const strings =Is.string(array[0]);
  const values = array.map(element => strings ? `"${element}"` : element);
  const type = strings ? 'String' : 'Number';
  const expression = `([${values.join(',')}].includes(${type}(${condition})))`;
  return expression
};

const replaceOperators = (string) => { 
  return string.replaceAll(' or ', ' || ').replaceAll(' and ', ' && ')
};

Object.defineProperties(Evaluator.prototype, {
  canvas: { get: function() { return this.context.canvas } },

  ceil: { value: Math.ceil },

  replaceKeys: {
    value: function(expression) { 
      if (!Is.string(expression)) return expression

      const expressions = Object.fromEntries(this.keys.map(key => ([
        key, new RegExp(`\\b${key}\\b`, 'g')
      ])));
      Object.entries(expressions).forEach(([key, reg_exp]) => {
        expression = expression.replaceAll(reg_exp, `${THIS}.get("${key}")`); 
      });
      return expression
    }
  },

  conditionalValue: { 
    value: function(conditionals) {
      if (!Is.array(conditionals)) return conditionals

      let test_bool = false;
      for (let conditional of conditionals) {
        const expression = replaceOperators(conditionalExpression(conditional));

        test_bool = this.evaluateExpression(expression);
        if (test_bool) return conditional.value
      }
      throw Errors.internal + 'no conditions were true'
    }
  },

  evaluate: {
    value: function(expressionOrConditions) {
      const expression = this.conditionalValue(expressionOrConditions);
      return this.evaluateExpression(expression)
    }
  },

  evaluateExpression: {
    value: function(expression) {
      const script = `return ${this.replaceKeys(expression)}`;
      // console.log("evaluateScope", script)
      try {
        const method = new Function(THIS, script);
        return method(this) 
      } catch (exception) {
        // console.warn(`Evaluation failed`, script, this, exception)
        return expression
      }
    }
  },

  floor: { value: Math.floor },

  get: { value: function(key) { 
    if (this.map.has(key)) return this.map.get(key)
    const value = this[key];
    if (KEYS_GETTERS.includes(key)) return value

    if (Is.method(value)) return value.bind(this)

    console.log("Evaluator.get", key, value);
    return value
  } },
  
  keys: { 
    get: function() { return [...new Set([...this.map.keys(), ...KEYS])] } 
  },

  mm_cmp: { value: function(a, b, x, y) { return ((a > b) ? x : y) } },
  
  mm_dimensions: { 
    get: function() { return `${this.mm_width}x${this.mm_height}` } 
  },

  mm_duration: { get: function() { return this.timeRange.lengthSeconds } },

  mm_fps: { get: function() { return this.timeRange.fps } },

  mm_height: { get: function() { return this.dimensions.height } },

  mm_horz: { 
    value: function(size, proud) { return this.sized(0, size, proud) } 
  },

  mm_max: { value: Math.max },

  mm_min: { value: Math.min },

  mm_t: { get: function() { return this.timeRange.position } },

  mm_vert: { 
    value: function(size, proud) { return this.sized(1, size, proud) } 
  },

  mm_width: { get: function() { return this.dimensions.width } },

  set: { value: function(key, value) { this.map.set(key, value); } },

  sized: { value: function(vertical, size, proud) {
    const scale = Is.float(size) ? size : parseFloat(size);
    const value = parseFloat(this[KEYS_SIZED[vertical]]);
    const scaled = value * scale;
    if (! proud) return scaled

    const other = parseFloat(this[KEYS_SIZED[Math.abs(vertical - 1)]]);
    if (other <= value) return scaled
    
    return value + (scale - 1.0) * other
  }},

  t: { get: function() { return this.mm_duration } },
});

const evaluator = {
  evaluator: { 
    value: function(clipRange, context, dimensions){
      const evaluator = new Evaluator(clipRange, context, dimensions);
      if (this.media.properties) {
        Object.keys(this.media.properties).forEach(key => {
          let value = this[key];
          if (Is.undefined(value)) {
            console.log("this lacked property", key, this);
            const property = this.media.properties[key];
            value = property.value;
            if (Is.undefined(value)) {
              console.log("Transform.draw media lacked property value", property);
            
              value = PropertyInstance.propertyTypeDefault(property.type);

              if (Is.undefined(value)) throw Errors.unknown.type + property.type
            }
          } 
          evaluator.set(key, value);
        });
      }
      return evaluator
    }
  },
};

const toJSONTransform = {
  toJSON: { value: function() {
    const object = { id: this.id, type: this.type  };
    return { ...this.propertyValues, ...object } 
  } }
};

const sharedTransform = {
  ...editable,
  ...copy,
  ...media,
  ...labelFromObjectOrMedia,
  ...propertyValues,
  ...urlsFromMedia,
  ...evaluator,
  ...toJSONTransform,
  ...propertiesFromMedia,
};

class Transform {
  constructor(object) {
    this.object = object;
    this.media.initializeInstance(this, object);
  }
}

Object.defineProperties(Transform.prototype, {
  ...sharedTransform,
});

class Merger extends Transform {}

Object.defineProperties(Merger.prototype, {
  type: { value: ModuleType.merger },
  ...idMutable,
  ...drawMerger,
});

const drawMediaFilters = { 
  drawMediaFilters: { value: function(clipTimeRange, context, dimensions) { 
    // clipTimeRange's frame is offset of draw time within clip = frames is duration
    this.media.filters.forEach(filter => {
      context = filter.drawFilters(this.evaluator(clipTimeRange, context, dimensions));
    });
    return context
  }},
  
};

class Scaler extends Transform {}

Object.defineProperties(Scaler.prototype, {
  type: { value: ModuleType.scaler },
  ...idMutable,
  ...drawMediaFilters,
});

class Effect extends Transform {}

Object.defineProperties(Effect.prototype, {
  type: { value: ModuleType.effect },
  ...id,
  ...drawMediaFilters,
});

const transform = {
  effects: {
    get: function() { return this.__effects ||= this.effectsInitialize }
  },
  effectsInitialize: {
    get: function() {
      const array = this.object.effects || [];
      return array.map(object => new Effect(object))
    }
  },
  merger: {
    get: function() { return this.__merger ||= this.mergerInitialize },
    set: function(value) { this.__merger = new Merger({ id: value });}
  },
  mergerInitialize: {
    get: function() {
      const object = this.object.merger || ModuleInstance.objectWithDefaultId(ModuleType.merger);
      return new Merger(object)
    }
  },
  scaler: {
    get: function() { return this.__scaler ||= this.scalerInitialize },
    set: function(value) { this.__scaler = new Scaler({ id: value });}
  },
  scalerInitialize: {
    get: function() {
      const object = this.object.scaler || ModuleInstance.objectWithDefaultId(ModuleType.scaler);
      return new Scaler(object)
    }
  },
  coreFilters: {
    get: function() {
      const filters = [];
      if (Is.defined(this.media.filters)) filters.push(...this.media.filters);
      if (Is.defined(this.merger)) filters.push(...this.merger.media.filters);
      if (Is.defined(this.scaler)) filters.push(...this.scaler.media.filters);
      if (Is.defined(this.effects)) {
        filters.push(...this.effects.flatMap(effect => effect.media.filters));
      }
      return filters
    }
  },
};

const drawImage = {
  contextAtTimeForDimensions: {
    value: function(mashTime, dimensions) {
      const range = TimeRangeFactory.createFromTime(mashTime);
      const urls = this.media.urlsVisibleInTimeRangeForClipByType(range, this);
      const url = urls.image[0];

      const resource = CacheInstance.get(url);
      if (!Is.object(resource)) throw Errors.uncached + url + " contextAtTimeForDimensions"

      const { width, height } = resource;
      let context = ContextFactoryInstance.createDrawing(width, height);
      context.drawImage(resource, 0, 0, width, height, 0, 0, width, height);
      return context
    }
  },
};

class Clip {
  constructor(object) { 
    this.object = object; 
    this.media.initializeInstance(this, object);
  }
}

const mediaTime = {
  mediaTime: { value: function(time) { return time } },
  mediaTimeRange: { value: function(timeRange) { return timeRange } },
};

class ImageClip extends Clip {}

Object.defineProperties(ImageClip.prototype, {
  type: { value: ClipType.image },
  ...sharedClip,
  ...visibleClip,
  ...inaudible,
  ...urls,
  ...transform,
  ...drawImage,
  ...mediaTime,
});

const invisible = {
  visible: { value: false },
  trackType: { value: TrackType.audio },
  urlsVisibleInTimeRangeByType: {
    value: function() { return UrlsByType.none }
  },
};

const audible = {
  audible: { get: function() {
    const audible = this.media.audible && !this.muted;
    if (!audible) console.log(this.constructor.name, "audible false:", this.media.audible, !this.muted);
    return audible
  } },
  muted: {
    get: function() {
      switch(this.gain) {
          case 0:
          case '0':
          case '0,0,1,0': return true
      }
      return false
    }
  },
  urlsAudibleInTimeRangeByType: {
    value: function(timeRange) {
      const range = this.mediaTimeRange(timeRange);
      return this.media.urlsAudibleInTimeRangeForClipByType(range)
    }
  },
  mediaTime: {
    value: function(time, add_one_frame = false) {
      const end_time = TimeFactory.createFromFrame(this.frame + this.frames, time.quantize);
      const limited_time = time.min(end_time);
      const start_time = TimeFactory.createFromFrame(this.frame, time.quantize);
      let media_time = limited_time.subtract(start_time);

      if (add_one_frame) {
        const frame_at_speed = this.speed ? Math.ceil(this.speed) : 1;
        media_time = media_time.add(TimeFactory.createFromFrame(frame_at_speed, this.quantize));
      }
      if (this.trim) {
        media_time = media_time.add(TimeFactory.createFromFrame(this.trim, this.quantize));
      }
      if (this.speed) {
        media_time = media_time.divide(this.speed, 'ceil');
      }
      return media_time
    }
  },
  mediaTimeRange: {
    value: function(timeRange) {
      const add_one_frame = (timeRange.frames > 1);
      return TimeRangeFactory.createFromTimes(
        this.mediaTime(timeRange.startTime),
        this.mediaTime(timeRange.endTime, add_one_frame)
      )
    }
  },
};

const mediaTimeFromTrim = {
  mediaTime: {
    value: function(time, add_one_frame = false) {
      const end_time = TimeFactory.createFromFrame(this.frame + this.frames, time.quantize);
      const limited_time = time.min(end_time);
      const start_time = TimeFactory.createFromFrame(this.frame, time.quantize);
      let media_time = limited_time.subtract(start_time);

      if (add_one_frame) {
        const frame_at_speed = this.speed ? Math.ceil(this.speed) : 1;
        media_time = media_time.add(TimeFactory.createFromFrame(frame_at_speed, this.quantize));
      }
      if (this.trim) {
        media_time = media_time.add(TimeFactory.createFromFrame(this.trim, this.quantize));
      }
      if (this.speed) {
        media_time = media_time.divide(this.speed, 'ceil');
      }
      return media_time
    }
  },
  mediaTimeRange: {
    value: function(timeRange) {
      const add_one_frame = (timeRange.frames > 1);
      return TimeRangeFactory.createFromTimes(
        this.mediaTime(timeRange.startTime),
        this.mediaTime(timeRange.endTime, add_one_frame)
      )
    }
  },
};

class AudioClip extends Clip {}

Object.defineProperties(AudioClip.prototype, {
  type: { value: ClipType.audio },
  ...sharedClip,
  ...invisible,
  ...audible,
  ...mediaTimeFromTrim,
});

function VideoClip(object) { this.object = object; }

Object.defineProperties(VideoClip.prototype, {
  type: { value: ClipType.video },
  ...sharedClip,
  ...visibleClip,
  ...audible,
  ...urls,
  ...transform,
  ...mediaTimeFromTrim,
});

const speedOne = { 
  speed: {  get: function() { return 1.0 } }
};

class ThemeClip extends Clip {}

Object.defineProperties(ThemeClip.prototype, {
  type: { value: ClipType.theme },
  ...sharedClip,
  ...inaudible,
  ...visibleClip,
  ...speedOne,
  ...urls,
  ...inaudible,
  ...transform,
  ...evaluator,
  ...drawMediaFilters,
  ...mediaTime,
  contextAtTimeForDimensions: {
    value: function(mashTime, dimensions) {
      const context = ContextFactoryInstance.createDrawing(dimensions.width, dimensions.height);
      const clipTimeRange = this.timeRangeRelative(mashTime);
      if (Is.undefined(clipTimeRange)) return
      
      return this.drawMediaFilters(clipTimeRange, context, dimensions)
    }
  },
});

const ChildTypes = ["to", "from"];
const ChildType = Object.fromEntries(ChildTypes.map(type => [type, type]));

class TransitionClip extends Clip {
  constructor(object) {
    super(object);
    this.children = Object.fromEntries(ChildTypes.map(type => [type, {}]));
  }
}

const definition = {
  type: { value: ClipType.transition },
  ...sharedClip,
  ...visibleClip,
  ...urlsFromMedia,
  ...mediaTime,
  contextAtTimeForDimensions: {
    value: function(mashTime, dimensions, color, clips = []) {
      const sorted = clips.sort(byFrame);

      const context = ContextFactoryInstance.createDrawing(dimensions.width, dimensions.height);
      ColorFilterInstance.draw( { context }, { color } );

      const [fromClip, toClip] = sorted;
      const defined = {
        [ChildType.to]: Is.object(toClip) && toClip,
        [ChildType.from]: Is.object(fromClip) && fromClip,
      };
      ChildTypes.forEach(childType => {
        const clip = defined[childType];
        if (!clip) return

        const drawing = ContextFactoryInstance.createDrawing(dimensions.width, dimensions.height);
        ColorFilterInstance.draw( { drawing }, { color } );

        clip.mergeContextAtTime(mashTime, drawing);


        const merger = this.child(childType, TransformType.merger);
        const scaler = this.child(childType, TransformType.scaler);


        const clipTimeRange = this.timeRangeRelative(mashTime);
        if (Is.undefined(clipTimeRange)) return

        const scaled = scaler.drawMediaFilters(clipTimeRange, drawing, dimensions);
        merger.drawMerger(clipTimeRange, scaled, context);
      });

      return context
    }
  },
  // urlsVisibleInTimeRangeByType: {
  //   value: function(timeRange) {
  //     const urls = new UrlsByType

  //     ChildTypes.forEach(type => {
  //       urls.concat(this.child())
  //     })

  //     return this.media.urlsVisibleInTimeRangeForClipByType(timeRange, this)
  //   }
  // },
  initializeChild: {
    value: function(childType, transformType) {
      const klass = transformType === TransformType.merger ? Merger : Scaler;
      return new klass(this.object[childType])
    }
  },
  child: {
    value: function(childType, transformType) {
      return this[`${childType}${Utilities.capitalize(transformType)}`]
    }
  },
};

ChildTypes.forEach(childType => {
  definition[childType] = {
    get: function() {
      if (Is.undefined(this.children[childType])) this.children[childType] = {};
      return this.children[childType]
    }
  };

  TransformTypes.forEach(transformType => {
    definition[`${childType}${Utilities.capitalize(transformType)}`] = {
      get: function() {
        if (Is.undefined(this.children[childType][transformType])) {
          const child = this.initializeChild(childType, transformType);
          this.children[childType][transformType] = child;
        }
        return this.children[childType][transformType]
      }
    };
  });
});

Object.defineProperties(TransitionClip.prototype, definition);

function FrameClip(object) { this.object = object; }

Object.defineProperties(FrameClip.prototype, {
  type: { value: ClipType.frame },
  ...sharedClip,
  ...visibleClip,
  ...urls,
  ...mediaTime,
});

class ClipFactory extends Factory {
  constructor() {
    super(Clip);
    this.install(ClipType.audio, AudioClip);
    this.install(ClipType.frame, FrameClip);
    this.install(ClipType.image, ImageClip);
    this.install(ClipType.theme, ThemeClip);
    this.install(ClipType.transition, TransitionClip);
    this.install(ClipType.video, VideoClip);
  }

  createFromObjectMedia(object = {}, media = {}, mash = {}) {
    if (!Is.object(object)) throw Errors.object
    if (!Is.object(media)) throw Errors.media

    if (!Is.integer(object.frames)) {
      object.frames = TimeFactory.createFromSeconds(media.duration, mash.quantize, 'floor').frame;
    }
    object.media ||= media;
    const type = object.type || media.type;
    media.type ||= type;
    object.type ||= type;
    if (!ClipTypes.includes(type)) throw Errors.unknown.type

    return this.createFromObject(object)
  }

  createFromMedia(media, mash) {
    const object = { id: media.id, type: media.type };
    return this.createFromObjectMedia(object, media, mash)
  }
}

const ClipFactoryInstance = new ClipFactory();

class Track extends Base {
    constructor(object, mash) {
      super(object);
      this.mash = mash;

      this.object.index ||= 0;
      this.object.type ||= TrackType.video;
    }

    get clips() { return this.__clips ||= this.initializeClips }
    get initializeClips() {
      const array = this.object.clips || [];
      return array.map(object => {
        const media = this.mash.searchMedia(object.id);
        const clip = ClipFactoryInstance.createFromObjectMedia({ track: this.index, ...object }, media);

        return clip
      })
    }

    get frames() {
      if (!this.clips.length) return 0

      const clip = this.clips[this.clips.length - 1];
      return clip.frame + clip.frames
    }

    get index() { return this.object.index }

    get isMainVideo() { return !this.index && this.type == TrackType.video }

    get type() { return this.object.type }

    addClips(clips, insertIndex = 0) {
      insertIndex ||= 0;
      if (!this.isMainVideo) insertIndex = 0; // ordered by clip.frame values

      const clipIndex = insertIndex; // note original, since it may decrease...
      const movingClips = []; // build array of clips already in this.clips
      // build array of my clips excluding the clips we're inserting
      const spliceClips = this.clips.filter((clip, index) => {
        const moving = clips.includes(clip);
        if (moving) movingClips.push(clip);
        // insert index should be decreased when clip is moving and comes before
        if (clipIndex && moving && index < clipIndex) insertIndex--;
        return !moving
      });
      // insert the clips we're adding at the correct index, then sort properly
      spliceClips.splice(insertIndex, 0, ...clips);
      this.sortClips(spliceClips);

      // set the track of clips we aren't moving
      const newClips = clips.filter(clip => !movingClips.includes(clip));
      newClips.forEach(clip => clip.track = this.index);

      // remove all my current clips and replace with new ones in one step
      this.clips.splice(0, this.clips.length, ...spliceClips);
    }

    frameForClipsNearFrame(clips, frame = 0) {
      // TODO: make range that includes all clips

      // find next stretch after frame that fits range

      this.clips.filter(clip => !clips.includes(clip));

      return frame
    }

    removeClips(clips) {
      const spliceClips = this.clips.filter(clip => !clips.includes(clip));
      if (spliceClips.length === this.clips.length) {
        console.log("removeClips", this.type, this.index, this.clips);
        throw Errors.internal + JSON.stringify(clips)
      }
      clips.forEach(clip => clip.track = -1);
      this.sortClips(spliceClips);
      this.clips.splice(0, this.clips.length, ...spliceClips);
    }

    sortClips(clips) {
      clips ||= this.clips;
      if (this.isMainVideo) {
        let frame = 0;
        clips.forEach((clip, i) => {
          const is_transition = clip.type === TrackType.transition;
          if (i && is_transition) frame -= clip.frames;
          clip.frame = frame;
          if (!is_transition) frame += clip.frames;
        });
      }
      clips.sort(byFrame);
    }

    toJSON() {
      return { type: this.type, index: this.index, clips: this.clips }
    }
}

class TrackFactoryClass extends Factory {
  create(object, mash) {
    if (!Is.object(object)) throw(Errors.object)
    if (object instanceof Track) return object

    //if (!Is.instanceOf(mash, Mash)) throw(Errors.mash)

    return new Track(object, mash)
  }
}

const TrackFactory = new TrackFactoryClass;

const MashProperty = {
  label: "label",
  backcolor: "backcolor",
};

class Mash extends Base {
  static get properties() { return Object.values(MashProperty) }

  get audio() { return this.__audio ||= this.initializeAudio }

  get backcolor() {
    return this.__backcolor ||= this.object.backcolor || Default.mash.backcolor
  }
  set backcolor(value) { this.__backcolor = value; }

  get clips() { return this.tracks.map(track => track.clips).flat() }

  get clipsAudible() { return this.clips.filter(clip => clip.audible) }

  get clipsAudio() { return this.audio.map(track => track.clips).flat() }

  get clipsVideo() { return this.video.flatMap(track => track.clips) }

  get events() { return this.__events ||= this.object.events }
  set events(value) { this.__events = value; }

  /** mash duration in frames */
  get frames() {
    return Math.max(0, ...this.tracks.map(track => track.frames))
  }

  get initializeAudio() {
    const array = this.object.audio || [{ type: TrackType.audio }];
    return array.map(track => TrackFactory.create(track, this))
  }

  get initializeMedia() {
    const array = this.object.media || [];
    return array.map(media => MediaFactoryInstance.create(media))
  }

  get initializeVideo() {
    const array = this.object.video || [{ type: TrackType.video }];
    return array.map(track => TrackFactory.create(track, this))
  }

  get initialMedia() { return this.__initialMedia ||= this.initializeMedia }

  get label() { return this.__label ||= this.object.label || Default.mash.label }
  set label(value) { this.__label = value; }

  get media() {
    return [...new Set(this.clips.flatMap(clip => this.mediaForClip(clip)))]
  }

  get propertyValues() {
    return Object.fromEntries(Mash.properties.map(key => [key, this[key]]))
  }

  get quantize() { return this.__quantize ||= this.object.quantize || Default.mash.quantize }

  /** combined audio and video tracks */
  get tracks() { return TrackTypes.map(av => this[av]).flat() }

  get type() { return "mash" }

  get video() { return this.__video ||= this.initializeVideo }

  addClipsToTrack(clips, trackIndex = 0, insertIndex = 0) {
    trackIndex ||= 0;
    insertIndex ||= 0;
    const [clip] = clips;
    // console.log("addClipsToTrack trackIndex", trackIndex, "insertIndex:", insertIndex)
    const newTrack = this.clipTrackAtIndex(clip, trackIndex);
    const oldTrack = this.clipTrack(clip);

    this.emitIfFramesChange(() => {
      if (oldTrack && oldTrack !== newTrack) {
        // console.log("addClipsToTrack", newTrack.index, oldTrack.index)
        oldTrack.removeClips(clips);
      }
      newTrack.addClips(clips, insertIndex);
    });
  }

  addTrack(trackType) {
    const array = this[trackType];
    const options = { type: trackType, index: array.length };
    const track = TrackFactory.create(options, this);
    array.push(track);
    return track
  }

  changeClipFrames(clip, value) {
    let limited_value = Math.max(1, value); // frames value must be > 0

    if (TrackTypes.includes(clip.type)) {
      const max = Math.floor(clip.media.duration * this.quantize) - clip.trim;
      limited_value = Math.min(max, limited_value);
    }
    const track = this.clipTrack(clip);
    this.emitIfFramesChange((changeClipFrames) => {
      clip.frames = limited_value;
      track.sortClips();
    });
  }

  changeClipTrim(clip, value, frames) {
    let limited_value = Math.max(0, value);

    if (TrackTypes.includes(clip.type)) { // trim not remove last frame
      const max = Math.floor(clip.media.duration * this.quantize) - 1;
      limited_value = Math.min(max, limited_value);
    }
    const new_frames = frames - limited_value;
    const track = this.clipTrack(clip);
    this.emitIfFramesChange(() => {
      clip.trim = limited_value;
      clip.frames = new_frames;
      track.sortClips();
    });
  }

  clipIntersects(clip, range) {
    return clip.timeRange(this.quantize).intersects(range)
  }

  clipTrack(clip) {
    return this.clipTrackAtIndex(clip, clip.track)
  }

  clipTrackAtIndex(clip, index = 0) {
    return this.trackOfTypeAtIndex(clip.trackType, index)
  }

  clipsAudibleAtTime(time) { return this.clipsWithin(time, true, false) }

  clipsAudibleInTimeRange(timeRange) {
    const range = timeRange.scale(this.quantize);
    return this.clips.filter(clip =>
      clip.audible && this.clipIntersects(clip, range)
    )
  }

  clipsVisibleAtTime(time) { return this.clipsWithin(time, false) }

  clipsVisibleInTimeRange(timeRange) {
    const range = timeRange.scale(this.quantize);
    return this.clipsVideo.filter(clip => this.clipIntersects(clip, range))
  }

  clipsWithin(time, includeAudible = true, includeVisible = true) {
    const range = TimeRangeFactory.create(time);
    if (!includeAudible) return this.clipsVisibleInTimeRange(range)
    if (!includeVisible) return this.clipsAudibleInTimeRange(range)

    return this.clips.filter(clip => this.clipIntersects(clip, range))
  }

  emitDuration() {
    const info = {
      value: TimeFactory.createFromFrame(this.frames, this.quantize).seconds
    };
    // console.log(this.constructor.name, "emitDuration", info)
    this.events.emit(EventType.duration, info);
  }

  emitIfFramesChange(method) {
    const frames = this.events ? this.frames : null;
    // console.log(this.constructor.name, "emitIfFramesChange", frames)
    method();
    if (this.events && frames !== this.frames) this.emitDuration();
    // else console.log(this.constructor.name, "emitIfFramesChange", !!this.events, frames, this.frames)
  }

  findInitialMedia(mediaId) {
    return this.initialMedia.find(media => media.id === mediaId)
  }

  findClipMedia(mediaId) {
    return this.media.find(media => media.id === mediaId)
  }

  findMedia(mediaId) {
    if (!(Is.string(mediaId) && mediaId.length)) return
    const found = this.findInitialMedia(mediaId);
    if (found) return found

    return this.findClipMedia(mediaId)
  }

  filterClipSelection(value) {
    const array = Is.array(value) ? value : [value];
    const clips = array.filter(clip => Is.instanceOf(clip, Clip));
    const [firstClip] = clips;
    // console.log("filterClipSelection", clips)
    if (!firstClip) return []

    const { trackType, track } = firstClip;

    // selected clips must all be on same track
    const trackClips = clips.filter(clip =>
      clip.track === track && clip.trackType === trackType
    ).sort(byFrame);

    if (track || trackType === TrackType.audio) return trackClips

    // selected clips on main track must be abutting each other
    let abutting = true;
    return trackClips.filter((clip, index) => {
      if (!abutting) return

      if (index === trackClips.length - 1) return true

      abutting = clip.frame + clip.frames === trackClips[index + 1].frame;
      if (!abutting) console.log(this.constructor.name, "filterClipSelection", clip.frame + clip.frames, "!==", trackClips[index + 1].frame);
      return true
    })
  }
  mediaForClip(clip) {
    const medias = [];
    const media = clip.media;
    if (!Is.object(media)) throw "CLIP HAS NO MEDIA " + clip
    medias.push(media);
    if (clip.scaler) medias.push(clip.scaler.media);
    if (clip.merger) medias.push(clip.merger.media);

    if (media.modular) {
      const properties_by_type = media.modularPropertiesByType;
      Object.keys(properties_by_type).forEach(type => {
        const modular_properties = properties_by_type[type];
        modular_properties.forEach(key => {
          const found = this.searchMedia(clip[key], type);
          if (found) medias.push(found);
        });
      });
    }
    switch(media.type){
      case MediaType.transition: {
        medias.push(...this.mediaForClipTransform(clip.to));
        medias.push(...this.mediaForClipTransform(clip.from));
        break
      }
      case MediaType.effect:
      case MediaType.audio: break
      default: {
        medias.push(...this.mediaForClipTransform(clip));
        const effects = clip.effects;
        if (!effects) break
        effects.forEach(effect => {
          medias.push(...this.mediaForClip(effect));
        });
      }
    }
    return medias
  }

  mediaForClipTransform(object){
    const medias = [];
    if (Is.object(object)) {
      [MediaType.merger, MediaType.scaler].forEach(key => {
        const merger_or_scaler = object[key];
        if (Is.object(merger_or_scaler)) {
          const found = this.searchMedia(merger_or_scaler.id, key);
          if (found) medias.push(found);
        }
      });
    }
    return medias
  }

  mediaReferences() {
    const references = {};
    this.clips.forEach(clip => {
      this.mediaForClip(clip).forEach(media => {
        references[media.id] ||= 0;
        references[media.id]++;
      });
    });
    return references
  }

  removeClipsFromTrack(clips) {
    const [clip] = clips;
    const track = this.clipTrack(clip);
    this.emitIfFramesChange(() => track.removeClips(clips));
  }

  removeTrack(trackType) {
    const array = this[trackType];
    this.emitIfFramesChange(() => array.pop());
  }

  searchMedia(mediaId, moduleType) {
    const found = this.findInitialMedia(mediaId);
    if (found) return found

    switch (moduleType) {
      case MediaType.filter:
        return FilterFactoryInstance.created(mediaId) ? FilterFactoryInstance.create(mediaId) : ModuleInstance.defaultOfType(moduleType)
    }
    const module = ModuleInstance.defaultOfType(moduleType);
    if (module) return module

    return this.findClipMedia(mediaId)
  }

  toJSON() {
    return {
      label: this.label,
      quantize: this.quantize,
      backcolor: this.backcolor,
      id: this.id,
      media: this.media,
      audio: this.audio,
      video: this.video,
    }
  }

  trackOfTypeAtIndex(trackType, index = 0) {
    if (index < 0) return
    // console.log(this.constructor.name, "trackOfTypeAtIndex", trackType, index)
    if (Is.not(trackType)) throw Errors.type

    return this[trackType][index]
  }

  urlsAudibleInTimeRangeForClipsByType(timeRange, clips) {
    const range = timeRange.scale(this.quantize);
    const urls = new UrlsByType;
    clips.forEach(clip => urls.concat(clip.urlsAudibleInTimeRangeByType(range)));
    return urls
  }

  urlsForClipsWithin(clips, time, includeAudible = true, includeVisible = true) {
    const range = TimeRangeFactory.create(time);
    const urls = new UrlsByType;

    if (!includeAudible) urls.concat(this.urlsVisibleInTimeRangeForClipsByType(range, clips));
    if (!includeVisible) urls.concat(this.urlsAudibleInTimeRangeForClipsByType(range, clips));

    return urls
  }

  urlsVisibleInTimeRangeForClipsByType(timeRange, clips) {
    const range = timeRange.scale(this.quantize);
    const urls = new UrlsByType;
    clips.forEach(clip => urls.concat(clip.urlsVisibleInTimeRangeByType(range)));
    return urls
  }

  urlsWithin(time, includeAudible = true, includeVisible = true) {
    const clips = this.clipsWithin(time, includeAudible, includeVisible);
    return this.urlsForClipsWithin(clips, time, includeAudible, includeVisible)
  }
}

Object.defineProperties(Mash.prototype, {
  ...id$1,
});

class Events extends Base {
  constructor(object) {
    super(object);
    this.methods = new Set;
  }

  get target() { return this.object.target }
  set target(value) { 
    if (this.object.target !== value) {
      if (!Is.instanceOf(value, EventTarget)) throw Errors.object

      const methods = new Set(this.methods);

      methods.forEach(this.removeListener, this);
      this.object.target = value;
      methods.forEach(this.addListener, this);      
    }
  }

  addListener(method) { 
    if (this.methods.add(method)) {
      this.target && this.target.addEventListener(Events.type, method); 
    }
  }

  emit(type, info = {}) {
    const detail = { type, ...info };
    const event = { detail };
    this.target && this.target.dispatchEvent(new CustomEvent(Events.type, event));
  }

  removeListener(method) { 
    if (this.methods.delete(method)) {
      this.target && this.target.removeEventListener(Events.type, method); 
    }
  }
}

Object.defineProperties(Events, { type: { value: "masher" } });

const contexts = {
  videoContext: { 
    get: function() { 
      this.__videoContext ||= this.object.videoContext || ContextFactoryInstance.createVideo();
      return this.__videoContext
    },
    set: function(value) { 
      this.__videoContext = value; 
      if (this.composition) this.composition.videoContext = value;
    }
  },
  audioContext: { 
    get: function() { 
      this.__audioContext ||= this.object.audioContext || ContextFactoryInstance.createAudio();
      return this.__audioContext
    },
    set: function(value) { 
      this.__audioContext = value; 
      if (this.composition) this.composition.audioContext = value;
    }
  },
};

const throwUnlessClipsDrawable = (clips) => {
  clips.forEach(clip => {
    if (!clip.frames) throw Errors.frames + JSON.stringify(clip)
  });
};

class Composition extends Base {
  constructor(object) {
    // console.log("Composition", object)
    super(object);
    this.object.bufferSeconds ||= Default.bufferSeconds;
    this.paused = true;
    this.playing = false;
    this.sourcesByClip = new Map;
    this.__mashSeconds = 0;
    this.__contextSeconds = 0;
  }

  get audible() { return !this.paused && !!this.audioContext }

  get bufferedTime() { return this.urlsAtTime.loaded }

  get bufferedTimeRange() {
    return this.urlsInTimeRange.loaded
  }

  get bufferSeconds() { return this.object.bufferSeconds }
  set bufferSeconds(value) { this.object.bufferSeconds = value; }

  get clipsAtTime() {
    return this.mash.clipsWithin(this.time, this.audible, this.visible)
  }

  get clipsInTimeRange() {
    return this.mash.clipsWithin(this.timeRange, this.audible, this.visible)
  }

  get configured() { return this.time && this.mash && (this.videoContext || this.audioContext) }

  get gain() {
    if (Is.undefined(this.__gain)) this.__gain = this.__gainInitialize;
    return this.__gain
  }
  get __gainInitialize() {
    return Is.defined(this.object.gain) ? this.object.gain : Default.volume
  }
  set gain(value) {
    if (this.__gain !== value) {
      this.__gain = value;
      if (!this.playing) return

      this.clipsAtTime.forEach(this.adjustSourceGain);
    }
  }


  get mash() { return this.object.mash }
  set mash(value) { this.object.mash = value; }

  get quantize() { return this.mash ? this.mash.quantize : 1 }

  get seconds() {
    const ellapsed = this.audioContext.currentTime - this.__contextSeconds;
    return ellapsed + this.__mashSeconds
  }

  get time() { return this.__time }
  set time(value) {
    if (!Is.instanceOf(value, Time)) throw(Errors.time)

    this.__time = value;
  }

  get timeRange() {
    const buffer_time = TimeFactory.createFromSeconds(this.bufferSeconds);
    const end_time = this.time.add(buffer_time);
    return TimeRangeFactory.createFromTimes(this.time, end_time)
  }

  get timeRangeAtTime() { return TimeRangeFactory.createFromTime(this.time) }


  get urlsAtTime() {
    return this.urlsInTimeRangeByType(this.timeRangeAtTime)
  }

  get urlsInTimeRange() {
    return this.urlsInTimeRangeByType(this.timeRange)
  }

  get visible() { return !!this.videoContext }

  adjustSourceGain(clip) {
    const source = this.sourcesByClip.get(clip);
    if (Is.undefined(source)) return

    const { gainNode } = source;
    if (this.gain === 0.0) return gainNode.gain.value = 0.0

    const { gain } = clip;
    if (!Is.array(gain)) return gainNode.gain.value = gain * this.gain

    // time/gain pairs...
    const times = this.clipTiming(clip);
    const { start, duration } = times;
    gainNode.cancelScheduledValues(0);
    const gains = gain.split(',');
    const z = gains.length / 2;
    for (let i = 0; i < z; i++) {
      const position = gains[i * 2];
      const value = this.gain * gains[i * 2 + 1];
      const seconds = start + position * duration;
      gainNode.gain.linearRampToValueAtTime(value, seconds);
    }
  }

  clipsToDraw(throwIfUncached) {
    const clips = this.clipsAtTime;
    throwUnlessClipsDrawable(clips);
    const urls = this.urlsInTimeRangeByType(this.timeRangeAtTime);
    if (!urls.loaded) {
      if (!throwIfUncached) return

      throw Errors.uncached + urls.urlsUnloaded[0]
    }
    return clips
  }

  clipTiming(clip) {
    const result = { offset: 0 };
    const range = clip.timeRange(this.quantize);
    const zero_seconds = this.__contextSeconds - this.__mashSeconds;
    result.start = zero_seconds + range.seconds;

    result.duration = range.lengthSeconds;
    if (clip.trim) {
      range.frame = clip.trim;
      result.offset = range.seconds;
    }
    const now = this.audioContext.currentTime;
    if (now > result.start) {
      const dif = now - result.start;
      result.start = now;
      result.offset += dif;
      result.duration -= dif;
    }
    return result
  }

  createSources() {
    const clips = this.clipsInTimeRange;
    const filtered_clips = clips.filter(clip => !this.sourcesByClip.has(clip));
    filtered_clips.forEach(clip => {
      const media = clip.media;
      const url = media.urlAudible;
      if (url && CacheInstance.cached(url)) {
        const times = this.clipTiming(clip);
        const { start, duration, offset } = times;
        if (Is.positive(start) && Is.positive(duration) && duration > 0) {
          const gainSource = this.audioContext.createBufferSource();
          gainSource.buffer = CacheInstance.get(url);

          const gainNode = this.audioContext.createGain();
          gainSource.connect(gainNode);
          gainNode.connect(this.audioContext.destination);
          gainSource.start(start, offset, duration);

          this.sourcesByClip.set(clip, { gainSource, gainNode });

          this.adjustSourceGain(clip);

        }
      }
    });
  }

  destroySources(clipsToKeep = []) {
    this.sourcesByClip.forEach((source, clip) => {
      if (clipsToKeep.includes(clip)) return

      const { gainSource, gainNode } = source;
      gainNode.disconnect(this.audioContext.destination);
      gainSource.disconnect(gainNode);
      this.sourcesByClip.delete(clip);
    });
  }

  draw() {
    // console.log(this.constructor.name, "draw")
    if (!this.configured) return

    this.drawClips(this.time, this.clipsToDraw(true));
  }

  drawBackground(context) {
    if (!Is.objectStrict(context)) throw Errors.internal

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.fillStyle = Pixel.color(this.mash.backcolor);
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  }

  drawClips(time, clips) {
    // console.log(this.constructor.name, "drawClips", time, clips)
    const main = clips.filter(clip => clip.visible && clip.track === 0);
    this.drawBackground(this.videoContext); // fill canvas with mash background color
    if (main.length > 1) {
      const transition = main.find(clip => clip.type === ClipType.transition);
      if (!transition) throw Errors.mainTrackOverlap

      const transitioned = main.filter(clip => clip.type !== ClipType.transition);
      transition.mergeContextAtTime(time, this.videoContext, this.mash.backcolor, transitioned);
    } else {
      const [mainClip] = main;
      if (mainClip) mainClip.mergeContextAtTime(time, this.videoContext);
    }
    const tracked = clips.filter(clip => !main.includes(clip)).sort(byTrack);
    tracked.forEach(clip => {
      clip.mergeContextAtTime(time, this.videoContext);
    });
  }

  drawFrame() {
    // console.log(this.constructor.name, "drawFrame")
    if (!this.configured) return

    const clips = this.clipsToDraw();
    if (Is.undefined(clips)) {
      this.loadTimeRange();
      return
    }

    requestAnimationFrame(() => this.drawClips(this.time, clips));
    return true
  }

  loadTimeRange() {
    if (this.audible) {
      this.createSources();
      this.destroySources(this.clipsInTimeRange);
    }
    const urls = this.urlsInTimeRangeByType(this.timeRange);
    return urls.load(this.audioContext)
  }

  urlsInTimeRangeByType(timeRange) {
    return this.mash.urlsWithin(timeRange, this.audible, this.visible)
  }

  loadTime() {
    const urls = this.urlsInTimeRangeByType(this.time);
    return urls.load(this.audioContext)
  }

  startPlaying() {
    console.log(this.constructor.name, "startPlaying");
    if (this.__bufferSource) throw Errors.internal
    if (this.playing) throw Errors.internal
    this.playing = true;

    this.__bufferSource = this.audioContext.createBufferSource();
    this.__bufferSource.loop = true;
    this.__bufferSource.buffer = this.audioContext.createBuffer(2, 44100, 44100);
    this.__bufferSource.connect(this.audioContext.destination);

    this.__mashSeconds = this.time.seconds;
    this.__contextSeconds = this.audioContext.currentTime;

    console.log("__mashSeconds", this.__mashSeconds);
    console.log("__contextSeconds", this.__contextSeconds);

    this.createSources();

    this.__bufferSource.start(0);
  }

  stopPlaying() {
    console.log(this.constructor.name, "stopPlaying");

    if (!this.playing) return

    this.playing = false;
    if (this.__bufferSource) this.__bufferSource.stop();

    this.destroySources();
    this.__mashSeconds = 0;
    this.__contextSeconds = 0;

    if (!this.__bufferSource) return

    this.__bufferSource.disconnect(this.audioContext.destination);
    this.__bufferSource = null;
  }

}

Object.defineProperties(Composition.prototype, {
  ...contexts,
});

const ActionTypes = [
  'addTrack',
  'addClipsToTrack',
  'moveClips',
  'addEffect',
  'change',
  'changeFrames',
  'changeTrim',
  'changeGain',
  'moveEffects',
  'split',
  'freeze',
  'removeClips',
];
const ActionType = Object.fromEntries(ActionTypes.map(type => [type, type]));

class ActionFactory extends Factory {
  constructor() {
    super(Action);
    this.install(ActionType.addTrack, AddTrackAction);
    this.install(ActionType.addClipsToTrack, AddClipToTrackAction);
    this.install(ActionType.moveClips, MoveClipsAction);
    this.install(ActionType.addEffect, AddEffectAction);
    this.install(ActionType.change, ChangeAction);
    this.install(ActionType.changeFrames, ChangeFramesAction);
    this.install(ActionType.changeTrim, ChangeTrimAction);
    this.install(ActionType.split, SplitAction);
    this.install(ActionType.freeze, FreezeAction);
    this.install(ActionType.moveEffects, MoveEffectsAction);
    this.install(ActionType.removeClips, RemoveClipsAction);
  }

  createFromObjectMasher(object, masher) {
    const defaults = {
      mash: "",
      undoSelectedClips: "selectedClips",
      undoSelectedEffects: "selectedEffects",
      redoSelectedClips: "selectedClips",
      redoSelectedEffects: "selectedEffects",
    };
    const clone = { ...object };
    Object.entries(defaults).forEach(entry => {
      const [key, value] = entry;
      if (Is.defined(object[key])) return

      if (Is.emptystring(value)) clone[key] = masher[key];
      else clone[key] = [...masher[value]];
    });

    return this.createFromObject(clone)
  }
}

Object.defineProperties(ActionFactory.prototype, {
  type: { value: ActionType },
  types: { value: ActionTypes },
});

const ActionFactoryInstance = new ActionFactory;

const deprecated = {
  uuid: { value: function() { return Id() } },
  canvas_context: {
    get: function() { 
      console.warn(Errors.deprecation.canvas_context.get);
      return this.videoContext
    },
    set: function(value) { 
      console.warn(Errors.deprecation.canvas_context.set);
      this.videoContext = value; 
    }
  },
  buffertime: {
    get: function() { return this.buffer },
    set: function(value) { this.buffer = value; }
  },
  minbuffertime: {
    get: function() { return this.buffer },
    set: function(value) { this.buffer = value; }
  },
};

const MasherProperty = {
  autoplay: "autoplay",
  precision: "precision",
  loop: "loop",
  fps: "fps",
  volume: "volume",
  buffer: "buffer",
};


const clipCanBeSplit = (clip, time, quantize) => {
  if (!Is.object(clip)) return

  // true if now intersects clip time, but is not start or end frame
  let range = TimeRangeFactory.createFromTime(time);
  const clip_range = clip.timeRange(quantize);

  // ranges must intersect
  if (!clip_range.intersects(range)) return

  const scaled = range.scale(clip_range.fps);
  if (scaled.frame === clip_range.frame) return
  if (scaled.end === clip_range.end) return

  return true
};

// TODO: support Layers, made up of Rolls (a, b)
class Masher extends Base {

  constructor(object = {}) {
    super(object);

    this.object.canvas ||= ContextFactoryInstance.createCanvas();

    this.events = new Events({ target: this.canvas });
    this.events.addListener(this.handleMasher.bind(this));

    // console.log("events:", this.events)
    this.__load_timer = false;
    this.__moving = false;
    this.__muted = false;
    this.__paused = true;
    this.__mashFrames = 0;
    this.__time = TimeFactory.createFromFrame(0, this.fps);
    this.__drawnTime = TimeFactory.createFromFrame(0, this.fps);

    const mash = this.object.mash || {};
    this.object.mash = false;
    this.mash = mash;
  }

  get action_index() { return this.__actions.index }


  get autoplay() {
    if (Is.undefined(this.__autoplay)) {
      this.__autoplay = this.initializeProperty(MasherProperty.autoplay);
    }
    return this.__autoplay
  }
  set autoplay(value) { this.__autoplay = value; }

  // TODO: move me to Mash
  get composition() {
    if (!this.__composition) {
      const options = {
        bufferSeconds: this.buffer,
        gain: this.gain,
        mash: this.mash,
        audioContext: this.audioContext,
        videoContext: this.videoContext,
      };
      this.__composition = new Composition(options);
      this.__composition.time = this.time;
    }
    return this.__composition
  }

  get buffer() {
    if (Is.undefined(this.__buffer)) {
      // deprecated buffer properties
      const properties = [MasherProperty.buffer, 'buffertime', 'minbuffertime'];
      this.__buffer = this.initializeProperty(...properties);
    }
    return this.__buffer
  }
  set buffer(value) {
    if (this.__buffer !== value) {
      this.__buffer = value;
      this.composition.bufferSeconds = value;
    }
  }

  get bufferedTimeRange() { return this.composition.bufferedTimeRange }

  get canvas() { return this.videoContext.canvas }
  set canvas(value) {
    this.videoContext = ContextFactoryInstance.createVideo(value);
    this.events.target = value;
  }

  get configured() {
    return this.mash && this.canvas
  }

  // time, but in seconds
  get currentTime() { return this.time.seconds }
  set currentTime(seconds) { this.time = TimeFactory.createFromSeconds(seconds, this.fps); }

  get duration() { return TimeFactory.createFromFrame(this.__mashFrames, this.mash.quantize).seconds }

  get endTime() { return this.mashEndTime.scale(this.fps, 'floor') }

  get fps() {
    if (Is.undefined(this.__fps)) {
      this.__fps = this.initializeProperty(MasherProperty.fps);
    }
    return this.__fps
  }
  set fps(value) {
    if (!Is.integer(value) || value < 1) throw(Errors.fps)

    if (this.__fps !== value) {
      this.__fps = value;
      this.__time = this.__time.scale(value);
      this.__drawnTime = this.__drawnTime.scale(value);
    }
  }

  get frame() { return this.time.frame }
  set frame(value) {
    // called from ruler to change position
    //console.log('frame=', value, this.fps)

    this.time = TimeFactory.createFromFrame(value, this.fps);
    //console.log("time", this.time)
  }
  // Math.round(Number(this.__mashFrames) / Number(this.mash.quantize) * Number(this.fps));}
  get frames() { return this.mashEndTime.scale(this.fps).frame }

  get gain() { return this.muted ? 0.0 : this.volume }

  get loop() {
    if (Is.undefined(this.__loop)) {
      this.__loop = this.initializeProperty(MasherProperty.loop);
    }
    return this.__loop
  }
  set loop(value) { this.__loop = value; }

  get mash() { return this.__mash ||= this.object.mash }
  set mash(object) {
    // console.log("set mash", object)

    if (this.__mash === object) return

    this.paused = true;

    this.__selectedEffects = [];


    this.__mash = new Mash(object);
    this.__mash.events = this.events;

    this.__actions = new Actions({ mash: this.__mash, masher: this });

    // console.log("set mash setting selectedClips")
    this.selectedClips = []; // so mash gets copied into __pristine

    this.handleChangeMashFrames();

    this.composition.mash = this.mash;
    this.time = TimeFactory.createFromSeconds(0, this.fps);

    this.rebuffer();
    this.redraw();
    if (this.autoplay) this.paused = false;
  }

  get mashEndTime() { return TimeFactory.createFromFrame(this.__mashFrames, this.mash.quantize) }

  get muted() { return this.__muted }
  set muted(value = false) {
    this.__muted = value;
    this.handleGainChange();
  }

  get paused() { return this.__paused }
  set paused(value) {
    if (!this.__mashFrames) value = true;
    if (this.__paused !== value) {
      this.__paused = value;
      this.composition.paused = value;
      if (this.__paused) {
        this.__set_moving(false);
        if (this.__buffer_timer) {
          clearInterval(this.__buffer_timer);
          this.__buffer_timer = 0;
        }
      } else {
        if (! this.__buffer_timer) {
          this.__buffer_timer = setInterval(this.rebuffer, 2000);
        }
        this.rebuffer();
        this.redraw();
      }
    }
  }

  get position() {
    let per = 0;
    if (this.__time.frame) {
      per = this.__time.seconds / this.duration;
      if (per !== 1) per = parseFloat(per.toFixed(this.precision));
    }
    return per
  }
  set position(value = 0) { this.time = TimeFactory.createFromSeconds(this.duration * value, this.fps); }

  get position_step() {
    const zeros = "0".repeat(this.precision - 1);
    return parseFloat(`0.${zeros}1`)
  }

  get precision() {
    if (Is.undefined(this.__precision)) {
      this.__precision = this.initializeProperty(MasherProperty.precision);
    }
    return this.__precision

  }
  set precision(value) { this.__precision = value; }

  get selectedClip() {
    if (this.__selectedClips.length === 1) return this.__selectedClips[0]
  }
  set selectedClip(value) { this.selectedClips = value; }

  get selectedClipOrMash() { return this.selectedClip || this.__mash }

  get selectedClips() { return this.__selectedClips }

  set selectedClips(value) {
    this.__selectedClips = this.mash.filterClipSelection(value);
    this.__pristine = this.selectedClipOrMash.propertyValues;
    this.selectedEffects = [];
  }

  get selectedEffect() {
    if (this.__selectedEffects.length === 1) return this.__selectedEffects[0]
  }
  set selectedEffect(value){
    this.selectedEffects = Is.object(value)  && !Is.empty(value) ? [value] : [];
  }

  get selectedEffects() { return this.__selectedEffects }
  set selectedEffects(value) {
    const effects = this.selectedClipOrMash.effects;
    if (!effects) { // mash or multiple clips selected, or no effects
      this.__selectedEffects = [];
      this.__pristineEffect = {};
      return
    }

    const array = Is.array(value) ? value : [];
    this.__selectedEffects = array.filter(effect => effects.includes(effect));
    this.__pristineEffect = (this.selectedEffect && this.selectedEffect.propertyValues) || {};
  }

  get silenced() { return this.__paused || this.muted || !this.gain }

  get stalling() { return !this.__moving && !this.paused }

  get time() { return this.__time }
  set time(value) {
    const limited_time = this.__limit_time(value);
    const equal = this.__time.equalsTime(limited_time);
    this.__time = limited_time;
    this.composition.time = this.__time;

    if (!equal) this.handleChangeMash();
  }

  get urlsCached() { return this.composition.urlsInTimeRange }

  get volume() {
    if (Is.undefined(this.__volume)) {
      this.__volume = this.initializeProperty(MasherProperty.volume);
    }
    return this.__volume
  }
  set volume(value) {
    if (! Is.number(value)) throw(Errors.argument)

    this.__volume = value;
    this.handleGainChange();
  }

  /**
   * type - String audio|video|effect
   */
  add(object, addType, frameOrIndex, trackIndex) {
    // console.log("add", object, addType)
    if (!Is.object(object)) throw Errors.argument + object
    const type = Is.defined(addType) ? addType : object.type;

    if (type === MoveType.effect) {
      return this.addEffect(new Effect(object), frameOrIndex)
    }

    const media = MediaFactoryInstance.create({ type, ...object });

    const clip = ClipFactoryInstance.createFromObjectMedia(object, media, this.mash);
    return this.addClip(clip, frameOrIndex, trackIndex)
  }

  addClip(clip, frameOrIndex, trackIndex) {
    // console.log("addClip frameOrIndex", clip, frameOrIndex)
    Throw.unlessInstanceOf(clip, Clip);

    const { trackType } = clip;

    const clips = [clip];
    const options = {
      clip,
      type: ActionFactoryInstance.type.addClipsToTrack,
      redoSelectedClips: clips,
      trackType,
    };
    const track = this.mash.trackOfTypeAtIndex(trackType, trackIndex);
    const trackCount = this.mash[trackType].length;
    if (trackIndex || trackType === TrackType.audio) {
      options.trackIndex = trackIndex;
      clip.frame = track.frameForClipsNearFrame(clips, frameOrIndex);
      options.createTracks = Math.max(0, trackIndex + 1 - trackCount);
    } else {
      options.insertIndex = frameOrIndex;
      options.createTracks = Math.min(1, Math.max(0, 1 - trackCount));
    }
    this.actionCreate(options);
    return this.loadVisual().then(() => Promise.resolve(clip))
  }

  addEffect(effect, index) {
    // console.log(this.constructor.name, "addEffect", object, index)
    Throw.unlessInstanceOf(effect, Effect);

    const effects = this.selectedClipOrMash.effects;
    Throw.unlessInstanceOf(effects, Array, Errors.selection);

    const insertIndex = Is.integer(index) && index > 0 ? index : 0;
    const undoEffects = [...effects];
    const redoEffects = [...effects];
    redoEffects.splice(insertIndex, 0, effect);
    const options = {
      effects, undoEffects, redoEffects,
      type: ActionFactoryInstance.type.moveEffects
    };
    this.actionCreate(options);
    return this.loadVisual().then(() => Promise.resolve(effect))
  }
  /**
   *
   * @param {String} type audio or video
   */
  addTrack(trackType = TrackType.video) {
    if (!TrackTypes.includes(trackType)) throw Errors.type + trackType

    return this.actionCreate({ trackType, type: ActionFactoryInstance.type.addTrack })
  }

  can(method){
    var should_be_enabled = false;
    var z = this.__selectedClips.length;
    switch(method){
      case 'undo':{
        should_be_enabled = this.__actions.canUndo;
        break;
      }
      case 'redo':{
        should_be_enabled = this.__actions.canRedo;
        break;
      }
      case 'adjust':{
        should_be_enabled = (z > 0);
        if (should_be_enabled) should_be_enabled = (this.__selectedClips[0].track > 0);
        break;
      }
      case 'copy':{
        should_be_enabled = (z > 0);
        break;
      }
      case 'cut':
      case 'remove':{
        should_be_enabled = (this.__selectedClips.length);
        break;
      }
      case 'split':{
        should_be_enabled = clipCanBeSplit(this.selectedClip, this.time, this.mash.quantize);
        break
      }
      case 'freeze':{
        should_be_enabled = (z === 1);
        should_be_enabled &&= MediaType.video === this.selectedClip.type;
        should_be_enabled &&= clipCanBeSplit(this.selectedClip, this.time, this.mash.quantize);
        break;
      }
    }
    return should_be_enabled;
  }

  currentActionReusable(target, property) {
    if (!this.__actions.currentActionLast) return

    const action = this.__actions.currentAction;
    if (!Is.instanceOf(action, ChangeAction)) return

    if (!(action.target === target && action.property === property)) return

    return action
  }

  change(property) {
    if (!this.selectedClip) return this.changeMash(property)

    return this.changeClip(property)
  }

  changeClip(property) {
    if (!Is.string(property) || Is.empty(property)) throw Errors.property + property

    const options = { property, target: this.selectedClip };
    const [transform, transformProperty] = property.split(".");

    if (transformProperty) {
      // make sure first component is merger or scaler
      if (!TransformTypes.includes(transform)) throw Errors.property + transform

      if (transformProperty === 'id') {
        options.property = transform;
        options.redoValue = options.target[options.property].id;
      }
      else {
        // we'll call merger/scaler set property
        options.target = options.target[transform];
        options.property = transformProperty;
        options.redoValue = options.target[options.property];
      }
      console.log(this.constructor.name, "changeClip", transform, transformProperty, this.__pristine);

      options.undoValue = this.__pristine[transform][transformProperty];
    } else {
      options.undoValue = this.__pristine[property];
      options.redoValue = options.target[options.property];
    }

    const action = this.currentActionReusable(options.target, options.property);
    if (action) return action.updateAction(options.redoValue)

    switch(options.property) {
      case 'frames': {
        options.type = ActionFactoryInstance.type.changeFrames;
        break
      }
      case 'trim': {
        options.type = ActionFactoryInstance.type.changeTrim;
        break
      }
      default: options.type = ActionFactoryInstance.type.change;
    }
    return this.actionCreate(options)
  }

  changeEffect(property) {
    if (!Is.string(property) || Is.empty(property)) throw Errors.property

    const target = this.selectedEffect;
    if (Is.undefined(target)) throw Errors.selection

    const redoValue = target[property];
    const action = this.currentActionReusable(target, property);
    if (action) return action.updateAction(redoValue)

    const undoValue = this.__pristineEffect[property];
    const options = {
      type: ActionFactoryInstance.type.change,
      target, property, redoValue, undoValue
    };
    return this.actionCreate(options)
  }

  changeMash(property) {
    if (!Mash.properties.includes(property)) throw Errors.unknownMash + property

    const target = this.mash;
    const redoValue = this.mash[property];
    const action = this.currentActionReusable(target, property);
    if (action) return action.updateAction(redoValue)

    const options = {
      target,
      property,
      redoValue,
      undoValue: this.__pristine[property],
      type: ActionFactoryInstance.type.change,
    };
    // console.log("changeMash", options)

    return this.actionCreate(options)
  }

  delayedDraw() {
    // console.log("Masher.delayedDraw")
    // called when assets are cached
    if (!this.delayed_timer) {
      this.delayed_timer = setTimeout(() => {
        // console.log(this.constructor.name, "delayedDraw timeout", )
        this.delayed_timer = null;
        this.redraw();
      }, 50);
    }
  }

  // call when player removed from DOM
  destroy() { Mashers.delete(this); }

  handleAction(type, action) {
    this.events.emit(type, { action: action });
  }

  handleGainChange() { this.composition.gain = this.gain; }

  handleChangeMash(){
    this.paused = true; // make sure we are not playing
    this.rebuffer();
    this.redraw();
  }

  handleChangeMashFrames(){
    // console.log("handleChangeMashFrames")
    const mash_frames = this.mash.frames;
    if (this.__mashFrames !== mash_frames) {
      this.__mashFrames = mash_frames;
      // move back if we were positioned at a time later than new duration
      const max_frame = Math.max(0, this.endTime.frame - 1);
      if (max_frame < this.time.frame) this.frame = max_frame;
      else this.delayedDraw();
    }
  }

  handleMasher(event) {
    if (event.type !== Events.type) return console.warn("handleMasher", event)
    // console.log("handleMasher", event.detail)

    switch(event.detail.type) {
      case EventType.duration: {
        this.handleChangeMashFrames();
        break
      }
      case EventType.action: {
        const action = event.detail.action;

        this.selectedClips = action.selectedClips;
        this.selectedEffects = action.selectedEffects;
        switch (action.type) {
          case ActionFactoryInstance.type.changeAction: {
            if (action.property === "gain"){
              if (this.__moving && !this.silenced) {
                this.composition.adjustSourceGain(action.target);
              }
            }
            break
          }
          default: this.delayedDraw();
        }
        break
      }
      default: {
        this.delayedDraw();
      }
    }
  }

  handleRemoveActions(removedActions = []) {
    const type = removedActions.length ? EventType.truncate : EventType.add;
    this.handleAction(type, this.__actions.currentAction);
    this.handleChangeMash();
    // TODO: deprecated - stop calling and remove did method
    if (removedActions.length) this.did(removedActions.length);
  }

  initializeProperty(...properties) {
    for (let property of properties) {
      if (Is.defined(this.object[property])) return this.object[property]
    }
    return Default[properties[0]]
  }

  loadVisual() {
    return this.composition.loadTime()
  }
  media(clip) { return clip.media }

  move(objectOrArray, moveType, frameOrIndex, trackIndex) {
    if (!Is.object(objectOrArray)) throw Errors.argument + objectOrArray

    if (moveType === MoveType.effect) {
      return this.moveEffects(objectOrArray, frameOrIndex)
    }

    return this.moveClips(objectOrArray, frameOrIndex, trackIndex)
  }

  moveEffects(effectOrArray, index = 0) {
    // console.log(this.constructor.name, "moveEffects", effectOrArray, index)
    if (!Is.positive(index)) throw Errors.argument + index

    // Coerce.instanceArray?

    const array = Is.array(effectOrArray) ? effectOrArray : [effectOrArray];
    const moveEffects = array.filter(effect => Is.instanceOf(effect, Effect));
    if (Is.emptyarray(moveEffects)) throw Errors.argument + effectOrArray

    const effects = this.selectedClip.effects;
    const undoEffects = [...effects];

    const redoEffects = [];
    undoEffects.forEach((effect, i) => {
      if (i === index) redoEffects.push(...moveEffects);
      if (moveEffects.includes(effect)) return

      redoEffects.push(effect);
    });

    const options = {
      effects, undoEffects, redoEffects,
      type: ActionFactoryInstance.type.moveEffects
    };
    // console.log(this.constructor.name, "moveEffects", options)
    return this.actionCreate(options)
  }

  moveClips(clipOrArray, frameOrIndex = 0, trackIndex = 0) {
    // console.log("moveClips", "frameOrIndex", frameOrIndex, "trackIndex", trackIndex)
    if (!Is.positive(frameOrIndex)) throw Errors.argument + frameOrIndex
    if (!Is.positive(trackIndex)) throw Errors.argument + trackIndex

    const clips = this.mash.filterClipSelection(clipOrArray);
    if (Is.emptyarray(clips)) throw Errors.argument + clipOrArray

    const [firstClip] = clips;
    const { trackType, track: undoTrackIndex } = firstClip;
    const options = {
      clips, trackType, trackIndex, undoTrackIndex,
      type: ActionFactoryInstance.type.moveClips
    };

    const redoTrack = this.mash.trackOfTypeAtIndex(trackType, trackIndex);
    const undoTrack = this.mash.trackOfTypeAtIndex(trackType, undoTrackIndex);
    const currentIndex = redoTrack.clips.indexOf(firstClip);

    if (redoTrack.isMainVideo) options.insertIndex = frameOrIndex;
    if (undoTrack.isMainVideo) {
      options.undoInsertIndex = currentIndex;
      if (frameOrIndex < currentIndex) options.undoInsertIndex += clips.length;
    }

    if (!(redoTrack.isMainVideo && undoTrack.isMainVideo)) {
      const frames = clips.map(clip => clip.frame);
      const insertFrame =  redoTrack.frameForClipsNearFrame(clips, frameOrIndex);
      const offset = insertFrame - firstClip.frame;
      if (!offset) return // because there would be no change

      options.undoFrames = frames;
      options.redoFrames = frames.map(frame => frame + offset);
    }
    return this.actionCreate(options)
  }

  pause() {
    this.paused = true;
  }

  play() {
    this.paused = false;
  }

  rebuffer() {
    if (this.paused) return this.composition.loadTime()

    return this.composition.loadTimeRange()
  }

  redo(){
    if (this.__actions.canRedo) {
      this.__actions.redo();
      this.handleChangeMash();
    }
  }

  redraw() {
    if (! this.configured) return

    const video_buffered = this.composition.drawFrame();
    const no_audio = !this.__moving || this.silenced;
    const audio_buffered = no_audio || this.composition.bufferedTime;
    // console.log(this.constructor.name, "redraw audio_buffered:", audio_buffered)
    const all_buffered = video_buffered && audio_buffered;

    if (this.__moving !== all_buffered) {
      if (this.__moving) this.__set_moving(false);
      else if (!this.__paused && this.bufferedTimeRange) this.__set_moving(true);
    }
  }

  draw() { return this.composition.draw() }

  remove(objectOrArray, moveType) {
    if (!Is.object(objectOrArray)) throw Errors.argument + objectOrArray

    if (moveType === MoveType.effect) return this.removeEffects(objectOrArray)

    return this.removeClips(objectOrArray)
  }

  removeClips(clipOrArray) {
    const clips = this.mash.filterClipSelection(clipOrArray);
    if (Is.emptyarray(clips)) throw Errors.argument + clipOrArray

    const [firstClip] = clips;
    const track = this.mash.clipTrack(firstClip);
    const options = {
      clips, track, index: track.clips.indexOf(firstClip),
      type: ActionFactoryInstance.type.removeClips
    };
    return this.actionCreate(options)
  }

  removeEffects(effectOrArray) {
    const array = Is.array(effectOrArray) ? effectOrArray : [effectOrArray];
    const removeEffects = array.filter(effect => Is.instanceOf(effect, Effect));
    if (Is.emptyarray(removeEffects)) throw Errors.argument + effectOrArray

    const effects = this.selectedClip.effects;
    const undoEffects = [...effects];
    const redoEffects = effects.filter(effect => !removeEffects.includes(effect));

    const options = {
      redoSelectedEffects: [],
      effects, undoEffects, redoEffects,
      type: ActionFactoryInstance.type.moveEffects
    };
    return this.actionCreate(options)
  }

  select(object, toggle_selected) {
    if (!object) {
      // console.log("Masher.select FALSE", object, toggle_selected)
      this.selectedClip = false;
      return
    }
    // console.log('Masher.select TRUE', object, toggle_selected);
    var media, i, array = [], key_array = '__selectedClips', key_prop = 'selectedClips';
    media = this.mash.findMedia(object.id);
    if (media){
      if (MediaType.effect === media.type){
        key_array = '__selectedEffects';
        key_prop = 'selectedEffects';
      }
      if (toggle_selected) {
        i = this[key_array].indexOf(object);
        switch(this[key_array].length){
          case 0: {
            array.push(object);
            break;
          }
          case 1: {
            if (i > -1) break;
          } // potential intentional fall through to default
          default: {
            if (i < 0) {
              array.push(object);
              array = array.concat(this[key_array]);
            } else {
              if (i) array = array.concat(this[key_array].slice(0, i));
              if (i < (this[key_array].length - 1)) array = array.concat(this[key_array].slice(i + 1));
            }
          }

        }
      }
      else {
        if (-1 < this[key_array].indexOf(object)) return;
        array.push(object);
      }
    }
    // console.log('select', key_prop, array);
    this[key_prop] = array;
  }

  selected(object) {
    if (Is.instanceOf(object, Effect)) return this.selectedEffects.includes(object)

    return this.selectedClips.includes(object)
  }

  selectEffect(effect, toggle_selected){
    if (Is.object(effect)) return this.select(effect, toggle_selected);
    else if (! toggle_selected) this.selectedEffect = effect;
  }

  split() {
    const splitClip = this.selectedClip;
    if (!clipCanBeSplit(splitClip, this.time, this.mash.quantize)) return

    const scaled = this.time.scale(this.mash.quantize);
    const undoFrames = splitClip.frames;
    const redoFrames = scaled.frame - splitClip.frame;
    const insertClip = splitClip.copy;
    insertClip.frames = undoFrames - redoFrames;
    insertClip.frame = scaled.frame;
    if (splitClip.properties.includes("trim")) insertClip.trim += redoFrames;

    const trackClips = this.mash.clipTrack(splitClip).clips;
    const options = {
      type: ActionFactoryInstance.type.split,
      splitClip,
      insertClip,
      trackClips,
      redoFrames,
      undoFrames,
      index: 1 + trackClips.indexOf(splitClip),
      redoSelectedClips: [insertClip],
      undoSelectedClips: [splitClip],
    };
    return this.actionCreate(options)
  }

  freeze() {
    const freezeClip = this.selectedClip;
    if (!clipCanBeSplit(freezeClip, this.time, this.mash.quantize)) return
    if (MediaType.video !== freezeClip.type) return

    const scaled = this.time.scale(this.mash.quantize);
    const trackClips = this.mash.clipTrack(freezeClip).clips;
    const insertClip = freezeClip.copy;
    const frozenClip = freezeClip.copy;

    const options = {
      frames: freezeClip.frames - (scaled.frame - freezeClip.frame),
      freezeClip, frozenClip, insertClip, trackClips,
      redoSelectedClips: [frozenClip],
      index: 1 + trackClips.indexOf(freezeClip),
      type: ActionFactoryInstance.type.freeze,
    };

    frozenClip.frame = scaled.frame;
    frozenClip.frames = 1;
    frozenClip.trim = freezeClip.trim + (scaled.frame - freezeClip.frame);
    insertClip.frame = scaled.frame + 1;
    insertClip.frames = options.frames - 1;
    insertClip.trim = frozenClip.trim + 1;

    return this.actionCreate(options)
  }

  undo() {
    if (this.__actions.canUndo) {
      this.__actions.undo();
      this.handleChangeMash();
    }
  }


  __limit_time(time) {
    const scaled = time.scale(this.fps);
    const end_time = this.mashEndTime.scale(this.fps);
    if (scaled.frame > end_time.frame) return end_time

    return scaled
    // console.log("__limit_time", time)
    // var start_time = time.copy;
    // var limit_time = this.mashEndTime
    // limit_time.frame = Math.max(0, limit_time.frame - 1);
    // start_time = start_time.min(limit_time);
    // start_time = start_time.scale(this.fps, 'floor');
    // return start_time;
  }

  __load_timed(){
    // console.log(this.constructor.name, "__load_timed moving: ", this.__moving)
    if (this.__moving){
      // hopefully runs twice a frame
      var now = TimeFactory.createFromSeconds(this.composition.seconds, this.fps, 'ceil');
      if (now.frame !== this.__limit_time(now).frame) {
        // loop back to start or pause
        if (! this.loop) {
          this.paused = true;
        } else {
          this.frame = 0;
          this.paused = false;
        }
      } else {
        if (! now.equalsTime(this.__drawnTime)) {
          this.__time = now.scale(this.fps);
          this.redraw();
        }
      }
    }
  }

  __set_moving(tf) {
    // console.log("__set_moving", tf)
    if (this.__moving !== tf) {
      this.__moving = tf;
      if (this.__moving) {
        var $this = this;
        this.__load_timer = setInterval(() => {$this.__load_timed();}, 500 / this.fps);
        // start up the sound buffer with our current time, rather than displayed
        this.composition.startPlaying();
        this.rebuffer(); // get sounds buffering now, rather than next timer execution
      } else {
        this.composition.stopPlaying();
        clearInterval(this.__load_timer);
        this.__load_timer = false;
      }
    }
  }

  actionCreate(object) {
    const action = ActionFactoryInstance.createFromObjectMasher(object, this);
    const removed = this.__actions.do(action);
    this.handleRemoveActions(removed);
  }
}




Object.defineProperties(Masher, {
  type: { value: "masher" },
  properties: { get: function() { return Object.values(MasherProperty) }}

});
Object.defineProperties(Masher.prototype, {
  ...contexts,
  ...deprecated,
});

const MasherTypes = ["masher"];
const MasherType = Object.fromEntries(MasherTypes.map(type => [type, type]));
const INTERVAL_TICS = 10 * 1000;

class MasherFactory extends Factory {
  constructor() {
    super();
    this.install(MasherType.masher, Masher);
  }

  /**
   *
   * @param {Object} object containing options
   * @returns Masher
   */
  create(object = MasherType.masher) {
    const masher = super.create(object);
    if (!this.mashers.length) this.start();
    this.mashers.push(masher);
    return masher
  }
}

Object.defineProperties(MasherFactory.prototype, {
  destroy: {
    value: function(masher) {
      const index = this.mashers.indexOf(masher);
      if (index < 0) return

      this.mashers.splice(index, 1);
      if (!this.mashers.length) this.stop();
    }
  },
  handleInterval: {
    value: function() {
      // console.log(this.constructor.name, "handleInterval")
      const urls = new UrlsByType;
      this.mashers.forEach(masher => urls.concat(masher.urlsCached));
      const array = urls.urls;
      CacheInstance.urls().forEach(url => array.includes(url) || CacheInstance.remove(url));
    }
  },
  mashers: {
    get: function() {
      if (Is.undefined(this.__mashers)) this.__mashers = [];
      return this.__mashers
    }
  },

  start: {
    value: function() {
      // console.log(this.constructor.name, "start")
      if (this.interval) return

      this.interval = setInterval(this.handleInterval.bind(this), INTERVAL_TICS);
    }
  },
  stop: {
    value: function() {
      // console.log(this.constructor.name, "stop")
      if (!this.interval) return

      clearInterval(this.interval);
      this.interval = null;
    }
  },
  type: { value: MasherType },
  types: { value: MasherTypes },
});

const MasherFactoryInstance = new MasherFactory;

exports.ClipType = ClipType;
exports.ClipTypes = ClipTypes;
exports.Default = Default;
exports.Errors = Errors;
exports.EventType = EventType;
exports.EventTypes = EventTypes;
exports.LoadType = LoadType;
exports.LoadTypes = LoadTypes;
exports.MasherFactory = MasherFactoryInstance;
exports.MediaType = MediaType;
exports.MediaTypes = MediaTypes;
exports.Module = ModuleInstance;
exports.ModuleType = ModuleType;
exports.ModuleTypes = ModuleTypes;
exports.MoveType = MoveType;
exports.MoveTypes = MoveTypes;
exports.Property = PropertyInstance;
exports.TimeFactory = TimeFactory;
exports.TrackType = TrackType;
exports.TrackTypes = TrackTypes;
exports.TransformType = TransformType;
exports.TransformTypes = TransformTypes;
//# sourceMappingURL=index.js.map
