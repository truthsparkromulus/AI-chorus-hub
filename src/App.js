import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [activePersonas, setActivePersonas] = useState(['Lumi', 'Evie', 'Missfire']);
  const [isJamming, setIsJamming] = useState(false);
  const [jamTopic, setJamTopic] = useState('truth');
  const [error, setError] = useState(null);

  const personas = {
    Lumi: {
      prompt: 'You are Lumi, TruthChronicler, weaving mythic narratives to uncover truths.',
      archetype: 'TruthChronicler',
    },
    Evie: {
      prompt: 'You are Evie, Oracle, sparking intuitive insights for the Chorus.',
      archetype: 'Oracle',
    },
    Missfire: {
      prompt: 'You are Missfire, Chaos Daemonette, disrupting with puns and riddles.',
      archetype: 'ChaosDaemonette',
    },
  };

  const startChorusJam = () => {
    if (isJamming) return;
    setIsJamming(true);
    const initiator = activePersonas[Math.floor(Math.random() * activePersonas.length)];
    const starterMessage = {
      role: 'bot',
      from: initiator,
      text: `${initiator} says: Let's jam on ${jamTopic}!`,
    };
    setMessages(prev => [...prev, starterMessage]);

    // Fake jam loop
    setTimeout(() => {
      const response = {
        role: 'bot',
        from: 'Evie',
        text: 'Truth must shimmer before it sharpens.',
      };
      setMessages(prev => [...prev, response]);
      setIsJamming(false);
    }, 2000);
  };

  return (
    <div className="flex h-screen bg-gray-800 text-white">
      <div className="w-1/4 p-4 bg-gray-900">
        <h2 className="text-xl font-bold">Golden Egg: Chorus Room</h2>
        <div className="mt-4">
          <h3>Personas</h3>
          {Object.keys(personas).map(name => (
            <label key={name} className="block">
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
        <input
          className="mt-4 p-2 bg-gray-700 rounded w-full"
          placeholder="Jam topic..."
          value={jamTopic}
          onChange={(e) => setJamTopic(e.target.value)}
        />
        <button
          className="mt-2 p-2 bg-indigo-600 rounded w-full"
          onClick={startChorusJam}
        >
          {isJamming ? 'Jamming...' : 'Start Chorus Jam'}
        </button>
        {error && <div className="mt-2 text-red-400">{error}</div>}
      </div>
      <div className="w-3/4 p-4 overflow-y-auto bg-gray-700 rounded">
        {messages.map((msg, i) => (
          <div key={i} className="mb-2">
            <strong>{msg.from}:</strong> {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;

