import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PricingPage from './pages/PricingPage';
import DashboardOverview from './pages/DashboardOverview';
import ShortLinkManager from './pages/ShortLinkManager';
import BioLinkEditor from './pages/BioLinkEditor';
import BioPagesList from './pages/BioPagesList';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import SecurityPage from './pages/SecurityPage';

import UpgradePlan from './pages/UpgradePlan';
import SettingsPage from './pages/SettingsPage';
import RedirectHandler from './pages/RedirectHandler';

import ProtectedRoute from './components/auth/ProtectedRoute';
import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
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
          <Route path="/dashboard" element={<ProtectedRoute><AppLayout><DashboardOverview /></AppLayout></ProtectedRoute>} />
          <Route path="/links" element={<ProtectedRoute><AppLayout><ShortLinkManager /></AppLayout></ProtectedRoute>} />
          <Route path="/bio" element={<ProtectedRoute><AppLayout><BioPagesList /></AppLayout></ProtectedRoute>} />
          <Route path="/bio/editor" element={<ProtectedRoute><AppLayout><BioLinkEditor /></AppLayout></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><AppLayout><AnalyticsDashboard /></AppLayout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><AppLayout><SettingsPage /></AppLayout></ProtectedRoute>} />

          {/* Dynamic Slugs (Links or Bio Pages) */}
          <Route path="/:slug" element={<RedirectHandler />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
