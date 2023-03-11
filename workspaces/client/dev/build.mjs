import path from 'path'
import { frameworks } from '../../../dev/utils/frameworks.mjs'
import { packageJson } from "../../../dev/utils/rewritePackageFile.mjs"
import { replace } from "../../../dev/utils/replace.mjs"

const build = () => {
  const packageNamePrefix = 'client'
  const packageLabel = 'Client'
  const frameworkQuotedRegex = /'framework'/g

  const rootDir = path.resolve('../../')
  const packagesDir = path.join(rootDir, 'packages')
  const outputDir = path.join(packagesDir, packageNamePrefix)

  const devDependencies = {
    react: {

    },
    svelte: {}
  }

  const peerDependencies = {
    react: {
      "react": "^16.13.1 || ^17.0.2 || ^18.0.0",
      "react-dom": "^16.13.1 || ^17.0.2 || ^18.0.0"
    },
    svelte: {}
  }
  const scripts = {
    react: { 
      build: 'rollup -c dev/rollup.config.mjs',
    },
    svelte: {}
  }
  frameworks().forEach(framework => {
    const frameworkQuoted = `'${framework}'`
    const frameworkName = `${framework[0].toUpperCase()}${framework.slice(1)}`
    const packageDir = `${outputDir}/${framework}`
    const packageName = `${packageNamePrefix}-${framework}`

    console.log(framework)
    // package.json
    packageJson( { 
      src: path.resolve('./package.json'),
      dest: path.join(packageDir, 'package.json'), 
      replacements: [
        { 
          replace: packageName, search: packageNamePrefix, 
          keys: ['name', 'types', 'module', 'main', 'typedoc.displayName']
        },
        { 
          replace: `Movie Masher ${frameworkName} ${packageLabel}`,
          key: 'description'
        },
        {
          replace: { build: 'rollup -c dev/rollup.config.mjs' },
          key: 'scripts'
        },
        {
          replace: {
            "@moviemasher/client-core": "5.1.2",
            ...peerDependencies[framework]
          },
          key: 'peerDependencies'
        },
        { replace: scripts[framework], key: 'scripts' },
        { replace: devDependencies[framework], key: 'devDependencies' },
       
      ], 
    })

    // README.md
    replace({ 
      src: path.resolve('README.md'),
      dest: path.join(packageDir, 'README.md'),
      replacements: [
        { search: packageLabel, replace: frameworkName }
      ]
    })

    switch (framework) {
      case 'react': {
        // rollup.config.mjs
        replace({
          src: path.resolve('src/rollup.config.mjs'),
          dest: path.join(packageDir, 'dev/rollup.config.mjs'),
          replacements: [
            { search: frameworkQuotedRegex, replace: frameworkQuoted },
          ]
        })
      }
    }
  })
}

build()