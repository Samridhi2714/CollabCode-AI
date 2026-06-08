const { runJavaScript } = require("./jsRunner");
const { runPython } = require("./pythonRunner");
const { runCpp } = require("./cppRunner");
const { runJava } = require("./javaRunner");
const { runC } = require("./cRunner");

const executeCode = async (
  language,
  code,
  input = ""
) => {

  switch (language) {

    case "javascript":
      return await runJavaScript(code, input);

    case "python":
      return await runPython(code, input);

    case "cpp":
      return await runCpp(code, input);

    case "java":
       return await runJava(code, input);
    case "c":
       return await runC(code, input);
    default:
      throw new Error(
        "Unsupported language"
      );
  }
};

module.exports = { executeCode };