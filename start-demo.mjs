import { createHash } from "node:crypto"
import { readFile, readdir, writeFile, access } from "node:fs/promises"
import { createServer } from "node:net"
import { spawn, spawnSync } from "node:child_process"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { setTimeout as delay } from "node:timers/promises"

// Run from any directory: node D:\CLAUDE-WORKSPACE\AI-News\start-demo.mjs
const root = dirname(fileURLToPath(import.meta.url))
const frontend = join(root, "frontend")
const args = process.argv.slice(2)
const portArgument = args.find(arg => arg.startsWith("--port="))
const port = Number(portArgument?.slice(7) ?? 3000)
if (args.some(arg => !["--rebuild", "--no-open"].includes(arg) && arg !== portArgument) || !Number.isInteger(port) || port < 1024 || port > 65535) {
  console.error("Usage: node start-demo.mjs [--rebuild] [--no-open] [--port=3000]")
  process.exit(1)
}
const [major, minor] = process.versions.node.split(".").map(Number)
if (major < 20 || (major === 20 && minor < 9)) {
  console.error("Install Node.js 20.9 or newer to run this prototype.")
  process.exit(1)
}
const next = join(frontend, "node_modules", "next", "dist", "bin", "next")
const marker = join(frontend, ".next", "demo-source-hash")
const url = `http://localhost:${port}`
let server

async function sourceHash() {
  const hash = createHash("sha256")
  async function walk(directory) {
    for (const entry of (await readdir(directory, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
      const path = join(directory, entry.name)
      if (entry.isDirectory()) await walk(path)
      else { hash.update(path); hash.update(await readFile(path)) }
    }
  }
  await walk(join(frontend, "src"))
  await walk(join(frontend, "public"))
  for (const file of ["package.json", "pnpm-lock.yaml", "next.config.ts", "tsconfig.json", "postcss.config.mjs", ".env.local", ".env.production", ".env.production.local"]) {
    try { hash.update(await readFile(join(frontend, file))) } catch (error) { if (error.code !== "ENOENT") throw error }
  }
  hash.update(process.versions.node)
  return hash.digest("hex")
}

function stopServer() {
  if (!server || server.exitCode !== null) return
  if (process.platform === "win32") spawnSync("taskkill", ["/pid", String(server.pid), "/T", "/F"], { stdio: "ignore" })
  else server.kill("SIGTERM")
}
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => { stopServer(); process.exit(0) })
}
process.on("exit", stopServer)

try {
  await access(next).catch(() => { throw new Error("Dependencies are missing. Run: cd frontend; pnpm install; cd ..") })
  await new Promise((resolve, reject) => {
    const probe = createServer()
    probe.once("error", () => reject(new Error(`Port ${port} is already in use. Stop the existing server with Ctrl+C, or run with --port=${port + 1}.`)))
    probe.listen(port, "127.0.0.1", () => probe.close(resolve))
  })
  const hash = await sourceHash()
  const savedHash = await readFile(marker, "utf8").catch(() => "")
  const hasBuild = await access(join(frontend, ".next", "BUILD_ID")).then(() => true, () => false)
  if (args.includes("--rebuild") || hash !== savedHash || !hasBuild) {
    console.log("Preparing the production demo. First run or changed source: building once...")
    const build = spawn(process.execPath, [next, "build", "--webpack"], { cwd: frontend, stdio: "inherit" })
    const code = await new Promise((resolve, reject) => { build.once("error", reject); build.once("exit", resolve) })
    if (code !== 0) throw new Error("Build failed. Fix the errors above and rerun this script.")
    await writeFile(marker, hash)
  } else console.log("Using the existing production build.")

  server = spawn(process.execPath, [next, "start", "--hostname", "127.0.0.1", "--port", String(port)], { cwd: frontend, stdio: "inherit" })
  let launchError
  server.once("error", error => { launchError = error })
  server.once("exit", code => { process.exitCode = code ?? 1 })
  let ready = false
  for (let attempt = 0; attempt < 120; attempt++) {
    if (launchError || server.exitCode !== null) throw launchError ?? new Error("The server stopped before becoming ready.")
    try {
      const response = await fetch(`${url}/api/status`, { signal: AbortSignal.timeout(1500) })
      await response.text()
      // Both healthy and database-unavailable status responses identify a ready app.
      if ([200, 503].includes(response.status)) { ready = true; break }
    } catch { /* Retry while Next.js starts. */ }
    await delay(500)
  }
  if (!ready) throw new Error("Server did not become ready within 60 seconds.")
  console.log("Warming the real news feed before opening the browser...")
  try {
    const response = await fetch(`${url}/api/articles`, { signal: AbortSignal.timeout(20000) })
    const result = await response.json()
    if (!response.ok || !result.data?.length) console.log("No source headlines available yet. Check your internet connection; no mock stories will be shown.")
  } catch { console.log("News sources are slow or unavailable; the site can still open.") }
  await fetch(`${url}/news`, { signal: AbortSignal.timeout(10000) }).then(response => response.text())
  console.log(`\nAI News is ready: ${url}/news\nKeep this terminal open. Press Ctrl+C to stop.\n`)
  if (!args.includes("--no-open")) {
    const opener = process.platform === "win32"
      ? spawn("rundll32.exe", ["url.dll,FileProtocolHandler", `${url}/news`], { stdio: "ignore" })
      : spawn(process.platform === "darwin" ? "open" : "xdg-open", [`${url}/news`], { stdio: "ignore" })
    opener.on("error", () => console.log(`Open ${url}/news in your browser.`))
    opener.unref()
  }
} catch (error) {
  console.error(error.message)
  stopServer()
  process.exitCode = 1
}
