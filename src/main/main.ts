import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { startApiServer } from './api/server';
import { dbManager } from './database';

const isDev = process.env.NODE_ENV === 'development';

const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    height: 900,
    width: 1400,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../src/renderer/out/index.html'));
  }
};

app.whenReady().then(async () => {
  dbManager.connect();

  createWindow();
  
  if (dbManager) {
    startApiServer();
  }
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  dbManager.close();
});