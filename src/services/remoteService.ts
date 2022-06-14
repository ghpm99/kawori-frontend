import axios from 'axios'

const apiRemote = axios.create({
	baseURL: '/api/remote/',
	headers: {
		'Access-Control-Allow-Origin': '*',
	},
})

export async function sendCommandService(command) {
	const response = await apiRemote.post('command', { cmd: command })
	return response.data
}

export async function screenSizeService() {
	const response = await apiRemote.get('screenSize')
	return response.data
}

export async function hotkeyService(hotkey) {
	const response = await apiRemote.post('hotkey', { hotkey: hotkey })
	return response.data
}

export async function mouseMoveService(x, y) {
	const response = await apiRemote.post('mouseMove', { x: x, y: y })
	return response.data
}

export async function keyPressService(keys) {
	const response = await apiRemote.post('keyPress', { keys: keys })
	return response.data
}

export async function mouseButtonService(button) {
	const response = await apiRemote.post('mouseButton', { button: button })
	return response.data
}

export async function mouseScrollService(value) {
	const response = await apiRemote.post('scroll', { value: value })
	return response.data
}

export async function mouseMoveButtonService(x, y, button) {
	const response = await apiRemote.post('mouseMoveButton', {
		x: x,
		y: y,
		button: button,
	})
	return response.data
}
