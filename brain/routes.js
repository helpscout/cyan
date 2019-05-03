const cheerio = require('cheerio')
const fs = require('fs')

module.exports = {
  '/': {
    get: (req, res) => {
      const { file } = req.query

      if (!file) {
        res.end('No file provided.')
      }

      fs.readFile(file, 'utf-8', (err, data) => {
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
      })
    },
  },
}
