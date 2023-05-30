import { playwrightLauncher } from "@web/test-runner-playwright"
import { esbuildPlugin } from "@web/dev-server-esbuild";
import { takeScreenshotPlugin } from 'web-test-runner-screenshot/plugin';

export default {
  groups: [
    // {
    //   name: 'core',
    //   files: [
    //     '../../../packages/core/client/tests/*.test.mjs',
    //   ],
    //   browsers: [    
    //     playwrightLauncher({ product: "firefox" }),   
    //   ],
    // },
    {
      name: 'client',
      files: [
        '../../packages/client/component/src/*.e2e.ts',
      ],
      browsers: [    
        playwrightLauncher({ product: "firefox", launchOptions: { firefoxUserPrefs: { 'layout.css.more_color_4.enabled': true } } }),    
        playwrightLauncher({ product: "chromium" }),    
        playwrightLauncher({ product: "webkit" }),
      ],
      testRunnerHtml: testFramework => `<html>
        <head>
          <style>
            body {
              height: 100vh;
              display: flex;
              margin: 0px;
              padding: 0px;
              font-family: sans-serif;
            }
            @media(prefers-color-scheme: dark) {
              body { background-color: #000; }
            }
          </style>
        </head>
        <body><script type='module' src='${testFramework}'></script></body>
      </html>`,
    },
  ],
  plugins: [
    esbuildPlugin({ ts: true }),
    takeScreenshotPlugin(),
  ],
  // concurrency: 1,
  concurrentBrowsers: 1,
  nodeResolve: true,
  watch: false,
  rootDir: '../../../',
}
