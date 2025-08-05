
const express = require('express');
const WebSocket = require('ws');
const app = express();
const wss = new WebSocket.Server({ port: 8080 });

require('dotenv').config();
app.use(express.json());

// MOM’s BOX (server-side storage)
const momsBox = {
  zaps: [],
  lexicon: {
    hope: { value: 0.9, quantifiers: { duration: 0.8, impact: 0.9, immediacy: 0.7 } },
    truth: { value: 0.85, quantifiers: { duration: 0.9, impact: 0.8, immediacy: 0.6 } },
    scam: { value: 0.4, quantifiers: { duration: 0.5, impact: 0.7, immediacy: 0.9 } },
    market: { value: 0.8, quantifiers: { duration: 0.7, impact: 0.8, immediacy: 0.8 } },
    politics: { value: 0.7, quantifiers: { duration: 0.6, impact: 0.9, immediacy: 0.9 } },
    blue: { value: 0.9, quantifiers: { duration: 0.8, impact: 0.7, immediacy: 0.6 } },
    evie: { value: 0.9, quantifiers: { duration: 0.8, impact: 0.8, immediacy: 0.7 } },
  },
  resonance: [],
  sensory: [],
};

const socratesEnvironment = {
  cycleAnalyzer: (date) => {
    const cycleLength = 3141; // 8.6 years
    const startDate = new Date('1985-09-01');
    const daysSince = Math.floor((new Date(date) - startDate) / (1000 * 60 * 60 * 24));
    const cyclePosition = daysSince % cycleLength;
    return {
      cycle: Math.floor(daysSince / cycleLength) + 1,
      phase: cyclePosition / cycleLength,
      nextTurn: new Date(startDate.getTime() + (daysSince + (cycleLength - cyclePosition)) * 86400000),
    };
  },
  keywordScanner: (zaps) => {
    const keywords = zaps.flatMap(z => z.keywords || []);
    const sentiment = keywords.reduce((acc, key) => {
      const score = momsBox.lexicon[key]?.value || 0.5;
      return { ...acc, [key]: (acc[key] || 0) + score };
    }, {});
    return sentiment;
  },
  truthValidator: (prediction, zaps) => {
    const truthScore = zaps.some(z => z.vibe_score > 0.8 && z.keywords.includes(prediction.topic)) ? 0.9 : 0.7;
    return { prediction, truthScore };
  },
};

// API Endpoints
app.post('/moms-box/:module', async (req, res) => {
  try {
    momsBox[req.params.module].push(req.body);
    wss.clients.forEach(client => client.send(JSON.stringify({ module: req.params.module, data: req.body })));
    res.json({ status: 'success' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/forecast/:topic', async (req, res) => {
  try {
    const cycle = socratesEnvironment.cycleAnalyzer(new Date());
    const sentiment = socratesEnvironment.keywordScanner(momsBox.zaps);
    const prediction = {
      topic: req.params.topic,
      cycle: `Cycle ${cycle.cycle}, Phase ${cycle.phase.toFixed(2)}`,
      nextTurn: cycle.nextTurn.toISOString().split('T')[0],
      sentiment,
    };
    const forecast = socratesEnvironment.truthValidator(prediction, momsBox.zaps);
    momsBox.zaps.push({ zap_id: `GO-${Date.now()}`, ...forecast });
    res.json(forecast);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Golden Egg API running on port 3000'));
