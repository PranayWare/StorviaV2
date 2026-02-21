import { spawn } from "node:child_process";

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: "inherit" });
    p.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))));
  });
}

const runInstall = process.env.RUN_INSTALL === "true";

if (runInstall) {
  console.log("RUN_INSTALL=true → running EverShop install...");
  await run("node", ["./packages/evershop/dist/bin/install/index.js"]);
  console.log("Install finished. Now starting server...");
} else {
  console.log("RUN_INSTALL not enabled → skipping install");
}

await run("node", ["./packages/evershop/dist/bin/start/index.js"]);