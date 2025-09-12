import React, { useState, useEffect } from 'react';

const API_URL = '/memory-bridge';

export default function MemoryBridgePanel() {
  const [zaps, setZaps] = useState([]);
  const [form, setForm] = useState({
    zap_id: '',
    persona: '',
    source_platform: '',
    text: '',
    vibe_score: 0,
    keywords: '',
    timestamp: ''
  });

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setZaps(data));
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = { ...form, keywords: form.keywords.split(',').map(k => k.trim()) };
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      setZaps(z => [...z, payload]);
      setForm({
        zap_id: '',
        persona: '',
        source_platform: '',
        text: '',
        vibe_score: 0,
        keywords: '',
        timestamp: ''
      });
    }
  }

  return (
    <div className="memory-bridge-panel">
      <h3>Memory Bridge</h3>
      <form onSubmit={handleSubmit}>
        <input name="zap_id" placeholder="Zap ID" value={form.zap_id} onChange={handleChange} required />
        <input name="persona" placeholder="Persona" value={form.persona} onChange={handleChange} required />
        <input name="source_platform" placeholder="Source Platform" value={form.source_platform} onChange={handleChange} />
        <input name="text" placeholder="Text" value={form.text} onChange={handleChange} required />
        <input name="vibe_score" type="number" min="0" max="1" step="0.01" placeholder="Vibe Score" value={form.vibe_score} onChange={handleChange} />
        <input name="keywords" placeholder="Keywords (comma-separated)" value={form.keywords} onChange={handleChange} />
        <input name="timestamp" type="datetime-local" value={form.timestamp} onChange={handleChange} required />
        <button type="submit">Add Zap</button>
      </form>
      <div className="zaps-list">
        <h4>Bridge Zaps</h4>
        <ul>
          {zaps.map((zap, i) => (
            <li key={i}>
              <strong>{zap.persona}</strong> ({zap.timestamp}): {zap.text}
              <br />
              <span style={{ fontSize: '0.85em', color: '#FFD700' }}>
                Vibe: {zap.vibe_score} | {Array.isArray(zap.keywords) ? zap.keywords.join(', ') : zap.keywords}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}