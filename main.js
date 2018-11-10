// Bring in features from the addons listed here: https://fiplab.com/apps/infinity-dashboard-for-mac?ref=producthunt
// Focus on UI-UX so even those without command-line fu can create custom functionality

const electron = require('electron')
const { app, BrowserWindow } = electron
const scriptsFolder = '/Users/vijay/Projects/micestat/sc'
const exec = require('child_process').exec
const fs = require('fs')

app.dock.hide()
  
function createWindow () {
	win = new BrowserWindow({
		alwaysOnTop: true,
		hasShadow: false,
		transparent: true,
		frame: false,
		thickFrame: false,
		toolbar: false,
		type: 'desktop',
		webPreferences: {
			webaudio: false,
			webgl: false,
			textAreasAreResizable: false
		}
	})

	win.setIgnoreMouseEvents(true)
	win.maximize()
	win.show()

	// DEBUG
	// win.webContents.openDevTools()
	// win.setIgnoreMouseEvents(false)


	// run all scripts in scripts folder and push output to front-end
	fs.readdir(scriptsFolder, (err, files) => {
		files
			.filter(x => !x.match('^\\.') && x.match('\\.sh$')) 				// ignore files that are either hidden or not shell scripts
			.map(file => {
				let params = file.split('.')
				let refreshPeriod = params[params.length - 2]
				let interval = 3600 * 1000

				if(refreshPeriod.indexOf('h') !== -1) {
					interval = parseInt(refreshPeriod.match('\\d+'), 10) * 3600 * 1000
				} else if(refreshPeriod.indexOf('m') !== -1) {
					interval = parseInt(refreshPeriod.match('\\d+'), 10) * 60 * 1000
				}

				exec(scriptsFolder + '/' + file, (err, stdout, stderr) => {
					setTimeout(() => {
						win.webContents.send('script_output', {txt: stdout})
					}, 5000)
				})
			})
	})

	let oldPos = {x: 0, y: 0}
	let getMousePos = () => {
		let pos = electron.screen.getCursorScreenPoint()
		
		if(oldPos.x !== pos.x || oldPos.y !== pos.y) {
			win.webContents.send('ping', {x: pos.x, y: pos.y})
			oldPos = pos
		}
		setTimeout(getMousePos, 32)
	}
	getMousePos()

	win.loadFile('index.html')
}

app.on('ready', createWindow)