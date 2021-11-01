import serve from "rollup-plugin-serve"
import livereload from "rollup-plugin-livereload"
import copy from 'rollup-plugin-copy'
const outputDir = 'public'


const livereloadPlugin = livereload({ watch: "src", verbosity: 'debug' })

export default {
  input: 'src/index.js',

  output: {
    dir: outputDir,
    format: "umd",
    name: "MovieMasherUmd",
    sourcemap: true,
    esModule: false,
  },
  plugins: [
    copy({
      targets: [
        { src: 'src/index.html', dest: outputDir }
      ]
    }),
    serve({
      open: true,
      verbose: true,
      contentBase: [outputDir, "../../../dist", "../../assets/raw"],
      host: "localhost",
      port: 7057,
    }),
    livereloadPlugin,
  ]
}
