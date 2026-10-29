import app from './app.js';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`[VaultDrop API] Server running on http://localhost:${PORT}`);
  console.log(`[VaultDrop API] Health check at http://localhost:${PORT}/api/health`);
});