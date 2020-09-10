import express from 'express'
import { json } from 'body-parser'

let app = express()

app.use(json())

app.get('/api/tests', (req, res) => {
  res.send('hello gcloud kubernetes')
})

app.listen(9998, () => console.log('listening on port 9998'))
