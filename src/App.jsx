import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './store/authStore.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Existing pages
import Home from './Pages/Client Page/home.jsx';
import About from './Pages/Client Page/about.jsx';
import NotFound from './Components/Client Components/NotFound.jsx';
import AdminLayout from './Components/Admin Components/ALayOut.jsx';
import LoginPage from './Pages/Auth/loginPage.jsx';

// New Auth pages
import RegisterPage from './pages/auth/RegisterPage.jsx';
import OTPVerifyPage from './pages/auth/OTPVerifyPage.jsx';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.jsx';

// New Client pages
import RoomsPage from './pages/client/RoomsPage.jsx';
import RoomDetailPage from './pages/client/RoomDetailPage.jsx';
import BookingPage from './pages/client/BookingPage.jsx';
import MyBookingsPage from './pages/client/MyBookingsPage.jsx';
import ProfilePage from './pages/client/ProfilePage.jsx';
import GalleryPage from './pages/client/GalleryPage.jsx';
import ContactPage from './pages/client/ContactPage.jsx';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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
          {/* Public Client Routes */}
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
