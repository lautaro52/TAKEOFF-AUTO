import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
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
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import PartnersLanding from './pages/partner/PartnersLanding'
import PartnerDashboard from './pages/partner/PartnerDashboard'
import SellerDashboard from './pages/seller/SellerDashboard'
import CRMLayout from './pages/crm/CRMLayout'
import Dashboard from './pages/crm/Dashboard'
import CustomerList from './pages/crm/CustomerList'
import CustomerDetail from './pages/crm/CustomerDetail'
import OpportunityPipeline from './pages/crm/OpportunityPipeline'
import CRMAnalytics from './pages/crm/CRMAnalytics'
import ActivityTimeline from './pages/crm/ActivityTimeline'
import TasksBoard from './pages/crm/TasksBoard'
import Nosotros from './pages/Nosotros'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'
import './index.css'
import './App.css'

function App() {
  return (
    <AuthProvider>
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

              {/* Rutas de Nosotros */}
              <Route path="/nosotros" element={<Nosotros />} />

              {/* Rutas de CRM - Protegidas */}
              <Route path="/crm" element={
                <ProtectedRoute>
                  <CRMLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/crm/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="customers" element={<CustomerList />} />
                <Route path="customers/:id" element={<CustomerDetail />} />
                <Route path="opportunities" element={<OpportunityPipeline />} />
                <Route path="activities" element={<ActivityTimeline />} />
                <Route path="tasks" element={<TasksBoard />} />
                <Route path="analytics" element={<CRMAnalytics />} />
              </Route>
            </Routes>
          </main>
          <Footer />
          <Chatbot />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
