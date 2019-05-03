/* global jasmine */

import fs from 'fs'
import path from 'path'

import { getDocumentHTML } from '../../utils/render.utils'
import { getDocumentCSS } from '../../utils/css.utils'
import pretty from '../../utils/pretty.utils'
import inspectorCSS from './gadget.css'
import editorTheme from './gadget.editor.theme.ayu'

let currentTest

// @ts-ignore
jasmine.getEnv().addReporter({
  specStarted: function(result) {
    currentTest = result
  },
})

const getFilePath = () => {
  const base = path.join(process.cwd(), '/.cyan/')
  if (!fs.existsSync(base)) {
    fs.mkdirSync(base)
  }

  return path.join(base, 'index.html')
}

const generateHTML = lineNumber => {
  const css = getDocumentCSS()
  const html = pretty(getDocumentHTML())
  const { fullName } = currentTest

  const template = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${fullName} | Cyan Inspector</title>
        <style>${inspectorCSS}</style>
      </head>
      <body>
        <div id="bar">
          <div>
            ${fullName} ${lineNumber}
            <button id="close">Close</button>
          </div>
        </div>
        <iframe id="iframe"></iframe>
        <div id="editor"></div>
        <script>window.markup = \`${html}\`</script>
        <script>window.css = \`${css}\`</script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.4/ace.js"></script>
        ${editorTheme}
        <script>
          const close = document.querySelector('#close')
          close.addEventListener('click', () => {
            window.open('','_self').close();
          })
        </script>
        <script>
          const iframe = document.querySelector('#iframe')
          const head = iframe.contentWindow.document.getElementsByTagName('head')[0]
          const body = iframe.contentWindow.document.body

          const renderPreview = html => {
            body.innerHTML = html
          }

          const style = document.createElement('style')
          style.innerHTML = window.css

          head.appendChild(style)
          renderPreview(window.markup)

          const previewNode = document.querySelector('#preview')

          const editor = ace.edit('editor', {
            mode: "ace/mode/html",
            fontSize: '14px',
            selectionStyle: "text",
            theme: 'ace/theme/ayu-mirage'
          })

          editor.setValue(window.markup, -1)
          editor.resize()
          editor.getSession().setTabSize(2);
          editor.getSession().setUseSoftTabs(true);
          editor.getSession().setUseWrapMode(true);

          editor.session.on('change', function(delta) {
            renderPreview(editor.getValue())
          });
        </script>
      </body>
    </html>
  `
  fs.writeFileSync(getFilePath(), template)
}

export const gadget = () => {
  // @ts-ignore
  const lineNumber = new Error().stack.match(/\(.*\)/g)[2]

  jest.runAllTimers()
  generateHTML(lineNumber)
}

export default gadget
