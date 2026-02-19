import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Sell from './pages/Sell'
import Credit from './pages/Credit'
import CarDetail from './pages/CarDetail'
import Catalog from './pages/Catalog'
import Analytics from './pages/Analytics'
import PartnersLanding from './pages/partner/PartnersLanding'
import PartnerDashboard from './pages/partner/PartnerDashboard'
import SellerDashboard from './pages/seller/SellerDashboard'
import Nosotros from './pages/Nosotros'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'
import './index.css'
import './App.css'

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalog />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/login" element={<Login />} />
            <Route path="/vender" element={<Sell />} />
            <Route path="/credito" element={<Credit />} />
            <Route path="/car/:id" element={<CarDetail />} />

            {/* Rutas de Partners */}
            <Route path="/partners" element={<PartnersLanding />} />
            <Route path="/partner/dashboard" element={<PartnerDashboard />} />

            {/* Rutas de Vendedores */}
            <Route path="/vendedor/dashboard" element={<SellerDashboard />} />

            <Route path="/nosotros" element={<Nosotros />} />
          </Routes>
        </main>
        <Footer />
        <Chatbot />
      </div>
    </Router>
  )
}

export default App
