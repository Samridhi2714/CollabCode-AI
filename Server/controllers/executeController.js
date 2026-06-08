const {
  executeCode: executeCodeService,
} = require("../services/executeCode");

const executeCode = async (req, res) => {
  try {
    const { language, code, input } = req.body;
    if (!code) {
      return res.status(400).json({
        success: false,
        error: "Code is required",
      });
    }
    const output =
      await executeCodeService(
        language,
        code,
        input
      );
    res.json({
      success: true,
      output,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = { executeCode };