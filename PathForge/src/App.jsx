import React from 'react';
import './App.css'; // For App-specific styles
import BasicAttributes from './components/BasicAttributes'; // Import the new component
import CharacterImage from './components/CharacterImage'; // Import CharacterImage
import CoreStats from './components/CoreStats'; // Import CoreStats
import WealthTracker from './components/WealthTracker'; // Import WealthTracker
import Skills from './components/Skills'; // Import Skills
import Feats from './components/Feats'; // Import Feats
import TraitsDrawbacks from './components/TraitsDrawbacks'; // Import TraitsDrawbacks
import Inventory from './components/Inventory'; // Import Inventory
import Languages from './components/Languages'; // Import Languages
import CharacterBio from './components/CharacterBio'; // Import CharacterBio
import Spellbook from './components/Spellbook'; // Import Spellbook
import Auth from './components/Auth'; // Import Auth component
import CharacterManagement from './components/CharacterManagement'; // Import CharacterManagement

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Pathfinder 1e Character Sheet</h1>
        <Auth />
      </header>
      <main className="app-main">
        <div className="layout-grid">
          <div className="main-column">
            <BasicAttributes />
            <CoreStats />
            <Skills />
            <Feats />
            <TraitsDrawbacks />
            <Inventory />
            <Languages />
            <Spellbook />
          </div>
          <div className="sidebar-column">
            <CharacterImage />
            <CharacterManagement />
            <WealthTracker />
            <CharacterBio />
          </div>
        </div>
      </main>
      <footer className="app-footer">
        <p>Neo-arcane Minimalism Design</p>
      </footer>
    </div>
  );
}

export default App; 