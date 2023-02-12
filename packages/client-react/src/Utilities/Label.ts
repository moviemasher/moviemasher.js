import { isString, NestedStringRecord, StringRecord } from "@moviemasher/moviemasher.js"

const LabelRegex = /{{([a-z0-9_]*)}}/


export const labelObjects: NestedStringRecord = {
  internal: 'Internal Error',
  client: { internal: 'Internal Client Error' },
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
export const labels: StringRecord = {
  audible: 'Audible',
  clip: 'Clip',
  update: 'Save',
  delete: 'Remove {{type}}',
  unlabeled: 'Unlabeled {{type}}',
  analyze: 'Analyzing...',
  load: 'Loading...',
  complete: 'Completed',
  create: 'New',
  render: 'Render',
  view: 'View',
  open: 'Open...',
  undo: 'Undo',
  redo: 'Redo',
  mash: 'Mash',
}

export const labelLookup = (id: string): string => {
  let object: any = labelObjects
  const components = id.split('.') 
  for (const component of components) {
    const child = object[component]
    if (isString(child)) return child

    object = child
  }
  return ''
}

export const labelTranslate = (id: string): string => {
  if (id.includes('.')) return labelLookup(id)

  return labels[id] || id
}

export const labelInterpolate = (id: string, context: StringRecord): string => {
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
