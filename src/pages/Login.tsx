import { useState } from 'react'

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })

            const data = await res.json()

            if (res.ok) {
                localStorage.setItem('token', data.token)
                window.location.href = '/admin'
            } else {
                setError(data.error || 'Login failed')
            }
        } catch (err) {
            setError('Login failed')
        }
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            fontFamily: 'var(--font-heading)',
            background: 'var(--bg)'
        }}>
            <h1>CMS Login</h1>
            <form onSubmit={handleSubmit} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                width: '300px'
            }}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    style={{ padding: '0.5rem' }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{ padding: '0.5rem' }}
                />
                <button type="submit" style={{
                    padding: '0.5rem',
                    background: 'var(--fg)',
                    color: 'var(--bg)',
                    border: 'none',
                    cursor: 'pointer'
                }}>
                    Login
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    )
}
