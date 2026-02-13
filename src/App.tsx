import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Page from './pages/Page'
import Admin from './pages/Admin'
import AdminPerformers from './pages/AdminPerformers'
import Program from './pages/Program'
import Info from './pages/Info'
import InfoDetail from './pages/InfoDetail'
import Aktuality from './pages/Aktuality'
import AktualityDetail from './pages/AktualityDetail'
import BusinessTerms from './pages/BusinessTerms'
import Kontakty from './pages/Kontakty'
import Vstupenky from './pages/Vstupenky'

export default function App() {
    return (
        <Router>
            <ScrollToTop />
            <Routes>
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/performers" element={<AdminPerformers />} />
                <Route path="/program" element={<Program />} />
                <Route path="/info" element={<Info />} />
                <Route path="/info/:section" element={<InfoDetail />} />
                <Route path="/aktuality" element={<Aktuality />} />
                <Route path="/aktuality/:id" element={<AktualityDetail />} />
                <Route path="/obchodni-podminky" element={<BusinessTerms />} />
                <Route path="/kontakty" element={<Kontakty />} />
                <Route path="/vstupenky" element={<Vstupenky />} />
                <Route path="/:slug" element={<Page />} />
                <Route path="/" element={<Page />} />
            </Routes>
        </Router>
    )
}
