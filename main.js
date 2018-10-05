const electron = require('electron')
const { app, BrowserWindow } = electron
  
  function createWindow () {
	win = new BrowserWindow({
		useContentSize: true,
		alwaysOnTop: true,
		hasShadow: false,
		transparent: true,
		frame: false,
		thickFrame: false,
		toolbar: false,
		type: 'desktop',
 		show: false, // disable initial window from showing
		webPreferences: {
			webaudio: false,
			webgl: false,
			textAreasAreResizable: false
		}
	})
	
	let prevMousePos = electron.screen.getCursorScreenPoint(), newMousePos, timeInactive = 0, panelVisible = false
	setInterval(() => {
		newMousePos = electron.screen.getCursorScreenPoint()
		
		if((prevMousePos.x == newMousePos.x)) {
			if(timeInactive > 10 && !panelVisible) {
				win.showInactive()
				panelVisible = true
				
		    	let followMouse = setInterval(() => win.setPosition(newMousePos.x + 10, newMousePos.y + 20, false), 30)

		    	// hide after 10 secs
				setTimeout(() => {
					console.log(timeInactive)
					if(timeInactive < 10) {
						clearInterval(followMouse)

						win.hide()
						panelVisible = false
					}
				}, 10000)
			}
		} else {
	    	timeInactive = 0
		}
		
		timeInactive++

		prevMousePos = newMousePos
	}, 1000)

	win.loadFile('index.html')
  }
  
  app.on('ready', createWindow)