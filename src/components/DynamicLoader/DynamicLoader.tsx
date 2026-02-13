import Hero from '../Hero/Hero'

type SectionType = 'hero' | 'content' | 'gallery' | 'blog-post'

interface SectionData {
    id: string
    type: string
    content: any
}

interface DynamicLoaderProps {
    sections: SectionData[]
}

export default function DynamicLoader({ sections }: DynamicLoaderProps) {
    return (
        <>
            {sections.map((section) => {
                switch (section.type as SectionType) {
                    case 'hero':
                        return <Hero key={section.id} {...section.content} />
                    case 'content':
                        return (
                            <section key={section.id} className="main-content py-20">
                                <div className="container">
                                    <h2 className="section-title">{section.content.title}</h2>
                                    <p className="section-text">{section.content.text}</p>
                                </div>
                            </section>
                        )
                    case 'gallery':
                        return (
                            <section key={section.id} className="gallery-section py-20 bg-muted">
                                <div className="container">
                                    <h2 className="section-title mb-10">{section.content.title}</h2>
                                    <div className="gallery-grid">
                                        {section.content.images?.map((img: string, idx: number) => (
                                            <div key={idx} className="gallery-item">
                                                <img src={img} alt={`Gallery ${idx}`} />
                                            </div>
                                        ))}
                                        {!section.content.images && (
                                            <div className="placeholder-grid">
                                                {[1, 2, 3, 4, 5, 6].map(i => (
                                                    <div key={i} className="visual-placeholder aspect-video"></div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>
                        )
                    case 'blog-post':
                        return (
                            <article key={section.id} className="blog-post-section py-10 border-bottom">
                                <div className="container">
                                    {section.content.date && <span className="post-date">{section.content.date}</span>}
                                    <h2 className="post-title">{section.content.title}</h2>
                                    <p className="post-excerpt">{section.content.text}</p>
                                </div>
                            </article>
                        )
                    default:
                        return <div key={section.id} className="container py-10 opacity-50">Unknown section: {section.type}</div>
                }
            })}
        </>
    )
}
