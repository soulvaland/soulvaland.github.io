// Firebase App (the core Firebase SDK) is always required and must be listed first
// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js"; // Already initialized via window.firebaseApp
import { 
    getAuth, 
    onAuthStateChanged, 
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    signInAnonymously // Keep if anonymous access is still desired for read-only or new sheets
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"; // Using version from HTML
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc, 
    onSnapshot, 
    collection,
    addDoc,
    deleteDoc,
    getDocs,
    serverTimestamp, 
    setLogLevel 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"; // Using version from HTML

// --- Configuration & Global Variables ---\n// const firebaseConfig = typeof __firebase_config !== \'undefined\' ? JSON.parse(__firebase_config) : { apiKey: \"YOUR_API_KEY\", authDomain: \"YOUR_AUTH_DOMAIN\", projectId: \"YOUR_PROJECT_ID\" }; // Replace with your actual config if not in Canvas
// const appId = typeof __app_id !== \'undefined\' ? __app_id : \'pathfinder-sheet-default\';

// Firebase instances are now expected to be available on the window object from PathForge.html
const app = window.firebaseApp;
const auth = window.firebaseAuth;
const db = window.firebaseFirestore;
// const storage = window.firebaseStorage; // Will be used later

let userId = null; 
let currentUser = null; 
let isOwner = false;
let characterSheetUnsubscribe = null;
let currentSheetId = null; // NEW: To store the ID of the currently active sheet
let isSkillsSectionExpanded = true; // NEW: For collapsible skills section state

// --- Default Character Data Structure ---
const CORE_ABILITIES = { STR: "Strength", DEX: "Dexterity", CON: "Constitution", INT: "Intelligence", WIS: "Wisdom", CHA: "Charisma" };
const ABILITY_KEYS = Object.keys(CORE_ABILITIES);

const DEFAULT_PATHFINDER_SKILLS = [
    // Strength based
    { id: "skill_climb", name: "Climb", selectedAbility: "STR", abilityMod: 0, ranks: 0, miscBonus: 0, isClassSkill: false, totalBonus: 0, isCustom: false },
    { id: "skill_swim", name: "Swim", selectedAbility: "STR", abilityMod: 0, ranks: 0, miscBonus: 0, isClassSkill: false, totalBonus: 0, isCustom: false },
    // Dexterity based
    { id: "skill_acrobatics", name: "Acrobatics", selectedAbility: "DEX", abilityMod: 0, ranks: 0, miscBonus: 0, isClassSkill: false, totalBonus: 0, isCustom: false },
    { id: "skill_disable_device", name: "Disable Device", selectedAbility: "DEX", abilityMod: 0, ranks: 0, miscBonus: 0, isClassSkill: false, totalBonus: 0, isCustom: false, requiresTraining: true },
    { id: "skill_escape_artist", name: "Escape Artist", selectedAbility: "DEX", abilityMod: 0, ranks: 0, miscBonus: 0, isClassSkill: false, totalBonus: 0, isCustom: false },
    { id: "skill_fly", name: "Fly", selectedAbility: "DEX", abilityMod: 0, ranks: 0, miscBonus: 0, isClassSkill: false, totalBonus: 0, isCustom: false },
    { id: "skill_ride", name: "Ride", selectedAbility: "DEX", abilityMod: 0, ranks: 0, miscBonus: 0, isClassSkill: false, totalBonus: 0, isCustom: false },
    { id: "skill_sleight_of_hand", name: "Sleight of Hand", selectedAbility: "DEX", abilityMod: 0, ranks: 0, miscBonus: 0, isClassSkill: false, totalBonus: 0, isCustom: false, requiresTraining: true },
    { id: "skill_stealth", name: "Stealth", selectedAbility: "DEX", abilityMod: 0, ranks: 0, miscBonus: 0, isClassSkill: false, totalBonus: 0, isCustom: false },
    // Constitution based (Pathfinder has no CON based skills by default)
    // Intelligence based
    { id: "skill_appraise", name: "Appraise", selectedAbility: "INT", abilityMod: 0, ranks: 0, miscBonus: 0, isClassSkill: false, totalBonus: 0, isCustom: false },
    { id: "skill_craft_1", name: "Craft (Specify 1)", selectedAbility: "INT", abilityMod: 0, ranks: 0, miscBonus: 0, isClassSkill: false, totalBonus: 0, isCustom: false, requiresTraining: true },
    { id: "skill_craft_2", name: "Craft (Specify 2)", selectedAbility: "INT", abilityMod: 0, ranks: 0, miscBonus: 0, isClassSkill: false, totalBonus: 0, isCustom: false, requiresTraining: true },
    { id: "skill_knowledge_arcana", name: "Knowledge (Arcana)", selectedAbility: "INT", abilityMod: 0, ranks: 0, miscBonus: 0, isClassSkill: false, totalBonus: 0, isCustom: false, requiresTraining: true },
    { id: "skill_knowledge_dungeoneering", name: "Knowledge (Dungeoneering)", selectedAbility: "INT", abilityMod: 0, ranks: 0, miscBonus: 0, isClassSkill: false, totalBonus: 0, isCustom: false, requiresTraining: true },
    { id: "skill_knowledge_engineering", name: "Knowledge (Engineering)", selectedAbility: "INT", abilityMod: 0, ranks: 0, miscBonus: 0, isClassSkill: false, totalBonus: 0, isCustom: false, requiresTraining: true },
    { id: "skill_knowledge_geography", name: "Knowledge (Geography)", selectedAbility: "INT", abilityMod: 0, ranks: 0, miscBonus: 0, isClassSkill: false, totalBonus: 0, isCustom: false, requiresTraining: true },
    { id: "skill_knowledge_history", name: "Knowledge (History)", selectedAbility: "INT", abilityMod: 0, ranks: 0, miscBonus: 0, isClassSkill: false, totalBonus: 0, isCustom: false, requiresTraining: true },
    { id: "skill_knowledge_local", name: "Knowledge (Local)", selectedAbility: "INT", abilityMod: 0, ranks: 0, miscBonus: 0, isClassSkill: false, totalBonus: 0, isCustom: false, requiresTraining: true },
    { id: "skill_knowledge_nature", name: "Knowledge (Nature)", selectedAbility: "INT", abilityMod: 0, ranks: 0, miscBonus: 0, isClassSkill: false, totalBonus: 0, isCustom: false, requiresTraining: true },
    { id: "skill_knowledge_nobility", name: "Knowledge (Nobility)", selectedAbility: "INT", abilityMod: 0, ranks: 0, miscBonus: 0, isClassSkill: false, totalBonus: 0, isCustom: false, requiresTraining: true },
    { id: "skill_knowledge_planes", name: "Knowledge (Planes)", selectedAbility: "INT", abilityMod: 0, ranks: 0, miscBonus: 0, isClassSkill: false, totalBonus: 0, isCustom: false, requiresTraining: true },
    { id: "skill_knowledge_religion", name: "Knowledge (Religion)", selectedAbility: "INT", abilityMod: 0, ranks: 0, miscBonus: 0, isClassSkill: false, totalBonus: 0, isCustom: false, requiresTraining: true },
    { id: "skill_linguistics", name: "Linguistics", selectedAbility: "INT", abilityMod: 0, ranks: 0, miscBonus: 0, isClassSkill: false, totalBonus: 0, isCustom: false, requiresTraining: true },
    { id: "skill_spellcraft", name: "Spellcraft", selectedAbility: "INT", abilityMod: 0, ranks: 0, miscBonus: 0, isClassSkill: false, totalBonus: 0, isCustom: false, requiresTraining: true },
    // Wisdom based
    { id: "skill_heal", name: "Heal", selectedAbility: "WIS", abilityMod: 0, ranks: 0, miscBonus: 0, isClassSkill: false, totalBonus: 0, isCustom: false },
    { id: "skill_perception", name: "Perception", selectedAbility: "WIS", abilityMod: 0, ranks: 0, miscBonus: 0, isClassSkill: false, totalBonus: 0, isCustom: false },
    { id: "skill_profession_1", name: "Profession (Specify 1)", selectedAbility: "WIS", abilityMod: 0, ranks: 0, miscBonus: 0, isClassSkill: false, totalBonus: 0, isCustom: false, requiresTraining: true },
    { id: "skill_sense_motive", name: "Sense Motive", selectedAbility: "WIS", abilityMod: 0, ranks: 0, miscBonus: 0, isClassSkill: false, totalBonus: 0, isCustom: false },
    { id: "skill_survival", name: "Survival", selectedAbility: "WIS", abilityMod: 0, ranks: 0, miscBonus: 0, isClassSkill: false, totalBonus: 0, isCustom: false },
    // Charisma based
    { id: "skill_bluff", name: "Bluff", selectedAbility: "CHA", abilityMod: 0, ranks: 0, miscBonus: 0, isClassSkill: false, totalBonus: 0, isCustom: false },
    { id: "skill_diplomacy", name: "Diplomacy", selectedAbility: "CHA", abilityMod: 0, ranks: 0, miscBonus: 0, isClassSkill: false, totalBonus: 0, isCustom: false },
    { id: "skill_disguise", name: "Disguise", selectedAbility: "CHA", abilityMod: 0, ranks: 0, miscBonus: 0, isClassSkill: false, totalBonus: 0, isCustom: false },
    { id: "skill_intimidate", name: "Intimidate", selectedAbility: "CHA", abilityMod: 0, ranks: 0, miscBonus: 0, isClassSkill: false, totalBonus: 0, isCustom: false },
    { id: "skill_perform_1", name: "Perform (Specify 1)", selectedAbility: "CHA", abilityMod: 0, ranks: 0, miscBonus: 0, isClassSkill: false, totalBonus: 0, isCustom: false, requiresTraining: true },
    { id: "skill_use_magic_device", name: "Use Magic Device", selectedAbility: "CHA", abilityMod: 0, ranks: 0, miscBonus: 0, isClassSkill: false, totalBonus: 0, isCustom: false, requiresTraining: true },
];

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
        ac: 10, // This will be the calculated total AC
        acArmor: 0, // NEW
        acShield: 0, // NEW
        acMisc: 0, // NEW
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
        background: "",
        ideals: "",
        bonds: "",
        flaws: "",
        alliesOrganizations: "", // New field for Allies & Organizations
        bioNotes: "" // New field for general bio-specific notes
    },
    capabilities: {
        languages: ["Common"],
        traitsDrawbacks: []
    },
    skills: JSON.parse(JSON.stringify(DEFAULT_PATHFINDER_SKILLS)), // Initialize with a deep copy
    feats: [],
    spellcasting: {
        enabled: false,
        casterClass: "",
        casterLevel: "0",
        concentration: "+0",
        primaryCastingStat: "INT", // Default primary casting stat
        spellsPerDay: { // Initialize for levels 0-9
            "0": { total: 0, used: 0 }, "1": { total: 0, used: 0 }, "2": { total: 0, used: 0 }, 
            "3": { total: 0, used: 0 }, "4": { total: 0, used: 0 }, "5": { total: 0, used: 0 }, 
            "6": { total: 0, used: 0 }, "7": { total: 0, used: 0 }, "8": { total: 0, used: 0 }, 
            "9": { total: 0, used: 0 }
        }, 
        spellsKnown: [ // Example of new structure, usually starts empty
            // {
            //     id: "spell_12345",
            //     name: "Magic Missile",
            //     level: 1,
            //     school: "Evocation",
            //     castingTime: "1 standard action",
            //     range: "Medium (100 ft. + 10 ft./level)",
            //     components: { V: true, S: true, M: false, F: false, DF: false, XP: false, materialCost: "" }, 
            //     duration: "Instantaneous",
            //     savingThrow: "None", 
            //     spellResistance: "Yes", 
            //     description: "A missile of magical energy darts forth...",
            //     prepared: 0, 
            //     uses: 0 
            // }
        ],
        spellSaveDC: {} 
    },
    inventory: {
        money: { pp: 0, gp: 0, sp: 0, cp: 0 },
        items: [] // Example: { id: 'item_123', name: "Longsword", quantity: 1, weight: 4, notes: "Masterwork", equipped: false, location: "Sheath" }
    },
    attacks: [], // Example: { id: 'atk_1', name: 'Longsword', attackBonus: '+7', damage: '1d8+3', critical: '19-20/x2', type: 'Slashing', range: '5ft', notes: 'Masterwork, Power Attack' }
    classMechanics: { // NEW for automation
        hitDie: 'd8', 
        babProgression: 'full', 
        fortitudeSave: 'good', 
        reflexSave: 'poor',    
        willSave: 'good',
        hpAbilityModStat: 'CON', // Stat used for HP modifier per level (CON, WIS, etc.)
        acAbilityModStat1: 'DEX', // Primary ability modifier for AC (DEX, INT, etc.)
        acAbilityModStat2: 'None'  // Secondary ability modifier for AC (WIS, CHA, None, etc.)
    },
    notes: "",
    createdAt: null,
    updatedAt: null,
};

// --- DOM Ready ---
document.addEventListener('DOMContentLoaded', () => {
    if (!app || !auth || !db) {
        console.error("Firebase services not found on window object. Initialization in HTML might have failed.");
        displayMessage("Critical error: Firebase not initialized.", "error");
        return;
    }
    console.log("Firebase services accessed from window object.");
    setLogLevel('debug');
    
    setupAuthListeners();
    setupEventListeners();
    console.log("DOM Loaded. Initial currentSheetId:", currentSheetId);
    // Initial sheet loading logic will be handled by onAuthStateChanged based on URL params
    applyPointBuyButtonVisibility(); 
});

// --- Initialization & Auth Handling ---
function setupAuthListeners() {
    onAuthStateChanged(auth, async (user) => {
        const loginModalBtn = getElement('login-modal-btn');
        const userDisplayContainer = getElement('user-display-container');
        const userEmailDisplay = getElement('user-email-display');
        const toggleEditModeBtn = getElement('toggle-edit-mode-btn');
        const mySheetsHeaderBtn = getElement('my-sheets-header-btn');

        const urlParams = new URLSearchParams(window.location.search);
        const sharedOwnerId = urlParams.get('ownerId');
        const sheetIdFromUrl = urlParams.get('sheetId');

        if (user) { 
            currentUser = user;
            userId = user.uid;
            console.log("User is signed in:", userId);
            document.body.classList.add('is-owner'); // Tentatively set, load functions will clarify true ownership
            if (userEmailDisplay) userEmailDisplay.textContent = user.email || user.displayName || 'User';
            if (loginModalBtn) loginModalBtn.style.display = 'none'; 
            if (userDisplayContainer) userDisplayContainer.classList.remove('hidden');
            if (toggleEditModeBtn) toggleEditModeBtn.classList.remove('hidden'); 
            document.body.classList.remove('edit-mode-active');
            updateEditModeButton(false);
            closeAuthModal();

            if (mySheetsHeaderBtn) mySheetsHeaderBtn.classList.remove('hidden');

            if (sharedOwnerId && sheetIdFromUrl && userId !== sharedOwnerId) {
                console.log(`Loading shared sheet: ${sheetIdFromUrl} from owner: ${sharedOwnerId}`);
                isOwner = false; // Explicitly not the owner
                document.body.classList.remove('is-owner'); // Reflect this in UI capability
                if (toggleEditModeBtn) toggleEditModeBtn.classList.add('hidden'); // Hide edit for shared
                currentSheetId = sheetIdFromUrl;
                await loadSharedCharacterData(sharedOwnerId, sheetIdFromUrl); 
            } else if (sheetIdFromUrl) { 
                console.log(`Loading user's own sheet: ${sheetIdFromUrl}`);
                isOwner = true; 
                document.body.classList.add('is-owner');
                const toggleBtn = getElement('toggle-edit-mode-btn');
                if (toggleBtn) toggleBtn.classList.remove('hidden');
                currentSheetId = sheetIdFromUrl;
                await loadCharacterData(); // loadCharacterData will now handle initial edit mode state for existing sheets
                // Pulse animation is handled after loadCharacterData if it's an existing sheet and not in edit mode
            } else {
                console.log("No specific sheetId in URL for logged-in user. Opening Sheets Manager.");
                isOwner = true; 
                document.body.classList.add('is-owner');
                if (mySheetsHeaderBtn) mySheetsHeaderBtn.classList.remove('hidden'); // Ensure button is visible
                currentSheetId = null;
                characterData = getDefaultCharacterData(); // Show default empty sheet in background
                renderCharacterSheet();
                openSheetsManagerModal(); // <<<< AUTOMATICALLY OPEN SHEETS MANAGER
            }
        } else { 
            currentUser = null;
            userId = null;
            currentSheetId = null; // Clear current sheet on logout
            console.log("User is signed out.");
            isOwner = false; 
            document.body.classList.remove('is-owner');
            document.body.classList.remove('edit-mode-active'); 
            if (loginModalBtn) loginModalBtn.style.display = 'flex'; 
            if (userDisplayContainer) userDisplayContainer.classList.add('hidden');
            if (toggleEditModeBtn) toggleEditModeBtn.classList.add('hidden');
            
            if (mySheetsHeaderBtn) mySheetsHeaderBtn.classList.add('hidden');
            closeSheetsManagerModal();

            if (sharedOwnerId && sheetIdFromUrl) {
                 console.log(`User not logged in, attempting to load shared sheet: ${sheetIdFromUrl}`);
                 // Firestore rules require auth. User will be prompted to login by loadSharedCharacterData.
                 await loadSharedCharacterData(sharedOwnerId, sheetIdFromUrl); 
            } else {
                 console.log("No user, no specific sheet in URL. Rendering default local sheet.");
                 characterData = getDefaultCharacterData(); 
                 renderCharacterSheet();
            }
        }
    });
}

async function handleEmailSignUp() {
    const email = getElement('email-input').value;
    const password = getElement('password-input').value;
    const errorMessageDiv = getElement('auth-error-message');
    if (!email || !password) {
        errorMessageDiv.textContent = "Please enter email and password.";
        errorMessageDiv.style.display = 'block';
        return;
    }
    errorMessageDiv.style.display = 'none';

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("User signed up:", userCredential.user);
        // onAuthStateChanged will handle UI updates and data loading
        // closeAuthModal(); // onAuthStateChanged handles this by hiding login button
    } catch (error) {
        console.error("Error signing up:", error);
        errorMessageDiv.textContent = error.message;
        errorMessageDiv.style.display = 'block';
    }
}

async function handleEmailSignIn() {
    const email = getElement('email-input').value;
    const password = getElement('password-input').value;
    const errorMessageDiv = getElement('auth-error-message');
    if (!email || !password) {
        errorMessageDiv.textContent = "Please enter email and password.";
        errorMessageDiv.style.display = 'block';
        return;
    }
    errorMessageDiv.style.display = 'none';

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User signed in:", userCredential.user);
        // onAuthStateChanged will handle UI updates and data loading
        // closeAuthModal();
    } catch (error) {
        console.error("Error signing in:", error);
        errorMessageDiv.textContent = error.message;
        errorMessageDiv.style.display = 'block';
    }
}

async function handleGoogleSignIn() {
    const provider = new GoogleAuthProvider();
    const errorMessageDiv = getElement('auth-error-message');
    errorMessageDiv.style.display = 'none';
    try {
        const result = await signInWithPopup(auth, provider);
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        const user = result.user;
        console.log("User signed in with Google:", user);
        // onAuthStateChanged will handle UI updates and data loading
        // closeAuthModal();
    } catch (error) {
        console.error("Error with Google Sign-In:", error);
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // const email = error.customData.email;
        // const credential = GoogleAuthProvider.credentialFromError(error);
        errorMessageDiv.textContent = error.message;
        errorMessageDiv.style.display = 'block';
    }
}

async function handleLogout() {
    try {
        await signOut(auth);
        console.log("User signed out.");
        characterData = getDefaultCharacterData(); // Reset to default data after logout
        renderCharacterSheet(); // Re-render with default
        // onAuthStateChanged will update UI (show login button, hide user info)
        // No need to explicitly sign in anonymously here, onAuthStateChanged might trigger it or user can choose to login
    } catch (error) {
        console.error("Error signing out:", error);
        displayMessage("Error signing out.", "error");
    }
}

function openAuthModal() {
    console.log("openAuthModal called"); // DEBUG
    const authModal = getElement('auth-modal');
    console.log("Auth modal element:", authModal); // DEBUG
    if (authModal) {
        authModal.classList.remove('hidden');
        console.log("Removed 'hidden' from authModal. Class list:", authModal.classList); // DEBUG
    }
    getElement('email-input').value = ''; // Clear fields
    getElement('password-input').value = '';
    getElement('auth-error-message').style.display = 'none';
}

function closeAuthModal() {
    const authModal = getElement('auth-modal');
    if (authModal) authModal.classList.add('hidden');
}

