import React, { useState } from 'react';
import './TraitsDrawbacks.css'; // Create this CSS file next
import Card from './Card';
import { useCharacter } from '../contexts/CharacterContext';

function TraitsDrawbacks() {
  const { character, setTraits, setDrawbacks } = useCharacter();
  const traits = character.traits || [];
  const drawbacks = character.drawbacks || [];
  
  const [newTraitName, setNewTraitName] = useState('');
  const [newTraitDescription, setNewTraitDescription] = useState('');

  const [newDrawbackName, setNewDrawbackName] = useState('');
  const [newDrawbackDescription, setNewDrawbackDescription] = useState('');

  const addItem = (type) => {
    let newItemList, setNewItemList, name, setName, description, setDescription;

    if (type === 'trait') {
      if (!newTraitName.trim()) return;
      newItemList = traits;
      setNewItemList = setTraits;
      name = newTraitName;
      setName = setNewTraitName;
      description = newTraitDescription;
      setDescription = setNewTraitDescription;
    } else if (type === 'drawback') {
      if (!newDrawbackName.trim()) return;
      newItemList = drawbacks;
      setNewItemList = setDrawbacks;
      name = newDrawbackName;
      setName = setNewDrawbackName;
      description = newDrawbackDescription;
      setDescription = setNewDrawbackDescription;
    } else {
      return;
    }

    const newItem = {
      id: name.toLowerCase().replace(/\s+/g, '-') + Date.now(),
      name: name,
      description: description,
    };
    setNewItemList([...newItemList, newItem]);
    setName('');
    setDescription('');
  };

  const removeItem = (type, id) => {
    if (type === 'trait') {
      setTraits(traits.filter(item => item.id !== id));
    } else if (type === 'drawback') {
      setDrawbacks(drawbacks.filter(item => item.id !== id));
    }
  };

  const renderList = (items, type) => {
    if (!items || items.length === 0) return <p className="info-text">No {type}s added yet.</p>;
    return items.map(item => (
      <div key={item.id} className={`${type}-item item-entry`}>
        <div className="item-info">
          <strong className="item-name">{item.name}</strong>
          {item.description && <p className="item-description">{item.description}</p>}
        </div>
        <button onClick={() => removeItem(type, item.id)} className="remove-button">×</button>
      </div>
    ));
  };

  return (
    <Card title="Traits & Drawbacks">
      <div className="traits-section item-section">
        <h3 className="subsection-header">Traits</h3>
        <div className="add-item-form">
          <input 
            type="text" 
            placeholder="Trait Name"
            value={newTraitName}
            onChange={(e) => setNewTraitName(e.target.value)}
            className="form-input"
          />
          <textarea 
            placeholder="Trait Description (optional)"
            value={newTraitDescription}
            onChange={(e) => setNewTraitDescription(e.target.value)}
            className="form-textarea"
          />
          <button onClick={() => addItem('trait')} className="action-button">Add Trait</button>
        </div>
        <div className="items-list">
          {renderList(traits, 'trait')}
        </div>
      </div>

      <div className="drawbacks-section item-section">
        <h3 className="subsection-header">Drawbacks</h3>
        <div className="add-item-form">
          <input 
            type="text" 
            placeholder="Drawback Name"
            value={newDrawbackName}
            onChange={(e) => setNewDrawbackName(e.target.value)}
            className="form-input"
          />
          <textarea 
            placeholder="Drawback Description (optional)"
            value={newDrawbackDescription}
            onChange={(e) => setNewDrawbackDescription(e.target.value)}
            className="form-textarea"
          />
          <button onClick={() => addItem('drawback')} className="action-button">Add Drawback</button>
        </div>
        <div className="items-list">
          {renderList(drawbacks, 'drawback')}
        </div>
      </div>
    </Card>
  );
}

export default TraitsDrawbacks; 