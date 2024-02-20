const { ipcRenderer, contextBridge } = require('electron')

contextBridge.exposeInMainWorld('api', {
  getLoginInfo: (args) => ipcRenderer.invoke('get-login-info', args),
  productList: () => ipcRenderer.invoke('product-list'),
  productCreate: (args) => ipcRenderer.invoke('product-create', args),
  productDelete: (args) => ipcRenderer.invoke('product-delete', args),
})
