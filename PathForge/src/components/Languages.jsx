import React, { useState } from 'react';
import './Languages.css';
import Card from './Card';
import { useCharacter } from '../contexts/CharacterContext';

function Languages() {
  const { character, setLanguages } = useCharacter();
  const languages = character.languages || [];

  const [newLanguage, setNewLanguage] = useState('');

  const addLanguage = () => {
    const trimmedLanguage = newLanguage.trim();
    if (!trimmedLanguage || languages.includes(trimmedLanguage)) return;
    setLanguages([...languages, trimmedLanguage]);
    setNewLanguage('');
  };

  const removeLanguage = (langToRemove) => {
    // Prevent removing "Common" if it's a special case, or handle based on game rules
    // For now, allowing removal of any for simplicity, though initialCharacterState adds 'Common'
    setLanguages(languages.filter(lang => lang !== langToRemove));
  };

  return (
    <Card title="Languages Known">
      <div className="add-language-section">
        <input 
          type="text" 
          placeholder="New Language"
          value={newLanguage}
          onChange={(e) => setNewLanguage(e.target.value)}
          className="form-input"
        />
        <button onClick={addLanguage} className="action-button">Add Language</button>
      </div>
      <div className="languages-list">
        {languages.length === 0 && <p className="info-text">No languages known.</p>}
        {languages.map(lang => (
          <div key={lang} className="language-item">
            <span className="language-name">{lang}</span>
            {/* Optionally, always allow removing, or make 'Common' unremovable if it is a default one */}
            <button onClick={() => removeLanguage(lang)} className="remove-button">×</button>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default Languages; 