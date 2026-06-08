const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const { v4: uuid } = require("uuid");

const runPython = (
  code,
  input = ""
) => {
  return new Promise((resolve, reject) => {
    const jobId = uuid();
    const fileName = `${jobId}.py`;
    const filePath = path.join(
      __dirname,
      "..",
      "temp",
      fileName
    );

    fs.writeFileSync(filePath, code);
    const tempDir = path
      .join(__dirname, "..", "temp")
      .replace(/\\/g, "/");
    const dockerArgs = [
      "run",
      "-i",
      "--rm",
      "--memory=128m",
      "--cpus=0.5",
      "--network=none",
      "--pids-limit=64",
      "-v",
      `${tempDir}:/app`,
      "python:3.11",
      "python",
      `/app/${fileName}`,
    ];
    const dockerProcess = spawn(
      "docker.exe",
      dockerArgs
    );
    if (input) {
  dockerProcess.stdin.write(input);
}

dockerProcess.stdin.end();
    let stdout = "";
    let stderr = "";

    // TIMEOUT
    const timeout = setTimeout(() => {
      stderr = "Execution timed out";
      dockerProcess.kill();
    }, 15000);

    dockerProcess.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    dockerProcess.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    dockerProcess.on("close", (exitCode) => {
      clearTimeout(timeout);
      // DELETE FILE
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.log(err);
      }
      if (exitCode !== 0) {
        return reject(
          new Error(stderr)
        );
      }
      resolve(stdout);
    });
  });
};

module.exports = { runPython };