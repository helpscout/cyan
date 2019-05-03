const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const port = 3000

const addRoutes = require('./utils/addRoutes')
const routes = require('./routes')

addRoutes(app, routes)
io.on('connection', socket => socket.on('disconnect', () => process.exit(0)))
http.listen(port, () => console.log(`> Running on localhost:${port}`))
