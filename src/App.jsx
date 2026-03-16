import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop.jsx';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './store/authStore.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ClientLayout from './layouts/ClientLayout.jsx';

// Existing pages
import Home from './Pages/Client Page/home.jsx';
import About from './Pages/Client Page/about.jsx';
import NotFound from './Components/Client Components/NotFound.jsx';
import AdminLayout from './Components/Admin common/ALayOut.jsx';
import LoginPage from './Pages/Auth/loginPage.jsx';

// New Auth pages
import RegisterPage from './pages/auth/RegisterPage.jsx';
import OTPVerifyPage from './pages/auth/OTPVerifyPage.jsx';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.jsx';

// New Client pages
import RoomsPage from '../src/Pages/Client Page/RoomsPage.jsx';
import RoomDetailPage from '../src/Pages/Client Page/RoomDetailPage.jsx';
import BookingPage from '../src/Pages/Client Page/BookingPage.jsx';
import MyBookingsPage from '../src/Pages/Client Page/MyBookingsPage.jsx';
import ProfilePage from '../src/Pages/Client Page/ProfilePage.jsx';
import GalleryPage from '../src/Pages/Client Page/GalleryPage.jsx';
import ContactPage from '../src/Pages/Client Page/ContactPage.jsx';

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
