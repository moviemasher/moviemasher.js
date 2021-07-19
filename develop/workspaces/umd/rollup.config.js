import serve from "rollup-plugin-serve"
import livereload from "rollup-plugin-livereload"
import copy from 'rollup-plugin-copy'
const outputDir = 'public'

const livereloadOptions = {
  watch: "src",
  verbosity: 'debug'
};

const livereloadPlugin = livereload(livereloadOptions);
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
      contentBase: [outputDir, "../../../dist", "../../Assets"],
      host: "localhost",
      port: 7057,
    }),
    livereloadPlugin,
  ]
}
