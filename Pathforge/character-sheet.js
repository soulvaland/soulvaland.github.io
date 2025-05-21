// Firebase App (the core Firebase SDK) is always required and must be listed first
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, onSnapshot, collection, addDoc, deleteDoc, updateDoc, query, where, getDocs, serverTimestamp, setLogLevel } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// --- Configuration & Global Variables ---
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : { apiKey: "YOUR_API_KEY", authDomain: "YOUR_AUTH_DOMAIN", projectId: "YOUR_PROJECT_ID" }; // Replace with your actual config if not in Canvas
const appId = typeof __app_id !== 'undefined' ? __app_id : 'pathfinder-sheet-default';

let app;
let auth;
let db;
let userId;
let isOwner = false;
let characterSheetUnsubscribe = null; // For Firestore listener

// --- Default Character Data Structure ---
let characterData = {
    overview: {
        name: "New Character",
        classLevel: "Level 1",
        alignment: "True Neutral",
        deity: "",
        age: "",
        gender: "",
        height: "",
        weight: "",
        hairColor: "",
        eyeColor: "",
        imageUrl: "https://placehold.co/128x128/1a2532/93acc8?text=Char"
    },
    attributes: {
        strength: { score: 10, modifier: "+0" },
        dexterity: { score: 10, modifier: "+0" },
        constitution: { score: 10, modifier: "+0" },
        intelligence: { score: 10, modifier: "+0" },
        wisdom: { score: 10, modifier: "+0" },
        charisma: { score: 10, modifier: "+0" }
    },
    keyStats: {
        hp: { current: 10, max: 10 },
        ac: 10,
        initiative: "+0",
        bab: "+0",
        speed: "30 ft",
        wealth: "0 GP",
        saves: { fortitude: "+0", reflex: "+0", will: "+0" },
        cmb: "+0",
        cmd: "10"
    },
    bio: {
        appearance: "",
        personality: "",
        background: ""
    },
    capabilities: {
        languages: ["Common"],
        traitsDrawbacks: []
    },
    skills: [
        { name: "Perception", ability: "Wis", totalBonus: "+0", ranks: 0, miscBonus: 0, isClassSkill: false, isCustom: false },
        // Add more Pathfinder default skills here
    ],
    feats: [],
    spellcasting: {
        enabled: false,
        casterClass: "",
        casterLevel: "0",
        concentration: "+0",
        spellsPerDay: {}, // e.g. { level0: 4, level1: 2 }
        spellsKnown: [], // e.g. { level: 1, name: "Magic Missile", prepared: 0, uses: 0 }
        spellSaveDC: {} // e.g. { level0: 10, level1: 11 }
    },
    inventory: {
        money: { pp: 0, gp: 0, sp: 0, cp: 0 },
        items: [] // e.g. { name: "Longsword", quantity: 1, weight: 4, notes: "Masterwork" }
    },
    notes: "",
    createdAt: null,
    updatedAt: null,
};

// --- DOM Ready ---
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    setupEventListeners();
});

// --- Initialization ---
async function initApp() {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        setLogLevel('debug'); // Optional: for Firestore logging
        console.log("Firebase Initialized. App ID:", appId);

        onAuthStateChanged(auth, async (user) => {
            if (user) {
                userId = user.uid;
                console.log("User is signed in:", userId);
                // For this app, assume the logged-in user is the owner of *their* sheet
                isOwner = true; 
                document.body.classList.add('is-owner'); // Add class for owner-specific UI
                loadCharacterData();
            } else {
                console.log("User is signed out or anonymous.");
                userId = `anon-${crypto.randomUUID()}`; // Or handle public view based on URL param
                isOwner = false; // For anonymous, they can't save persistently to a user account
                document.body.classList.remove('is-owner');
                // For a shared link, you'd parse URL for a charId and load that publicly
                // For now, anonymous users will get a local, non-persistent sheet with default data
                renderCharacterSheet(); // Render with default data
            }
        });

        // Attempt to sign in
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            console.log("Attempting to sign in with custom token...");
            try {
                await signInWithCustomToken(auth, __initial_auth_token);
            } catch (error) {
                console.error("Error signing in with custom token, trying anonymous:", error);
                await signInAnonymously(auth);
            }
        } else {
            console.log("No custom token, attempting anonymous sign in...");
            await signInAnonymously(auth);
        }

    } catch (error) {
        console.error("Error initializing Firebase:", error);
        displayMessage("Error initializing. Please try again later.", "error");
    }
}