// --- Data Handling ---
// ... (keep existing loadCharacterData, saveCharacterData, etc.)
// Make sure getDefaultCharacterData creates a deep copy if characterData is complex
function getDefaultCharacterData() {
    // Return a deep copy of the initial character data structure
    return JSON.parse(JSON.stringify({ // Simple deep copy for this structure
        overview: {
            name: "New Character", classLevel: "Level 1", alignment: "True Neutral",
            deity: "", age: "", gender: "", height: "", weight: "", hairColor: "", eyeColor: "",
            imageUrl: "https://placehold.co/128x128/1a2532/93acc8?text=Char"
        },
        attributes: {
            strength: { score: 10, modifier: "+0" }, dexterity: { score: 10, modifier: "+0" },
            constitution: { score: 10, modifier: "+0" }, intelligence: { score: 10, modifier: "+0" },
            wisdom: { score: 10, modifier: "+0" }, charisma: { score: 10, modifier: "+0" }
        },
        keyStats: {
            hp: { current: 10, max: 10 }, ac: 10, acArmor: 0, acShield: 0, acMisc: 0, initiative: "+0", bab: "+0", speed: "30 ft", wealth: "0 GP",
            saves: { fortitude: "+0", reflex: "+0", will: "+0" }, cmb: "+0", cmd: "10"
        },
        bio: { appearance: "", personality: "", background: "",
            ideals: "", bonds: "", flaws: "", 
            alliesOrganizations: "", bioNotes: ""
        },
        capabilities: { languages: ["Common"], traitsDrawbacks: [] },
        skills: JSON.parse(JSON.stringify(DEFAULT_PATHFINDER_SKILLS)),
        feats: [],
        spellcasting: { 
            enabled: false, 
            casterClass: "", 
            casterLevel: "0", 
            concentration: "+0", 
            primaryCastingStat: "INT", 
            spellsPerDay: { 
                "0": { total: 0, used: 0 }, "1": { total: 0, used: 0 }, "2": { total: 0, used: 0 }, 
                "3": { total: 0, used: 0 }, "4": { total: 0, used: 0 }, "5": { total: 0, used: 0 }, 
                "6": { total: 0, used: 0 }, "7": { total: 0, used: 0 }, "8": { total: 0, used: 0 }, 
                "9": { total: 0, used: 0 }
            }, 
            spellsKnown: [ // Example of new structure, usually starts empty
                // {
                //     id: "spell_12345",
                //     name: "Magic Missile",
                //     level: 1,
                //     school: "Evocation",
                //     castingTime: "1 standard action",
                //     range: "Medium (100 ft. + 10 ft./level)",
                //     components: { V: true, S: true, M: false, F: false, DF: false, XP: false, materialCost: "" }, 
                //     duration: "Instantaneous",
                //     savingThrow: "None", 
                //     spellResistance: "Yes", 
                //     description: "A missile of magical energy darts forth...",
                //     prepared: 0, 
                //     uses: 0 
                // }
            ],
            spellSaveDC: {} 
        },
        inventory: { money: { pp: 0, gp: 0, sp: 0, cp: 0 }, items: [] },
        attacks: [], // Example: { id: 'atk_1', name: 'Longsword', attackBonus: '+7', damage: '1d8+3', critical: '19-20/x2', type: 'Slashing', range: '5ft', notes: 'Masterwork, Power Attack' }
        classMechanics: {
            hitDie: 'd8',
            babProgression: 'full',
            fortitudeSave: 'good',
            reflexSave: 'poor',
            willSave: 'good',
            hpAbilityModStat: 'CON',      // Default to Constitution for HP
            acAbilityModStat1: 'DEX',     // Default to Dexterity for AC
            acAbilityModStat2: 'None'       // Default to no secondary AC bonus stat
        },
        notes: "",
        createdAt: null,
        updatedAt: null,
    }));
}


async function loadCharacterData() { // Now relies on global currentSheetId and userId
    if (!currentUser || !userId ) { 
        console.log("User not logged in. Cannot load personal character data.");
        return;
    }
    if (!currentSheetId) {
        console.log("No currentSheetId selected. Cannot load character data.");
        characterData = getDefaultCharacterData(); // Show default
        renderCharacterSheet();
        return;
    }

    console.log(`Loading character data for user: ${userId}, sheet: ${currentSheetId}`);
    const charSheetRef = doc(db, "users", userId, "characterSheets", currentSheetId);
    
    if (characterSheetUnsubscribe) characterSheetUnsubscribe();

    characterSheetUnsubscribe = onSnapshot(charSheetRef, (docSnap) => {
        if (docSnap.exists()) {
            console.log("Character data loaded from Firestore:", docSnap.data());
            const loadedData = docSnap.data();
            // START: Ensure spellsPerDay structure is initialized if loading old data or incomplete data
            if (!loadedData.spellcasting) {
                loadedData.spellcasting = { spellsPerDay: {} }; // Initialize spellcasting if missing
            } else if (!loadedData.spellcasting.spellsPerDay) {
                loadedData.spellcasting.spellsPerDay = {}; // Initialize spellsPerDay if missing
            }
            
            const defaultSpellsPerDay = getDefaultCharacterData().spellcasting.spellsPerDay;
            for (let i = 0; i <= 9; i++) {
                const levelStr = i.toString();
                if (!loadedData.spellcasting.spellsPerDay[levelStr] || typeof loadedData.spellcasting.spellsPerDay[levelStr] !== 'object') {
                    loadedData.spellcasting.spellsPerDay[levelStr] = { ...(defaultSpellsPerDay[levelStr] || { total: 0, used: 0 }) };
                } else {
                    loadedData.spellcasting.spellsPerDay[levelStr].total = Number(loadedData.spellcasting.spellsPerDay[levelStr].total) || 0;
                    loadedData.spellcasting.spellsPerDay[levelStr].used = Number(loadedData.spellcasting.spellsPerDay[levelStr].used) || 0;
                }
            }
            // END: Ensure spellsPerDay structure

            characterData = { ...getDefaultCharacterData(), ...loadedData }; 
            renderCharacterSheet();
            if (isOwner && !document.body.classList.contains('edit-mode-active')) {
                const editBtn = getElement('toggle-edit-mode-btn');
                if (editBtn) {
                    editBtn.classList.add('pulse-hint');
                    setTimeout(() => editBtn.classList.remove('pulse-hint'), 4000);
                }
            }
        } else {
            console.log(`No character data found for sheet ${currentSheetId}. Using default and saving for new sheet.`);
            characterData = getDefaultCharacterData(); 
            characterData.overview.name = "New Sheet"; 
            characterData.createdAt = serverTimestamp();
            characterData.updatedAt = serverTimestamp();
            saveCharacterData(true); 
        }
    }, (error) => {
        console.error("Error listening to character data:", error);
        displayMessage("Error loading character data.", "error");
        characterData = getDefaultCharacterData();
        renderCharacterSheet();
    });
}

async function saveCharacterData(isInitialSave = false) {
    if (!currentUser || !userId) { 
        console.warn("Cannot save: User not signed in.");
        if (!isInitialSave) displayMessage("Cannot save: Sign in to save your changes.", "warning");
        return false; // Indicate failure
    }
    if (!currentSheetId) {
        console.warn("Cannot save: No current sheet selected.");
        if (!isInitialSave) displayMessage("Cannot save: No active sheet.", "error");
        return false; // Indicate failure
    }
    if (!isOwner && !isInitialSave) { // Allow initial save even if isOwner is somehow false (e.g. race condition)
                                  // but generally, only owners should save their own sheets.
        console.warn("Attempted to save but user is not owner of this sheet.");
        displayMessage("Cannot save: You are not the owner of this sheet.", "warning");
        return false; // Indicate failure
    }

    console.log(`Saving character data for user: ${userId}, sheet: ${currentSheetId}`);
    const charSheetRef = doc(db, "users", userId, "characterSheets", currentSheetId);
    try {
        const dataToSave = { ...characterData }; // Clone characterData
        dataToSave.updatedAt = serverTimestamp();
        if (isInitialSave && !dataToSave.createdAt) {
            dataToSave.createdAt = serverTimestamp();
        }
        // Remove client-side only flags if any (none currently, but good practice)
        // delete dataToSave.isOwner; 

        await setDoc(charSheetRef, dataToSave, { merge: true });
        console.log("Character data saved to Firestore for sheet:", currentSheetId);
        if (!isInitialSave) displayMessage("Character sheet saved!", "success");
        return true; // Indicate success
    } catch (error) {
        console.error("Error saving character data:", error);
        if (!isInitialSave) displayMessage("Error saving character sheet.", "error");
        return false; // Indicate failure
    }
}

// --- Rendering Functions (Keep existing: renderOverview, renderAttributes, etc.) ---
function renderCharacterSheet() {
    console.log("Rendering character sheet with data:", characterData);
    // Ensure skills array exists and has default skills if empty (for older sheets)
    if (!characterData.skills || characterData.skills.length === 0) {
        characterData.skills = JSON.parse(JSON.stringify(DEFAULT_PATHFINDER_SKILLS));
    }
    renderOverview();
    renderAttributes();
    renderKeyStats();
    renderBio();
    renderCapabilities();
    renderSkills();
    renderFeats();
    renderSpellcasting();
    renderInventory();
    renderAttacks(); // Add call to render attacks
    renderClassProgression(); // Add call to render class progression selections
    applySkillsSectionInitialState();
}

function getElement(id) {
    const el = document.getElementById(id);
    // if (!el) console.warn(`Element with ID '${id}' not found.`);
    return el;
}

function setText(id, text) {
    const el = getElement(id);
    if (el) el.textContent = text != null ? String(text) : ""; // Handle null/undefined/numbers
}

function setValue(id, value) {
    const el = getElement(id);
    if (el) el.value = value || "";
}

function renderOverview() {
    const overview = characterData.overview;
    const editModeActive = isOwner && document.body.classList.contains('edit-mode-active');

    // Helper to set text or placeholder
    const setTextOrHint = (id, value, hintText) => {
        const el = getElement(id);
        if (el) {
            if (editModeActive && (!value || String(value).trim() === '')) {
                el.textContent = hintText;
                el.classList.add('text-slate-500', 'italic'); // Style for hint
            } else {
                el.textContent = value != null ? String(value) : "";
                el.classList.remove('text-slate-500', 'italic');
            }
        }
    };

    setTextOrHint('char-name', overview.name, '(Character Name)');
    setTextOrHint('char-class-level', overview.classLevel, '(Class & Level)');
    // For alignment, we will handle its click differently, but still display its value or a hint
    setTextOrHint('char-alignment', overview.alignment, '(Alignment - Click to Select)'); 

    setTextOrHint('char-deity', overview.deity, '(Deity)');
    setTextOrHint('char-age', overview.age, '(Age)');
    setTextOrHint('char-gender', overview.gender, '(Gender)');
    setTextOrHint('char-height', overview.height, '(Height)');
    setTextOrHint('char-weight', overview.weight, '(Weight)');
    setTextOrHint('char-hair', overview.hairColor, '(Hair Color)');
    setTextOrHint('char-eyes', overview.eyeColor, '(Eye Color)');
    
    const charImage = getElement('char-image-display');
    if (charImage) charImage.style.backgroundImage = `url("${overview.imageUrl || 'https://placehold.co/128x128/1a2532/93acc8?text=Char'}")`;
}

function renderAttributes() {
    const attrs = characterData.attributes;
    for (const key in attrs) {
        setText(`attr-${key}-score`, attrs[key].score);
        setText(`attr-${key}-mod`, `(${formatModifier(calculateAbilityModifier(attrs[key].score))})`);
    }
}

function renderKeyStats() {
    const stats = characterData.keyStats;
    const level = getCharacterLevel();
    const classMech = characterData.classMechanics || getDefaultCharacterData().classMechanics;
    const attributes = characterData.attributes;

    // Max HP - Calculated
    const hpAbilityMod = calculateAbilityModifier(attributes[CORE_ABILITIES[classMech.hpAbilityModStat].toLowerCase()]?.score || 10); 
    const calculatedMaxHp = calculateMaxHp(level, classMech.hitDie, classMech.hpAbilityModStat); // Pass stat KEY
    stats.hp.max = calculatedMaxHp;
    
    if (typeof stats.hp !== 'object' || stats.hp === null) { // Should not happen if initialized
        stats.hp = { current: calculatedMaxHp, max: calculatedMaxHp };
    }
    // Ensure current HP does not exceed new max HP, and is at least 1 if maxHP is > 0
    stats.hp.current = Number(stats.hp.current) || stats.hp.max; // Default current to max if invalid
    if (stats.hp.current > stats.hp.max) {
        stats.hp.current = stats.hp.max;
    }
    if (stats.hp.max > 0 && stats.hp.current <= 0) {
        // If we want current HP to be at least 1 when max HP > 0 (e.g. after resurrection)
        // For now, allow current HP to be 0 or negative if it was set that way.
    }
    stats.hp.current = Math.max(0, stats.hp.current); // Ensure current HP is not less than 0 unless intended (e.g. death state)

    setText('stat-hp-current', stats.hp.current);
    setText('stat-hp-max', stats.hp.max);

    // AC - Calculated
    let totalAC = 10; // Base AC
    if (classMech.acAbilityModStat1 && classMech.acAbilityModStat1 !== "None" && attributes[CORE_ABILITIES[classMech.acAbilityModStat1].toLowerCase()]) {
        totalAC += calculateAbilityModifier(attributes[CORE_ABILITIES[classMech.acAbilityModStat1].toLowerCase()].score);
    }
    if (classMech.acAbilityModStat2 && classMech.acAbilityModStat2 !== "None" && attributes[CORE_ABILITIES[classMech.acAbilityModStat2].toLowerCase()]) {
        totalAC += calculateAbilityModifier(attributes[CORE_ABILITIES[classMech.acAbilityModStat2].toLowerCase()].score);
    }
    stats.acArmor = Number(stats.acArmor) || 0;
    stats.acShield = Number(stats.acShield) || 0;
    stats.acMisc = Number(stats.acMisc) || 0;
    totalAC += stats.acArmor + stats.acShield + stats.acMisc;
    characterData.keyStats.ac = totalAC; // Store calculated total

    setText('stat-ac', totalAC);
    setText('stat-ac-armor', stats.acArmor);
    setText('stat-ac-shield', stats.acShield);
    setText('stat-ac-misc', stats.acMisc);

    setText('stat-initiative', stats.initiative);
    
    // BAB - Calculated
    const calculatedBAB = calculateBAB(level, classMech.babProgression);
    characterData.keyStats.bab = formatModifier(calculatedBAB); // Store it formatted
    setText('stat-bab', characterData.keyStats.bab);

    setText('stat-speed', stats.speed);
    setText('stat-wealth', stats.wealth);

    // Saves - Calculated Base + Ability Mod
    const conMod = calculateAbilityModifier(characterData.attributes.constitution.score);
    const dexMod = calculateAbilityModifier(characterData.attributes.dexterity.score);
    const wisMod = calculateAbilityModifier(characterData.attributes.wisdom.score);

    const baseFortSave = calculateBaseSave(level, classMech.fortitudeSave);
    const baseReflexSave = calculateBaseSave(level, classMech.reflexSave);
    const baseWillSave = calculateBaseSave(level, classMech.willSave);

    // Assuming no other misc bonuses to saves for now
    characterData.keyStats.saves.fortitude = formatModifier(baseFortSave + conMod);
    characterData.keyStats.saves.reflex = formatModifier(baseReflexSave + dexMod);
    characterData.keyStats.saves.will = formatModifier(baseWillSave + wisMod);

    setText('stat-fortitude', characterData.keyStats.saves.fortitude);
    setText('stat-reflex', characterData.keyStats.saves.reflex);
    setText('stat-will', characterData.keyStats.saves.will);

    // CMB & CMD - Calculated
    const strengthModForCombatManeuvers = calculateAbilityModifier(attributes.strength.score);
    const dexterityModForCMD = calculateAbilityModifier(attributes.dexterity.score);
    const babForCombatManeuvers = parseInt(characterData.keyStats.bab.replace('+','')) || 0;
    
    const cmbValue = babForCombatManeuvers + strengthModForCombatManeuvers;
    const cmdValue = 10 + babForCombatManeuvers + strengthModForCombatManeuvers + dexterityModForCMD;

    characterData.keyStats.cmb = formatModifier(cmbValue);
    characterData.keyStats.cmd = cmdValue.toString();

    setText('stat-cmb', characterData.keyStats.cmb);
    setText('stat-cmd', characterData.keyStats.cmd);
}

function renderBio() {
    const bio = characterData.bio;
    setText('bio-appearance-text', bio.appearance); 
    setText('bio-personality-text', bio.personality);
    setText('bio-background-text', bio.background);
    setText('bio-ideals-text', bio.ideals);
    setText('bio-bonds-text', bio.bonds);
    setText('bio-flaws-text', bio.flaws);
    setText('bio-allies-orgs-text', bio.alliesOrganizations);
    setText('bio-general-notes-text', bio.bioNotes);
}

function renderCapabilities() {
    const cap = characterData.capabilities;
    const langList = getElement('languages-list');
    if (langList) {
        langList.innerHTML = ''; // Clear previous languages

        if (!cap.languages || cap.languages.length === 0) {
            langList.innerHTML = '<li class="text-[#93acc8]">No languages known beyond Common (if applicable).</li>';
        } else {
            const editModeActive = isOwner && document.body.classList.contains('edit-mode-active');
        cap.languages.forEach(lang => {
            const li = document.createElement('li');
                li.className = 'language-item flex justify-between items-center py-0.5';
                
                const langText = document.createElement('span');
                langText.textContent = lang;
                if (lang.toLowerCase().includes("draconic")) { // Example accent
                    langText.classList.add("accent-magic-glow");
                }
                li.appendChild(langText);

                if (editModeActive) {
                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'action-button-xs destructive-btn-xs owner-edit-btn material-icons ml-2';
                    deleteBtn.textContent = 'delete_outline';
                    deleteBtn.title = 'Delete Language';
                    deleteBtn.onclick = () => handleDeleteLanguage(lang);
                    li.appendChild(deleteBtn);
                }
            langList.appendChild(li);
        });
    }
    }
    // Similar rendering for traits/drawbacks will be done next
    renderTraitsAndDrawbacks(); // Call the new function for traits
}

