const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
// ================= AI CHAT =================
router.post("/chat", async (req, res) => {
  try {
    const { prompt, code, language } = req.body;
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: "Prompt is required",
      });
    }
    // SMART AI SYSTEM PROMPT
    const finalPrompt = `
You are CollabCode AI.
You are an expert software engineer and coding mentor.

Your job:
- Explain code clearly
- Debug errors
- Optimize code
- Suggest best practices
- Teach beginners simply
- Respond in markdown
- Use proper code blocks

Programming Language: ${language}
Current Editor Code: ${code}
User Request: ${prompt}`;
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: finalPrompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 2000,
    });

    const aiResponse = completion.choices[0]?.message?.content;
    res.setHeader("Content-Type", "text/plain");
    res.write(aiResponse);
    res.end();
  } catch (error) {
    console.error("AI ERROR:", error.message);
    res.status(500).json({
      success: false,
      error: "AI request failed",
    });
  }
});
module.exports = router;
