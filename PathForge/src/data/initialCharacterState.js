// src/data/initialCharacterState.js
export const initialAbilityScoresData = {
  strength: { base: 10 },
  dexterity: { base: 10 },
  constitution: { base: 10 },
  intelligence: { base: 10 },
  wisdom: { base: 10 },
  charisma: { base: 10 },
};

export const initialSkillsList = [
  // A more comprehensive list can be added here or loaded from a JSON file
  { id: 'acrobatics', name: 'Acrobatics', ability: 'dexterity', ranks: 0, miscMod: 0, classSkill: false, trainedOnly: false },
  { id: 'appraise', name: 'Appraise', ability: 'intelligence', ranks: 0, miscMod: 0, classSkill: false, trainedOnly: false },
  { id: 'bluff', name: 'Bluff', ability: 'charisma', ranks: 0, miscMod: 0, classSkill: false, trainedOnly: false },
  { id: 'climb', name: 'Climb', ability: 'strength', ranks: 0, miscMod: 0, classSkill: false, trainedOnly: false },
  { id: 'craft', name: 'Craft', ability: 'intelligence', ranks: 0, miscMod: 0, classSkill: false, trainedOnly: false }, // Example of multiple craft skills possible
  { id: 'diplomacy', name: 'Diplomacy', ability: 'charisma', ranks: 0, miscMod: 0, classSkill: false, trainedOnly: false },
  { id: 'disableDevice', name: 'Disable Device', ability: 'dexterity', ranks: 0, miscMod: 0, classSkill: false, trainedOnly: true },
  { id: 'disguise', name: 'Disguise', ability: 'charisma', ranks: 0, miscMod: 0, classSkill: false, trainedOnly: false },
  { id: 'escapeArtist', name: 'Escape Artist', ability: 'dexterity', ranks: 0, miscMod: 0, classSkill: false, trainedOnly: false },
  { id: 'fly', name: 'Fly', ability: 'dexterity', ranks: 0, miscMod: 0, classSkill: false, trainedOnly: false },
  { id: 'handleAnimal', name: 'Handle Animal', ability: 'charisma', ranks: 0, miscMod: 0, classSkill: false, trainedOnly: true },
  { id: 'heal', name: 'Heal', ability: 'wisdom', ranks: 0, miscMod: 0, classSkill: false, trainedOnly: false },
  { id: 'intimidate', name: 'Intimidate', ability: 'charisma', ranks: 0, miscMod: 0, classSkill: false, trainedOnly: false },
  { id: 'knowledgeArcana', name: 'Knowledge (Arcana)', ability: 'intelligence', ranks: 0, miscMod: 0, classSkill: false, trainedOnly: true },
  { id: 'knowledgeDungeoneering', name: 'Knowledge (Dungeoneering)', ability: 'intelligence', ranks: 0, miscMod: 0, classSkill: false, trainedOnly: true },
  { id: 'knowledgeEngineering', name: 'Knowledge (Engineering)', ability: 'intelligence', ranks: 0, miscMod: 0, classSkill: false, trainedOnly: true },
  { id: 'knowledgeGeography', name: 'Knowledge (Geography)', ability: 'intelligence', ranks: 0, miscMod: 0, classSkill: false, trainedOnly: true },
  { id: 'knowledgeHistory', name: 'Knowledge (History)', ability: 'intelligence', ranks: 0, miscMod: 0, classSkill: false, trainedOnly: true },
  { id: 'knowledgeLocal', name: 'Knowledge (Local)', ability: 'intelligence', ranks: 0, miscMod: 0, classSkill: false, trainedOnly: true },
  { id: 'knowledgeNature', name: 'Knowledge (Nature)', ability: 'intelligence', ranks: 0, miscMod: 0, classSkill: false, trainedOnly: true },
  { id: 'knowledgeNobility', name: 'Knowledge (Nobility)', ability: 'intelligence', ranks: 0, miscMod: 0, classSkill: false, trainedOnly: true },
  { id: 'knowledgePlanes', name: 'Knowledge (Planes)', ability: 'intelligence', ranks: 0, miscMod: 0, classSkill: false, trainedOnly: true },
  { id: 'knowledgeReligion', name: 'Knowledge (Religion)', ability: 'intelligence', ranks: 0, miscMod: 0, classSkill: false, trainedOnly: true },
  { id: 'linguistics', name: 'Linguistics', ability: 'intelligence', ranks: 0, miscMod: 0, classSkill: false, trainedOnly: true },
  { id: 'perception', name: 'Perception', ability: 'wisdom', ranks: 0, miscMod: 0, classSkill: false, trainedOnly: false },
  { id: 'perform', name: 'Perform', ability: 'charisma', ranks: 0, miscMod: 0, classSkill: false, trainedOnly: false }, // Example of multiple perform skills possible
  { id: 'profession', name: 'Profession', ability: 'wisdom', ranks: 0, miscMod: 0, classSkill: false, trainedOnly: true }, // Example of multiple profession skills possible
  { id: 'ride', name: 'Ride', ability: 'dexterity', ranks: 0, miscMod: 0, classSkill: false, trainedOnly: false },
  { id: 'senseMotive', name: 'Sense Motive', ability: 'wisdom', ranks: 0, miscMod: 0, classSkill: false, trainedOnly: false },
  { id: 'sleightOfHand', name: 'Sleight of Hand', ability: 'dexterity', ranks: 0, miscMod: 0, classSkill: false, trainedOnly: true },
  { id: 'spellcraft', name: 'Spellcraft', ability: 'intelligence', ranks: 0, miscMod: 0, classSkill: false, trainedOnly: true },
  { id: 'stealth', name: 'Stealth', ability: 'dexterity', ranks: 0, miscMod: 0, classSkill: false, trainedOnly: false },
  { id: 'survival', name: 'Survival', ability: 'wisdom', ranks: 0, miscMod: 0, classSkill: false, trainedOnly: false },
  { id: 'swim', name: 'Swim', ability: 'strength', ranks: 0, miscMod: 0, classSkill: false, trainedOnly: false },
  { id: 'useMagicDevice', name: 'Use Magic Device', ability: 'charisma', ranks: 0, miscMod: 0, classSkill: false, trainedOnly: true },
];

