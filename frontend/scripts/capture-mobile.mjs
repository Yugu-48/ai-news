import { writeFile } from "node:fs/promises"

const tabs = await (await fetch("http://127.0.0.1:9222/json")).json()
const target = tabs.find((tab) => tab.type === "page")
if (!target) throw new Error("No Chrome page target")

const socket = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true })
  socket.addEventListener("error", reject, { once: true })
})

let nextId = 0
const pending = new Map()
socket.addEventListener("message", (event) => {
  const response = JSON.parse(event.data)
  const callback = pending.get(response.id)
  if (callback) {
    pending.delete(response.id)
    callback(response)
  }
})

function command(method, params = {}) {
  const id = ++nextId
  return new Promise((resolve, reject) => {
    pending.set(id, (response) => response.error ? reject(new Error(response.error.message)) : resolve(response.result))
    socket.send(JSON.stringify({ id, method, params }))
  })
}

await command("Page.enable")
await command("Runtime.enable")
await command("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true })
await command("Emulation.setTouchEmulationEnabled", { enabled: true })
await command("Page.navigate", { url: "http://localhost:3000/" })
await new Promise((resolve) => setTimeout(resolve, 15000))
const metrics = await command("Runtime.evaluate", { expression: "JSON.stringify({innerWidth: innerWidth, visualWidth: visualViewport.width, clientWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth, title: document.title, overflow: [...document.querySelectorAll('body *')].filter(el => { const r=el.getBoundingClientRect(); return r.right > 391 && r.width > 1 && getComputedStyle(el).position !== 'absolute' }).slice(0,8).map(el => ({tag:el.tagName,className:typeof el.className==='string'?el.className.slice(0,80):''}))})", returnByValue: true })
console.log(metrics.result.value)
const capture = await command("Page.captureScreenshot", { format: "png", captureBeyondViewport: false })
await writeFile("../docs/screenshots/home-mobile-emulated.png", Buffer.from(capture.data, "base64"))
await command("Runtime.evaluate", { expression: "document.querySelector('button[aria-label=\"Open menu\"]')?.click()" })
await new Promise((resolve) => setTimeout(resolve, 800))
const menu = await command("Runtime.evaluate", { expression: "document.querySelector('nav[aria-label=\"Mobile navigation\"]')?.querySelectorAll('a').length ?? 0", returnByValue: true })
console.log(`mobile menu links: ${menu.result.value}`)
await command("Runtime.evaluate", { expression: "document.querySelector('button[aria-label=\"Close menu\"]')?.click()" })
const before = await command("Runtime.evaluate", { expression: "document.querySelectorAll('article').length", returnByValue: true })
await command("Runtime.evaluate", { expression: "[...document.querySelectorAll('button')].find(button => button.textContent.trim() === 'Research')?.click()" })
await new Promise((resolve) => setTimeout(resolve, 500))
const after = await command("Runtime.evaluate", { expression: "document.querySelectorAll('article').length", returnByValue: true })
console.log(`article cards before/after Research filter: ${before.result.value}/${after.result.value}`)
await command("Runtime.evaluate", { expression: "document.querySelector('input[aria-label=\"Search articles\"]')?.focus()" })
await command("Input.insertText", { text: "no-such-article-zz" })
await new Promise((resolve) => setTimeout(resolve, 500))
const searchCount = await command("Runtime.evaluate", { expression: "document.querySelectorAll('article').length", returnByValue: true })
console.log(`article cards after unmatched search: ${searchCount.result.value}`)
await command("Runtime.evaluate", { expression: "document.querySelector('button[aria-label=\"Toggle color theme\"]')?.click()" })
await new Promise((resolve) => setTimeout(resolve, 500))
const theme = await command("Runtime.evaluate", { expression: "document.documentElement.className", returnByValue: true })
console.log(`theme class after toggle: ${theme.result.value}`)
socket.close()
