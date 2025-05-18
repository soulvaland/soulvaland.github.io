import React, { useState } from 'react';
import './Inventory.css';
import Card from './Card';
import { useCharacter } from '../contexts/CharacterContext';

function Inventory() {
  const { character, setInventory, updateCharacterField } = useCharacter();
  const items = character.inventory || [];

  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemWeight, setItemWeight] = useState(0);
  const [itemDescription, setItemDescription] = useState('');

  // TODO: Add sections for Weapons, Armor, Wondrous Items, Gear later
  // TODO: Calculate total weight and encumbrance

  const addItem = () => {
    if (!itemName.trim()) return;
    const newItem = {
      id: itemName.toLowerCase().replace(/\s+/g, '-') + Date.now(),
      name: itemName,
      quantity: parseInt(itemQuantity, 10) || 1,
      weight: parseFloat(itemWeight) || 0,
      description: itemDescription,
    };
    const updatedItems = [...items, newItem];
    setInventory(updatedItems);
    // Recalculate and update total weight in context if needed, or do it in a useEffect
    updateCharacterField('totalWeight', updatedItems.reduce((acc, item) => acc + (item.quantity * item.weight), 0));

    setItemName('');
    setItemQuantity(1);
    setItemWeight(0);
    setItemDescription('');
  };

  const removeItem = (id) => {
    const updatedItems = items.filter(item => item.id !== id);
    setInventory(updatedItems);
    updateCharacterField('totalWeight', updatedItems.reduce((acc, item) => acc + (item.quantity * item.weight), 0));
  };

  // Total weight is now directly from character.totalWeight, calculated on update
  const totalWeight = character.totalWeight || 0;

  return (
    <Card title="Inventory">
      <div className="add-item-section">
        <h4>Add New Item</h4>
        <div className="item-input-row">
          <input 
            type="text" 
            placeholder="Item Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="item-name-input form-input"
          />
          <input 
            type="number" 
            placeholder="Qty"
            value={itemQuantity}
            min="1"
            onChange={(e) => setItemQuantity(e.target.value)}
            className="item-quantity-input form-input"
          />
          <input 
            type="number" 
            placeholder="Wt (each)"
            value={itemWeight}
            min="0"
            step="0.1"
            onChange={(e) => setItemWeight(e.target.value)}
            className="item-weight-input form-input"
          />
        </div>
        <textarea
          placeholder="Item Notes/Description (optional)"
          value={itemDescription}
          onChange={(e) => setItemDescription(e.target.value)}
          className="item-description-input form-textarea"
        />
        <button onClick={addItem} className="action-button">Add Item</button>
      </div>

      <div className="items-list-container">
        <div className="inventory-header-row">
          <span className="inv-name">Name</span>
          <span className="inv-qty">Qty</span>
          <span className="inv-weight">Weight (each)</span>
          <span className="inv-total-weight">Total Wt.</span>
          <span className="inv-actions">Actions</span>
        </div>
        {items.length === 0 && <p className="empty-inventory-message info-text">Inventory is empty.</p>}
        {items.map(item => (
          <div key={item.id} className="inventory-item-row">
            <span className="inv-name">{item.name}</span>
            <span className="inv-qty">{item.quantity}</span>
            <span className="inv-weight">{(item.weight || 0).toFixed(1)} lbs</span>
            <span className="inv-total-weight">{((item.quantity || 0) * (item.weight || 0)).toFixed(1)} lbs</span>
            <div className="inv-actions">
              <button onClick={() => removeItem(item.id)} className="remove-button">×</button>
            </div>
            {item.description && <div className="item-full-description">{item.description}</div>}
          </div>
        ))}
      </div>
      <div className="total-weight-section">
        <strong>Total Weight Carried: {totalWeight.toFixed(1)} lbs</strong>
        {/* TODO: Display encumbrance level based on strength and totalWeight */}
      </div>
    </Card>
  );
}

export default Inventory; 