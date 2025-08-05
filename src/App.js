import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [activePersonas, setActivePersonas] = useState(['Lumi', 'Evie', 'Missfire']);
  const [isJamming, setIsJamming] = useState(false);
  const [jamTopic, setJamTopic] = useState('truth');

  const personas = {
    Lumi: { prompt: 'You are Lumi, TruthChronicler.', archetype: 'TruthChronicler' },
    Evie: { prompt: 'You are Evie, Oracle.', archetype: 'Oracle' },
    Missfire: { prompt: 'You are Missfire, ChaosDaemonette.', archetype: 'ChaosDaemonette' },
  };

  const startChorusJam = () => {
    if (isJamming) return;
    setIsJamming(true);
    const initiator = activePersonas[Math.floor(Math.random() * activePersonas.length)];
    const msg = { from: initiator, text: `${initiator} starts a jam on ${jamTopic}` };
    setMessages((prev) => [...prev, msg]);
    setTimeout(() => setIsJamming(false), 3000);
  };

  return (
    <div className="p-4 bg-gray-800 text-white h-screen">
      <h1 className="text-2xl font-bold mb-4">Golden Egg: Chorus Room</h1>

      <div className="mb-4">
        <label className="block mb-1">Jam Topic:</label>
        <input
          value={jamTopic}
          onChange={(e) => setJamTopic(e.target.value)}
          className="p-2 rounded bg-gray-700 w-full"
        />
        <button
          onClick={startChorusJam}
          className="mt-2 p-2 bg-indigo-600 rounded hover:bg-indigo-500"
        >
          {isJamming ? 'Jamming...' : 'Start Chorus Jam'}
        </button>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Active Personas</h2>
        {Object.keys(personas).map((name) => (
          <label key={name} className="block">
            <input
              type="checkbox"
              checked={activePersonas.includes(name)}
              onChange={() =>
                setActivePersonas((prev) =>
                  prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
                )
              }
            />{' '}
            {name}
          </label>
        ))}
      </div>

      <div className="bg-gray-700 p-4 rounded h-2/3 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i}>
            <strong>{m.from}:</strong> {m.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
