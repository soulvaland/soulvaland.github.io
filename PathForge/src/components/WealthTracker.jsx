import React from 'react';
import './WealthTracker.css';
import Card from './Card';
import { useCharacter } from '../contexts/CharacterContext';

function WealthTracker() {
  const { character, setWealth } = useCharacter();
  const wealth = character.wealth || { gp: 0, sp: 0, cp: 0 };

  const handleWealthChange = (currency, value) => {
    const newWealth = {
      ...wealth,
      [currency]: parseInt(value, 10) || 0,
    };
    setWealth(newWealth);
  };

  return (
    <Card title="Wealth">
      <div className="wealth-inputs">
        <div className="currency-item">
          <label htmlFor="gp" className="form-label">GP:</label>
          <input type="number" id="gp" value={wealth.gp} onChange={(e) => handleWealthChange('gp', e.target.value)} className="form-input" />
        </div>
        <div className="currency-item">
          <label htmlFor="sp" className="form-label">SP:</label>
          <input type="number" id="sp" value={wealth.sp} onChange={(e) => handleWealthChange('sp', e.target.value)} className="form-input" />
        </div>
        <div className="currency-item">
          <label htmlFor="cp" className="form-label">CP:</label>
          <input type="number" id="cp" value={wealth.cp} onChange={(e) => handleWealthChange('cp', e.target.value)} className="form-input" />
        </div>
      </div>
    </Card>
  );
}

export default WealthTracker; 