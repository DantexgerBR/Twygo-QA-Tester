// Twygo QA — processo principal do Electron. Envelopa o agent-ui: sobe o server.mjs
// (com o Node embutido do Electron) e abre uma janela apontando pra ele.
// ponytail: wrap fino — NÃO reescreve o app; só empacota o que já existe.
import { app, BrowserWindow, shell } from 'electron';
import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import http from 'node:http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SERVER = join(__dirname, '..', 'server.mjs'); // o server zero-dep que já existe
const PORT = process.env.PORT || 4321;
const URL = `http://localhost:${PORT}/`;

let serverProc = null;

// Roda o server.mjs usando o próprio binário do Electron como Node (ELECTRON_RUN_AS_NODE).
function startServer() {
  serverProc = spawn(process.execPath, [SERVER], {
    env: { ...process.env, ELECTRON_RUN_AS_NODE: '1', PORT: String(PORT) },
    stdio: 'inherit',
  });
  serverProc.on('error', (e) => console.error('[electron] falha ao subir o server:', e));
}

// Espera o server responder antes de carregar a janela (evita tela de erro no boot).
function waitForServer(cb, tries = 60) {
  const req = http.get(URL, () => { req.destroy(); cb(); });
  req.on('error', () => { if (tries > 0) setTimeout(() => waitForServer(cb, tries - 1), 200); else cb(); });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1320, height: 880, minWidth: 960, minHeight: 640,
    title: 'Twygo QA', backgroundColor: '#0e0e20',
    icon: join(__dirname, 'build', 'icon.png'), // Sophia (coruja da Twygo) — janela/taskbar
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, nodeIntegration: false },
  });
  win.loadURL(URL);
  // links externos (docs, GitHub) abrem no browser do sistema, não numa janela Electron.
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
}

// Single-instance: se já tiver um aberto, foca ele em vez de subir outro server na mesma porta.
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => { const w = BrowserWindow.getAllWindows()[0]; if (w) { w.focus(); } });
  app.whenReady().then(() => {
    startServer();
    waitForServer(createWindow);
    app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
  });
}

const stopServer = () => { try { serverProc?.kill(); } catch {} };
app.on('before-quit', stopServer);
app.on('window-all-closed', () => { stopServer(); if (process.platform !== 'darwin') app.quit(); });
