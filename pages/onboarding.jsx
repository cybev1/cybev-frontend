
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [features, setFeatures] = useState({
    hasBlog: true, hasTimeline: true, hasNFT: true, hasUtilityAccess: true
  });
  const [interests, setInterests] = useState([]);
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState('');

  const toggleFeature = (feature) => {
    setFeatures(prev => ({ ...prev, [feature]: !prev[feature] }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/auth/onboarding', { features, interests, bio, profileImage }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      router.push('/studio/dashboard');
    } catch (err) {
      alert('Onboarding failed');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      {step === 1 && (
        <div>
          <h3>Select Features</h3>
          {Object.keys(features).map(key => (
            <div key={key}>
              <input type="checkbox" checked={features[key]} onChange={() => toggleFeature(key)} />
              <label>{key}</label>
            </div>
          ))}
          <button onClick={() => setStep(2)}>Next</button>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3>Choose Interests</h3>
          <input type="text" placeholder="Add interests separated by commas" onChange={e => setInterests(e.target.value.split(','))} /><br />
          <button onClick={() => setStep(3)}>Next</button>
        </div>
      )}
      {step === 3 && (
        <div>
          <h3>Profile Setup</h3>
          <textarea placeholder="Short Bio" onChange={e => setBio(e.target.value)} /><br />
          <input type="text" placeholder="Profile Image URL (optional)" onChange={e => setProfileImage(e.target.value)} /><br />
          <button onClick={handleSubmit}>Finish Onboarding</button>
        </div>
      )}
    </div>
  );
}
