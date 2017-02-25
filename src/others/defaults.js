var Defaults = {
  modules: {
    font: {
      "label": "Blackout Two AM",
      "id":"com.moviemasher.font.default",
      "type":"font",
      "source": "media/font/default.ttf",
      "family":"Blackout Two AM"
    },
    merger: {
      label: 'Top Left',
      id: 'com.moviemasher.merger.default',
      "filters": [
        {
          "id": "overlay",
          "parameters": [
            {
              "name": "x",
              "value":"0"
            },{
              "name": "y",
              "value":"0"
            }
          ]
        }
      ]
    },
    scaler: {
      label: 'Stretch',
      id: 'com.moviemasher.scaler.default',
      "filters": [
        {
          "id": "scale",
          "parameters": [
            {
              "name": "width",
              "value":"mm_width"
            },{
              "name": "height",
              "value":"mm_height"
            }
          ]
        },{
          "id": "setsar",
          "parameters": [
            {
              "name": "sar",
              "value":"1"
            },{
              "name": "max",
              "value":"1"
            }
          ]
        }
      ]
    }
  },
  module_for_type: function(type, mod_id) {
    var mod = Defaults.modules[type];
    if (mod && mod_id && (mod.id !== mod_id)) mod = null;
    return mod;
  },
  module_from_type: function(type){
    var ob = {}, mod = Defaults.module_for_type(type);
    if (! mod) console.error('Defaults.module_from_type not found', type);
    else ob.id = mod.id;
    return ob;
  },
};
MovieMasher.Defaults = Defaults;
