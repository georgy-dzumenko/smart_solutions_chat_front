import { create } from 'zustand'
import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})

export const useAuthStore = create((set, get) => ({
    user: null,
    accessToken: null,
    initialized: false,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    setAccessToken: (token) => {
        set({
            initialized: true,
            accessToken: token,
            isAuthenticated: Boolean(token),
        })
    },

    setUser: (user) => {
        set({ user })
    },

    clearError: () => set({ error: null }),

    signIn: async ({ email, password }) => {
        try {
            set({ isLoading: true, error: null })

            const response = await api.post('/auth/sign-in', {
                email,
                password,
            })

            const { user, accessToken } = response.data

            set({
                user,
                accessToken,
                initialized: true,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            })

            return response.data
        } catch (error) {
            const message = error?.response?.data?.error || 'Sign in failed'

            set({
                isLoading: false,
                error: message,
            })

            throw error
        }
    },

    register: async ({ email, password }) => {
        try {
            set({ isLoading: true, error: null })

            const response = await api.post('/auth/register', {
                email,
                password,
            })

            const { user, accessToken } = response.data

            set({
                user,
                accessToken,
                initialized: true,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            })

            return response.data
        } catch (error) {
            const message = error?.response?.data?.error || 'Registration failed'

            set({
                isLoading: false,
                error: message,
            })

            throw error
        }
    },

    refresh: async () => {
        try {
            const response = await api.post('/auth/refresh')

            const { accessToken } = response.data

            set({
                accessToken,
                initialized: true,
                isAuthenticated: true,
            })

            return accessToken
        } catch (error) {
            set({
                user: null,
                accessToken: null,
                initialized: true,
                isAuthenticated: false,
            })

            throw error
        }
    },

    logout: async () => {
        try {
            await api.post('/auth/logout')
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            set({
                user: null,
                accessToken: null,
                initialized: true,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            })
        }
    },

    getMe: async () => {
        try {
            const { accessToken, refresh } = get()

            let token = accessToken

            if (!token) {
                token = await refresh()
            }

            const response = await api.get('/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            set({
                user: response.data.user,
                initialized: true,
                isAuthenticated: true,
            })

            return response.data
        } catch (error) {
            set({
                initialized: true,
                user: null,
                accessToken: null,
                isAuthenticated: false,
            })

            throw error
        }
    },

    fetchWithAuth: async (config, retry = true) => {
        try {
            const { accessToken, refresh, logout } = get()

            let token = accessToken

            if (!token) {
                token = await refresh()
            }

            const response = await api.request({
                ...config,
                headers: {
                    ...(config.headers || {}),
                    Authorization: `Bearer ${token}`,
                },
            })

            return response
        } catch (error) {
            const status = error?.response?.status

            if (status === 401 && retry) {
                try {
                    const newToken = await get().refresh()

                    const response = await api.request({
                        ...config,
                        headers: {
                            ...(config.headers || {}),
                            Authorization: `Bearer ${newToken}`,
                        },
                    })

                    return response
                } catch (refreshError) {
                    await logout()
                    throw refreshError
                }
            }

            throw error
        }
    },
}))
