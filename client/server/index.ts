import express from 'express'
import { json } from 'body-parser'
import next from 'next'

const port = parseInt(process.env.PORT, 10) || 9999
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {

  const server = express()

  server.use(json())

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })

})

// https://docs.docker.com/docker-for-windows/wsl/