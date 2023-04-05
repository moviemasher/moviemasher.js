import path from 'path';
import { createFilter } from '@rollup/pluginutils';
import MagicString from 'magic-string';

const loadCache = {};
const resolveCache = {};
const imports = {};
let sourceRoot;

const dependencies = {};
const loadPackageJson = async (me, importer) => {
  const { default: pkg } = await import(path.resolve(path.dirname(sourceRoot), 'package.json'), { assert: { type: 'json' } });
  // // console.log('PACKAGE', source, pkg);
  if (pkg) {
    const { dependencies: pkgDependencies = {}, imports: pkgImports = {} } = pkg;
    Object.assign(dependencies, pkgDependencies);

    // add to imports, but without the hash in key
    Object.entries(pkgImports).forEach(([hashed, value]) => {
      imports[hashed.slice(1)] = value;
    });
    // resolve all dependecies
    const promises = dependencyKeys().map(pkg => resolveSource(me, pkg, importer));
    // console.debug('loadPackageJson RESOLVING', dependencyKeys());
    await Promise.all(promises);
    // console.debug('loadPackageJson RESOLVED', dependencyKeys(), importKeys());  
  }

};
const importPrefixes = {};
const dependencyKeys = () => Object.keys(dependencies);
const importKeys = () => Object.keys(imports);

const resolveSource = (me, source, importer)=> {
  if (resolveCache[source]) return Promise.resolve(resolveCache[source]);
  
  // console.debug('resolveId RESOLVING', source);
  return me.resolve(source, importer, { skipSelf: true }).then(resolution => {
    if (resolution && !resolution.external) {
      resolveCache[source] = resolution;
      const key = findImport(source) || findDependency(source);
      if (key) {

        importPrefixes[key] = path.dirname(resolution.id);
      } else {
        console.error('resolveId MISSING findImport and findDependency', source, importer, ...Object.keys(imports))
      }
    }
    // console.debug('resolveId RESOLVED', source, resolveCache[source]);
    return resolveCache[source]
  })
}

const resolveAndLoadSource = (me, source, importer) => {
  return resolveSource(me, source, importer).then(resolution => {
    if (!resolution) return null;

    const { id } = resolution;
    if (loadCache[id]) return loadCache[id]
    
    // console.debug('resolveId LOADING', id);
    return me.load(resolution).then(loaded => {
      if (loaded) loadCache[id] = loaded;
      // console.debug('resolveId LOADED', id);
      return loadCache[id];
    })
  })
}
const findImport = lib => Object.keys(imports).find(key => lib.startsWith(key));

const findDependency = lib => dependencyKeys().find(key => lib.startsWith(key));

const resolveLib = (importSource, modulePath) => {
  // importSource is full import path from source file
  // libId is the library id itself 
  let importsKey = importSource;
  const foundDependency = findDependency(importSource);
  const foundImport = Object.keys(imports).find(key => key.startsWith(foundDependency));
  if (!foundDependency) {
    // console.debug('resolveLib NO DEPENDENCY', importSource, ...Object.keys(dependencies));
        
  }
  
  if (!foundImport) {
    // console.debug('resolveLib NO IMPORT', importSource, ...Object.keys(imports));
    key = foundDependency;
    if (key) foundImport = `${key}/`;
  }
  if (!foundImport) {
    console.error('resolveLib MISSING', importSource, modulePath, ...Object.keys(imports))
    return null;
  }

  const libImport = imports[foundImport];
  if (!libImport) {
    console.error('resolveLib MISSING IMPORT', foundImport, importSource, ...Object.keys(imports))
    return null;
  }
  if (!foundImport.endsWith('/')) {
    // console.debug('resolveLib NO SUFFIX', foundImport, modulePath, libImport);
    return libImport;
  }

  
  const dirname = importPrefixes[foundDependency];

  const resolved = path.resolve(dirname, modulePath);
  // console.log('resolveLib RELATIVE REPLACEMENT', dirname, modulePath, resolved);

  const suffix = resolved.slice(dirname.length + foundImport.length - foundDependency.length);
  // console.log('resolveLib SUFFIX', libImport, suffix, foundImport.length, '-', foundDependency.length);

  return `${libImport}${suffix}`;
}

const transformImportSpecifier = (source, importer) => {
  // console.debug('transformImportSpecifier', source, importer);
  const result = {
    id: source,
    external: 'absolute'//source.includes('@moviemasher') ? 'absolute' : false
  }
  if (Object.values(imports).includes(source)) result.id =  `/app/node_modules/${source}`
  else {
    const importsKey = Object.keys(importPrefixes).find(key => 
      source.startsWith(importPrefixes[key])
    );
    if (importsKey && !importsKey.endsWith('/')) result.id = imports[importsKey];
    else {
      const resolvedTo = Object.values(resolveCache).map(r => r.id);
      if (!resolvedTo.includes(source)) {
        // console.debug('transformImportSpecifier RESULT NULL', source, importsKey);
        return null;
        // result.id =  `/app/node_modules/${source}`
      }
    } 
  }
  // console.debug('transformImportSpecifier RESULT', source, result);
  return result;
}

