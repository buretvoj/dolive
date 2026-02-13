import { useState, useEffect } from 'react'
import Spinner from '../components/Spinner/Spinner'
import Header from '../components/Header/Header'
import DynamicLoader from '../components/DynamicLoader/DynamicLoader'

export default function Home() {
    const [pageData, setPageData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchPage() {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pages/index`)
                if (!response.ok) throw new Error('Page not found')
                const data = await response.json()
                setPageData(data)
            } catch (error) {
                console.error('CMS Error:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchPage()
    }, [])

    return (
        <div className="home">
            <Header />
            <main>
                {loading ? (
                    <Spinner />
                ) : pageData ? (
                    <DynamicLoader sections={pageData.sections} />
                ) : (
                    <div className="container py-20">Database connection required to load content.</div>
                )}
            </main>

            <footer className="footer">
                <div className="container">
                    <p>&copy; 2026 Festival Website Skeleton. Content driven by CMS.</p>
                </div>
            </footer>
        </div>
    )
}

