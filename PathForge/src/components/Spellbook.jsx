import React, { useState } from 'react';
import './Spellbook.css';
import Card from './Card';
import { useCharacter } from '../contexts/CharacterContext';

const spellLevels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

// Placeholder for spell schools - could be moved to data file
const spellSchools = [
  'Abjuration', 'Conjuration', 'Divination', 'Enchantment',
  'Evocation', 'Illusion', 'Necromancy', 'Transmutation', 'Universal'
];

function Spellbook() {
  const { character, setSpellcastingData, setSpellsByLevel } = useCharacter();
  const spellcasting = character.spellcasting || {};
  const spellbook = spellcasting.spellbook || {}; // This is spellsByLevel

  // Local state for the "Add New Spell" form
  const [newSpellForm, setNewSpellForm] = useState({
    name: '', 
    level: 0, 
    school: spellSchools[0], 
    description: '', 
    prepared: false
  });

  const toggleSpellcasting = () => {
    setSpellcastingData('enabled', !spellcasting.enabled);
  };

  const handleNewSpellFormChange = (field, value) => {
    setNewSpellForm(prev => ({ 
        ...prev, 
        [field]: field === 'level' ? parseInt(value,10) : value 
    }));
  };

  const addSpell = () => {
    if (!newSpellForm.name.trim()) return;
    const spellToAdd = {
      id: newSpellForm.name.toLowerCase().replace(/\s+/g, '-') + Date.now(),
      ...newSpellForm
    };
    
    const currentLevelSpells = spellbook[newSpellForm.level] || [];
    const updatedLevelSpells = [...currentLevelSpells, spellToAdd];
    
    // Create a new spellbook object to ensure context updates correctly
    const updatedSpellbook = {
        ...spellbook,
        [newSpellForm.level]: updatedLevelSpells
    };
    setSpellsByLevel(updatedSpellbook); // Update the entire spellbook in context

    setNewSpellForm({ name: '', level: 0, school: spellSchools[0], description: '', prepared: false }); 
  };

  const removeSpell = (level, id) => {
    const currentLevelSpells = spellbook[level] || [];
    const updatedLevelSpells = currentLevelSpells.filter(spell => spell.id !== id);
    const updatedSpellbook = {
        ...spellbook,
        [level]: updatedLevelSpells
    };
    setSpellsByLevel(updatedSpellbook);
  };

  const toggleSpellPrepared = (level, id) => {
    const currentLevelSpells = spellbook[level] || [];
    const updatedLevelSpells = currentLevelSpells.map(spell => 
        spell.id === id ? { ...spell, prepared: !spell.prepared } : spell
    );
    const updatedSpellbook = {
        ...spellbook,
        [level]: updatedLevelSpells
    };
    setSpellsByLevel(updatedSpellbook);
  };

  if (!spellcasting.enabled) {
    return (
      <Card title="Spellcasting">
        <button onClick={toggleSpellcasting} className="action-button enable-spellcasting-button">
          Enable Spellcasting
        </button>
      </Card>
    );
  }

  return (
    <Card title="Spellbook">
      <div className="spellbook-controls">
        {/* TODO: Add inputs for Caster Level, Spellcasting Ability, etc. from character.spellcasting */}
        {/* Example: <input value={spellcasting.casterLevel} onChange={e => setSpellcastingData('casterLevel', e.target.value)} /> */}
        <button onClick={toggleSpellcasting} className="action-button disable-spellcasting-button">Disable Spellcasting</button>
      </div>

      <div className="add-spell-form">
        <h4>Add New Spell</h4>
        <input type="text" placeholder="Spell Name" value={newSpellForm.name} onChange={e => handleNewSpellFormChange('name', e.target.value)} className="form-input" />
        <select value={newSpellForm.level} onChange={e => handleNewSpellFormChange('level', e.target.value)} className="form-select">
          {spellLevels.map(lvl => <option key={lvl} value={lvl}>Level {lvl}</option>)}
        </select>
        <select value={newSpellForm.school} onChange={e => handleNewSpellFormChange('school', e.target.value)} className="form-select">
          {spellSchools.map(sch => <option key={sch} value={sch}>{sch}</option>)}
        </select>
        <textarea placeholder="Brief Description / Notes" value={newSpellForm.description} onChange={e => handleNewSpellFormChange('description', e.target.value)} rows={3} className="form-textarea"></textarea>
        <button onClick={addSpell} className="action-button">Add Spell</button>
      </div>

      {spellLevels.map(level => {
        const spellsForLevel = spellbook[level] || [];
        // Only render the level section if there are spells or it's the level being added to (for UX)
        if (spellsForLevel.length > 0 || newSpellForm.level === level) {
          return (
            <div key={level} className="spell-level-section">
              <h3 className="subsection-header">Level {level} Spells</h3>
              {/* TODO: Add spell slots tracking for this level from character.spellcasting.spellsPerDay[level] */}
              <div className="spells-list">
                {spellsForLevel.length > 0 && (
                    <div className="spell-list-header">
                        <span>Name</span>
                        <span>School</span>
                        <span>Description</span>
                        <span>Prepared</span>
                        <span>Actions</span>
                    </div>
                )}
                {spellsForLevel.map(spell => (
                  <div key={spell.id} className={`spell-item ${spell.prepared ? 'prepared' : ''}`}>
                    <span className="spell-name">{spell.name}</span>
                    <span className="spell-school">{spell.school}</span>
                    <p className="spell-description">{spell.description}</p>
                    <input type="checkbox" checked={spell.prepared || false} onChange={() => toggleSpellPrepared(level, spell.id)} />
                    <button onClick={() => removeSpell(level, spell.id)} className="remove-button">×</button>
                  </div>
                ))}
                {spellsForLevel.length === 0 && newSpellForm.level === level && (
                    <p className="info-text">No spells yet for this level. Add one above!</p>
                )}
              </div>
            </div>
          );
        }
        return null;
      })}
    </Card>
  );
}

export default Spellbook; 