"use strict";(self.webpackChunk_moviemasher_example_supabase=self.webpackChunk_moviemasher_example_supabase||[]).push([[890],{1890:function(e){e.exports=JSON.parse('{"name":"@moviemasher/theme-default","version":"5.1.2","description":"Movie Masher Theme Plugin - version 5.1.2","module":"./esm/theme-default.mjs","main":"./umd/theme-default.js","types":"./esm/theme-default.d.mts","files":["esm","umd","moviemasher.css"],"license":"MIT","author":{"name":"Movie Masher","email":"support@moviemasher.com"},"bugs":{"url":"https://github.com/moviemasher/moviemasher.js/issues"},"repository":{"type":"git","url":"https://github.com/moviemasher/moviemasher.js.git"},"homepage":"https://moviemasher.com","peerDependencies":{"@moviemasher/client-react":"5.1.2","react":"^18.0.0","react-dom":"^18.0.0"},"devDependencies":{"react-icons":"4.7.1","@types/react":"^18.0.0","@types/react-dom":"^18.0.0","@types/node":"18.13.0"},"scripts":{"build-css":"cat src/css/* > moviemasher.css","build-esm":"esbuild src/index.ts --sourcemap --packages=external --bundle --platform=neutral --main-fields=main --outfile=esm/theme-default.mjs","build-esm-min":"esbuild src/index.ts --packages=external --bundle --platform=neutral --main-fields=main --outfile=esm/theme-default.min.mjs --minify","build-umd-min":"rollup --config dev/rollup/umd.min.config.mjs","build-rollup":"rollup --config dev/rollup.config.mjs","copy-types":"mkdir -p types && mv -f umd/*.d.* types/","build":"run-s build-rollup build-css"},"eslintConfig":{"extends":["react-app"]},"browserslist":{"production":[">0.2%","not dead","not op_mini all"],"development":["last 1 chrome version","last 1 firefox version","last 1 safari version"]},"typedoc":{"entryPoint":"./src/index.ts","readmeFile":"./README.md","displayName":"theme-default","tsconfig":"./dev/tsconfig.json"}}')}}]);