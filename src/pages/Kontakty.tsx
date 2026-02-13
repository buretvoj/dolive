import { useState } from 'react'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import PageHero from '../components/PageHero/PageHero'
import { MapPin, Phone, Mail, FileText, Send } from 'lucide-react'
import './Kontakty.css'

export default function Kontakty() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Form submitted:', formData)
        alert('Děkujeme za vaši zprávu! Brzy se vám ozveme.')
        setFormData({ name: '', email: '', message: '' })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div className="kontakty-page">
            <Header />

            <main className="kontakty-main">
                <PageHero
                    title="Kontakty"
                    accentColor="navy"
                />

                <div className="kontakty-container">
                    <div className="kontakty-grid">

                        {/* Left Column: Text Info */}
                        <div className="kontakty-info">

                            <div className="info-section">
                                <h3 className="company-name">Dolívka Productions, s.r.o.</h3>
                                <div className="info-item">
                                    <MapPin size={22} className="icon" />
                                    <p>
                                        Sídlo: č.p. 154<br />
                                        539 74 Předhradí
                                    </p>
                                </div>
                                <div className="info-item">
                                    <FileText size={22} className="icon" />
                                    <p>IČO: 21541191</p>
                                </div>
                            </div>

                            <div className="info-section">
                                <div className="info-item">
                                    <Phone size={22} className="icon" />
                                    <a href="tel:+420778494346" className="phone-link">778 494 346</a>
                                </div>
                                <div className="info-item">
                                    <Phone size={22} className="icon" />
                                    <a href="tel:+420606075718" className="phone-link">606 075 718</a>
                                </div>
                                <div className="info-item">
                                    <Mail size={22} className="icon" />
                                    <a href="mailto:info@dolive.cz" className="email-link">info@dolive.cz</a>
                                </div>
                            </div>

                        </div>

                        {/* Right Column: Form */}
                        <div className="kontakty-form-wrapper">
                            <form className="kontakty-form" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="name">Jméno</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Vaše jméno"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="vas@email.cz"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message">Zpráva</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        placeholder="Na co se chcete zeptat?"
                                    ></textarea>
                                </div>

                                <button type="submit" className="submit-btn">
                                    Odeslat <Send size={18} />
                                </button>
                            </form>
                        </div>

                    </div>
                </div>

                <div className="kontakty-full-image">
                    <img
                        src="https://static.wixstatic.com/media/b10128_99394bc497504df49c9c2afac3dcb46b~mv2.jpg/v1/fill/w_2048,h_409,al_c,q_85,enc_avif,quality_auto/b10128_99394bc497504df49c9c2afac3dcb46b~mv2.jpg"
                        alt="Dolívka Panorama"
                    />
                </div>
            </main>

            <Footer />
        </div>
    )
}
