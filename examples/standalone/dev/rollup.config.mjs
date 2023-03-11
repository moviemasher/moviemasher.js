import { rollupConfigurations} from "../../../dev/utils/rollupConfigurations.mjs"

const name = 'MovieMasherExampleStandalone'
const libName = 'example-standalone'
const configurations = [
  ...rollupConfigurations({ name, libName, formats: { esm: 'mjs' }, input: 'server.ts', output: 'private' }),
  ...rollupConfigurations({ name, libName, formats: { iife: 'js' }, input: 'client.tsx', output: 'public' })
]
export default configurations
