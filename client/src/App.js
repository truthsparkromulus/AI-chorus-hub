import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [jamTopic, setJamTopic] = useState('truth');
  const [activePersonas, setActivePersonas] = useState(['Evie', 'Lumi', 'Missfire']);

  const personas = ['Evie', 'Lumi', 'Missfire'];

  const handleStartJam = () => {
    const jamStart = {
      role: 'system',
      text: `Starting Chorus Jam on: ${jamTopic}`,
    };
    setMessages(prev => [...prev, jamStart]);
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
          <button onClick={handleStartJam}>Start Chorus Jam</button>
        </div>
      </div>
      <div className="main">
        <div className="messages">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role}`}>
              {msg.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
