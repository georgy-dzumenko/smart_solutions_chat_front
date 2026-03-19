import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'

import AuthPage from '@pages/auth'
import CreateRoomPage from '@pages/panel'

import { useAuthStore } from '@stores/auth'

import { LocalizationProvider } from './components/general/localizationProvider'

import ChatPage from './pages/chat'

function GuestRoute({ children }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

    if (isAuthenticated) {
        return <Navigate to="/panel" replace />
    }

    return children
}

function ProtectedRoute({ children }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

    if (!isAuthenticated) {
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
                        path="/panel/:config?"
                        element={
                            <ProtectedRoute>
                                <CreateRoomPage />
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