export const initialCharacterData = {
  characterId: null, // Will be set when saved/loaded
  userId: null,
  // Basic Attributes
  characterName: '',
  alignment: '',
  characterClass: '', // Simple string for now, could be array of objects { name, level }
  level: 1,
  deity: '',
  age: '',
  gender: '',
  height: '',
  hairColor: '',
  eyeColor: '',
  // Core Stats
  hp: { current: 10, max: 10, nonLethal: 0, temporary: 0 },
  abilityScores: JSON.parse(JSON.stringify(initialAbilityScoresData)), // Deep copy
  ac: { total: 10, touch: 10, flatFooted: 10, armor: 0, shield: 0, dex: 0, size: 0, natural: 0, deflection: 0, dodge: 0, misc: 0 },
  saves: {
    fortitude: { base: 0, abilityMod: 0, magic: 0, misc: 0, temp: 0, total: 0 },
    reflex:    { base: 0, abilityMod: 0, magic: 0, misc: 0, temp: 0, total: 0 },
    will:      { base: 0, abilityMod: 0, magic: 0, misc: 0, temp: 0, total: 0 },
  },
  bab: '', // Base Attack Bonus (e.g., "+5" or "+6/+1")
  cmb: { total: 0, bab: 0, strMod: 0, sizeMod: 0, misc: 0 }, // Combat Maneuver Bonus
  cmd: { total: 10, bab: 0, strMod: 0, dexMod: 0, sizeMod: 0, misc: 0 }, // Combat Maneuver Defense
  initiative: { total: 0, dexMod: 0, misc: 0 },
  // Wealth
  wealth: { gp: 0, sp: 0, cp: 0, gems: '', other: '' },
  // Skills
  skills: JSON.parse(JSON.stringify(initialSkillsList)), // Deep copy
  // Feats, Traits, Drawbacks
  feats: [],
  traits: [],
  drawbacks: [],
  // Inventory
  inventory: [],
  totalWeight: 0,
  encumbrance: { light: 0, medium: 0, heavy: 0, lift: 0, drag: 0 }, // Calculated based on Strength
  // Languages
  languages: ['Common'],
  // Character Bio
  bio: {
    appearance: '',
    background: '',
    personality: '',
    notes: '',
  },
  imageUrl: '',
  // Spellcasting
  spellcasting: {
    enabled: false,
    casterClass: '',
    spellcastingAbility: 'intelligence', // default, can be changed
    casterLevel: 0,
    concentrationBonus: 0, // Base + Ability Mod + Misc
    spellResistance: 'N/A',
    spellsPerDay: { 0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0 },
    bonusSpells:  { 0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0 }, // From high ability score
    spellsKnown:  { 0:[], 1:[], 2:[], 3:[], 4:[], 5:[], 6:[], 7:[], 8:[], 9:[] }, // For spontaneous
    spellbook:    { 0:[], 1:[], 2:[], 3:[], 4:[], 5:[], 6:[], 7:[], 8:[], 9:[] }, // For prepared
  },
  lastUpdated: null,
}; 