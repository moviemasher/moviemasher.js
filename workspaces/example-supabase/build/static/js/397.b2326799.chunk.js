"use strict";(self.webpackChunk_moviemasher_example_supabase=self.webpackChunk_moviemasher_example_supabase||[]).push([[397],{9397:function(e){e.exports=JSON.parse('{"name":"@moviemasher/protocol-supabase","description":"Movie Masher Protocol Plugin for Supabase - version 5.1.2","homepage":"https://moviemasher.com","files":["esm","umd"],"main":"umd/protocol-supabase.js","module":"esm/protocol-supabase.mjs","types":"esm/protocol-supabase.d.mts","version":"5.1.2","license":"MIT","author":{"name":"Movie Masher","email":"support@moviemasher.com"},"bugs":{"url":"https://github.com/moviemasher/moviemasher.js/issues"},"repository":{"type":"git","url":"https://github.com/moviemasher/moviemasher.js.git"},"scripts":{"build-esm":"esbuild src/index.ts --sourcemap --packages=external --bundle --platform=neutral --outfile=esm/protocol-supabase.js","build-esm-min":"esbuild src/index.ts --packages=external --bundle --platform=neutral --outfile=esm/protocol-supabase.min.js --minify","build":"rollup --config dev/rollup.config.mjs","build-umd":"rollup --config dev/rollup/umd.config.js","copy-types":"mkdir -p types && mv -f umd/*.d.* types/","build-rollup":"run-s build-rollup build-esm-min build-umd build-umd-min copy-types"},"peerDependencies":{"@moviemasher/moviemasher.js":"5.1.2","@moviemasher/client-core":"5.1.2","@supabase/supabase-js":"2.8.0"}}')}}]);