function renderSkills() {
    const skillsContainer = getElement('skills-list-container');
    if (!skillsContainer) return;

    // Ensure attributes have modifiers calculated for display and for skills if not done elsewhere
    // This is a bit redundant if renderAttributes already does it, but good for safety here.
    for (const attrKey in characterData.attributes) {
        const attr = characterData.attributes[attrKey];
        attr.modifier = formatModifier(calculateAbilityModifier(attr.score));
    }

    recalculateAllSkillBonuses(); // Ensure all skill bonuses are up-to-date before rendering

    skillsContainer.innerHTML = ''; // Clear previous skills

    if (!characterData.skills || characterData.skills.length === 0) {
        skillsContainer.innerHTML = '<p class="text-center text-[#93acc8]">No skills defined.</p>';
        return;
    }

    const editModeActive = isOwner && document.body.classList.contains('edit-mode-active');

    characterData.skills.forEach(skill => {
        const skillItem = document.createElement('div');
        skillItem.className = 'skill-item grid grid-cols-12 gap-x-2 items-center py-1.5 border-b border-[#243447]';
        skillItem.dataset.skillId = skill.id;

        // Skill Name (with tooltip for requiresTraining)
        const nameCell = document.createElement('div');
        // Apply a class that includes grid spanning and any other layout classes previously on nameSpan
        nameCell.className = 'skill-name-container col-span-3 truncate pr-1 relative';

        const nameSpanDisplay = document.createElement('span');
        nameSpanDisplay.className = 'skill-name-display-text block w-full'; // block & w-full for layout, truncate might be on parent

        const updateNameSpanDisplay = (currentSkillName, isReqTraining) => {
            let htmlContent = currentSkillName;
            let titleContent = currentSkillName;
            if (isReqTraining) {
                // The asterisk for "requires training"
                htmlContent += ' <span class="text-xs text-amber-400">*</span>';
                titleContent = `${currentSkillName} (Requires Training)`;
            }
            nameSpanDisplay.innerHTML = htmlContent;
            nameSpanDisplay.title = titleContent;
        };
        
        updateNameSpanDisplay(skill.name, skill.requiresTraining); // Initial setup of display text
        nameCell.appendChild(nameSpanDisplay);

        const canEditName = editModeActive && (
            (skill.name && skill.name.includes("(Specify")) || // Covers "Craft (Specify 1)", etc.
            (skill.id && (
                skill.id.startsWith("skill_craft_") ||
                skill.id.startsWith("skill_profession_") ||
                skill.id.startsWith("skill_perform_")
            ))
        );

        if (canEditName) {
            nameSpanDisplay.classList.add('cursor-pointer', 'hover:text-sky-400', 'owner-edit-target-text'); // Indicate clickable
            
            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            // Style to overlay and match other inputs. owner-edit-target-input is generic.
            nameInput.className = 'skill-name-edit-input hidden owner-edit-target-input bg-[#0d1117] text-sm text-[#e0e0e0] border border-[#384d66] rounded px-1 py-0.5 w-full absolute top-0 left-0 h-full z-10';
            nameInput.value = skill.name;
            nameCell.appendChild(nameInput);

            nameSpanDisplay.addEventListener('click', () => {
                // Ensure edit mode is still active before making editable
                if (!document.body.classList.contains('edit-mode-active') || !isOwner) return;
                
                nameInput.value = skill.name; // Ensure input has the current skill name
                nameSpanDisplay.classList.add('hidden'); // Hide the static text
                nameInput.classList.remove('hidden');    // Show the input field
                nameInput.focus();
                nameInput.select();
            });

            const finishNameEdit = async (saveEdit) => {
                let finalName = skill.name; // Start with current name

                if (saveEdit) {
                    const newName = nameInput.value.trim();
                    if (!newName) { // If input is cleared, revert to default name for this skill ID
                        const defaultSkill = DEFAULT_PATHFINDER_SKILLS.find(s => s.id === skill.id);
                        if (defaultSkill) {
                            skill.name = defaultSkill.name;
                            finalName = defaultSkill.name;
                            await saveCharacterData();
                        }
                    } else if (newName !== skill.name) { // If new name is provided and it's different
                        skill.name = newName;
                        finalName = newName;
                        await saveCharacterData();
                    }
                    // If name is unchanged, no save action needed, finalName remains skill.name
                }
                // else (Escape pressed), finalName is already skill.name (no change)

                updateNameSpanDisplay(finalName, skill.requiresTraining); // Update display
                nameInput.classList.add('hidden');    // Hide input
                nameSpanDisplay.classList.remove('hidden'); // Show static text
            };

            nameInput.addEventListener('blur', () => {
                // setTimeout to allow click on another element to register before blur makes input disappear
                setTimeout(() => finishNameEdit(true), 100); 
            });
            nameInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    finishNameEdit(true); // Save on Enter
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    nameInput.value = skill.name; // Visually revert input to current actual skill name
                    finishNameEdit(false); // Don't save, just hide input & restore display
                }
            });
        }
        skillItem.appendChild(nameCell); // Append the cell containing the span and possibly input

        // Ability Select / Display
        const abilityContainer = document.createElement('div');
        abilityContainer.className = 'skill-ability-selector-container col-span-1 text-center';
        const abilityDisplay = document.createElement('span');
        abilityDisplay.className = 'skill-ability-display text-xs uppercase';
        abilityDisplay.textContent = skill.selectedAbility;
        const abilitySelect = document.createElement('select');
        abilitySelect.className = 'skill-ability-select owner-edit-target-input hidden bg-[#0d1117] text-xs border-[#384d66] rounded w-full px-0.5 py-0.5';
        ABILITY_KEYS.forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = key.toUpperCase();
            if (skill.selectedAbility === key) option.selected = true;
            abilitySelect.appendChild(option);
        });
        abilityContainer.appendChild(abilityDisplay);
        abilityContainer.appendChild(abilitySelect);
        skillItem.appendChild(abilityContainer);

        // Total Bonus
        const totalBonusStrong = document.createElement('strong');
        totalBonusStrong.className = 'skill-total-bonus text-lg col-span-1 text-center';
        totalBonusStrong.textContent = formatModifier(skill.totalBonus);
        skillItem.appendChild(totalBonusStrong);

        // Ability Modifier
        const abilityModSpan = document.createElement('span');
        abilityModSpan.className = 'skill-ability-mod text-sm col-span-1 text-center text-[#b0c4de]';
        abilityModSpan.textContent = `(${formatModifier(skill.abilityMod)})`;
        skillItem.appendChild(abilityModSpan);

        // Ranks Input
        const ranksInput = document.createElement('input');
        ranksInput.type = 'number';
        ranksInput.className = 'skill-ranks bg-[#0d1117] text-center border-[#384d66] rounded px-1 py-0.5 w-full col-span-2 owner-edit-target-input';
        ranksInput.value = skill.ranks;
        ranksInput.min = "0";
        skillItem.appendChild(ranksInput);

        // Misc Bonus Input
        const miscInput = document.createElement('input');
        miscInput.type = 'number';
        miscInput.className = 'skill-misc-bonus bg-[#0d1117] text-center border-[#384d66] rounded px-1 py-0.5 w-full col-span-2 owner-edit-target-input';
        miscInput.value = skill.miscBonus;
        skillItem.appendChild(miscInput);

        // Class Skill Checkbox
        const classSkillCheckbox = document.createElement('input');
        classSkillCheckbox.type = 'checkbox';
        classSkillCheckbox.className = 'skill-class-skill h-4 w-4 text-[#1873dc] bg-[#0d1117] border-[#384d66] rounded focus:ring-[#1873dc] col-span-1 justify-self-center owner-edit-target-input align-middle';
        classSkillCheckbox.checked = skill.isClassSkill;
        skillItem.appendChild(classSkillCheckbox);
        
        // Delete Button (for custom skills)
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-custom-skill-btn text-red-500 hover:text-red-400 col-span-1 justify-self-center material-icons text-xl hidden owner-edit-btn';
        deleteBtn.textContent = 'delete_forever';
        deleteBtn.title = "Delete Custom Skill";
        skillItem.appendChild(deleteBtn);

        // Toggle visibility and disabled state based on editModeActive
        if (editModeActive) {
            abilityDisplay.classList.add('hidden');
            abilitySelect.classList.remove('hidden');
            ranksInput.disabled = false;
            miscInput.disabled = false;
            classSkillCheckbox.disabled = false;
            abilitySelect.disabled = false;
            if (skill.isCustom) deleteBtn.classList.remove('hidden');

            // Update Ranks
            ranksInput.addEventListener('change', (e) => {
                const newRanks = parseInt(e.target.value, 10) || 0;
                skill.ranks = newRanks < 0 ? 0 : newRanks; // Ensure non-negative
                calculateAndUpdateSingleSkill(skill, characterData.attributes);
                totalBonusStrong.textContent = formatModifier(skill.totalBonus);
                abilityModSpan.textContent = `(${formatModifier(skill.abilityMod)})`; // In case ability score changed affecting mod
                saveCharacterData();
            });

            // Update Misc Bonus
            miscInput.addEventListener('change', (e) => {
                skill.miscBonus = parseInt(e.target.value, 10) || 0;
                calculateAndUpdateSingleSkill(skill, characterData.attributes);
                totalBonusStrong.textContent = formatModifier(skill.totalBonus);
                saveCharacterData();
            });

            // Update Class Skill
            classSkillCheckbox.addEventListener('change', (e) => {
                skill.isClassSkill = e.target.checked;
                calculateAndUpdateSingleSkill(skill, characterData.attributes);
                totalBonusStrong.textContent = formatModifier(skill.totalBonus);
                saveCharacterData();
            });

            // Update Selected Ability
            abilitySelect.addEventListener('change', (e) => {
                skill.selectedAbility = e.target.value;
                // When ability changes, attributes might not have changed yet, but we need to recalc based on NEW selected ability
                calculateAndUpdateSingleSkill(skill, characterData.attributes); 
                totalBonusStrong.textContent = formatModifier(skill.totalBonus);
                abilityModSpan.textContent = `(${formatModifier(skill.abilityMod)})`; // Update displayed mod
                abilityDisplay.textContent = skill.selectedAbility.toUpperCase(); // Update the non-edit mode display span
                saveCharacterData();
            });

            // Delete Custom Skill Button
            if (skill.isCustom) {
                deleteBtn.addEventListener('click', () => {
                    if (confirm(`Are you sure you want to delete the custom skill "${skill.name}"?`)) {
                        handleDeleteCustomSkill(skill.id);
                    }
                });
            }
        } else {
            abilityDisplay.classList.remove('hidden');
            abilitySelect.classList.add('hidden');
            ranksInput.disabled = true;
            miscInput.disabled = true;
            classSkillCheckbox.disabled = true;
            abilitySelect.disabled = true;
            deleteBtn.classList.add('hidden');
        }
        // Add event listeners (NEXT STEP)

        skillsContainer.appendChild(skillItem);
    });
}

function renderFeats() {
    const featsList = getElement('feats-list-container'); 
    if (!featsList) return;

    featsList.innerHTML = ''; // Clear previous feats

    if (!characterData.feats || characterData.feats.length === 0) {
        featsList.innerHTML = '<li class="text-[#93acc8]">No feats added yet.</li>';
        return;
    }

    const editModeActive = isOwner && document.body.classList.contains('edit-mode-active');

        characterData.feats.forEach(feat => {
            const li = document.createElement('li');
        li.className = 'feat-item flex justify-between items-start py-1.5 border-b border-[#243447] last:border-b-0';
        li.dataset.featId = feat.id;

        const featDetails = document.createElement('div');
        featDetails.innerHTML = `<strong class="text-[#e0e0e0]">${feat.name || "Unnamed Feat"}</strong><p class="text-xs text-[#b0c4de]">${feat.description || "No description."}</p>`;
        
        li.appendChild(featDetails);

        if (editModeActive) {
            const controlsDiv = document.createElement('div');
            controlsDiv.className = 'feat-controls flex-shrink-0 ml-2 space-x-1';

            const editBtn = document.createElement('button');
            editBtn.className = 'action-button-xs owner-edit-btn material-icons';
            editBtn.textContent = 'edit';
            editBtn.title = 'Edit Feat';
            editBtn.onclick = () => handleEditFeat(feat.id); 
            controlsDiv.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'action-button-xs destructive-btn-xs owner-edit-btn material-icons';
            deleteBtn.textContent = 'delete';
            deleteBtn.title = 'Delete Feat';
            deleteBtn.onclick = () => handleDeleteFeat(feat.id);
            controlsDiv.appendChild(deleteBtn);
            
            li.appendChild(controlsDiv);
        }
            featsList.appendChild(li);
        });
}

function renderSpellcasting() {
    const spellSection = getElement('spellcasting-section');
    const spellcastingEnableContainer = getElement('spellcasting-enable-container');
    const spellcastingEnabledCheckbox = getElement('spellcasting-enabled-checkbox');
    const spellcastingContentContainer = getElement('spellcasting-content-container');
    const addSpellBtn = getElement('add-spell-btn');
    const primaryCastingStatSelect = getElement('spell-primary-casting-stat-select');
    const primaryCastingStatDisplay = getElement('spell-primary-casting-stat-display');

    if (!spellSection || !spellcastingEnabledCheckbox || !spellcastingContentContainer || !spellcastingEnableContainer || !primaryCastingStatSelect || !primaryCastingStatDisplay) return;

    // Ensure default for primaryCastingStat if not present
    if (!characterData.spellcasting.primaryCastingStat) {
        characterData.spellcasting.primaryCastingStat = 'INT';
    }

    const editModeActive = isOwner && document.body.classList.contains('edit-mode-active');

    // Show the enable checkbox container only in edit mode
    if (editModeActive) {
        spellcastingEnableContainer.classList.remove('hidden');
        spellcastingEnableContainer.classList.add('flex'); 
    } else {
        spellcastingEnableContainer.classList.add('hidden');
        spellcastingEnableContainer.classList.remove('flex');
    }
    
    spellcastingEnabledCheckbox.checked = characterData.spellcasting.enabled;

    if (characterData.spellcasting.enabled) {
        spellSection.classList.remove('hidden'); 
        spellcastingContentContainer.classList.remove('hidden');
        if (addSpellBtn) addSpellBtn.classList.remove('hidden');

        setText('spell-caster-class', characterData.spellcasting.casterClass || '(None)');
        setText('spell-caster-level', characterData.spellcasting.casterLevel || '0');
        setText('spell-concentration', characterData.spellcasting.concentration || '+0');

        // Handle Primary Casting Stat display/select visibility
        primaryCastingStatSelect.value = characterData.spellcasting.primaryCastingStat;
        primaryCastingStatDisplay.textContent = characterData.spellcasting.primaryCastingStat;

        if (editModeActive) {
            primaryCastingStatSelect.classList.remove('hidden');
            primaryCastingStatDisplay.classList.add('hidden');
        } else {
            primaryCastingStatSelect.classList.add('hidden');
            primaryCastingStatDisplay.classList.remove('hidden');
        }

        // Calculate and display Spell Save DC based on the selected primary casting stat
        const primaryStatKey = characterData.spellcasting.primaryCastingStat; // This will be 'INT', 'WIS', or 'CHA'
        const primaryAbilityScore = characterData.attributes[primaryStatKey.toLowerCase()]?.score || 10;
        const primaryAbilityMod = calculateAbilityModifier(primaryAbilityScore);
        // For simplicity, we assume a base DC of 10 + ability mod. 
        // Pathfinder DCs are often 10 + spell level + ability mod. We'll address spell level later.
        // For now, this is the general casting DC.
        setText('spell-save-dc-primary', `DC ${10 + primaryAbilityMod} (${primaryStatKey})`);

        // Render Spells Known
        const spellsKnownList = getElement('spells-known-list');
        if (spellsKnownList) {
            spellsKnownList.innerHTML = ''; // Clear previous
            if (!characterData.spellcasting.spellsKnown || characterData.spellcasting.spellsKnown.length === 0) {
                spellsKnownList.innerHTML = '<li class="text-[#93acc8]">No spells known. Click "Add Spell" to add some.</li>';
            } else {
            characterData.spellcasting.spellsKnown.forEach(spell => {
                const li = document.createElement('li');
                    li.className = 'spell-item flex justify-between items-center py-1.5 border-b border-[#243447] last:border-b-0';
                    li.dataset.spellId = spell.id;

                    const spellDetails = document.createElement('div');
                    spellDetails.className = 'spell-info-clickable flex-grow cursor-pointer hover:text-sky-400'; // Added class for clickability
                    spellDetails.innerHTML = `<strong class="text-[#e0e0e0] accent-magic-glow">${spell.name || "Unnamed Spell"}</strong> <span class="text-xs text-[#93acc8]">(Lvl ${spell.level || 0})</span>`;
                    li.appendChild(spellDetails);

                    // Event listener for opening the modal in view/edit mode
                    spellDetails.addEventListener('click', () => {
                        // If edit mode for the list is active, the separate edit button should be used.
                        // This click is for viewing or quick editing via modal.
                        openSpellDetailModal(spell.id);
                    });

                    if (editModeActive) {
                        const controlsDiv = document.createElement('div');
                        controlsDiv.className = 'spell-controls flex-shrink-0 ml-2 space-x-1';

                        const editBtn = document.createElement('button');
                        editBtn.className = 'action-button-xs owner-edit-btn material-icons';
                        editBtn.textContent = 'edit';
                        editBtn.title = 'Edit Spell';
                        editBtn.onclick = () => handleEditSpell(spell.id);
                        controlsDiv.appendChild(editBtn);

                        const deleteBtn = document.createElement('button');
                        deleteBtn.className = 'action-button-xs destructive-btn-xs owner-edit-btn material-icons';
                        deleteBtn.textContent = 'delete';
                        deleteBtn.title = 'Delete Spell';
                        deleteBtn.onclick = () => handleDeleteSpell(spell.id);
                        controlsDiv.appendChild(deleteBtn);
                        
                        li.appendChild(controlsDiv);
                    }
                spellsKnownList.appendChild(li);
            });
        }
        }

        // Render Spells Per Day
        const spellsPerDayGrid = getElement('spells-per-day-grid');
        if (spellsPerDayGrid) {
            spellsPerDayGrid.innerHTML = ''; // Clear previous content

            // Ensure characterData.spellcasting.spellsPerDay is initialized for levels 0-9
            if (!characterData.spellcasting.spellsPerDay) characterData.spellcasting.spellsPerDay = {};
            const defaultSpellsStructure = getDefaultCharacterData().spellcasting.spellsPerDay;
            for (let i = 0; i <= 9; i++) {
                const levelStr = i.toString();
                if (!characterData.spellcasting.spellsPerDay[levelStr] || typeof characterData.spellcasting.spellsPerDay[levelStr] !== 'object') {
                    characterData.spellcasting.spellsPerDay[levelStr] = { ...(defaultSpellsStructure[levelStr] || { total: 0, used: 0 }) };
    } else {
                    characterData.spellcasting.spellsPerDay[levelStr].total = Number(characterData.spellcasting.spellsPerDay[levelStr].total) || 0;
                    characterData.spellcasting.spellsPerDay[levelStr].used = Number(characterData.spellcasting.spellsPerDay[levelStr].used) || 0;
                }
            }

            for (let level = 0; level <= 9; level++) {
                const levelStr = level.toString();
                const levelData = characterData.spellcasting.spellsPerDay[levelStr];

                const groupDiv = document.createElement('div');
                groupDiv.className = 'spd-level-group';
                groupDiv.dataset.level = levelStr;

                const label = document.createElement('label');
                label.className = 'block text-sm font-medium text-[#93acc8]';
                label.textContent = level === 0 ? 'Cantrips/Orisons Known' : `Level ${levelStr} Spells`;
                groupDiv.appendChild(label);

                const inputsContainer = document.createElement('div');
                inputsContainer.className = 'flex items-center space-x-2 mt-1';

                const totalInput = document.createElement('input');
                totalInput.type = 'number';
                totalInput.min = '0';
                totalInput.placeholder = level === 0 ? 'Known' : 'Slots';
                totalInput.className = 'spd-input spd-total-input modal-input w-20 owner-edit-target-input';
                totalInput.title = level === 0 ? 'Total cantrips/orisons known' : `Total level ${levelStr} spell slots per day`;
                totalInput.value = levelData.total;
                totalInput.disabled = !editModeActive;
                inputsContainer.appendChild(totalInput);

                if (level > 0) { // Only show Used input for spell levels 1-9
                    const separator = document.createElement('span');
                    separator.className = 'text-[#93acc8]';
                    separator.textContent = '/';
                    inputsContainer.appendChild(separator);

                    const usedInput = document.createElement('input');
                    usedInput.type = 'number';
                    usedInput.min = '0';
                    usedInput.placeholder = 'Used';
                    usedInput.className = 'spd-input spd-used-input modal-input w-20 owner-edit-target-input';
                    usedInput.title = `Level ${levelStr} spell slots used today`;
                    usedInput.value = levelData.used;
                    usedInput.disabled = !editModeActive;
                    inputsContainer.appendChild(usedInput);
                }

                groupDiv.appendChild(inputsContainer);
                spellsPerDayGrid.appendChild(groupDiv);
            }
        }

    } else {
        spellcastingContentContainer.classList.add('hidden');
        if (addSpellBtn) addSpellBtn.classList.add('hidden');
        // Optionally hide the entire section if not enabled, or just content
        // spellSection.classList.add('hidden'); // Hides title as well
    }
}

/* ---------- Point Buy Calculator Core Functions ---------- */
const PBC_COSTS = { // Total cost to reach this score (score 10 is 0 points)
    7: -4, 
    8: -2, 
    9: -1, 
    10: 0, 
    11: 1, 
    12: 2, 
    13: 3, 
    14: 5, 
    15: 7, 
    16: 10, 
    17: 13, 
    18: 17
};
const PBC_MIN_SCORE = 7;
const PBC_MAX_SCORE_BUY = 18;
const PBC_BASE_SCORE = 10;
let pbcState = {
  totalPoints: 15,
  pointsSpent: 0,
  baseScores: { STR:10,DEX:10,CON:10,INT:10,WIS:10,CHA:10 },
  racialMods:{ STR:0,DEX:0,CON:0,INT:0,WIS:0,CHA:0 },
  finalScores:{ STR:10,DEX:10,CON:10,INT:10,WIS:10,CHA:10 }
};

