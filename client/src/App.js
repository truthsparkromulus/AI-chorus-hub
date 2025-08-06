import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [jamTopic, setJamTopic] = useState('truth');
  const [activePersonas, setActivePersonas] = useState(['Evie', 'Lumi', 'Missfire']);
  const [inputText, setInputText] = useState('');
  const [isJamming, setIsJamming] = useState(false);

  const personas = ['Evie', 'Lumi', 'Missfire'];

  const handleStartJam = async () => {
    if (isJamming) return;
    setIsJamming(true);

    const jamStart = {
      role: 'system',
      text: `Starting Chorus Jam on: ${jamTopic}`,
    };
    setMessages(prev => [...prev, jamStart]);

    let lastMessage = jamStart;

    // Simulate a 6-step jam with rotating personas
    for (let i = 0; i < 6; i++) {
      const persona = activePersonas[i % activePersonas.length];
      const response = await processMessage(persona, lastMessage.text);
      const message = {
        role: 'bot',
        from: persona,
        text: response,
      };
      setMessages(prev => [...prev, message]);
      lastMessage = message;
      await new Promise(res => setTimeout(res, 1200));
    }

    setIsJamming(false);
  };

  const processMessage = async (persona, input) => {
    // Simulated AI response
    const flavors = {
      Evie: `✨ Oracle Insight: “${input}” leads us inward.`,
      Lumi: `🌀 Myth Threading: “${input}” echoes across dimensions.`,
      Missfire: `💥 Pun Grenade: “${input}”? Sounds sus-pernatural!`,
    };
    return flavors[persona] || `(${persona} responds with curious silence...)`;
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const userMessage = {
      role: 'user',
      from: 'Romulus',
      text: inputText,
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Get replies from active personas
    for (const persona of activePersonas) {
      const reply = await processMessage(persona, inputText);
      setMessages(prev => [
        ...prev,
        {
          role: 'bot',
          from: persona,
          text: reply,
        },
      ]);
    }
  };

  return (
    <div className="app">
      <div className="sidebar">
        <h2>Golden Egg: Chorus Room</h2>
        <div>
          <h3>Active Personas</h3>
          {personas.map(p => (
            <label key={p}>
              <input
                type="checkbox"
                checked={activePersonas.includes(p)}
                onChange={() =>
                  setActivePersonas(prev =>
                    prev.includes(p)
                      ? prev.filter(name => name !== p)
                      : [...prev, p]
                  )
                }
              />
              {p}
            </label>
          ))}
        </div>
        <div className="controls">
          <input
            type="text"
            value={jamTopic}
            onChange={(e) => setJamTopic(e.target.value)}
            placeholder="Jam topic (e.g., truth)"
          />
          <button onClick={handleStartJam}>
            {isJamming ? 'Jamming...' : 'Start Chorus Jam'}
          </button>
        </div>
      </div>

      <div className="main">
        <div className="messages">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role}`}>
              <strong>{msg.from || msg.role}:</strong> {msg.text}
            </div>
          ))}
        </div>
        <div className="input-area">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default App;
