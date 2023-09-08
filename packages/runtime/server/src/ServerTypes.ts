import type { MovieMasherOptions, MovieMasherRuntime } from '@moviemasher/runtime-shared'

export interface MovieMasherServerOptions extends MovieMasherOptions {
  
}

export interface MovieMasherServerRuntime extends MovieMasherRuntime {
  options: MovieMasherServerOptions
}
