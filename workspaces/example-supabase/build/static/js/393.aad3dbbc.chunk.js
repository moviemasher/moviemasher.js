"use strict";(self.webpackChunk_moviemasher_example_supabase=self.webpackChunk_moviemasher_example_supabase||[]).push([[393],{3393:function(e){e.exports=JSON.parse('{"name":"@moviemasher/client-core","version":"5.1.2","description":"Movie Masher Core Client - version 5.1.2","main":"esm/client-core.mjs","types":"types/client-core.d.ts","license":"MIT","author":{"name":"Movie Masher","email":"support@moviemasher.com"},"bugs":{"url":"https://github.com/moviemasher/moviemasher.js/issues"},"repository":{"type":"git","url":"https://github.com/moviemasher/moviemasher.js.git"},"homepage":"https://moviemasher.com","scripts":{"build-esm":"esbuild src/index.ts --sourcemap --packages=external --bundle --platform=neutral --main-fields=main --outfile=esm/client-core.mjs","build-esm-min":"esbuild --sourcemap src/index.ts --packages=external --bundle --platform=neutral --main-fields=main --outfile=esm/client-core.min.mjs --minify","build-umd-min":"rollup --config dev/rollup/umd.min.config.mjs","build-umd":"rollup --config dev/rollup/umd.config.mjs","build-min":"run-s build-esm-min build-umd-min","copy-types":"mkdir -p types && mv -f umd/*.d.* types/","build":"run-s build-esm build-esm-min build-umd build-umd-min copy-types"},"peerDependencies":{"@moviemasher/moviemasher.js":"5.1.2"},"devDependencies":{"@types/css-font-loading-module":"^0.0.7"},"typedoc":{"entryPoint":"./src/index.ts","readmeFile":"./README.md","displayName":"client-core","tsconfig":"./tsconfig.json"}}')}}]);