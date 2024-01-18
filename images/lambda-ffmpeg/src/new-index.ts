import type { JsonRecord, UnknownRecord, } from '@moviemasher/shared-lib/types.js'

import { ENV_KEY, ENV } from '@moviemasher/server-lib'
import { COLON } from '@moviemasher/shared-lib'
import { NUMBER, errorObjectCaught } from '@moviemasher/shared-lib/runtime.js'
import express from 'express'
import { jobExtract } from './Job.js'
import { DECODING, ENCODING } from '@moviemasher/server-lib/src/Utility/JobGuards.js'

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
      case DECODING: {
        // assertProbingJob(job)

        break
      }
      case ENCODING: {
        
        break
      }
      
    }
    response.jobType = jobType
    response.job = job
  } catch (error) { response.error = errorObjectCaught(error) }
  res.send(response)
}

app.post('/', postHandler)

const port = ENV.get(ENV_KEY.ExamplePort, NUMBER)
const suppliedHost = ENV.get(ENV_KEY.ExampleHost)
const host = suppliedHost === 'localhost' ? '0.0.0.0' : suppliedHost
app.listen(port, host, () => { console.log(`Listening on ${host}${COLON}${port}`) })
