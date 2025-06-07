import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/client page/home'
import Aboute from './pages/client page/about'
import NotFound from './Components/Client Components/NotFound';
import Dashboard from './Components/Admin Components/ALayOut'
function App() {
  return (
    <BrowserRouter>
     <Routes>
    {/* Admin Route  */}
    <Route path="/admin/*" element={<Dashboard/>} />  


    {/* client Route */}
     <Route path="/" element={<Home />} />
     <Route path="/about" element={<Aboute />} />


     <Route path="/*" element={<NotFound />} />

     </Routes>
    
    </BrowserRouter>
  );
}

export default App;
