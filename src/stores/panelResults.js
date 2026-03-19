import { create } from 'zustand'

import { useAuthStore } from './auth'

export const usePanelResultsStore = create((set, get) => ({
    rows: [],
    isLoading: false,
    error: null,
    activeConfigId: null,

    clearError: () => {
        set({ error: null })
    },

    reset: () => {
        set({
            rows: [],
            isLoading: false,
            error: null,
            activeConfigId: null,
        })
    },

    loadResults: async (configId = null) => {
        try {
            set({
                isLoading: true,
                error: null,
                activeConfigId: configId || null,
            })

            const response = await useAuthStore.getState().fetchWithAuth({
                method: 'get',
                url: configId ? `/chat-configs/${configId}/sessions` : '/chat-sessions',
            })

            set({
                rows: response.data.sessions || [],
                isLoading: false,
                error: null,
            })

            return response.data.sessions || []
        } catch (error) {
            const message = error?.response?.data?.error || 'Failed to load panel results'

            set({
                isLoading: false,
                error: message,
            })

            throw error
        }
    },
}))
