import React, { useState, useEffect, DragEvent } from 'react'
import Spinner from '../components/Spinner/Spinner'
import { Facebook, Instagram, Youtube, Globe, Music2, Eye, X } from 'lucide-react'
import './PerformerDetail.css'
import './Admin.css'

interface Performer {
    id: string
    name: string
    genre: string
    photo: string | null
    description: string | null
    links: { facebook?: string, instagram?: string, soundcloud?: string, website?: string, youtube?: string } | null
    year: number
    videoUrl: string | null
    active: boolean
    order: number
}

const readFile = (file: File): Promise<string> => {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
    })
}

export default function AdminPerformers() {
    const [performers, setPerformers] = useState<Performer[]>([])
    const [pages, setPages] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
    const [selectedYear, setSelectedYear] = useState(2026)
    const [previewPerformer, setPreviewPerformer] = useState<Performer | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        genre: '',
        photo: null as string | null,
        description: '',
        links: { facebook: '', instagram: '', soundcloud: '', website: '', youtube: '' },
        year: 2026,
        videoUrl: '',
        active: true,
        order: 0
    })

    const FIXED_SLUGS = ['index', 'about', 'gallery', 'tickets']

    const getToken = () => localStorage.getItem('token')

    const fetchPerformers = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/performers`)
            const data = await res.json()
            setPerformers(data)
        } catch (error) {
            console.error('Failed to fetch performers:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchPages = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/pages`)
            const data = await res.json()
            const filtered = data.filter((p: any) => FIXED_SLUGS.includes(p.slug))
                .sort((a: any, b: any) => FIXED_SLUGS.indexOf(a.slug) - FIXED_SLUGS.indexOf(b.slug))
            setPages(filtered)
        } catch (error) {
            console.error('Failed to fetch pages:', error)
        }
    }

    useEffect(() => {
        const token = getToken()
        if (!token) {
            window.location.href = '/login'
            return
        }
        fetchPerformers()
        fetchPages()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const url = editingId
                ? `${import.meta.env.VITE_API_URL}/api/performers/${editingId}`
                : `${import.meta.env.VITE_API_URL}/api/performers`

            const method = editingId ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify(formData)
            })

            if (res.status === 401 || res.status === 403) {
                window.location.href = '/login'
                return
            }

            await fetchPerformers()
            cancelForm()
        } catch (error) {
            console.error('Failed to save performer:', error)
        } finally {
            setSaving(false)
        }
    }

    const handleEdit = (performer: Performer) => {
        setEditingId(performer.id)
        setShowForm(true)
        setFormData({
            name: performer.name,
            genre: performer.genre,
            photo: performer.photo,
            description: performer.description || '',
            links: {
                facebook: performer.links?.facebook || '',
                instagram: performer.links?.instagram || '',
                soundcloud: performer.links?.soundcloud || '',
                website: performer.links?.website || '',
                youtube: performer.links?.youtube || ''
            },
            year: performer.year || 2026,
            videoUrl: performer.videoUrl || '',
            active: performer.active,
            order: performer.order
        })
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this performer?')) return

        setSaving(true)
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/performers/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            })
            if (res.status === 401 || res.status === 403) {
                window.location.href = '/login'
                return
            }
            await fetchPerformers()
            cancelForm()
        } catch (error) {
            console.error('Failed to delete performer:', error)
        } finally {
            setSaving(false)
        }
    }

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Check file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('Photo is too large. Maximum size is 2MB.')
            e.target.value = ''
            return
        }

        // Check dimensions
        const img = new Image()
        const objectUrl = URL.createObjectURL(file)

        img.onload = async () => {
            URL.revokeObjectURL(objectUrl)
            if (img.width < 800 || img.height < 500) {
                alert(`Photo is too small. Minimum dimensions are 800x500px. (Selected: ${img.width}x${img.height}px)`)
                e.target.value = ''
                return
            }

            const base64 = await readFile(file)
            setFormData({ ...formData, photo: base64 })
        }

        img.src = objectUrl
    }

    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    const resetForm = () => {
        setEditingId(null)
        setShowForm(true)
        setFormData({
            name: '',
            genre: '',
            photo: null,
            description: '',
            links: { facebook: '', instagram: '', soundcloud: '', website: '', youtube: '' },
            year: 2026,
            videoUrl: '',
            active: true,
            order: 0
        })
    }

    const cancelForm = () => {
        setEditingId(null)
        setShowForm(false)
        setFormData({
            name: '',
            genre: '',
            photo: null,
            description: '',
            links: { facebook: '', instagram: '', soundcloud: '', website: '', youtube: '' },
            year: 2026,
            videoUrl: '',
            active: true,
            order: 0
        })
    }

    const handleDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
        setDraggedIndex(index)
        e.dataTransfer.effectAllowed = 'move'
    }

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
    }

    const handleDrop = async (e: DragEvent<HTMLDivElement>, dropIndex: number) => {
        e.preventDefault()

        if (draggedIndex === null || draggedIndex === dropIndex) {
            setDraggedIndex(null)
            return
        }

        const reorderedPerformers = [...performers]
        const [draggedItem] = reorderedPerformers.splice(draggedIndex, 1)
        reorderedPerformers.splice(dropIndex, 0, draggedItem)

        // Update order values
        const updatedPerformers = reorderedPerformers.map((p, idx) => ({
            ...p,
            order: idx
        }))

        setPerformers(updatedPerformers)
        setDraggedIndex(null)

        // Save new order to backend
        try {
            await Promise.all(
                updatedPerformers.map(p =>
                    fetch(`${import.meta.env.VITE_API_URL}/api/performers/${p.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${getToken()}`
                        },
                        body: JSON.stringify({ ...p, order: p.order })
                    })
                )
            )
        } catch (error) {
            console.error('Failed to update order:', error)
            // Revert on error
            fetchPerformers()
        }
    }

    const handleDragEnd = () => {
        setDraggedIndex(null)
    }

    if (loading) return <div className="admin-container"><Spinner /></div>

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1>DOLIVE CMS</h1>
                <nav className="admin-nav">
                    {pages.map(p => (
                        <button
                            key={p.id}
                            className="nav-item"
                            onClick={() => window.location.href = p.slug === 'index' ? '/admin' : `/admin?page=${p.slug}`}
                        >
                            {p.title}
                        </button>
                    ))}
                    <button className="nav-item active">
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
                {showForm ? (
                    <>
                        <div className="editor-header">
                            <h2>{editingId ? 'Edit Performer' : 'New Performer'}</h2>
                            <button onClick={cancelForm} className="btn-small">
                                ← Back to performers
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="performer-form">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                                <div className="field-group" style={{ marginBottom: 0 }}>
                                    <label>Festival Year *</label>
                                    <select
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                        required
                                        style={{ background: '#fafafa' }}
                                    >
                                        {[2024, 2025, 2026, 2027, 2028].map(y => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="field-group" style={{ marginBottom: 0 }}>
                                    <label>Visibility</label>
                                    <div style={{ padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '4px', background: '#fafafa', display: 'flex', alignItems: 'center', height: '45.1px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: 0, textTransform: 'none', opacity: 1, fontWeight: 500, fontSize: '0.9rem' }}>
                                            <input
                                                type="checkbox"
                                                checked={formData.active}
                                                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                                style={{ width: 'auto' }}
                                            />
                                            <span>Active (show on website)</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="field-group">
                                <label>Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="field-group">
                                <label>Genre/Category *</label>
                                <input
                                    type="text"
                                    value={formData.genre}
                                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                                    placeholder="e.g., PUNK, HARDCORE, SKA/REGGAE"
                                    required
                                />
                            </div>

                            <div className="field-group">
                                <label>Photo</label>
                                {formData.photo ? (
                                    <div className="photo-preview-container">
                                        <img src={formData.photo} alt="Performer" style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '4px' }} />
                                        <button
                                            type="button"
                                            className="btn-remove-photo"
                                            onClick={() => {
                                                if (confirm('Are you sure you want to remove this photo?')) {
                                                    setFormData({ ...formData, photo: null })
                                                }
                                            }}
                                            title="Remove photo"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ) : (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoUpload}
                                    />
                                )}
                            </div>

                            <div className="field-group">
                                <label>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={6}
                                    placeholder="Band bio, description, etc."
                                />
                            </div>

                            <div className="field-group">
                                <label>Social Links</label>
                                <div className="social-links-inputs" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <input
                                        type="text"
                                        placeholder="Facebook URL"
                                        value={formData.links.facebook || ''}
                                        onChange={(e) => setFormData({ ...formData, links: { ...formData.links, facebook: e.target.value } })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Instagram URL"
                                        value={formData.links.instagram || ''}
                                        onChange={(e) => setFormData({ ...formData, links: { ...formData.links, instagram: e.target.value } })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="SoundCloud URL"
                                        value={formData.links.soundcloud || ''}
                                        onChange={(e) => setFormData({ ...formData, links: { ...formData.links, soundcloud: e.target.value } })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Website URL"
                                        value={formData.links.website || ''}
                                        onChange={(e) => setFormData({ ...formData, links: { ...formData.links, website: e.target.value } })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="YouTube URL"
                                        value={formData.links.youtube || ''}
                                        onChange={(e) => setFormData({ ...formData, links: { ...formData.links, youtube: e.target.value } })}
                                    />
                                </div>
                            </div>

                            <div className="field-group">
                                <label>Embedded Video (YouTube URL)</label>
                                <input
                                    type="text"
                                    placeholder="e.g., https://www.youtube.com/watch?v=..."
                                    value={formData.videoUrl}
                                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                />
                                <small style={{ color: '#888', marginTop: '0.5rem', display: 'block' }}>
                                    This video will be embedded in the band's detail page.
                                </small>
                            </div>



                            <div className="form-actions" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button type="submit" className="btn-primary" disabled={saving}>
                                    {saving ? 'Saving...' : (editingId ? 'Update Performer' : 'Create Performer')}
                                </button>
                                <button type="button" onClick={cancelForm} className="btn-secondary">
                                    Cancel
                                </button>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(editingId)}
                                        className="btn-delete"
                                        disabled={saving}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </form>
                    </>
                ) : (
                    <>
                        <div className="editor-header" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <div style={{ flex: 1 }}>
                                <h2>Performers Preview</h2>
                            </div>

                            <div className="filter-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>Filter Year:</label>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                    style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #ddd' }}
                                >
                                    {[2024, 2025, 2026, 2027, 2028].map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>

                            <button onClick={resetForm} className="btn-small">
                                + New Performer
                            </button>
                        </div>

                        <div className="performers-grid-preview">
                            {performers.length === 0 ? (
                                <div className="no-performers">
                                    <p>No performers yet. Click "+ New Performer" to add one.</p>
                                </div>
                            ) : (
                                <div className="performers-grid">
                                    {performers
                                        .filter(p => p.year === selectedYear)
                                        .map((performer, index) => (
                                            <div
                                                key={performer.id}
                                                className={`performer-card ${draggedIndex === index ? 'dragging' : ''}`}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, index)}
                                                onDragOver={handleDragOver}
                                                onDrop={(e) => handleDrop(e, index)}
                                                onDragEnd={handleDragEnd}
                                                onClick={() => handleEdit(performer)}
                                                style={{ cursor: draggedIndex !== null ? 'grabbing' : 'pointer' }}
                                            >
                                                {performer.photo && (
                                                    <div className="performer-image">
                                                        <img src={performer.photo} alt={performer.name} />
                                                        <div className="performer-overlay"></div>
                                                    </div>
                                                )}
                                                <div className="performer-content">
                                                    <h3 className="performer-name">{performer.name}</h3>

                                                    {!performer.active && (
                                                        <div className="inactive-badge">Inactive</div>
                                                    )}

                                                    <button
                                                        className="btn-preview-card"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setPreviewPerformer(performer);
                                                        }}
                                                        title="Live Preview"
                                                    >
                                                        <Eye size={16} /> <span>Preview</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>

            {/* Preview Modal */}
            {previewPerformer && (
                <div className="preview-modal-overlay" onClick={() => setPreviewPerformer(null)}>
                    <div className="preview-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="btn-close-preview" onClick={() => setPreviewPerformer(null)}>
                            <X size={24} />
                        </button>

                        <div className="preview-inner" style={{ background: '#000', padding: '4rem 2rem' }}>
                            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                                <div className="performer-detail-image">
                                    {previewPerformer.photo && <img src={previewPerformer.photo} alt={previewPerformer.name} />}

                                    <div className="detail-genre-tags">
                                        {previewPerformer.genre.split(',').map((g, idx) => (
                                            <span key={idx} className="detail-genre-tag">{g.trim()}</span>
                                        ))}
                                    </div>

                                    <div className="detail-social-overlay">
                                        {previewPerformer.links?.facebook && (
                                            <a href={previewPerformer.links.facebook} target="_blank" rel="noopener noreferrer" className="btn-social-circle" style={{ background: '#1877f2' }}>
                                                <Facebook size={20} />
                                            </a>
                                        )}
                                        {previewPerformer.links?.instagram && (
                                            <a href={previewPerformer.links.instagram} target="_blank" rel="noopener noreferrer" className="btn-social-circle" style={{ background: '#e4405f' }}>
                                                <Instagram size={20} />
                                            </a>
                                        )}
                                        {previewPerformer.links?.soundcloud && (
                                            <a href={previewPerformer.links.soundcloud} target="_blank" rel="noopener noreferrer" className="btn-social-circle" style={{ background: '#ff5500' }}>
                                                <Music2 size={20} />
                                            </a>
                                        )}
                                        {previewPerformer.links?.youtube && (
                                            <a href={previewPerformer.links.youtube} target="_blank" rel="noopener noreferrer" className="btn-social-circle" style={{ background: '#ff0000' }}>
                                                <Youtube size={20} />
                                            </a>
                                        )}
                                        {previewPerformer.links?.website && (
                                            <a href={previewPerformer.links.website} target="_blank" rel="noopener noreferrer" className="btn-social-circle" style={{ background: '#444' }}>
                                                <Globe size={20} />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <div className="detail-info">
                                    <h1 className="detail-name" style={{
                                        fontSize: 'clamp(2.5rem, 8vw, 5rem)',
                                        color: '#fff',
                                        fontFamily: 'var(--font-heading)',
                                        textTransform: 'uppercase',
                                        marginBottom: '1rem',
                                        fontWeight: 900
                                    }}>{previewPerformer.name}</h1>

                                    <div className="info-text-block">
                                        {previewPerformer.description && (
                                            <div className="lead" style={{ whiteSpace: 'pre-wrap', color: '#fff', opacity: 0.9, fontSize: '1.2rem', lineHeight: 1.6 }}>
                                                {previewPerformer.description}
                                            </div>
                                        )}

                                        {previewPerformer.videoUrl && getYoutubeId(previewPerformer.videoUrl) && (
                                            <div className="performer-video-section" style={{ marginTop: '2.5rem' }}>
                                                <div className="video-container" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                                                    <iframe
                                                        src={`https://www.youtube.com/embed/${getYoutubeId(previewPerformer.videoUrl)}`}
                                                        title="YouTube video player"
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                                    ></iframe>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
