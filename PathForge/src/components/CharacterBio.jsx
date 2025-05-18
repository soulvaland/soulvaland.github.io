import React from 'react';
import './CharacterBio.css';
import Card from './Card';
import { useCharacter } from '../contexts/CharacterContext';

function CharacterBio() {
  const { character, setBio } = useCharacter();
  const bio = character.bio || { appearance: '', background: '', personality: '', notes: '' };

  const handleChange = (field, value) => {
    setBio(field, value);
  };

  return (
    <Card title="Character Biography">
      <div className="bio-section scroll-like-container">
        <label htmlFor="appearance" className="form-label">Appearance:</label>
        <textarea 
          id="appearance"
          value={bio.appearance}
          onChange={(e) => handleChange('appearance', e.target.value)}
          placeholder="Describe your character's physical appearance, clothing, and distinguishing features..."
          rows={6}
          className="form-textarea"
        />
      </div>
      <div className="bio-section scroll-like-container">
        <label htmlFor="background" className="form-label">Background / Backstory:</label>
        <textarea 
          id="background"
          value={bio.background}
          onChange={(e) => handleChange('background', e.target.value)}
          placeholder="Detail your character's history, origin, and significant life events..."
          rows={8}
          className="form-textarea"
        />
      </div>
      <div className="bio-section scroll-like-container">
        <label htmlFor="personality" className="form-label">Personality & Mannerisms:</label>
        <textarea 
          id="personality"
          value={bio.personality}
          onChange={(e) => handleChange('personality', e.target.value)}
          placeholder="Describe your character's temperament, ideals, flaws, bonds, and typical behavior..."
          rows={6}
          className="form-textarea"
        />
      </div>
      <div className="bio-section scroll-like-container">
        <label htmlFor="notes" className="form-label">Notes & Other Details:</label>
        <textarea 
          id="notes"
          value={bio.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Any other notes, allies, enemies, organizations, etc..."
          rows={5}
          className="form-textarea"
        />
      </div>
    </Card>
  );
}

export default CharacterBio; 