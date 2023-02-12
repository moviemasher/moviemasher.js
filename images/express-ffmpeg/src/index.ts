import { environment, Environment, jobExtract, JobType } from "@moviemasher/server-core"
import { JsonRecord, errorObjectCaught, UnknownRecord } from '@moviemasher/moviemasher.js'
import express from 'express'

const app = express()
app.use(express.json())

app.post('/probe', function (req, res) {
  const response: UnknownRecord = {}
  const request: JsonRecord = req.body
  try {

  } catch (error) { response.error = errorObjectCaught(error) }
  
  res.send(response)
})

const postHandler: express.RequestHandler = (req, res) => {
  const response: UnknownRecord = {}
  const request: JsonRecord = req.body
  try {
    const [jobType, job] = jobExtract(request)
    switch (jobType) {
      case JobType.Decoding: {
        // assertProbingJob(job)

        break
      }
      case JobType.Encoding: {
        
        break
      }
      
    }
    response.jobType = jobType
    response.job = job
  } catch (error) { response.error = errorObjectCaught(error) }
  res.send(response)
}

app.post('/', postHandler)

const port = Number(environment(Environment.API_PORT))
const suppliedHost = environment(Environment.API_HOST)
const host = suppliedHost === 'localhost' ? '0.0.0.0' : suppliedHost
app.listen(port, host, () => { console.log(`Listening on ${host}:${port}`) })
