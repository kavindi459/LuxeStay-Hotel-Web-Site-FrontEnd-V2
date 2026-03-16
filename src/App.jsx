import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import ScrollToTop from './Components/scroll_To_Top.jsx';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './store/authStore.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ClientLayout from './layouts/ClientLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';

// Client Pages
import Home from './pages/client/HomePage.jsx';
import About from './pages/client/AboutPage.jsx';
import RoomsPage from './pages/client/RoomsPage.jsx';
import RoomDetailPage from './pages/client/RoomDetailPage.jsx';
import BookingPage from './pages/client/BookingPage.jsx';
import MyBookingsPage from './pages/client/MyBookingsPage.jsx';
import GalleryPage from './pages/client/GalleryPage.jsx';
import ContactPage from './pages/client/ContactPage.jsx';
import ProfilePage from './pages/client/ProfilePage.jsx';

// Auth Pages
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import OTPVerifyPage from './pages/auth/OTPVerifyPage.jsx';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.jsx';

// Shared
import NotFound from './components/NotFound.jsx';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '10px',
              background: '#1e293b',
              color: '#fff',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#16a34a', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#dc2626', secondary: '#fff' },
            },
          }}
        />

        <Routes>
          {/* Client Layout — Navbar + Footer shared */}
          <Route element={<ClientLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/rooms/:roomId" element={<RoomDetailPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Protected Client Routes */}
            <Route path="/booking/:roomId" element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            } />
            <Route path="/my-bookings" element={
              <ProtectedRoute>
                <MyBookingsPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
          </Route>

          {/* Auth Routes */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/verify-otp" element={<OTPVerifyPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />

          {/* Legacy google login route */}
          <Route path="/auth/googlelogin" element={<LoginPage />} />

          {/* Admin Routes — all protected + Admin role */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/*" element={
            <ProtectedRoute requireAdmin>
              <AdminLayout />
            </ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
