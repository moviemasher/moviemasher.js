
import { Identified } from '../../Base/Identified'
import { ValueRecord } from '../../Types/Core'
import { Plugin, TranslateType } from '../Plugin'

export type Locale = string
export const LocaleEnglish: Locale = 'en'

/**
 * @category Plugin
 */
export interface TranslatePlugin extends Plugin {
  type: TranslateType
  locale: Locale
  translate(id: string, context?: ValueRecord): string
}

/**
 * @category Plugin
 */
export interface PluginsByLocale extends Record<Locale, TranslatePlugin> {}

export interface TranslateArgs extends Identified {
  locale?: string
  values?: ValueRecord
}

export interface TranslateOptions extends Partial<TranslateArgs> {}


export type TranslatePluginsByType = Record<Locale, TranslatePlugin>
