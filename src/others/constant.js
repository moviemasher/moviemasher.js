Constant = {
  audio: 'audio',
  both: 'both',
  effect: 'effect',
  filter: 'filter',
  font: 'font',
  frame: 'frame',
  freeze: 'freeze',
  gain: 'gain',
  image: 'image',
  merger: 'merger',
  mute_shorthand: '0',
  mute: '0,0,1,0',
  property_types: {
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
  scaler: 'scaler',
  source: 'source',
  theme: 'theme',
  transition: 'transition',
  video: 'video',
  volume: 'volume',
};
Constant.track_types = [Constant.video, Constant.audio];
MovieMasher.Constant = Constant;
