const zmq = require("zeromq")
const host = '0.0.0.0'
const port = 8573
const protocol = 'tcp'
async function run() {
  const sock = new zmq.Pull
  await sock.bind(`${protocol}://${host}:${port}`)
  console.log("Puller bound: %s://%s:%d", protocol, host, port)

  for await (const [msg] of sock) {
    console.log("Received: %s", msg.toString())
  }
}

run()
