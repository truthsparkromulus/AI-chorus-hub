const express = require('express');
const app = express();

app.use(express.json());

// Register Memory Bridge route
const memoryBridge = require('./routes/memoryBridge');
app.use('/memory-bridge', memoryBridge);

// ...other existing routes...

module.exports = app;