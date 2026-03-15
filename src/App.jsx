import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'

import AuthPage from '@pages/auth'
import CreateRoomPage from '@pages/createRoom'
import RoomPage from '@pages/room'
import { LocalizationProvider } from './components/general/localizationProvider'
import { useAuthStore } from '@stores/auth'
import { useEffect } from 'react'

function GuestRoute({ children }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

    if (isAuthenticated) {
        return <Navigate to="/create-room" replace />
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
                        path="/create-room"
                        element={
                            <ProtectedRoute>
                                <CreateRoomPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/room/:schemeId/:userId"
                        element={
                            <ProtectedRoute>
                                <RoomPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* fallback */}
                    <Route path="*" element={<Navigate to="/auth" replace />} />
                </Routes>
            </BrowserRouter>
        </LocalizationProvider>
    )
}

export default App
