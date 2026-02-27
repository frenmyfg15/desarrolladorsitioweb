"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/auth.store";

export default function LoginPage() {
    const router = useRouter();
    const user = useAuthStore((s) => s.user);
    const login = useAuthStore((s) => s.login);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberEmail, setRememberEmail] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Cargar email guardado al montar
    useEffect(() => {
        const saved = localStorage.getItem("rememberedEmail");
        if (saved) {
            setEmail(saved);
            setRememberEmail(true);
        }
    }, []);

    // Redirigir si ya hay sesión
    useEffect(() => {
        if (!user) return;
        if (user.role === "ADMIN") router.replace("/admin");
        else router.replace("/");
    }, [user, router]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (rememberEmail) localStorage.setItem("rememberedEmail", email);
            else localStorage.removeItem("rememberedEmail");

            const loggedUser = await login(email, password);

            if (loggedUser.role === "ADMIN") router.replace("/admin");
            else router.replace("/");
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                "No se pudo iniciar sesión";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #ffffff;
        }

        /* ── Panel izquierdo (imagen + branding) ── */
        .login-panel {
          position: relative;
          overflow: hidden;
          background: #0f1117;
        }

        .login-panel img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.45;
        }

        .login-panel-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            160deg,
            rgba(54, 219, 186, 0.35) 0%,
            rgba(15, 17, 23, 0.8) 100%
          );
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 48px;
        }

        .login-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          position: absolute;
          top: 40px;
          left: 48px;
        }

        .login-brand-dot {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #36DBBA;
        }

        .login-brand-name {
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
          letter-spacing: -0.3px;
        }

        .login-panel-quote {
          color: #ffffff;
          font-size: 28px;
          font-weight: 300;
          line-height: 1.4;
          letter-spacing: -0.5px;
          max-width: 340px;
        }

        .login-panel-quote strong {
          font-weight: 600;
          color: #36DBBA;
        }

        /* ── Panel derecho (formulario) ── */
        .login-form-section {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 40px;
          background: #ffffff;
        }

        .login-form-wrapper {
          width: 100%;
          max-width: 380px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .login-header h1 {
          font-size: 28px;
          font-weight: 600;
          color: #111827;
          letter-spacing: -0.6px;
        }

        .login-header p {
          margin-top: 6px;
          font-size: 14px;
          color: #6B7280;
          font-weight: 400;
        }

        .login-fields {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .field-label {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field-label span {
          font-size: 13px;
          font-weight: 500;
          color: #374151;
        }

        .field-input {
          padding: 11px 14px;
          border-radius: 10px;
          border: 1.5px solid #E5E7EB;
          background: #F9FAFB;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #111827;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }

        .field-input::placeholder { color: #9CA3AF; }

        .field-input:focus {
          border-color: #36DBBA;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(54, 219, 186, 0.12);
        }

        /* Checkbox "recordar email" */
        .remember-row {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          user-select: none;
        }

        .remember-row input[type="checkbox"] {
          appearance: none;
          -webkit-appearance: none;
          width: 17px;
          height: 17px;
          border-radius: 5px;
          border: 1.5px solid #D1D5DB;
          background: #F9FAFB;
          cursor: pointer;
          position: relative;
          flex-shrink: 0;
          transition: border-color 0.2s, background 0.2s;
        }

        .remember-row input[type="checkbox"]:checked {
          background: #36DBBA;
          border-color: #36DBBA;
        }

        .remember-row input[type="checkbox"]:checked::after {
          content: '';
          position: absolute;
          left: 4px;
          top: 1.5px;
          width: 5px;
          height: 9px;
          border: 2px solid #ffffff;
          border-top: none;
          border-left: none;
          transform: rotate(45deg);
        }

        .remember-row span {
          font-size: 13px;
          color: #6B7280;
          font-weight: 400;
        }

        /* Error */
        .login-error {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 10px;
          background: #FEF2F2;
          border: 1px solid #FECACA;
          font-size: 13px;
          color: #B91C1C;
        }

        /* Botón */
        .login-btn {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: none;
          background: #36DBBA;
          color: #ffffff;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: -0.2px;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 14px rgba(54, 219, 186, 0.35);
        }

        .login-btn:hover:not(:disabled) {
          background: #2BC4A6;
          box-shadow: 0 6px 20px rgba(54, 219, 186, 0.45);
          transform: translateY(-1px);
        }

        .login-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .login-btn:disabled {
          background: #A7F3D0;
          box-shadow: none;
          cursor: not-allowed;
          color: #ffffff;
        }

        .login-footer {
          text-align: center;
          font-size: 13px;
          color: #9CA3AF;
        }

        .login-footer a {
          color: #36DBBA;
          text-decoration: none;
          font-weight: 500;
        }

        .login-footer a:hover { text-decoration: underline; }

        /* Responsive */
        @media (max-width: 768px) {
          .login-root { grid-template-columns: 1fr; }
          .login-panel { display: none; }
          .login-form-section { padding: 40px 24px; }
        }
      `}</style>

            <div className="login-root">
                {/* Panel izquierdo */}
                <div className="login-panel">
                    <img
                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&auto=format&fit=crop"
                        alt="Office background"
                    />
                    <div className="login-panel-overlay">
                        <div className="login-brand">
                            <div className="login-brand-dot" />
                            <span className="login-brand-name">Nombre App</span>
                        </div>
                        <p className="login-panel-quote">
                            Tu espacio de trabajo,<br />
                            <strong>organizado y eficiente.</strong>
                        </p>
                    </div>
                </div>

                {/* Panel derecho */}
                <div className="login-form-section">
                    <div className="login-form-wrapper">
                        <div className="login-header">
                            <h1>Bienvenido de vuelta</h1>
                            <p>Ingresa tus credenciales para continuar</p>
                        </div>

                        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div className="login-fields">
                                <label className="field-label">
                                    <span>Correo electrónico</span>
                                    <input
                                        className="field-input"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="tu@email.com"
                                        autoComplete="email"
                                        required
                                    />
                                </label>

                                <label className="field-label">
                                    <span>Contraseña</span>
                                    <input
                                        className="field-input"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                        required
                                    />
                                </label>
                            </div>

                            {/* Recordar email */}
                            <label className="remember-row">
                                <input
                                    type="checkbox"
                                    checked={rememberEmail}
                                    onChange={(e) => setRememberEmail(e.target.checked)}
                                />
                                <span>Recordar mi correo</span>
                            </label>

                            {error && (
                                <div className="login-error">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <circle cx="8" cy="8" r="7" stroke="#B91C1C" strokeWidth="1.5" />
                                        <path d="M8 5v3.5M8 10.5v.5" stroke="#B91C1C" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                    {error}
                                </div>
                            )}

                            <button className="login-btn" type="submit" disabled={loading}>
                                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                            </button>
                        </form>

                        <p className="login-footer">
                            ¿Olvidaste tu contraseña?{" "}
                            <a href="/forgot-password">Recupérala aquí</a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}