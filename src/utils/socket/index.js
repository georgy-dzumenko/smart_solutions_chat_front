import { io } from 'socket.io-client'

const apiUrl = 'http://localhost:3000'

const socket = io(apiUrl, {
    transports: ['websocket'],
    pingInterval: 25000,
    pingTimeout: 60000,
    reconnection: true,
    autoConnect: false,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
})

// socket.auth = {
//     token: getSession().accessToken,
//     external_id: getSession()?.externalId,
//     // type: 'PANEL',
//     type: 'ANON',
// }

socket.connect()

const getSocket = () => socket

export default getSocket
