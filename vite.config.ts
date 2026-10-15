import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

function musicUploadPlugin(): Plugin {
  return {
    name: 'music-upload-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/upload-bgm' && req.method === 'POST') {
          const chunks: Buffer[] = [];
          req.on('data', (chunk: Buffer) => chunks.push(chunk));
          req.on('end', () => {
            try {
              const buffer = Buffer.concat(chunks);
              if (buffer.length < 100) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: '파일이 너무 작거나 비어 있습니다.' }));
                return;
              }

              const musicDir = path.resolve(process.cwd(), 'public/music');
              if (!fs.existsSync(musicDir)) {
                fs.mkdirSync(musicDir, { recursive: true });
              }

              const targetFile = path.join(musicDir, 'bgm.mp3');
              fs.writeFileSync(targetFile, buffer);

              // Also mirror to dist if dist exists
              const distMusicDir = path.resolve(process.cwd(), 'dist/music');
              if (fs.existsSync(distMusicDir)) {
                fs.writeFileSync(path.join(distMusicDir, 'bgm.mp3'), buffer);
              }

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, message: 'bgm.mp3 저장 완료', size: buffer.length }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        if (req.url === '/api/check-bgm' && req.method === 'GET') {
          const targetFile = path.resolve(process.cwd(), 'public/music/bgm.mp3');
          if (fs.existsSync(targetFile)) {
            const stats = fs.statSync(targetFile);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ exists: true, size: stats.size }));
          } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ exists: false }));
          }
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), musicUploadPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
