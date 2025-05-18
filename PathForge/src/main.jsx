import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // We'll create this next for global styles
import './styles/common.css' // Import common styles
import { CharacterProvider } from './contexts/CharacterContext' // Import CharacterProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CharacterProvider> {/* Wrap App with CharacterProvider */}
      <App />
    </CharacterProvider>
  </React.StrictMode>,
) 