// --- Data Handling ---
async function loadCharacterData() {
    if (!userId || !isOwner) { // Only load for authenticated owners for now
        console.log("Not an owner or no userId, rendering default sheet.");
        renderCharacterSheet(); // Render with default data if not owner or no specific sheet to load
        return;
    }

    const charSheetRef = doc(db, "artifacts", appId, "users", userId, "pathfinderSheet");
    
    // Detach any existing listener before attaching a new one
    if (characterSheetUnsubscribe) {
        characterSheetUnsubscribe();
    }

    characterSheetUnsubscribe = onSnapshot(charSheetRef, (docSnap) => {
        if (docSnap.exists()) {
            console.log("Character data loaded from Firestore:", docSnap.data());
            characterData = { ...characterData, ...docSnap.data() }; // Merge, prioritizing Firestore data
        } else {
            console.log("No character data found in Firestore for this user. Using default and saving.");
            // Save initial default data for a new owner
            characterData.createdAt = serverTimestamp();
            characterData.updatedAt = serverTimestamp();
            saveCharacterData(true); // Save the initial sheet
        }
        renderCharacterSheet();
    }, (error) => {
        console.error("Error listening to character data:", error);
        displayMessage("Error loading character data.", "error");
        renderCharacterSheet(); // Render with local/default data on error
    });
}

async function saveCharacterData(isInitialSave = false) {
    if (!userId || !isOwner) {
        console.warn("Cannot save: Not an owner or no userId.");
        if (!isInitialSave) displayMessage("Cannot save: You are not the owner or not signed in.", "warning");
        return;
    }
    
    const charSheetRef = doc(db, "artifacts", appId, "users", userId, "pathfinderSheet");
    try {
        characterData.updatedAt = serverTimestamp();
        if (isInitialSave && !characterData.createdAt) {
            characterData.createdAt = serverTimestamp();
        }
        await setDoc(charSheetRef, characterData, { merge: true });
        console.log("Character data saved to Firestore.");
        if (!isInitialSave) displayMessage("Character sheet saved!", "success");
    } catch (error) {
        console.error("Error saving character data:", error);
        if (!isInitialSave) displayMessage("Error saving character sheet.", "error");
    }
}

// --- Rendering ---
function renderCharacterSheet() {
    console.log("Rendering character sheet with data:", characterData);
    renderOverview();
    renderAttributes();
    renderKeyStats();
    renderBio();
    renderCapabilities();
    renderSkills();
    renderFeats();
    renderSpellcasting();
    // renderInventory(); // TODO
    // renderNotes(); // TODO

    // Ensure spellcasting section visibility is correct
    const spellcastingSection = document.getElementById('spellcasting-section');
    if (spellcastingSection) {
        spellcastingSection.style.display = characterData.spellcasting.enabled ? 'block' : 'none';
    }
}

function getElement(id) {
    const el = document.getElementById(id);
    // if (!el) console.warn(`Element with ID '${id}' not found.`);
    return el;
}

function setText(id, text) {
    const el = getElement(id);
    if (el) el.textContent = text || ""; // Handle null/undefined text
}

function setValue(id, value) {
    const el = getElement(id);
    if (el) el.value = value || "";
}

