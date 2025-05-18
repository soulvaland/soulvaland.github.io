import React, { useState, useEffect } from 'react';
import './Skills.css';
import Card from './Card';
import { useCharacter } from '../contexts/CharacterContext';

// TODO: Move to data/skills.json and import, also get ability scores from CoreStats props
const initialSkillsData = [
  { id: 'acrobatics', name: 'Acrobatics', ability: 'dexterity', ranks: 0, miscMod: 0, classSkill: false },
  { id: 'appraise', name: 'Appraise', ability: 'intelligence', ranks: 0, miscMod: 0, classSkill: false },
  { id: 'bluff', name: 'Bluff', ability: 'charisma', ranks: 0, miscMod: 0, classSkill: false },
  { id: 'climb', name: 'Climb', ability: 'strength', ranks: 0, miscMod: 0, classSkill: false },
  { id: 'diplomacy', name: 'Diplomacy', ability: 'charisma', ranks: 0, miscMod: 0, classSkill: false },
  { id: 'disableDevice', name: 'Disable Device', ability: 'dexterity', ranks: 0, miscMod: 0, classSkill: false, trainedOnly: true },
  { id: 'perception', name: 'Perception', ability: 'wisdom', ranks: 0, miscMod: 0, classSkill: false },
  { id: 'stealth', name: 'Stealth', ability: 'dexterity', ranks: 0, miscMod: 0, classSkill: false },
  { id: 'spellcraft', name: 'Spellcraft', ability: 'intelligence', ranks: 0, miscMod: 0, classSkill: false, trainedOnly: true },
  { id: 'useMagicDevice', name: 'Use Magic Device', ability: 'charisma', ranks: 0, miscMod: 0, classSkill: false, trainedOnly: true },
];

// Helper to calculate modifier
const calculateAbilityModifier = (score) => Math.floor(((score || 0) - 10) / 2);

function Skills() {
  const { character, setSkills, updateCharacterField } = useCharacter();
  const skills = character.skills || [];
  const abilityScores = character.abilityScores || {};

  const [customSkillName, setCustomSkillName] = useState('');
  const [customSkillAbility, setCustomSkillAbility] = useState('strength'); // Default for new custom skill

  const handleSkillChange = (id, field, value) => {
    const updatedSkills = skills.map(skill => 
      skill.id === id ? { ...skill, [field]: typeof value === 'boolean' ? value : parseInt(value, 10) || 0 } : skill
    );
    setSkills(updatedSkills);
  };

  const calculateTotal = (skill) => {
    const abilityScoreValue = (abilityScores[skill.ability] && abilityScores[skill.ability].base) || 0;
    let total = (skill.ranks || 0) + calculateAbilityModifier(abilityScoreValue) + (skill.miscMod || 0);
    if (skill.classSkill && (skill.ranks || 0) > 0) {
      total += 3;
    }
    return total;
  };

  const addCustomSkill = () => {
    if (!customSkillName.trim()) return;
    const newSkill = {
      id: customSkillName.toLowerCase().replace(/\s+/g, '-') + Date.now(), 
      name: customSkillName,
      ability: customSkillAbility,
      ranks: 0,
      miscMod: 0,
      classSkill: false,
      isCustom: true,
      trainedOnly: false, // Default for custom, user can specify if needed later
    };
    setSkills([...skills, newSkill]);
    setCustomSkillName('');
    setCustomSkillAbility('strength'); // Reset to default
  };

  return (
    <Card title="Skills">
      <div className="skills-list">
        <div className="skills-header-row">
          <span className="skill-name-header">Skill Name</span>
          <span className="skill-ability-header">Ability</span>
          <span className="skill-total-header">Total</span>
          <span className="skill-ranks-header">Ranks</span>
          <span className="skill-mod-header">Ability Mod</span>
          <span className="skill-misc-header">Misc Mod</span>
          <span className="skill-cs-header">Class Skill</span>
        </div>
        {skills.map(skill => {
          const abilityScoreValue = (abilityScores[skill.ability] && abilityScores[skill.ability].base) || 0;
          const abilityMod = calculateAbilityModifier(abilityScoreValue);
          return (
            <div key={skill.id} className="skill-row">
              <span className="skill-name">{skill.name}{skill.trainedOnly ? ' (T)' : ''}</span>
              <span className="skill-ability">{skill.ability ? skill.ability.substring(0,3).toUpperCase() : 'N/A'}</span>
              <span className="skill-total">{calculateTotal(skill)}</span>
              <input 
                type="number" 
                className="skill-ranks-input form-input"
                value={skill.ranks || 0}
                onChange={(e) => handleSkillChange(skill.id, 'ranks', e.target.value)}
              />
              <span className="skill-mod">{abilityMod}</span>
              <input 
                type="number" 
                className="skill-misc-input form-input"
                value={skill.miscMod || 0}
                onChange={(e) => handleSkillChange(skill.id, 'miscMod', e.target.value)}
              />
              <input 
                type="checkbox" 
                className="skill-cs-checkbox"
                checked={skill.classSkill || false}
                onChange={(e) => handleSkillChange(skill.id, 'classSkill', e.target.checked)}
              />
            </div>
          );
        })}
      </div>
      <div className="add-custom-skill-section">
        <h4>Add Custom Skill</h4>
        <input 
          type="text" 
          placeholder="Skill Name"
          className="form-input"
          value={customSkillName}
          onChange={(e) => setCustomSkillName(e.target.value)}
        />
        <select value={customSkillAbility} onChange={(e) => setCustomSkillAbility(e.target.value)} className="form-select">
          {Object.keys(abilityScores).map(abilityKey => (
            <option key={abilityKey} value={abilityKey}>{abilityKey.charAt(0).toUpperCase() + abilityKey.slice(1)}</option>
          ))}
        </select>
        <button onClick={addCustomSkill} className="action-button hex-button">Add Skill</button>
      </div>
    </Card>
  );
}

export default Skills; 