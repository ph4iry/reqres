import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  saveFile: (data: any) => ipcRenderer.invoke('dialog:saveFile', data),
  
  apiRequest: (method: string, url: string, data?: any) => 
    ipcRenderer.invoke('api:request', { method, url, data }),
});

declare global {
  interface Window {
    electronAPI: {
      openFile: () => Promise<string>;
      saveFile: (data: any) => Promise<void>;
      apiRequest: (method: string, url: string, data?: any) => Promise<any>;
    };
  }
}