const net = require("net")
const { spawn } = require("child_process")

const DEFAULT_PORT = 3000
const MAX_PORT = 65535
const command = process.argv[2] || "dev"
const startPort = Number.parseInt(process.env.PORT || `${DEFAULT_PORT}`, 10)

function isPortFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer()

    server.unref()
    server.on("error", () => resolve(false))
    server.listen({ port, host: "0.0.0.0" }, () => {
      server.close(() => resolve(true))
    })
  })
}

async function findFreePort(port) {
  for (let current = port; current <= MAX_PORT; current += 1) {
    // Probe upward until we find the first available port.
    // This avoids hard-failing when the preferred one is occupied.
    if (await isPortFree(current)) {
      return current
    }
  }

  throw new Error(`No free port found starting from ${port}`)
}

async function main() {
  const nextBin = require.resolve("next/dist/bin/next")

  for (let port = startPort; port <= MAX_PORT; port += 1) {
    const freePort = await findFreePort(port)
    process.env.PORT = `${freePort}`

    const child = spawn(process.execPath, [nextBin, command, "-p", `${freePort}`], {
      env: process.env,
      stdio: ["inherit", "pipe", "pipe"],
    })

    let stderr = ""

    child.stdout.on("data", (chunk) => {
      process.stdout.write(chunk)
    })

    child.stderr.on("data", (chunk) => {
      const text = chunk.toString()
      stderr += text
      process.stderr.write(text)
    })

    const exitCode = await new Promise((resolve) => {
      child.on("exit", (code, signal) => {
        if (signal) {
          process.kill(process.pid, signal)
          return
        }

        resolve(code ?? 0)
      })
    })

    if (exitCode === 0) {
      return
    }

    if (!/EADDRINUSE|address already in use/i.test(stderr)) {
      process.exit(exitCode)
    }
  }

  throw new Error(`No free port found starting from ${startPort}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
