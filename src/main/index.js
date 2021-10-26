import { app, BrowserWindow, Menu, Tray, globalShortcut, ipcMain, shell, dialog, nativeImage, TouchBar } from 'electron'
import db from './utils/db'
import book from './utils/book'
import { settingURL, desktopURL, homeURL } from './config/StaticPath'
import request from 'request'

const { TouchBarButton, TouchBarSpacer } = TouchBar

function createTouchBarButton() {
    let button1 = new TouchBarButton({
        label: '🤒 Previous',
        backgroundColor: '#a923ce',
        click: () => {
            PreviousPage();
        }
    })

    let button2 = new TouchBarButton({
        label: '🤪 Next',
        backgroundColor: '#2352ce',
        click: () => {
            NextPage();
        }
    })

    let button3 = new TouchBarButton({
        label: '👻 Fuck !',
        backgroundColor: '#ce2323',
        click: () => {
            BossKey();
        }
    })

    let touchBar = new TouchBar({
        items: [
            button1,
            new TouchBarSpacer({ size: 'small' }),
            button2,
            new TouchBarSpacer({ size: 'small' }),
            button3,
            new TouchBarSpacer({ size: 'small' })
        ]
    })

    return touchBar;
}

if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let tray;
let settingWindow;
let desktopWindow;
let homeWindow;
let initBook;


function init() {
    Menu.setApplicationMenu(null);

    initBook = book.initBooks();
    createWindowDesktop();

    createKey();
    createTray();
}

function createWindowHome() {
    homeWindow = new BrowserWindow({
        title: '书 架',
        useContentSize: true,
        width: 1200,
        height: 700,
        resizable: false,
        maximizable: false,
        minimizable: false,
        webPreferences: {
            nodeIntegration: true,
        },
    })

    let webContents = homeWindow.webContents;
    webContents.on('did-finish-load', () => {
        webContents.setZoomFactor(1);
        webContents.setVisualZoomLevelLimits(1, 1);
        webContents.setLayoutZoomLevelLimits(0, 0);
    })

    homeWindow.loadURL(homeURL)

    homeWindow.on('closed', () => {
        homeWindow = null
    })
}

function createWindowSetting() {
    settingWindow = new BrowserWindow({
        title: '设 置',
        useContentSize: true,
        width: 715,
        height: 630,
        resizable: false,
        maximizable: false,
        minimizable: false,
        webPreferences: {
            nodeIntegration: true,
        },
    })

    let webContents = settingWindow.webContents;
    webContents.on('did-finish-load', () => {
        webContents.setZoomFactor(1);
        webContents.setVisualZoomLevelLimits(1, 1);
        webContents.openDevTools();
        webContents.setLayoutZoomLevelLimits(0, 0);
    })

    settingWindow.loadURL(settingURL)

    settingWindow.on('closed', () => {
        settingWindow = null
    })
}

function createWindowDesktop() {
    var width = 856;
    var height = 47;
    var x = 356;
    var y = 429;

    var desktop_wh = db.get('desktop_wh');
    var desktop_wz = db.get('desktop_wz');

    var arr_wh = desktop_wh.split(",");
    var arr_wz = desktop_wz.split(",");

    if (arr_wh.length == 2) {
        width = parseInt(arr_wh[0]);
        height = parseInt(arr_wh[1]);
    }

    if (arr_wh.length == 2) {
        x = parseInt(arr_wz[1]);
        y = parseInt(arr_wz[0]);
    }

    desktopWindow = new BrowserWindow({
        useContentSize: true,
        width: width,
        height: height,
        resizable: true,
        frame: false,
        maximizable: false,
        transparent: true,
        hasShadow: false,
        y: x,
        x: y,
        webPreferences: {
            nodeIntegration: true,
        },
    })

    let webContents = desktopWindow.webContents;
    webContents.on('did-finish-load', () => {
        webContents.setZoomFactor(1);
        webContents.setVisualZoomLevelLimits(1, 1);
        if (initBook.code === 1){
            updateText(initBook.msg);
        }else{
            global.chapter = initBook.data;
        }
        webContents.setLayoutZoomLevelLimits(0, 0);
    })

    desktopWindow.loadURL(desktopURL)

    desktopWindow.setAlwaysOnTop(true);

    desktopWindow.setSkipTaskbar(true);

    desktopWindow.setTouchBar(createTouchBarButton())

    desktopWindow.on('closed', () => {
        desktopWindow = null
    })

    desktopWindow.on('resize', () => {
        var size = desktopWindow.getSize();
        db.set("desktop_wh", size[0].toString() + "," + size[1].toString());
    })

    desktopWindow.on('move', () => {
        var position = desktopWindow.getPosition();
        db.set("desktop_wz", position[0].toString() + "," + position[1].toString());
    })
}

