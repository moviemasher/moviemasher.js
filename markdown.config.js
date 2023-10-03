const path = require('path');
const glob = require('glob');
const fs = require('fs');

const outputPath = '/app'
const attributeExp = /(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|\s*\/?[>"']))+.)["']?/gm;
const stripLines = (code, start, end) => {
  let inTag = false;
  const lines = code.split("\n");
  let tag = start;
  let inCode = false;
  const filtered = lines.filter(line => {
      if (!(line || inCode))
          return false;
      if (line.includes(tag)) {
          if (inTag) {
              inTag = false;
              tag = start;
          }
          else if (!line.includes(end)) {
              tag = end;
              inTag = true;
          }
          return false;
      }
      inCode ||= !inTag;
      return !inTag;
  });
  // console.log("filtered", filtered.length)
  // const last = filtered[filtered.length - 1]
  // const index = last.indexOf('<')
  // const mapped = filtered.map(line => line.slice(index))
  return filtered.join("\n");
};
const trimCode = (_content, options) => {
  // console.log("trimCode", content)
  const { src, stripComments, jsx, stripImports, stripExports } = options;
  if (!src)
      return '';
  const pattern = path.join(outputPath, src);
  const extension = path.extname(src).slice(1);
  const syntax = options.syntax || extension;
  let code = fs.readFileSync(pattern).toString();
  if (stripComments) {
      if (extension === 'html') {
          code = code.replace(/(<!--.*?-->)|(<!--[\S\s]+?-->)|(<!--[\S\s]*?$)/g, '');
      }
      else
          code = code.replace(/((["'])(?:\\[\s\S]|.)*?\2|\/(?![*\/])(?:\\.|\[(?:\\.|.)\]|.)*?\/)|\/\/.*?$|\/\*[\s\S]*?\*\//gm, '$1');
  }
  if (stripImports)
      code = stripLines(code, 'import ', ' from ');
  if (stripExports) {
      code = code.replace(/^export.*$/gm, '');
      // console.log("stripExports", code)
  }
  if (jsx) //code = stripLines(code, `<${jsx}`, `</${jsx}`)
    {
      let tag = `<${jsx}`;
      let inTag = false;
      const lines = code.split("\n");
      const filtered = lines.filter(line => {
          if (!(line && tag))
              return '';
          if (line.includes(tag)) {
              if (inTag) {
                  tag = '';
                  return true;
              }
              inTag = true;
              tag = `</${jsx}`;
          }
          return inTag;
      });
      // console.log("filtered", filtered.length)
      const last = filtered[filtered.length - 1];
      const index = last.indexOf('<');
      const mapped = filtered.map(line => line.slice(index));
      code = mapped.join("\n");
  }
  // trim leading and trailing spaces/line breaks in code and keeps the indentation of the first non-empty line
  code = code.replace(/^(?:[\t ]*(?:\r?\n|\r))+|\s+$/g, '');
  let header = '';
  if (options.header) {
      header = `\n${options.header}`;
  }
  const backticks = '```';
  return `\n${backticks}${syntax}${header}\n${code}\n${backticks}`;
};
const colorSvg = (_content, options) => {
  // console.log("colorSvg", content)
  const defaults = { src: path.join(outputPath, '**/*.svg'), replacements: '' };
  const settings = Object.assign({}, defaults, options);
  const pattern = path.join(outputPath, settings.src);
  // console.log("pattern", pattern, '=', outputPath, settings.src)
  const paths = glob.sync(pattern, { ignore: '**/node_modules/**' });
  const svgs = paths.map(filePath => {
      const buffer = fs.readFileSync(filePath).toString();
      const lines = buffer.split("\n");
      const filtered = [];
      lines.forEach(line => {
          if (!line || line.includes('<?xml'))
              return;
          if (line.includes('<svg')) {
              const matches = line.matchAll(attributeExp);
              const attributes = Object.fromEntries([...matches].map(match => [String(match[1]), String(match[2])]));
              const { width, height } = attributes;
              if (width && height)
                  attributes.viewbox ||= `0 0 ${width} ${height}`;
              const pairs = Object.entries(attributes).map(([k, v]) => {
                  const quote = v.includes('"') ? "'" : '"';
                  return [k, '=', quote, v, quote].join('');
              });
              pairs.push("class='diagram'");
              filtered.push(`<svg ${pairs.join(' ')}>`);
              // console.log('attributes', attributes)
              return;
          }
          filtered.push(line);
      });
      const svgString = filtered.join("\n");
      const replacements = settings.replacements.trim();
      if (!replacements.length)
          return svgString;
      return replacements.split(',').reduce((svg, replacement) => svg.replaceAll(replacement, 'currentColor'), svgString);
  });
  return svgs.join('\n');
};
const fileMd = (_content, options) => {
  // console.log("trimCode", content)
  const { src, stripMagic, jsx, stripImports, stripExports } = options;
  if (!src)
      return '';
  let code = fs.readFileSync(path.join(outputPath, src)).toString();
  if (stripMagic) {
      let tag = '<!-- MAGIC';
      code = code.split("\n").filter(line => !line.startsWith(tag)).join("\n");
  }
  return code;
};
const run = (_content, options) => {
  return JSON.stringify(options);
  // const { src } = options
  // const srcPath = path.join(outputPath, src)
  // return api(options)
  // const imported = import(srcPath)
  // let something = imported
  // let type = typeof something
  // if (type === 'function') {
  //   something = something(options)
  //   type = typeof something
  // }
  // switch(type) {
  //   case 'string': return something
  //   case 'object': {
  //     if (Array.isArray(something)) return something.join("\n")
  //   }
  // }
  // return JSON.stringify(something)
};


module.exports = {
  // handleOutputPath: (currentPath) => {
  //   const newPath =  'x' + currentPath
  //   return newPath
  // },
  // handleOutputPath: (currentPath) => {
  //   const newPath = currentPath.replace(/fixtures/, 'fixtures-out')
  //   return newPath
  // },
  matchWord: 'MAGIC',
  transforms: {
    INLINE_EXAMPLE: () => {
      return '**⊂◉‿◉つ**'
    },
    API: run, TRIMCODE: trimCode, COLORSVG: colorSvg, FILEMD: fileMd
  }
}
