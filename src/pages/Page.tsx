import { useState, useEffect } from 'react'
import Spinner from '../components/Spinner/Spinner'
import { useParams } from 'react-router-dom'
import Header from '../components/Header/Header'
import DynamicLoader from '../components/DynamicLoader/DynamicLoader'
import Performers from '../components/Performers/Performers'
import Hero from '../components/Hero/Hero'
import LatestNews from '../components/LatestNews/LatestNews'
import Footer from '../components/Footer/Footer'

export default function Page() {
    const { slug = 'index' } = useParams()
    const [pageData, setPageData] = useState<any>(null)
    const [sharedHeroData, setSharedHeroData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                // Always fetch the current page
                const pagePromise = fetch(`${import.meta.env.VITE_API_URL}/api/pages/${slug}`)

                // If not on index, also fetch index to get the main hero
                const indexPromise = slug !== 'index'
                    ? fetch(`${import.meta.env.VITE_API_URL}/api/pages/index`)
                    : Promise.resolve(null)

                const [pageRes, indexRes] = await Promise.all([pagePromise, indexPromise])

                if (!pageRes.ok) throw new Error('Page not found')
                const pageJson = await pageRes.json()
                setPageData(pageJson)

                if (indexRes && indexRes.ok) {
                    const indexJson = await indexRes.json()
                    const mainHero = indexJson.sections?.find((s: any) => s.type === 'hero')
                    if (mainHero) {
                        setSharedHeroData(mainHero.content)
                    }
                }
            } catch (error) {
                console.error('CMS Error:', error)
                setPageData(null)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [slug])

    // Filter out local hero if we are showing the shared one to avoid duplicates
    const contentSections = slug !== 'index'
        ? pageData?.sections?.filter((s: any) => s.type !== 'hero')
        : pageData?.sections

    return (
        <div className="page-wrapper">
            <Header />
            <main>
                {loading ? (
                    <Spinner />
                ) : pageData ? (
                    <>
                        {/* On subpages, show the Shared Hero from Home */}
                        {slug !== 'index' && sharedHeroData && (
                            <Hero {...sharedHeroData} />
                        )}

                        {/* On index, the hero is inside contentSections (via DynamicLoader) */}
                        <DynamicLoader sections={contentSections} />

                        {slug === 'index' && (
                            <>
                                <Performers />
                                <LatestNews />
                            </>
                        )}
                    </>
                ) : (
                    <div className="container py-20">
                        <h1>404 - Page Not Found</h1>
                        <p>The content you are looking for does not exist or has been moved.</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}
