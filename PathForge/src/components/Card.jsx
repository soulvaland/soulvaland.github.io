import React, { useState } from 'react';
import './Card.css';

function Card({ title, children, initialCollapsed = false, showToggleButton = true }) {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`card-container ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="card-header">
        <h2 className="card-title">{title}</h2>
        {showToggleButton && (
          <button onClick={toggleCollapse} className="card-toggle-button">
            {isCollapsed ? '+' : '−'} {/* Simple toggle icons */}
          </button>
        )}
      </div>
      {!isCollapsed && (
        <div className="card-content">
          {children}
        </div>
      )}
    </div>
  );
}

export default Card; 