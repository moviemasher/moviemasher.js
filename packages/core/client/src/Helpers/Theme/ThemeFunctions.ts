import { 
  errorThrow, isDefiniteError, pluginDataOrError, TypeTheme 
} from '@moviemasher/lib-core'
import { IconId } from './Theme.js'

export const themeIcon = (id: IconId): SVGSVGElement => {

  const orError = pluginDataOrError('default', TypeTheme)
  if (isDefiniteError(orError)) return errorThrow(orError)
  
  const { data: themePlugin } = orError
  return themePlugin.svgElement(id)
}