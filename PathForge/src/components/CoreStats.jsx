import React from 'react'; // Removed useState
import './CoreStats.css';
import Card from './Card';
import { useCharacter } from '../contexts/CharacterContext'; // Import useCharacter

// Helper to calculate modifier (can be moved to a utils file later)
const calculateModifier = (score) => Math.floor(((score || 0) - 10) / 2);

function CoreStats() {
  const { character, updateCharacterField, setHp, setAc, setSaves, setAbilityScores } = useCharacter(); // Use context

  // Ensure character substructures exist to prevent errors on first render if not fully loaded
  const hp = character.hp || { current: 0, max: 0 };
  const abilityScores = character.abilityScores || {};
  const ac = character.ac || { total: 0, touch: 0, flatFooted: 0 };
  const saves = character.saves || { fortitude: {}, reflex: {}, will: {} };

  const handleAbilityChange = (abilityKey, value) => {
    const newBaseScore = parseInt(value, 10) || 0;
    // Create a deep copy of the abilityScores to update
    const updatedScores = JSON.parse(JSON.stringify(abilityScores));
    updatedScores[abilityKey] = { ...(updatedScores[abilityKey] || {}), base: newBaseScore };
    setAbilityScores(updatedScores); // Update context
    // TODO: Add recalculation logic for dependent stats (e.g., saves modifiers) here or in context
  };

  const handleHpChange = (field, value) => {
    setHp({ ...hp, [field]: parseInt(value, 10) || 0 });
  };

  const handleAcChange = (field, value) => {
    setAc({ ...ac, [field]: parseInt(value, 10) || 0 });
  };

  const handleSaveChange = (saveKey, field, value) => {
    // For now, assuming field is 'total' directly. Later expand for base, magic, etc.
    const updatedSaves = JSON.parse(JSON.stringify(saves));
    updatedSaves[saveKey] = { ...(updatedSaves[saveKey] || {}), [field]: parseInt(value, 10) || 0 };
    setSaves(updatedSaves);
  };

  return (
    <Card title="Core Stats">
      {/* Hit Points */}
      <div className="stat-section hp-section">
        <h3 className="subsection-header">Hit Points</h3>
        <div className="hp-inputs">
          <label htmlFor="currentHp" className="form-label">Current HP:</label>
          <input type="number" id="currentHp" value={hp.current} onChange={(e) => handleHpChange('current', e.target.value)} className="form-input" />
          <span>/</span>
          <label htmlFor="maxHp" className="form-label">Max HP:</label>
          <input type="number" id="maxHp" value={hp.max} onChange={(e) => handleHpChange('max', e.target.value)} className="form-input" />
        </div>
      </div>

      {/* Ability Scores */}
      <div className="stat-section ability-scores-section">
        <h3 className="subsection-header">Ability Scores</h3>
        <div className="ability-scores-grid">
          {Object.entries(character.abilityScores || {}).map(([key, scoreData]) => (
            <div key={key} className="ability-score-item">
              <label htmlFor={key} className="form-label">{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
              <input 
                type="number" 
                id={key} 
                value={scoreData.base || 0} 
                onChange={(e) => handleAbilityChange(key, e.target.value)} 
                className="form-input"
              />
              <span className="ability-modifier">Mod: {calculateModifier(scoreData.base || 0)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Armor Class */}
      <div className="stat-section ac-section">
        <h3 className="subsection-header">Armor Class</h3>
        <div className="ac-inputs">
          <label htmlFor="acTotal" className="form-label">Total AC:</label>
          <input type="number" id="acTotal" value={ac.total || 0} onChange={(e) => handleAcChange('total', e.target.value)} className="form-input" />
          <label htmlFor="acTouch" className="form-label">Touch AC:</label>
          <input type="number" id="acTouch" value={ac.touch || 0} onChange={(e) => handleAcChange('touch', e.target.value)} className="form-input" />
          <label htmlFor="acFlatFooted" className="form-label">Flat-Footed AC:</label>
          <input type="number" id="acFlatFooted" value={ac.flatFooted || 0} onChange={(e) => handleAcChange('flatFooted', e.target.value)} className="form-input" />
        </div>
      </div>

      {/* Saves */}
      <div className="stat-section saves-section">
        <h3 className="subsection-header">Saving Throws</h3>
        <div className="saves-grid">
          {Object.entries(saves).map(([key, saveData]) => (
            <div key={key} className="save-item">
              <label htmlFor={`${key}SaveTotal`} className="form-label">{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
              <input 
                type="number" 
                id={`${key}SaveTotal`} 
                value={saveData.total || 0} 
                onChange={(e) => handleSaveChange(key, 'total', e.target.value)} 
                className="form-input"
                placeholder="Total"
              />
              {/* TODO: Add inputs for base, abilityMod (display only), magic, misc, temp */}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export default CoreStats; 