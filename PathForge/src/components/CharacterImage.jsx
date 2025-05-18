import React, { useState } from 'react';
import './CharacterImage.css';
import Card from './Card';
import { useCharacter } from '../contexts/CharacterContext';

function CharacterImage() {
  const { character, setImageUrl } = useCharacter();
  const imageUrl = character.imageUrl || '';
  
  const [inputUrl, setInputUrl] = useState(''); // Local state for the input field

  const handleSetImage = () => {
    if (inputUrl.trim() && (inputUrl.startsWith('http://') || inputUrl.startsWith('https://'))) {
      setImageUrl(inputUrl.trim());
    }
    // Optionally clear inputUrl or provide feedback
  };

  // Effect to update inputUrl if character.imageUrl changes from elsewhere (e.g. load)
  React.useEffect(() => {
    setInputUrl(imageUrl);
  }, [imageUrl]);

  return (
    <Card title="Character Portrait" initialCollapsed={true}>
      <div className="character-image-controls">
        <input 
          type="text" 
          placeholder="Image URL (http://... or https://...)"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          className="form-input"
        />
        <button onClick={handleSetImage} className="action-button">Set Image</button>
      </div>
      {imageUrl ? (
        <div className="image-display-area">
          <img src={imageUrl} alt="Character Portrait" className="character-portrait-img" />
        </div>
      ) : (
        <p className="no-image-message info-text">No image set. Paste a URL above.</p>
      )}
    </Card>
  );
}

export default CharacterImage; 