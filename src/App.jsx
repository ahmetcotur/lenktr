import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const PasswordSetupPage = lazy(() => import("./pages/PasswordSetupPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const VerifyEmailPage = lazy(() => import("./pages/VerifyEmailPage"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const DashboardOverview = lazy(() => import("./pages/DashboardOverview"));
const ShortLinkManager = lazy(() => import("./pages/ShortLinkManager"));
const BioLinkEditor = lazy(() => import("./pages/BioLinkEditor"));
const BioPagesList = lazy(() => import("./pages/BioPagesList"));
const AnalyticsDashboard = lazy(() => import("./pages/AnalyticsDashboard"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const SecurityPage = lazy(() => import("./pages/SecurityPage"));

const UpgradePlan = lazy(() => import("./pages/UpgradePlan"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const RedirectHandler = lazy(() => import("./pages/RedirectHandler"));

import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";
import { HelmetProvider } from "react-helmet-async";

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Suspense
          fallback={
            <div
              role="status"
              className="min-h-[60vh] grid place-items-center text-zinc-400"
            >
              Yükleniyor…
            </div>
          }
        >
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/account/verify" element={<VerifyEmailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/account/password" element={<PasswordSetupPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/upgrade" element={<UpgradePlan />} />

            {/* Content Pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/security" element={<SecurityPage />} />

            {/* Protected Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <DashboardOverview />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/links"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ShortLinkManager />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/bio"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <BioPagesList />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/bio/editor"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <BioLinkEditor />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <AnalyticsDashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <SettingsPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <AppLayout>
                      <AdminPage />
                    </AppLayout>
                  </AdminRoute>
                </ProtectedRoute>
              }
            />

            {/* Dynamic Slugs (Links or Bio Pages) */}
            <Route path="/:slug" element={<RedirectHandler />} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </HelmetProvider>
  );
}

export default App;
