import { apiDjango } from '..'

export async function sendCommandService(command: string) {
    const response = await apiDjango.post('command', { cmd: command })
    return response.data
}

export async function screenSizeService() {
    const response = await apiDjango.get('screenSize')
    return response.data
}

export async function hotkeyService(hotkey: string) {
    const response = await apiDjango.post('hotkey', { hotkey: hotkey })
    return response.data
}

export async function mouseMoveService(x: number, y: number) {
    const response = await apiDjango.post('mouseMove', { x: x, y: y })
    return response.data
}

export async function keyPressService(keys: string) {
    const response = await apiDjango.post('keyPress', { keys: keys })
    return response.data
}

export async function mouseButtonService(button: string) {
    const response = await apiDjango.post('mouseButton', { button: button })
    return response.data
}

export async function mouseScrollService(value: number) {
    const response = await apiDjango.post('scroll', { value: value })
    return response.data
}

export async function mouseMoveButtonService(x: number, y: number, button: string) {
    const response = await apiDjango.post('mouseMoveButton', {
        x: x,
        y: y,
        button: button,
    })
    return response.data
}
