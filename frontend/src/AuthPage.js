import React, { useState } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export default function AuthPage({ onAuth }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      console.log('auth', auth);
      await signInWithPopup(auth, provider);
      if (onAuth) onAuth();
    } catch (err) {
      console.log('err', err);  
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      if (onAuth) onAuth();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(90deg, #f8fafc 50%, #007bff 50%)',
      fontFamily: 'Inter, Arial, sans-serif'
    }}>
      {/* Left: Auth Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'white',
        padding: '2rem 0'
      }}>
        <div style={{ width: 320, maxWidth: '90%' }}>
          <h2 style={{ marginBottom: 24, color: '#007bff', fontWeight: 700, fontSize: 28 }}>
            {isSignup ? 'Sign Up' : 'Log In'}
          </h2>
          <button
            onClick={handleGoogle}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: '#fff',
              color: '#333',
              border: '2px solid #007bff',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 16,
              marginBottom: 16,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8
            }}
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png" alt="Google" style={{ width: 22, height: 22, marginRight: 8 }} />
            Continue with Google
          </button>
          <div style={{ textAlign: 'center', margin: '16px 0', color: '#aaa' }}>or</div>
          <form onSubmit={handleEmailAuth}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: 12,
                border: '1.5px solid #e0e0e0',
                borderRadius: 8,
                fontSize: 16
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: 12,
                border: '1.5px solid #e0e0e0',
                borderRadius: 8,
                fontSize: 16
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 16,
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: 8
              }}
            >
              {loading ? (isSignup ? 'Signing up...' : 'Logging in...') : (isSignup ? 'Sign Up' : 'Log In')}
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <button
              onClick={() => setIsSignup(!isSignup)}
              style={{
                background: 'none',
                border: 'none',
                color: '#007bff',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 15
              }}
            >
              {isSignup ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
            </button>
          </div>
          {error && <div style={{ color: 'red', marginTop: 12, textAlign: 'center' }}>{error}</div>}
        </div>
      </div>
      {/* Right: Fun Message */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        background: 'linear-gradient(135deg, #007bff 60%, #00c6ff 100%)',
        padding: '2rem 0',
        textAlign: 'center'
      }}>
        <div>
          <img src="https://cdn-icons-png.flaticon.com/512/201/201623.png" alt="Adventure" style={{ width: 120, marginBottom: 24 }} />
          <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16, letterSpacing: 1 }}>
            Choose your next adventure<br />with <span style={{ color: '#ffe066' }}>mySherpa</span>
          </h1>
          <p style={{ fontSize: 20, opacity: 0.9 }}>
            Discover, plan, and share amazing experiences.<br />Sign up to get started!
          </p>
        </div>
      </div>
    </div>
  );
} 