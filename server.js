// Servidor de produção (Heroku): entrega o build do Angular e faz fallback das rotas do SPA para o index.html
const express = require('express');
const path = require('path');

const app = express();
const DIST = path.join(__dirname, 'dist', 'psi-academic-analytics-vi');
const PORT = process.env.PORT || 4200;
// Arquivos gerados pelo Angular com hash no nome (ex.: main.971d4fd62beb44be.js) podem ficar em cache indefinidamente
const HASHED_FILE = /\.[0-9a-f]{16,}\.(js|css)$/;

app.use(
  express.static(DIST, {
    index: false,
    setHeaders: (res, filePath) => {
      res.setHeader('Cache-Control', HASHED_FILE.test(filePath) ? 'public, max-age=31536000, immutable' : 'no-cache');
    },
  })
);

app.use((req, res) => {
  // Arquivo inexistente (ex.: chunk de um deploy anterior) deve dar 404, não o index.html
  if (path.extname(req.path)) {
    return res.sendStatus(404);
  }
  res.sendFile(path.join(DIST, 'index.html'), { headers: { 'Cache-Control': 'no-cache' } });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
