import Navbar from '../Components/client/Navbar.jsx';
import Footer from '../Components/client/Footer.jsx';
import ScrollToTopButton from '../Components/ui/ScrollToTopButton.jsx';
import { Outlet } from 'react-router-dom';

const ClientLayout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
    <ScrollToTopButton />
  </>
);

export default ClientLayout;
