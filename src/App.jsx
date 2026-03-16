import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import ScrollToTop from './Components/ScrollToTop.jsx';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './store/authStore.jsx';
import ProtectedRoute from './Components/ProtectedRoute.jsx';
import ClientLayout from './layouts/ClientLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';

// Client Pages
import Home from './Pages/client/HomePage.jsx';
import About from './Pages/client/AboutPage.jsx';
import RoomsPage from './Pages/client/RoomsPage.jsx';
import RoomDetailPage from './Pages/client/RoomDetailPage.jsx';
import BookingPage from './Pages/client/BookingPage.jsx';
import MyBookingsPage from './Pages/client/MyBookingsPage.jsx';
import GalleryPage from './Pages/client/GalleryPage.jsx';
import ContactPage from './Pages/client/ContactPage.jsx';
import ProfilePage from './Pages/client/ProfilePage.jsx';

// Auth Pages
import LoginPage from './Pages/auth/LoginPage.jsx';
import RegisterPage from './Pages/auth/RegisterPage.jsx';
import OTPVerifyPage from './Pages/auth/OTPVerifyPage.jsx';
import ForgotPasswordPage from './Pages/auth/ForgotPasswordPage.jsx';

// Shared
import NotFound from './Components/NotFound.jsx';

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
