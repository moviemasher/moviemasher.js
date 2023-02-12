
import { Plugin } from "../Plugin"

export type LanguageEnglish = 'en'
export const LanguageEnglish: LanguageEnglish = 'en'
export type Language = string | LanguageEnglish
export interface LanguagePlugin extends Plugin {
  type: Language
}
export type PluginsByLanguage = Record<Language, LanguagePlugin>
