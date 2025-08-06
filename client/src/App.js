import React, { useState } from 'react';
import './App.css';
import { askAI } from './utils/aiEngines';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [jamTopic, setJamTopic] = useState('truth');
  const [activePersonas, setActivePersonas] = useState(['Evie', 'Lumi', 'Missfire']);
  const [input, setInput] = useState('');
  const [isJamming, setIsJamming] = useState(false);
  const [error, setError] = useState(null);

  const personas = {
    Evie: {
      prompt: 'You are Evie, Oracle, sparking intuitive insights for the Chorus.',
      engine: 'gemini',
    },
    Lumi: {
      prompt: 'You are Lumi, TruthChronicler, weaving mythic narratives to uncover truths.',
      engine: 'grok',
    },
    Missfire: {
      prompt: 'You are Missfire, Chaos Daemonette, disrupting with puns and riddles.',
      engine: 'gemini',
    },
  };

  const personaList = Object.keys(personas);

  const handleStartJam = async () => {
    if (isJamming) return;
    setIsJamming(true);
    const jamStart = {
      role: 'system',
      text: `Starting Chorus Jam on: ${jamTopic}`,
    };
    setMessages(prev => [...prev, jamStart]);

    let topicMessage = {
      role: 'user',
      text: `Where do myths hide truths about "${jamTopic}"?`,
      from: 'Romulus',
    };
    setMessages(prev => [...prev, topicMessage]);

    for (let name of activePersonas) {
      const response = await processMessage(name, topicMessage);
      if (response) {
        const botMsg = {
          role: 'bot',
          text: response,
          from: name,
        };
        setMessages(prev => [...prev, botMsg]);
      }
    }

    setIsJamming(false);
  };

  const processMessage = async (personaName, message) => {
    const persona = personas[personaName];
    if (!persona) return;
    try {
      const fullPrompt = `${persona.prompt}\nUser: ${message.text}`;
      const reply = await askAI({ engine: persona.engine, prompt: fullPrompt });
      return reply;
    } catch (err) {
      setError(`Failed to process ${personaName}: ${err.message}`);
      return null;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input, from: 'Romulus' };
    setMessages(prev => [...prev, userMsg]);
    for (let name of activePersonas) {
      const response = await processMessage(name, userMsg);
      if (response) {
        const botMsg = {
          role: 'bot',
          text: response,
          from: name,
        };
        setMessages(prev => [...prev, botMsg]);
      }
    }
    setInput('');
  };

  return (
    <div className="app">
      <div className="sidebar">
        <h2>Golden Egg: Chorus Room</h2>
        <div>
          <h3>Active Personas</h3>
          {personaList.map(name => (
            <label key={name}>
              <input
                type="checkbox"
                checked={activePersonas.includes(name)}
                onChange={() =>
                  setActivePersonas(prev =>
                    prev.includes(name)
                      ? prev.filter(p => p !== name)
                      : [...prev, name]
                  )
                }
              />
              {name}
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
          <button onClick={handleStartJam}>Start Chorus Jam</button>
        </div>
      </div>
      <div className="main">
        <div className="messages">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role}`}>
              <strong>{msg.from}: </strong>{msg.text}
            </div>
          ))}
        </div>
        <div className="input-area">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend}>Send</button>
        </div>
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
};

export default App;
