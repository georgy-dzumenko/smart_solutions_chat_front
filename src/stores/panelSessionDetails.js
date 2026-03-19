import { create } from 'zustand'

import { useAuthStore } from './auth'

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

export const usePanelSessionDetailsStore = create((set, get) => ({
    report: null,
    isLoading: false,
    error: null,

    messageOrder: [],
    messagesById: {},

    reset: () => {
        set({
            report: null,
            isLoading: false,
            error: null,
            messageOrder: [],
            messagesById: {},
        })
    },

    clearError: () => {
        set({ error: null })
    },

    getMessages: () => {
        const { messageOrder, messagesById } = get()

        return messageOrder.map((id) => messagesById[id]).filter(Boolean)
    },

    loadSessionDetails: async (sessionId) => {
        try {
            set({
                isLoading: true,
                error: null,
            })

            const [reportResponse, messagesResponse] = await Promise.all([
                useAuthStore.getState().fetchWithAuth({
                    method: 'get',
                    url: `/chat-sessions/${sessionId}/report`,
                }),
                useAuthStore.getState().fetchWithAuth({
                    method: 'get',
                    url: `/chat-sessions/${sessionId}/messages`,
                }),
            ])

            const normalized = normalizeMessages(messagesResponse.data.messages || [])

            set({
                report: reportResponse.data.report,
                messageOrder: normalized.messageOrder,
                messagesById: normalized.messagesById,
                isLoading: false,
                error: null,
            })

            return {
                report: reportResponse.data.report,
                messages: messagesResponse.data.messages || [],
            }
        } catch (error) {
            const message = error?.response?.data?.error || 'Failed to load session details'

            set({
                isLoading: false,
                error: message,
            })

            throw error
        }
    },
}))
