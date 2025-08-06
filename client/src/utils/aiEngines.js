export const callOpenAI = async (prompt) => {
  const key = import.meta.env.VITE_OPENAI_API_KEY;
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model: 'gpt-4', // Change to 'gpt-3.5-turbo' if you’re not using GPT-4
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
    })
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '[No response]';
};

export const callGemini = async (prompt) => {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '[No response]';
};
