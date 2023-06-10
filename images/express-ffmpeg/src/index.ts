import { jobExtract } from "@moviemasher/lib-server"
import {  errorObjectCaught, Runtime, ColonChar, TypeNumber } from '@moviemasher/lib-shared'
import express from 'express'
import { EnvironmentKeyApiHost, EnvironmentKeyApiPort } from "@moviemasher/lib-server"
import { JobTypeDecoding, JobTypeEncoding } from "@moviemasher/lib-server"
import { JsonRecord, UnknownRecord } from "@moviemasher/runtime-shared"

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

const port = Runtime.environment.get(EnvironmentKeyApiPort, TypeNumber)
const suppliedHost = Runtime.environment.get(EnvironmentKeyApiHost)
const host = suppliedHost === 'localhost' ? '0.0.0.0' : suppliedHost
app.listen(port, host, () => { console.log(`Listening on ${host}${ColonChar}${port}`) })
