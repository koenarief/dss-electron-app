const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
const Realm = require("realm")
const bson = require("bson")

require('dotenv').config()

const isDev = process.env.DEBUG == 'true'

const appRealm = new Realm.App({ id: process.env.APPID })

let mainWindow

let realm

const ProductSchema = {
    name: 'products',
    properties: {
        _id: 'objectId',
        image: 'string',
        title: 'string',
        description: 'string',
        stock: 'int',
        price: 'int',
        rating: 'int',
    },
    primaryKey: '_id',
}

async function openRealm() {
    if (realm && !realm.isClosed) {
        return realm
    }

    await appRealm.logIn(Realm.Credentials.emailPassword(process.env.DBUSER, process.env.DBPASS))

    realm = await Realm.open({
        schema: [ProductSchema],
        deleteRealmIfMigrationNeeded: true,
        /**
        sync: {
          user: app.currentUser,
          flexible: true,
        },
        **/
    })

    return realm
}

async function productList() {
    await openRealm()
    return JSON.stringify(realm.objects("products"))
}

async function productCreate(args) {
    await openRealm()
    realm.write(() => {
        realm.create('products', {
            ...args,
            _id: bson.ObjectID(),
        })
    })
    return { success: true }
}

async function productDelete(args) {
    await openRealm()
    const product = realm.objectForPrimaryKey("products", bson.ObjectID(args.id))
    realm.write(() => {
        realm.delete(product)
    })
    return { success: true }
}

async function getLoginInfo(args) {
    const res = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: args.username,
            password: args.password,
            // expiresInMins: 60, // optional
        })
    })
    const json = await res.json()
    console.log(json)
    if (json.token) {
        return { token: json.token, success: true }
    }
    return { success: false }
}

function createWindow() {
    ipcMain.handle('get-login-info', async (event, args) => getLoginInfo(args))
    ipcMain.handle('product-list', (event) => productList())
    ipcMain.handle('product-create', (event, args) => productCreate(args))
    ipcMain.handle('product-delete', (event, args) => productDelete(args))

    mainWindow = new BrowserWindow({
        width: 960,
        height: 640,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: true
        },
    })

    const startURL = isDev
        ? 'http://localhost:5173'
        : `file://${path.join(__dirname, '../build/index.html')}`

    mainWindow.loadURL(startURL)

    mainWindow.on('closed', () => (mainWindow = null))
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
    if (realm && !realm.isClosed) {
        realm.close()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})

