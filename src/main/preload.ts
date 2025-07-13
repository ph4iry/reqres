import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // File operations
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  saveFile: (data: any) => ipcRenderer.invoke('dialog:saveFile', data),
  
  // API operations
  apiRequest: (method: string, url: string, data?: any) => 
    ipcRenderer.invoke('api:request', { method, url, data }),
});

// Type definitions for the exposed API
declare global {
  interface Window {
    electronAPI: {
      openFile: () => Promise<string>;
      saveFile: (data: any) => Promise<void>;
      apiRequest: (method: string, url: string, data?: any) => Promise<any>;
    };
  }
}