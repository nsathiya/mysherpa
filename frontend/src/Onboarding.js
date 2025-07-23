import React, { useState } from 'react';

const adventureOptions = [
  { value: 'off_beaten_path', label: '🧗‍♂️ I like to go off the beaten path' },
  { value: 'mix', label: '🗺️ I like a mix of safe & spontaneous' },
  { value: 'classic', label: '📸 I prefer well-known, classic spots' },
];

const touristOptions = [
  { value: 'avoid', label: '😬 Avoid them at all costs' },
  { value: 'sometimes', label: '🤷‍♂️ Don’t mind them sometimes' },
  { value: 'love', label: '🏛️ I love the big attractions!' },
];

const landscapeOptions = [
  { value: 'beaches', label: '🏖️ Beaches' },
  { value: 'mountains', label: '🏔️ Mountains' },
  { value: 'cities', label: '🏙️ Cities' },
  { value: 'forests', label: '🌲 Forests' },
  { value: 'snow', label: '❄️ Snowy places' },
  { value: 'deserts', label: '🏜️ Deserts' },
  { value: 'lakes', label: '🌊 Lakes / Water' },
];

const paceOptions = [
  { value: 'chill', label: '🧘‍♂️ Chill and slow' },
  { value: 'balanced', label: '🚶‍♂️ Balanced' },
  { value: 'fast', label: '🏃‍♀️ Fast and full of action' },
];

export default function Onboarding({ userId, onComplete }) {
  const [step, setStep] = useState(1);
  const [adventureStyle, setAdventureStyle] = useState('');
  const [touristVibe, setTouristVibe] = useState('');
  const [landscapePreferences, setLandscapePreferences] = useState([]);
  const [paceOfDay, setPaceOfDay] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLandscapeToggle = (val) => {
    setLandscapePreferences((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adventureStyle,
          touristVibe,
          landscapePreferences,
          paceOfDay,
        }),
      });
      if (onComplete) onComplete();
    } catch (err) {
      setError('Failed to save preferences.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      zIndex: 2000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: 'white',
        borderRadius: 16,
        padding: '2rem',
        minWidth: 340,
        maxWidth: 400,
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        textAlign: 'center',
      }}>
        <h2 style={{ marginBottom: 24, color: '#007bff' }}>Personalize Your Adventure</h2>
        {step === 1 && (
          <>
            <div style={{ marginBottom: 18, fontWeight: 600 }}>What kind of explorer are you?</div>
            {adventureOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setAdventureStyle(opt.value)}
                style={{
                  display: 'block', width: '100%', margin: '8px 0', padding: '12px',
                  borderRadius: 8, border: adventureStyle === opt.value ? '2px solid #007bff' : '1.5px solid #e0e0e0',
                  background: adventureStyle === opt.value ? '#e7f1ff' : '#fff',
                  fontSize: 18, cursor: 'pointer', fontWeight: 500
                }}
              >{opt.label}</button>
            ))}
            <button disabled={!adventureStyle} onClick={() => setStep(2)} style={{ marginTop: 18, width: '100%', padding: 12, borderRadius: 8, background: '#007bff', color: 'white', fontWeight: 600, fontSize: 16, border: 'none', cursor: adventureStyle ? 'pointer' : 'not-allowed' }}>Next</button>
          </>
        )}
        {step === 2 && (
          <>
            <div style={{ marginBottom: 18, fontWeight: 600 }}>Do you enjoy touristy places?</div>
            {touristOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setTouristVibe(opt.value)}
                style={{
                  display: 'block', width: '100%', margin: '8px 0', padding: '12px',
                  borderRadius: 8, border: touristVibe === opt.value ? '2px solid #007bff' : '1.5px solid #e0e0e0',
                  background: touristVibe === opt.value ? '#e7f1ff' : '#fff',
                  fontSize: 18, cursor: 'pointer', fontWeight: 500
                }}
              >{opt.label}</button>
            ))}
            <button disabled={!touristVibe} onClick={() => setStep(3)} style={{ marginTop: 18, width: '100%', padding: 12, borderRadius: 8, background: '#007bff', color: 'white', fontWeight: 600, fontSize: 16, border: 'none', cursor: touristVibe ? 'pointer' : 'not-allowed' }}>Next</button>
          </>
        )}
        {step === 3 && (
          <>
            <div style={{ marginBottom: 18, fontWeight: 600 }}>What kind of scenery do you love most?</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
              {landscapeOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleLandscapeToggle(opt.value)}
                  style={{
                    padding: '10px 14px', borderRadius: 8, border: landscapePreferences.includes(opt.value) ? '2px solid #007bff' : '1.5px solid #e0e0e0',
                    background: landscapePreferences.includes(opt.value) ? '#e7f1ff' : '#fff', fontSize: 18, cursor: 'pointer', fontWeight: 500
                  }}
                >{opt.label}</button>
              ))}
            </div>
            <button disabled={landscapePreferences.length === 0} onClick={() => setStep(4)} style={{ marginTop: 8, width: '100%', padding: 12, borderRadius: 8, background: '#007bff', color: 'white', fontWeight: 600, fontSize: 16, border: 'none', cursor: landscapePreferences.length ? 'pointer' : 'not-allowed' }}>Next</button>
          </>
        )}
        {step === 4 && (
          <>
            <div style={{ marginBottom: 18, fontWeight: 600 }}>What’s your ideal adventure pace?</div>
            {paceOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setPaceOfDay(opt.value)}
                style={{
                  display: 'block', width: '100%', margin: '8px 0', padding: '12px',
                  borderRadius: 8, border: paceOfDay === opt.value ? '2px solid #007bff' : '1.5px solid #e0e0e0',
                  background: paceOfDay === opt.value ? '#e7f1ff' : '#fff',
                  fontSize: 18, cursor: 'pointer', fontWeight: 500
                }}
              >{opt.label}</button>
            ))}
            <button disabled={!paceOfDay} onClick={handleSubmit} style={{ marginTop: 18, width: '100%', padding: 12, borderRadius: 8, background: '#007bff', color: 'white', fontWeight: 600, fontSize: 16, border: 'none', cursor: paceOfDay ? 'pointer' : 'not-allowed' }}>{loading ? 'Saving...' : 'Finish'}</button>
            {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
          </>
        )}
      </div>
    </div>
  );
} 