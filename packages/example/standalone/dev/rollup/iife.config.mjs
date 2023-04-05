import { rollupIife } from "../../../../dev/utils/rollupConfigurations.mjs"

const name = 'MovieMasherExampleStandalone'
const libName = 'example-standalone'

export default rollupIife({ name, libName, input: 'client.tsx', output: 'public' })

