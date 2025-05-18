import React, { useState } from 'react';
import { useCharacter } from '../contexts/CharacterContext';
import Card from './Card';
import './CharacterManagement.css';

function CharacterManagement() {
  const {
    user,
    character,
    characterId,
    availableCharacters,
    saveCharacter,
    loadCharacter,
    createNewCharacter,
    loading,
    fetchUserCharacters // In case we need manual refresh
  } = useCharacter();

  const [selectedCharToLoad, setSelectedCharToLoad] = useState('');

  const handleLoadSelected = () => {
    if (selectedCharToLoad) {
      loadCharacter(selectedCharToLoad);
    }
  };

  if (!user) {
    return (
      <Card title="Character Management">
        <p className="info-text">Please log in to manage your characters.</p>
      </Card>
    );
  }

  return (
    <Card title="Character Management">
      <div className="management-section">
        <h4>Current Character: {character.characterName || "Untitled"} {characterId ? `(ID: ${characterId.substring(0,6)}...)` : "(New)"}</h4>
        <button onClick={saveCharacter} disabled={loading || !character.characterName.trim()} className="action-button save-button">
          {loading && characterId ? 'Saving...' : 'Save Current Character'}
          {!character.characterName.trim() && ' (Name Required)'}
        </button>
        <button onClick={createNewCharacter} disabled={loading} className="action-button">New Blank Character</button>
      </div>

      {availableCharacters.length > 0 && (
        <div className="management-section">
          <h4>Load Existing Character</h4>
          <div className="load-controls">
            <select 
              value={selectedCharToLoad}
              onChange={(e) => setSelectedCharToLoad(e.target.value)}
              className="form-select"
              disabled={loading}
            >
              <option value="">-- Select Character --</option>
              {availableCharacters.map(char => (
                <option key={char.id} value={char.id}>
                  {char.characterName || "Untitled Character"} (ID: {char.id.substring(0,6)}...)
                </option>
              ))}
            </select>
            <button onClick={handleLoadSelected} disabled={loading || !selectedCharToLoad} className="action-button">Load Selected</button>
          </div>
        </div>
      )}
      {availableCharacters.length === 0 && !loading && (
         <p className="info-text">No characters found. Save your current character or create a new one!</p>
      )}
      {loading && <p className="info-text">Loading characters...</p>}
      {/* <button onClick={() => fetchUserCharacters(user.uid)} disabled={loading} className="action-button">Refresh List</button> */} 
    </Card>
  );
}

export default CharacterManagement; 