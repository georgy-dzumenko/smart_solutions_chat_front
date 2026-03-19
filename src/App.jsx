import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'

import AuthPage from '@pages/auth'
import CreateRoomPage from '@pages/panel'

import { useAuthStore } from '@stores/auth'

import { LocalizationProvider } from './components/general/localizationProvider'

import ChatPage from './pages/chat'
import ConfigSummaryPage from './pages/configSummaryPage'
import SessionSummaryPage from './pages/sessionSummaryPage'

function GuestRoute({ children }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

    if (isAuthenticated) {
        // return <Navigate to="/panel" replace />
    }

    return children
}

function ProtectedRoute({ children }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const initialized = useAuthStore((state) => state.initialized)

    if (initialized && !isAuthenticated) {
        return <Navigate to="/auth" replace />
    }

    return children
}

function App() {
    const refresh = useAuthStore((state) => state.refresh)

    useEffect(() => {
        refresh().catch(() => {})
    }, [refresh])

    return (
        <LocalizationProvider locale="uk">
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/auth"
                        element={
                            <GuestRoute>
                                <AuthPage />
                            </GuestRoute>
                        }
                    />

                    <Route
                        path="/panel"
                        element={
                            <ProtectedRoute>
                                <CreateRoomPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/panel/:configId"
                        element={
                            <ProtectedRoute>
                                <ConfigSummaryPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/panel/:configId/:sessionId"
                        element={
                            <ProtectedRoute>
                                <SessionSummaryPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="/chat/:configId/" element={<ChatPage />} />

                    {/* fallback */}
                    <Route path="*" element={<Navigate to="/auth" replace />} />
                </Routes>
            </BrowserRouter>
        </LocalizationProvider>
    )
}

export default App
