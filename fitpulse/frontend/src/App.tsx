import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Workouts from '@/pages/Workouts';
import Analytics from '@/pages/Analytics';
import Goals from '@/pages/Goals';
import Settings from '@/pages/Settings';
import { useAuthStore } from '@/store/authStore';
import Layout from '@/components/Layout';
import { ThemeProvider } from '@/components/theme-provider';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuthStore();
    return user ? <Layout>{children}</Layout> : <Navigate to="/auth" />;
};

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Router>
                <Routes>
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/workouts" element={<PrivateRoute><Workouts /></PrivateRoute>} />
                    <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
                    <Route path="/goals" element={<PrivateRoute><Goals /></PrivateRoute>} />
                    <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
