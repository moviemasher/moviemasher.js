import type { StringRecord, Strings } from '@moviemasher/shared-lib/types.js'
import type { Highlighter, Theme } from 'shiki'

import { assertTrue } from '@moviemasher/shared-lib/utility/guards.js'

function* zip<T extends Iterable<any>[]>(
  ...args: T
): Iterable<{ [K in keyof T]: T[K] extends Iterable<infer U> ? U : T[K] }> {
  const iterators = args.map((x) => x[Symbol.iterator]())

  while (true) {
      const next = iterators.map((i) => i.next())
      if (next.some((v) => v.done)) {
          break
      }
      yield next.map((v) => v.value) as any
  }
}

const htmlEscapes: StringRecord= {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  " ": "&nbsp;",
};

function escapeHtml(html: string) {
  return html.replace(/[ &<>'"]/g, (c) => htmlEscapes[c]);
}

export class DoubleHighlighter {
    private schemes = new Map<string, string>()

    constructor(
        private highlighter: Highlighter,
        private light: Theme,
        private dark: Theme,
    ) {}

    highlight(code: string, lang: string) {
        const lightTokens = this.highlighter.codeToThemedTokens(code, lang, this.light, { includeExplanation: false })
        const darkTokens = this.highlighter.codeToThemedTokens(code, lang, this.dark, { includeExplanation: false })

        // If this fails... something went *very* wrong.
        assertTrue(lightTokens.length === darkTokens.length)

        const docEls: Strings = []

        for (const [lightLine, darkLine] of zip(lightTokens, darkTokens)) {
          // Different themes can have different rules for when colors change... so unfortunately we have to deal with different
          // sets of tokens.Example: light_plus and dark_plus tokenize " = " differently in the `schemes`
          // declaration for this file.

          while (lightLine.length && darkLine.length) {
            const [lightToken] = lightLine
            const [darkToken] = darkLine
            const gotClass = this.getClass(lightToken.color, darkToken.color)
            const { content: lightContent } = lightToken
            const { content: darkContent } = darkToken

              // Simple case, same token.
            if (lightContent === darkContent) {
              docEls.push(`<span class='${gotClass}'>${escapeHtml(lightContent)}</span>`)
              lightLine.shift()
              darkLine.shift()
              continue
            }
            if (lightContent.length < darkContent.length) {
              docEls.push(`<span class='${gotClass}'>${escapeHtml(lightContent)}</span>`)
              darkToken.content = darkContent.substring(lightContent.length)
              lightLine.shift()
              continue
            }
            docEls.push(`<span class='${gotClass}'>${escapeHtml(darkContent)}</span>`)
            lightToken.content = lightContent.substring(darkContent.length)
            darkLine.shift()
          }
          docEls.push('<br />')
        }
        docEls.pop() // Remove last <br>
        return docEls.join('')
    }


    getStyles() {
      const style: string[] = [":root {"]
      const lightRules: string[] = []
      const darkRules: string[] = []

      let i = 0;
      for (const key of this.schemes.keys()) {
          const [light, dark] = key.split(" | ")

          style.push(`    --light-hl-${i}: ${light};`)
          style.push(`    --dark-hl-${i}: ${dark};`)
          lightRules.push(`    --hl-${i}: var(--light-hl-${i});`)
          darkRules.push(`    --hl-${i}: var(--dark-hl-${i});`)
          i++
      }

      style.push(`    --light-code-background: ${this.highlighter.getTheme(this.light).bg};`)
      style.push(`    --dark-code-background: ${this.highlighter.getTheme(this.dark).bg};`)
      lightRules.push(`    --code-background: var(--light-code-background);`)
      darkRules.push(`    --code-background: var(--dark-code-background);`)

      style.push("}", "")

      style.push("@media (prefers-color-scheme: light) { :root {")
      style.push(...lightRules)
      style.push("} }", "")

      style.push("@media (prefers-color-scheme: dark) { :root {")
      style.push(...darkRules)
      style.push("} }", "")

      style.push(":root[data-theme='light'] {")
      style.push(...lightRules)
      style.push("}", "")

      style.push(":root[data-theme='dark'] {")
      style.push(...darkRules)
      style.push("}", "")

      for (i = 0; i < this.schemes.size; i++) {
          style.push(`.hl-${i} { color: var(--hl-${i}); }`)
      }
      // style.push("pre, code { background: var(--code-background); }", "")

      return style.join("\n")
  }

    private getClass(lightColor?: string, darkColor?: string): string {
        const key = `${lightColor} | ${darkColor}`
        let scheme = this.schemes.get(key)
        if (scheme == null) {
            scheme = `hl-${this.schemes.size}`
            this.schemes.set(key, scheme)
        }
        return scheme
    }
}
