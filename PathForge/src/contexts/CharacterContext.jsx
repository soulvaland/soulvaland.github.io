import React, { createContext, useState, useEffect, useContext } from 'react';
import { initialCharacterData } from '../data/initialCharacterState';
import { db, auth } from '../firebaseConfig';
import { doc, setDoc, getDoc, serverTimestamp, collection, query, where, getDocs, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';

const CharacterContext = createContext();

export const useCharacter = () => useContext(CharacterContext);

export const CharacterProvider = ({ children }) => {
  const [character, setCharacter] = useState(JSON.parse(JSON.stringify(initialCharacterData))); // Deep copy
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // For initial load or character switch
  const [characterId, setCharacterId] = useState(null); // Currently active character ID
  const [availableCharacters, setAvailableCharacters] = useState([]); // List of characters for the user

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        // User logged out, reset character data and list
        setCharacter(JSON.parse(JSON.stringify(initialCharacterData)));
        setCharacterId(null);
        setAvailableCharacters([]);
        setLoading(false);
      } else {
        // User logged in, fetch their characters
        fetchUserCharacters(currentUser.uid);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const fetchUserCharacters = async (uid) => {
    setLoading(true);
    try {
      const charactersRef = collection(db, "characters");
      const q = query(charactersRef, where("userId", "==", uid));
      const querySnapshot = await getDocs(q);
      const chars = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAvailableCharacters(chars);
      if (chars.length > 0) {
        // Optionally, load the first character by default or a last-used one
        // For now, we'll wait for explicit load or new character creation
        // loadCharacter(chars[0].id);
        setLoading(false);
      } else {
        setCharacter(JSON.parse(JSON.stringify(initialCharacterData))); // No chars, reset to initial
        setCharacterId(null);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching user characters: ", error);
      setLoading(false);
    }
  };
  
  // Generalized update function
  const updateCharacterField = (path, value) => {
    setCharacter(prevChar => {
      const newChar = { ...prevChar };
      let currentLevel = newChar;
      const fields = path.split('.');
      fields.forEach((field, index) => {
        if (index === fields.length - 1) {
          currentLevel[field] = value;
        } else {
          if (!currentLevel[field]) currentLevel[field] = {}; // Create intermediate objects if they don't exist
          currentLevel = currentLevel[field];
        }
      });
      return newChar;
    });
  };

  // TODO: Specific updater functions for complex fields like arrays (skills, feats, inventory)
  // For example, addSkill, removeSkill, updateSkillRank, etc.

  const saveCharacter = async () => {
    if (!user) {
      console.error("User not logged in. Cannot save character.");
      // TODO: Prompt login
      return;
    }
    if (!character.characterName.trim()) {
        console.error("Character name is required to save.");
        // TODO: Notify user
        return;
    }

    setLoading(true);
    let idToSave = characterId;
    if (!idToSave) { // New character
        idToSave = doc(collection(db, "characters")).id; // Generate new ID
    }

    const characterToSave = {
      ...character,
      userId: user.uid,
      characterId: idToSave, // Ensure characterId is part of the document
      lastUpdated: serverTimestamp(),
    };

    try {
      await setDoc(doc(db, "characters", idToSave), characterToSave);
      setCharacter(characterToSave); // Update local state with serverTimestamp potentially
      setCharacterId(idToSave); // Ensure characterId is set for future saves
      console.log("Character saved with ID: ", idToSave);
      // Refresh character list if it was a new character
      if (!characterId) fetchUserCharacters(user.uid);
    } catch (error) {
      console.error("Error saving character: ", error);
      // TODO: Display error to user
    } finally {
      setLoading(false);
    }
  };

  const loadCharacter = async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const characterDocRef = doc(db, "characters", id);
      const docSnap = await getDoc(characterDocRef);
      if (docSnap.exists()) {
        const loadedChar = { ...initialCharacterData, ...docSnap.data(), characterId: docSnap.id };
        setCharacter(loadedChar);
        setCharacterId(docSnap.id);
        console.log("Character loaded: ", loadedChar.characterName);
      } else {
        console.log("No such character document!");
        // Optionally reset to initial state or handle error
      }
    } catch (error) {
      console.error("Error loading character: ", error);
    } finally {
      setLoading(false);
    }
  };

  const createNewCharacter = () => {
    setCharacter(JSON.parse(JSON.stringify(initialCharacterData)));
    setCharacterId(null); // Indicate it's a new, unsaved character
    console.log("New character sheet initialized.");
  };

  // Value provided to consumers of the context
  const contextValue = {
    character,
    loading,
    user,
    characterId,
    availableCharacters,
    updateCharacterField,
    saveCharacter,
    loadCharacter,
    createNewCharacter,
    fetchUserCharacters, // Expose to allow manual refresh if needed
    setAbilityScores: (scores) => updateCharacterField('abilityScores', scores), // Example specific updater
    setSkills: (skills) => updateCharacterField('skills', skills),
    // Add more specific setters here based on component needs
    setBasicAttribute: (field, value) => updateCharacterField(field, value), // For top-level basic attributes
    setHp: (hpData) => updateCharacterField('hp', hpData),
    setAc: (acData) => updateCharacterField('ac', acData),
    setSaves: (saveData) => updateCharacterField('saves', saveData),
    setWealth: (wealthData) => updateCharacterField('wealth', wealthData),
    setFeats: (feats) => updateCharacterField('feats', feats),
    setTraits: (traits) => updateCharacterField('traits', traits),
    setDrawbacks: (drawbacks) => updateCharacterField('drawbacks', drawbacks),
    setInventory: (items) => updateCharacterField('inventory', items),
    setLanguages: (languages) => updateCharacterField('languages', languages),
    setBio: (field, value) => updateCharacterField(`bio.${field}`, value),
    setImageUrl: (url) => updateCharacterField('imageUrl', url),
    setSpellcastingData: (field, value) => updateCharacterField(`spellcasting.${field}`, value),
    setSpellbookByLevel: (level, spells) => updateCharacterField(`spellcasting.spellbook.${level}`, spells),
    setSpellsByLevel: (allSpellsByLevel) => updateCharacterField('spellcasting.spellbook', allSpellsByLevel), // For Spellbook.jsx
  };

  return (
    <CharacterContext.Provider value={contextValue}>
      {children}
    </CharacterContext.Provider>
  );
}; 