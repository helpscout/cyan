const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')

module.exports = {
  '/': {
    get: (req, res) => {
      const { file } = req.query
      const filename = file || 'index.html'

      fs.readFile(
        path.join(process.cwd(), '.cyan', filename),
        'utf-8',
        (err, data) => {
          if (err) {
            return res.end('File is invalid')
          }

          const $ = cheerio.load(data)

          $('body').append(`
          <script src="/socket.io/socket.io.js"></script>
          <script>
            var socket = io();
          </script>
        `)

          return res.end($.html())
        },
      )
    },
  },
}
