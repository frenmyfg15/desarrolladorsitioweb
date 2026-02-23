'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '@/app/store/session.store';
import { authApi } from '@/app/api/auth/auth.api';


export default function LoginPage() {
    const router = useRouter();

    const setUser = useSessionStore((s) => s.setUser);
    const setEmpresa = useSessionStore((s) => s.setEmpresa);

    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const { user } = await authApi.login({ correo, contrasena });

            // guardamos user en zustand
            setUser(user);

            // la empresa puede que exista o no; la cargaremos con hydrate o desde pantalla empresa
            setEmpresa(null);

            router.push('/');
        } catch (err: any) {
            setError(err?.message ?? 'Credenciales inválidas');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h1 style={styles.title}>Iniciar sesión</h1>
                <p style={styles.subtitle}>Accede a tu panel</p>

                <form onSubmit={onSubmit} style={styles.form}>
                    <label style={styles.label}>
                        Correo
                        <input
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            type="email"
                            placeholder="tu@correo.com"
                            autoComplete="email"
                            required
                            style={styles.input}
                            disabled={loading}
                        />
                    </label>

                    <label style={styles.label}>
                        Contraseña
                        <input
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                            type="password"
                            placeholder="••••••••"
                            autoComplete="current-password"
                            required
                            style={styles.input}
                            disabled={loading}
                        />
                    </label>

                    {error && <div style={styles.error}>{error}</div>}

                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? 'Entrando…' : 'Entrar'}
                    </button>
                </form>

                <div style={styles.footer}>
                    <span style={styles.footerText}>¿No tienes cuenta?</span>
                    <a href="/" style={styles.link}>Volver</a>
                </div>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    page: {
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: 16,
    },
    card: {
        width: '100%',
        maxWidth: 420,
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: 20,
    },
    title: {
        margin: 0,
        fontSize: 24,
        fontWeight: 700,
    },
    subtitle: {
        marginTop: 6,
        marginBottom: 16,
        color: '#6b7280',
        fontSize: 14,
    },
    form: {
        display: 'grid',
        gap: 12,
    },
    label: {
        display: 'grid',
        gap: 6,
        fontSize: 14,
        fontWeight: 600,
    },
    input: {
        width: '100%',
        padding: '10px 12px',
        borderRadius: 10,
        border: '1px solid #d1d5db',
        outline: 'none',
        fontSize: 14,
    },
    button: {
        marginTop: 6,
        padding: '10px 12px',
        borderRadius: 10,
        border: '1px solid #111827',
        background: '#111827',
        color: 'white',
        fontSize: 14,
        fontWeight: 700,
        cursor: 'pointer',
    },
    error: {
        border: '1px solid #fecaca',
        background: '#fef2f2',
        color: '#991b1b',
        padding: 10,
        borderRadius: 10,
        fontSize: 14,
    },
    footer: {
        marginTop: 14,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 14,
        color: '#6b7280',
    },
    footerText: {
        color: '#6b7280',
    },
    link: {
        color: '#111827',
        textDecoration: 'underline',
    },
};
