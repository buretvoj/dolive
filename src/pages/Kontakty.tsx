import { useState, useEffect } from 'react'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import PageHero from '../components/PageHero/PageHero'
import { MapPin, Phone, Mail, FileText, Send, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import './Kontakty.css'

export default function Kontakty() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [countdown, setCountdown] = useState(5)

    useEffect(() => {
        let timer: NodeJS.Timeout
        if (success) {
            setCountdown(5)
            timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer)
                        setSuccess(false)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }
        return () => clearInterval(timer)
    }, [success])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        try {
            const response = await fetch('https://n8n.voysys.cz/webhook/64e3318d-d814-411c-9a3e-cd0940051ac4', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa('dolive:EcSEOFbQ3w2to038rTVL')
                },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                setSuccess(true)
                setFormData({ name: '', email: '', message: '' })
            } else {
                throw new Error('Failed to submit form')
            }
        } catch (err) {
            console.error(err)
            setError('Něco se pokazilo. Zkuste to prosím později nebo nám zavolejte.')
        } finally {
            setIsSubmitting(false)
        }
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
                                    <p>
                                        778 494 346<br />
                                        606 075 718
                                    </p>
                                </div>
                                <div className="info-item">
                                    <Mail size={22} className="icon" />
                                    <a href="mailto:info@dolive.cz" className="email-link">info@dolive.cz</a>
                                </div>
                            </div>

                        </div>

                        {/* Right Column: Form */}
                        <div className="kontakty-form-wrapper" style={{ minHeight: '580px', display: 'flex', flexDirection: 'column' }}>
                            {success ? (
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%',
                                    textAlign: 'center',
                                    gap: '1.5rem',
                                    animation: 'fadeIn 0.5s ease',
                                    flex: 1
                                }}>
                                    <CheckCircle size={80} color="#333" strokeWidth={2.5} />
                                    <h3 style={{
                                        fontFamily: 'var(--font-heading)',
                                        fontSize: '2.5rem',
                                        color: 'var(--fg)',
                                        margin: 0
                                    }}>Odesláno!</h3>
                                    <p style={{
                                        fontFamily: 'var(--font-sans)',
                                        fontSize: '1.2rem',
                                        color: '#666',
                                        maxWidth: '300px',
                                        lineHeight: 1.6
                                    }}>
                                        Děkujeme za vaši zprávu.<br />Brzy se vám ozveme.
                                    </p>
                                    <div style={{
                                        marginTop: '1rem',
                                        fontSize: '0.9rem',
                                        color: '#999',
                                        fontWeight: 600
                                    }}>
                                        Formulář se obnoví za {countdown}s
                                    </div>
                                </div>
                            ) : (
                                <form className="kontakty-form" onSubmit={handleSubmit}>
                                    <div className="form-heading">
                                        <h1 className="page-hero-title-main">Kontakt</h1>
                                    </div>
                                    {error && (
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            color: '#d32f2f',
                                            background: '#ffebee',
                                            padding: '1rem',
                                            borderRadius: '8px',
                                            fontSize: '0.9rem',
                                            fontWeight: 600
                                        }}>
                                            <AlertCircle size={20} />
                                            {error}
                                        </div>
                                    )}

                                    <div className="form-group">
                                        <label htmlFor="name">Jméno</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Vaše jméno"
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email">
                                            Email <span style={{ color: '#ff006e', marginLeft: '4px' }}>*</span>
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                                            title="Zadejte prosím platný email (např. jmeno@domena.cz)"
                                            placeholder="vas@email.cz"
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="message">
                                            Zpráva <span style={{ color: '#ff006e', marginLeft: '4px' }}>*</span>
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows={5}
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            placeholder="Na co se chcete zeptat?"
                                            disabled={isSubmitting}
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        className="submit-btn"
                                        disabled={isSubmitting}
                                        style={{ opacity: isSubmitting ? 0.7 : 1 }}
                                    >
                                        {isSubmitting ? (
                                            <>Odesílání... <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /></>
                                        ) : (
                                            <>Odeslat <Send size={18} /></>
                                        )}
                                    </button>
                                </form>
                            )}
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
            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    )
}
