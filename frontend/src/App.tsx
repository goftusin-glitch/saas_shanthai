import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginSignup } from './pages/Auth/LoginSignup';
import { DashboardLayout } from './components/Layout/DashboardLayout';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Templates } from './pages/Templates/Templates';
import { Docs } from './pages/Docs/Docs';
import { DocsSetup } from './pages/Docs/DocsSetup';
import { DocsBasics } from './pages/Docs/DocsBasics';
import { DocsDevelop } from './pages/Docs/DocsDevelop';
import { DocsDatabase } from './pages/Docs/DocsDatabase';
import { DocsGoogleAuth } from './pages/Docs/DocsGoogleAuth';
import { DocsPayment } from './pages/Docs/DocsPayment';
import { DocsGithub } from './pages/Docs/DocsGithub';
import { DocsDeployment } from './pages/Docs/DocsDeployment';
import { Marketplace } from './pages/Marketplace/Marketplace';
import { Subscription } from './pages/Subscription/Subscription';
import { MyProducts } from './pages/MyProducts/MyProducts';
import { Settings } from './pages/Settings/Settings';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';

function App() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route
                    path="/login"
                    element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginSignup />}
                />
                <Route
                    path="/"
                    element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
                />

                {/* Protected Routes */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="templates" element={<Templates />} />
                    <Route path="docs" element={<Docs />} />
                    <Route path="docs/setup" element={<DocsSetup />} />
                    <Route path="docs/basics" element={<DocsBasics />} />
                    <Route path="docs/develop" element={<DocsDevelop />} />
                    <Route path="docs/database" element={<DocsDatabase />} />
                    <Route path="docs/google-auth" element={<DocsGoogleAuth />} />
                    <Route path="docs/payment" element={<DocsPayment />} />
                    <Route path="docs/github" element={<DocsGithub />} />
                    <Route path="docs/deployment" element={<DocsDeployment />} />
                    <Route path="marketplace" element={<Marketplace />} />
                    <Route path="subscription" element={<Subscription />} />
                    <Route path="my-products" element={<MyProducts />} />
                    <Route path="settings" element={<Settings />} />
                </Route>

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
