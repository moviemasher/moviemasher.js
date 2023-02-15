
import { Plugin } from "../Plugin"

export type LanguageEnglish = 'en'
export const LanguageEnglish: LanguageEnglish = 'en'
export type Language = string | LanguageEnglish



/**
 * @category Plugin
 */
export interface LanguagePlugin extends Plugin {
  type: Language
}

/**
 * @category Plugin
 */
export interface PluginsByLanguage extends Record<Language, LanguagePlugin> {}
