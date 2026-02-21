// bootstrap.js
import { spawn } from "node:child_process";

function run(cmd) {
  return new Promise((resolve, reject) => {
    console.log(`\n[bootstrap] running: ${cmd}\n`);

    const p = spawn(cmd, {
      stdio: "inherit",   // <-- IMPORTANT: shows real error in Render logs
      shell: true,
      env: process.env,
    });

    p.on("close", (code) => {
      if (code === 0) return resolve();
      reject(new Error(`[bootstrap] command failed: "${cmd}" exited with code ${code}`));
    });
  });
}

async function main() {
  // Run DB install/migrations ONCE when RUN_INSTALL=true
  if (process.env.RUN_INSTALL === "true") {
    await run("node ./packages/evershop/dist/bin/install/index.js");
  }

  // Always start server
  await run("node ./packages/evershop/dist/bin/start/index.js");
}

main().catch((e) => {
  console.error("\n[bootstrap] FATAL:\n", e);
  process.exit(1);
});