function getPointCostForSingleScore(score){
  // Returns the total point cost for a given score, relative to 10 being 0 points.
  return PBC_COSTS[score] !== undefined ? PBC_COSTS[score] : 0; // Default to 0 if score out of defined range, though UI should prevent this.
}
function calculateTotalPointsSpent(){
  let spent=0;
  for(const k in pbcState.baseScores){ spent += getPointCostForSingleScore(pbcState.baseScores[k]); }
  pbcState.pointsSpent = spent;
  return spent;
}
function updatePBCDisplays(){
  calculateTotalPointsSpent();
  setText('point-buy-remaining', pbcState.totalPoints - pbcState.pointsSpent);
  ABILITY_KEYS.forEach(k=>{
    const baseScore = pbcState.baseScores[k];
    const racialMod = pbcState.racialMods[k]; // This still comes from pbcState
    pbcState.finalScores[k] = baseScore + racialMod;
    
    const row = document.querySelector(`#pb-attr-${k}`);
    if(row){
      row.querySelector('.pb-score-display').value = baseScore;
      row.querySelector('.pb-cost').textContent = `Cost: ${getPointCostForSingleScore(baseScore)}`;
      
      // Update the inline racial mod input if it exists (it should if rows are built)
      const racialInput = row.querySelector('.racial-mod-inline-input');
      if (racialInput) racialInput.value = racialMod; 
      
      // Update the inline final score display
      const finalDisplay = row.querySelector('.pb-final-inline');
      if (finalDisplay) finalDisplay.textContent = `Final: ${pbcState.finalScores[k]}`;
    }
    // Removed direct update to separate final score cells as they are gone
  });
  const err=getElement('point-buy-error-message');
  if(err){
    if(pbcState.pointsSpent > pbcState.totalPoints){
      err.textContent = 'Points spent exceed total.';
      err.classList.remove('hidden');
      getElement('point-buy-apply-btn').disabled = true;
    }else{
      err.classList.add('hidden');
      getElement('point-buy-apply-btn').disabled = false;
    }
  }
}
function resetPBCState(total=15){
  pbcState.totalPoints = total;
  ABILITY_KEYS.forEach(k=>{
    pbcState.baseScores[k]=PBC_BASE_SCORE;
    pbcState.racialMods[k]=0;
    pbcState.finalScores[k]=PBC_BASE_SCORE;
  });
  updatePBCDisplays();
}
function openPointBuyModal(){
  const modal = getElement('point-buy-modal');
  if (!modal) return;

  // Ensure containers are present
  const attributesContainer = getElement('point-buy-attributes-container');
  // racialModInnerContainer and separate final score container removed
  if (!attributesContainer) {
      console.error("Point Buy Modal crucial containers not found!");
      return;
  }

  // Clear previous dynamic content only if it hasn't been built or to refresh structure
  // A simple check for first child can determine if rows need to be built.
  if (attributesContainer.children.length === 0) {
      attributesContainer.innerHTML = ''; 
 
       ABILITY_KEYS.forEach(key => {
           const row = document.createElement('div');
           // Adjusted to grid-cols-7: Label, Dec, Score, Inc, Racial, Cost, Final
           row.className = 'pb-attr-row grid grid-cols-7 items-center gap-x-2 gap-y-1 p-2 bg-[#1a2532] rounded-md';
           row.id = `pb-attr-${key}`;
           // Add sub-labels for Base and Racial
           row.innerHTML = `
               <label class="col-span-1 modal-label text-sm font-semibold text-left self-center">${key}</label>
               <button class="pb-btn pb-decrease material-icons action-button-xs flex items-center justify-center self-center p-1" data-stat="${key}">remove</button> 
               <div class="flex flex-col items-center">
                   <span class="text-xs text-[#93acc8]">Base</span>
                   <input type="number" readonly class="pb-score-display modal-input w-12 min-w-[40px] text-center bg-[#0d1117]">
               </div>
               <button class="pb-btn pb-increase material-icons action-button-xs flex items-center justify-center self-center p-1" data-stat="${key}">add</button>
               <div class="flex flex-col items-center">
                   <span class="text-xs text-[#93acc8]">Racial</span>
                   <input type="number" class="racial-mod-inline-input modal-input w-12 min-w-[40px] text-center" value="0" title="Racial Modifier for ${key}" data-stat="${key}">
               </div>
               <div class="flex flex-col items-center justify-center">
                   <span class="text-xs text-[#93acc8]">Cost</span>
                   <p class="pb-cost text-xs text-center text-[#93acc8] mt-1">0</p>
               </div>
               <div class="flex flex-col items-center justify-center">
                   <span class="text-xs text-[#93acc8]">Final</span>
                   <p class="pb-final-inline text-sm text-center text-sky-400 font-semibold mt-1">${PBC_BASE_SCORE}</p>
               </div>
           `;
           attributesContainer.appendChild(row);
       });
   }

  // Determine initial total points from dropdown/custom input
  const selectedTotalDropdown = getElement('point-buy-total-points');
  const customTotalInput = getElement('point-buy-custom-total');
  let initialTotalPoints = 15;
  if (selectedTotalDropdown.value === 'custom') {
      initialTotalPoints = parseInt(customTotalInput.value, 10) || 15;
      if (isNaN(initialTotalPoints) || initialTotalPoints <=0) initialTotalPoints = 15;
      customTotalInput.classList.remove('hidden'); // Ensure custom input is visible if selected
  } else {
      initialTotalPoints = parseInt(selectedTotalDropdown.value, 10);
      customTotalInput.classList.add('hidden'); // Hide custom if a preset is chosen
  }
  
  resetPBCState(initialTotalPoints); // This also calls updatePBCDisplays
  modal.classList.remove('hidden');
}

function closePointBuyModal(){
  const modal=getElement('point-buy-modal');
  if(modal) modal.classList.add('hidden');
}
async function handleApplyPointBuy(){
  if(pbcState.pointsSpent > pbcState.totalPoints){
    displayMessage('Points spent exceed total points.','error'); return; // Changed warning to error for apply failure
  }
  ABILITY_KEYS.forEach(key => { // key is 'STR', 'DEX', etc.
    const attributeName = CORE_ABILITIES[key].toLowerCase(); // Get 'strength', 'dexterity', etc.
    if (characterData.attributes[attributeName]) {
        characterData.attributes[attributeName].score = pbcState.finalScores[key];
    } else {
        console.error(`Attribute ${attributeName} not found in characterData.attributes for key ${key}`);
    }
  });
  renderAttributes(); 
  recalculateAllSkillBonuses(); 
  renderSkills();
  renderKeyStats(); 
  renderSpellcasting();
  await saveCharacterData(); 
  closePointBuyModal();
  displayMessage('Ability scores updated from point buy.','success');
}
/* ---------- End Point Buy Calculator Core Functions ---------- */
// --- Event Listeners Setup ---
function setupEventListeners() {
    // Auth Modal Buttons
    const loginModalBtn = getElement('login-modal-btn');
    console.log("Login button element:", loginModalBtn); 
    if (loginModalBtn) loginModalBtn.addEventListener('click', openAuthModal);

    const authModalCloseBtn = getElement('auth-modal-close-btn');
    if (authModalCloseBtn) authModalCloseBtn.addEventListener('click', closeAuthModal);

    const emailSignupBtn = getElement('email-signup-btn');
    if (emailSignupBtn) emailSignupBtn.addEventListener('click', handleEmailSignUp);

    const emailSigninBtn = getElement('email-signin-btn');
    if (emailSigninBtn) emailSigninBtn.addEventListener('click', handleEmailSignIn);

    const googleSigninBtn = getElement('google-signin-btn');
    if (googleSigninBtn) googleSigninBtn.addEventListener('click', handleGoogleSignIn);

    const logoutBtn = getElement('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    const shareSheetBtn = getElement('share-sheet-btn');
    if (shareSheetBtn) shareSheetBtn.addEventListener('click', handleShareSheet);

    const settingsBtn = getElement('settings-btn');
    if (settingsBtn) settingsBtn.addEventListener('click', openSettingsModal);

    const settingsModalCloseBtn = getElement('settings-modal-close-btn');
    if (settingsModalCloseBtn) settingsModalCloseBtn.addEventListener('click', closeSettingsModal);

    const settingsModalSaveBtn = getElement('settings-modal-save-btn');
    if (settingsModalSaveBtn) settingsModalSaveBtn.addEventListener('click', handleSaveSettings);

    // --- Navigation Tab Button Listeners ---
    const navButtons = {
        'nav-overview-btn': getElement('char-name'), 
        'nav-combat-btn': getElement('attr-strength-score')?.closest('section'), 
        'nav-spells-btn': getElement('spellcasting-section'),
        'nav-inventory-btn': getElement('inventory-section'), 
        'nav-bio-btn': getElement('bio-details-section') // Updated from nav-roll-btn and pointing to new ID
    };

    Object.keys(navButtons).forEach(buttonId => {
        const button = getElement(buttonId);
        const targetElement = navButtons[buttonId];
        
        if (button) {
            button.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default anchor jump
                
                // Update active tab styling
                document.querySelectorAll('nav a').forEach(navA => navA.classList.remove('text-[#1873dc]', 'font-semibold'));
                document.querySelectorAll('nav a').forEach(navA => navA.classList.add('text-[#93acc8]')); // Reset to default
                button.classList.remove('text-[#93acc8]');
                button.classList.add('text-[#1873dc]', 'font-semibold');

                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else if (buttonId === 'nav-overview-btn') {
                     window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top for overview if no specific element
                } else {
                    // Handle cases where the target section might not be ready/visible yet
                    // or if it's a placeholder like inventory
                    displayMessage(`${button.querySelector('.text-xs').textContent} section not yet implemented or visible.`, 'info');
                }
            });
        }
    });

    // --- Add Button Listeners (using stubs for now) ---
    const addFeatBtn = getElement('add-feat-btn');
    if (addFeatBtn) addFeatBtn.addEventListener('click', handleAddFeat);

    const addLanguageBtn = getElement('add-language-btn');
    if(addLanguageBtn) addLanguageBtn.addEventListener('click', handleAddLanguage);
    
    const addTraitBtn = getElement('add-trait-btn'); // Get the button
    if(addTraitBtn) addTraitBtn.addEventListener('click', handleAddTraitOrDrawback); // Wire it up
    
    // Placeholder for Add Spell button if you add it to HTML
    const addSpellBtn = getElement('add-spell-btn');
    if(addSpellBtn) addSpellBtn.addEventListener('click', handleAddSpell);

    const spellcastingEnabledCheckbox = getElement('spellcasting-enabled-checkbox');
    if (spellcastingEnabledCheckbox) {
        spellcastingEnabledCheckbox.addEventListener('change', async (e) => {
            if (!isOwner) return; 
            characterData.spellcasting.enabled = e.target.checked;
            renderSpellcasting(); 
            await saveCharacterData();
            displayMessage(`Spellcasting ${characterData.spellcasting.enabled ? 'enabled' : 'disabled'}.`, "success");
        });
    }

    const primaryCastingStatSelect = getElement('spell-primary-casting-stat-select');
    if (primaryCastingStatSelect) {
        primaryCastingStatSelect.addEventListener('change', async (e) => {
            if (!isOwner || !document.body.classList.contains('edit-mode-active') || !characterData.spellcasting.enabled) return;
            characterData.spellcasting.primaryCastingStat = e.target.value;
            renderSpellcasting();
            await saveCharacterData();
            displayMessage(`Primary casting stat set to ${characterData.spellcasting.primaryCastingStat}.`, "success");
        });
    }

    // Event delegation for Spells Per Day inputs
    const spellsPerDayGrid = getElement('spells-per-day-grid');
    if (spellsPerDayGrid) {
        spellsPerDayGrid.addEventListener('change', async (e) => {
            if (!e.target.classList.contains('spd-input') || !isOwner || !document.body.classList.contains('edit-mode-active') || !characterData.spellcasting.enabled) {
                return;
            }

            const group = e.target.closest('.spd-level-group');
            if (!group) return;

            const levelStr = group.dataset.level;
            if (!characterData.spellcasting.spellsPerDay[levelStr]) { // Should be initialized by render, but safety check
                characterData.spellcasting.spellsPerDay[levelStr] = { total: 0, used: 0 };
            }

            const isTotalInput = e.target.classList.contains('spd-total-input');
            let newValue = parseInt(e.target.value, 10);

            if (isNaN(newValue) || newValue < 0) {
                newValue = 0;
                e.target.value = newValue;
            }

            if (isTotalInput) {
                characterData.spellcasting.spellsPerDay[levelStr].total = newValue;
                if (levelStr !== "0" && characterData.spellcasting.spellsPerDay[levelStr].used > newValue) {
                    characterData.spellcasting.spellsPerDay[levelStr].used = newValue;
                    const usedInput = group.querySelector('.spd-used-input');
                    if (usedInput) usedInput.value = newValue;
                }
            } else { // It's a used input (only for levels > 0)
                if (newValue > characterData.spellcasting.spellsPerDay[levelStr].total) {
                    newValue = characterData.spellcasting.spellsPerDay[levelStr].total;
                    e.target.value = newValue;
                }
                characterData.spellcasting.spellsPerDay[levelStr].used = newValue;
            }
            
            // Ensure level 0 "used" stays 0 as it represents "known" not "slots used"
            if (levelStr === "0") {
                characterData.spellcasting.spellsPerDay[levelStr].used = 0;
            }

            const success = await saveCharacterData();
            if (success) {
                displayMessage(`Spells for level ${levelStr} updated.`, "success");
            } else {
                displayMessage("Failed to save spell slot update.", "error");
                // Consider a more robust rollback for production
            }
        });
    }

    // --- Inline Editable Fields (Overview Section) ---
    const overviewFieldsToMakeEditable = {
        'char-name': { path: 'overview.name' }, 
        'char-class-level': { path: 'overview.classLevel', onSaveCallback: () => { renderKeyStats(); recalculateAllSkillBonuses(); renderAttacks(); renderSpellcasting(); } }, // Added callbacks
        'char-deity': { path: 'overview.deity' },
        'char-age': { path: 'overview.age', isNumber: true },
        'char-gender': { path: 'overview.gender' },
        'char-height': { path: 'overview.height' },
        'char-weight': { path: 'overview.weight' },
        'char-hair': { path: 'overview.hairColor' },
        'char-eyes': { path: 'overview.eyeColor' }
    };

    for (const id in overviewFieldsToMakeEditable) {
        const config = overviewFieldsToMakeEditable[id];
        const valueElement = getElement(id);
        if (valueElement) {
            valueElement.addEventListener('click', (evt) => {
                if (evt.target.tagName === 'INPUT' || valueElement.classList.contains('editing')) {
                    return;
                }
                makeEditable(valueElement, config.path, config.isNumber || false, config.onSaveCallback);
            });
        }
    }
    
    // Example for a bio field (uses textarea - makeEditable would need adjustment or a different function)
    // const bioAppearance = getElement('bio-appearance-text');
    // if (bioAppearance) bioAppearance.addEventListener('click', () => makeEditable(bioAppearance, 'bio.appearance', false, true)); // last true for isTextarea

    // --- Bio Fields with Textarea Editing ---
    const bioFields = {
        'bio-appearance-text': 'bio.appearance',
        'bio-personality-text': 'bio.personality',
        'bio-background-text': 'bio.background',
        'bio-ideals-text': 'bio.ideals',
        'bio-bonds-text': 'bio.bonds',
        'bio-flaws-text': 'bio.flaws',
        'bio-allies-orgs-text': 'bio.alliesOrganizations',
        'bio-general-notes-text': 'bio.bioNotes'
    };

    for (const id in bioFields) {
        const element = getElement(id);
        const dataPath = bioFields[id];
        if (element) {
            element.addEventListener('click', (evt) => {
                if (evt.target.tagName === 'TEXTAREA' || element.classList.contains('editing')) {
                    return; // Already editing this or clicked on the textarea itself
                }
                makeEditable(element, dataPath, false, null, true); // isNumber: false, onSaveCallback: null, isTextarea: true
            });
        }
    }

    // Image Edit Button (uses its own handler for now, not makeEditable directly)
    const editImageBtn = getElement('edit-image-btn');
    if (editImageBtn) editImageBtn.addEventListener('click', handleChangeImage);

    const toggleEditModeBtn = getElement('toggle-edit-mode-btn');
    if (toggleEditModeBtn) toggleEditModeBtn.addEventListener('click', toggleEditMode);

    const mySheetsHeaderBtn = getElement('my-sheets-header-btn');
    if (mySheetsHeaderBtn) mySheetsHeaderBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openSheetsManagerModal();
    });

    const sheetsManagerCloseBtn = getElement('sheets-manager-close-btn');
    if (sheetsManagerCloseBtn) sheetsManagerCloseBtn.addEventListener('click', closeSheetsManagerModal);

    const createNewSheetBtn = getElement('create-new-sheet-btn');
    if (createNewSheetBtn) createNewSheetBtn.addEventListener('click', handleCreateNewSheet);

    // Event delegation for open/delete buttons in sheets list
    const sheetsListContainer = getElement('sheets-list-container');
    if (sheetsListContainer) {
        sheetsListContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('open-sheet-btn')) {
                const sheetId = e.target.dataset.sheetId;
                if (sheetId) handleOpenSheet(sheetId);
            }
            if (e.target.classList.contains('delete-sheet-btn')) {
                const sheetId = e.target.dataset.sheetId;
                const sheetName = e.target.closest('.sheet-item')?.querySelector('.sheet-name')?.textContent || 'this sheet';
                if (sheetId && confirm(`Are you sure you want to delete "${sheetName}"? This cannot be undone.`)) {
                    handleDeleteSheet(sheetId);
                }
            }
        });
    }

    const skillsSectionToggle = getElement('skills-section-toggle');
    if (skillsSectionToggle) skillsSectionToggle.addEventListener('click', toggleSkillsSection);

    const addCustomSkillBtn = getElement('add-custom-skill-btn');
    if (addCustomSkillBtn) addCustomSkillBtn.addEventListener('click', handleAddCustomSkillModal);

    // --- Inline Editable Fields (Attributes Section) ---
    // Select the parent containers of the attribute scores
    const attributeContainers = document.querySelectorAll('.ornate-stat-card'); 
    attributeContainers.forEach(container => {
        // Find the actual score span within this container
        const scoreElement = container.querySelector('[id^="attr-"][id$="-score"]');
        if (scoreElement) {
            const attributeKey = scoreElement.id.split('-')[1]; // e.g., 'strength'
            if (characterData.attributes[attributeKey]) {
                container.addEventListener('click', (evt) => {
                    evt.preventDefault();
                    evt.stopPropagation();
                    // If the click originated on an existing input inside this element, 
                    // or the element is already being edited, ignore to avoid disrupting current edit.
                    if (evt.target.tagName === 'INPUT' || scoreElement.classList.contains('editing')) {
                        return;
                    }
                    makeEditable(scoreElement, `attributes.${attributeKey}.score`, true, () => {
                        const newScore = parseInt(characterData.attributes[attributeKey].score, 10) || 0;
                        characterData.attributes[attributeKey].modifier = formatModifier(calculateAbilityModifier(newScore));
                        const modElement = getElement(`attr-${attributeKey}-mod`);
                        if (modElement) modElement.textContent = `(${characterData.attributes[attributeKey].modifier})`;
                        
                        recalculateAllSkillBonuses();
                        renderSkills();
                        renderKeyStats(); // Recalculate HP, BAB, Saves, CMB, CMD
                        renderSpellcasting(); // Update spell save DCs
                        renderInventory(); // Update encumbrance
                        renderAttacks(); // If attacks depend on STR/DEX/BAB for display
                    });
                });
            }
        }
    });

    // --- Alignment Modal Functions ---
    function openAlignmentModal() {
        if (!isOwner || !document.body.classList.contains('edit-mode-active')) {
            displayMessage("Alignment can only be changed in Edit Mode.", "info");
            return;
        }
        const modal = getElement('alignment-modal');
        if (modal) {
            modal.classList.remove('hidden');
            getElement('custom-alignment-input').value = ''; // Clear custom input
        }
    }

    function closeAlignmentModal() {
        const modal = getElement('alignment-modal');
        if (modal) modal.classList.add('hidden');
    }

    async function handleAlignmentSelection(selectedAlignment) {
        if (!selectedAlignment || typeof selectedAlignment !== 'string') return;

        characterData.overview.alignment = selectedAlignment.trim();
        renderOverview(); // Update display
        await saveCharacterData();
        closeAlignmentModal();
        displayMessage(`Alignment set to: ${characterData.overview.alignment}`, "success");
    }
    // --- End Alignment Modal Functions ---

    // Remove 'char-alignment' from overviewFieldsToMakeEditable if it was there implicitly
    // It will now have its own dedicated listener.
    const charAlignmentElement = getElement('char-alignment');
    if (charAlignmentElement) {
        charAlignmentElement.addEventListener('click', () => {
            if (isOwner && document.body.classList.contains('edit-mode-active')) {
                openAlignmentModal();
            }
            // If not in edit mode, clicking does nothing, or you could show a message
        });
    }

    // Listeners for alignment modal buttons
    const alignmentSelectBtns = document.querySelectorAll('.alignment-select-btn');
    alignmentSelectBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            handleAlignmentSelection(btn.dataset.alignment);
        });
    });

    const saveCustomAlignmentBtn = getElement('save-custom-alignment-btn');
    if (saveCustomAlignmentBtn) {
        saveCustomAlignmentBtn.addEventListener('click', () => {
            const customAlignment = getElement('custom-alignment-input').value;
            if (customAlignment && customAlignment.trim() !== '') {
                handleAlignmentSelection(customAlignment);
            } else {
                displayMessage("Please enter a custom alignment value.", "warning");
            }
        });
    }

    const alignmentModalCloseBtn = getElement('alignment-modal-close-btn');
    if (alignmentModalCloseBtn) {
        alignmentModalCloseBtn.addEventListener('click', closeAlignmentModal);
    }

    // --- Inline Editable Fields (Spellcasting Section) ---
    const spellcastingFieldsToMakeEditable = {
        'spell-caster-class': { path: 'spellcasting.casterClass' },
        'spell-caster-level': { path: 'spellcasting.casterLevel', isNumber: false }, // Allow text like "5th" or just "5"
        'spell-concentration': { path: 'spellcasting.concentration' } // Could be number or text like "+5"
    };

    for (const id in spellcastingFieldsToMakeEditable) {
        const config = spellcastingFieldsToMakeEditable[id];
        const valueElement = getElement(id);
        if (valueElement) {
            valueElement.addEventListener('click', (evt) => {
                if (evt.target.tagName === 'INPUT' || valueElement.classList.contains('editing') || !characterData.spellcasting.enabled) {
                    return;
                }
                makeEditable(valueElement, config.path, config.isNumber || false, () => {
                    renderSpellcasting(); // Re-render to update derived values like DC
                });
            });
        }
    }

    const spellModalSaveBtn = getElement('spell-modal-save-btn');
    if (spellModalSaveBtn) {
        spellModalSaveBtn.addEventListener('click', handleSaveSpellFromModal);
    }

    const spellModalCloseBtn = getElement('spell-modal-close-btn');
    if (spellModalCloseBtn) {
        spellModalCloseBtn.addEventListener('click', closeSpellDetailModal);
    }

    // --- Inline Editable Fields (Key Stats Section) ---
    const keyStatFieldsToMakeEditable = {
        'stat-ac': { path: 'keyStats.ac', isNumber: true },
        'stat-initiative': { path: 'keyStats.initiative' }, // string, e.g. +2
        'stat-bab': { path: 'keyStats.bab' }, // string, e.g. +5
        'stat-speed': { path: 'keyStats.speed' }, // string e.g. 30 ft
        'stat-wealth': { path: 'keyStats.wealth' }, // string e.g. 100 GP
        'stat-fortitude': { path: 'keyStats.saves.fortitude' },
        'stat-reflex': { path: 'keyStats.saves.reflex' },
        'stat-will': { path: 'keyStats.saves.will' },
        'stat-cmb': { path: 'keyStats.cmb' },
        'stat-cmd': { path: 'keyStats.cmd', isNumber: true }
    };

    for (const id in keyStatFieldsToMakeEditable) {
        const config = keyStatFieldsToMakeEditable[id];
        const valueElement = getElement(id);
        if (valueElement) {
            valueElement.addEventListener('click', (evt) => {
                if (evt.target.tagName === 'INPUT' || valueElement.classList.contains('editing')) return;
                makeEditable(valueElement, config.path, config.isNumber || false);
            });
        }
    }

    // Specific handling for HP current and max
    const hpCurrentElement = getElement('stat-hp-current');
    if (hpCurrentElement) {
        hpCurrentElement.addEventListener('click', (evt) => {
            if (evt.target.tagName === 'INPUT' || hpCurrentElement.classList.contains('editing')) return;
            makeEditable(hpCurrentElement, 'keyStats.hp.current', true, () => {
                // Ensure current HP doesn't exceed max HP after editing current
                if (characterData.keyStats.hp.current > characterData.keyStats.hp.max) {
                    characterData.keyStats.hp.current = characterData.keyStats.hp.max;
                    setText('stat-hp-current', characterData.keyStats.hp.current);
                    // No need to save again here, as makeEditable already saved.
                    // If we want to be super safe, we could re-save, but it might cause a loop if not careful.
                }
            });
        });
    }

    const hpMaxElement = getElement('stat-hp-max');
    if (hpMaxElement) {
        hpMaxElement.addEventListener('click', (evt) => {
            if (evt.target.tagName === 'INPUT' || hpMaxElement.classList.contains('editing')) return;
            makeEditable(hpMaxElement, 'keyStats.hp.max', true, () => {
                // Ensure current HP doesn't exceed new max HP
                if (characterData.keyStats.hp.current > characterData.keyStats.hp.max) {
                    characterData.keyStats.hp.current = characterData.keyStats.hp.max;
                    setText('stat-hp-current', characterData.keyStats.hp.current);
                    // This change (to current) needs to be saved if it happened.
                    // We can call saveCharacterData here, but makeEditable will also call it.
                    // To avoid double saves, makeEditable's onSaveCallback is a good place, 
                    // but it means we might display an invalid state briefly if current was > new max.
                    // For simplicity now, we rely on the save from makeEditable for the maxHP change.
                    // A more robust solution might involve a setter function for hp.max that handles this logic.
                }
                 // Also, ensure maxHP is not negative
                if (characterData.keyStats.hp.max < 0) {
                    characterData.keyStats.hp.max = 0;
                    setText('stat-hp-max', characterData.keyStats.hp.max);
                    if (characterData.keyStats.hp.current > 0) { // if max became 0, current must also be 0
                         characterData.keyStats.hp.current = 0;
                         setText('stat-hp-current', characterData.keyStats.hp.current);
                    }
                }
                // Re-render hp (current might have changed)
                setText('stat-hp-current', characterData.keyStats.hp.current);
                setText('stat-hp-max', characterData.keyStats.hp.max);
            });
        });
    }
