/* global jasmine */

import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'

import { getDocumentHTML } from '../utils/render.utils'
import { getDocumentCSS } from '../utils/css.utils'
import pretty from '../utils/pretty.utils'

let currentTest

jasmine.getEnv().addReporter({
  specStarted: function(result) {
    currentTest = result
  },
})

const openInspector = () => {
  const filepath = path.join(__dirname, 'index.html')
  spawn('open', [filepath], { stdio: 'inherit' })
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
        <style>
          :root {
            --backgroundColor: #1c1f21;
            --topBarHeight: 30px;
          }
          * {
            box-sizing: border-box;
          }
          html {
            -webkit-font-smoothing: antialiased;
          }
          body {
            background: var(--backgroundColor);
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            margin: 0;
          }
          #bar {
            align-items: center;
            background: var(--backgroundColor);
            border-bottom: 1px solid black;
            display: flex;
            font-size: 14px;
            height: var(--topBarHeight);
            justify-content: center;
            left: 0;
            position: fixed;
            top: 0;
            width: 100%;
            z-index: 10;
          }
          #iframe {
            background: white;
            border: none;
            border-left: 2px solid black;
            height: calc(100% - var(--topBarHeight));
            position: fixed;
            right: 0;
            top: var(--topBarHeight);
            width: 40%;
          }
          #editor {
            height: calc(100% - var(--topBarHeight));
            left: 0;
            position: fixed;
            top: var(--topBarHeight);
            width: 60%;
          }
        </style>
      </head>
      <body>
        <div id="bar"><div>${fullName} ${lineNumber}</div></div>
        <iframe id="iframe"></iframe>
        <div id="editor"></div>
        <script>window.markup = \`${html}\`</script>
        <script>window.css = \`${css}\`</script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.4/ace.js"></script>
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
            selectionStyle: "text",
            theme: 'ace/theme/monokai'
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
  const filepath = path.join(__dirname, 'index.html')
  fs.writeFileSync(filepath, template)
}

export const goGadgetGo = () => {
  const lineNumber = new Error().stack.match(/\(.*\)/g)[1]

  jest.runAllTimers()
  generateHTML(lineNumber)
  openInspector()
}
