import http from 'http';
import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);
app.get('/status', (_req, res) => {
  res.json({
    status: 'Running',
    timestamp: new Date().toISOString()
  });
});
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