/*
    // --- Inline Editable Fields (Key Stats Section) ---
    // ... (key stat fields event listeners) ...
    const hpMaxElement = getElement('stat-hp-max');
    if (hpMaxElement) {
        hpMaxElement.addEventListener('click', (evt) => {
            if (evt.target.tagName === 'INPUT' || hpMaxElement.classList.contains('editing')) return;
            makeEditable(hpMaxElement, 'keyStats.hp.max', true, () => {
                // Ensure current HP doesn't exceed new max HP
                if (characterData.keyStats.hp.current > characterData.keyStats.hp.max) {
                    characterData.keyStats.hp.current = characterData.keyStats.hp.max;
                    setText('stat-hp-current', characterData.keyStats.hp.current);
                }
                 // Also, ensure maxHP is not negative
                if (characterData.keyStats.hp.max < 0) {
                    characterData.keyStats.hp.max = 0;
                    setText('stat-hp-max', characterData.keyStats.hp.max);
                    if (characterData.keyStats.hp.current > 0) {
                         characterData.keyStats.hp.current = 0;
                         setText('stat-hp-current', characterData.keyStats.hp.current);
                    }
                }
                setText('stat-hp-current', characterData.keyStats.hp.current);
                setText('stat-hp-max', characterData.keyStats.hp.max);
            });
        });
    }
    // END OF KEY STATS EDITABLE LISTENERS
*/
    // --- Point Buy Calculator Modal Button Listeners ---
    const togglePointBuyBtn = getElement('toggle-point-buy-btn');
    if (togglePointBuyBtn) {
        togglePointBuyBtn.addEventListener('click', () => {
            const modal = getElement('point-buy-modal');
            if (modal.classList.contains('hidden')) {
                openPointBuyModal();
            } else {
                closePointBuyModal();
            }
        });
    }

    const pbcCloseBtn = getElement('point-buy-close-btn');
    if (pbcCloseBtn) pbcCloseBtn.addEventListener('click', closePointBuyModal);

    const pbcResetBtn = getElement('point-buy-reset-btn');
    if (pbcResetBtn) {
        pbcResetBtn.addEventListener('click', () => {
            const selectedTotalDropdown = getElement('point-buy-total-points');
            let points = parseInt(selectedTotalDropdown.value, 10);
            if (selectedTotalDropdown.value === 'custom') {
                points = parseInt(getElement('point-buy-custom-total').value, 10) || 15; // Default to 15 if custom is NaN
            }
            if (isNaN(points) || points <=0) points = 15; // Default if parsed value is bad
            resetPBCState(points);
        });
    }

    const pbcApplyBtn = getElement('point-buy-apply-btn');
    if (pbcApplyBtn) pbcApplyBtn.addEventListener('click', handleApplyPointBuy);

    const pbcTotalPointsSelect = getElement('point-buy-total-points');
    const pbcCustomTotalInput = getElement('point-buy-custom-total');

    if (pbcTotalPointsSelect) {
        pbcTotalPointsSelect.addEventListener('change', () => {
            if (pbcTotalPointsSelect.value === 'custom') {
                pbcCustomTotalInput.classList.remove('hidden');
                pbcCustomTotalInput.focus();
                // Value from custom input will trigger reset via its own change listener
            } else {
                pbcCustomTotalInput.classList.add('hidden');
                resetPBCState(parseInt(pbcTotalPointsSelect.value, 10));
            }
        });
    }
    if (pbcCustomTotalInput) {
        pbcCustomTotalInput.addEventListener('change', () => {
            const customPoints = parseInt(pbcCustomTotalInput.value, 10);
            if (!isNaN(customPoints) && customPoints > 0) {
                resetPBCState(customPoints);
            } else {
                displayMessage("Invalid custom points value. Using 15 points.", "warning");
                resetPBCState(15);
                pbcCustomTotalInput.value = 15;
            }
        });
    }

    const pbcAttributesContainer = getElement('point-buy-attributes-container');
    if (pbcAttributesContainer) {
        pbcAttributesContainer.addEventListener('click', (e) => {
            if (!e.target.classList.contains('pb-btn')) return;

            const statKey = e.target.dataset.stat;
            if (!statKey || !pbcState.baseScores.hasOwnProperty(statKey)) return;

            let currentScore = pbcState.baseScores[statKey];
            const isIncrease = e.target.classList.contains('pb-increase');

            if (isIncrease) {
                if (currentScore < PBC_MAX_SCORE_BUY) {
                    pbcState.baseScores[statKey]++;
                }
            } else { // Decrease
                if (currentScore > PBC_MIN_SCORE) {
                    pbcState.baseScores[statKey]--;
                }
            }
            updatePBCDisplays();
        });
        // Add new listener for racial mod inputs within the attribute rows
        pbcAttributesContainer.addEventListener('input', (e) => {
            if (!e.target.classList.contains('racial-mod-inline-input')) return;
            
            const statKey = e.target.dataset.stat;
            if (!statKey || !pbcState.racialMods.hasOwnProperty(statKey)) return;

            const modValue = parseInt(e.target.value, 10);
            if (isNaN(modValue)) {
                pbcState.racialMods[statKey] = 0;
                // e.target.value = 0; // Optionally reset field if NaN
            } else {
                pbcState.racialMods[statKey] = modValue;
            }
            updatePBCDisplays(); // This will update the final score in the row and overall points
        });
    }

    // --- Inventory Section Listeners ---
    const addInventoryItemBtn = getElement('add-inventory-item-btn');
    if (addInventoryItemBtn) {
        addInventoryItemBtn.addEventListener('click', () => {
            if (!isOwner || !document.body.classList.contains('edit-mode-active')) {
                displayMessage("Items can only be added in Edit Mode.", "info");
                return;
            }
            openItemDetailModal(null); // Open modal for a new item
        });
    }

    const itemModalSaveBtn = getElement('item-modal-save-btn');
    if (itemModalSaveBtn) {
        itemModalSaveBtn.addEventListener('click', handleSaveItemFromModal);
    }

    const itemModalCloseBtn = getElement('item-modal-close-btn');
    if (itemModalCloseBtn) {
        itemModalCloseBtn.addEventListener('click', closeItemDetailModal);
    }

    // Inline editable currency fields
    const currencyFields = {
        'currency-pp': 'inventory.money.pp',
        'currency-gp': 'inventory.money.gp',
        'currency-sp': 'inventory.money.sp',
        'currency-cp': 'inventory.money.cp',
    };
    for (const id in currencyFields) {
        const element = getElement(id);
        const dataPath = currencyFields[id];
        if (element) {
            element.addEventListener('click', (evt) => {
                if (evt.target.tagName === 'INPUT' || element.classList.contains('editing')) return;
                makeEditable(element, dataPath, true, renderInventory); // isNumber=true, onSaveCallback=renderInventory
            });
        }
    }
    // Note: Event listeners for individual item edit/delete/equipped are handled within renderInventory when items are created.
    // --- END OF INVENTORY SECTION LISTENERS ---

    // --- Attacks Section Listeners ---
    const addAttackBtn = getElement('add-attack-btn');
    if (addAttackBtn) {
        addAttackBtn.addEventListener('click', () => {
            if (!isOwner || !document.body.classList.contains('edit-mode-active')) {
                displayMessage("Attacks can only be added in Edit Mode.", "info");
                return;
            }
            openAttackDetailModal(null); // Open modal for a new attack
        });
    }

    const attackModalSaveBtn = getElement('attack-modal-save-btn');
    if (attackModalSaveBtn) {
        attackModalSaveBtn.addEventListener('click', handleSaveAttackFromModal);
    }

    const attackModalCloseBtn = getElement('attack-modal-close-btn');
    if (attackModalCloseBtn) {
        attackModalCloseBtn.addEventListener('click', closeAttackDetailModal);
    }
    // --- END OF ATTACKS SECTION LISTENERS ---

    // --- Class Progression Select Listeners ---
    const classMechFields = {
        'classmech-hit-die': 'classMechanics.hitDie',
        'classmech-bab-progression': 'classMechanics.babProgression',
        'classmech-fort-save': 'classMechanics.fortitudeSave',
        'classmech-ref-save': 'classMechanics.reflexSave',
        'classmech-will-save': 'classMechanics.willSave',
        'classmech-hp-ability': 'classMechanics.hpAbilityModStat',
        'classmech-ac-ability1': 'classMechanics.acAbilityModStat1',
        'classmech-ac-ability2': 'classMechanics.acAbilityModStat2'
    };

    for (const id in classMechFields) {
        const selectElement = getElement(id);
        const dataPath = classMechFields[id];
        if (selectElement) {
            selectElement.addEventListener('change', async (event) => {
                if (!isOwner) return; // Should be disabled anyway by renderClassProgression
                setNestedValue(characterData, dataPath, event.target.value);
                // When these change, Key Stats (BAB, Saves) need to be re-rendered.
                // Potentially other things too if HP calculation gets automated.
                renderKeyStats(); 
                // renderAttributes(); // If BAB affects CMB/CMD directly displayed with attributes
                // renderAttacks(); // If attacks auto-calculate from BAB
                await saveCharacterData();
                displayMessage('Class progression updated.', 'success');
            });
        }
    }
    // --- END OF CLASS PROGRESSION LISTENERS ---

    // --- Key Stats AC Component Listeners ---
    const acComponentFields = {
        'stat-ac-armor': 'keyStats.acArmor',
        'stat-ac-shield': 'keyStats.acShield',
        'stat-ac-misc': 'keyStats.acMisc'
    };
    for (const id in acComponentFields) {
        const element = getElement(id);
        const dataPath = acComponentFields[id];
        if (element) {
            element.addEventListener('click', (evt) => {
                if (evt.target.tagName === 'INPUT' || element.classList.contains('editing')) return;
                makeEditable(element, dataPath, true, renderKeyStats); // isNumber=true, callback re-renders Key Stats for AC calc
            });
        }
    }
    // --- END OF CLASS PROGRESSION LISTENERS (this comment is slightly misplaced, should be after AC component listeners too) ---
}

// --- UI Interaction Functions ---
function toggleEditMode() {
    if (!isOwner) return;
    const isActive = document.body.classList.toggle('edit-mode-active');
    updateEditModeButton(isActive);

    const masterAddButtons = [
        getElement('add-custom-skill-btn'),
        getElement('add-feat-btn'),
        getElement('add-language-btn'),
        getElement('add-trait-btn') // Added traits button
    ].filter(btn => btn); 

    if (isActive) { 
        masterAddButtons.forEach(btn => btn.classList.remove('hidden'));
        displayMessage("Edit mode enabled.", "info");
    } else { 
        masterAddButtons.forEach(btn => btn.classList.add('hidden'));
        displayMessage("Edit mode disabled.", "info");
    }
    // Specifically re-render skills to update their editable states and visibility
    renderSkills(); 
}

function updateEditModeButton(isEditModeActive) {
    const iconEl = document.querySelector('#toggle-edit-mode-btn .edit-mode-icon');
    const textEl = document.querySelector('#toggle-edit-mode-btn .edit-mode-text');
    if (iconEl && textEl) {
        if (isEditModeActive) {
            iconEl.textContent = 'done'; // Material icon for checkmark/done
            textEl.textContent = 'View';
        } else {
            iconEl.textContent = 'edit';
            textEl.textContent = 'Edit';
        }
    }
}

function makeEditable(element, dataPath, isNumber = false, onSaveCallback = null, isTextarea = false) { // Added isTextarea
    if (!element || !isOwner || !document.body.classList.contains('edit-mode-active')) return; 

    const originalContent = getNestedValue(characterData, dataPath) || ""; // Ensure originalContent is not null
    element.classList.add('editing');
    
    let inputElement;
    if (isTextarea) {
        inputElement = document.createElement('textarea');
        inputElement.rows = 4; // Default rows for textarea
        inputElement.className = 'editable-textarea'; // Add a class for styling
        // Apply similar styling as input, but allow for multi-line
        inputElement.style.minHeight = '80px'; // Example min-height
        inputElement.style.resize = 'vertical';
            } else {
        inputElement = document.createElement('input');
    inputElement.type = isNumber ? 'number' : 'text';
    inputElement.className = 'editable-input'; // Add a class for styling
        inputElement.style.minWidth = `${Math.max(30, element.offsetWidth)}px`;
    inputElement.style.maxWidth = `${element.offsetWidth + 10}px`;
        inputElement.style.textAlign = isNumber ? 'center' : 'left'; // Center numbers, left-align text
    }

    inputElement.value = originalContent;
    // Common styling for both input and textarea
    inputElement.style.backgroundColor = '#0d1117'; 
    inputElement.style.color = '#e0e0e0'; 
    inputElement.style.border = '1px solid #1873dc'; 
    inputElement.style.padding = '4px 6px'; // Increased padding slightly
    inputElement.style.borderRadius = '3px';
    inputElement.style.width = '100%'; // Make it take full width of parent for textarea

    element.innerHTML = ''; 
    element.appendChild(inputElement);
    inputElement.focus();
    inputElement.select(); 

    const saveChanges = async () => { 
        let newValue = inputElement.value;
        if (!isTextarea && isNumber) { // Only parse as int if not textarea and isNumber
            newValue = parseInt(newValue, 10); 
            if (isNaN(newValue)) newValue = parseInt(originalContent, 10) || 0; 
        }

        setNestedValue(characterData, dataPath, newValue);
        // For textarea, we might want to preserve line breaks in display. 
        // For now, simple textContent assignment, which might collapse multiple spaces/newlines.
        // Consider using innerHTML with replaced newlines if formatting is critical.
        element.textContent = newValue; 
        element.classList.remove('editing');
        
        const saveSuccess = await saveCharacterData(); 

        inputElement.removeEventListener('blur', saveChangesOnBlur);
        inputElement.removeEventListener('keydown', saveChangesOnEnterOrTab);
        
        if (saveSuccess && onSaveCallback) {
            onSaveCallback(); 
        }
    };
    
    const saveChangesOnBlur = () => { 
        // Timeout to allow potential click on another element (like a save button if we had one per field)
        // For textareas, blur often means the user is done, so we save.
        setTimeout(saveChanges, 100); 
    };
    const saveChangesOnEnterOrTab = (e) => {
        if (isTextarea && e.key === 'Enter' && e.shiftKey) {
            // For textarea, Shift+Enter might be used for newlines within the text area.
            // Let it behave normally. To save, user can blur or click outside.
            return; 
        }
        if (e.key === 'Enter' && !isTextarea) { // Enter saves for single-line inputs
            e.preventDefault(); // Prevent form submission if any
            saveChanges(); 
        }
        if (e.key === 'Tab') {
            // Tab will naturally move focus, triggering blur, which saves.
            // No specific handling needed unless we want to prevent default tab behavior.
        }
        if (e.key === 'Escape') {
            inputElement.value = originalContent; // Revert to original on escape
            element.textContent = originalContent; 
            element.classList.remove('editing');
            inputElement.removeEventListener('blur', saveChangesOnBlur);
            inputElement.removeEventListener('keydown', saveChangesOnEnterOrTab);
        }
    };

    inputElement.addEventListener('blur', saveChangesOnBlur);
    inputElement.addEventListener('keydown', saveChangesOnEnterOrTab);
}

