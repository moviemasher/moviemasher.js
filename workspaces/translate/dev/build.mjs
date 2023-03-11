import fs from 'fs'
import path from 'path'

import { languages } from "./languages.mjs"
import { packageJson } from "../../../dev/utils/rewritePackageFile.mjs"

const build = () => {
  const packageNamePrefix = 'translate'
  const packageLabel = 'Translate'
  const rootDir = path.resolve('../../')
  const packagesDir = path.resolve(rootDir, 'packages')
  const outputDir = path.join(packagesDir, packageNamePrefix)
  const languageCodes = languages()
  const translateConfigDest = path.join(packagesDir, '/core/client/src/Translate/locales.json')

  const translateConfig = {}

  languageCodes.forEach(locale => {
    const packageDir = `${outputDir}/${locale}`
    fs.mkdirSync(`${packageDir}/src/locale`, { recursive: true })
    fs.mkdirSync(`${packageDir}/dev`, { recursive: true })
    
    const localePath = path.resolve(`src/locale/${locale}.json`)
    const localeText = fs.readFileSync(localePath, 'utf8')
    const { translate } = JSON.parse(localeText)
    translateConfig[locale] = translate
  })
  const { en: englishConfig} = translateConfig
  const { 
    identifier: englishIdentifier, languages: englishLanguages 
  } = englishConfig
  const indexPath = path.resolve('src/index.ts')
  const englishIdentifierQuotedRegex = new RegExp(`'${englishIdentifier}'`, 'g') 
  const enQuotedRegex = /'en'/g
  const enDotJsonRegex = /en\.json/
  const identifierRegex = /Identifier/g
  languageCodes.forEach(locale => {
    const localePath = path.resolve(`src/locale/${locale}.json`)
    const config = translateConfig[locale]
    const { identifier } = config

    const { language: languageInDefault } = englishConfig
    const { [locale]: localeInDefault } = englishLanguages
    console.log(localeInDefault, languageInDefault)
    const localeQuoted = `'${locale}'`
    const quotedLabel = `'${localeInDefault}'`
    const packageName = `${packageNamePrefix}-${locale}`
    const packageDir = `${outputDir}/${locale}`

    // package.json
    packageJson( { 
      dest: packageDir, 
      replacements: [
        { 
          replace: packageName, search: packageNamePrefix, 
          keys: ['name', 'types', 'module', 'main', 'typedoc.displayName']
        },
        { 
          replace: `Movie Masher ${packageLabel} Plugin for ${localeInDefault} ${languageInDefault}`,
          key: 'description'
        },
        {
          replace: { build: 'rollup -c dev/rollup.config.mjs' },
          key: 'scripts'
        },
      ], 
    })

    // src/index.ts
    const indexDest = `${packageDir}/src/index.ts`
    const indexText = fs.readFileSync(indexPath, 'utf8')
    const indexReplacedEn = indexText.replace(enQuotedRegex, localeQuoted)
    const indexReplacedJson = indexReplacedEn.replace(enDotJsonRegex, `${locale}.json`)
    const indexReplaced = indexReplacedJson.replace(identifierRegex, identifier)
    fs.writeFileSync(indexDest, indexReplaced)
    console.log('Wrote', indexDest.slice(rootDir.length + 1))

    // src/locales/[locale].json
    const localeDest = `${packageDir}/src/locale/${locale}.json`
    fs.copyFileSync(localePath, localeDest)
    console.log('Wrote', localeDest.slice(rootDir.length + 1))

    // dev/rollup.config.mjs
    replace({
      src: 'src/rollup.config.mjs',
      dest: `${packageDir}/dev/rollup.config.mjs`,
      replacements: [
        { search: enQuotedRegex, replace: localeQuoted },
        { search: englishIdentifierQuotedRegex, replace: quotedLabel}
      ]
    })
  })

  console.log(`${packageLabel} Configuration`)
  fs.writeFileSync(translateConfigDest, JSON.stringify(translateConfig, null, 2))
  console.log('Wrote', translateConfigDest.slice(rootDir.length + 1))
    
}

build()