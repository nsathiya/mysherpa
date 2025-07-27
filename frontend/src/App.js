import React, { useState, useEffect } from 'react';
import './App.css';
import Map from './Map';
import AuthPage from './AuthPage';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Onboarding from './Onboarding';
import config from './config';

// Test environment variables at component level
console.log('🔧 App.js Environment Test:', {
  REACT_APP_BACKEND_URL: process.env.REACT_APP_BACKEND_URL,
  REACT_APP_GOOGLE_MAPS_API_KEY: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  REACT_APP_GOOGLE_MAP_ID: process.env.REACT_APP_GOOGLE_MAP_ID,
  hasProcess: typeof process !== 'undefined',
  hasProcessEnv: typeof process !== 'undefined' && !!process.env,
});

function App() {
  const [activity, setActivity] = useState('');
  const [locationTime, setLocationTime] = useState('');
  const [price, setPrice] = useState('cheap');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailPreview, setEmailPreview] = useState('');
  const [fromEmail, setFromEmail] = useState('narensathiya92@gmail.com');
  const [toEmail, setToEmail] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailMessage, setEmailMessage] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [user, setUser] = useState(null); // Firebase user
  const [currentUser, setCurrentUser] = useState(null); // Backend user
  const [syncingUser, setSyncingUser] = useState(false);
  const [ratings, setRatings] = useState({});
  const [feedback, setFeedback] = useState({});
  const [submittingFeedback, setSubmittingFeedback] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // Sync user to backend when Firebase user logs in
  useEffect(() => {
    const syncUser = async () => {
      if (user) {
        setSyncingUser(true);
        try {
          const res = await fetch(`${config.backendUrl}/api/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              firebaseUid: user.uid,
              email: user.email,
            }),
          });
          const data = await res.json();
          setCurrentUser(data);
        } catch (err) {
          setCurrentUser(null);
        } finally {
          setSyncingUser(false);
        }
      } else {
        setCurrentUser(null);
      }
    };
    syncUser();
  }, [user]);

  // Helper to check if onboarding is complete
  const isOnboardingComplete = (user) => {
    if (!user) return false;
    return (
      user.adventureStyle &&
      user.touristVibe &&
      Array.isArray(user.landscapePreferences) && user.landscapePreferences.length > 0 &&
      user.paceOfDay
    );
  };

  // Handler to refresh user after onboarding
  const handleOnboardingComplete = async () => {
    // Refetch user from backend
    try {
      const res = await fetch(`${config.backendUrl}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebaseUid: user.uid,
          email: user.email,
        }),
      });
      const data = await res.json();
      setCurrentUser(data);
    } catch (err) {
      // fallback: just reload page
      window.location.reload();
    }
  };

  if (!user) {
    return <AuthPage onAuth={() => setUser(auth.currentUser)} />;
  }
  if (user && (syncingUser || !currentUser)) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>Loading your account...</div>;
  }
  // Show onboarding if user exists but onboarding is incomplete
  if (currentUser && !isOnboardingComplete(currentUser)) {
    return <Onboarding userId={currentUser.id} onComplete={handleOnboardingComplete} />;
  }

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setCurrentUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults([]);
    setShowMap(false);
    try {
      const response = await fetch(`${config.backendUrl}/suggestions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activity,
          locationTime,
          price,
          adventureStyle: currentUser?.adventureStyle || '',
          touristVibe: currentUser?.touristVibe || '',
          landscapePreferences: currentUser?.landscapePreferences || [],
          paceOfDay: currentUser?.paceOfDay || ''
        }),
      });
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      const data = await response.json();
      setResults(data);
      setShowMap(true);
    } catch (err) {
      console.error(err);
      setError('Could not fetch suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleShareSuggestions = async () => {
    if (results.length === 0) return;
    
    setShowEmailModal(true);
    setEmailMessage('');
    
    // Generate email preview
    try {
      const suggestionsParam = encodeURIComponent(JSON.stringify(results));
      const response = await fetch(
        `${config.backendUrl}/suggestions/email-preview?suggestions=${suggestionsParam}&activity=${encodeURIComponent(activity)}&locationTime=${encodeURIComponent(locationTime)}&price=${encodeURIComponent(price)}`
      );
      if (response.ok) {
        const data = await response.json();
        setEmailPreview(data.preview);
      }
    } catch (err) {
      console.error('Failed to generate email preview:', err);
    }
  };

  const handleSendEmail = async () => {
    if (!fromEmail || !toEmail) {
      setEmailMessage('Please enter both from and to email addresses.');
      return;
    }

    setSendingEmail(true);
    setEmailMessage('');
    
    try {
              const response = await fetch(`${config.backendUrl}/suggestions/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toEmail,
          fromEmail,
          suggestions: results,
          activity,
          locationTime,
          price
        }),
      });
      
      const data = await response.json();
      setEmailMessage(data.message);
      
      if (data.success) {
        setTimeout(() => {
          setShowEmailModal(false);
          setFromEmail('narensathiya92@gmail.com');
          setToEmail('');
          setEmailMessage('');
        }, 2000);
      }
    } catch (err) {
      setEmailMessage('Failed to send email. Please try again.');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleRating = (suggestionTitle, rating) => {
    setRatings(prev => ({ ...prev, [suggestionTitle]: rating }));
  };

  const handleFeedbackChange = (suggestionTitle, feedbackText) => {
    setFeedback(prev => ({ ...prev, [suggestionTitle]: feedbackText }));
  };

  const submitFeedback = async (suggestionTitle) => {
    const rating = ratings[suggestionTitle];
    const feedbackText = feedback[suggestionTitle];
    
    if (!rating) return;
    
    setSubmittingFeedback(prev => ({ ...prev, [suggestionTitle]: true }));
    
    try {
      const response = await fetch(`${config.backendUrl}/suggestions/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          suggestionTitle,
          rating,
          feedback: feedbackText,
          userId: currentUser?.id
        }),
      });
      
      if (response.ok) {
        // Show success message briefly
        setTimeout(() => {
          setSubmittingFeedback(prev => ({ ...prev, [suggestionTitle]: false }));
        }, 1000);
      }
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      setSubmittingFeedback(prev => ({ ...prev, [suggestionTitle]: false }));
    }
  };

  return (
    <div className="App" style={{ 
      maxWidth: 1200, 
      margin: '0 auto', 
      padding: '2rem',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <span style={{ marginRight: 16, color: '#007bff', fontWeight: 600 }}>
          {user?.email}
        </span>
        <button onClick={handleLogout} style={{
          background: '#fff',
          color: '#007bff',
          border: '2px solid #007bff',
          borderRadius: 8,
          padding: '8px 18px',
          fontWeight: 600,
          fontSize: 15,
          cursor: 'pointer'
        }}>Log Out</button>
      </div>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '2rem'
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          margin: '0 0 2rem 0',
          color: '#2c3e50',
          fontSize: '2.5rem',
          fontWeight: '700'
        }}>
          🎯 Personal Concierge
        </h1>
        
        <form onSubmit={handleSubmit} style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="What do you want to do? (e.g., food, museums, nightlife)"
              value={activity}
              onChange={e => setActivity(e.target.value)}
              required
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '12px 16px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '16px',
                transition: 'border-color 0.2s'
              }}
            />
            <input
              type="text"
              placeholder="Where & when? (e.g., SoHo at 7 PM)"
              value={locationTime}
              onChange={e => setLocationTime(e.target.value)}
              required
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '12px 16px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '16px',
                transition: 'border-color 0.2s'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <select 
              value={price} 
              onChange={e => setPrice(e.target.value)}
              style={{
                padding: '12px 16px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '16px',
                backgroundColor: 'white',
                minWidth: '150px'
              }}
            >
              <option value="cheap">💰 Cheap</option>
              <option value="moderate">💳 Moderate</option>
              <option value="high-end">💎 High-end</option>
            </select>
            
            <button 
              type="submit" 
              disabled={loading}
              style={{
                padding: '12px 24px',
                backgroundColor: loading ? '#6c757d' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
                flex: 1
              }}
            >
              {loading ? '🔍 Finding...' : '✨ Get Suggestions'}
            </button>
          </div>
        </form>
      </div>
      
      {error && (
        <div style={{ 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '1rem',
          border: '1px solid #f5c6cb'
        }}>
          {error}
        </div>
      )}
      
      {results.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Map Section */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#2c3e50' }}>📍 Activity Locations</h3>
            <Map suggestions={results} />
          </div>
          
          {/* Results Section */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#2c3e50' }}>🎯 Your Suggestions</h3>
              <button 
                onClick={handleShareSuggestions}
                style={{ 
                  backgroundColor: '#28a745', 
                  color: 'white', 
                  border: 'none', 
                  padding: '8px 16px', 
                  borderRadius: '6px', 
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                📧 Share via Email
              </button>
            </div>

            {/* Preference Summary */}
            <div style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem',
              border: '1px solid #e9ecef'
            }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#2c3e50', fontSize: '16px' }}>Your Explorer Profile:</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px' }}>
                <div>🧗 Adventure Style: {currentUser?.adventureStyle === 'off_beaten_path' ? 'Off the beaten path' : currentUser?.adventureStyle === 'mix' ? 'Mix of safe & spontaneous' : 'Classic spots'}</div>
                <div>😬 Tourist Vibe: {currentUser?.touristVibe === 'avoid' ? 'Avoid tourist traps' : currentUser?.touristVibe === 'sometimes' ? 'Don\'t mind sometimes' : 'Love big attractions'}</div>
                <div>🏖️ Landscapes: {currentUser?.landscapePreferences?.join(', ') || 'None specified'}</div>
                <div>🧘 Pace: {currentUser?.paceOfDay === 'chill' ? 'Chill and slow' : currentUser?.paceOfDay === 'balanced' ? 'Balanced' : 'Fast and full of action'}</div>
              </div>
            </div>
            
            <div style={{ 
              maxHeight: '400px', 
              overflowY: 'auto',
              paddingRight: '8px'
            }}>
              {results.map((item, idx) => (
                <div key={idx} style={{ 
                  marginBottom: '1rem', 
                  padding: '1rem',
                  border: '1px solid #e9ecef',
                  borderRadius: '8px',
                  backgroundColor: '#f8f9fa',
                  transition: 'transform 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      flexShrink: 0
                    }}>
                      {idx + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>{item.title}</h4>
                      <p style={{ margin: '0 0 8px 0', color: '#6c757d', lineHeight: '1.5' }}>
                        {item.description}
                      </p>
                      {item.whyRecommended && (
                        <div style={{
                          backgroundColor: '#e7f1ff',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          marginBottom: '8px',
                          borderLeft: '3px solid #007bff'
                        }}>
                          <span style={{ fontWeight: '600', color: '#007bff', fontSize: '14px' }}>🧠 Why this?</span>
                          <span style={{ color: '#495057', fontSize: '14px', marginLeft: '8px' }}>{item.whyRecommended}</span>
                        </div>
                      )}
                      <div style={{ fontSize: '14px', color: '#6c757d' }}>
                        <span style={{ 
                          backgroundColor: price === 'cheap' ? '#d4edda' : price === 'high-end' ? '#f8d7da' : '#fff3cd',
                          color: price === 'cheap' ? '#155724' : price === 'high-end' ? '#721c24' : '#856404',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          marginRight: '8px'
                        }}>
                          {item.cost}
                        </span>
                        <span style={{ 
                          backgroundColor: '#e7f1ff',
                          color: '#007bff',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          marginRight: '8px',
                          fontSize: '12px'
                        }}>
                          ⏱️ {item.estimatedTime || 'Time not specified'}
                        </span>
                        📍 {item.address}
                        {item.website && (
                          <span> | <a href={item.website} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>🌐 Visit</a></span>
                        )}
                      </div>
                      
                      {/* Rating and Feedback Section */}
                      <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e9ecef' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <span style={{ fontSize: '14px', color: '#6c757d' }}>Rate this suggestion:</span>
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              onClick={() => handleRating(item.title, star)}
                              style={{
                                background: 'none',
                                border: 'none',
                                fontSize: '18px',
                                cursor: 'pointer',
                                color: ratings[item.title] >= star ? '#ffc107' : '#e9ecef',
                                transition: 'color 0.2s'
                              }}
                            >
                              ⭐
                            </button>
                          ))}
                          {ratings[item.title] && (
                            <span style={{ fontSize: '12px', color: '#6c757d' }}>
                              ({ratings[item.title]}/5)
                            </span>
                          )}
                        </div>
                        
                        {ratings[item.title] && (
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                            <input
                              type="text"
                              placeholder="Optional feedback (e.g., 'Perfect for my style!')"
                              value={feedback[item.title] || ''}
                              onChange={(e) => handleFeedbackChange(item.title, e.target.value)}
                              style={{
                                flex: 1,
                                padding: '6px 8px',
                                border: '1px solid #e9ecef',
                                borderRadius: '4px',
                                fontSize: '12px'
                              }}
                            />
                            <button
                              onClick={() => submitFeedback(item.title)}
                              disabled={submittingFeedback[item.title]}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: submittingFeedback[item.title] ? '#6c757d' : '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '12px',
                                cursor: submittingFeedback[item.title] ? 'not-allowed' : 'pointer'
                              }}
                            >
                              {submittingFeedback[item.title] ? '✓' : 'Submit'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '16px',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'auto',
            width: '90%',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
          }}>
            <h3 style={{ margin: '0 0 1.5rem 0', color: '#2c3e50' }}>📧 Share Suggestions via Email</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600', color: '#2c3e50' }}>From Email:</label>
              <input
                type="email"
                value={fromEmail}
                onChange={e => setFromEmail(e.target.value)}
                placeholder="your-email@example.com"
                style={{ width: '100%', padding: '12px', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '16px' }}
              />
              <small style={{ color: '#6c757d', fontSize: '12px' }}>Using your verified email address</small>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600', color: '#2c3e50' }}>To Email:</label>
              <input
                type="email"
                value={toEmail}
                onChange={e => setToEmail(e.target.value)}
                placeholder="recipient@example.com"
                style={{ width: '100%', padding: '12px', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '16px' }}
              />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600', color: '#2c3e50' }}>Email Preview:</label>
              <div style={{
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                padding: '1rem',
                backgroundColor: '#f8f9fa',
                maxHeight: '200px',
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
                fontSize: '14px',
                fontFamily: 'monospace'
              }}>
                {emailPreview}
              </div>
            </div>
            
            {emailMessage && (
              <div style={{ 
                marginBottom: '1rem', 
                padding: '12px', 
                borderRadius: '8px',
                backgroundColor: emailMessage.includes('successfully') ? '#d4edda' : '#f8d7da',
                color: emailMessage.includes('successfully') ? '#155724' : '#721c24',
                border: `1px solid ${emailMessage.includes('successfully') ? '#c3e6cb' : '#f5c6cb'}`
              }}>
                {emailMessage}
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowEmailModal(false);
                  setFromEmail('narensathiya92@gmail.com');
                  setToEmail('');
                  setEmailMessage('');
                }}
                style={{
                  padding: '10px 20px',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                disabled={sendingEmail}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: sendingEmail ? '#6c757d' : '#007bff',
                  color: 'white',
                  cursor: sendingEmail ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                {sendingEmail ? '📤 Sending...' : '📧 Send Email'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
