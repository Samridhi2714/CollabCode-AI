const axios = require("axios");

const LANGUAGE_MAP = {
  javascript: {
    language: "nodejs",
    versionIndex: "4",
  },
  python: {
    language: "python3",
    versionIndex: "4",
  },
  java: {
    language: "java",
    versionIndex: "5",
  },
  cpp: {
    language: "cpp17",
    versionIndex: "1",
  },
  c: {
    language: "c",
    versionIndex: "5",
  },
};

const executeCode = async (language, code, input = "") => {
  const langConfig = LANGUAGE_MAP[language];

  if (!langConfig) {
    throw new Error("Unsupported language");
  }

  try {
    const response = await axios.post(
      "https://api.jdoodle.com/v1/execute",
      {
        clientId: process.env.JD_CLIENT_ID,
        clientSecret: process.env.JD_CLIENT_SECRET,
        script: code,
        stdin: input,
        language: langConfig.language,
        versionIndex: langConfig.versionIndex,
      },
      {
        timeout: 20000,
      },
    );

    const result = response.data;

    if (result.error) {
      throw new Error(result.error);
    }

    return result.output || "Program executed successfully.";
  } catch (error) {
    console.error("JDoodle Error:", error.response?.data || error.message);

    throw new Error(
      error.response?.data?.error || error.message || "Execution failed",
    );
  }
};

module.exports = { executeCode };
