import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, FileText, Shield, Lock } from 'lucide-react'
import './Footer.css'

export default function Footer() {
    return (
        <footer className="footer">
            <div className="section-wave">
                <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
                    <path d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,80C1120,85,1280,75,1360,69.3L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
                </svg>
            </div>
            <div className="container">
                {/* Main Content Grid */}
                <div className="footer-grid">
                    {/* Column 1: Logo */}
                    <div className="footer-section">
                        <div className="footer-logo">
                            <img src="/img/logo_small.png" alt="Dolive Logo" className="footer-logo-image" />
                            <div className="logo-tagline">Hudba • Kultura • Příroda</div>

                            {/* Social Icons */}
                            <div className="footer-social">
                                <a href="#" className="social-icon" aria-label="Facebook">
                                    <Facebook size={20} />
                                </a>
                                <a href="#" className="social-icon" aria-label="Instagram">
                                    <Instagram size={20} />
                                </a>
                                <a href="#" className="social-icon" aria-label="YouTube">
                                    <Youtube size={20} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Contact */}
                    <div className="footer-section">
                        <h3 className="footer-heading">Kontakt</h3>
                        <div className="footer-contact">
                            <p className="footer-text">
                                <MapPin size={16} />
                                <span>Skuteč u Lytomyšle</span>
                            </p>
                            <p className="footer-text">
                                <Phone size={16} />
                                <span>+420 777 123 456</span>
                            </p>
                            <p className="footer-text">
                                <Mail size={16} />
                                <span>info@dolive.cz</span>
                            </p>
                        </div>
                    </div>

                    {/* Column 3: Links */}
                    <div className="footer-section">
                        <h3 className="footer-heading">Odkazy</h3>
                        <div className="footer-links-with-icons">
                            <p className="footer-text">
                                <FileText size={16} />
                                <Link to="/obchodni-podminky" className="footer-link-inline">Obchodní podmínky</Link>
                            </p>
                            <p className="footer-text">
                                <Shield size={16} />
                                <a href="/osobni-udaje" className="footer-link-inline">Použití osobních údajů</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
