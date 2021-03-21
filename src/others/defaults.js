import DefaultWoff from '../font/default.woff'

const modules = {
  font: {
    "label": "Blackout Two AM",
    "id":"com.moviemasher.font.default",
    "type":"font",
    "source": DefaultWoff,
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
}
const module_for_type = (type, mod_id) => {
  const mod = modules[type]
  if (mod && mod_id && (mod.id !== mod_id)) return null
  return mod
}

const module_from_type = (type) => {
  const ob = {}
  const mod = module_for_type(type)
  if (! mod) console.error('Defaults.module_from_type not found', type)
  else ob.id = mod.id
  return ob
}

export default { module_for_type, module_from_type }
