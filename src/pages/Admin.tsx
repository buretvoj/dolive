import { useState, useEffect, useRef } from 'react'
import Spinner from '../components/Spinner/Spinner'
import { RichTextEditor } from '../components/RichTextEditor/RichTextEditor'
import './Admin.css'

interface Section {
    id: string
    type: string
    content: any
    order: number
}

interface Page {
    id: string
    title: string
    slug: string
    sections: Section[]
}

const FIXED_SLUGS = ['index', 'tickets', 'info']

const readFile = (file: File): Promise<string> => {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
    })
}

export default function Admin() {
    const [pages, setPages] = useState<Page[]>([])
    const [activePage, setActivePage] = useState<Page | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [dragActive, setDragActive] = useState<string | null>(null)
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const getToken = () => localStorage.getItem('token')

    const fetchPages = () => {
        fetch(`${import.meta.env.VITE_API_URL}/api/pages`)
            .then(res => res.json())
            .then(data => {
                const filtered = data.filter((p: any) => FIXED_SLUGS.includes(p.slug))
                    .sort((a: any, b: any) => FIXED_SLUGS.indexOf(a.slug) - FIXED_SLUGS.indexOf(b.slug))
                setPages(filtered)
                setLoading(false)

                // Auto-select page based on URL parameter or default to 'index'
                const params = new URLSearchParams(window.location.search)
                const pageSlug = params.get('page') || 'index'
                const selected = filtered.find((p: any) => p.slug === pageSlug)
                if (selected) {
                    handleSelectPage(selected.slug)
                }
            })
    }

    useEffect(() => {
        const token = getToken()
        if (!token) {
            window.location.href = '/login'
            return
        }
        fetchPages()
    }, [])

    const handleSelectPage = (slug: string) => {
        if (slug === 'tickets') {
            window.location.href = '/admin/tickets'
            return
        }
        if (slug === 'info') {
            window.location.href = '/admin/info'
            return
        }
        setLoading(true)
        fetch(`${import.meta.env.VITE_API_URL}/api/pages/${slug}`)
            .then(res => res.json())
            .then(data => {
                setActivePage(data)
                setLoading(false)
            })
    }

    const handleLocalUpdate = (sectionId: string, content: any) => {
        if (!activePage) return;
        setActivePage({
            ...activePage,
            sections: activePage.sections.map(s => s.id === sectionId ? { ...s, content } : s)
        });
    }

    const saveToServer = async (sectionId: string, content: any) => {
        setSaving(true)
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/sections/${sectionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({ content })
            })
            if (res.status === 401 || res.status === 403) {
                window.location.href = '/login'
                return
            }
        } catch (error) {
            console.error('Update failed:', error)
        } finally {
            setSaving(false)
        }
    }

    const handleSectionChange = (sectionId: string, content: any) => {
        // 1. Local update immediately to preserve cursor/focus
        handleLocalUpdate(sectionId, content);

        // 2. Debounce server save
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

        saveTimeoutRef.current = setTimeout(() => {
            saveToServer(sectionId, content);
        }, 1000);
    }

    const handleFileUpload = async (sectionId: string, files: FileList) => {
        const section = activePage?.sections.find(s => s.id === sectionId)
        if (!section) return

        setSaving(true)
        const newImages = [...(section.content.images || [])]

        for (let i = 0; i < files.length; i++) {
            const base64 = await readFile(files[i])
            newImages.push(base64)
        }

        const updatedContent = { ...section.content, images: newImages }
        await handleSectionChange(sectionId, updatedContent)
    }

    const handleDrag = (e: React.DragEvent, id: string | null) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(id)
    }

    const handleDrop = (e: React.DragEvent, sectionId: string) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(null)
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileUpload(sectionId, e.dataTransfer.files)
        }
    }

    const handleCreateSection = async (type: string) => {
        if (!activePage) return
        setSaving(true)

        let defaultContent = { title: 'New Section', text: '' }
        if (type === 'hero') {
            defaultContent = { title: 'Festival 2026', description: '', ctaPrimary: '', ctaSecondary: '' } as any
        } else if (type === 'blog-post') {
            defaultContent = { title: 'New Post', date: new Date().toLocaleDateString(), text: '' } as any
        } else if (type === 'gallery') {
            defaultContent = { title: 'Gallery Title', images: [] } as any
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/pages/${activePage.id}/sections`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({
                    type,
                    order: activePage.sections.length + 1,
                    content: defaultContent
                })
            })
            if (res.status === 401 || res.status === 403) {
                window.location.href = '/login'
                return
            }
            if (res.ok) {
                handleSelectPage(activePage.slug)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteSection = async (id: string) => {
        if (!confirm('Are you sure?')) return
        setSaving(true)
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/sections/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            })
            if (res.status === 401 || res.status === 403) {
                window.location.href = '/login'
                return
            }
            if (activePage) {
                setActivePage({
                    ...activePage,
                    sections: activePage.sections.filter(s => s.id !== id)
                })
            }
        } catch (e) {
            console.error(e)
        } finally {
            setSaving(false)
        }
    }

    if (loading && pages.length === 0) return <div className="admin-container"><Spinner /></div>

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1>DOLIVE CMS</h1>
                <nav className="admin-nav">
                    {pages.map(p => (
                        <button
                            key={p.id}
                            className={`nav-item ${activePage?.id === p.id ? 'active' : ''}`}
                            onClick={() => handleSelectPage(p.slug)}
                        >
                            {p.slug === 'index' ? 'Domů' : (p.slug === 'info' ? 'Info' : p.title)}
                        </button>
                    ))}
                    <button
                        className="nav-item"
                        onClick={() => window.location.href = '/admin/performers'}
                    >
                        Performers
                    </button>
                    <button
                        className="nav-item"
                        onClick={() => {
                            localStorage.removeItem('token')
                            window.location.href = '/login'
                        }}
                        style={{ color: 'red' }}
                    >
                        Logout
                    </button>
                </nav>
                <a href="/" className="back-link">← Back to Site</a>
            </header>

            <main className="admin-editor admin-editor-full">
                {activePage ? (
                    <>
                        <div className="editor-header">
                            <h2>{activePage.title}</h2>
                            {activePage.slug !== 'index' && (
                                <div className="editor-actions">
                                    <button onClick={() => handleCreateSection('content')} className="btn-small">+ Text</button>
                                    {activePage.slug === 'gallery' && <button onClick={() => handleCreateSection('gallery')} className="btn-small">+ Gallery</button>}
                                </div>
                            )}
                        </div>

                        <div className="sections-list">
                            {activePage.sections.map((section) => (
                                <div key={section.id} className={`section-editor ${dragActive === section.id ? 'drag-active' : ''}`}>
                                    {activePage.slug !== 'index' && (
                                        <div className="section-meta">
                                            <span className="section-type">{section.type}</span>
                                            <button onClick={() => handleDeleteSection(section.id)} className="btn-delete">Delete</button>
                                        </div>
                                    )}

                                    <div className="section-fields">
                                        {section.type === 'hero' ? (
                                            // Custom field order for hero sections
                                            <>
                                                {/* Title */}
                                                {section.content.title !== undefined && (
                                                    <div className="field-group">
                                                        <label>title</label>
                                                        <input
                                                            type="text"
                                                            value={section.content.title}
                                                            onChange={(e) => {
                                                                const newContent = { ...section.content, title: e.target.value }
                                                                handleSectionChange(section.id, newContent)
                                                            }}
                                                        />
                                                    </div>
                                                )}

                                                {/* Description */}
                                                {section.content.description !== undefined && (
                                                    <div className="field-group">
                                                        <label>description</label>
                                                        <input
                                                            type="text"
                                                            value={section.content.description}
                                                            onChange={(e) => {
                                                                const newContent = { ...section.content, description: e.target.value }
                                                                handleSectionChange(section.id, newContent)
                                                            }}
                                                        />
                                                    </div>
                                                )}

                                                {/* CTA Primary */}
                                                {section.content.ctaPrimary !== undefined && (
                                                    <div className="field-group">
                                                        <label>ctaPrimary</label>
                                                        <input
                                                            type="text"
                                                            value={section.content.ctaPrimary}
                                                            onChange={(e) => {
                                                                const newContent = { ...section.content, ctaPrimary: e.target.value }
                                                                handleSectionChange(section.id, newContent)
                                                            }}
                                                        />
                                                    </div>
                                                )}

                                                {/* CTA Secondary */}
                                                {section.content.ctaSecondary !== undefined && (
                                                    <div className="field-group">
                                                        <label>ctaSecondary</label>
                                                        <input
                                                            type="text"
                                                            value={section.content.ctaSecondary}
                                                            onChange={(e) => {
                                                                const newContent = { ...section.content, ctaSecondary: e.target.value }
                                                                handleSectionChange(section.id, newContent)
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            // Default rendering for other section types (content)
                                            section.type === 'content' ? (
                                                <>
                                                    {/* TITLE field first */}
                                                    {section.content.title !== undefined && (
                                                        <div className="field-group">
                                                            <label>title</label>
                                                            <input
                                                                type="text"
                                                                value={section.content.title}
                                                                onChange={(e) => {
                                                                    const newContent = { ...section.content, title: e.target.value }
                                                                    handleSectionChange(section.id, newContent)
                                                                }}
                                                            />
                                                        </div>
                                                    )}

                                                    {/* TEXT field second with rich text editor */}
                                                    {section.content.text !== undefined && (
                                                        <div className="field-group">
                                                            <label>text</label>
                                                            <RichTextEditor
                                                                value={section.content.text}
                                                                onChange={(value) => {
                                                                    const newContent = { ...section.content, text: value }
                                                                    handleSectionChange(section.id, newContent)
                                                                }}
                                                                placeholder="Enter content text here..."
                                                            />
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                // Other section types (blog-post, etc.)
                                                Object.keys(section.content).map(key => {
                                                    if (key === 'images' && section.type === 'gallery') return null
                                                    return (
                                                        <div key={key} className="field-group">
                                                            <label>{key}</label>
                                                            {typeof section.content[key] === 'string' && section.content[key].length > 50 ? (
                                                                <textarea
                                                                    value={section.content[key]}
                                                                    onChange={(e) => {
                                                                        const newContent = { ...section.content, [key]: e.target.value }
                                                                        handleSectionChange(section.id, newContent)
                                                                    }}
                                                                />
                                                            ) : (
                                                                <input
                                                                    type="text"
                                                                    value={section.content[key]}
                                                                    onChange={(e) => {
                                                                        const newContent = { ...section.content, [key]: e.target.value }
                                                                        handleSectionChange(section.id, newContent)
                                                                    }}
                                                                />
                                                            )}
                                                        </div>
                                                    )
                                                })
                                            )
                                        )}

                                        {section.type === 'hero' && (
                                            <div className="field-group">
                                                <label>Background Image</label>
                                                <div className="image-upload-container">
                                                    {section.content.backgroundImage ? (
                                                        <div className="photo-preview-container">
                                                            <img src={section.content.backgroundImage} alt="Hero Background" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '4px' }} />
                                                            <button
                                                                type="button"
                                                                className="btn-remove-photo"
                                                                onClick={() => {
                                                                    if (confirm('Are you sure you want to remove this background image?')) {
                                                                        const newContent = { ...section.content };
                                                                        delete newContent.backgroundImage;
                                                                        handleSectionChange(section.id, newContent);
                                                                    }
                                                                }}
                                                                title="Remove background image"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={async (e) => {
                                                                if (e.target.files && e.target.files[0]) {
                                                                    const base64 = await readFile(e.target.files[0]);
                                                                    const newContent = { ...section.content, backgroundImage: base64 };
                                                                    handleSectionChange(section.id, newContent);
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {section.type === 'gallery' && (
                                            <div
                                                className={`dropzone ${dragActive === section.id ? 'active' : ''}`}
                                                onDragOver={(e) => handleDrag(e, section.id)}
                                                onDragLeave={(e) => handleDrag(e, null)}
                                                onDrop={(e) => handleDrop(e, section.id)}
                                            >
                                                <p>Drag and drop photos here to add to gallery</p>
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={(e) => e.target.files && handleFileUpload(section.id, e.target.files)}
                                                    id={`file-${section.id}`}
                                                    className="file-input"
                                                />
                                                <label htmlFor={`file-${section.id}`} className="btn-small">Or select files</label>

                                                <div className="admin-gallery-preview">
                                                    {section.content.images?.map((img: string, idx: number) => (
                                                        <div key={idx} className="preview-thumb">
                                                            <img src={img} alt="Preview" />
                                                            <button
                                                                className="btn-remove-img"
                                                                onClick={() => {
                                                                    const nextImages = section.content.images.filter((_: any, i: number) => i !== idx)
                                                                    handleSectionChange(section.id, { ...section.content, images: nextImages })
                                                                }}
                                                            >×</button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="no-page-selected">Select a page to start editing content.</div>
                )}
            </main>

            {saving && <div className="saving-indicator">Saving...</div>}
        </div>
    )
}


