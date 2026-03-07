import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function OAuthML() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');
    const [status, setStatus] = useState('pending'); // pending, success, error

    useEffect(() => {
        // Se houver um user_id na URL (callback do backend/n8n)
        const uid = searchParams.get('user_id') || searchParams.get('userId');
        if (uid) {
            localStorage.setItem('ml_user_id', uid);
            setStatus('success');
            setTimeout(() => navigate('/admin'), 2000);
        }
    }, [searchParams, navigate]);

    const handleManualSave = () => {
        if (userId.trim()) {
            localStorage.setItem('ml_user_id', userId.trim());
            setStatus('success');
            setTimeout(() => navigate('/admin'), 1500);
        }
    };

    return (
        <div className="dashboard-theme" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0a0a0a',
            color: '#fff',
            fontFamily: 'Inter, sans-serif'
        }}>
            <div className="panel" style={{ maxWidth: 400, width: '90%', padding: 30, textAlign: 'center' }}>
                <h2 style={{ fontWeight: 900, marginBottom: 10 }}>Mercado Livre Auth</h2>

                {status === 'pending' && (
                    <>
                        <p className="muted" style={{ marginBottom: 20 }}>
                            Insira seu User ID do Mercado Livre para conectar o Dashboard Porto Alpha.
                        </p>
                        <input
                            type="text"
                            placeholder="Ex: 12345678"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                background: '#1a1a1a',
                                border: '1px solid #333',
                                color: '#fff',
                                marginBottom: 15
                            }}
                        />
                        <button
                            className="btn primary"
                            onClick={handleManualSave}
                            style={{ width: '100%' }}
                        >
                            Conectar Agora
                        </button>
                    </>
                )}

                {status === 'success' && (
                    <div style={{ color: '#5dffb0' }}>
                        <div style={{ fontSize: 40, marginBottom: 10 }}>✅</div>
                        <h3 style={{ fontWeight: 900 }}>Conectado!</h3>
                        <p className="small">Redirecionando para o painel...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
