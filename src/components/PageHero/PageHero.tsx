import { ReactNode } from 'react'
import './PageHero.css'

interface PageHeroProps {
    title: string
    subtitle?: string | ReactNode
    accentColor?: 'navy' | 'pink' | 'lime'
    children?: ReactNode
}

export default function PageHero({ title, subtitle, accentColor = 'navy', children }: PageHeroProps) {
    return (
        <section className={`page-hero page-hero--${accentColor}`}>
            <div className="page-hero-bg">
                <div className="page-hero-shape page-hero-shape-1"></div>
                <div className="page-hero-shape page-hero-shape-2"></div>
                <div className="page-hero-shape page-hero-shape-3"></div>
            </div>
            <div className="container">
                <div className="page-hero-content">
                    <h1 className="page-hero-title">
                        <span className="page-hero-title-main">{title}</span>
                    </h1>
                    {subtitle && <div className="page-hero-subtitle">{subtitle}</div>}
                    {children && <div className="page-hero-extra">{children}</div>}
                </div>
            </div>
        </section>
    )
}