function renderOverview() {
    const overview = characterData.overview;
    setText('char-name', overview.name); // Assumes id="char-name" exists
    setText('char-class-level', overview.classLevel);
    setText('char-alignment', overview.alignment);
    // The HTML has a more complex structure for deity, age, etc.
    // Example for combined fields if your HTML is structured like the original prompt:
    const charDetails1 = getElement('char-details-line1'); // e.g., <p id="char-details-line1">
    if (charDetails1) charDetails1.innerHTML = `<strong>Deity:</strong> ${overview.deity || 'N/A'} <span class="mx-1">|</span> <strong>Age:</strong> ${overview.age || 'N/A'} <span class="mx-1">|</span> <strong>Gender:</strong> ${overview.gender || 'N/A'}`;
    
    const charImage = getElement('char-image-display'); // Assumes <div id="char-image-display" class="bg-center..." >
    if (charImage) charImage.style.backgroundImage = `url("${overview.imageUrl || 'https://placehold.co/128x128/1a2532/93acc8?text=Char'}")`;
}

function renderAttributes() {
    const attrs = characterData.attributes;
    for (const key in attrs) {
        setText(`attr-${key}-score`, attrs[key].score);
        setText(`attr-${key}-mod`, `(${attrs[key].modifier})`);
    }
}

function renderKeyStats() {
    const stats = characterData.keyStats;
    setText('stat-hp', `${stats.hp.current}/${stats.hp.max}`);
    setText('stat-ac', stats.ac);
    setText('stat-initiative', stats.initiative);
    setText('stat-bab', stats.bab);
    setText('stat-speed', stats.speed);
    setText('stat-wealth', stats.wealth);
    setText('stat-fortitude', stats.saves.fortitude);
    setText('stat-reflex', stats.saves.reflex);
    setText('stat-will', stats.saves.will);
    setText('stat-cmb', stats.cmb);
    setText('stat-cmd', stats.cmd);
}

function renderBio() {
    const bio = characterData.bio;
    // These should ideally be divs made contentEditable or textareas
    setText('bio-appearance-text', bio.appearance); 
    setText('bio-personality-text', bio.personality);
    setText('bio-background-text', bio.background);
}

function renderCapabilities() {
    const cap = characterData.capabilities;
    const langList = getElement('languages-list'); // Assumes <ul id="languages-list">
    if (langList) {
        langList.innerHTML = '';
        cap.languages.forEach(lang => {
            const li = document.createElement('li');
            li.className = lang.toLowerCase().includes("draconic") ? "accent-magic-glow" : "";
            li.textContent = lang;
            langList.appendChild(li);
        });
    }
    // Similar rendering for traits/drawbacks
}

function renderSkills() {
    const skillsContainer = getElement('skills-list-container'); // Assumes <div id="skills-list-container">
    if (skillsContainer) {
        skillsContainer.innerHTML = ''; // Clear existing skills
        characterData.skills.forEach(skill => {
            const p = document.createElement('p');
            p.innerHTML = `<strong class="accent-skill">${skill.name} (${skill.ability}):</strong> ${skill.totalBonus}`;
            // Add edit/delete buttons if needed
            skillsContainer.appendChild(p);
        });
    }
}
function renderFeats() {
    const featsList = getElement('feats-list-container'); // Assumes <ul id="feats-list-container">
    if (featsList) {
        featsList.innerHTML = '';
        characterData.feats.forEach(feat => {
            const li = document.createElement('li');
            li.innerHTML = `<strong class="text-[#e0e0e0]">${feat.name}:</strong> ${feat.description}`;
            featsList.appendChild(li);
        });
    }
}

function renderSpellcasting() {
    const spellSection = getElement('spellcasting-section');
    if (!spellSection) return;

    if (characterData.spellcasting.enabled) {
        spellSection.style.display = 'block';
        // Populate spellcasting details
        setText('spell-caster-level', `Caster Level: ${characterData.spellcasting.casterLevel || 'N/A'}`); // e.g. <p id="spell-caster-level">
        // ... render spells per day, spells known, etc.
        const spellsKnownList = getElement('spells-known-list'); // <ul id="spells-known-list">
        if (spellsKnownList) {
            spellsKnownList.innerHTML = '';
            characterData.spellcasting.spellsKnown.forEach(spell => {
                const li = document.createElement('li');
                li.className = "accent-magic-glow"; // Example styling
                li.textContent = `${spell.name} (Lvl ${spell.level})`;
                spellsKnownList.appendChild(li);
            });
        }
    } else {
        spellSection.style.display = 'none';
    }
}


