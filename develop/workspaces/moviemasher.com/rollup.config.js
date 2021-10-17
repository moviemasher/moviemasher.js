// import serve from "rollup-plugin-serve"
// import livereload from "rollup-plugin-livereload"
// import html from '@open-wc/rollup-plugin-html'

import copy from 'rollup-plugin-copy'
const outputDir = 'public'
const imageDir = `${outputDir}/media/img`

// const livereloadOptions = {
//   watch: "src",
//   verbosity: 'debug'
// };

// const livereloadPlugin = livereload(livereloadOptions);
export default {
  input: ['src/index.ts'],

  output: {
    dir: outputDir,
    format: "iife",
    esModule: false,
    name: "MovieMasherCom",
    sourcemap: true,
  },
  plugins: [

    copy({
      targets: [
        {
          src: '../Assets/LogoSquare.png',
          dest: outputDir,
          rename: 'apple-touch-icon.png'
        },
        { src: '../Assets/favicon.png', dest: outputDir },
        { src: '../Assets/c.gif', dest: imageDir },
        {
          src: 'src/Logos/*.png',
          dest: imageDir,
        },
        {
          src: 'src/MM/*.png',
          dest: imageDir,
        },
        // {
        //   src: 'src/moviemasher.css',
        //   dest: `${outputDir}/media/css`,
        // }
      ]
    }),
    // html({inject: true, files: ["src/index.html"]}),
    // serve({
    //   open: true,
    //   verbose: true,
    //   contentBase: [outputDir],
    //   host: "localhost",
    //   port: 7058,
    // }),
    // livereloadPlugin,
  ]
}
