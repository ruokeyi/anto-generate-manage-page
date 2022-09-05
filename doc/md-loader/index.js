const MarkdownIt = require('markdown-it')
const hljs = require('highlight.js')
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    const codeIndex = parseInt(Date.now()) + Math.floor(Math.random() * 10000000)
    let html = `<button class="copy-btn" type="button" data-clipboard-action="copy" data-clipboard-target="#copy${codeIndex}">复制</button>`
    const linesLength = str.split(/\n/).length - 1
    let linesNum = '<span aria-hidden="true" class="line-numbers-rows">'
    for (let index = 0; index < linesLength; index++) {
      linesNum = linesNum + '<span></span>'
    }
    linesNum += '</span>'
    if (lang && hljs.getLanguage(lang)) {
      try {
        const preCode = hljs.highlight(lang, str, true).value
        html = html + preCode
        if (linesLength) {
          html += '<b class="name">' + lang + '</b>'
        }
        return `<pre class="hljs"><code>${html}</code>${linesNum}</pre><textarea style="position: absolute;top: -9999px;left: -9999px;z-index: -9999;" id="copy${codeIndex}">${str.replace(/<\/textarea>/g, '&lt;/textarea>')}</textarea>`
      } catch (error) {
        console.log(error)
      }
    }

    const preCode = md.utils.escapeHtml(str)
    html = html + preCode
    return `<pre class="hljs"><code>${html}</code>${linesNum}</pre><textarea style="position: absolute;top: -9999px;left: -9999px;z-index: -9999;" id="copy${codeIndex}">${str.replace(/<\/textarea>/g, '&lt;/textarea>')}</textarea>`
  }
})
const fs = require('fs')

const getParams = str => {
  const map = {}
  str.split('\n').forEach(line => {
    if (/^@\w+:\s+\S+.*/.test(line)) {
      const res = line.match(/^@(\S+):\s+(\S+)/)
      map[res[1]] = res[2]
    }
  })
  return map
}
const mergeDemoCode = (source, resourcePath) => {
  try {
    // 将demo代码复制到readme中
    const demoPath = resourcePath.split('/').slice(0, -1).concat('demo.vue').join('/')
    fs.accessSync(demoPath, fs.constants.R_OK | fs.constants.W_OK)
    const demoText = fs.readFileSync(demoPath, 'utf8')
    source += '\ncode\n'
    source += '```html\n'
    source += demoText
    source += '\n'
    source += '```\n'
  } catch (err) {
    //
  }
  return source
}
const getJsFileFromMarkdownSrc = (source, resourcePath) => {
  source = mergeDemoCode(source, resourcePath)
  const params = getParams(source)
  const content = md.render(source)
  return `{
    html: ${JSON.stringify(content)},
    source: ${JSON.stringify(source)},
    params: ${JSON.stringify(params)}
  }`
}

// webpack loader
// module.exports = function (source) {
//   return 'module.exports = ' + getJsFileFromMarkdownSrc(source, this.resourcePath)
// }

// vite loader
export default function () {
  return {
    name: 'markdown-loader',
    transform(src, resourcePath) {
      if (resourcePath.endsWith(".md")) {
        return {
          code: 'export default' + getJsFileFromMarkdownSrc(src, resourcePath),
          map: null
        }
      }
    }
  }
}