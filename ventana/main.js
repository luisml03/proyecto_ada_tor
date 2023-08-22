const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 700
  });

  mainWindow.loadFile('index.html');


backClose()

}

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

function backClose() {
  mainWindow.on('closed', () => {
    // Enviar solicitud HTTP al backend para que cierre antes de cerrar la ventana
    const http = require('http');
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/closeBackend',
      method: 'POST'
    };

    const req = http.request(options, (res) => {
      console.log('Request sent to close backend');
    });

    req.on('error', (error) => {
      console.error('Error sending request to close backend:', error);
    });

    req.end();
  });
}
