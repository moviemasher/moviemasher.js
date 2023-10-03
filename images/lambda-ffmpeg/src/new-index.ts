import type { JsonRecord, UnknownRecord, } from '@moviemasher/runtime-shared'

import { ENV, ENVIRONMENT } from '@moviemasher/lib-server'
import { COLON } from '@moviemasher/lib-shared'
import { NUMBER, errorObjectCaught } from '@moviemasher/runtime-shared'
import express from 'express'
import { jobExtract } from './Job.js'
import { JobTypeDecoding, JobTypeEncoding } from './JobGuards.js'

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
      case JobTypeDecoding: {
        // assertProbingJob(job)

        break
      }
      case JobTypeEncoding: {
        
        break
      }
      
    }
    response.jobType = jobType
    response.job = job
  } catch (error) { response.error = errorObjectCaught(error) }
  res.send(response)
}

app.post('/', postHandler)

const port = ENVIRONMENT.get(ENV.ApiPort, NUMBER)
const suppliedHost = ENVIRONMENT.get(ENV.ApiHost)
const host = suppliedHost === 'localhost' ? '0.0.0.0' : suppliedHost
app.listen(port, host, () => { console.log(`Listening on ${host}${COLON}${port}`) })