function setText(text) {
    global.text = {
        text: text
    }
}

let autoPageTime;

function AutoPage() {
    if (db.get('auto_page') === '1') {
        clearInterval(autoPageTime);
        db.set("auto_page", "0")
        var second = db.get('second');
        autoPageTime = setInterval(function () {
            NextPage();
        }, parseInt(second) * 1000);
    } else if (db.get('auto_page') === '0') {
        db.set("auto_page", "1")
        clearInterval(autoPageTime);
    }
}


function updateText(text) {
    setText(text);
    if (desktopWindow != null) {
        desktopWindow.webContents.send('text', 'ping');
    }
}

function NextPage() {
    let text = book.getNextPage();
    updateText(text);
}

function PreviousPage() {
    let text = book.getPreviousPage();
    updateText(text);
}

function BossKey() {
    tray.setTitle("");

    if (desktopWindow != null) {
        if (desktopWindow.isVisible()) {
            desktopWindow.hide();
        } else {
            desktopWindow.show();
        }
    }
}


function checkUpdate() {
    request({
        url: "https://gitee.com/lauix/public_version/raw/master/version.txt",
        method: "GET"
    }, function (err, res, body) {
        const logo = `${__static}/icon.png`;
        const image = nativeImage.createFromPath(logo)

        var newVersion = parseFloat(body);

        var currVersion = 4.0
        if (newVersion > currVersion) {
            const options = {
                type: 'info',
                title: '检查更新',
                message: "发现新版本，是否更新？",
                buttons: ['是', '否'],
                icon: image
            }
            dialog.showMessageBox(options, function (index) {
                if (index == 0) {
                    shell.openExternal('https://github.com/')
                }
            })
        } else {
            const options = {
                type: 'info',
                title: '检查更新',
                message: "当前为最新版本",
                buttons: ['确认'],
                icon: image
            }
            dialog.showMessageBox(options)
        }
    })
}

function Exit() {
    app.quit();
}

var key_previousx = null;
var key_nextx = null;
var key_bossx = null;
var key_autox = null;

