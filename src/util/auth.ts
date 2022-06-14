import { Buffer } from 'buffer'

export function createBasicAuth(username, password){
    return Buffer.from(`${username}:${password}`).toString('base64')
}