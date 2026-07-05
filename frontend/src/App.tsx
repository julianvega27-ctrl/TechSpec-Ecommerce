import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';

// Layouts
import MainLayout from './components/MainLayout';
import AdminLayout from './pages/Admin/AdminLayout';

// Pages
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import PasswordRecovery from './pages/PasswordRecovery';
import Dashboard from './pages/Admin/Dashboard';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminCategories from './pages/Admin/AdminCategories';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminOrders from './pages/Admin/AdminOrders';
import Settings from './pages/Admin/Settings';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes with MainLayout */}
            <Route path="/" element={<MainLayout><Home /></MainLayout>} />
            <Route path="/catalog" element={<MainLayout><Catalog /></MainLayout>} />
            <Route path="/product/:id" element={<MainLayout><ProductDetail /></MainLayout>} />
            <Route path="/cart" element={<MainLayout><Cart /></MainLayout>} />
            <Route path="/checkout" element={<MainLayout><Checkout /></MainLayout>} />
            <Route path="/orders" element={<MainLayout><OrderHistory /></MainLayout>} />

            {/* Auth Routes */}
            <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
            <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
            <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
            <Route path="/forgot-password" element={<MainLayout><PasswordRecovery /></MainLayout>} />

            {/* Admin Routes with AdminLayout */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="settings" element={<Settings />} />
              <Route index element={<Dashboard />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;