export function expandImportsPlugin(options = {}) {
  const filter = createFilter(options.include, options.exclude);

  const plugin = {
    name: 'expand-imports',
    order: 'pre',
    async transform(code, id) {
      if (!filter(id)) {
        // console.debug('transform FILTERING', id, options.include, options.exclude);
        return;
      }
      if (!id.startsWith(sourceRoot)) {
        if (!Object.values(importPrefixes).some(prefix => id.startsWith(prefix))) {
          // console.debug('transform SKIPPING', id);
          return;
        }
      }
      // console.debug('transform CHECKING', id);

      const magicString = new MagicString(code);

      const modulesByLib = {};
      const matched = [];
      const libraries = importKeys();
      libraries.forEach(key => {
        const lib = findDependency(key) || key;
        const regex = new RegExp(`^import {([^}]+)} from ['"]${lib}[^'".]*['"];`, 'mg');
        // console.debug('regex', regex);
        const regexMatches = []
        const allMatched = magicString.toString().matchAll(regex);
        for (const all of allMatched) {
          const [match, captured] = all

          regexMatches.push(match);
          const newImports = captured.split(',').map(i => i.trim()).filter(Boolean);
          modulesByLib[lib] ||= [];
          modulesByLib[lib].push(...newImports);
          // console.debug('match FOUND', ...newImports, 'IN', match);
          magicString.replace(regex, '');
          // console.debug('----------\n', magicString.toString().split("\n").map(s => s.trim()).slice(0, 10).join("\n"), '\n----------\n');
        }
        if (regexMatches.length) matched.push(...regexMatches);
      });
      
      if (matched.length) {
        const promises = Object.keys(modulesByLib).map(lib => {

          
          const foundImport = Object.keys(imports).find(key => lib.startsWith(key));
          if (foundImport) { 
            if (!foundImport.endsWith('/')) {
              const found = imports[foundImport];
              return Promise.resolve({ lib, info: found });
            }
          }
          return resolveAndLoadSource(this, lib, id).then(info =>({ info, lib }))
        });
        // console.debug('transform EXPANDING', id, 'imports of', ...libraries);
        const resolved = await Promise.all(promises);
        // console.debug('transform EXPANDED', id, 'imports of', ...libraries);
        const importLines = resolved.flatMap(moduleInfo => {
          const { lib, info } = moduleInfo;
          // lib is entire import path, info is import path or resolved module
  
          const uniqueIds = Array.from(new Set(modulesByLib[lib]));

          const byModule = {};
          if (typeof info === 'string') {
            byModule[info] ||= [];
            byModule[info].push(...uniqueIds);
          } else {
            // console.debug('loaded module', lib, 'looking for', ...uniqueIds);
            const { exportedBindings } = info;
            const errored = uniqueIds.some(imported => {
              const found = Object.keys(exportedBindings).find(libPath => {
                const libImport = exportedBindings[libPath];
                const includes = libImport.includes(imported);
                // if (includes) console.debug('found', imported, 'in', libPath);
                return includes;
              });
              if (!found) {
                console.error('could not find', imported, 'in', lib, exportedBindings);
                found = libPath;
                this.error(`Could not find ${imported} in ${lib}`);
                return true;
              }

              byModule[found] ||= [];
              byModule[found].push(imported);
              return false;
            });
            if (errored) return [];            
          }

          
          return Object.entries(byModule).map(([modulePath, moduleImports]) => {
            const uniqueImports = Array.from(new Set(moduleImports)).join(',');
            const fromPath = resolveLib(lib, modulePath)
            return `import { ${uniqueImports} } from '${fromPath}'`;
          });
        }).join("\n");

        // console.debug('transform --- FOUND --');
        // console.debug(matched.join("\n"));
        // console.debug('transform --- REPLACED ---');
        // console.debug(importLines);
        magicString.prepend(importLines + "\n");
      } 

      return { 
        code: magicString.toString(), 
        map: magicString.generateMap({ hires: true }),
      };
    },
    resolveDynamicImport(source, importer) {
      if (!filter(source)) return;
      if (!importer || typeof source !== 'string')
        return null;

      if (source.startsWith('./') || source.startsWith('../')) {
        const resolved = path.resolve(path.dirname(importer), source);
        const relative = path.relative(sourceRoot, resolved);
        const replaced = relative.replace(/\\/g, '/');
        return { id: `./${replaced}`, external: 'absolute' };
      }

      // console.log('resolveDynamicImport', source, importer);
      return transformImportSpecifier(source, importer);
    },
    
    async resolveId(source, importer, info) {
      // console.debug('resolveId', source, importer);
      if (info?.isEntry) {
        // console.debug('resolveId ENTRY', source, importer);
        if (!sourceRoot && source.startsWith('/')) {
          sourceRoot = path.resolve(path.dirname(source));
          await loadPackageJson(this, importer);
        }
        return null;
      }
      if (!importer) {
        // console.debug('resolveId NO IMPORTER', source);
        return null;
      }

      if (!filter(source)) {
        // console.debug('resolveId FILTERED', source, importer);
        return null;
      }


      if (source.startsWith('./') || source.startsWith('../')) {
        const found = Object.values(importPrefixes).find(prefix => importer.startsWith(prefix))
        // console.debug('resolveId RELATIVE...', source, importer, found);
        if (found){
          const resolved = path.resolve(found, source);
          // // console.log('resolveId RELATIVE FOUND', source, importer, resolved);
          // const relative = path.relative(sourceRoot, resolved);
          // const replaced = relative.replace(/\\/g, '/');
          return { id: resolved, external: 'absolute' };
        }
      
        // console.log('resolveId RELATIVE', source, importer);
        return null;
      }
      // console.debug('resolveId NOT RELATIVE', source, importer);

      if (sourceRoot && source.startsWith(sourceRoot)) {
        // // console.log('resolveId ABSOLUTE', source, importer);
        return null;
      }
      if (importKeys().includes(source)) {
        // console.debug('resolveId FOUND in importKeys', source, importer);
        return null;
      }
      
      if (dependencyKeys().includes(source)) {
        // console.debug('resolveId FOUND in dependencyKeys', source, importer);
        return null;
      }     


      return transformImportSpecifier(source, importer);
    }
  };

  // console.debug('Loaded plugin', plugin.name);
  return plugin;
}