function createKey() {
    try {
        let xkey_previous = db.get('key_previous');
        // 如果指令有问题，则不注册
        if (!xkey_previous || xkey_previous.indexOf('+') < 0) {
            return
        }
        // 注册之前删除上一次注册的全局快捷键
        if (key_previousx != null) {
            globalShortcut.unregister(key_previousx)
        }

        key_previousx = xkey_previous
        globalShortcut.register(xkey_previous, function () {
            PreviousPage();
        })

        let xkey_next = db.get('key_next');
        // 如果指令有问题，则不注册
        if (!xkey_next || xkey_next.indexOf('+') < 0) {
            return
        }
        // 注册之前删除上一次注册的全局快捷键
        if (key_nextx != null) {
            globalShortcut.unregister(key_nextx)
        }
        key_nextx = xkey_next
        globalShortcut.register(xkey_next, function () {
            NextPage();
        })

        let xkey_boss = db.get('key_boss');
        // 如果指令有问题，则不注册
        if (!xkey_boss || xkey_boss.indexOf('+') < 0) {
            return
        }
        // 注册之前删除上一次注册的全局快捷键
        if (key_bossx != null) {
            globalShortcut.unregister(key_bossx)
        }
        key_bossx = xkey_boss
        globalShortcut.register(xkey_boss, function () {
            BossKey();
        })

        let xkey_auto = db.get('key_auto');
        // 如果指令有问题，则不注册
        if (!xkey_auto || xkey_auto.indexOf('+') < 0) {
            return
        }
        // 注册之前删除上一次注册的全局快捷键
        if (key_autox != null) {
            globalShortcut.unregister(key_autox)
        }
        key_autox = xkey_auto
        globalShortcut.register(xkey_auto, function () {
            AutoPage();
        })
    } catch (error) {
        const logo = `${__static}/icon.png`;
        const image = nativeImage.createFromPath(logo)

        const options = {
            type: 'info',
            title: '快捷键异常',
            message: "设置快捷键错误，请看文档异常汇总！",
            buttons: ['打开文档', '否'],
            icon: image
        }
        dialog.showMessageBox(options, function (index) {
            if (index == 0) {
                shell.openExternal('https://thief.im/#/use?id=%e5%bc%82%e5%b8%b8%e6%b1%87%e6%80%bb')
            }
        })

        Exit();
    }

    globalShortcut.register('CommandOrControl+Alt+X', function () {
        Exit();
    })
}

function createTray() {
    const menubarLogo = `${__static}/win.png`

    var menuList = [];
    menuList.push({
        label: '关于',
        click() {
            const logo = `${__static}/icon.png`;
            const image = nativeImage.createFromPath(logo)

            const options = {
                type: 'info',
                title: '关于',
                message: "knovel",
                buttons: ['确认'],
                icon: image
            }
            dialog.showMessageBox(options)
        }
    }, {
        label: '检查更新',
        click() {
            checkUpdate();
        }
    });

    menuList.push({
        type: "separator"
    }, {
        label: '书架',
        click() {
            if (homeWindow === "null" || homeWindow === "undefined" || typeof (homeWindow) === "undefined") {
                createWindowHome();
            } else {
                try {
                    homeWindow.show();
                } catch (error) {
                    createWindowHome();
                }
            }
        }
    }, {
        label: '设置',
        click() {
            if (settingWindow === "null" || settingWindow === "undefined" || typeof (settingWindow) === "undefined") {
                createWindowSetting();
            } else {
                try {
                    settingWindow.show();
                } catch (error) {
                    createWindowSetting();
                }
            }
        }
    }, {
        type: "separator"
    }, {
        accelerator: 'CommandOrControl+Alt+X',
        label: '退出',
        click() {
            Exit();
        }
    });

    tray = new Tray(menubarLogo)
    tray.setContextMenu(Menu.buildFromTemplate(menuList))

}

ipcMain.on('bg_text_color', function (event, data) {
    tray.destroy();
    createKey();
    createTray();
    let refresh = book.refresh(data.id);
    if(refresh.code===0){
        global.chapter = refresh.data;
    }

    if (desktopWindow != null) {
        desktopWindow.webContents.send('bg_text_color', 'ping');
    }

})

ipcMain.on('jump_page', function () {
    NextPage();
})

ipcMain.on('MouseAction', function (e, v) {
    if (desktopWindow != null) {
        if (v == "1") {
            // 鼠标左击
            NextPage();
        } else if (v == "2") {
            // 鼠标右击
            PreviousPage();
        } else if (v == "3") {
            // 鼠标进入
        } else if (v == "4") {
            // 鼠标移出
            BossKey();
        }
    }
})

app.on('ready', init)

app.on('window-all-closed', () => {

    if (process.platform !== 'darwin') {
        app.quit()
    }
})
