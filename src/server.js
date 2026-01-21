// const express = require('express');
// const app = express();

// app.use(express.json());

// app.get('/status', (_req, res) => {
//   res.json({
//     status: 'Running',
//     timestamp: new Date().toISOString()
//   });
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


import http from 'http';
import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
