import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import BrowseListings from './pages/BrowseListings';
import ListingDetail from './pages/ListingDetail';
import RentalsPage from './pages/RentalsPage';
import RentalDetail from './pages/RentalDetail';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetail from './pages/ProjectDetail';
import SavedFavourites from './pages/SavedFavourites';
import InsightsDashboard from './pages/InsightsDashboard';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="listings" element={<BrowseListings />} />
        <Route path="listings/:id" element={<ListingDetail />} />
        <Route path="rentals" element={<RentalsPage />} />
        <Route path="rentals/:id" element={<RentalDetail />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:id" element={<ProjectDetail />} />
        <Route
          path="favourites"
          element={
            <ProtectedRoute>
              <SavedFavourites />
            </ProtectedRoute>
          }
        />
        <Route
          path="saved"
          element={
            <ProtectedRoute>
              <SavedFavourites />
            </ProtectedRoute>
          }
        />
        <Route path="insights" element={<InsightsDashboard />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
