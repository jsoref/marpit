/** @module */
import postcssPlugin from '../helpers/postcss_plugin'

const marpitPrintContainerStyle = `
html, body {
  background-color: #fff;
  margin: 0;
  page-break-inside: avoid;
  break-inside: avoid-page;
}
`.trim()

/**
 * Marpit PostCSS printable plugin.
 *
 * Make printable slide deck as PDF.
 *
 * @param {Object} opts
 * @param {string} opts.width
 * @param {string} opts.height
 * @function printable
 */
export const printable = postcssPlugin(
  'marpit-postcss-printable',
  (opts) => (css) => {
    css.walkAtRules('media', (rule) => {
      if (rule.params === 'marpit-print') rule.remove()
    })

    css.first.before(
      `
@page {
  size: ${opts.width} ${opts.height};
  margin: 0;
}

@media marpit-print {
  section {
    page-break-before: always;
    break-before: page;
  }

  section, section * {
    -webkit-print-color-adjust: exact !important;
    animation-delay: 0s !important;
    animation-duration: 0s !important;
    color-adjust: exact !important;
    print-color-adjust: exact !important;
    transition: none !important;
  }

  :marpit-container > svg[data-marpit-svg] {
    display: block;
    height: 100vh;
    width: 100vw;
  }
}
`.trim(),
    )
  },
)

/**
 * The post-process PostCSS plugin of Marpit printable plugin.
 *
 * @function postprocess
 */
export const postprocess = postcssPlugin(
  'marpit-postcss-printable-postprocess',
  () => (css) =>
    css.walkAtRules('media', (rule) => {
      if (rule.params !== 'marpit-print') return

      rule.params = 'print'
      rule.first.before(marpitPrintContainerStyle)
    }),
)

export default printable
