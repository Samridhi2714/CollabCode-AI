const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const runJava = (
  code,
  input = ""
) => {
  return new Promise((resolve, reject) => {

    // JAVA FILE MUST MATCH CLASS NAME
    const fileName = "Main.java";
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
      "eclipse-temurin:17",
      "sh",
      "-c",
      "javac /app/Main.java && java -cp /app Main",
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
        // DELETE JAVA FILE
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        // DELETE CLASS FILE
        const classFile = path.join(
          __dirname,
          "..",
          "temp",
          "Main.class"
        );
        if (fs.existsSync(classFile)) {
          fs.unlinkSync(classFile);
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

module.exports = { runJava };