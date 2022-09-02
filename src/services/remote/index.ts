import { apiDjango } from '..'

export async function sendCommandService(command) {
	const response = await apiDjango.post('command', { cmd: command })
	return response.data
}

export async function screenSizeService() {
	const response = await apiDjango.get('screenSize')
	return response.data
}

export async function hotkeyService(hotkey) {
	const response = await apiDjango.post('hotkey', { hotkey: hotkey })
	return response.data
}

export async function mouseMoveService(x, y) {
	const response = await apiDjango.post('mouseMove', { x: x, y: y })
	return response.data
}

export async function keyPressService(keys) {
	const response = await apiDjango.post('keyPress', { keys: keys })
	return response.data
}

export async function mouseButtonService(button) {
	const response = await apiDjango.post('mouseButton', { button: button })
	return response.data
}

export async function mouseScrollService(value) {
	const response = await apiDjango.post('scroll', { value: value })
	return response.data
}

export async function mouseMoveButtonService(x, y, button) {
	const response = await apiDjango.post('mouseMoveButton', {
		x: x,
		y: y,
		button: button,
	})
	return response.data
}