// --- Event Listeners Setup ---
function setupEventListeners() {
    // Navigation
    const navSpellsBtn = getElement('nav-spells-btn'); // Assumes id="nav-spells-btn"
    if (navSpellsBtn) {
        navSpellsBtn.onclick = (e) => { // Override HTML onclick for better control
            e.preventDefault();
            toggleSpellcastingFeature();
        };
    }
    
    // Settings Button
    const settingsBtn = getElement('settings-btn');
    if (settingsBtn) settingsBtn.addEventListener('click', openSettingsModal);

    // Add Buttons (Example for Feats)
    const addFeatBtn = getElement('add-feat-btn');
    if (addFeatBtn) addFeatBtn.addEventListener('click', handleAddFeat);

    const addLanguageBtn = getElement('add-language-btn');
    if(addLanguageBtn) addLanguageBtn.addEventListener('click', handleAddLanguage);

    // Save Button (if you add a dedicated save button)
    const saveSheetBtn = getElement('save-sheet-btn');
    if(saveSheetBtn) saveSheetBtn.addEventListener('click', () => saveCharacterData(false));

    // Edit Character Name (Example of making text editable)
    const charNameEl = getElement('char-name');
    if (charNameEl && isOwner) { // Only owners can edit
        charNameEl.addEventListener('click', () => makeEditable(charNameEl, 'overview.name'));
    }
    // Add similar for other editable fields like bio sections
    const bioAppearance = getElement('bio-appearance-text');
    if (bioAppearance && isOwner) bioAppearance.addEventListener('click', () => makeEditable(bioAppearance, 'bio.appearance', true));
    // ... and for personality, background

    // Image Edit Button
    const editImageBtn = getElement('edit-image-btn');
    if (editImageBtn) editImageBtn.addEventListener('click', handleChangeImage);
}

// --- UI Interaction Functions ---

function toggleSpellcastingFeature() {
    if (!isOwner) {
        displayMessage("View only. Cannot change spellcasting status.", "info");
        // Still toggle visibility for viewer if data says it's enabled
        const spellcastingSection = document.getElementById('spellcasting-section');
        if (spellcastingSection) {
             spellcastingSection.style.display = characterData.spellcasting.enabled ? 'block' : 'none';
        }
        return;
    }
    characterData.spellcasting.enabled = !characterData.spellcasting.enabled;
    renderSpellcasting(); // Re-render the section which handles display style
    saveCharacterData();
}

function handleAddFeat() {
    if (!isOwner) { displayMessage("View only. Cannot add feats.", "info"); return; }
    const featName = prompt("Enter feat name:");
    if (featName) {
        const featDescription = prompt("Enter feat description:");
        characterData.feats.push({ name: featName, description: featDescription || "" });
        renderFeats();
        saveCharacterData();
    }
}

function handleAddLanguage() {
    if (!isOwner) { displayMessage("View only. Cannot add languages.", "info"); return; }
    const langName = prompt("Enter language name:");
    if (langName && !characterData.capabilities.languages.includes(langName)) {
        characterData.capabilities.languages.push(langName);
        renderCapabilities(); // Make sure this function re-renders the languages list
        saveCharacterData();
    } else if (langName) {
        displayMessage("Language already known.", "info");
    }
}

function handleChangeImage() {
    if (!isOwner) { displayMessage("View only. Cannot change image.", "info"); return; }
    const newImageUrl = prompt("Enter new image URL:", characterData.overview.imageUrl);
    if (newImageUrl) {
        characterData.overview.imageUrl = newImageUrl;
        renderOverview(); // Re-render overview to show new image
        saveCharacterData();
    }
}


