import { DashChar, EnvironmentKeyLanguages, ErrorName, errorThrow, isPlugin, 
  isPopulatedString, Locale, LocaleEnglish, plugin, 
  Runtime, TranslatePlugin, TranslateType, TranslateArgs, pluginDataOrErrorPromise, isDefiniteError, pluginDataOrError, PluginDataOrError, error
} from '@moviemasher/moviemasher.js'

import TranslateLocales from './locales.json'

export const translate = (args: TranslateArgs): string => {
  const { id, values, locale } = args
  
  const definedLocale = locale || translateLocale()
  const orError = pluginDataOrError(definedLocale, TranslateType) 
  if (isDefiniteError(orError)) return ''
  
  return orError.data.translate(id, values)
}

export type TranslateFunction = typeof translate

const translateBrowserLocale = (): Locale => (
  globalThis.window?.navigator?.language || ''
)


const TranslatePrivate = {
  defaultLocale: LocaleEnglish,
  locale: '' as Locale,
  locales: [] as Locale[],
  warned: false,
}

export const translateDefaultLocale = (locale?: Locale): Locale => {
  console.log('translateDefaultLocale', locale, TranslatePrivate.defaultLocale)
  if (isPopulatedString(locale)) TranslatePrivate.defaultLocale = locale
  return TranslatePrivate.defaultLocale
}

const translateId = (id: string) : Locale => id.split(DashChar)[0] || ''

export const translateLocale = (locale?: Locale): Locale => {
  if (isPopulatedString(locale)) return TranslatePrivate.locale = locale
  
  if (TranslatePrivate.locale) return TranslatePrivate.locale

  const browserLocale = translateBrowserLocale()
  if (browserLocale) {
    const locales = translateLocales()
    if (locales.includes(browserLocale)) return TranslatePrivate.locale = browserLocale
    
    const id = translateId(browserLocale)
    if (locales.includes(id)) return TranslatePrivate.locale = id
    console.log('translateLocale', id, 'NOT IN', locales)
  } else console.log('translateLocale NO BROWSER LOCALE')

  return TranslatePrivate.locale = translateDefaultLocale()
}

export const translateLocales = (): Locale[] => {
  if (TranslatePrivate.locales.length) return TranslatePrivate.locales

  const allLocales = Object.keys(TranslateLocales)
  console.log('translateLocales allLocales', allLocales)
  
  const { environment } = Runtime
  const environmentLocales = environment.getArray(EnvironmentKeyLanguages)
  console.log('translateLocales environmentLocales', environmentLocales)
  const filtered = allLocales.filter(locale => environmentLocales.includes(locale))
  if (!filtered.length) return TranslatePrivate.locales = allLocales

  const [first] = filtered
  TranslatePrivate.locale = first
  return TranslatePrivate.locales = filtered
}

export const translatePluginPromise = (locale?: string): Promise<PluginDataOrError<TranslatePlugin>> => {
  const definedLocale = translateLocale(locale)
  return pluginDataOrErrorPromise(definedLocale, TranslateType).then(orError => {
    if (isDefiniteError(orError)) return orError

    const { data: plugin } = orError
    if (isPlugin(plugin)) return { data: plugin as TranslatePlugin }

    const defaultLocale = translateDefaultLocale()
    if (locale === defaultLocale) {
      if (!TranslatePrivate.warned) {
        TranslatePrivate.warned = true
        return errorThrow(ErrorName.Internal)
      }
      return error(ErrorName.Type)
    }
    if (definedLocale.includes(DashChar)) {
      const id = translateId(definedLocale)
      if (isPopulatedString(id)) return translatePluginPromise(id)
    }
    return translatePluginPromise(defaultLocale)
  })
}

export const translatePromise = (args: TranslateArgs): Promise<string> => {
  const { id, values, locale } = args
  
  const code = translateLocale(locale)
  return translatePluginPromise(code).then(orError => {
    if (!isDefiniteError(orError)) return orError.data.translate(id, values)
    return ''
})
}

export type TranslatePromiseFunction = typeof translatePromise

