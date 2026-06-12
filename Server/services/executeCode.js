const axios = require("axios");

const LANGUAGE_MAP = {
  javascript: {
    language: "javascript",
    version: "18.15.0",
  },
  python: {
    language: "python",
    version: "3.10.0",
  },
  java: {
    language: "java",
    version: "15.0.2",
  },
  cpp: {
    language: "c++",
    version: "10.2.0",
  },
  c: {
    language: "c",
    version: "10.2.0",
  },
};

const executeCode = async (language, code, input = "") => {
  const pistonLang = LANGUAGE_MAP[language];

  if (!pistonLang) {
    throw new Error("Unsupported language");
  }

  try {
    const response = await axios.post(
      "https://emkc.org/api/v2/piston/execute",
      {
        language: pistonLang.language,
        version: pistonLang.version,
        files: [
          {
            content: code,
          },
        ],
        stdin: input,
      },
      {
        timeout: 20000,
      },
    );

    const result = response.data;

    if (result.run.stderr) {
      throw new Error(result.run.stderr);
    }

    return result.run.stdout || "Program executed successfully.";
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || "Execution failed",
    );
  }
};

module.exports = { executeCode };
