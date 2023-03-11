import { Plugin, ThemeType } from '../Plugin'

export type Theme = string 

/**
 * @category Plugin
 */
export interface ThemePlugin extends Plugin {
  type: ThemeType
  theme: Theme
  svgElement(id: string): SVGSVGElement
}

export const ThemeDefault: Theme = 'default'



export type ThemePluginsByType = Record<Theme, ThemePlugin>

