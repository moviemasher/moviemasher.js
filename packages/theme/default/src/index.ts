import svgConfig from './svg/svg.json' assert { type: 'json' }

import { Runtime, ThemeType, ThemePlugin, Theme, StringRecord } from '@moviemasher/moviemasher.js'
import { svgFromString } from '@moviemasher/client-core'


export const ThemeDefault: Theme = 'default'
class PluginThemeDefault implements ThemePlugin {
  private configuration: StringRecord = svgConfig
  svgElement(id: string): SVGSVGElement {
    return svgFromString(this.configuration[id])
  }

  theme = ThemeDefault
  
  type = ThemeType
}

Runtime.plugins[ThemeType].default = new PluginThemeDefault()