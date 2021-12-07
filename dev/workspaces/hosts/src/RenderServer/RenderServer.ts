import express from "express"
import { UnknownObject } from "@moviemasher/moviemasher.js"
import { RenderServerArgs, Server } from "../declaration"


class RenderServer implements Server {
  constructor(args?: RenderServerArgs) {
    if (args) {
      if (args.prefix) this.prefix = args.prefix
    }
  }

  index(): UnknownObject { return {} }

  prefix = '/render'

 start(app:express.Application):void {
    app.post(this.prefix, (req, res) => {
      console.log(`POST ${this.prefix}`)
      try {
        console.log(req.body.json)
        const id = 'id'
        res.send({id: id})
      } catch (error) {
        console.error(error)
        res.sendStatus(500)
      }
    })

    app.delete(`${this.prefix}/:id`, (req, res) => {
      const { id } = req.params
      console.log(`DELETE ${this.prefix} ${id}`)
      res.send({id})
    })

    app.get(`${this.prefix}/:id`, (req, res) => {
      const { id } = req.params

      console.log(`GET ${this.prefix} ${id}`)
      res.send({id})
    })

  }

  stop(): void {}
}

export { RenderServer, RenderServerArgs }
