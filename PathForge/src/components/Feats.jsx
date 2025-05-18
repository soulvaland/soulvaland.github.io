import React, { useState } from 'react';
import './Feats.css';
import Card from './Card';
import { useCharacter } from '../contexts/CharacterContext';

function Feats() {
  const { character, setFeats } = useCharacter();
  const feats = character.feats || [];

  const [featName, setFeatName] = useState('');
  const [featDescription, setFeatDescription] = useState('');

  const addFeat = () => {
    if (!featName.trim()) return;
    const newFeat = {
      id: featName.toLowerCase().replace(/\s+/g, '-') + Date.now(),
      name: featName,
      description: featDescription,
    };
    setFeats([...feats, newFeat]);
    setFeatName('');
    setFeatDescription('');
  };

  const removeFeat = (id) => {
    setFeats(feats.filter(feat => feat.id !== id));
  };

  return (
    <Card title="Feats">
      <div className="add-feat-section">
        <input 
          type="text" 
          placeholder="Feat Name"
          value={featName}
          onChange={(e) => setFeatName(e.target.value)}
          className="form-input"
        />
        {/* <textarea 
          placeholder="Feat Description (optional)"
          value={featDescription}
          onChange={(e) => setFeatDescription(e.target.value)}
          className="form-textarea"
        ></textarea> */}
        <button onClick={addFeat} className="action-button hex-button">Add Feat</button>
      </div>
      <div className="feats-list">
        {feats.length === 0 && <p className="info-text">No feats added yet.</p>}
        {feats.map(feat => (
          <div key={feat.id} className="feat-item">
            <div className="feat-info">
              <strong className="feat-name">{feat.name}</strong>
              {feat.description && <p className="feat-description">{feat.description}</p>}
            </div>
            <button onClick={() => removeFeat(feat.id)} className="remove-button">×</button>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default Feats; 