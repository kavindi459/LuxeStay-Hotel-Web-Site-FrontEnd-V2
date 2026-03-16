import Navbar from '../Components/Client Common/Navbar.jsx';
import Footer from '../Components/Client Common/Footer.jsx';
import ScrollToTopButton from '../components/ui/ScrollToTopButton.jsx';
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
