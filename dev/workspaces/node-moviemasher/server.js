import express from 'express'
import { Factory } from '@moviemasher/moviemasher.js'

const port = Number(process.argv[2]) || 8570

const app = express()

app.get('/', (_req, res) => {

  res.send(`Too fucking cool? ${Factory.mash.instance({}).identifier}`)
})

app.listen(Number(port), () => { console.log(`Listening on port ${port}`) })
