const zmq = require("zeromq")

const host = '127.0.0.1'
const port = 11235
const protocol = 'tcp'
async function run() {

  const sock = zmq.socket("req")

  sock.connect(`${protocol}://${host}:${port}`)
  console.log("Pusher connected: %s://%s:%d", protocol, host, port)

  while (true) {
    const message = `overlay@r y ${Math.floor(Math.random() * 460)}`
    console.log("Pushing: %s", message)
    await sock.send([message])
    console.log("Pushed: %s", message)
    await new Promise(resolve => setTimeout(resolve, 5000))
  }
}

setTimeout(run, 5000)
