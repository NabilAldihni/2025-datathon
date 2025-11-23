import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import PrivacyDashboardOverview from './pages/privacy-dashboard-overview';
import PrivacyPreferences from './pages/privacy-preferences';
import PrivacyLeaderboard from './pages/privacy-leaderboard';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<PrivacyDashboardOverview />} />
        <Route path="/privacy-dashboard-overview" element={<PrivacyDashboardOverview />} />
        <Route path="/privacy-preferences" element={<PrivacyPreferences />} />
        <Route path="/privacy-leaderboard" element={<PrivacyLeaderboard />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;