function makeEditable(element, dataPath, isTextArea = false) {
    if (!isOwner) return; // Double check ownership

    const originalContent = element.textContent;
    element.classList.add('editing');
    
    let inputElement;
    if (isTextArea) {
        inputElement = document.createElement('textarea');
        inputElement.style.width = '100%';
        inputElement.style.minHeight = '80px';
        inputElement.style.backgroundColor = '#111922'; // Match theme
        inputElement.style.color = '#e0e0e0';
        inputElement.style.border = '1px solid #1873dc';
        inputElement.value = getNestedValue(characterData, dataPath);
    } else {
        inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.value = originalContent;
        inputElement.style.backgroundColor = '#111922';
        inputElement.style.color = '#e0e0e0';
        inputElement.style.border = '1px solid #1873dc';
        inputElement.style.width = `${Math.max(100, element.offsetWidth)}px`;
    }

    element.innerHTML = '';
    element.appendChild(inputElement);
    inputElement.focus();

    const saveChanges = () => {
        const newValue = inputElement.value;
        setNestedValue(characterData, dataPath, newValue);
        element.textContent = newValue; // Update display
        element.classList.remove('editing');
        // For bio text, we might need to re-render that specific part if it's more complex
        if (dataPath.startsWith('bio.')) renderBio(); 
        else if (dataPath.startsWith('overview.')) renderOverview();
        saveCharacterData();
        inputElement.removeEventListener('blur', saveChangesOnBlur);
        inputElement.removeEventListener('keydown', saveChangesOnEnter);
    };
    
    const saveChangesOnBlur = () => {
        // Timeout to allow click on potential save button within editor
        setTimeout(saveChanges, 100);
    };

    const saveChangesOnEnter = (e) => {
        if (e.key === 'Enter' && !isTextArea) { // For single line inputs
            saveChanges();
        } else if (e.key === 'Escape') {
            element.textContent = originalContent; // Revert
            element.classList.remove('editing');
            inputElement.removeEventListener('blur', saveChangesOnBlur);
            inputElement.removeEventListener('keydown', saveChangesOnEnter);
        }
    };

    inputElement.addEventListener('blur', saveChangesOnBlur);
    inputElement.addEventListener('keydown', saveChangesOnEnter);
}

// Helper to get/set nested values in characterData
function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

function setNestedValue(obj, path, value) {
    const parts = path.split('.');
    const last = parts.pop();
    const target = parts.reduce((acc, part) => acc[part] = acc[part] || {}, obj);
    target[last] = value;
}


// --- Modals (Basic Implementation) ---
// You'd need corresponding HTML for modals
function openSettingsModal() {
    // Example: Show a settings modal
    // const settingsModal = getElement('settings-modal');
    // if (settingsModal) settingsModal.style.display = 'flex';
    displayMessage("Settings modal would open here.", "info");
    // In a real settings modal, you might toggle features, change theme, etc.
    // Example: Toggle spellcasting enablement
    // const enableSpellsCheckbox = getElement('enable-spellcasting-checkbox');
    // if (enableSpellsCheckbox) enableSpellsCheckbox.checked = characterData.spellcasting.enabled;
}

// --- Utility: Display Messages ---
function displayMessage(message, type = "info") { // type can be info, success, warning, error
    const messageContainerId = 'global-message-container'; // Add this div to your HTML, preferably fixed at top/bottom
    let container = getElement(messageContainerId);
    if (!container) {
        container = document.createElement('div');
        container.id = messageContainerId;
        // Basic styling for the container
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.left = '50%';
        container.style.transform = 'translateX(-50%)';
        container.style.padding = '10px 20px';
        container.style.borderRadius = '8px';
        container.style.zIndex = '1000';
        container.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        container.style.transition = 'opacity 0.5s ease-in-out';
        document.body.appendChild(container);
    }

    container.textContent = message;
    switch (type) {
        case "success": container.style.backgroundColor = '#4CAF50'; container.style.color = 'white'; break;
        case "warning": container.style.backgroundColor = '#FFC107'; container.style.color = 'black'; break;
        case "error": container.style.backgroundColor = '#F44336'; container.style.color = 'white'; break;
        default: container.style.backgroundColor = '#2196F3'; container.style.color = 'white'; break; // info
    }
    container.style.opacity = '1';

    setTimeout(() => {
        container.style.opacity = '0';
    }, 3000); // Message disappears after 3 seconds
}

// Call initApp when the script loads if not using DOMContentLoaded for some reason (though DOMContentLoaded is better)
// initApp(); // Covered by DOMContentLoaded
