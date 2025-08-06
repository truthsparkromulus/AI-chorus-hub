// aiEngines.js

const apiKeys = {
  openai: process.env.REACT_APP_OPENAI_KEY,
  gemini: process.env.REACT_APP_GEMINI_KEY,
  grok: process.env.REACT_APP_GROK_KEY,
};

export const askAI = async ({ engine, prompt }) => {
  if (!engine || !prompt) throw new Error("Missing engine or prompt.");

  if (engine === "chatgpt") {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKeys.openai}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });
    const data = await response.json();
    return data.choices?.[0]?.message?.content || "[no response]";
  }

  if (engine === "gemini") {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKeys.gemini}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });
    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "[no response]";
  }

  if (engine === "grok") {
    const response = await fetch("https://api.x.ai/grok/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKeys.grok}`,
      },
      body: JSON.stringify({
        model: "grok-1",
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await response.json();
    return data.choices?.[0]?.message?.content || "[no response]";
  }

  return "[unknown engine]";
};

