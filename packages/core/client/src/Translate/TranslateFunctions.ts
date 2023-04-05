
import type {
  Strings,
  TranslateArgs, 
} from '@moviemasher/lib-core'
import { 
  DashChar, EnvironmentKeyLanguages, errorThrow, 
  isPopulatedString, 
  isIdentified,
  isString,
  isValueRecord,
  Runtime
  } from '@moviemasher/lib-core'

// import TranslateLocales from './locales.json'

const LocaleEnglish = 'en'
const isTranslateArgs = (value: any): value is TranslateArgs => {
  return isIdentified(value)
    && (!('locale' in value) || isString(value.locale))
    && (!('values' in value) || isValueRecord(value.values));
};
function assertTranslateArgs(value: any, name?: string): asserts value is TranslateArgs {
  if (!isTranslateArgs(value))
    errorThrow(value, 'TranslateArgs', name);
}
export const translateArgs = (value: any): TranslateArgs => {
  assertTranslateArgs(value);
  return { id: value.id, locale: value.locale, values: value.values };
};


export const translate = (args: TranslateArgs): string => {
  const { id, values, locale } = args
  
  const definedLocale = locale || translateLocale()
  return ''
  // const orError = pluginDataOrError(definedLocale, TranslateType) 
  // if (isDefiniteError(orError)) return ''
  
  // return orError.data.translate(id, values)
}

export type TranslateFunction = typeof translate

const translateBrowserLocale = (): string => (
  globalThis.window?.navigator?.language || ''
)


const TranslatePrivate = {
  defaultLocale: LocaleEnglish,
  locale: '',
  locales: [] as string[],
  warned: false,
}

export const translateDefaultLocale = (locale?: string): string => {
  console.log('translateDefaultLocale', locale, TranslatePrivate.defaultLocale)
  if (isPopulatedString(locale)) TranslatePrivate.defaultLocale = locale
  return TranslatePrivate.defaultLocale
}

const translateId = (id: string) : string => id.split(DashChar)[0] || ''

export const translateLocale = (locale?: string): string => {
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

export const translateLocales = (): string[] => {
  if (TranslatePrivate.locales.length) return TranslatePrivate.locales

  const allLocales: Strings = []//Object.keys(TranslateLocales)
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
