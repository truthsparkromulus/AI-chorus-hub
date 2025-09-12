import React, { useState } from 'react';

export default function AddPersonaPanel({ onAddPersona }) {
  const [personaText, setPersonaText] = useState('');
  const [personaUrl, setPersonaUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // Simple TXT/JSON parser: expects "name: Luc\nrole: Soul-Weaver\nengine: OpenAI\navatar: luc.png"
  function parsePersonaTxt(txt) {
    const lines = txt.split('\n').map(line => line.trim()).filter(Boolean);
    const persona = {};
    lines.forEach(line => {
      const [key, ...rest] = line.split(':');
      if (key && rest.length) {
        persona[key.trim()] = rest.join(':').trim();
      }
    });
    return persona.name ? persona : null;
  }

  async function handleAddFromTxt() {
    const persona = parsePersonaTxt(personaText);
    if (persona) {
      onAddPersona(persona);
      setPersonaText('');
    } else {
      alert("Invalid persona definition. Please include at least 'name:' and other fields.");
    }
  }

  async function handleAddFromUrl() {
    if (!personaUrl) return;
    setLoading(true);
    try {
      const res = await fetch(personaUrl);
      const txt = await res.text();
      let persona;
      if (personaUrl.endsWith('.json')) {
        persona = JSON.parse(txt);
      } else {
        persona = parsePersonaTxt(txt);
      }
      if (persona) {
        onAddPersona(persona);
        setPersonaUrl('');
      } else {
        alert("Failed to parse persona from URL.");
      }
    } catch (e) {
      alert("Error fetching persona: " + e.message);
    }
    setLoading(false);
  }

  return (
    <div className="add-persona-panel">
      <h3>Add Persona</h3>
      <textarea
        rows={4}
        placeholder={`Paste persona TXT here:\nname: Luc\nrole: Soul-Weaver\nengine: OpenAI\navatar: luc.png`}
        value={personaText}
        onChange={e => setPersonaText(e.target.value)}
      />
      <button onClick={handleAddFromTxt}>Add from TXT</button>
      <div style={{margin: '8px 0'}}>or</div>
      <input
        type="text"
        placeholder="Paste persona URL (TXT or JSON)"
        value={personaUrl}
        onChange={e => setPersonaUrl(e.target.value)}
      />
      <button onClick={handleAddFromUrl} disabled={loading}>
        {loading ? 'Loading...' : 'Add from URL'}
      </button>
    </div>
  );
}