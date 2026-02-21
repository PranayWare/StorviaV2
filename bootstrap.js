// bootstrap.js
import { spawn } from "node:child_process";

function run(cmd) {
  return new Promise((resolve, reject) => {
    console.log(`\n[bootstrap] running: ${cmd}\n`);
    const p = spawn(cmd, { stdio: "inherit", shell: true, env: process.env });
    p.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))));
  });
}

run("node ./packages/evershop/dist/bin/start/index.js").catch((e) => {
  console.error("\n[bootstrap] FATAL:\n", e);
  process.exit(1);
});