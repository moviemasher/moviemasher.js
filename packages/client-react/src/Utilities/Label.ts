import { StringObject } from "@moviemasher/moviemasher.js"

const LabelRegex = /{{([a-z0-9_]*)}}/

export const labelObjects: Record<string, StringObject> = {
  import: {
    bytes: 'Size above {{value}}',
    extension: 'Extension {{value}}',
    type: 'Type {{value}}',
    size: 'Dimensions {{value}}',
    duration: 'Duration {{value}}',
    render: '{{value}}',
    displaySize: '{{width}}x{{height}}',
  }
}
export const labels: StringObject = {
  audible: 'Audible',
  clip: 'Clip',
  update: 'Save',
  delete: 'Remove {{type}}',
  unlabeled: 'Unlabeled {{type}}',
  analyze: 'Analyzing...',
  load: 'Loading...',
  complete: 'Completed',
  layer: 'Layer',
  create: 'New',
  render: 'Render',
  view: 'View',
  open: 'Open...',
  undo: 'Undo',
  redo: 'Redo',
  cast: 'Cast',
  mash: 'Mash',
}

export const labelLookup = (id: string): string => {
  const [first, second] = id.split('.') 
  return labelObjects[first][second]
}

export const labelTranslate = (id: string): string => {
  if (id.includes('.')) return labelLookup(id)

  return labels[id] || id
}

export const labelInterpolate = (id: string, context: StringObject): string => {
  let translated = labelTranslate(id)
  
  const matches = translated.match(LabelRegex)
  if (!matches) return translated

  matches.forEach((match, index) => {
    if (!index) return
    const search = `{{${match}}}`
    const replace = labelTranslate(context[match])
    
    translated = translated.replace(search, replace)
  })

  return translated
}
