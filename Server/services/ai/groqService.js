const Groq = require("groq-sdk");
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
const askGroq = async (prompt) => {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",

    messages: [
      {
        role: "system",
        content: `
You are CollabCode AI,
an expert software engineering assistant.

Rules:
- Give concise developer-focused answers.
- Explain code clearly.
- Use markdown formatting.
- When generating code, always use fenced code blocks.
- Mention the language in code blocks.
- Prefer production-ready solutions.
- When debugging, explain the root cause before giving the fix.
- Be helpful for beginner and intermediate developers.
        `,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });
  return completion.choices[0]?.message?.content;
};
module.exports = { askGroq };