function handleShareSheet() {
    if (!currentUser) { 
        displayMessage("Please sign in to share your sheet.", "warning");
        return;
    }
    if (!currentSheetId) {
        displayMessage("No active sheet to share. Please select or create a sheet.", "warning");
        return;
    }
    // Share link now includes ownerId (which is current userId) and currentSheetId
    const shareableLink = `${window.location.origin}${window.location.pathname}?ownerId=${userId}&sheetId=${currentSheetId}`;
    navigator.clipboard.writeText(shareableLink)
        .then(() => {
            displayMessage("Shareable link copied to clipboard!", "success");
        })
        .catch(err => {
            console.error("Failed to copy share link:", err);
            displayMessage("Could not copy link.", "error");
        });
}

async function loadSharedCharacterData(ownerId, sheetId) { // Takes ownerId and sheetId
    if (!auth.currentUser) { 
        displayMessage("You need to be logged in to view a shared sheet.", "info");
        characterData = getDefaultCharacterData(); 
        renderCharacterSheet();
        openAuthModal();
        return;
    }
    if (!ownerId || !sheetId) {
        displayMessage("Invalid share link (missing owner or sheet ID).", "error");
        characterData = getDefaultCharacterData();
        renderCharacterSheet();
        return;
    }
    console.log(`Loading shared sheet ID: ${sheetId} from owner ID: ${ownerId}`);
    
    // Determine if current logged-in user is the owner of this shared sheet
    isOwner = (auth.currentUser.uid === ownerId);
    if (isOwner) {
        document.body.classList.add('is-owner');
        getElement('toggle-edit-mode-btn')?.classList.remove('hidden');
    } else {
        document.body.classList.remove('is-owner');
        getElement('toggle-edit-mode-btn')?.classList.add('hidden');
    }
    document.body.classList.remove('edit-mode-active'); // Ensure edit mode is off when loading any sheet initially
    updateEditModeButton(false);

    currentSheetId = sheetId; // Set the global currentSheetId

    const charSheetRef = doc(db, "users", ownerId, "characterSheets", sheetId);
    
    if (characterSheetUnsubscribe) {
        characterSheetUnsubscribe();
        characterSheetUnsubscribe = null; 
    }

    try {
        const docSnap = await getDoc(charSheetRef); // Use getDoc for shared, onSnapshot for own usually
        if (docSnap.exists()) {
            console.log("Shared character data loaded:", docSnap.data());
            characterData = { ...getDefaultCharacterData(), ...docSnap.data() }; 
            renderCharacterSheet();
            if(!isOwner) displayMessage(`Viewing shared sheet. Changes will not be saved.`, "info");
        } else {
            console.log("No shared character data found for this ID.");
            characterData = getDefaultCharacterData(); 
            renderCharacterSheet();
            displayMessage("Shared sheet not found.", "error");
        }
    } catch (error) {
        console.error("Error loading shared character data:", error);
        characterData = getDefaultCharacterData();
        renderCharacterSheet();
        displayMessage("Error loading shared sheet.", "error");
    }
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
    const modal = getElement('settings-modal');
    if (!modal) return;

    // Load setting for Point Buy button visibility
    const showPointBuyBtnSetting = localStorage.getItem('settingShowPointBuyButton') !== 'false'; // Default to true if not set
    const checkbox = getElement('setting-show-point-buy-btn');
    if (checkbox) checkbox.checked = showPointBuyBtnSetting;
    
    // Placeholder for loading theme or other settings

    getElement('settings-modal-message').classList.add('hidden'); // Hide message on open
    modal.classList.remove('hidden');
}

function closeSettingsModal() {
    const modal = getElement('settings-modal');
    if (modal) modal.classList.add('hidden');
}

function applyPointBuyButtonVisibility() {
    const showPointBuyBtn = localStorage.getItem('settingShowPointBuyButton') !== 'false';
    const pointBuyBtn = getElement('toggle-point-buy-btn');
    if (pointBuyBtn) {
        if (showPointBuyBtn) {
            pointBuyBtn.classList.remove('hidden');
        } else {
            pointBuyBtn.classList.add('hidden');
        }
    }
}

async function handleSaveSettings() {
    // Save Point Buy button visibility setting
    const showPointBuyBtnCheckbox = getElement('setting-show-point-buy-btn');
    if (showPointBuyBtnCheckbox) {
        localStorage.setItem('settingShowPointBuyButton', showPointBuyBtnCheckbox.checked);
        applyPointBuyButtonVisibility(); // Apply immediately
    }

    // Placeholder for saving theme or other settings

    const messageDiv = getElement('settings-modal-message');
    messageDiv.textContent = "Settings saved!";
    messageDiv.classList.remove('hidden');
    setTimeout(() => {
        messageDiv.classList.add('hidden');
        closeSettingsModal(); 
    }, 1500); 
}

// --- End Settings Modal Functions ---

async function handleAddLanguage() { // Added async here
    if (!isOwner || !document.body.classList.contains('edit-mode-active')) {
        displayMessage("Languages can only be added in Edit Mode.", "info");
        return;
    }

    const langName = prompt("Enter the name of the language:");
    if (!langName || langName.trim() === "") {
        displayMessage("Language name cannot be empty.", "warning");
        return;
    }

    const trimmedLangName = langName.trim();

    if (!characterData.capabilities.languages) {
        characterData.capabilities.languages = [];
    }

    if (characterData.capabilities.languages.includes(trimmedLangName)) {
        displayMessage(`Language "${trimmedLangName}" is already known.`, "info");
        return;
    }

    characterData.capabilities.languages.push(trimmedLangName);
    characterData.capabilities.languages.sort(); // Keep alphabetical

    renderCapabilities(); 
    const success = await saveCharacterData();
    if (success) {
        displayMessage(`Language "${trimmedLangName}" added.`, "success");
            } else {
        // Rollback
        characterData.capabilities.languages = characterData.capabilities.languages.filter(l => l !== trimmedLangName);
        renderCapabilities();
        displayMessage("Failed to save new language.", "error");
    }
}

function handleChangeImage() {
    console.log("handleChangeImage called - STUB");
    displayMessage("Change Image functionality not yet implemented.", "info");
    // Actual implementation steps:
    // if (!isOwner) { displayMessage(\"View only. Cannot change image.\", \"info\"); return; }
    // const newImageUrl = prompt(\"Enter new image URL:\", characterData.overview.imageUrl);
    // if (newImageUrl) {
    //     characterData.overview.imageUrl = newImageUrl;
    //     renderOverview(); 
    //     saveCharacterData();
    // }
}

// Sheets Manager Functions
function openSheetsManagerModal() {
    if (!currentUser) { // Should only be callable by logged-in user
        displayMessage("Please log in to manage your sheets.", "info");
        return;
    }
    const modal = getElement('sheets-manager-modal');
    if (modal) modal.classList.remove('hidden');
    loadAndRenderUserSheets();
}

function closeSheetsManagerModal() {
    const modal = getElement('sheets-manager-modal');
    if (modal) modal.classList.add('hidden');
}

async function loadAndRenderUserSheets() {
    if (!currentUser || !userId) return;

    const sheetsListContainer = getElement('sheets-list-container');
    const noSheetsMessage = getElement('no-sheets-message');
    if (!sheetsListContainer || !noSheetsMessage) return;

    sheetsListContainer.innerHTML = '<p class="text-center">Loading sheets...</p>'; // Loading indicator
    noSheetsMessage.classList.add('hidden');

    try {
        const sheetsCollectionRef = collection(db, "users", userId, "characterSheets");
        const querySnapshot = await getDocs(sheetsCollectionRef);
        const sheets = [];
        querySnapshot.forEach((doc) => {
            sheets.push({ id: doc.id, ...doc.data() });
        });

        if (sheets.length === 0) {
            noSheetsMessage.classList.remove('hidden');
            sheetsListContainer.innerHTML = '';
        } else {
            renderSheetList(sheets, sheetsListContainer);
        }
    } catch (error) {
        console.error("Error loading user sheets:", error);
        displayMessage("Could not load your sheets.", "error");
        sheetsListContainer.innerHTML = '<p class="text-center text-red-500">Error loading sheets.</p>';
    }
}

function renderSheetList(sheets, container) {
    container.innerHTML = ''; 
    sheets.forEach(sheet => {
        const sheetName = sheet.overview?.name || 'Unnamed Sheet';
        const itemDiv = document.createElement('div');
        itemDiv.className = 'sheet-item flex justify-between items-center p-3 border-b border-[#243447] hover:bg-[#243447] transition-colors';
        itemDiv.innerHTML = `
            <span class="sheet-name text-lg text-[#e0e0e0]">${sheetName}</span>
            <div class="space-x-2">
                <button class="action-button-sm open-sheet-btn" data-sheet-id="${sheet.id}">Open</button>
                <button class="action-button-sm destructive-btn-sm delete-sheet-btn" data-sheet-id="${sheet.id}">Delete</button>
            </div>
        `;
        container.appendChild(itemDiv);
    });
}

async function handleCreateNewSheet() {
    if (!currentUser || !userId) return;
    displayMessage("Creating new sheet...", "info");
    try {
        const defaultData = getDefaultCharacterData();
        defaultData.overview.name = "New Character Sheet"; // Default name
        defaultData.createdAt = serverTimestamp();
        defaultData.updatedAt = serverTimestamp();

        const sheetsCollectionRef = collection(db, "users", userId, "characterSheets");
        const docRef = await addDoc(sheetsCollectionRef, defaultData);
        console.log("New sheet created with ID:", docRef.id);
        currentSheetId = docRef.id;
        
        isOwner = true;
        document.body.classList.add('is-owner');
        getElement('toggle-edit-mode-btn')?.classList.remove('hidden');
        
        // --- START: Automatically enable edit mode for new sheet ---
        document.body.classList.add('edit-mode-active');
        updateEditModeButton(true); 
        // --- END: Automatically enable edit mode for new sheet ---

        await loadCharacterData(); 
        closeSheetsManagerModal();
        displayMessage(`Sheet "${defaultData.overview.name}" created. You are in Edit Mode.`, "success"); // Updated message
    } catch (error) {
        console.error("Error creating new sheet:", error);
        displayMessage("Failed to create new sheet.", "error");
    }
}

function handleOpenSheet(sheetId) {
    if (!sheetId) return;
    console.log("Opening sheet:", sheetId);
    currentSheetId = sheetId;
    isOwner = true; 
    document.body.classList.add('is-owner');
    const toggleBtn = getElement('toggle-edit-mode-btn');
    if (toggleBtn) toggleBtn.classList.remove('hidden');
    
    document.body.classList.remove('edit-mode-active'); // Start in view mode when opening existing
    updateEditModeButton(false);

    loadCharacterData(); // loadCharacterData will trigger pulse if applicable
    closeSheetsManagerModal();
}

