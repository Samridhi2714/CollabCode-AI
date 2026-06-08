const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const { v4: uuid } = require("uuid");

const runJavaScript = (
  code,
  input = ""
) => {
  return new Promise((resolve, reject) => {

    // UNIQUE FILE
    const jobId = uuid();
    const fileName = `${jobId}.js`;
    // TEMP FILE PATH
    const filePath = path.join(
      __dirname,
      "..",
      "temp",
      fileName
    );

    // WRITE USER CODE
    fs.writeFileSync(filePath, code);

    // WINDOWS SAFE PATH
    const tempDir = path
      .join(__dirname, "..", "temp")
      .replace(/\\/g, "/");

    // DOCKER ARGUMENTS
    const dockerArgs = [
      "run",
      "-i",
      "--rm",
      "--memory=128m", // MEMORY LIMIT
      "--cpus=0.5", // CPU LIMIT
      "--network=none", // NO NETWORK
      "--pids-limit=64", // PROCESS LIMIT
      "-v",
      `${tempDir}:/app`,
      "node:18",
      "node",
      `/app/${fileName}`,
    ];

    // SPAWN DOCKER
    const dockerProcess = spawn(
      "docker.exe",
      dockerArgs
    );
    if (input) {
  dockerProcess.stdin.write(input);
}
dockerProcess.stdin.end();
    // EXECUTION TIMEOUT
    const timeout = setTimeout(() => {
      stderr = "Execution timed out";
      dockerProcess.kill();
    }, 15000); 

    let stdout = "";
    let stderr = "";

    // STDOUT
    dockerProcess.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    // STDERR
    dockerProcess.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    // PROCESS ERROR
    dockerProcess.on("error", (error) => {
      reject(error);

    });

    // PROCESS CLOSE
    dockerProcess.on("close", (exitCode) => {
      clearTimeout(timeout);
      
      // DELETE TEMP FILE
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.log("DELETE ERROR:", err);
      }

      // HANDLE FAILURE
      if (exitCode !== 0) {
        if (stderr.includes("timed out")) {
          return reject(new Error("Execution timed out"));
        }
        return reject(
          new Error(stderr || "Execution failed")
        );
      }

      // SUCCESS
      resolve(stdout);
    });
  });
};

module.exports = { runJavaScript };