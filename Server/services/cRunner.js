const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const { v4: uuid } = require("uuid");

const runC = (
  code,
  input = ""
) => {
  return new Promise((resolve, reject) => {
    const jobId = uuid();
    const fileName = `${jobId}.c`;
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
    const outputFile = `${jobId}`;
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
      "gcc:latest",
      "sh",
      "-c",
      `gcc /app/${fileName} -o /app/${outputFile} && /app/${outputFile}`,

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
      try {

        // DELETE SOURCE FILE
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        // DELETE EXECUTABLE
        const exePath = path.join(
          __dirname,
          "..",
          "temp",
          outputFile
        );
        if (fs.existsSync(exePath)) {
          fs.unlinkSync(exePath);
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

module.exports = { runC };