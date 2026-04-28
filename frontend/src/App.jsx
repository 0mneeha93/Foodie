import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/Login'
import Home from './pages/Home'
import Recipe from './pages/Recipe'
import Saved from './pages/Saved'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes — must be logged in */}
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />

          <Route path="/recipe" element={
            <ProtectedRoute>
              <Recipe />
            </ProtectedRoute>
          } />

          <Route path="/saved" element={
            <ProtectedRoute>
              <Saved />
            </ProtectedRoute>
          } />

          {/* Catch all — 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App