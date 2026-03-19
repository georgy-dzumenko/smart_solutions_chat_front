import { create } from 'zustand'
import axios from 'axios'
import { io } from 'socket.io-client'

const API_URL = 'http://localhost:3000/api'
const SOCKET_URL = 'http://localhost:3000'

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})

const getStorageKey = (configId) => `chat_session_${configId}`

const normalizeMessages = (messages = []) => {
    const messageOrder = []
    const messagesById = {}

    for (const message of messages) {
        if (!message?.id) continue

        messageOrder.push(message.id)
        messagesById[message.id] = message
    }

    return {
        messageOrder,
        messagesById,
    }
}

export const usePublicChatStore = create((set, get) => ({
    config: null,
    sessionId: null,
    status: 'idle', // idle | loading | active | completed | error
    isInitialized: false,
    isAssistantThinking: false,
    error: null,

    messageOrder: [],
    messagesById: {},

    socket: null,

    clearError: () => set({ error: null }),

    getMessages: () => {
        const { messageOrder, messagesById } = get()
        return messageOrder.map((id) => messagesById[id]).filter(Boolean)
    },

    setMessages: (messages) => {
        const normalized = normalizeMessages(messages)

        set({
            messageOrder: normalized.messageOrder,
            messagesById: normalized.messagesById,
        })
    },

    upsertMessage: (message) => {
        if (!message?.id) return

        set((state) => {
            const exists = Boolean(state.messagesById[message.id])

            return {
                messageOrder: exists ? state.messageOrder : [...state.messageOrder, message.id],
                messagesById: {
                    ...state.messagesById,
                    [message.id]: message,
                },
            }
        })
    },

    loadConfig: async (configId) => {
        const response = await api.get(`/public/chat-configs/${configId}`)

        set({
            config: response.data.config,
        })

        return response.data.config
    },

    restoreOrCreateSession: async (configId) => {
        const storedSessionId = localStorage.getItem(getStorageKey(configId))

        const response = await api.post(`/public/chat-configs/${configId}/session`, {
            sessionId: storedSessionId || null,
        })

        const { session, messages } = response.data

        localStorage.setItem(getStorageKey(configId), session.id)

        const normalized = normalizeMessages(messages || [])

        set({
            sessionId: session.id,
            status: session.status === 'completed' ? 'completed' : 'active',
            messageOrder: normalized.messageOrder,
            messagesById: normalized.messagesById,
        })

        return response.data
    },

    connectSocket: (configId) => {
        const existingSocket = get().socket

        if (existingSocket) {
            return existingSocket
        }

        const socket = io(SOCKET_URL, {
            transports: ['websocket'],
            withCredentials: true,
        })

        socket.on('connect', () => {
            const { sessionId } = get()

            if (sessionId) {
                socket.emit('chat:join', { sessionId })
            }
        })

        socket.on('chat:joined', ({ sessionId }) => {
            set({
                sessionId,
            })
        })

        socket.on('chat:message', ({ message }) => {
            get().upsertMessage(message)
        })

        socket.on('chat:assistant_thinking', ({ value }) => {
            set({
                isAssistantThinking: Boolean(value),
            })
        })

        socket.on('chat:completed', () => {
            set({
                status: 'completed',
                isAssistantThinking: false,
            })
        })

        socket.on('chat:error', ({ message }) => {
            set({
                error: message || 'Chat error',
                isAssistantThinking: false,
                status: get().status === 'idle' ? 'error' : get().status,
            })
        })

        socket.on('disconnect', () => {
            set({
                socket: null,
            })
        })

        set({ socket })

        return socket
    },

    initializeChat: async (configId) => {
        try {
            set({
                status: 'loading',
                error: null,
                isInitialized: false,
            })

            await get().loadConfig(configId)
            await get().restoreOrCreateSession(configId)
            get().connectSocket(configId)

            set({
                isInitialized: true,
            })
        } catch (error) {
            console.error(error)

            set({
                error: error?.response?.data?.error || 'Failed to initialize chat',
                status: 'error',
                isInitialized: true,
            })
        }
    },

    sendMessage: async (text) => {
        const { socket, sessionId, status, isAssistantThinking } = get()

        if (!socket || !sessionId) return
        if (!text?.trim()) return
        if (status === 'completed') return
        if (isAssistantThinking) return

        socket.emit('chat:message', {
            sessionId,
            text: text.trim(),
        })
    },

    destroyChat: () => {
        const socket = get().socket

        if (socket) {
            socket.removeAllListeners()
            socket.disconnect()
        }

        set({
            config: null,
            sessionId: null,
            status: 'idle',
            isInitialized: false,
            isAssistantThinking: false,
            error: null,
            messageOrder: [],
            messagesById: {},
            socket: null,
        })
    },
}))
