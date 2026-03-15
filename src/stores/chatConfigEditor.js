import { create } from 'zustand'
import axios from 'axios'
import { useAuthStore } from './auth'

const API_URL = 'http://localhost:3000/api'

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})

const initialForm = {
    title: '',
    topic: '',
    assistantRole: '',
    goal: '',
    rules: '',
    endConditions: '',
    farewellMessage: '',
    summaryInstructions: '',
    isActive: true,
}

export const useChatConfigEditorStore = create((set, get) => ({
    isOpened: false,
    mode: 'create',
    editingId: null,

    form: initialForm,
    publicUrl: '',

    isLoading: false,
    error: null,

    setMode: (mode) => {
        set({ mode })
    },

    setIsOpened: (isOpened) => {
        set({ isOpened })
    },

    setField: (field, value) => {
        set((state) => ({
            form: {
                ...state.form,
                [field]: value,
            },
        }))
    },

    setForm: (form) => {
        set({ form })
    },

    resetForm: () => {
        set({
            form: initialForm,
            publicUrl: '',
            editingId: null,
            error: null,
            mode: 'create',
        })
    },

    clearError: () => {
        set({ error: null })
    },

    openCreateModal: () => {
        set({
            isOpened: true,
            mode: 'create',
            editingId: null,
            form: initialForm,
            publicUrl: '',
            error: null,
        })
    },

    openEditModal: async (id) => {
        try {
            set({
                isOpened: true,
                mode: 'edit',
                editingId: id,
                isLoading: true,
                error: null,
            })

            const response = await useAuthStore.getState().fetchWithAuth({
                method: 'get',
                url: `/chat-configs/${id}`,
            })

            const config = response.data.config

            set({
                form: {
                    title: config.title ?? '',
                    topic: config.topic ?? '',
                    assistantRole: config.assistant_role ?? '',
                    goal: config.goal ?? '',
                    rules: config.rules ?? '',
                    endConditions: config.end_conditions ?? '',
                    farewellMessage: config.farewell_message ?? '',
                    summaryInstructions: config.summary_instructions ?? '',
                    isActive: typeof config.is_active === 'boolean' ? config.is_active : true,
                },
                publicUrl: config.public_url ?? '',
                isLoading: false,
                error: null,
            })

            return config
        } catch (error) {
            const message = error?.response?.data?.error || 'Failed to load chat config'

            set({
                isLoading: false,
                error: message,
            })

            throw error
        }
    },

    closeModal: () => {
        set({
            isOpened: false,
            mode: 'create',
            editingId: null,
            form: initialForm,
            publicUrl: '',
            isLoading: false,
            error: null,
        })
    },

    createChatConfig: async () => {
        try {
            set({
                isLoading: true,
                error: null,
            })

            const { form } = get()

            const response = await useAuthStore.getState().fetchWithAuth({
                method: 'post',
                url: '/chat-configs',
                data: {
                    title: form.title,
                    topic: form.topic,
                    assistantRole: form.assistantRole,
                    goal: form.goal,
                    rules: form.rules,
                    endConditions: form.endConditions,
                    farewellMessage: form.farewellMessage,
                    summaryInstructions: form.summaryInstructions,
                },
            })

            const { config, publicUrl } = response.data

            set({
                isLoading: false,
                error: null,
                editingId: config.id,
                mode: 'edit',
                publicUrl: publicUrl ?? '',
            })

            return response.data
        } catch (error) {
            const message = error?.response?.data?.error || 'Failed to create chat config'

            set({
                isLoading: false,
                error: message,
            })

            throw error
        }
    },

    updateChatConfig: async () => {
        try {
            const { editingId, form } = get()

            if (!editingId) {
                const error = new Error('No config id provided for update')

                set({
                    error: 'No config id provided for update',
                })

                throw error
            }

            set({
                isLoading: true,
                error: null,
            })

            const response = await useAuthStore.getState().fetchWithAuth({
                method: 'patch',
                url: `/chat-configs/${editingId}`,
                data: {
                    title: form.title,
                    topic: form.topic,
                    assistantRole: form.assistantRole,
                    goal: form.goal,
                    rules: form.rules,
                    endConditions: form.endConditions,
                    farewellMessage: form.farewellMessage,
                    summaryInstructions: form.summaryInstructions,
                    isActive: form.isActive,
                },
            })

            const { config } = response.data

            set({
                form: {
                    title: config.title ?? '',
                    topic: config.topic ?? '',
                    assistantRole: config.assistant_role ?? '',
                    goal: config.goal ?? '',
                    rules: config.rules ?? '',
                    endConditions: config.end_conditions ?? '',
                    farewellMessage: config.farewell_message ?? '',
                    summaryInstructions: config.summary_instructions ?? '',
                    isActive: typeof config.is_active === 'boolean' ? config.is_active : true,
                },
                publicUrl: config.public_url ?? '',
                isLoading: false,
                error: null,
            })

            return response.data
        } catch (error) {
            const message = error?.response?.data?.error || 'Failed to update chat config'

            set({
                isLoading: false,
                error: message,
            })

            throw error
        }
    },

    submit: async () => {
        const { mode } = get()

        if (mode === 'edit') {
            return get().updateChatConfig()
        }

        return get().createChatConfig()
    },
}))
