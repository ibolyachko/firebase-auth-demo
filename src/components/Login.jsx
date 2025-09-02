import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signInWithGoogle, signInWithApple } = useAuth();
    const navigate = useNavigate();

    async function handleGoogleSignIn() {
        try {
            setError('');
            setLoading(true);
            await signInWithGoogle();
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to sign in with Google: ' + err.message);
        }
        setLoading(false);
    }

    async function handleAppleSignIn() {
        try {
            setError('');
            setLoading(true);
            await signInWithApple();
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to sign in with Apple: ' + err.message);
        }
        setLoading(false);
    }

    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            <button
                className="google-btn"
                onClick={handleGoogleSignIn}
                disabled={loading}
            >
                Sign in with Google
            </button>

            <button
                className="apple-btn"
                onClick={handleAppleSignIn}
                disabled={loading}
            >
                Sign in with Apple
            </button>
        </div>
    );
}
