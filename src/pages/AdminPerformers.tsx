import { useState, useEffect, useRef, DragEvent } from 'react'
import Spinner from '../components/Spinner/Spinner'
import './Admin.css'

interface Performer {
    id: string
    name: string
    genre: string
    photo: string | null
    description: string | null
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
    const [formData, setFormData] = useState({
        name: '',
        genre: '',
        photo: null as string | null,
        description: '',
        active: true,
        order: 0
    })

    const FIXED_SLUGS = ['index', 'about', 'gallery', 'tickets']

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

            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

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
            active: performer.active,
            order: performer.order
        })
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this performer?')) return

        setSaving(true)
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/performers/${id}`, {
                method: 'DELETE'
            })
            await fetchPerformers()
        } catch (error) {
            console.error('Failed to delete performer:', error)
        } finally {
            setSaving(false)
        }
    }

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const base64 = await readFile(e.target.files[0])
            setFormData({ ...formData, photo: base64 })
        }
    }

    const resetForm = () => {
        setEditingId(null)
        setShowForm(true)
        setFormData({
            name: '',
            genre: '',
            photo: null,
            description: '',
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
                        headers: { 'Content-Type': 'application/json' },
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
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.active}
                                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                    />
                                    {' '}Active (show on frontend)
                                </label>
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
                        <div className="editor-header">
                            <h2>Performers Preview</h2>
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
                                    {performers.map((performer, index) => (
                                        <div
                                            key={performer.id}
                                            className={`performer-card ${draggedIndex === index ? 'dragging' : ''}`}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, index)}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleDrop(e, index)}
                                            onDragEnd={handleDragEnd}
                                            onClick={() => handleEdit(performer)}
                                        >
                                            {performer.photo && (
                                                <div className="performer-image">
                                                    <img src={performer.photo} alt={performer.name} />
                                                    <div className="performer-overlay"></div>
                                                </div>
                                            )}
                                            <div className="performer-content">
                                                <h3 className="performer-name">{performer.name}</h3>
                                                <div className="performer-genre-tags">
                                                    {performer.genre.split(',').map((g, idx) => (
                                                        <span key={idx} className="genre-tag">{g.trim()}</span>
                                                    ))}
                                                </div>
                                                {!performer.active && (
                                                    <div className="inactive-badge">Inactive</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div >
    )
}

