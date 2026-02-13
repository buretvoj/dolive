import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import './Header.css'

export type NavItem = {
    label: string
    href: string
}

const FIXED_NAV: NavItem[] = [
    { label: 'Program', href: '/program' },
    { label: 'Info', href: '/info' },
    { label: 'Aktuality', href: '/aktuality' },
    { label: 'Kontakty', href: '/kontakty' },
    { label: 'Vstupenky', href: '/vstupenky' },
]

export default function Header() {
    const [isOpen, setIsOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <>
            <header className={`header ${isScrolled ? 'scrolled' : ''} ${isOpen ? 'menu-open' : ''}`}>
                <div className="container header-inner">
                    <Link to="/" className="logo">
                        <img src="/img/logo_small.png" alt="dOlive Fest Logo" className="logo-image" />
                        dOlive Fest
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="desktop-nav">
                        {FIXED_NAV.map((item) => (
                            <Link
                                key={item.label}
                                to={item.href}
                                className={`nav-link ${item.href !== '/' && location.pathname.startsWith(item.href) ? 'active' : ''} ${item.label === 'Vstupenky' ? 'nav-link-highlight' : ''}`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Mobile Toggle */}
                    <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
                <div className="header-wave">
                    <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
                        <path d="M0,0 L1440,0 L1440,30 C1200,80 1000,10 720,40 C440,70 200,10 0,50 Z"></path>
                    </svg>
                </div>
            </header>

            {/* Mobile Navigation - Now outside header to avoid clip-path issues */}
            <AnimatePresence>
                {isOpen && (
                    <motion.nav
                        className="mobile-nav"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    >
                        <div className="mobile-nav-content">
                            {FIXED_NAV.map((item) => (
                                <Link
                                    key={item.label}
                                    to={item.href}
                                    className={`mobile-nav-link ${item.label === 'Vstupenky' ? 'vstupenky-link' : ''}`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </>
    )
}