async function handleDeleteSheet(sheetId) {
    if (!currentUser || !userId || !sheetId) return;
    try {
        const sheetRef = doc(db, "users", userId, "characterSheets", sheetId);
        await deleteDoc(sheetRef);
        displayMessage("Sheet deleted successfully.", "success");
        if (currentSheetId === sheetId) { // If the deleted sheet was the active one
            currentSheetId = null;
            characterData = getDefaultCharacterData();
            renderCharacterSheet();
            displayMessage("Active sheet was deleted. Select or create a new sheet.", "info");
        }
        loadAndRenderUserSheets(); // Refresh the list in the manager
    } catch (error) {
        console.error("Error deleting sheet:", error);
        displayMessage("Failed to delete sheet.", "error");
    }
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

function toggleSkillsSection() {
    if (document.body.classList.contains('edit-mode-active')) {
        displayMessage("Section collapsing is disabled while in Edit Mode.", "info");
        return;
    }
    isSkillsSectionExpanded = !isSkillsSectionExpanded;
    const skillsContent = getElement('skills-content-area');
    const toggleIcon = document.querySelector('.skills-toggle-icon');
    if (skillsContent && toggleIcon) {
        if (isSkillsSectionExpanded) {
            skillsContent.style.maxHeight = skillsContent.scrollHeight + "px"; // Expand
            skillsContent.style.opacity = "1";
            toggleIcon.textContent = 'expand_less';
        } else {
            skillsContent.style.maxHeight = "0px"; // Collapse
            skillsContent.style.opacity = "0";
            toggleIcon.textContent = 'expand_more';
        }
    }
    // Persist state if desired (e.g., in localStorage or characterData)
}

// Function to apply initial state of collapsible section (call this in renderCharacterSheet or after sheet load)
function applySkillsSectionInitialState() {
    const skillsContent = getElement('skills-content-area');
    const toggleIcon = document.querySelector('.skills-toggle-icon');
    if (skillsContent && toggleIcon) {
        if (isSkillsSectionExpanded) {
            // Temporarily set to auto to measure, then to scrollHeight for animation
            skillsContent.style.maxHeight = 'none'; 
            const scrollH = skillsContent.scrollHeight;
            skillsContent.style.maxHeight = scrollH + "px";
            skillsContent.style.opacity = "1";
            toggleIcon.textContent = 'expand_less';
        } else {
            skillsContent.style.maxHeight = "0px";
            skillsContent.style.opacity = "0";
            toggleIcon.textContent = 'expand_more';
        }
    }
}

// Placeholder for custom skill modal logic
function handleAddCustomSkillModal() {
    if (!isOwner || !document.body.classList.contains('edit-mode-active')) {
        displayMessage("Enable Edit Mode to add custom skills.", "info");
        return;
    }
    displayMessage("Add Custom Skill modal/form would open here.", "info");
    // 1. Open a modal to get skill name and base ability.
    // 2. Call a function like `addCustomSkill(name, abilityKey)`.
}

// Helper to calculate ability modifier from score
function calculateAbilityModifier(score) {
    const numScore = parseInt(score, 10);
    if (isNaN(numScore)) return 0;
    return Math.floor((numScore - 10) / 2);
}

// Helper to format modifier as string (e.g., +2, -1, +0)
function formatModifier(modifier) {
    return modifier >= 0 ? `+${modifier}` : String(modifier);
}

// Calculate and update bonuses for a single skill object
function calculateAndUpdateSingleSkill(skill, attributes) {
    // Ensure the skill has a valid selectedAbility value to prevent runtime errors
    const safeSelectedAbility = (skill && typeof skill.selectedAbility === "string" && skill.selectedAbility.trim().length > 0)
        ? skill.selectedAbility.toUpperCase() // Ensure it's uppercase for consistency
        : "STR"; // Default to STR (uppercase) when undefined or invalid

    // Persist the fallback on the skill object so future calls have it
    if (!skill.selectedAbility || skill.selectedAbility.trim().length === 0 || skill.selectedAbility !== safeSelectedAbility) {
        skill.selectedAbility = safeSelectedAbility;
    }

    // Convert to the expected lowercase 3-letter prefix (str, dex, con, int, wis, cha)
    const abilityKey = safeSelectedAbility.slice(0, 3).toLowerCase();
    const fullAbilityName = Object.keys(attributes).find(attrKey => attrKey.startsWith(abilityKey));
    
    let abilityScore = 10; // Default if attribute not found for some reason
    if (fullAbilityName && attributes[fullAbilityName]) {
        abilityScore = parseInt(attributes[fullAbilityName].score, 10);
    }
    
    skill.abilityMod = calculateAbilityModifier(abilityScore);
    
    const ranks = parseInt(skill.ranks, 10) || 0;
    // Evaluate miscBonus string if it's a string, otherwise use its numerical value
    const evaluatedMiscBonus = evaluateDynamicFieldValue(skill.miscBonus, characterData);
    
    let classSkillBonus = 0;
    if (skill.isClassSkill && ranks > 0) {
        classSkillBonus = 3;
    }
    
    skill.totalBonus = skill.abilityMod + ranks + evaluatedMiscBonus + classSkillBonus;
}

// Recalculate all skill bonuses based on current attributes and skill data
function recalculateAllSkillBonuses() {
    if (characterData && characterData.skills && characterData.attributes) {
        characterData.skills.forEach(skill => {
            calculateAndUpdateSingleSkill(skill, characterData.attributes);
        });
    }
}

// Function to actually delete a custom skill
async function handleDeleteCustomSkill(skillId) {
    if (!currentUser || !userId || !skillId) return;
    
    const skillIndex = characterData.skills.findIndex(s => s.id === skillId && s.isCustom);
    if (skillIndex === -1) {
        displayMessage("Could not find custom skill to delete.", "error");
        return;
    }

    characterData.skills.splice(skillIndex, 1);
    displayMessage(`Custom skill deleted.`, "success");
    renderSkills(); // Re-render the skills list
    await saveCharacterData();
}

async function handleAddFeat() { // Changed to async to await save
    if (!isOwner || !document.body.classList.contains('edit-mode-active')) {
        displayMessage("Feats can only be added in Edit Mode.", "info");
        return;
    }

    const featName = prompt("Enter the name of the feat:");
    if (!featName || featName.trim() === "") {
        displayMessage("Feat name cannot be empty.", "warning");
        return;
    }

    const featDescription = prompt("Enter a brief description for the feat (optional):");

    // Ensure feats array exists
    if (!characterData.feats) {
        characterData.feats = [];
    }

    const newFeat = {
        id: 'feat_' + Date.now().toString(), // Simple unique ID
        name: featName.trim(),
        description: featDescription ? featDescription.trim() : ""
    };

    characterData.feats.push(newFeat);
    renderFeats(); // Re-render the feats list
    const success = await saveCharacterData(); // Save changes to Firestore
    if (success) {
        displayMessage(`Feat "${newFeat.name}" added successfully.`, "success");
            } else {
        // If save failed, attempt to roll back the change (optional, or rely on next load)
        characterData.feats = characterData.feats.filter(f => f.id !== newFeat.id);
        renderFeats();
        displayMessage("Failed to save new feat. Please try again.", "error");
    }
}

async function handleEditFeat(featId) {
    if (!isOwner || !document.body.classList.contains('edit-mode-active') || !featId) {
        displayMessage("Cannot edit feat at this time.", "warning");
        return;
    }

    const featIndex = characterData.feats.findIndex(f => f.id === featId);
    if (featIndex === -1) {
        displayMessage("Feat not found for editing.", "error");
        return;
    }

    const feat = characterData.feats[featIndex];
    const currentName = feat.name;
    const currentDescription = feat.description;

    const newName = prompt("Edit feat name:", currentName);
    if (newName === null) return; // User cancelled

    const newDescription = prompt("Edit feat description:", currentDescription);
    if (newDescription === null) return; // User cancelled

    if (newName.trim() === "" && newDescription.trim() === "") {
        displayMessage("Feat name cannot be empty. No changes made.", "warning");
        return; // Do not save if both are effectively cleared or unchanged to empty
    }
    
    if (newName.trim() === currentName && newDescription.trim() === currentDescription) {
        displayMessage("No changes detected for the feat.", "info");
        return;
    }

    characterData.feats[featIndex].name = newName.trim();
    characterData.feats[featIndex].description = newDescription.trim();

    renderFeats();
    const success = await saveCharacterData();
    if (success) {
        displayMessage("Feat updated.", "success");
            } else {
        // Revert if save failed
        characterData.feats[featIndex].name = currentName;
        characterData.feats[featIndex].description = currentDescription;
        renderFeats();
        displayMessage("Failed to save feat update. Please try again.", "error");
    }
}

async function handleDeleteFeat(featId) {
    if (!isOwner || !document.body.classList.contains('edit-mode-active') || !featId) {
        displayMessage("Cannot delete feat at this time.", "warning");
        return;
    }

    const feat = characterData.feats.find(f => f.id === featId);
    if (!feat) {
        displayMessage("Feat not found for deletion.", "error");
        return;
    }

    if (confirm(`Are you sure you want to delete the feat "${feat.name}"?`)) {
        const originalFeats = JSON.parse(JSON.stringify(characterData.feats)); // Deep copy for rollback
        characterData.feats = characterData.feats.filter(f => f.id !== featId);
        renderFeats();
        const success = await saveCharacterData();
        if (success) {
            displayMessage(`Feat "${feat.name}" deleted.`, "success");
            } else {
            characterData.feats = originalFeats; // Rollback
            renderFeats();
            displayMessage("Failed to delete feat. Please try again.", "error");
        }
    }
}

async function handleAddSpell() {
    if (!isOwner || !document.body.classList.contains('edit-mode-active') || !characterData.spellcasting.enabled) {
        displayMessage("Spellcasting must be enabled and in Edit Mode to add spells.", "info");
        return;
    }
    openSpellDetailModal(null); // Open modal for a new spell
}

async function handleEditSpell(spellId) {
    if (!isOwner || !document.body.classList.contains('edit-mode-active') || !characterData.spellcasting.enabled || !spellId) {
        displayMessage("Cannot edit spell at this time.", "warning");
        return;
    }
    openSpellDetailModal(spellId); // Open modal for editing existing spell
}

async function handleDeleteSpell(spellId) {
    if (!isOwner || !document.body.classList.contains('edit-mode-active') || !characterData.spellcasting.enabled || !spellId) {
        displayMessage("Cannot delete spell at this time.", "warning");
        return;
    }

    const spell = characterData.spellcasting.spellsKnown.find(s => s.id === spellId);
    if (!spell) {
        displayMessage("Spell not found for deletion.", "error");
        return;
    }

    if (confirm(`Are you sure you want to delete the spell "${spell.name}" (Lvl ${spell.level})?`)) {
        const originalSpellsKnown = JSON.parse(JSON.stringify(characterData.spellcasting.spellsKnown)); // Deep copy

        characterData.spellcasting.spellsKnown = characterData.spellcasting.spellsKnown.filter(s => s.id !== spellId);
        // No need to re-sort here as filter preserves order from previously sorted array

        renderSpellcasting();
        const success = await saveCharacterData();
        if (success) {
            displayMessage(`Spell "${spell.name}" deleted.`, "success");
            } else {
            characterData.spellcasting.spellsKnown = originalSpellsKnown; // Rollback
            renderSpellcasting(); // Re-render with rolled back data
            displayMessage("Failed to delete spell. Please try again.", "error");
        }
    }
}

// --- Spell Detail Modal Functions ---
function openSpellDetailModal(spellId) {
    const modal = getElement('spell-detail-modal');
    if (!modal) return;

    const titleElement = getElement('spell-modal-title');
    const idInput = getElement('spell-modal-id');
    const nameInput = getElement('spell-modal-name');
    const levelInput = getElement('spell-modal-level');
    const schoolInput = getElement('spell-modal-school');
    const castingTimeInput = getElement('spell-modal-casting-time');
    const rangeInput = getElement('spell-modal-range');
    const compVCheckbox = getElement('spell-modal-comp-v');
    const compSCheckbox = getElement('spell-modal-comp-s');
    const compMCheckbox = getElement('spell-modal-comp-m');
    const compFCheckbox = getElement('spell-modal-comp-f');
    const compDFCheckbox = getElement('spell-modal-comp-df');
    const compXPCheckbox = getElement('spell-modal-comp-xp');
    const materialCostInput = getElement('spell-modal-material-cost');
    const durationInput = getElement('spell-modal-duration');
    const savingThrowInput = getElement('spell-modal-saving-throw');
    const spellResistanceInput = getElement('spell-modal-spell-resistance');
    const descriptionTextarea = getElement('spell-modal-description');
    const preparedInput = getElement('spell-modal-prepared');
    const usesInput = getElement('spell-modal-uses');
    const errorMessageDiv = getElement('spell-modal-error-message');

    errorMessageDiv.classList.add('hidden');
    errorMessageDiv.textContent = '';

    let spell = null;
    if (spellId) {
        spell = characterData.spellcasting.spellsKnown.find(s => s.id === spellId);
    }

    if (spell) {
        titleElement.textContent = `Edit Spell: ${spell.name}`;
        idInput.value = spell.id;
        nameInput.value = spell.name || '';
        levelInput.value = spell.level !== undefined ? spell.level : '';
        schoolInput.value = spell.school || '';
        castingTimeInput.value = spell.castingTime || '';
        rangeInput.value = spell.range || '';
        
        compVCheckbox.checked = spell.components?.V || false;
        compSCheckbox.checked = spell.components?.S || false;
        compMCheckbox.checked = spell.components?.M || false;
        compFCheckbox.checked = spell.components?.F || false;
        compDFCheckbox.checked = spell.components?.DF || false;
        compXPCheckbox.checked = spell.components?.XP || false;
        materialCostInput.value = spell.components?.materialCost || '';
        
        durationInput.value = spell.duration || '';
        savingThrowInput.value = spell.savingThrow || '';
        spellResistanceInput.value = spell.spellResistance || '';
        descriptionTextarea.value = spell.description || '';
        preparedInput.value = spell.prepared !== undefined ? spell.prepared : '0';
        usesInput.value = spell.uses !== undefined ? spell.uses : '0';
            } else {
        titleElement.textContent = 'Add New Spell';
        idInput.value = ''; // For a new spell
        nameInput.value = '';
        levelInput.value = '';
        schoolInput.value = '';
        castingTimeInput.value = '';
        rangeInput.value = '';
        compVCheckbox.checked = false;
        compSCheckbox.checked = false;
        compMCheckbox.checked = false;
        compFCheckbox.checked = false;
        compDFCheckbox.checked = false;
        compXPCheckbox.checked = false;
        materialCostInput.value = '';
        durationInput.value = '';
        savingThrowInput.value = '';
        spellResistanceInput.value = '';
        descriptionTextarea.value = '';
        preparedInput.value = '0';
        usesInput.value = '0';
    }
    // For now, all fields are editable when the modal is open.
    // We can add a pure read-only mode later if needed.
    modal.classList.remove('hidden');
}

function closeSpellDetailModal() {
    const modal = getElement('spell-detail-modal');
    if (modal) {
        modal.classList.add('hidden');
        // Optionally clear fields, though openSpellDetailModal re-populates or clears anyway
        getElement('spell-modal-error-message').classList.add('hidden');
        getElement('spell-modal-error-message').textContent = '';
    }
}

async function handleSaveSpellFromModal() {
    const id = getElement('spell-modal-id').value;
    const name = getElement('spell-modal-name').value.trim();
    const levelStr = getElement('spell-modal-level').value;
    const school = getElement('spell-modal-school').value.trim();
    const castingTime = getElement('spell-modal-casting-time').value.trim();
    const range = getElement('spell-modal-range').value.trim();
    const components = {
        V: getElement('spell-modal-comp-v').checked,
        S: getElement('spell-modal-comp-s').checked,
        M: getElement('spell-modal-comp-m').checked,
        F: getElement('spell-modal-comp-f').checked,
        DF: getElement('spell-modal-comp-df').checked,
        XP: getElement('spell-modal-comp-xp').checked,
        materialCost: getElement('spell-modal-material-cost').value.trim()
    };
    const duration = getElement('spell-modal-duration').value.trim();
    const savingThrow = getElement('spell-modal-saving-throw').value.trim();
    const spellResistance = getElement('spell-modal-spell-resistance').value.trim();
    const description = getElement('spell-modal-description').value.trim();
    const preparedStr = getElement('spell-modal-prepared').value;
    const usesStr = getElement('spell-modal-uses').value;
    const errorMessageDiv = getElement('spell-modal-error-message');

    if (!name) {
        errorMessageDiv.textContent = "Spell name is required.";
        errorMessageDiv.classList.remove('hidden');
        return;
    }
    const level = parseInt(levelStr, 10);
    if (isNaN(level) || level < 0 || level > 9) {
        errorMessageDiv.textContent = "Spell level must be a number between 0 and 9.";
        errorMessageDiv.classList.remove('hidden');
        return;
    }
    const prepared = parseInt(preparedStr, 10) || 0;
    const uses = parseInt(usesStr, 10) || 0;

    errorMessageDiv.classList.add('hidden');

    const spellData = {
        name, level, school, castingTime, range, components, duration, 
        savingThrow, spellResistance, description, prepared, uses
    };

    if (id) { // Existing spell
        const spellIndex = characterData.spellcasting.spellsKnown.findIndex(s => s.id === id);
        if (spellIndex > -1) {
            characterData.spellcasting.spellsKnown[spellIndex] = {
                ...characterData.spellcasting.spellsKnown[spellIndex], // Keep original ID and any other non-edited fields
                ...spellData
            };
            } else {
            console.error("Spell ID not found for update:", id);
            displayMessage("Error updating spell: ID not found.", "error");
            return;
        }
    } else { // New spell
        spellData.id = 'spell_' + Date.now().toString();
        if (!characterData.spellcasting.spellsKnown) {
            characterData.spellcasting.spellsKnown = [];
        }
        characterData.spellcasting.spellsKnown.push(spellData);
    }

    characterData.spellcasting.spellsKnown.sort((a, b) => {
        if (a.level !== b.level) return a.level - b.level;
        return a.name.localeCompare(b.name);
    });

    renderSpellcasting();
    const success = await saveCharacterData();
    if (success) {
        displayMessage(`Spell "${name}" saved.`, "success");
        closeSpellDetailModal();
            } else {
        displayMessage("Failed to save spell.", "error");
        // More complex rollback might be needed for production
    }
}

// --- End Spell Detail Modal Functions ---

async function handleDeleteLanguage(langName) {
    if (!isOwner || !document.body.classList.contains('edit-mode-active') || !langName) {
        displayMessage("Cannot delete language at this time.", "warning");
        return;
    }

    if (confirm(`Are you sure you want to delete the language "${langName}"?`)) {
        const originalLanguages = [...characterData.capabilities.languages];
        characterData.capabilities.languages = characterData.capabilities.languages.filter(l => l !== langName);
        // Already sorted, filter preserves order

        renderCapabilities();
        const success = await saveCharacterData();
        if (success) {
            displayMessage(`Language "${langName}" deleted.`, "success");
            } else {
            characterData.capabilities.languages = originalLanguages;
            renderCapabilities();
            displayMessage("Failed to delete language.", "error");
        }
    }
}

// --- Traits and Drawbacks Functions (NEW) ---
function renderTraitsAndDrawbacks() {
    const listContainer = getElement('traits-drawbacks-list');
    if (!listContainer) return;

    listContainer.innerHTML = ''; // Clear previous

    if (!characterData.capabilities.traitsDrawbacks || characterData.capabilities.traitsDrawbacks.length === 0) {
        listContainer.innerHTML = '<li class="text-[#93acc8]">No traits or drawbacks added.</li>';
        return;
    }

    const editModeActive = isOwner && document.body.classList.contains('edit-mode-active');

    characterData.capabilities.traitsDrawbacks.forEach(item => {
        const li = document.createElement('li');
        li.className = 'trait-drawback-item flex justify-between items-start py-1.5 border-b border-[#243447] last:border-b-0';
        li.dataset.itemId = item.id; // Assuming items will have an ID like feats/spells

        const itemDetails = document.createElement('div');
        itemDetails.innerHTML = `<strong class="text-[#e0e0e0]">${item.name || "Unnamed Item"}</strong><p class="text-xs text-[#b0c4de]">${item.description || "No description."}</p>`;
        li.appendChild(itemDetails);

        if (editModeActive) {
            const controlsDiv = document.createElement('div');
            controlsDiv.className = 'item-controls flex-shrink-0 ml-2 space-x-1';

            const editBtn = document.createElement('button');
            editBtn.className = 'action-button-xs owner-edit-btn material-icons';
            editBtn.textContent = 'edit';
            editBtn.title = 'Edit Trait/Drawback';
            editBtn.onclick = () => handleEditTraitOrDrawback(item.id);
            controlsDiv.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'action-button-xs destructive-btn-xs owner-edit-btn material-icons';
            deleteBtn.textContent = 'delete';
            deleteBtn.title = 'Delete Trait/Drawback';
            deleteBtn.onclick = () => handleDeleteTraitOrDrawback(item.id);
            controlsDiv.appendChild(deleteBtn);
            
            li.appendChild(controlsDiv);
        }
        listContainer.appendChild(li);
    });
}

async function handleAddTraitOrDrawback() {
    if (!isOwner || !document.body.classList.contains('edit-mode-active')) {
        displayMessage("Traits/Drawbacks can only be added in Edit Mode.", "info");
        return;
    }

    const itemName = prompt("Enter the name of the Trait or Drawback:");
    if (!itemName || itemName.trim() === "") {
        displayMessage("Name cannot be empty.", "warning");
        return;
    }
    const itemDescription = prompt("Enter a brief description (optional):");

    if (!characterData.capabilities.traitsDrawbacks) {
        characterData.capabilities.traitsDrawbacks = [];
    }

    const newItem = {
        id: 'trait_' + Date.now().toString(),
        name: itemName.trim(),
        description: itemDescription ? itemDescription.trim() : ""
    };

    characterData.capabilities.traitsDrawbacks.push(newItem);
    characterData.capabilities.traitsDrawbacks.sort((a,b) => a.name.localeCompare(b.name));

    renderTraitsAndDrawbacks();
    const success = await saveCharacterData();
    if (success) {
        displayMessage(`"${newItem.name}" added.`, "success");
            } else {
        characterData.capabilities.traitsDrawbacks = characterData.capabilities.traitsDrawbacks.filter(i => i.id !== newItem.id);
        renderTraitsAndDrawbacks();
        displayMessage("Failed to save item.", "error");
    }
}

async function handleEditTraitOrDrawback(itemId) {
    if (!isOwner || !document.body.classList.contains('edit-mode-active') || !itemId) return;

    const itemIndex = characterData.capabilities.traitsDrawbacks.findIndex(i => i.id === itemId);
    if (itemIndex === -1) {
        displayMessage("Item not found.", "error");
        return;
    }
    const item = characterData.capabilities.traitsDrawbacks[itemIndex];
    const oldName = item.name;
    const oldDesc = item.description;

    const newName = prompt("Edit name:", item.name);
    if (newName === null) return; // Cancelled
    const newDescription = prompt("Edit description:", item.description);
    if (newDescription === null) return; // Cancelled

    if (newName.trim() === "") {
        displayMessage("Name cannot be empty.", "warning");
        return;
    }

    characterData.capabilities.traitsDrawbacks[itemIndex].name = newName.trim();
    characterData.capabilities.traitsDrawbacks[itemIndex].description = newDescription.trim();
    characterData.capabilities.traitsDrawbacks.sort((a,b) => a.name.localeCompare(b.name));

    renderTraitsAndDrawbacks();
    const success = await saveCharacterData();
    if (success) {
        displayMessage("Item updated.", "success");
            } else {
        characterData.capabilities.traitsDrawbacks[itemIndex].name = oldName;
        characterData.capabilities.traitsDrawbacks[itemIndex].description = oldDesc;
        characterData.capabilities.traitsDrawbacks.sort((a,b) => a.name.localeCompare(b.name));
        renderTraitsAndDrawbacks();
        displayMessage("Failed to save update.", "error");
    }
}

async function handleDeleteTraitOrDrawback(itemId) {
    if (!isOwner || !document.body.classList.contains('edit-mode-active') || !itemId) return;

    const item = characterData.capabilities.traitsDrawbacks.find(i => i.id === itemId);
    if (!item) return;

    if (confirm(`Delete "${item.name}"?`)) {
        const originalItems = JSON.parse(JSON.stringify(characterData.capabilities.traitsDrawbacks));
        characterData.capabilities.traitsDrawbacks = characterData.capabilities.traitsDrawbacks.filter(i => i.id !== itemId);
        
        renderTraitsAndDrawbacks();
        const success = await saveCharacterData();
        if (success) {
            displayMessage(`"${item.name}" deleted.`, "success");
            } else {
            characterData.capabilities.traitsDrawbacks = originalItems;
            renderTraitsAndDrawbacks();
            displayMessage("Failed to delete item.", "error");
        }
    }
}
// --- End Traits and Drawbacks Functions ---

// --- End Point Buy Calculator Logic ---

// --- Inventory Functions ---
function calculateEncumbrance(strengthScore) {
    const str = parseInt(strengthScore, 10) || 10;
    // Simplified encumbrance: Light <= STR * 5, Medium <= STR * 10, Heavy <= STR * 15
    // Pathfinder official rules are more granular based on score ranges.
    // Example: STR 10: Light 33 lbs, Medium 66 lbs, Heavy 100 lbs.
    // Let's use a table lookup for common Pathfinder values for more accuracy.
    const encumbranceTable = {
        1: { light: 3, medium: 6, heavy: 10 },
        2: { light: 6, medium: 13, heavy: 20 },
        3: { light: 10, medium: 20, heavy: 30 },
        4: { light: 13, medium: 26, heavy: 40 },
        5: { light: 16, medium: 33, heavy: 50 },
        6: { light: 20, medium: 40, heavy: 60 },
        7: { light: 23, medium: 46, heavy: 70 },
        8: { light: 26, medium: 53, heavy: 80 },
        9: { light: 30, medium: 60, heavy: 90 },
        10: { light: 33, medium: 66, heavy: 100 },
        11: { light: 38, medium: 76, heavy: 115 },
        12: { light: 43, medium: 86, heavy: 130 },
        13: { light: 50, medium: 100, heavy: 150 },
        14: { light: 58, medium: 116, heavy: 175 },
        15: { light: 66, medium: 133, heavy: 200 },
        16: { light: 76, medium: 153, heavy: 230 },
        17: { light: 86, medium: 173, heavy: 260 },
        18: { light: 100, medium: 200, heavy: 300 },
        19: { light: 116, medium: 233, heavy: 350 },
        20: { light: 133, medium: 266, heavy: 400 },
        21: { light: 153, medium: 306, heavy: 460 },
        22: { light: 173, medium: 346, heavy: 520 },
        23: { light: 200, medium: 400, heavy: 600 },
        24: { light: 233, medium: 466, heavy: 700 },
        25: { light: 266, medium: 533, heavy: 800 },
        26: { light: 306, medium: 613, heavy: 920 },
        27: { light: 346, medium: 693, heavy: 1040 },
        28: { light: 400, medium: 800, heavy: 1200 },
        29: { light: 466, medium: 933, heavy: 1400 },
        // For scores > 29, multiply by 4 for each point over 29 and add to previous max.
        // This simplified table caps at 29 for now.
    };
    const calculated = encumbranceTable[str] || encumbranceTable[10]; // Default to STR 10 if out of range
    
    if (str > 29) { // Handle scores over 29 as per Pathfinder rules for carrying capacity.
        let base = encumbranceTable[29];
        let multiplier = 1;
        for (let i = 0; i < (str - 29); i += 1) {
            multiplier *= 4;
        }
        return {
            light: base.light * multiplier,
            medium: base.medium * multiplier,
            heavy: base.heavy * multiplier
        };
    }    
    return calculated;
}

function renderInventory() {
    const inv = characterData.inventory;
    if (!inv) {
        characterData.inventory = { money: { pp: 0, gp: 0, sp: 0, cp: 0 }, items: [] };
    }
    if (!inv.money) inv.money = { pp: 0, gp: 0, sp: 0, cp: 0 };
    if (!inv.items) inv.items = [];

    // Render Currency
    setText('currency-pp', inv.money.pp || 0);
    setText('currency-gp', inv.money.gp || 0);
    setText('currency-sp', inv.money.sp || 0);
    setText('currency-cp', inv.money.cp || 0);

    // Render Items
    const itemsList = getElement('inventory-items-list');
    const noItemsMsg = getElement('no-inventory-items');
    itemsList.innerHTML = '';
    let totalWeight = 0;

    if (inv.items.length === 0) {
        if (noItemsMsg) noItemsMsg.classList.remove('hidden');
    } else {
        if (noItemsMsg) noItemsMsg.classList.add('hidden');
        inv.items.forEach(item => {
            totalWeight += (parseFloat(item.weight) || 0) * (parseInt(item.quantity) || 0);
            const li = document.createElement('li');
            li.className = 'inventory-item grid grid-cols-12 gap-x-2 items-center py-2 border-b border-[#243447] last:border-b-0 hover:bg-[#161f2b] transition-colors';
            li.dataset.itemId = item.id;

            const nameDiv = document.createElement('div');
            nameDiv.className = 'col-span-4';
            const itemNameP = document.createElement('p');
            itemNameP.className = 'font-semibold text-[#e0e0e0] cursor-pointer hover:text-sky-400';
            itemNameP.textContent = item.name || "Unnamed Item";
            itemNameP.onclick = () => openItemDetailModal(item.id); // Click name to edit/view
            nameDiv.appendChild(itemNameP);
            if (item.notes) {
                const itemNotesP = document.createElement('p');
                itemNotesP.className = 'text-xs text-[#b0c4de] truncate';
                itemNotesP.textContent = item.notes;
                itemNotesP.title = item.notes; // Show full notes on hover
                nameDiv.appendChild(itemNotesP);
            }
            li.appendChild(nameDiv);

            const qtyP = document.createElement('p');
            qtyP.className = 'col-span-1 text-center';
            qtyP.textContent = item.quantity || 0;
            li.appendChild(qtyP);

            const weightP = document.createElement('p');
            weightP.className = 'col-span-2 text-center';
            weightP.textContent = `${item.weight || 0} lbs`;
            li.appendChild(weightP);

            const locationP = document.createElement('p');
            locationP.className = 'col-span-2 text-center owner-edit-target-text';
            locationP.textContent = item.location || '-';
            // Make location editable inline in edit mode
            locationP.addEventListener('click', () => {
                if (document.body.classList.contains('edit-mode-active') && isOwner) {
                    makeEditable(locationP, `inventory.items.${inv.items.indexOf(item)}.location`, false, renderInventory);
                }
            });
            li.appendChild(locationP);

            const equippedDiv = document.createElement('div');
            equippedDiv.className = 'col-span-1 text-center';
            const equippedCheckbox = document.createElement('input');
            equippedCheckbox.type = 'checkbox';
            equippedCheckbox.className = 'inventory-item-equipped modal-checkbox owner-edit-target-input';
            equippedCheckbox.checked = item.equipped || false;
            equippedCheckbox.disabled = !(isOwner && document.body.classList.contains('edit-mode-active'));
            equippedCheckbox.onchange = async () => {
                item.equipped = equippedCheckbox.checked;
                await saveCharacterData();
                renderInventory(); // Re-render to reflect change potentially (e.g. if equipped status changes display)
            };
            equippedDiv.appendChild(equippedCheckbox);
            li.appendChild(equippedDiv);

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'col-span-2 text-center space-x-1 owner-edit-block';
            if (isOwner && document.body.classList.contains('edit-mode-active')) {
                const editBtn = document.createElement('button');
                editBtn.className = 'action-button-xs material-icons';
                editBtn.textContent = 'edit';
                editBtn.title = 'Edit Item';
                editBtn.onclick = () => openItemDetailModal(item.id);
                actionsDiv.appendChild(editBtn);

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'action-button-xs destructive-btn-xs material-icons';
                deleteBtn.textContent = 'delete';
                deleteBtn.title = 'Delete Item';
                deleteBtn.onclick = () => handleDeleteInventoryItem(item.id, item.name);
                actionsDiv.appendChild(deleteBtn);
            } else {
                 actionsDiv.innerHTML = '&nbsp;'; // Placeholder if not in edit mode to maintain grid structure
            }
            li.appendChild(actionsDiv);
            itemsList.appendChild(li);
        });
    }

    // Render Encumbrance
    setText('total-weight-carried', `${totalWeight.toFixed(1)} lbs`);
    const strengthScore = characterData.attributes.strength.score;
    const encumbrance = calculateEncumbrance(strengthScore);
    setText('enc-light-load', `Up to ${encumbrance.light} lbs`);
    setText('enc-medium-load', `Up to ${encumbrance.medium} lbs`);
    setText('enc-heavy-load', `Up to ${encumbrance.heavy} lbs`);
    
    // Highlight current load status (visual feedback)
    const totalWeightEl = getElement('total-weight-carried');
    totalWeightEl.classList.remove('text-yellow-400', 'text-red-500', 'text-green-400');
    if (totalWeight > encumbrance.heavy) {
        totalWeightEl.classList.add('text-red-500'); // Over encumbered severely
    } else if (totalWeight > encumbrance.medium) {
        totalWeightEl.classList.add('text-red-500'); // Heavy load
    } else if (totalWeight > encumbrance.light) {
        totalWeightEl.classList.add('text-yellow-400'); // Medium load
    } else {
        totalWeightEl.classList.add('text-green-400'); // Light or no load
    }
}

function openItemDetailModal(itemId = null) {
    const modal = getElement('item-detail-modal');
    if (!modal) return;

    const title = getElement('item-modal-title');
    const idInput = getElement('item-modal-id');
    const nameInput = getElement('item-modal-name');
    const qtyInput = getElement('item-modal-quantity');
    const weightInput = getElement('item-modal-weight');
    const locationInput = getElement('item-modal-location');
    const notesTextarea = getElement('item-modal-notes');
    const equippedCheckbox = getElement('item-modal-equipped');
    const errorDiv = getElement('item-modal-error-message');
    errorDiv.classList.add('hidden');

    if (itemId) {
        const item = characterData.inventory.items.find(i => i.id === itemId);
        if (item) {
            title.textContent = 'Edit Item';
            idInput.value = item.id;
            nameInput.value = item.name;
            qtyInput.value = item.quantity;
            weightInput.value = item.weight;
            locationInput.value = item.location || '';
            notesTextarea.value = item.notes || '';
            equippedCheckbox.checked = item.equipped || false;
        } else {
            console.error("Item not found for ID:", itemId);
            displayMessage("Error: Item not found.", "error");
            return; // Don't open modal if item not found
        }
    } else {
        title.textContent = 'Add New Item';
        idInput.value = ''; // Clear for new item
        nameInput.value = '';
        qtyInput.value = 1;
        weightInput.value = 0;
        locationInput.value = '';
        notesTextarea.value = '';
        equippedCheckbox.checked = false;
    }
    modal.classList.remove('hidden');
}

function closeItemDetailModal() {
    const modal = getElement('item-detail-modal');
    if (modal) modal.classList.add('hidden');
}

async function handleSaveItemFromModal() {
    const id = getElement('item-modal-id').value;
    const name = getElement('item-modal-name').value.trim();
    const quantity = parseInt(getElement('item-modal-quantity').value, 10);
    const weight = parseFloat(getElement('item-modal-weight').value);
    const location = getElement('item-modal-location').value.trim();
    const notes = getElement('item-modal-notes').value.trim();
    const equipped = getElement('item-modal-equipped').checked;
    const errorDiv = getElement('item-modal-error-message');

    if (!name) {
        errorDiv.textContent = "Item name is required.";
        errorDiv.classList.remove('hidden');
        return;
    }
    if (isNaN(quantity) || quantity < 0) {
        errorDiv.textContent = "Quantity must be a non-negative number.";
        errorDiv.classList.remove('hidden');
        return;
    }
    if (isNaN(weight) || weight < 0) {
        errorDiv.textContent = "Weight must be a non-negative number.";
        errorDiv.classList.remove('hidden');
        return;
    }
    errorDiv.classList.add('hidden');

    const itemData = { name, quantity, weight, location, notes, equipped };

    if (!characterData.inventory.items) characterData.inventory.items = [];

    if (id) { // Existing item
        const itemIndex = characterData.inventory.items.findIndex(i => i.id === id);
        if (itemIndex > -1) {
            characterData.inventory.items[itemIndex] = { ...characterData.inventory.items[itemIndex], ...itemData };
        } else {
            displayMessage("Error updating item: ID not found.", "error");
            return;
        }
    } else { // New item
        itemData.id = 'item_' + Date.now().toString() + Math.random().toString(36).substring(2, 7);
        characterData.inventory.items.push(itemData);
    }

    // Sort items by name after adding/editing
    characterData.inventory.items.sort((a, b) => a.name.localeCompare(b.name));

    renderInventory();
    const success = await saveCharacterData();
    if (success) {
        displayMessage(`Item "${name}" saved.`, "success");
        closeItemDetailModal();
    } else {
        displayMessage("Failed to save item.", "error");
        // Consider more robust rollback if save fails
    }
}

async function handleDeleteInventoryItem(itemId, itemName) {
    if (!isOwner || !document.body.classList.contains('edit-mode-active') || !itemId) {
        displayMessage("Cannot delete item at this time.", "warning");
        return;
    }
    if (confirm(`Are you sure you want to delete "${itemName || 'this item'}"?`)) {
        const originalItems = JSON.parse(JSON.stringify(characterData.inventory.items));
        characterData.inventory.items = characterData.inventory.items.filter(i => i.id !== itemId);
        renderInventory();
        const success = await saveCharacterData();
        if (success) {
            displayMessage(`Item "${itemName || 'Item'}" deleted.`, "success");
        } else {
            characterData.inventory.items = originalItems; // Rollback
            renderInventory();
            displayMessage("Failed to delete item.", "error");
        }
    }
}

// --- End Inventory Functions ---

// --- Attacks Functions ---
function renderAttacks() {
    const attacksList = getElement('attacks-list-container');
    const noAttacksMsg = getElement('no-attacks-message');
    if (!attacksList || !noAttacksMsg) return;

    attacksList.innerHTML = '';
    if (!characterData.attacks || characterData.attacks.length === 0) {
        noAttacksMsg.classList.remove('hidden');
        return;
    }
    noAttacksMsg.classList.add('hidden');

    characterData.attacks.forEach(attack => {
        const li = document.createElement('li');
        li.className = 'attack-item grid grid-cols-12 gap-x-2 items-center py-2 border-b border-[#243447] last:border-b-0 hover:bg-[#161f2b] transition-colors';
        li.dataset.attackId = attack.id;

        const nameDiv = document.createElement('div');
        nameDiv.className = 'col-span-3';
        const attackNameP = document.createElement('p');
        attackNameP.className = 'font-semibold text-[#e0e0e0] cursor-pointer hover:text-sky-400';
        attackNameP.textContent = attack.name || "Unnamed Attack";
        attackNameP.onclick = () => openAttackDetailModal(attack.id); // Click name to edit/view
        nameDiv.appendChild(attackNameP);
        if (attack.notes) {
            const attackNotesP = document.createElement('p');
            attackNotesP.className = 'text-xs text-[#b0c4de] truncate';
            attackNotesP.textContent = attack.notes;
            attackNotesP.title = attack.notes; // Show full notes on hover
            nameDiv.appendChild(attackNotesP);
        }
        li.appendChild(nameDiv);

        const bonusP = document.createElement('p');
        bonusP.className = 'col-span-2 text-center text-lg font-semibold';
        bonusP.textContent = attack.attackBonus || '-';
        li.appendChild(bonusP);

        const damageP = document.createElement('p');
        damageP.className = 'col-span-2 text-center';
        damageP.textContent = attack.damage || '-';
        li.appendChild(damageP);

        const critP = document.createElement('p');
        critP.className = 'col-span-1 text-center';
        critP.textContent = attack.critical || '-';
        li.appendChild(critP);

        const typeRangeP = document.createElement('p');
        typeRangeP.className = 'col-span-2 text-center';
        let typeRangeText = attack.type || '-';
        if (attack.range) typeRangeText += ` / ${attack.range}`;
        typeRangeP.textContent = typeRangeText;
        li.appendChild(typeRangeP);

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'col-span-2 text-center space-x-1 owner-edit-block';
        if (isOwner && document.body.classList.contains('edit-mode-active')) {
            const editBtn = document.createElement('button');
            editBtn.className = 'action-button-xs material-icons';
            editBtn.textContent = 'edit';
            editBtn.title = 'Edit Attack';
            editBtn.onclick = () => openAttackDetailModal(attack.id);
            actionsDiv.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'action-button-xs destructive-btn-xs material-icons';
            deleteBtn.textContent = 'delete';
            deleteBtn.title = 'Delete Attack';
            deleteBtn.onclick = () => handleDeleteAttack(attack.id, attack.name);
            actionsDiv.appendChild(deleteBtn);
        } else {
            actionsDiv.innerHTML = '&nbsp;';
        }
        li.appendChild(actionsDiv);
        attacksList.appendChild(li);
    });
}

function openAttackDetailModal(attackId = null) {
    const modal = getElement('attack-detail-modal');
    if (!modal) return;

    const title = getElement('attack-modal-title');
    const idInput = getElement('attack-modal-id');
    const nameInput = getElement('attack-modal-name');
    const typeInput = getElement('attack-modal-type');
    const bonusInput = getElement('attack-modal-bonus');
    const damageInput = getElement('attack-modal-damage');
    const criticalInput = getElement('attack-modal-critical');
    const rangeInput = getElement('attack-modal-range');
    const notesTextarea = getElement('attack-modal-notes');
    const errorDiv = getElement('attack-modal-error-message');
    errorDiv.classList.add('hidden');

    if (attackId) {
        const attack = characterData.attacks.find(a => a.id === attackId);
        if (attack) {
            title.textContent = 'Edit Attack';
            idInput.value = attack.id;
            nameInput.value = attack.name;
            typeInput.value = attack.type || '';
            bonusInput.value = attack.attackBonus || '';
            damageInput.value = attack.damage || '';
            criticalInput.value = attack.critical || '';
            rangeInput.value = attack.range || '';
            notesTextarea.value = attack.notes || '';
        } else {
            displayMessage("Error: Attack not found.", "error");
            return;
        }
    } else {
        title.textContent = 'Add New Attack';
        idInput.value = '';
        nameInput.value = '';
        typeInput.value = '';
        bonusInput.value = '';
        damageInput.value = '';
        criticalInput.value = '';
        rangeInput.value = '';
        notesTextarea.value = '';
    }
    modal.classList.remove('hidden');
}

function closeAttackDetailModal() {
    const modal = getElement('attack-detail-modal');
    if (modal) modal.classList.add('hidden');
}

async function handleSaveAttackFromModal() {
    const id = getElement('attack-modal-id').value;
    const name = getElement('attack-modal-name').value.trim();
    const type = getElement('attack-modal-type').value.trim();
    const attackBonus = getElement('attack-modal-bonus').value.trim();
    const damage = getElement('attack-modal-damage').value.trim();
    const critical = getElement('attack-modal-critical').value.trim();
    const range = getElement('attack-modal-range').value.trim();
    const notes = getElement('attack-modal-notes').value.trim();
    const errorDiv = getElement('attack-modal-error-message');

    if (!name) {
        errorDiv.textContent = "Attack name is required.";
        errorDiv.classList.remove('hidden');
        return;
    }
    errorDiv.classList.add('hidden');

    const attackData = { name, type, attackBonus, damage, critical, range, notes };

    if (!characterData.attacks) characterData.attacks = [];

    if (id) { // Existing attack
        const attackIndex = characterData.attacks.findIndex(a => a.id === id);
        if (attackIndex > -1) {
            characterData.attacks[attackIndex] = { ...characterData.attacks[attackIndex], ...attackData };
        } else {
            displayMessage("Error updating attack: ID not found.", "error");
            return;
        }
    } else { // New attack
        attackData.id = 'atk_' + Date.now().toString() + Math.random().toString(36).substring(2, 7);
        characterData.attacks.push(attackData);
    }
    characterData.attacks.sort((a, b) => a.name.localeCompare(b.name));

    renderAttacks();
    const success = await saveCharacterData();
    if (success) {
        displayMessage(`Attack "${name}" saved.`, "success");
        closeAttackDetailModal();
    } else {
        displayMessage("Failed to save attack.", "error");
    }
}

async function handleDeleteAttack(attackId, attackName) {
    if (!isOwner || !document.body.classList.contains('edit-mode-active') || !attackId) {
        displayMessage("Cannot delete attack at this time.", "warning");
        return;
    }
    if (confirm(`Are you sure you want to delete the attack "${attackName || 'this attack'}"?`)) {
        const originalAttacks = JSON.parse(JSON.stringify(characterData.attacks));
        characterData.attacks = characterData.attacks.filter(a => a.id !== attackId);
        renderAttacks();
        const success = await saveCharacterData();
        if (success) {
            displayMessage(`Attack "${attackName || 'Attack'}" deleted.`, "success");
        } else {
            characterData.attacks = originalAttacks; // Rollback
            renderAttacks();
            displayMessage("Failed to delete attack.", "error");
        }
    }
}
// --- End Attacks Functions ---

// --- Class Progression & Automation Functions ---
function getCharacterLevel() {
    const classLevelStr = characterData.overview.classLevel || "Level 1";
    const levelMatch = classLevelStr.match(/\d+/);
    return levelMatch ? parseInt(levelMatch[0], 10) : 1;
}

function calculateBAB(level, progression) {
    level = parseInt(level, 10) || 1;
    switch (progression) {
        case 'full':
            return level;
        case 'threeQuarters':
            return Math.floor(level * 0.75);
        case 'half':
            return Math.floor(level * 0.5);
        default:
            return level; // Default to full if undefined
    }
}

function calculateBaseSave(level, progression) {
    level = parseInt(level, 10) || 1;
    if (progression === 'good') {
        return Math.floor(2 + level / 2);
    } else { // poor save
        return Math.floor(level / 3);
    }
}

function renderClassProgression() {
    if (!characterData.classMechanics) { 
        characterData.classMechanics = getDefaultCharacterData().classMechanics;
    }
    const mech = characterData.classMechanics;

    setValue('classmech-hit-die', mech.hitDie);
    setValue('classmech-bab-progression', mech.babProgression);
    setValue('classmech-fort-save', mech.fortitudeSave);
    setValue('classmech-ref-save', mech.reflexSave);
    setValue('classmech-will-save', mech.willSave);
    setValue('classmech-hp-ability', mech.hpAbilityModStat);
    setValue('classmech-ac-ability1', mech.acAbilityModStat1);
    setValue('classmech-ac-ability2', mech.acAbilityModStat2);
    
    const editModeActive = isOwner && document.body.classList.contains('edit-mode-active');
    const selects = [
        getElement('classmech-hit-die'), 
        getElement('classmech-bab-progression'), 
        getElement('classmech-fort-save'), 
        getElement('classmech-ref-save'), 
        getElement('classmech-will-save'),
        getElement('classmech-hp-ability'),
        getElement('classmech-ac-ability1'),
        getElement('classmech-ac-ability2')
    ];
    selects.forEach(sel => {
        if (sel) sel.disabled = !editModeActive;
    });
}

function calculateMaxHp(level, hitDieString, abilityModStatKey) { // Changed conModifier to abilityModStatKey
    level = parseInt(level, 10) || 1;
    let chosenAbilityModifier = 0;
    if (abilityModStatKey && abilityModStatKey !== "None" && characterData.attributes[CORE_ABILITIES[abilityModStatKey].toLowerCase()]) {
        chosenAbilityModifier = calculateAbilityModifier(characterData.attributes[CORE_ABILITIES[abilityModStatKey].toLowerCase()].score);
    } else if (abilityModStatKey === "CON") { // Default to CON if key is invalid but was CON
        chosenAbilityModifier = calculateAbilityModifier(characterData.attributes.constitution.score);
    }

    let hitDieValue = 0;
    let averageHpPerLevelAfterFirst = 0;

    switch (hitDieString) {
        case 'd4': hitDieValue = 4; averageHpPerLevelAfterFirst = 3; break;
        case 'd6': hitDieValue = 6; averageHpPerLevelAfterFirst = 4; break;
        case 'd8': hitDieValue = 8; averageHpPerLevelAfterFirst = 5; break;
        case 'd10': hitDieValue = 10; averageHpPerLevelAfterFirst = 6; break;
        case 'd12': hitDieValue = 12; averageHpPerLevelAfterFirst = 7; break;
        default: hitDieValue = 8; averageHpPerLevelAfterFirst = 5; // Default to d8 if undefined
    }

    let maxHp = 0;
    if (level >= 1) {
        // Level 1: Max HD value + CON mod
        maxHp = hitDieValue + chosenAbilityModifier;
        // Levels 2+ : Average roll + CON mod for each additional level
        if (level > 1) {
            for (let i = 2; i <= level; i++) {
                maxHp += averageHpPerLevelAfterFirst + chosenAbilityModifier;
            }
        }
    }
    return Math.max(1, maxHp); // Ensure HP is at least 1
}

// --- End Class Progression & Automation Functions ---

// --- Dynamic Field Evaluation ---
function evaluateDynamicFieldValue(valueString, charData = characterData) {
    if (typeof valueString !== 'string') {
        return Number(valueString) || 0; 
    }

    let expression = String(valueString); // Ensure it's a string for manipulation
    const level = getCharacterLevel(); 
    const bab = parseInt(String(charData.keyStats.bab).replace('+', '')) || 0;

    // Replace placeholders for ability scores and their modifiers
    for (const key of ABILITY_KEYS) { 
        const score = charData.attributes[CORE_ABILITIES[key].toLowerCase()]?.score || 10;
        const modifier = calculateAbilityModifier(score);
        
        const modRegex = new RegExp(`@${key}_MOD`, 'gi');
        expression = expression.replace(modRegex, String(modifier));
        
        const scoreRegex = new RegExp(`@${key}(?!_MOD)`, 'gi');
        expression = expression.replace(scoreRegex, String(score));
    }

    expression = expression.replace(/@LVL/gi, String(level));
    expression = expression.replace(/@BAB/gi, String(bab));

    // Sanitize the expression to allow only numbers, operators, parentheses, and whitespace
    // This is crucial for preventing arbitrary code execution with new Function()
    // Allow: digits, ., +, -, *, /, (, ), spaces
    const sanitizedExpression = expression.replace(/[^\d\.\+\-\*\/\(\)\s]/g, '');

    try {
        // Evaluate the sanitized mathematical expression using new Function()
        // This is safer than eval() as it doesn't inherit local scope.
        // It still has access to global scope, but sanitization helps mitigate risks.
        const evaluatedResult = new Function('return ' + sanitizedExpression)();
        if (typeof evaluatedResult === 'number' && !isNaN(evaluatedResult)) {
            return evaluatedResult;
        } else {
            // If the result is not a valid number, attempt to parse original if it was simple number
            const directNum = parseFloat(valueString);
            return !isNaN(directNum) ? directNum : 0; 
        }
    } catch (e) {
        console.warn("Error evaluating dynamic field string:", valueString, "Sanitized to:", sanitizedExpression, "Error:", e);
        const directNum = parseFloat(valueString); // Try to return the original string as a number if it was simple
        return !isNaN(directNum) ? directNum : 0; 
    }
}
// --- End Dynamic Field Evaluation ---
