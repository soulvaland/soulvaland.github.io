import React from 'react'; // Removed useState
import './BasicAttributes.css';
import Card from './Card';
import { useCharacter } from '../contexts/CharacterContext'; // Import useCharacter

function BasicAttributes() {
  const { character, setBasicAttribute } = useCharacter(); // Use context

  // Fields directly on character object root for this component
  const fields = [
    { id: 'characterName', label: 'Name', type: 'text' },
    { id: 'alignment', label: 'Alignment', type: 'text' },
    { id: 'characterClass', label: 'Class(es)', type: 'text' },
    { id: 'level', label: 'Level', type: 'number', min: 1 },
    { id: 'deity', label: 'Deity', type: 'text' },
    { id: 'age', label: 'Age', type: 'text' },
    { id: 'gender', label: 'Gender', type: 'text' },
    { id: 'height', label: 'Height', type: 'text' },
    { id: 'hairColor', label: 'Hair Color', type: 'text' },
    { id: 'eyeColor', label: 'Eye Color', type: 'text' },
  ];

  return (
    <Card title="Basic Attributes" showToggleButton={false}>
      <div className="attributes-grid">
        {fields.map(field => (
          <div key={field.id} className="attribute-item">
            <label htmlFor={field.id} className="form-label">{field.label}:</label>
            <input 
              type={field.type}
              id={field.id}
              value={character[field.id] || (field.type === 'number' ? 0 : '')} 
              onChange={(e) => setBasicAttribute(field.id, field.type === 'number' ? parseInt(e.target.value, 10) || 0 : e.target.value)}
              min={field.min} // For number types
              className="form-input" 
            />
          </div>
        ))}
      </div>
    </Card>
  );
}

export default BasicAttributes; 