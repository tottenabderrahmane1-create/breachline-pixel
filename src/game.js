const TILE = 32;
const COLS = 30;
const ROWS = 20;
const VIEW_W = COLS * TILE;
const VIEW_H = ROWS * TILE;
const STORAGE_KEY = "breachline-pixel-profile-v1";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const leftContent = document.getElementById("leftContent");
const rightContent = document.getElementById("rightContent");
const missionTitle = document.getElementById("missionTitle");
const profileLine = document.getElementById("profileLine");
const hintLine = document.getElementById("hintLine");
const goBtn = document.getElementById("goBtn");
const pauseBtn = document.getElementById("pauseBtn");
const restartBtn = document.getElementById("restartBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const addonFile = document.getElementById("addonFile");
const loadingScreen = document.getElementById("loadingScreen");
const loadingBar = document.getElementById("loadingBar");
const loadingStatus = document.getElementById("loadingStatus");
const loadingPercent = document.getElementById("loadingPercent");
const homeHub = document.getElementById("homeHub");
const radialMenu = document.getElementById("radialMenu");

const ASSET_VERSION = "12";
const aiSheet = new Image();
aiSheet.src = `./assets/ai-generated-pixel-asset-sheet.png?v=${ASSET_VERSION}`;
const runtimeAtlas = new Image();
runtimeAtlas.src = `./assets/runtime-atlas.png?v=${ASSET_VERSION}`;
const uiSheet = new Image();
uiSheet.src = `./assets/generated-ui-asset-sheet.png?v=${ASSET_VERSION}`;
const logoImage = new Image();
logoImage.src = `./assets/logo.png?v=${ASSET_VERSION}`;

const UI_SHEET_W = 2048;
const UI_SHEET_H = 1024;
// Individual PNG assets delivered by Codex. Each slug → standalone file.
// When the file is present, render paths prefer the standalone over the master sheet slice.
const imageAssetSources = {
  logo: "./assets/logo.png",
  logo_lockup: "./assets/logo-lockup.png",
  home_keyart: "./assets/home-keyart.png",
  favicon: "./assets/favicon.png",
  portrait_rook: "./assets/op-rook-portrait.png",
  portrait_mako: "./assets/op-mako-portrait.png",
  portrait_lynx: "./assets/op-lynx-portrait.png",
  portrait_volt: "./assets/op-volt-portrait.png",
  stairs: "./assets/stairs.png",
  shield: "./assets/shield.png",
  route: "./assets/route.png",
  command: "./assets/command.png",
  window_breach: "./assets/window-breach.png",
  radial_center: "./assets/radial-center.png",
  wall_connector: "./assets/wall-connector.png",
  wall_single: "./assets/wall-single.png",
  wall_end: "./assets/wall-end.png",
  wall_straight: "./assets/wall-straight.png",
  wall_corner: "./assets/wall-corner.png",
  wall_t: "./assets/wall-t.png",
  wall_cross: "./assets/wall-cross.png",
  campaign_armory_sheet: "./assets/imagegen-campaign-armory-sheet.png",
  mission_training_block: "./assets/mission-training-block.png",
  mission_catacomb: "./assets/mission-catacomb.png",
  mission_embassy_annex: "./assets/mission-embassy-annex.png",
  mission_market_rescue: "./assets/mission-market-rescue.png",
  mission_greenroom: "./assets/mission-greenroom.png",
  mission_yardline: "./assets/mission-yardline.png",
  mission_server_vault: "./assets/mission-server-vault.png",
  mission_steelhouse: "./assets/mission-steelhouse.png",
  mission_cargo_hold: "./assets/mission-cargo-hold.png",
  mission_metro_switch: "./assets/mission-metro-switch.png",
  mission_clinic_tower: "./assets/mission-clinic-tower.png",
  mission_night_depot: "./assets/mission-night-depot.png",
  mission_castiron: "./assets/mission-castiron.png",
  mission_vantage_point: "./assets/mission-vantage-point.png",
  mission_penthouse: "./assets/mission-penthouse.png",
  mission_rowhouse: "./assets/mission-rowhouse.png",
  weapon_m4a1: "./assets/weapon-m4a1.png",
  weapon_hk416: "./assets/weapon-hk416.png",
  weapon_mp5a5: "./assets/weapon-mp5a5.png",
  weapon_mp7: "./assets/weapon-mp7.png",
  weapon_ak74m: "./assets/weapon-ak74m.png",
  weapon_benelli_m4: "./assets/weapon-benelli-m4.png",
  weapon_m110_sass: "./assets/weapon-m110-sass.png",
  weapon_glock17: "./assets/weapon-glock17.png",
  weapon_m249_saw: "./assets/weapon-m249-saw.png",
  tilemap_master: "./assets/tilemap-master.png",
  tile_door_breached: "./assets/tile-door-breached.png",
  tile_door_metal: "./assets/tile-door-metal.png",
  tile_door_open: "./assets/tile-door-open.png",
  tile_door_wood: "./assets/tile-door-wood.png",
  tile_floor_bank: "./assets/tile-floor-bank.png",
  tile_floor_catacomb: "./assets/tile-floor-catacomb.png",
  tile_floor_clinic: "./assets/tile-floor-clinic.png",
  tile_floor_concrete: "./assets/tile-floor-concrete.png",
  tile_floor_dark: "./assets/tile-floor-dark.png",
  tile_floor_garage: "./assets/tile-floor-garage.png",
  tile_floor_market: "./assets/tile-floor-market.png",
  tile_floor_metro: "./assets/tile-floor-metro.png",
  tile_floor_nightclub: "./assets/tile-floor-nightclub.png",
  tile_floor_office: "./assets/tile-floor-office.png",
  tile_floor_residential: "./assets/tile-floor-residential.png",
  tile_floor_rooftop: "./assets/tile-floor-rooftop.png",
  tile_floor_server: "./assets/tile-floor-server.png",
  tile_floor_ship: "./assets/tile-floor-ship.png",
  tile_floor_tunnel: "./assets/tile-floor-tunnel.png",
  tile_floor_warehouse: "./assets/tile-floor-warehouse.png",
  tile_stairs: "./assets/tile-stairs.png",
  tile_wall_corner_inner: "./assets/tile-wall-corner-inner.png",
  tile_wall_corner_outer: "./assets/tile-wall-corner-outer.png",
  tile_wall_cross: "./assets/tile-wall-cross.png",
  tile_wall_end: "./assets/tile-wall-end.png",
  tile_wall_exterior: "./assets/tile-wall-exterior.png",
  tile_wall_horizontal: "./assets/tile-wall-horizontal.png",
  tile_wall_single: "./assets/tile-wall-single.png",
  tile_wall_t: "./assets/tile-wall-t.png",
  tile_wall_vertical: "./assets/tile-wall-vertical.png",
  tile_window_breached: "./assets/tile-window-breached.png",
  tile_window: "./assets/tile-window.png",
  prop_bank_counter: "./assets/prop-bank-counter.png",
  prop_bar_counter: "./assets/prop-bar-counter.png",
  prop_barrel: "./assets/prop-barrel.png",
  prop_cargo_container: "./assets/prop-cargo-container.png",
  prop_couch: "./assets/prop-couch.png",
  prop_counter: "./assets/prop-counter.png",
  prop_crate_metal: "./assets/prop-crate-metal.png",
  prop_crate_wood: "./assets/prop-crate-wood.png",
  prop_desk: "./assets/prop-desk.png",
  prop_drone: "./assets/prop-drone.png",
  prop_hospital_bed: "./assets/prop-hospital-bed.png",
  prop_laptop: "./assets/prop-laptop.png",
  prop_market_shelf: "./assets/prop-market-shelf.png",
  prop_medkit: "./assets/prop-medkit.png",
  prop_objective_case: "./assets/prop-objective-case.png",
  prop_rail_track: "./assets/prop-rail-track.png",
  prop_sandbag: "./assets/prop-sandbag.png",
  prop_server_rack: "./assets/prop-server-rack.png",
  prop_ship_console: "./assets/prop-ship-console.png",
  prop_train_cover: "./assets/prop-train-cover.png",
  prop_vault_table: "./assets/prop-vault-table.png",
  prop_window_step: "./assets/prop-window-step.png",
  decal_cable: "./assets/decal-cable.png",
  decal_glass: "./assets/decal-glass.png",
  decal_grime: "./assets/decal-grime.png",
  decal_lane: "./assets/decal-lane.png",
  decal_neon: "./assets/decal-neon.png",
  decal_puddle: "./assets/decal-puddle.png",
  marker_extract: "./assets/marker-extract.png",
  vfx_flash_burst: "./assets/vfx-flash-burst.png",
  vfx_muzzle_flash: "./assets/vfx-muzzle-flash.png",
  vfx_smoke_puff: "./assets/vfx-smoke-puff.png",
};
// Append ASSET_VERSION to every standalone image URL so browser refetches when Codex
// drops in a corrected crop. Keep imageAssetSources without the query string so the
// uiSpriteStyle CSS bg can match the canvas image references.
const imageAssets = {};
for (const key in imageAssetSources) {
  const img = new Image();
  img.src = `${imageAssetSources[key]}?v=${ASSET_VERSION}`;
  imageAssets[key] = img;
}
const mapBackdropCache = { key: "", canvas: null };
// Master-sheet fallback slice coords. Used only if the standalone file fails to load.
const uiSprites = {
  logo: { x: 0, y: 0, w: 96, h: 96 },
  logo_lockup: { x: 128, y: 0, w: 640, h: 160 },
  home_keyart: { x: 0, y: 192, w: 960, h: 540 },
  portrait_rook: { x: 1024, y: 0, w: 96, h: 96 },
  portrait_mako: { x: 1136, y: 0, w: 96, h: 96 },
  portrait_lynx: { x: 1248, y: 0, w: 96, h: 96 },
  portrait_volt: { x: 1360, y: 0, w: 96, h: 96 },
  stairs: { x: 1024, y: 128, w: 64, h: 64 },
  shield: { x: 1104, y: 128, w: 64, h: 64 },
  route: { x: 1184, y: 128, w: 64, h: 64 },
  command: { x: 1264, y: 128, w: 64, h: 64 },
  window_breach: { x: 1344, y: 128, w: 64, h: 64 },
  radial_center: { x: 1424, y: 128, w: 64, h: 64 },
  wall_connector: { x: 1504, y: 128, w: 64, h: 64 },
  wall_single: { x: 1024, y: 224, w: 64, h: 64 },
  wall_end: { x: 1104, y: 224, w: 64, h: 64 },
  wall_straight: { x: 1184, y: 224, w: 64, h: 64 },
  wall_corner: { x: 1264, y: 224, w: 64, h: 64 },
  wall_t: { x: 1344, y: 224, w: 64, h: 64 },
  wall_cross: { x: 1424, y: 224, w: 64, h: 64 },
};

const operatorPortraitSprites = {
  rook: "portrait_rook",
  mako: "portrait_mako",
  lynx: "portrait_lynx",
  volt: "portrait_volt",
};

const tacticalSpriteIds = ["stairs", "shield", "route", "command", "window_breach", "radial_center", "wall_connector", "wall_single", "wall_end", "wall_straight", "wall_corner", "wall_t", "wall_cross"];

const ATLAS_CELL = 64;
const ATLAS_COLS = 8;
const atlasSprites = {
  op_rook: 0,
  op_mako: 1,
  op_lynx: 2,
  op_volt: 3,
  enemy_a: 4,
  enemy_b: 5,
  enemy_c: 6,
  civilian: 7,
  door_wood: 8,
  door_steel: 9,
  door_breach: 10,
  window: 11,
  crate: 12,
  metal_crate: 13,
  smoke: 14,
  muzzle: 15,
  flash: 16,
  objective: 17,
  floor_a: 18,
  floor_b: 19,
  wall_corner: 20,
  wall_t: 21,
  extract: 22,
  medkit: 23,
  shield_icon: 24,
  flash_icon: 25,
  smoke_icon: 26,
  breach_icon: 27,
  eye_icon: 28,
  radio_icon: 29,
  floor_c: 30,
  wall_bar: 31,
};

const colors = {
  floor: "#2a2f2c",
  floorAlt: "#242a27",
  wall: "#56615b",
  wallDark: "#29312e",
  door: "#8b6740",
  doorOpen: "#5a4632",
  window: "#5ca0a8",
  crate: "#6e5a38",
  path: "#e9c850",
  select: "#f3dd7d",
  hostile: "#c95e55",
  hostileDark: "#682c2a",
  civilian: "#78c581",
  objective: "#6bb9d3",
  extract: "#83d36f",
};

const weaponDefs = {
  m4a1: {
    label: "M4A1",
    class: "Rifle",
    compat: ["Assault", "Point", "Breacher"],
    range: 278,
    fireRate: 720,
    cooldown: 0.25,
    damage: 24,
    spread: 0.075,
    penetration: 3,
    pierce: 3,
    suppression: 21,
    handling: 86,
    speed: 86,
    reloadTime: 2.2,
    armorModifier: 0,
    armor: 0,
  },
  hk416: {
    label: "HK416",
    class: "Rifle",
    compat: ["Assault", "Point", "Breacher"],
    range: 292,
    fireRate: 700,
    cooldown: 0.27,
    damage: 25,
    spread: 0.062,
    penetration: 4,
    pierce: 4,
    suppression: 22,
    handling: 82,
    speed: 82,
    reloadTime: 2.35,
    armorModifier: 0,
    armor: 0,
  },
  mp5a5: {
    label: "MP5A5",
    class: "SMG",
    compat: ["Assault", "Point", "Breacher"],
    range: 218,
    fireRate: 800,
    cooldown: 0.2,
    damage: 19,
    spread: 0.065,
    penetration: 1,
    pierce: 1,
    suppression: 18,
    handling: 96,
    speed: 96,
    reloadTime: 1.85,
    armorModifier: 0,
    armor: 0,
  },
  mp7: {
    label: "MP7",
    class: "PDW",
    compat: ["Assault", "Point", "Marksman"],
    range: 236,
    fireRate: 850,
    cooldown: 0.19,
    damage: 20,
    spread: 0.07,
    penetration: 3,
    pierce: 3,
    suppression: 19,
    handling: 98,
    speed: 98,
    reloadTime: 1.9,
    armorModifier: 0,
    armor: 0,
  },
  ak74m: {
    label: "AK-74M",
    class: "Rifle",
    compat: ["Assault", "Breacher"],
    range: 284,
    fireRate: 650,
    cooldown: 0.3,
    damage: 27,
    spread: 0.095,
    penetration: 4,
    pierce: 4,
    suppression: 25,
    handling: 76,
    speed: 76,
    reloadTime: 2.55,
    armorModifier: 0,
    armor: 0,
  },
  benelli_m4: {
    label: "Benelli M4",
    class: "Shotgun",
    compat: ["Breacher", "Point"],
    range: 172,
    fireRate: 300,
    cooldown: 0.58,
    damage: 42,
    spread: 0.18,
    penetration: 1,
    pierce: 1,
    suppression: 34,
    handling: 74,
    speed: 74,
    reloadTime: 3.2,
    armorModifier: 0,
    armor: 0,
  },
  m110_sass: {
    label: "M110 SASS",
    class: "DMR",
    compat: ["Marksman"],
    range: 360,
    fireRate: 240,
    cooldown: 0.62,
    damage: 44,
    spread: 0.035,
    penetration: 8,
    pierce: 8,
    suppression: 27,
    handling: 68,
    speed: 68,
    reloadTime: 2.75,
    armorModifier: 0,
    armor: 0,
  },
  glock17: {
    label: "Glock 17",
    class: "Sidearm",
    compat: ["Point", "Assault", "Marksman", "Breacher"],
    range: 184,
    fireRate: 520,
    cooldown: 0.28,
    damage: 16,
    spread: 0.11,
    penetration: 1,
    pierce: 1,
    suppression: 12,
    handling: 108,
    speed: 84,
    reloadTime: 1.35,
    armorModifier: 14,
    armor: 14,
  },
  m249_saw: {
    label: "M249 SAW",
    class: "LMG",
    compat: ["Assault"],
    range: 318,
    fireRate: 750,
    cooldown: 0.18,
    damage: 23,
    spread: 0.14,
    penetration: 5,
    pierce: 5,
    suppression: 42,
    handling: 55,
    speed: 55,
    reloadTime: 4.1,
    armorModifier: 0,
    armor: 0,
  },
};

const weaponAliases = {
  carbine: "m4a1",
  shotgun: "benelli_m4",
  shield: "glock17",
  dmr: "m110_sass",
};

const weaponOrder = ["m4a1", "hk416", "mp5a5", "mp7", "ak74m", "benelli_m4", "m110_sass", "glock17", "m249_saw"];

const defaultUnlockedWeapons = ["m4a1", "mp5a5", "benelli_m4", "m110_sass", "glock17"];

const weaponUnlockDefs = {
  hk416: { stars: 4, credits: 60, label: "4 stars + 60 credits" },
  mp7: { stars: 3, credits: 45, label: "3 stars + 45 credits" },
  ak74m: { stars: 5, credits: 50, label: "5 stars + 50 credits" },
  m249_saw: { stars: 7, credits: 90, label: "7 stars + 90 credits" },
};

const missionThumbnailKeys = {
  training_block: "mission_training_block",
  catacomb: "mission_catacomb",
  embassy_annex: "mission_embassy_annex",
  market_rescue: "mission_market_rescue",
  greenroom: "mission_greenroom",
  yardline: "mission_yardline",
  server_vault: "mission_server_vault",
  steelhouse: "mission_steelhouse",
  cargo_hold: "mission_cargo_hold",
  metro_switch: "mission_metro_switch",
  clinic_tower: "mission_clinic_tower",
  night_depot: "mission_night_depot",
  castiron: "mission_castiron",
  vantage_point: "mission_vantage_point",
  penthouse: "mission_penthouse",
  dockside_relay: "mission_cargo_hold",
};

const planActionDefs = {
  smoke: { label: "Smoke", icon: "smoke_icon", targeted: true, inventory: "smoke" },
  flash: { label: "Flash", icon: "flash_icon", targeted: true, inventory: "flash" },
  breach: { label: "Breach", icon: "breach_icon", targeted: true, inventory: "charges" },
  step_breach_window: { label: "Step Breach Window", icon: "window_breach", targeted: true },
  drone: { label: "Drone", icon: "radio_icon", targeted: true, inventory: "drones" },
  focus: { label: "Focus", icon: "eye_icon", targeted: true },
  wait: { label: "Wait", icon: "medkit", targeted: false, duration: 1.15 },
  clear_room: { label: "Clear Room", icon: "op_rook", targeted: false },
};

const planActionOrder = ["smoke", "flash", "breach", "step_breach_window", "drone", "focus", "wait", "clear_room"];

const commandDefs = {
  select: { label: "Select", icon: "eye_icon" },
  waypoint: { label: "Move", icon: "op_rook" },
  squad: { label: "Squad", icon: "op_mako" },
  stack: { label: "Stack", icon: "breach_icon" },
  pan: { label: "Move Map", icon: "route" },
  focus: { label: "Focus", icon: "eye_icon", inventory: null },
  drone: { label: "Drone", icon: "radio_icon", inventory: "drones" },
  flash: { label: "Flash", icon: "flash_icon", inventory: "flash" },
  smoke: { label: "Smoke", icon: "smoke_icon", inventory: "smoke" },
  breach: { label: "Breach Door", icon: "breach_icon", inventory: "charges" },
  step_breach_window: { label: "Step Breach", icon: "window_breach" },
  medkit: { label: "Medkit", icon: "medkit", inventory: "medkits" },
};

const sideToolOrder = ["select", "waypoint", "squad", "stack", "pan", "focus", "drone", "flash", "smoke", "breach", "step_breach_window", "medkit"];

const radialActionOrder = ["waypoint", "stack", "focus", "smoke", "flash", "breach", "step_breach_window", "drone", "clear_room", "regroup_cover", "cancel"];

const radialActionDefs = {
  waypoint: { label: "Move", icon: "op_rook" },
  stack: { label: "Stack", icon: "breach_icon" },
  focus: { label: "Focus", icon: "eye_icon" },
  smoke: { label: "Smoke", icon: "smoke_icon" },
  flash: { label: "Flash", icon: "flash_icon" },
  breach: { label: "Breach Door", short: "Door Breach", icon: "breach_icon" },
  step_breach_window: { label: "Step Breach Window", short: "Window Breach", icon: "window_breach" },
  drone: { label: "Drone", icon: "radio_icon" },
  clear_room: { label: "Clear Room", short: "Clear", icon: "op_rook" },
  regroup_cover: { label: "Regroup Cover", short: "Regroup", icon: "command" },
  cancel: { label: "Cancel", icon: "radial_center" },
};

const maneuverDefs = {
  dynamic_entry: {
    label: "Dynamic Entry",
    icon: "shield",
    summary: "Stack, breach or open, flash the far side, then clear through.",
  },
  slice_pie: {
    label: "Slice Pie",
    icon: "command",
    summary: "Hold outside cover and split focus angles through a door or window.",
  },
  bounding: {
    label: "Bounding",
    icon: "route",
    summary: "One element covers while the other moves toward the tactical objective.",
  },
  smoke_cross: {
    label: "Smoke Cross",
    icon: "route",
    summary: "Deploy smoke across a watched lane before moving the fireteam.",
  },
  stair_sweep: {
    label: "Stair Sweep",
    icon: "stairs",
    summary: "Stack on stairs, cover above and below, then clear the next level.",
  },
  rescue_escort: {
    label: "Rescue Escort",
    icon: "shield",
    summary: "Send point to the civilian while rear operators cover and route to extract.",
  },
  regroup_cover: {
    label: "Regroup Cover",
    icon: "command",
    summary: "Break suppressed operators to nearby cover and face the threat.",
  },
};

const maneuverOrder = ["dynamic_entry", "slice_pie", "bounding", "smoke_cross", "stair_sweep", "rescue_escort", "regroup_cover"];

const enemyRoles = {
  sentry: { label: "Sentry", sprite: "enemy_a", hp: 54, armor: 0, speed: 56, range: 228, damage: 14, cooldown: 0.7, morale: 1 },
  rusher: { label: "Rusher", sprite: "enemy_b", hp: 48, armor: 0, speed: 86, range: 176, damage: 12, cooldown: 0.5, morale: 1.2 },
  armored: { label: "Armored", sprite: "enemy_c", hp: 78, armor: 10, speed: 48, range: 238, damage: 18, cooldown: 0.84, morale: 1.45 },
  flanker: { label: "Flanker", sprite: "enemy_b", hp: 50, armor: 1, speed: 76, range: 212, damage: 13, cooldown: 0.58, morale: 1.05 },
  suppressor: { label: "Suppressor", sprite: "enemy_c", hp: 62, armor: 4, speed: 52, range: 268, damage: 12, cooldown: 0.42, morale: 1.25 },
};

const operatorTemplates = [
  { id: "rook", name: "Rook", color: "#5db7b0", gear: "glock17", role: "Point", sprite: "op_rook" },
  { id: "mako", name: "Mako", color: "#e7bc4e", gear: "m4a1", role: "Assault", sprite: "op_mako" },
  { id: "lynx", name: "Lynx", color: "#98c96f", gear: "m110_sass", role: "Marksman", sprite: "op_lynx" },
  { id: "volt", name: "Volt", color: "#d77865", gear: "benelli_m4", role: "Breacher", sprite: "op_volt" },
];

const builtinAddons = [
  {
    id: "night_shift",
    title: "Night Shift",
    summary: "All missions become darker. Sight range drops, but operator first-shot accuracy rises.",
    type: "modifier",
  },
  {
    id: "hardline",
    title: "Hardline AI",
    summary: "Adds extra hostiles and makes alerted enemies push faster.",
    type: "modifier",
  },
  {
    id: "dockyard_pack",
    title: "Dockyard Pack",
    summary: "Adds the Dockside Relay mission to the operation board.",
    type: "mission-pack",
  },
  {
    id: "field_cache",
    title: "Field Cache",
    summary: "Operators deploy with one extra smoke and one extra flashbang.",
    type: "loadout",
  },
];

const state = {
  screen: "home",
  activeTab: "campaign",
  profile: loadProfile(),
  mission: null,
  missionSource: null,
  map: [],
  doors: [],
  windows: [],
  windowBreaches: [],
  operators: [],
  enemies: [],
  civilians: [],
  objectives: [],
  extraction: null,
  rooms: [],
  selectedId: "rook",
  selectedGroup: ["rook"],
  selectedTool: "waypoint",
  activeManeuvers: [],
  tacticalAdvice: null,
  armoryFilter: "all",
  running: false,
  missionTime: 0,
  outcome: null,
  log: [],
  effects: [],
  smokes: [],
  drones: [],
  noise: [],
  enemyIntel: makeEnemyIntel(),
  visibility: {
    visible: new Set(),
    seen: new Set(),
  },
  selectedWaypoint: null,
  pendingPlanAction: null,
  mapAuditWarnings: [],
  radial: {
    open: false,
    x: 0,
    y: 0,
    worldX: VIEW_W / 2,
    worldY: VIEW_H / 2,
    selected: null,
    source: "cursor",
  },
  lastPointer: {
    x: VIEW_W / 2,
    y: VIEW_H / 2,
    screenX: 0,
    screenY: 0,
  },
  camera: {
    x: VIEW_W / 2,
    y: VIEW_H / 2,
    zoom: 1.62,
    targetZoom: 1.62,
    follow: true,
    drag: null,
    suppressClick: false,
  },
  screenShake: { t: 0, mag: 0 },
  killFeed: [],
  selectionBox: null,
  rng: mulberry32(1),
  lastFrame: performance.now(),
  uiDirty: true,
  editor: makeEditorState(),
};

function loadProfile() {
  const fallback = {
    version: 1,
    callsign: "Local Commander",
    credits: 0,
    completed: {},
    bestGrades: {},
    addons: { dockyard_pack: true },
    customMissions: [],
    lastMissionId: "training_block",
    unlockedWeapons: makeDefaultUnlockedWeapons(),
    armory: operatorTemplates.reduce((acc, unit) => {
      acc[unit.id] = { gear: unit.gear, xp: 0, wounds: 0 };
      return acc;
    }, {}),
    stats: { missions: 0, rescues: 0, clears: 0 },
    settings: { sfx: true },
  };

  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!parsed || parsed.version !== 1) return fallback;
    parsed.armory = parsed.armory || {};
    for (const unit of operatorTemplates) {
      parsed.armory[unit.id] = parsed.armory[unit.id] || { gear: unit.gear, xp: 0, wounds: 0 };
      parsed.armory[unit.id].gear = normalizeWeaponId(parsed.armory[unit.id].gear, unit.gear);
      parsed.armory[unit.id].xp = parsed.armory[unit.id].xp || 0;
      parsed.armory[unit.id].wounds = parsed.armory[unit.id].wounds || 0;
    }
    parsed.customMissions = parsed.customMissions || [];
    parsed.lastMissionId = parsed.lastMissionId || "training_block";
    parsed.unlockedWeapons = parsed.unlockedWeapons || {};
    for (const id of defaultUnlockedWeapons) parsed.unlockedWeapons[id] = true;
    parsed.addons = parsed.addons || {};
    parsed.settings = parsed.settings || { sfx: true };
    parsed.stats = parsed.stats || { missions: 0, rescues: 0, clears: 0 };
    return parsed;
  } catch {
    return fallback;
  }
}

function saveProfile() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.profile));
  profileLine.textContent = `${state.profile.credits} credits | ${totalStars(state.profile)} stars | ${completionCount(state.profile)} ops complete`;
}

function makeDefaultUnlockedWeapons() {
  return defaultUnlockedWeapons.reduce((acc, id) => {
    acc[id] = true;
    return acc;
  }, {});
}

function completionRecord(profile, missionId) {
  const completed = profile && profile.completed ? profile.completed : {};
  return completed[missionId] || null;
}

function bestGradeForMission(profile, missionId) {
  const record = completionRecord(profile, missionId);
  if (record && typeof record === "object" && record.grade) return record.grade;
  if (profile && profile.bestGrades && profile.bestGrades[missionId]) return profile.bestGrades[missionId];
  return record ? "C" : "";
}

function starsForGrade(grade) {
  if (grade === "A") return 3;
  if (grade === "B") return 2;
  if (grade === "C" || grade === "D") return 1;
  return 0;
}

function completionStars(profile, missionId) {
  const record = completionRecord(profile, missionId);
  if (!record) return 0;
  if (typeof record === "object" && typeof record.stars === "number") return record.stars;
  return starsForGrade(bestGradeForMission(profile, missionId));
}

function totalStars(profile) {
  const completed = profile && profile.completed ? profile.completed : {};
  return Object.keys(completed).reduce((sum, id) => sum + completionStars(profile, id), 0);
}

function completionCount(profile) {
  const completed = profile && profile.completed ? profile.completed : {};
  return Object.keys(completed).filter((id) => Boolean(completed[id])).length;
}

function missionReward(mission, grade) {
  const difficulty = mission && mission.difficulty ? mission.difficulty : 1;
  return 30 + difficulty * 15 + (grade === "A" ? 20 : 0);
}

function recordMissionCompletion(profile, mission, grade, time, reward) {
  const stars = starsForGrade(grade);
  const previous = completionRecord(profile, mission.id);
  const previousStars = completionStars(profile, mission.id);
  const previousGrade = bestGradeForMission(profile, mission.id) || "F";
  const keepPrevious = previous && previousStars > stars;
  const bestGrade = betterGrade(previousGrade, grade);
  profile.completed[mission.id] = keepPrevious
    ? previous
    : {
        grade,
        stars,
        time: Number(time.toFixed(1)),
        reward,
        at: new Date().toISOString(),
      };
  profile.bestGrades[mission.id] = bestGrade;
}

function weaponUnlockStatus(id, profile) {
  const unlocked = profile && profile.unlockedWeapons && profile.unlockedWeapons[id];
  if (unlocked || defaultUnlockedWeapons.indexOf(id) >= 0) return { unlocked: true, purchasable: false, reason: "" };
  const req = weaponUnlockDefs[id];
  if (!req) return { unlocked: true, purchasable: false, reason: "" };
  const stars = totalStars(profile);
  const credits = profile && typeof profile.credits === "number" ? profile.credits : 0;
  const starsOk = stars >= req.stars;
  const creditsOk = credits >= req.credits;
  return {
    unlocked: false,
    purchasable: starsOk && creditsOk,
    reason: req.label,
    missing: `${Math.max(0, req.stars - stars)} stars, ${Math.max(0, req.credits - credits)} credits`,
    credits: req.credits,
    stars: req.stars,
  };
}

function nextWeaponUnlock(profile) {
  const locked = weaponOrder
    .map((id) => ({ id, status: weaponUnlockStatus(id, profile) }))
    .filter((item) => !item.status.unlocked)
    .sort((a, b) => {
      const aReq = weaponUnlockDefs[a.id] || { stars: 0, credits: 0 };
      const bReq = weaponUnlockDefs[b.id] || { stars: 0, credits: 0 };
      return aReq.stars - bReq.stars || aReq.credits - bReq.credits;
    });
  return locked.length ? locked[0] : null;
}

function assetImageMarkup(key, className, alt) {
  const src = imageAssetSources[key];
  if (!src) return "";
  return `<img class="${esc(className || "")}" src="${src}?v=${ASSET_VERSION}" alt="${esc(alt || "")}" />`;
}

function missionThumbnailKey(mission) {
  if (!mission) return "mission_training_block";
  if (missionThumbnailKeys[mission.id]) return missionThumbnailKeys[mission.id];
  if (mission.id && mission.id.indexOf("generated_") === 0) return "mission_rowhouse";
  const tags = mission.tags || [];
  if (tags.indexOf("dock") >= 0 || tags.indexOf("ship") >= 0) return "mission_cargo_hold";
  if (tags.indexOf("clinic") >= 0) return "mission_clinic_tower";
  if (tags.indexOf("bank") >= 0) return "mission_castiron";
  return "mission_rowhouse";
}

function weaponIconKey(id) {
  return `weapon_${normalizeWeaponId(id).replace(/_/g, "_")}`;
}

function makeEditorState() {
  const grid = makeBlankCharGrid();
  return {
    name: "Operation Workbench",
    brief: "A custom editor-built raid with validated room flow.",
    objectiveText: "Complete all placed objectives and extract.",
    tagsText: "custom, editor, validated",
    scenario: "Editor-authored single-site operation.",
    difficulty: 2,
    levels: 1,
    night: false,
    palette: "wall",
    grid,
    message: "Paint a mission, then Save or Test from the editor panel.",
    exportText: "",
  };
}

function makeBlankCharGrid() {
  const grid = makeGrid();
  setRect(grid, 5, 3, 9, 6);
  setRect(grid, 15, 3, 10, 6);
  setRect(grid, 7, 11, 11, 6);
  setRect(grid, 20, 11, 7, 6);
  setTiles(grid, [[5, 5], [13, 5], [15, 5], [22, 8], [11, 11], [18, 14], [24, 11]], "D");
  setTiles(grid, [[8, 3], [9, 3], [18, 3], [19, 3], [23, 16], [24, 16]], "W");
  setTiles(grid, [[9, 5], [12, 6], [18, 5], [22, 6], [10, 14], [15, 15], [23, 13]], "B");
  setTiles(grid, [[2, 5], [2, 6], [2, 7], [3, 10]], "S");
  setTiles(grid, [[10, 5], [21, 5], [14, 14], [24, 14]], "E");
  setTile(grid, 15, 14, "O");
  setTile(grid, 27, 17, "X");
  return grid;
}

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function normalizeWeaponId(id, fallback = "m4a1") {
  const mapped = weaponAliases[id] || id;
  return weaponDefs[mapped] ? mapped : fallback;
}

function weaponFor(id, fallback = "m4a1") {
  return weaponDefs[normalizeWeaponId(id, fallback)] || weaponDefs.m4a1;
}

function compatibleWeaponEntries(unit) {
  return weaponOrder
    .map((id) => [id, weaponDefs[id]])
    .filter(([, weapon]) => weapon.compat.includes(unit.role) || weapon.compat.includes(unit.id));
}

function weaponStatPct(value, max) {
  return clamp((value / max) * 100, 3, 100);
}

function uiSpriteStyle(name, width, height) {
  const standalone = imageAssetSources[name];
  if (standalone) {
    return `background-image:url("${standalone}?v=${ASSET_VERSION}");background-position:center;background-size:100% 100%;background-repeat:no-repeat;`;
  }
  const sprite = uiSprites[name] || uiSprites.logo;
  const w = width || sprite.w;
  const h = height || sprite.h;
  const scaleX = w / sprite.w;
  const scaleY = h / sprite.h;
  return `background-image:url("./assets/generated-ui-asset-sheet.png");background-position:-${sprite.x * scaleX}px -${sprite.y * scaleY}px;background-size:${UI_SHEET_W * scaleX}px ${UI_SHEET_H * scaleY}px;`;
}

function portraitMarkup(id, className = "", label = "") {
  const sprite = operatorPortraitSprites[id] || operatorPortraitSprites.rook;
  const src = imageAssetSources[sprite] ? `${imageAssetSources[sprite]}?v=${ASSET_VERSION}` : `./assets/generated-ui-asset-sheet.png?v=${ASSET_VERSION}`;
  return `<img class="op-portrait ${className}" alt="${esc(label || id)} portrait" src="${src}" />`;
}

function makeEnemyIntel() {
  return {
    sightings: {},
    lastKnown: null,
    lastNoise: null,
    regroup: null,
    alertLevel: 0,
    reinforce: null,
    squadAlert: {},
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function angleTo(a, b) {
  return Math.atan2(b.y - a.y, b.x - a.x);
}

function angleDiff(a, b) {
  let d = Math.abs(a - b) % (Math.PI * 2);
  if (d > Math.PI) d = Math.PI * 2 - d;
  return d;
}

function tileCenter(tx, ty) {
  return { x: tx * TILE + TILE / 2, y: ty * TILE + TILE / 2 };
}

function worldToTile(x, y) {
  return { tx: clamp(Math.floor(x / TILE), 0, COLS - 1), ty: clamp(Math.floor(y / TILE), 0, ROWS - 1) };
}

function keyOf(tx, ty) {
  return `${tx},${ty}`;
}

function visibilityKey(tx, ty) {
  return `${tx},${ty}`;
}

function isTileVisible(tx, ty) {
  return state.visibility.visible.has(visibilityKey(tx, ty));
}

function isTileSeen(tx, ty) {
  return state.visibility.seen.has(visibilityKey(tx, ty));
}

function isWallAdjacentToVisible(tx, ty) {
  return (
    isTileVisible(tx + 1, ty) ||
    isTileVisible(tx - 1, ty) ||
    isTileVisible(tx, ty + 1) ||
    isTileVisible(tx, ty - 1)
  );
}

function entityVisible(entity) {
  const tile = worldToTile(entity.x, entity.y);
  return isTileVisible(tile.tx, tile.ty) || entity.tagged > 0;
}

function atlasCell(name) {
  const index = atlasSprites[name] == null ? 0 : atlasSprites[name];
  return { sx: (index % ATLAS_COLS) * ATLAS_CELL, sy: Math.floor(index / ATLAS_COLS) * ATLAS_CELL };
}

function atlasIconStyle(name, size = 22) {
  const index = atlasSprites[name] == null ? 0 : atlasSprites[name];
  const col = index % ATLAS_COLS;
  const row = Math.floor(index / ATLAS_COLS);
  return `background-position:-${col * size}px -${row * size}px;background-size:${ATLAS_COLS * size}px auto;`;
}

function drawAtlasSprite(name, x, y, size, angle = 0, alpha = 1) {
  if (!runtimeAtlas.complete || !runtimeAtlas.naturalWidth || !(name in atlasSprites)) return false;
  const { sx, sy } = atlasCell(name);
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.rotate(angle);
  ctx.globalAlpha *= alpha;
  ctx.drawImage(runtimeAtlas, sx, sy, ATLAS_CELL, ATLAS_CELL, -size / 2, -size / 2, size, size);
  ctx.restore();
  return true;
}

function drawGeneratedAsset(name, x, y, size, alpha = 1) {
  return drawSheetAsset(name, x, y, size, size, alpha, 0);
}

function drawSheetAsset(name, x, y, width, height, alpha = 1, angle = 0) {
  const standalone = imageAssets[name];
  if (standalone && standalone.complete && standalone.naturalWidth) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));
    ctx.rotate(angle);
    ctx.globalAlpha *= alpha;
    ctx.drawImage(standalone, -width / 2, -height / 2, width, height);
    ctx.restore();
    return true;
  }
  const sprite = uiSprites[name];
  if (!sprite || !uiSheet.complete || !uiSheet.naturalWidth) return false;
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.rotate(angle);
  ctx.globalAlpha *= alpha;
  ctx.drawImage(uiSheet, sprite.x, sprite.y, sprite.w, sprite.h, -width / 2, -height / 2, width, height);
  ctx.restore();
  return true;
}

function spriteForFloor(x, y) {
  const pick = (x * 11 + y * 17) % 3;
  if (pick === 0) return "floor_a";
  if (pick === 1) return "floor_b";
  return "floor_c";
}

function mulberry32(seed) {
  let t = seed >>> 0;
  return function next() {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function makeGrid() {
  const grid = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => "."));
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      if (x === 0 || y === 0 || x === COLS - 1 || y === ROWS - 1) grid[y][x] = "#";
    }
  }
  return grid;
}

function setRect(grid, x, y, w, h, char = "#") {
  for (let yy = y; yy < y + h; yy += 1) {
    for (let xx = x; xx < x + w; xx += 1) {
      if (xx === x || yy === y || xx === x + w - 1 || yy === y + h - 1) grid[yy][xx] = char;
    }
  }
}

function setTile(grid, x, y, char) {
  if (x >= 0 && y >= 0 && x < COLS && y < ROWS) grid[y][x] = char;
}

function rowsFromGrid(grid) {
  return grid.map((row) => row.join(""));
}

function room(label, x, y, w, h, kind = "room") {
  return { label, x, y, w, h, kind };
}

function architectMission(config) {
  const grid = repairMissionGrid(config.grid, config.rooms || []);
  return {
    id: config.id,
    title: config.title,
    brief: config.brief,
    difficulty: config.difficulty,
    objectiveText: config.objectiveText,
    night: Boolean(config.night),
    tags: config.tags || [],
    rooms: config.rooms || [],
    enemyOverrides: config.enemyOverrides || [],
    levels: config.levels || 1,
    scenario: config.scenario || "",
    tiles: rowsFromGrid(grid),
  };
}

function setEnemy(grid, overrides, x, y, role = "sentry") {
  setTile(grid, x, y, "E");
  if (overrides) overrides.push({ tx: x, ty: y, role });
}

function setEnemies(grid, overrides, entries) {
  for (const entry of entries) setEnemy(grid, overrides, entry[0], entry[1], entry[2] || "sentry");
}

function setTiles(grid, points, char) {
  for (const p of points) setTile(grid, p[0], p[1], char);
}

function cloneCharGrid(input) {
  const rows = Array.isArray(input) ? input : [];
  return Array.from({ length: ROWS }, (_, y) => {
    const row = rows[y] == null ? "" : rows[y];
    const chars = Array.isArray(row) ? row.slice() : String(row).split("");
    while (chars.length < COLS) chars.push(".");
    return chars.slice(0, COLS);
  });
}

function missionCharPassable(ch) {
  return ch != null && ch !== "#" && ch !== "B" && ch !== "W";
}

function missionMarker(ch) {
  return ch === "S" || ch === "E" || ch === "C" || ch === "O" || ch === "X";
}

function findMissionTiles(grid, chars) {
  const targets = [];
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      if (chars.indexOf(grid[y][x]) >= 0) targets.push({ tx: x, ty: y });
    }
  }
  return targets;
}

function floodMissionGrid(grid, start) {
  const reached = new Set();
  if (!start || !missionCharPassable(grid[start.ty][start.tx])) return reached;
  const queue = [start];
  reached.add(keyOf(start.tx, start.ty));
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  while (queue.length) {
    const current = queue.shift();
    for (const dir of dirs) {
      const nx = current.tx + dir[0];
      const ny = current.ty + dir[1];
      if (nx <= 0 || ny <= 0 || nx >= COLS - 1 || ny >= ROWS - 1) continue;
      const key = keyOf(nx, ny);
      if (reached.has(key) || !missionCharPassable(grid[ny][nx])) continue;
      reached.add(key);
      queue.push({ tx: nx, ty: ny });
    }
  }
  return reached;
}

function roomInteriorTarget(grid, item) {
  const cx = clamp(Math.floor(item.x + item.w / 2), 1, COLS - 2);
  const cy = clamp(Math.floor(item.y + item.h / 2), 1, ROWS - 2);
  const candidates = [{ tx: cx, ty: cy }];
  for (let r = 1; r <= Math.max(item.w, item.h); r += 1) {
    for (let y = item.y + 1; y < item.y + item.h - 1; y += 1) {
      for (let x = item.x + 1; x < item.x + item.w - 1; x += 1) {
        if (Math.abs(x - cx) + Math.abs(y - cy) === r) candidates.push({ tx: x, ty: y });
      }
    }
  }
  for (const point of candidates) {
    if (point.tx > 0 && point.ty > 0 && point.tx < COLS - 1 && point.ty < ROWS - 1 && missionCharPassable(grid[point.ty][point.tx])) {
      return point;
    }
  }
  grid[cy][cx] = ".";
  return { tx: cx, ty: cy };
}

function openMissionPathTile(grid, tx, ty, emergencyFloor = false) {
  if (tx <= 0 || ty <= 0 || tx >= COLS - 1 || ty >= ROWS - 1) return;
  const ch = grid[ty][tx];
  if (missionMarker(ch) || ch === "D") return;
  if (ch === "#") {
    grid[ty][tx] = emergencyFloor ? "." : "D";
  } else if (ch === "B" || ch === "W") {
    grid[ty][tx] = ".";
  }
}

function openMissionFloorTile(grid, tx, ty) {
  if (tx <= 0 || ty <= 0 || tx >= COLS - 1 || ty >= ROWS - 1) return;
  const ch = grid[ty][tx];
  if (!missionMarker(ch) && ch !== "D") grid[ty][tx] = ".";
}

function carveMissionSegment(grid, from, to) {
  let x = from.tx;
  let y = from.ty;
  const dx = Math.sign(to.tx - from.tx);
  const dy = Math.sign(to.ty - from.ty);
  while (x !== to.tx || y !== to.ty) {
    openMissionPathTile(grid, x, y, true);
    if (x !== to.tx) x += dx;
    else if (y !== to.ty) y += dy;
  }
  openMissionPathTile(grid, to.tx, to.ty, true);
}

function carveMissionPath(grid, from, to) {
  if (!from || !to) return;
  const midA = { tx: to.tx, ty: from.ty };
  const midB = { tx: from.tx, ty: to.ty };
  const useA = Math.abs(to.tx - from.tx) >= Math.abs(to.ty - from.ty);
  const mid = useA ? midA : midB;
  carveMissionSegment(grid, from, mid);
  carveMissionSegment(grid, mid, to);
}

function clearMarkerAccess(grid) {
  const markers = findMissionTiles(grid, "SECOX");
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  for (const marker of markers) {
    let hasExit = false;
    for (const dir of dirs) {
      const nx = marker.tx + dir[0];
      const ny = marker.ty + dir[1];
      if (nx > 0 && ny > 0 && nx < COLS - 1 && ny < ROWS - 1 && missionCharPassable(grid[ny][nx])) hasExit = true;
    }
    if (!hasExit) openMissionFloorTile(grid, marker.tx + 1, marker.ty);
  }
}

function clearDoorAccess(grid) {
  const doors = findMissionTiles(grid, "D");
  for (const door of doors) {
    const left = missionCharPassable(grid[door.ty][door.tx - 1]);
    const right = missionCharPassable(grid[door.ty][door.tx + 1]);
    const up = missionCharPassable(grid[door.ty - 1][door.tx]);
    const down = missionCharPassable(grid[door.ty + 1][door.tx]);
    if ((left && right) || (up && down)) continue;
    if (left || right) {
      openMissionFloorTile(grid, door.tx - 1, door.ty);
      openMissionFloorTile(grid, door.tx + 1, door.ty);
    } else {
      openMissionFloorTile(grid, door.tx, door.ty - 1);
      openMissionFloorTile(grid, door.tx, door.ty + 1);
    }
  }
}

function repairMissionGrid(input, rooms = []) {
  const grid = cloneCharGrid(input);
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      if (x === 0 || y === 0 || x === COLS - 1 || y === ROWS - 1) grid[y][x] = "#";
    }
  }
  let starts = findMissionTiles(grid, "S");
  if (!starts.length) {
    grid[ROWS - 3][2] = "S";
    starts = findMissionTiles(grid, "S");
  }
  const root = starts[0];
  const targets = starts.slice(1)
    .concat(findMissionTiles(grid, "ECOX"))
    .concat((rooms || []).map((item) => roomInteriorTarget(grid, item)));
  clearMarkerAccess(grid);
  clearDoorAccess(grid);
  for (let pass = 0; pass < 4; pass += 1) {
    const reached = floodMissionGrid(grid, root);
    let repaired = false;
    for (const target of targets) {
      if (!reached.has(keyOf(target.tx, target.ty))) {
        carveMissionPath(grid, root, target);
        repaired = true;
      }
    }
    clearMarkerAccess(grid);
    clearDoorAccess(grid);
    if (!repaired) break;
  }
  return grid;
}

function openingIsPlausible(grid, point) {
  const x = point.tx;
  const y = point.ty;
  const wallLeft = grid[y][x - 1] === "#";
  const wallRight = grid[y][x + 1] === "#";
  const wallUp = grid[y - 1][x] === "#";
  const wallDown = grid[y + 1][x] === "#";
  const passLeft = missionCharPassable(grid[y][x - 1]);
  const passRight = missionCharPassable(grid[y][x + 1]);
  const passUp = missionCharPassable(grid[y - 1][x]);
  const passDown = missionCharPassable(grid[y + 1][x]);
  const passCount = (passLeft ? 1 : 0) + (passRight ? 1 : 0) + (passUp ? 1 : 0) + (passDown ? 1 : 0);
  return passCount >= 1;
}

function collectMissionAuditWarnings(mission) {
  if (!mission || !mission.tiles) return [];
  const grid = repairMissionGrid(mission.tiles, mission.rooms || []);
  const warnings = [];
  const layout = auditMissionLayout(mission);
  if (layout && !layout.connected) warnings.push("Some rooms or mission targets are unreachable.");
  for (const door of findMissionTiles(grid, "D")) {
    if (!openingIsPlausible(grid, door)) warnings.push(`Door ${door.tx},${door.ty} needs a cleaner wall opening.`);
  }
  for (const win of findMissionTiles(grid, "W")) {
    if (!openingIsPlausible(grid, win)) warnings.push(`Window ${win.tx},${win.ty} should be seated in a wall line.`);
  }
  for (const item of mission.rooms || []) {
    if (item.w < 4 || item.h < 4) warnings.push(`${item.label || "Room"} is too small to read as useful space.`);
  }
  return warnings.slice(0, 10);
}

function auditMissionLayout(mission) {
  if (!mission || !mission.tiles) return null;
  const grid = repairMissionGrid(mission.tiles, mission.rooms || []);
  const starts = findMissionTiles(grid, "S");
  const root = starts[0];
  const targets = starts.slice(1)
    .concat(findMissionTiles(grid, "ECOX"))
    .concat((mission.rooms || []).map((item) => roomInteriorTarget(grid, item)));
  const reached = floodMissionGrid(grid, root);
  const unreachable = targets.filter((target) => !reached.has(keyOf(target.tx, target.ty)));
  return {
    connected: unreachable.length === 0,
    starts: starts.length,
    rooms: mission.rooms ? mission.rooms.length : 0,
    levels: mission.levels || 1,
    doors: findMissionTiles(grid, "D").length,
    stairs: findMissionTiles(grid, "A").length,
    warnings: collectMissionAuditWarningsShallow(grid, mission).length,
    unreachable: unreachable.length,
  };
}

function collectMissionAuditWarningsShallow(grid, mission) {
  const warnings = [];
  for (const door of findMissionTiles(grid, "D")) {
    if (!openingIsPlausible(grid, door)) warnings.push("door");
  }
  for (const win of findMissionTiles(grid, "W")) {
    if (!openingIsPlausible(grid, win)) warnings.push("window");
  }
  for (const item of (mission && mission.rooms) || []) {
    if (item.w < 4 || item.h < 4) warnings.push("room");
  }
  return warnings;
}

function addRoomShell(grid, rooms, label, x, y, w, h, kind) {
  setRect(grid, x, y, w, h);
  rooms.push(room(label, x, y, w, h, kind));
}

function missionTrainingBlock() {
  const g = makeGrid();
  const rooms = [];
  // West-to-east approach: Entry Hall → Glass Office overwatch → Kill House (objective) → Side Annex flanker pocket.
  addRoomShell(g, rooms, "Entry Hall", 5, 2, 10, 7, "training");
  addRoomShell(g, rooms, "Glass Office", 16, 2, 10, 7, "office");
  addRoomShell(g, rooms, "Kill House", 7, 11, 18, 7, "training");
  addRoomShell(g, rooms, "Side Annex", 20, 9, 7, 5, "annex");
  // Doors: west ingress, office passthrough, office↔annex, hall↔killhouse, killhouse↔annex, killhouse east exit.
  setTiles(g, [[5, 5], [15, 5], [20, 8], [12, 11], [20, 11], [24, 14]], "D");
  // Windows: glass partition between Entry Hall and Glass Office (lets squad see the desk sentry).
  setTiles(g, [[15, 3], [15, 7], [22, 8]], "W");
  // Cover: sandbag stacks where defenders sit, plus a tight crate ring around the objective laptop.
  setTiles(g, [[9, 4], [10, 4], [22, 4], [23, 4], [21, 14], [23, 14], [22, 16], [25, 12]], "B");
  // Starts: 4 ops on the west edge.
  setTiles(g, [[2, 5], [2, 7], [2, 9], [3, 11]], "S");
  // Enemies: entry sentry watches west door, office sentry sits behind desk (visible through glass),
  // killhouse overwatch covers the hall door, an armored guards the objective, an annex flanker waits to ambush.
  setTiles(g, [[9, 5], [22, 5], [10, 13], [21, 15], [24, 12]], "E");
  setTile(g, 22, 15, "O");
  setTile(g, 2, 17, "X");
  return architectMission({
    id: "training_block",
    title: "Operation Glassline",
    brief: "Defenders sit behind sandbags in each room; the objective laptop is ringed with crates and an armored guard.",
    difficulty: 1,
    objectiveText: "Clear the block and secure the training laptop.",
    scenario: "Three-room training facility with a flanking annex. Sentries watch their doors; cross the glass partition with care.",
    tags: ["training", "windows", "short lanes"],
    rooms,
    grid: g,
  });
}

function missionMarketRescue() {
  const g = makeGrid();
  const rooms = [];
  // Two shopfronts up top with a covered market lane between them and the south block.
  // Hostage is held in the Tea House (NE); Back Office defenders watch the lane and rear door.
  addRoomShell(g, rooms, "West Shopfront", 4, 2, 10, 7, "shop");
  addRoomShell(g, rooms, "Tea House", 16, 2, 10, 7, "shop");
  addRoomShell(g, rooms, "Hostage Store", 5, 11, 9, 7, "rescue");
  addRoomShell(g, rooms, "Back Office", 17, 11, 9, 7, "office");
  // Doors: shopfront entries from the market lane + rear doors into the south block.
  setTiles(g, [[8, 8], [20, 8], [9, 11], [21, 11], [17, 14]], "D");
  // Windows: shopfront glass faces the market lane (south wall) so defenders can shoot through.
  setTiles(g, [[6, 8], [11, 8], [18, 8], [23, 8], [13, 5]], "W");
  // Crate islands form a covered market lane (y=10), broken so the squad can pick a side.
  for (let x = 6; x < 25; x += 3) {
    if (x === 9 || x === 21) continue;
    setTile(g, x, 10, "B");
  }
  // Defensive cover: sandbag positions in each shopfront facing the lane, plus a tight ring around the hostage.
  setTiles(g, [[6, 7], [11, 7], [18, 7], [23, 7], [21, 4], [22, 14], [21, 15], [23, 15]], "B");
  // Starts: 4 ops on the west edge, ready to flash through the shopfront door.
  setTiles(g, [[2, 3], [2, 5], [2, 7], [2, 9]], "S");
  // Enemies: shopfront sentries with sandbag overwatch on the lane, a rusher in the Back Office stack,
  // an armored guarding the hostage, a flanker waiting in the Hostage Store doorway.
  setTiles(g, [[10, 4], [21, 4], [25, 10], [8, 14], [22, 13], [22, 15], [19, 15]], "E");
  // Civilian inside the Hostage Store, close enough to force a controlled clear.
  setTile(g, 10, 14, "C");
  setTile(g, 26, 16, "X");
  return architectMission({
    id: "market_rescue",
    title: "Operation Market Lantern",
    brief: "Shopfront sentries cover the market lane through window slits; the hostage is held in the south store behind a close guard.",
    difficulty: 2,
    objectiveText: "Rescue the civilian and reach extraction.",
    scenario: "Cross the market lane under fire from shopfront windows, then breach the rear block to free the hostage.",
    tags: ["hostage", "shopfronts", "crossfire lane"],
    rooms,
    grid: g,
  });
}

function missionServerVault() {
  const g = makeGrid();
  const rooms = [];
  // Three chained admin rooms across the top, all feeding into a long Server Hall below.
  // Server Hall is the objective room — server racks form lanes, armored guards the data core.
  addRoomShell(g, rooms, "Reception", 3, 2, 8, 7, "entry");
  addRoomShell(g, rooms, "Admin Office", 12, 2, 8, 7, "office");
  addRoomShell(g, rooms, "Vault Foyer", 21, 2, 6, 7, "foyer");
  addRoomShell(g, rooms, "Server Hall", 4, 11, 22, 7, "objective");
  // Doors: rooms chain left→right across the top, then each top room drops into the Server Hall.
  setTiles(g, [[10, 5], [20, 5], [7, 8], [15, 8], [23, 8], [25, 14]], "D");
  // Windows along the admin/server divider so squad on top can read the hall layout.
  setTiles(g, [[11, 11], [19, 11], [17, 2], [25, 5]], "W");
  // Server rack islands run east-west, forming three covered lanes through the hall.
  for (const p of [
    [6, 13], [9, 13], [12, 13], [15, 13], [18, 13], [21, 13], [24, 13],
    [6, 16], [9, 16], [12, 16], [15, 16], [18, 16], [21, 16],
  ]) setTile(g, p[0], p[1], "B");
  // Defender sandbags: admin desks + a ring around the data core at (23,14).
  setTiles(g, [[7, 4], [14, 4], [23, 4], [22, 14], [22, 15], [24, 15]], "B");
  // Starts: 4 ops in the SW corner (the only reception-side entry).
  setTiles(g, [[2, 15], [2, 16], [3, 15], [3, 16]], "S");
  // Enemies: 3 admin sentries (one per top room), 2 hall riflemen behind racks,
  // a suppressor at the east end of the hall, an armored on the data core.
  setTiles(g, [[7, 5], [17, 5], [23, 5], [10, 15], [16, 15], [25, 13], [23, 14]], "E");
  // Objective shifts into the protected corner; armored stands right next to it.
  setTile(g, 23, 15, "O");
  setTile(g, 28, 17, "X");
  return architectMission({
    id: "server_vault",
    title: "Operation Blackbox",
    brief: "Three admin rooms chain into a long Server Hall. Racks split the hall into lanes; an armored guards the data core.",
    difficulty: 3,
    objectiveText: "Secure the server core and extract.",
    scenario: "Clear the admin floor top-down, then push the long Server Hall through three covered lanes.",
    tags: ["server rows", "chained rooms", "hard objective"],
    rooms,
    grid: g,
  });
}

function missionNightDepot() {
  const g = makeGrid();
  const rooms = [];
  // Two top rooms (Gate Office + Dispatch) feed a big Warehouse below.
  // Night op: short sight range. Dispatch windows give defenders overwatch on the warehouse floor.
  addRoomShell(g, rooms, "Gate Office", 3, 3, 8, 6, "entry");
  addRoomShell(g, rooms, "Dispatch", 14, 2, 12, 6, "office");
  addRoomShell(g, rooms, "Warehouse", 8, 11, 17, 7, "objective");
  // Doors: gate office connects to dispatch via the central seam; both drop to warehouse.
  setTiles(g, [[10, 5], [11, 8], [20, 7], [19, 11], [10, 14], [24, 14]], "D");
  // Windows from Dispatch into the Warehouse so defenders can see the relay objective from above.
  setTiles(g, [[16, 8], [18, 8], [22, 8]], "W");
  // Shipping containers form three rows of cover lanes through the warehouse.
  for (const p of [
    [10, 13], [13, 13], [16, 13], [19, 13], [22, 13],
    [11, 16], [14, 16], [17, 16], [20, 16], [23, 16],
  ]) setTile(g, p[0], p[1], "B");
  // Defender sandbags in the top rooms + a ring around the relay drive at (18,15).
  setTiles(g, [[6, 4], [7, 4], [17, 4], [18, 4], [17, 15], [19, 15]], "B");
  // Starts: 4 ops on the west edge, behind the gate.
  setTiles(g, [[2, 4], [2, 6], [2, 8], [3, 10]], "S");
  // Enemies: 2 gate sentries, 2 dispatch overwatch (with windowed lines on warehouse),
  // 3 warehouse defenders (1 armored on objective, 1 suppressor at the back, 1 flanker by east door).
  setTiles(g, [[7, 5], [19, 4], [23, 5], [12, 15], [18, 16], [22, 15], [23, 13]], "E");
  setTile(g, 18, 15, "O");
  setTile(g, 28, 17, "X");
  return architectMission({
    id: "night_depot",
    title: "Operation Nightfall",
    brief: "Night op. Dispatch overwatch fires through window slits onto the warehouse floor; the relay drive sits inside a container ring.",
    difficulty: 4,
    objectiveText: "Recover the relay drive and extract.",
    night: true,
    scenario: "Short sight range under lights-out. Take the dispatch overwatch first or smoke the windowed wall.",
    tags: ["night", "warehouse", "wide angles"],
    rooms,
    grid: g,
  });
}

function missionDocksideRelay() {
  const g = makeGrid();
  const rooms = [];
  // Harbor Office (NW) + Customs Shed (NE) overlook a container yard; Relay Room (objective) sits in the south.
  addRoomShell(g, rooms, "Harbor Office", 5, 2, 8, 6, "office");
  addRoomShell(g, rooms, "Customs Shed", 15, 3, 11, 6, "shed");
  addRoomShell(g, rooms, "Relay Room", 8, 12, 14, 6, "objective");
  // Container row at y=10 — gapped so the squad can pick lanes.
  for (let x = 3; x < 28; x += 3) setTile(g, x, 10, "B");
  // Doors: harbor↔customs, harbor→yard, customs→yard, relay west door, relay east door.
  setTiles(g, [[13, 5], [8, 7], [20, 8], [12, 12], [21, 12]], "D");
  // Windows: harbor office faces the yard; customs has a sniper slit on the east wall.
  setTiles(g, [[10, 7], [12, 5], [17, 8], [19, 8], [26, 6]], "W");
  // Defender cover: office desks, customs shelving, relay-room console ring around objective.
  setTiles(g, [[7, 4], [11, 4], [18, 4], [22, 4], [25, 5], [18, 14], [20, 14]], "B");
  // Starts: 4 ops on the west pier edge.
  setTiles(g, [[2, 14], [2, 15], [2, 16], [3, 16]], "S");
  // Enemies: harbor sentry, harbor flanker, customs sentry, customs SUPPRESSOR with east window angle,
  // yard rusher behind a container, relay armored, relay sentry.
  setTiles(g, [[9, 4], [11, 6], [19, 4], [25, 6], [14, 11], [19, 15], [13, 15]], "E");
  setTile(g, 19, 14, "O");
  setTile(g, 28, 3, "X");
  return architectMission({
    id: "dockside_relay",
    title: "Operation Dockside Signal",
    brief: "Harbor office and customs shed overwatch a container yard. The customs suppressor owns the east lane; armored guards the relay.",
    difficulty: 4,
    objectiveText: "Capture the relay and extract through the pier gate.",
    scenario: "Yard containers split the approach into three lanes — silence the customs suppressor or smoke the yard before pushing.",
    tags: ["dockyard", "containers", "relay"],
    rooms,
    grid: g,
  });
}

function missionEmbassyAnnex() {
  const g = makeGrid();
  const rooms = [];
  // Three top rooms (lobby/records/suite) chain into a southern Courtyard + Security Hub.
  // Security Hub is the objective; multi-entry layout means the squad can split or rush.
  addRoomShell(g, rooms, "Visa Lobby", 4, 2, 9, 7, "lobby");
  addRoomShell(g, rooms, "Records", 14, 2, 6, 7, "records");
  addRoomShell(g, rooms, "Consul Suite", 21, 2, 7, 7, "suite");
  addRoomShell(g, rooms, "Courtyard", 5, 10, 11, 8, "open");
  addRoomShell(g, rooms, "Security Hub", 17, 11, 10, 7, "objective");
  // Doors: lobby west ingress, lobby↔records, records↔suite, suite→hub, lobby→courtyard,
  //        courtyard→hub (rear flank), hub east door.
  setTiles(g, [[4, 5], [14, 5], [20, 5], [24, 8], [9, 10], [16, 14], [26, 14]], "D");
  // Glass: lobby north windows (street facing), records-to-courtyard glass, suite-to-hub glass.
  setTiles(g, [[6, 2], [10, 2], [15, 2], [23, 2], [16, 12], [16, 16]], "W");
  // Cover: lobby sandbags facing the west door, records desk, courtyard planters, hub objective ring.
  setTiles(g, [[6, 4], [7, 4], [11, 6], [16, 4], [22, 5], [8, 13], [12, 14], [22, 14], [23, 16], [25, 16]], "B");
  // Starts: 4 ops on the west edge, breaching through (4,5).
  setTiles(g, [[2, 4], [2, 5], [2, 6], [3, 12]], "S");
  // Enemies: lobby sentry, records analyst, suite sentry, courtyard flanker behind planter,
  // hub overwatch with windowed sightline, armored north of archive, suppressor in east hub corner.
  setTiles(g, [[7, 5], [16, 5], [23, 5], [13, 14], [20, 13], [22, 14], [25, 14]], "E");
  setTile(g, 22, 15, "O");
  setTile(g, 28, 17, "X");
  return architectMission({
    id: "embassy_annex",
    title: "Operation Blackglass",
    brief: "Three glass-fronted offices chain into a courtyard crossing and a heavily defended Security Hub.",
    difficulty: 3,
    objectiveText: "Recover the security archive and extract through the rear service gate.",
    scenario: "Multi-entry consulate: rush the lobby or break through the courtyard flank — either way the hub bites back.",
    tags: ["glass", "courtyard", "multi-entry"],
    rooms,
    grid: g,
  });
}

function missionMetroSwitch() {
  const g = makeGrid();
  const rooms = [];
  // Above: Ticket Hall + Control Booth (objective) + Maintenance.
  // Below: Platform A (long lane) with Power Room hanging off the south.
  // Cover islands on the platform; booth windows let Control Booth fire down at the squad.
  addRoomShell(g, rooms, "Ticket Hall", 3, 2, 10, 6, "lobby");
  addRoomShell(g, rooms, "Control Booth", 15, 2, 7, 6, "objective");
  addRoomShell(g, rooms, "Maintenance", 23, 3, 5, 6, "service");
  addRoomShell(g, rooms, "Platform A", 4, 11, 22, 4, "platform");
  addRoomShell(g, rooms, "Power Room", 9, 15, 9, 4, "power");
  // Platform cover islands: gapped sandbags every other tile so the squad has cover but not a wall.
  for (let x = 5; x < 25; x += 2) setTile(g, x, 10, "B");
  // Doors: ticket↔booth, booth↔maintenance, ticket→platform, booth→platform, maintenance→platform, power room.
  setTiles(g, [[14, 5], [22, 5], [7, 7], [18, 7], [24, 10], [13, 15]], "D");
  // Booth windows fire south onto the platform; maintenance has a slit on the east wall.
  setTiles(g, [[16, 7], [18, 7], [20, 7], [26, 6]], "W");
  // Defender cover: booth desk + maintenance overwatch + island ring around the switch console.
  setTiles(g, [[18, 3], [19, 3], [25, 4], [25, 5], [17, 4], [13, 12], [21, 12]], "B");
  // Starts: 4 ops west of the platform.
  setTiles(g, [[2, 12], [2, 13], [3, 12], [3, 13]], "S");
  // Enemies: ticket sentry, booth armored over objective, maintenance suppressor with east window angle,
  // platform rusher behind ticket-side island, platform sentry mid-platform, flanker by power room door.
  setTiles(g, [[10, 4], [18, 4], [25, 6], [8, 12], [17, 12], [22, 13], [15, 16]], "E");
  setTile(g, 18, 3, "O");
  setTile(g, 28, 12, "X");
  return architectMission({
    id: "metro_switch",
    title: "Operation Metro Cutoff",
    brief: "Booth windows rain fire on the platform; armored guards the switch console while a power-room flanker waits on the southern approach.",
    difficulty: 4,
    objectiveText: "Shut down the control booth and extract across the platform.",
    scenario: "Long platform lane controlled by booth windows. Smoke the booth or clear maintenance first to silence the suppressor.",
    tags: ["long lanes", "cover islands", "control room"],
    rooms,
    grid: g,
  });
}

function missionClinicTower() {
  const g = makeGrid();
  const rooms = [];
  // Divider wall at x=14,15 splits floor 1 (west) from floor 2 (east).
  // Stair tiles in the divider at y=10..12 are the only crossing — defender bottleneck.
  for (let y = 1; y < ROWS - 1; y += 1) {
    setTile(g, 14, y, "#");
    setTile(g, 15, y, "#");
  }
  setTiles(g, [[14, 10], [15, 10], [14, 11], [15, 11], [14, 12], [15, 12]], "A");
  // Floor 1 (ground): lobby on top, pharmacy + stairwell mid, ambulance bay on bottom.
  addRoomShell(g, rooms, "Ground Lobby", 2, 2, 12, 6, "level-1");
  addRoomShell(g, rooms, "Pharmacy", 2, 9, 6, 5, "level-1");
  addRoomShell(g, rooms, "Stairwell G", 9, 9, 5, 5, "stairs");
  addRoomShell(g, rooms, "Ambulance Bay", 2, 15, 12, 4, "level-1");
  // Floor 2 (upstairs): second floor hall + patient ward + ICU + roof access (objective).
  addRoomShell(g, rooms, "Second Floor Hall", 16, 2, 12, 5, "level-2");
  addRoomShell(g, rooms, "Patient Ward", 16, 8, 6, 5, "level-2");
  addRoomShell(g, rooms, "ICU", 23, 8, 5, 5, "level-2");
  addRoomShell(g, rooms, "Roof Access", 16, 15, 12, 4, "level-2");
  // Doors: lobby↔pharmacy, pharmacy↔stairwell, lobby↔stairwell, stairwell↔ambulance,
  //        second hall↔patient ward, ward↔ICU, second hall↔roof, ICU↔roof.
  setTiles(g, [[2, 5], [5, 8], [10, 8], [13, 11], [11, 13], [22, 7], [22, 12], [25, 10], [22, 14], [27, 12]], "D");
  // Windows for line-of-sight pressure: lobby street face, ambulance bay, patient ward viewing pane, ICU obs glass.
  setTiles(g, [[4, 2], [10, 2], [4, 18], [10, 18], [18, 2], [25, 2], [18, 12], [27, 9]], "W");
  // Defender cover: lobby reception desk, pharmacy counter, stairwell sandbags facing the stairs,
  //                 second-floor hall, ICU bedside, roof-access objective ring.
  setTiles(g, [[6, 4], [10, 4], [4, 11], [11, 10], [11, 11], [18, 4], [24, 4], [18, 10], [25, 10], [24, 16], [26, 16]], "B");
  // Starts: 4 ops on the west edge, ground floor.
  setTiles(g, [[1, 4], [1, 5], [2, 17], [3, 17]], "S");
  // Enemies:
  //  Ground: lobby sentry, pharmacy sentry, stairwell ARMORED defending the only crossing, ambulance bay flanker.
  //  Upstairs: hall overwatch, patient-ward guard near civilian, ICU sentry, suppressor + armored on roof objective.
  setTiles(g, [[8, 5], [5, 12], [12, 12], [6, 16], [22, 4], [18, 10], [24, 10], [22, 16], [25, 16]], "E");
  // Civilian held inside the patient ward.
  setTile(g, 19, 10, "C");
  // Objective on the roof-access side; armored guards it.
  setTile(g, 22, 17, "O");
  setTile(g, 2, 18, "X");
  return architectMission({
    id: "clinic_tower",
    title: "Operation Meridian Ward",
    brief: "Two-level clinic. The stairwell is the only crossing and an armored guards it; upstairs an armored + suppressor hold the roof objective.",
    difficulty: 4,
    objectiveText: "Rescue the patient, seize the roof-access records, and extract through the ambulance bay.",
    tags: ["two-story", "stairwell", "hostage rescue", "hospital"],
    rooms,
    levels: 2,
    scenario: "Multi-story clinic. Force the stairwell with smoke + flash, secure the civilian in the patient ward, then push the roof objective.",
    grid: g,
  });
}

function missionProcedural(seedText = "daily") {
  const presets = [blueprintCivicOffice, blueprintPumpHouse, blueprintRowhouse];
  const index = hashString(seedText) % presets.length;
  return presets[index](seedText);
}

function shuffledPoints(points, seedText) {
  const rnd = mulberry32(hashString(seedText));
  const copy = points.map((p) => [p[0], p[1]]);
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rnd() * (i + 1));
    const swap = copy[i];
    copy[i] = copy[j];
    copy[j] = swap;
  }
  return copy;
}

function placeCuratedPoints(grid, points, char, count) {
  const limit = count == null ? points.length : Math.min(count, points.length);
  let placed = 0;
  for (const p of points) {
    if (placed >= limit) break;
    const current = grid[p[1]] && grid[p[1]][p[0]];
    if (current !== "." && current !== "D") continue;
    setTile(grid, p[0], p[1], char);
    placed += 1;
  }
}

function blueprintCivicOffice(seedText) {
  const g = makeGrid();
  const rooms = [];
  addRoomShell(g, rooms, "Lobby", 3, 2, 8, 6, "entry");
  addRoomShell(g, rooms, "Bullpen", 12, 2, 8, 6, "office");
  addRoomShell(g, rooms, "Records", 21, 2, 6, 6, "records");
  addRoomShell(g, rooms, "Evidence", 5, 10, 10, 7, "objective");
  addRoomShell(g, rooms, "Interview", 16, 10, 5, 7, "room");
  addRoomShell(g, rooms, "Server Closet", 22, 11, 6, 6, "service");
  setTiles(g, [[3, 5], [7, 7], [12, 5], [19, 5], [16, 7], [21, 5], [9, 10], [14, 13], [18, 10], [22, 14]], "D");
  setTiles(g, [[5, 2], [6, 2], [13, 7], [14, 7], [23, 2], [24, 2], [6, 16], [7, 16], [22, 12]], "W");
  setTiles(g, [[5, 4], [9, 5], [14, 4], [17, 5], [24, 4], [8, 13], [11, 14], [18, 14], [25, 15]], "B");
  setTiles(g, [[2, 4], [2, 5], [2, 6], [3, 16]], "S");
  placeCuratedPoints(g, shuffledPoints([[9, 4], [16, 5], [24, 5], [8, 13], [13, 15], [18, 13], [25, 14]], `civic:${seedText}`), "E", 6);
  setTile(g, 24, 14, "O");
  setTile(g, 27, 17, "X");
  return architectMission({
    id: `generated_${hashString(seedText).toString(16)}`,
    title: `Operation Civic Warrant ${formatBlueprintSuffix(seedText)}`,
    brief: "A civic-office blueprint with a records hall, a contested evidence room, and a server-closet flank.",
    difficulty: 3,
    objectiveText: "Secure the evidence room and extract through the south corridor.",
    scenario: `Generated civic-office blueprint, seed ${seedText}.`,
    tags: ["civic office", "records", "validated"],
    rooms,
    grid: g,
  });
}

function blueprintPumpHouse(seedText) {
  const g = makeGrid();
  const rooms = [];
  addRoomShell(g, rooms, "Loading Bay", 4, 3, 9, 6, "entry");
  addRoomShell(g, rooms, "Pump Hall", 15, 3, 12, 7, "industrial");
  addRoomShell(g, rooms, "Chemical Store", 4, 11, 7, 6, "storage");
  addRoomShell(g, rooms, "Control Room", 13, 12, 8, 5, "objective");
  addRoomShell(g, rooms, "Break Room", 22, 12, 6, 5, "room");
  setTiles(g, [[4, 6], [8, 8], [15, 6], [21, 9], [7, 11], [13, 14], [20, 14], [24, 12]], "D");
  setTiles(g, [[6, 3], [7, 3], [16, 3], [17, 3], [25, 6], [26, 6], [15, 16], [16, 16]], "W");
  setTiles(g, [[9, 5], [12, 9], [18, 5], [21, 6], [24, 8], [6, 14], [15, 14], [18, 14], [24, 15]], "B");
  setTiles(g, [[2, 6], [2, 7], [3, 8], [3, 9]], "S");
  placeCuratedPoints(g, shuffledPoints([[8, 5], [18, 6], [23, 7], [7, 14], [15, 13], [19, 15], [25, 14]], `pump:${seedText}`), "E", 6);
  setTile(g, 17, 14, "O");
  setTile(g, 27, 4, "X");
  return architectMission({
    id: `generated_${hashString(seedText).toString(16)}`,
    title: `Operation Pump Hall ${formatBlueprintSuffix(seedText)}`,
    brief: "An industrial pump complex with a loading bay, chemical storage, and a defended control room.",
    difficulty: 4,
    objectiveText: "Seize the control room and extract through the north gate.",
    scenario: `Generated industrial blueprint, seed ${seedText}.`,
    tags: ["industrial", "pump house", "validated"],
    rooms,
    grid: g,
  });
}

function blueprintRowhouse(seedText) {
  const g = makeGrid();
  const rooms = [];
  addRoomShell(g, rooms, "Front Room", 3, 3, 7, 5, "entry");
  addRoomShell(g, rooms, "Kitchen", 11, 3, 6, 5, "room");
  addRoomShell(g, rooms, "Bedroom", 18, 3, 8, 5, "room");
  addRoomShell(g, rooms, "Alley Office", 5, 11, 8, 6, "office");
  addRoomShell(g, rooms, "Safe Room", 15, 11, 7, 6, "objective");
  addRoomShell(g, rooms, "Garage", 23, 11, 5, 6, "garage");
  setTiles(g, [[3, 5], [9, 5], [11, 5], [16, 5], [18, 5], [22, 11], [9, 11], [13, 14], [18, 11], [23, 14]], "D");
  setTiles(g, [[5, 3], [6, 3], [14, 3], [20, 3], [21, 3], [6, 16], [7, 16], [24, 16]], "W");
  setTiles(g, [[7, 5], [13, 6], [20, 5], [24, 6], [8, 13], [17, 13], [20, 15], [25, 14]], "B");
  setTiles(g, [[2, 4], [2, 5], [2, 6], [3, 17]], "S");
  placeCuratedPoints(g, shuffledPoints([[7, 5], [14, 5], [22, 5], [9, 14], [18, 14], [20, 13], [25, 14]], `row:${seedText}`), "E", 6);
  setTile(g, 18, 14, "O");
  setTile(g, 27, 17, "X");
  return architectMission({
    id: `generated_${hashString(seedText).toString(16)}`,
    title: `Operation Rowhouse Lock ${formatBlueprintSuffix(seedText)}`,
    brief: "A rowhouse compound with front-to-back flow, side-office pressure, and a safe-room objective.",
    difficulty: 3,
    objectiveText: "Secure the safe room and extract through the garage lane.",
    scenario: `Generated rowhouse blueprint, seed ${seedText}.`,
    tags: ["urban", "rowhouse", "validated"],
    rooms,
    grid: g,
  });
}

function formatBlueprintSuffix(seedText) {
  return ((hashString(String(seedText || "daily")) >>> 0).toString(16).toUpperCase().slice(0, 4).padStart(4, "0"));
}

// Lock gating: difficulty 1-2 always unlocked; higher tiers require completed ops at lower tiers.
// Custom missions and procedurals stay unlocked regardless.
function missionUnlockStatus(mission, profile) {
  if (!mission) return { unlocked: true, reason: "" };
  if (mission.custom || (mission.id && mission.id.indexOf("generated_") === 0)) return { unlocked: true, reason: "" };
  const difficulty = mission.difficulty || 1;
  if (difficulty <= 2) return { unlocked: true, reason: "" };
  const completed = profile && profile.completed ? profile.completed : {};
  const all = baseMissions();
  const completedByDiff = (maxDiff) => all.filter((item) => (item.difficulty || 1) <= maxDiff && completed[item.id]).length;
  const requirements = {
    3: { tier: 2, needed: 1, label: "Complete any difficulty 1-2 op" },
    4: { tier: 3, needed: 2, label: "Complete any two difficulty 1-3 ops" },
    5: { tier: 4, needed: 3, label: "Complete any three difficulty 1-4 ops" },
  };
  const req = requirements[difficulty];
  if (!req) return { unlocked: true, reason: "" };
  const have = completedByDiff(req.tier);
  return have >= req.needed
    ? { unlocked: true, reason: "" }
    : { unlocked: false, reason: `${req.label} (${have}/${req.needed})` };
}

function isMissionUnlocked(mission) {
  return missionUnlockStatus(mission, state.profile).unlocked;
}

function missionSteelhouse() {
  const g = makeGrid();
  const rooms = [];
  // Cartel safehouse: Garage on the west, Foyer connector, Vault objective NE,
  // Back Den dominating the south, Roof Garden flank SE.
  addRoomShell(g, rooms, "Garage", 2, 2, 11, 7, "entry");
  addRoomShell(g, rooms, "Foyer Hall", 13, 2, 9, 5, "lobby");
  addRoomShell(g, rooms, "Stash Vault", 22, 2, 6, 7, "objective");
  addRoomShell(g, rooms, "Back Den", 2, 11, 14, 7, "den");
  addRoomShell(g, rooms, "Roof Garden", 17, 11, 11, 7, "open");
  // Doors: garage west entry, garage→foyer, foyer→vault, garage→den, foyer→garden, den↔garden.
  setTiles(g, [[2, 5], [13, 4], [21, 5], [7, 11], [18, 6], [16, 14]], "D");
  // Windows: garage roll-up shutters, vault armored glass, garden tall windows.
  setTiles(g, [[5, 2], [9, 2], [25, 2], [22, 6], [20, 11], [24, 11]], "W");
  // Cover: garage stacks of crates, foyer reception, vault objective ring, den couch row, roof planters.
  setTiles(g, [[5, 5], [9, 5], [16, 4], [20, 4], [23, 4], [24, 7], [26, 7], [5, 14], [9, 14], [13, 14], [20, 14], [25, 14]], "B");
  // Starts: 4 ops on the west edge at the garage door.
  setTiles(g, [[1, 4], [1, 5], [1, 6], [1, 7]], "S");
  // Enemies: garage rusher + sentry, foyer sentry, vault armored + sentry (on objective),
  // den suppressor with sandbag stack, roof flanker on the planter line.
  setTiles(g, [[6, 4], [10, 6], [17, 4], [23, 5], [26, 6], [8, 15], [22, 15]], "E");
  // Vault objective: stash crate, with the armored standing on the adjacent tile.
  setTile(g, 25, 7, "O");
  setTile(g, 28, 17, "X");
  return architectMission({
    id: "steelhouse",
    title: "Operation Steelhouse",
    brief: "Cartel safehouse with a garage entry and an armored vault. Roof garden flank lets the den suppressor pin the southern push.",
    difficulty: 3,
    objectiveText: "Seize the stash vault and exit through the roof garden.",
    scenario: "Garage entry forks: push the vault directly or peel into the back den to silence the suppressor before going for the stash.",
    tags: ["safehouse", "vault", "flank route"],
    rooms,
    grid: g,
  });
}

function missionVantagePoint() {
  const g = makeGrid();
  const rooms = [];
  // Two-floor police station siege. Divider at x=14,15; stair tiles at y=9..11.
  for (let y = 1; y < ROWS - 1; y += 1) {
    setTile(g, 14, y, "#");
    setTile(g, 15, y, "#");
  }
  setTiles(g, [[14, 9], [15, 9], [14, 10], [15, 10], [14, 11], [15, 11]], "A");
  // Floor 1 (west, ground): Front Desk + Holding Cells + Locker Room + South Lot.
  addRoomShell(g, rooms, "Front Desk", 2, 2, 12, 5, "level-1");
  addRoomShell(g, rooms, "Holding Cells", 2, 8, 6, 6, "level-1");
  addRoomShell(g, rooms, "Locker Room", 9, 8, 5, 6, "level-1");
  addRoomShell(g, rooms, "South Lot", 2, 15, 12, 4, "level-1");
  // Floor 2 (east, upstairs): Briefing Room + Interrogation (civilian) + Captain's Office (objective) + Roof Bay (extract).
  addRoomShell(g, rooms, "Briefing Room", 16, 2, 12, 5, "level-2");
  addRoomShell(g, rooms, "Interrogation", 16, 8, 6, 6, "level-2");
  addRoomShell(g, rooms, "Captain's Office", 23, 8, 5, 6, "objective");
  addRoomShell(g, rooms, "Roof Bay", 16, 15, 12, 4, "level-2");
  // Doors: front desk west entry, desk↔holding, desk↔locker, holding↔south lot, locker↔south lot,
  //        briefing↔interrogation, interrogation↔captain, briefing↔roof, captain↔roof, plus a roof west door.
  setTiles(g, [[2, 4], [5, 7], [11, 7], [5, 14], [11, 14], [21, 7], [22, 11], [25, 7], [24, 14], [16, 11]], "D");
  // Windows for sightlines: front desk to street, briefing to street, interrogation observation pane, locker grates.
  setTiles(g, [[5, 2], [10, 2], [18, 2], [25, 2], [22, 9], [27, 11], [4, 14], [10, 14]], "W");
  // Defender cover: front desk counter, holding sandbag, locker bench, south lot containers,
  //                 briefing podium, interrogation table, captain's desk ring, roof barricades.
  setTiles(g, [[5, 4], [10, 4], [4, 11], [11, 11], [6, 16], [10, 16], [18, 4], [24, 4], [18, 10], [24, 11], [26, 11], [20, 16], [25, 16]], "B");
  // Starts: 4 ops on west, ground floor (two at the desk, two at the south lot).
  setTiles(g, [[1, 4], [1, 5], [1, 17], [2, 17]], "S");
  // Enemies (10):
  //  Floor 1: desk sentry, holding-cells guard, locker rusher, south-lot sentry, stairwell ARMORED.
  //  Floor 2: briefing overwatch, interrogation guard (next to civilian), captain ARMORED at objective,
  //           roof-bay suppressor with east window angle.
  setTiles(g, [[8, 4], [4, 11], [11, 12], [8, 16], [12, 10], [18, 4], [18, 11], [25, 10], [22, 16], [26, 15]], "E");
  setTile(g, 19, 10, "C");
  setTile(g, 25, 9, "O");
  setTile(g, 2, 17, "S");
  setTile(g, 28, 17, "X");
  return architectMission({
    id: "vantage_point",
    title: "Operation Vantage Point",
    brief: "Two-floor police station siege. Both stairwells are gated by armored, the interrogation room holds the informant, and the captain's office is the objective.",
    difficulty: 5,
    objectiveText: "Rescue the informant, seize the captain's case files, and extract through the roof bay.",
    scenario: "Force the central stairwell with a smoke + flash combo, secure the informant in interrogation, then push the captain's office through the upstairs hall.",
    tags: ["multi-floor", "siege", "hostage", "armored"],
    rooms,
    levels: 2,
    grid: g,
  });
}

function missionGreenroom() {
  const g = makeGrid();
  const rooms = [];
  // Nightclub. Bar lines the west wall; dance floor dominates the centre with cover columns;
  // DJ booth is the objective on a raised back wall; VIP lounge SE is a flanker pocket;
  // restrooms run along the south wall and double as a rear approach.
  addRoomShell(g, rooms, "Bar", 2, 2, 6, 10, "lobby");
  addRoomShell(g, rooms, "Dance Floor", 9, 2, 14, 11, "open");
  addRoomShell(g, rooms, "DJ Booth", 24, 2, 5, 5, "objective");
  addRoomShell(g, rooms, "VIP Lounge", 24, 7, 5, 6, "suite");
  addRoomShell(g, rooms, "Restroom Corridor", 2, 14, 21, 4, "service");
  addRoomShell(g, rooms, "Stage Backstage", 24, 14, 5, 4, "service");
  // Doors: street entry via bar, bar→dance floor, dance↔DJ, dance↔VIP, dance↔restroom,
  //        bar↔restroom, restroom↔backstage, VIP↔backstage.
  setTiles(g, [[2, 5], [8, 7], [21, 4], [21, 9], [11, 13], [5, 14], [22, 14], [24, 11]], "D");
  // Windows: street-facing bar glass, DJ booth one-way mirror onto the floor, VIP smoked glass.
  setTiles(g, [[4, 2], [7, 2], [24, 4], [24, 9], [27, 9]], "W");
  // Cover: bar counter, dance-floor columns, DJ booth ring, VIP couches, restroom partition.
  setTiles(g, [[3, 4], [3, 8], [12, 5], [16, 5], [12, 9], [16, 9], [20, 7], [25, 3], [27, 4], [25, 9], [27, 11], [7, 16], [13, 16], [18, 16]], "B");
  // Starts: 4 ops west of the bar entry.
  setTiles(g, [[1, 4], [1, 5], [1, 7], [1, 9]], "S");
  // Enemies: bar bouncer, dance-floor sentry behind column, dance armored centre-floor,
  // VIP flanker, DJ booth defender, backstage suppressor, restroom rusher.
  setTiles(g, [[5, 5], [13, 7], [17, 8], [26, 10], [26, 4], [26, 16], [9, 16]], "E");
  // Objective: DJ booth mixing console.
  setTile(g, 26, 3, "O");
  setTile(g, 28, 17, "X");
  return architectMission({
    id: "greenroom",
    title: "Operation Greenroom",
    brief: "Nightclub raid. Bouncer + dance-floor armored hold the centre; VIP lounge is a flanker pocket; restrooms feed a rear approach.",
    difficulty: 3,
    objectiveText: "Seize the DJ booth mixer and extract through the stage door.",
    scenario: "Bar street-window angles are exposed — smoke the dance floor, peel the VIP flanker before pushing the DJ booth.",
    tags: ["nightclub", "columns", "flank route"],
    rooms,
    grid: g,
  });
}

function missionCargoHold() {
  const g = makeGrid();
  const rooms = [];
  // Cargo ship main deck. Bridge sits NE with windows onto the deck; crew quarters NW;
  // the container deck dominates the south; engine room SE houses a suppressor.
  // Container rows form three north-south lanes across the deck.
  addRoomShell(g, rooms, "Crew Quarters", 2, 2, 9, 7, "level-1");
  addRoomShell(g, rooms, "Bridge", 19, 2, 9, 6, "objective");
  addRoomShell(g, rooms, "Container Deck", 2, 10, 18, 8, "open");
  addRoomShell(g, rooms, "Engine Room", 21, 11, 7, 7, "service");
  // Doors: dockside entry (west), crew↔deck, bridge↔deck, deck↔cargo hold, deck↔engine room.
  setTiles(g, [[2, 5], [6, 9], [22, 7], [12, 10], [19, 14], [21, 16]], "D");
  // Windows: bridge fires south through windowed wall onto the deck; engine room has east slit.
  setTiles(g, [[21, 7], [24, 7], [26, 7], [27, 13]], "W");
  // Container row cover: three north-south rows of containers on the deck.
  for (let y = 11; y < 18; y += 3) {
    for (let x = 4; x < 19; x += 4) setTile(g, x, y, "B");
  }
  // Defender cover: crew bunks, bridge console ring around the helm/objective, engine sandbags, container lash points.
  setTiles(g, [[5, 4], [9, 4], [21, 4], [25, 4], [22, 13], [25, 13], [22, 16], [10, 14], [14, 14], [7, 17], [18, 11]], "B");
  // Starts: 4 ops at the west dockside.
  setTiles(g, [[1, 4], [1, 5], [1, 6], [1, 7]], "S");
  // Enemies: crew rusher, crew sentry, bridge armored over helm, bridge sentry,
  // deck patrol (rusher + flanker behind containers), engine suppressor on east slit, deck guard.
  setTiles(g, [[5, 5], [8, 7], [22, 4], [25, 4], [10, 13], [16, 16], [26, 13], [12, 14]], "E");
  // Objective: bridge helm console.
  setTile(g, 23, 4, "O");
  setTile(g, 28, 9, "X");
  return architectMission({
    id: "cargo_hold",
    title: "Operation Cargo Hold",
    brief: "Cargo ship. Bridge windows fire south down the container deck; engine-room suppressor owns the east lane; cargo rows split the squad into three lanes.",
    difficulty: 4,
    objectiveText: "Seize the bridge helm and extract through the gantry.",
    scenario: "Push one of the three container lanes — left lane gets you to the bridge fastest but is in window fire; right lane silences the engine suppressor.",
    tags: ["ship", "containers", "bridge overwatch"],
    rooms,
    grid: g,
  });
}

function missionCastiron() {
  const g = makeGrid();
  const rooms = [];
  // Bank robbery counter-op. Lobby west → Teller Line centre (chained windowed counter) →
  // Vault Foyer → Strong Room (objective, armored). Manager Office is a side flank;
  // Safety Deposit Hall runs along the south wall as an alt route.
  addRoomShell(g, rooms, "Lobby", 2, 2, 10, 7, "lobby");
  addRoomShell(g, rooms, "Manager Office", 2, 11, 8, 7, "office");
  addRoomShell(g, rooms, "Teller Line", 13, 2, 9, 7, "service");
  addRoomShell(g, rooms, "Vault Foyer", 23, 2, 5, 7, "foyer");
  addRoomShell(g, rooms, "Strong Room", 22, 11, 6, 7, "objective");
  addRoomShell(g, rooms, "Safety Deposit Hall", 11, 11, 10, 7, "service");
  // Doors: street entry (lobby west), lobby↔teller, teller↔vault foyer, vault foyer↔strong room,
  //        lobby↔manager, manager↔deposit, deposit↔strong room.
  setTiles(g, [[2, 5], [12, 5], [22, 5], [25, 9], [6, 11], [10, 14], [21, 14]], "D");
  // Windows: teller counter glass facing lobby; strong-room observation pane.
  setTiles(g, [[13, 4], [13, 6], [22, 14], [25, 11]], "W");
  // Defender cover: lobby sandbag posts, manager desk, teller counter, vault sandbag ring,
  //                 strong-room cover ring around the bullion stack.
  setTiles(g, [[4, 4], [8, 4], [4, 13], [8, 13], [15, 4], [19, 4], [25, 4], [27, 5], [13, 14], [17, 14], [24, 13], [27, 14], [24, 16], [27, 16]], "B");
  // Starts: 4 ops on the west street.
  setTiles(g, [[1, 4], [1, 5], [1, 6], [1, 7]], "S");
  // Enemies (9 — hardest single-floor map):
  //  Lobby: sentry + flash-cover rusher.
  //  Manager Office: flanker behind desk.
  //  Teller Line: 2 tellers behind window counter (sentries with windowed line on lobby).
  //  Vault Foyer: armored guarding the strong-room door.
  //  Safety Deposit Hall: suppressor with deposit-hall lane.
  //  Strong Room: armored on objective + sentry.
  setTiles(g, [[5, 4], [9, 6], [5, 14], [15, 5], [19, 5], [25, 6], [16, 13], [25, 13], [26, 14]], "E");
  // Objective: bullion stack inside strong room.
  setTile(g, 25, 14, "O");
  setTile(g, 28, 17, "X");
  return architectMission({
    id: "castiron",
    title: "Operation Castiron",
    brief: "Bank vault op. Teller-line glass + vault armored + a deposit-hall suppressor make the direct push punishing; the manager-office flank is quieter but slower.",
    difficulty: 5,
    objectiveText: "Seize the strong-room bullion and extract through the rear loading bay.",
    scenario: "Two routes: rush the teller line under window fire, or peel the manager office flank to drop the deposit-hall suppressor before pushing the strong room.",
    tags: ["bank", "chained rooms", "vault armored", "flank route"],
    rooms,
    grid: g,
  });
}

function missionCatacomb() {
  const g = makeGrid();
  const rooms = [];
  // Underground crypt + maintenance tunnels. Narrow corridors with column cover and
  // a vaulted reliquary as the objective. Compact and claustrophobic for difficulty 2.
  addRoomShell(g, rooms, "Stair Down", 2, 2, 7, 5, "entry");
  addRoomShell(g, rooms, "North Crypt", 10, 2, 9, 5, "service");
  addRoomShell(g, rooms, "Reliquary", 20, 2, 8, 5, "objective");
  addRoomShell(g, rooms, "Pump Tunnel", 2, 8, 24, 4, "service");
  addRoomShell(g, rooms, "Ossuary", 4, 13, 12, 6, "den");
  addRoomShell(g, rooms, "Maintenance", 17, 13, 11, 6, "service");
  // Doors: stair→crypt, crypt→reliquary, stair→pump, crypt→pump, reliquary→pump,
  //        pump→ossuary, pump→maintenance, ossuary↔maintenance.
  setTiles(g, [[8, 4], [19, 4], [5, 8], [14, 8], [24, 8], [9, 12], [22, 12], [16, 15]], "D");
  // Windows here read as iron grates in stone walls — useful for tossing flashes.
  setTiles(g, [[12, 8], [18, 8], [10, 13], [21, 13]], "W");
  // Column cover: stair landing, crypt sarcophagi, reliquary altar ring, tunnel cisterns, ossuary bone piles.
  setTiles(g, [[4, 4], [14, 4], [16, 4], [22, 3], [24, 3], [22, 4], [6, 10], [12, 10], [18, 10], [22, 10], [7, 16], [10, 16], [20, 15], [25, 15]], "B");
  // Starts: 4 ops at the stair-down landing.
  setTiles(g, [[1, 3], [1, 4], [1, 5], [1, 6]], "S");
  // Enemies: stair sentry, crypt rusher, reliquary armored next to relic,
  // tunnel flanker behind cistern, ossuary suppressor on the bone piles, maintenance flanker.
  setTiles(g, [[5, 4], [14, 4], [22, 4], [11, 10], [9, 16], [20, 16]], "E");
  setTile(g, 25, 4, "O");
  setTile(g, 28, 17, "X");
  return architectMission({
    id: "catacomb",
    title: "Operation Catacomb",
    brief: "Underground crypt op. Narrow corridors and grated windows let defenders trade fire across the pump tunnel; an armored guards the reliquary altar.",
    difficulty: 2,
    objectiveText: "Seize the relic and extract through the maintenance shaft.",
    scenario: "Two routes: crypt-and-reliquary north push, or pump-tunnel-and-ossuary southern flank.",
    tags: ["underground", "narrow corridors", "stone walls"],
    rooms,
    grid: g,
  });
}

function missionYardline() {
  const g = makeGrid();
  const rooms = [];
  // Rail yard. Two parked train cars form north/south cover spines; control tower
  // overlooks both lanes with windows; foreman's office is the objective.
  addRoomShell(g, rooms, "Yard Gate", 2, 2, 7, 7, "entry");
  addRoomShell(g, rooms, "Control Tower", 23, 2, 5, 8, "objective");
  addRoomShell(g, rooms, "Coupler Shed", 10, 2, 11, 5, "service");
  addRoomShell(g, rooms, "Locker Bay", 2, 12, 8, 6, "service");
  addRoomShell(g, rooms, "Foreman Office", 11, 12, 9, 6, "office");
  addRoomShell(g, rooms, "Loading Dock", 21, 12, 7, 6, "open");
  // Doors: gate→shed, shed→tower, gate→locker, locker→foreman, foreman→dock, tower→dock.
  setTiles(g, [[9, 5], [22, 5], [5, 12], [10, 14], [20, 14], [25, 10]], "D");
  // Windows: tower fires south down the rail spine; locker bay south wall slit; shed east end.
  setTiles(g, [[23, 5], [25, 5], [23, 9], [5, 17], [22, 4]], "W");
  // Train-car cover spines on north and south rails (gapped for lane choice).
  for (const p of [
    // North spine (rail at y=9-10)
    [10, 9], [12, 9], [14, 9], [17, 9], [19, 9], [22, 9],
    // South spine (rail at y=11)
    [11, 11], [13, 11], [16, 11], [18, 11], [21, 11], [24, 11],
  ]) setTile(g, p[0], p[1], "B");
  // Defender cover: gate sandbags, tower console, locker bench, foreman desk ring.
  setTiles(g, [[4, 4], [7, 4], [25, 4], [25, 8], [4, 14], [7, 14], [13, 14], [17, 14], [23, 14], [26, 14]], "B");
  setTiles(g, [[1, 4], [1, 5], [1, 6], [1, 7]], "S");
  // Enemies: gate rusher, gate sentry, tower ARMORED on objective + tower sentry with window angle,
  // yard suppressor on north rail spine, foreman office flanker, dock sentry, locker rusher.
  setTiles(g, [[5, 5], [7, 6], [25, 4], [25, 8], [15, 9], [14, 14], [25, 14], [4, 16]], "E");
  setTile(g, 25, 5, "O");
  setTile(g, 28, 17, "X");
  return architectMission({
    id: "yardline",
    title: "Operation Yardline",
    brief: "Rail yard. Two train spines split the yard into three lanes; control tower windows rain fire south; foreman office is the rear flank.",
    difficulty: 3,
    objectiveText: "Seize the control tower and extract through the loading dock.",
    scenario: "Push between the train cars or peel through the locker bay — tower windows punish the open lanes.",
    tags: ["yard", "trains", "tower overwatch"],
    rooms,
    grid: g,
  });
}

function missionPenthouse() {
  const g = makeGrid();
  const rooms = [];
  // Two-floor luxury condo siege. Divider at x=14,15; stairs at y=9..11.
  // Floor 1: foyer, security room, kitchen, parking entry. Floor 2: gallery, master suite (civilian),
  // panic room (objective), rooftop bay (extract).
  for (let y = 1; y < ROWS - 1; y += 1) {
    setTile(g, 14, y, "#");
    setTile(g, 15, y, "#");
  }
  setTiles(g, [[14, 9], [15, 9], [14, 10], [15, 10], [14, 11], [15, 11]], "A");
  addRoomShell(g, rooms, "Lobby Foyer", 2, 2, 12, 5, "level-1");
  addRoomShell(g, rooms, "Security Room", 2, 9, 5, 5, "level-1");
  addRoomShell(g, rooms, "Kitchen", 8, 8, 6, 7, "level-1");
  addRoomShell(g, rooms, "Parking Entry", 2, 15, 12, 4, "level-1");
  addRoomShell(g, rooms, "Gallery", 16, 2, 10, 4, "level-2");
  addRoomShell(g, rooms, "Master Suite", 16, 7, 7, 7, "level-2");
  addRoomShell(g, rooms, "Panic Room", 23, 8, 5, 6, "objective");
  addRoomShell(g, rooms, "Roof Bay", 16, 15, 12, 4, "level-2");
  // Doors: lobby west entry, lobby↔security, lobby↔kitchen, security↔parking, kitchen↔parking,
  //        gallery↔master, master↔panic, gallery↔roof, panic↔roof.
  setTiles(g, [[2, 4], [5, 9], [11, 8], [5, 13], [11, 16], [20, 5], [20, 7], [22, 11], [25, 8], [24, 15], [16, 12]], "D");
  // Windows: lobby street face, gallery street face, master observation, security one-way mirror.
  setTiles(g, [[5, 2], [10, 2], [18, 2], [24, 2], [22, 8], [27, 11], [4, 11], [13, 12]], "W");
  // Defender cover: lobby reception ring, security desk, kitchen counter, parking bollards,
  //                 gallery plinth, master sandbags, panic-room console ring, roof planters.
  setTiles(g, [[6, 4], [10, 4], [4, 11], [11, 11], [6, 17], [10, 17], [18, 4], [23, 4], [18, 10], [20, 12], [24, 11], [26, 11], [20, 16], [25, 16]], "B");
  setTiles(g, [[1, 4], [1, 5], [1, 17], [2, 17]], "S");
  // Enemies (10): lobby sentry, security analyst behind desk, kitchen rusher, parking flanker,
  // stairwell ARMORED at the divider, gallery overwatch with window angle, master guard near civilian,
  // panic-room ARMORED on objective, roof suppressor on east window slit, roof sentry.
  setTiles(g, [[8, 4], [4, 11], [11, 12], [8, 17], [12, 10], [18, 4], [19, 11], [25, 10], [26, 15], [22, 16]], "E");
  setTile(g, 20, 10, "C");
  setTile(g, 25, 9, "O");
  setTile(g, 28, 17, "X");
  return architectMission({
    id: "penthouse",
    title: "Operation Penthouse",
    brief: "Two-floor luxury condo siege. Stairwell gated by armored, panic-room armored on the objective, civilian held in master suite.",
    difficulty: 5,
    objectiveText: "Rescue the civilian, seize the panic-room safe, and extract through the roof bay.",
    scenario: "Force the central stairwell with smoke + flash, peel master suite for the civilian, then breach the panic room.",
    tags: ["multi-floor", "siege", "hostage", "panic room"],
    rooms,
    levels: 2,
    grid: g,
  });
}

function baseMissions() {
  return [
    missionTrainingBlock(),
    missionCatacomb(),
    missionEmbassyAnnex(),
    missionMarketRescue(),
    missionGreenroom(),
    missionYardline(),
    missionServerVault(),
    missionSteelhouse(),
    missionCargoHold(),
    missionMetroSwitch(),
    missionClinicTower(),
    missionNightDepot(),
    missionCastiron(),
    missionVantagePoint(),
    missionPenthouse(),
    missionProcedural("2026-05-23"),
  ];
}

function availableMissions() {
  const list = baseMissions();
  if (state.profile.addons.dockyard_pack) list.push(missionDocksideRelay());
  for (const mission of state.profile.customMissions) list.push(mission);
  return list;
}

function normalizeImportedMission(input) {
  const mission = input && input.mission ? input.mission : input;
  if (!mission || !Array.isArray(mission.tiles)) throw new Error("Mission must include a tiles array.");
  if (mission.tiles.length !== ROWS) throw new Error(`Mission needs ${ROWS} rows.`);
  for (const row of mission.tiles) {
    if (String(row).length !== COLS) throw new Error(`Each row must be ${COLS} characters.`);
  }
  const rooms = Array.isArray(mission.rooms) ? mission.rooms : [];
  const tags = Array.isArray(mission.tags)
    ? mission.tags
    : String(mission.tags || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
  const repairedGrid = repairMissionGrid(mission.tiles.map(String), rooms);
  return {
    id: mission.id || `custom_${Date.now()}`,
    title: mission.title || "Custom Mission",
    brief: mission.brief || "Imported mission.",
    difficulty: clamp(Number(mission.difficulty || 2), 1, 5),
    objectiveText: mission.objectiveText || "Complete all objectives.",
    night: Boolean(mission.night),
    tags,
    rooms,
    levels: clamp(Number(mission.levels || 1), 1, 3),
    scenario: mission.scenario || "",
    tiles: rowsFromGrid(repairedGrid),
    custom: true,
  };
}

function parseMission(mission) {
  const repairedTiles = rowsFromGrid(repairMissionGrid(mission.tiles || [], mission.rooms || []));
  const map = [];
  const starts = [];
  const doors = [];
  const windows = [];
  const enemies = [];
  const civilians = [];
  const objectives = [];
  let extraction = null;
  const roleOverrides = mission.enemyOverrides || [];

  for (let y = 0; y < ROWS; y += 1) {
    const row = [];
    const source = repairedTiles[y] || ".".repeat(COLS);
    for (let x = 0; x < COLS; x += 1) {
      const ch = source[x] || ".";
      let type = "floor";
      if (ch === "#") type = "wall";
      if (ch === "D") {
        type = "door";
        doors.push({ tx: x, ty: y, open: false, hp: 1, opening: 0 });
      }
      if (ch === "W") {
        type = "window";
        windows.push({ tx: x, ty: y, breached: false });
      }
      if (ch === "B") type = "crate";
      if (ch === "A") type = "stairs";
      if (ch === "S") starts.push(tileCenter(x, y));
      if (ch === "E") {
        const override = roleOverrides.find((item) => item.tx === x && item.ty === y);
        enemies.push(makeEnemy(x, y, enemies.length, mission.difficulty, override ? override.role : null));
      }
      if (ch === "C") civilians.push({ id: `civ${civilians.length + 1}`, ...tileCenter(x, y), rescued: false, extracted: false, followId: null });
      if (ch === "O") objectives.push({ id: `obj${objectives.length + 1}`, ...tileCenter(x, y), secured: false, progress: 0 });
      if (ch === "X") extraction = tileCenter(x, y);
      row.push({ type });
    }
    map.push(row);
  }

  while (starts.length < 4) starts.push(tileCenter(2 + starts.length, ROWS - 3));
  assignContextualEnemyRoles(enemies, mission, { objectives, civilians, rooms: mission.rooms || [], starts, windows });
  assignEnemySquads(enemies);
  return { map, starts, doors, windows, enemies, civilians, objectives, extraction, rooms: mission.rooms || [] };
}

function makeEnemy(tx, ty, index, difficulty, roleOverride) {
  const p = tileCenter(tx, ty);
  const roleCycle = difficulty >= 3 ? ["sentry", "rusher", "flanker", "armored", "suppressor"] : ["sentry", "rusher", "flanker"];
  const roleKey = enemyRoles[roleOverride] ? roleOverride : roleCycle[index % roleCycle.length];
  const role = enemyRoles[roleKey];
  const leashByRole = { sentry: 80, armored: 130, suppressor: 170, flanker: 320, rusher: 360 };
  return {
    id: `hostile${index + 1}`,
    role: roleKey,
    roleLabel: role.label,
    sprite: role.sprite,
    x: p.x,
    y: p.y,
    hp: role.hp + difficulty * 5,
    maxHp: role.hp + difficulty * 5,
    armor: role.armor,
    damage: role.damage + Math.floor(difficulty / 2),
    range: role.range,
    cooldownBase: role.cooldown,
    facing: Math.PI,
    reload: 0.25 + index * 0.08,
    alert: false,
    tagged: 0,
    suppression: 0,
    stunned: 0,
    down: false,
    path: [],
    think: 0,
    investigate: null,
    guard: { x: p.x, y: p.y, tx, ty, facing: Math.PI },
    regroup: 0,
    speed: role.speed + difficulty * 3,
    squadId: null,
    leashRange: leashByRole[roleKey] || 200,
    postStunBoost: 0,
    peekT: 0,
  };
}

function applyEnemyRole(enemy, roleKey) {
  if (!enemy || !enemyRoles[roleKey]) return;
  const role = enemyRoles[roleKey];
  enemy.role = roleKey;
  enemy.hp = role.hp;
  enemy.maxHp = role.hp;
  enemy.armor = role.armor;
  enemy.speed = role.speed;
  enemy.weapon = role.weapon;
  const leashByRole = { sentry: 80, armored: 130, suppressor: 170, flanker: 320, rusher: 360 };
  enemy.leashRange = leashByRole[roleKey] || 220;
}

function assignContextualEnemyRoles(enemies, mission, context) {
  if (!enemies || !enemies.length) return;
  const explicit = {};
  for (const item of mission.enemyOverrides || []) explicit[keyOf(item.tx, item.ty)] = item.role;
  let armoredCount = 0;
  let suppressorCount = 0;
  for (const enemy of enemies) {
    const tile = worldToTile(enemy.x, enemy.y);
    const override = explicit[keyOf(tile.tx, tile.ty)];
    if (override && enemyRoles[override]) {
      applyEnemyRole(enemy, override);
      if (override === "armored") armoredCount += 1;
      if (override === "suppressor") suppressorCount += 1;
      continue;
    }
    const nearObjective = (context.objectives || []).some((obj) => Math.hypot(enemy.x - obj.x, enemy.y - obj.y) <= TILE * 2.4);
    const nearWindow = (context.windows || []).some((win) => Math.hypot(tile.tx - win.tx, tile.ty - win.ty) <= 2.4);
    const nearStart = (context.starts || []).some((start) => Math.hypot(enemy.x - start.x, enemy.y - start.y) <= TILE * 5.2);
    const room = roomAtTile(tile.tx, tile.ty, context.rooms || []);
    if (nearObjective && armoredCount < Math.max(1, mission.difficulty >= 5 ? 2 : 1)) {
      applyEnemyRole(enemy, "armored");
      armoredCount += 1;
    } else if ((nearWindow || (room && (room.kind === "platform" || room.kind === "open"))) && suppressorCount < Math.max(1, mission.difficulty >= 4 ? 2 : 1)) {
      applyEnemyRole(enemy, "suppressor");
      suppressorCount += 1;
    } else if (nearStart) {
      applyEnemyRole(enemy, "rusher");
    } else if (room && (room.kind === "suite" || room.kind === "service" || room.kind === "den" || room.kind === "garage")) {
      applyEnemyRole(enemy, "flanker");
    } else {
      applyEnemyRole(enemy, "sentry");
    }
  }
  balanceEnemyRoles(enemies, mission, context);
}

function balanceEnemyRoles(enemies, mission, context) {
  if (!enemies || enemies.length < 3) return;
  const counts = enemies.reduce((acc, enemy) => {
    acc[enemy.role] = (acc[enemy.role] || 0) + 1;
    return acc;
  }, {});
  const starts = context.starts || [];
  const protectPoints = (context.objectives || []).concat(context.civilians || []);
  if (!counts.armored && mission.difficulty >= 2 && protectPoints.length) {
    const guard = nearestEnemyToPoints(enemies, protectPoints);
    if (guard) applyEnemyRole(guard, "armored");
  }
  if (!counts.rusher && mission.difficulty >= 2 && starts.length) {
    const entry = nearestEnemyToPoints(enemies, starts, "sentry") || nearestEnemyToPoints(enemies, starts);
    if (entry && entry.role === "sentry") applyEnemyRole(entry, "rusher");
  }
  if (!counts.suppressor && mission.difficulty >= 3 && context.windows && context.windows.length) {
    const lane = nearestEnemyToPoints(enemies, context.windows.map((win) => tileCenter(win.tx, win.ty)), "sentry");
    if (lane && lane.role === "sentry") applyEnemyRole(lane, "suppressor");
  }
  const refreshed = enemies.reduce((acc, enemy) => {
    acc[enemy.role] = (acc[enemy.role] || 0) + 1;
    return acc;
  }, {});
  if (!refreshed.flanker && mission.difficulty >= 3 && starts.length && enemies.length >= 6) {
    const flank = farthestEnemyFromPoints(enemies, starts, "sentry");
    if (flank && flank.role === "sentry") applyEnemyRole(flank, "flanker");
  }
}

function nearestEnemyToPoints(enemies, points, roleFilter) {
  let best = null;
  let bestDist = Infinity;
  for (const enemy of enemies) {
    if (roleFilter && enemy.role !== roleFilter) continue;
    for (const point of points || []) {
      const d = Math.hypot(enemy.x - point.x, enemy.y - point.y);
      if (d < bestDist) {
        bestDist = d;
        best = enemy;
      }
    }
  }
  return best;
}

function farthestEnemyFromPoints(enemies, points, roleFilter) {
  let best = null;
  let bestDist = -Infinity;
  for (const enemy of enemies) {
    if (roleFilter && enemy.role !== roleFilter) continue;
    let nearest = Infinity;
    for (const point of points || []) nearest = Math.min(nearest, Math.hypot(enemy.x - point.x, enemy.y - point.y));
    if (nearest > bestDist) {
      bestDist = nearest;
      best = enemy;
    }
  }
  return best;
}

function roomAtTile(tx, ty, rooms) {
  for (const item of rooms || []) {
    if (tx >= item.x && tx < item.x + item.w && ty >= item.y && ty < item.y + item.h) return item;
  }
  return null;
}

function assignEnemySquads(enemies) {
  if (!enemies || !enemies.length) return;
  const TILE_R = TILE;
  const SQUAD_RADIUS = TILE_R * 5;
  const visited = new Array(enemies.length).fill(false);
  let nextId = 1;
  for (let i = 0; i < enemies.length; i += 1) {
    if (visited[i]) continue;
    const queue = [i];
    visited[i] = true;
    const squadId = nextId;
    nextId += 1;
    while (queue.length) {
      const idx = queue.shift();
      enemies[idx].squadId = squadId;
      for (let j = 0; j < enemies.length; j += 1) {
        if (visited[j]) continue;
        if (Math.hypot(enemies[idx].x - enemies[j].x, enemies[idx].y - enemies[j].y) <= SQUAD_RADIUS) {
          visited[j] = true;
          queue.push(j);
        }
      }
    }
  }
}

function deriveFloorMap(map, starts, mission) {
  const floors = new Map();
  const levels = Math.max(1, Math.min(3, Number(mission.levels || 1)));
  if (!map || !map.length) return { map: floors, levels };
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      if (map[y][x] && map[y][x].type === "stairs") floors.set(`${x},${y}`, "stair");
    }
  }
  if (levels < 2) {
    for (let y = 0; y < ROWS; y += 1) {
      for (let x = 0; x < COLS; x += 1) {
        if (map[y][x] && map[y][x].type !== "wall" && floors.get(`${x},${y}`) !== "stair") {
          floors.set(`${x},${y}`, 1);
        }
      }
    }
    return { map: floors, levels };
  }
  const seedQueue = [];
  for (const start of starts) {
    const t = worldToTile(start.x, start.y);
    seedQueue.push([t.tx, t.ty]);
  }
  const fill = (queue, level) => {
    while (queue.length) {
      const [x, y] = queue.shift();
      if (x < 0 || y < 0 || x >= COLS || y >= ROWS) continue;
      const tile = map[y][x];
      if (!tile || tile.type === "wall") continue;
      const k = `${x},${y}`;
      if (floors.has(k)) continue;
      floors.set(k, level);
      queue.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
  };
  fill(seedQueue, 1);
  let next = 2;
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      const k = `${x},${y}`;
      const tile = map[y][x];
      if (!tile || tile.type === "wall") continue;
      if (floors.has(k)) continue;
      fill([[x, y]], Math.min(next, levels));
      next = Math.min(next + 1, levels);
    }
  }
  return { map: floors, levels };
}

function tileLevel(tx, ty) {
  if (!state.floors || !state.floors.map) return 1;
  const v = state.floors.map.get(`${tx},${ty}`);
  if (typeof v === "number") return v;
  if (v === "stair") return "stair";
  return 1;
}

function entityLevel(entity, fallback) {
  const t = worldToTile(entity.x, entity.y);
  const v = tileLevel(t.tx, t.ty);
  if (v === "stair") return fallback || entity.level || 1;
  return v;
}

function cloneMission(mission) {
  return JSON.parse(JSON.stringify(mission));
}

function applyAddonModifiers(mission) {
  const copy = cloneMission(mission);
  if (state.profile.addons.night_shift) copy.night = true;
  return copy;
}

function startMission(mission) {
  const lockStatus = missionUnlockStatus(mission, state.profile);
  if (!lockStatus.unlocked) {
    addLog(`${mission.title} is locked: ${lockStatus.reason}.`);
    markUiDirty();
    return;
  }
  const missionCopy = applyAddonModifiers(mission);
  const parsed = parseMission(missionCopy);
  state.mission = missionCopy;
  state.missionSource = mission;
  state.map = parsed.map;
  state.doors = parsed.doors;
  state.windows = parsed.windows;
  state.windowBreaches = [];
  state.enemies = parsed.enemies;
  state.civilians = parsed.civilians;
  state.objectives = parsed.objectives;
  state.extraction = parsed.extraction;
  state.rooms = parsed.rooms;
  state.floors = deriveFloorMap(parsed.map, parsed.starts, missionCopy);
  state.operators = makeOperators(parsed.starts, missionCopy);
  for (const op of state.operators) op.level = entityLevel(op, 1);
  for (const enemy of state.enemies) enemy.level = entityLevel(enemy, 1);
  state.selectedId = (state.operators[0] && state.operators[0].id) || "rook";
  state.selectedGroup = state.selectedId ? [state.selectedId] : [];
  state.selectedTool = "waypoint";
  state.activeManeuvers = [];
  state.tacticalAdvice = null;
  state.running = false;
  state.missionTime = 0;
  state.outcome = null;
  state.effects = [];
  state.smokes = [];
  state.drones = [];
  state.noise = [];
  state.screenShake = { t: 0, mag: 0 };
  state.killFeed = [];
  state.lastEnemyKillTime = 0;
  state.stuckRevealLogged = false;
  state.enemyIntel = makeEnemyIntel();
  state.selectedWaypoint = null;
  state.pendingPlanAction = null;
  state.mapAuditWarnings = collectMissionAuditWarnings(missionCopy);
  state.radial.open = false;
  state.rng = mulberry32(hashString(`${missionCopy.id}:${missionCopy.difficulty || 1}`));
  state.log = [];
  state.visibility.visible = new Set();
  state.visibility.seen = new Set();
  const firstStart = parsed.starts[0] || tileCenter(2, ROWS - 3);
  state.camera.x = firstStart.x;
  state.camera.y = firstStart.y;
  state.camera.zoom = 1.62;
  state.camera.targetZoom = 1.62;
  state.camera.follow = true;
  state.camera.drag = null;
  state.camera.suppressClick = false;
  state.selectionBox = null;
  if (state.profile.addons.hardline) addHardlineEnemies();
  addLog(`Operation loaded: ${missionCopy.title}`);
  addLog("Plan paths while paused, then press Go.");
  state.profile.lastMissionId = missionCopy.id;
  saveProfile();
  setTab("campaign", false);
  state.screen = "game";
  markUiDirty();
}

function makeOperators(starts, mission) {
  return operatorTemplates.map((template, index) => {
    const armory = state.profile.armory[template.id] || { gear: template.gear, xp: 0, wounds: 0 };
    armory.gear = normalizeWeaponId(armory.gear, template.gear);
    const gear = weaponFor(armory.gear, template.gear);
    const p = starts[index] || starts[0] || tileCenter(2 + index, ROWS - 3);
    const cache = state.profile.addons.field_cache ? 1 : 0;
    return {
      id: template.id,
      name: template.name,
      role: template.role,
      color: template.color,
      sprite: template.sprite,
      gear: armory.gear,
      x: p.x,
      y: p.y,
      hp: 100,
      maxHp: 100,
      facing: 0,
      reload: 0,
      path: [],
      speed: gear.speed,
      armor: gear.armor,
      down: false,
      suppression: 0,
      focus: null,
      reaction: null,
      reactionCooldown: 0,
      underFire: 0,
      hitFlash: 0,
      flash: 1 + cache + (template.role === "Assault" ? 1 : 0),
      smoke: 1 + cache,
      charges: template.role === "Breacher" ? 2 : 1,
      medkits: template.role === "Point" ? 1 : 0,
      drones: template.role === "Marksman" ? 2 : 1,
      kills: 0,
      openTimer: 0,
      objectiveTimer: 0,
      nightBonus: mission.night ? 0.04 : 0,
    };
  });
}

function reachableFloorTiles() {
  // BFS from every operator start through passable tiles (incl. doors + stairs) so we
  // know which floor tiles the squad can actually walk to. Used by Hardline AI to avoid
  // spawning the extra contacts inside isolated pockets the squad can never reach.
  const reached = new Set();
  const seeds = [];
  for (const op of state.operators || []) {
    const t = worldToTile(op.x, op.y);
    seeds.push([t.tx, t.ty]);
  }
  if (!seeds.length) return reached;
  const queue = seeds.slice();
  while (queue.length) {
    const [x, y] = queue.shift();
    const k = `${x},${y}`;
    if (reached.has(k)) continue;
    if (x < 1 || y < 1 || x >= COLS - 1 || y >= ROWS - 1) continue;
    if (!isPassable(x, y)) continue;
    reached.add(k);
    queue.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
  return reached;
}

function addHardlineEnemies() {
  const reached = reachableFloorTiles();
  const occupied = new Set();
  for (const enemy of state.enemies) {
    const t = worldToTile(enemy.x, enemy.y);
    occupied.add(`${t.tx},${t.ty}`);
  }
  for (const op of state.operators) {
    const t = worldToTile(op.x, op.y);
    occupied.add(`${t.tx},${t.ty}`);
  }
  const extractionTile = state.extraction ? worldToTile(state.extraction.x, state.extraction.y) : null;
  const floors = [];
  for (let y = 1; y < ROWS - 1; y += 1) {
    for (let x = 1; x < COLS - 1; x += 1) {
      const k = `${x},${y}`;
      if (!reached.has(k)) continue;
      if (occupied.has(k)) continue;
      // Don't drop a Hardline contact right on top of the squad start corner or extraction.
      if (Math.hypot(x - 2, y - 16) <= 6) continue;
      if (extractionTile && Math.hypot(x - extractionTile.tx, y - extractionTile.ty) <= 4) continue;
      floors.push({ x, y });
    }
  }
  const rnd = mulberry32(hashString(state.mission.id));
  const count = 2 + Math.floor((state.mission.difficulty || 1) / 2);
  let placed = 0;
  for (let i = 0; i < count && floors.length; i += 1) {
    const pick = Math.floor(rnd() * floors.length);
    const spot = floors.splice(pick, 1)[0];
    const enemy = makeEnemy(spot.x, spot.y, state.enemies.length, state.mission.difficulty + 1);
    enemy.alert = rnd() > 0.5;
    state.enemies.push(enemy);
    placed += 1;
  }
  assignEnemySquads(state.enemies);
  addLog(`Hardline AI added ${placed} extra contact${placed === 1 ? "" : "s"} along the squad's path.`);
}

function addLog(text) {
  state.log.unshift({ t: state.missionTime, text });
  state.log = state.log.slice(0, 18);
  markUiDirty();
}

function markUiDirty() {
  state.uiDirty = true;
}

function setTab(tab, render = true) {
  state.activeTab = tab;
  document.querySelectorAll(".tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tab);
  });
  if (render) markUiDirty();
}

function selectedOperator() {
  ensureSelectedGroup();
  return state.operators.find((op) => op.id === state.selectedId && !op.down) || state.operators.find((op) => !op.down) || null;
}

function operatorById(id) {
  return state.operators.find((op) => op.id === id) || null;
}

function livingOperators() {
  return state.operators.filter((op) => !op.down);
}

function uniqueOperatorIds(ids) {
  const result = [];
  for (const id of ids || []) {
    if (result.includes(id)) continue;
    const op = operatorById(id);
    if (op && !op.down) result.push(id);
  }
  return result;
}

function ensureSelectedGroup() {
  let ids = uniqueOperatorIds(state.selectedGroup);
  const selected = operatorById(state.selectedId);
  if (!ids.length && selected && !selected.down) ids = [selected.id];
  if (!ids.length) {
    const first = livingOperators()[0];
    if (first) ids = [first.id];
  }
  state.selectedGroup = ids;
  if (!ids.includes(state.selectedId)) state.selectedId = ids[0] || state.selectedId;
  return ids;
}

function selectedOperators() {
  return ensureSelectedGroup().map((id) => operatorById(id)).filter((op) => op && !op.down);
}

function isOperatorSelected(op) {
  return Boolean(op && ensureSelectedGroup().includes(op.id));
}

function setSelectedGroup(ids, leaderId) {
  const clean = uniqueOperatorIds(ids);
  if (!clean.length) return;
  state.selectedGroup = clean;
  state.selectedId = clean.includes(leaderId) ? leaderId : clean[0];
  state.selectedWaypoint = null;
  state.pendingPlanAction = null;
  markUiDirty();
}

function setSelectedOperator(id) {
  setSelectedGroup([id], id);
}

function toggleOperatorInGroup(id) {
  const op = operatorById(id);
  if (!op || op.down) return;
  const ids = ensureSelectedGroup().slice();
  const index = ids.indexOf(id);
  if (index >= 0) {
    if (ids.length === 1) {
      setSelectedOperator(id);
      return;
    }
    ids.splice(index, 1);
    setSelectedGroup(ids, state.selectedId === id ? ids[0] : state.selectedId);
    return;
  }
  ids.push(id);
  setSelectedGroup(ids, state.selectedId || id);
}

function selectGroupPreset(preset) {
  const alive = livingOperators();
  if (!alive.length) return;
  if (preset === "all") {
    setSelectedGroup(alive.map((op) => op.id), state.selectedId);
    addLog("All operators selected.");
  } else if (preset === "alpha") {
    const ids = alive.slice(0, 2).map((op) => op.id);
    setSelectedGroup(ids, ids[0]);
    addLog("Alpha fireteam selected.");
  } else if (preset === "bravo") {
    const ids = alive.slice(2).map((op) => op.id);
    const selectedIds = ids.length ? ids : alive.slice(-2).map((op) => op.id);
    setSelectedGroup(selectedIds, selectedIds[0]);
    addLog("Bravo fireteam selected.");
  } else if (preset === "leader") {
    const leader = selectedOperator();
    if (leader) setSelectedOperator(leader.id);
    addLog("Leader selected.");
  }
}

function selectedGroupName() {
  const ops = selectedOperators();
  if (ops.length <= 1) return ops[0] ? ops[0].name : "Operator";
  return `Fireteam x${ops.length}`;
}

function centerOfOperators(ops) {
  const living = (ops || []).filter((op) => op && !op.down);
  if (!living.length) return { x: state.camera.x, y: state.camera.y };
  let x = 0;
  let y = 0;
  for (const op of living) {
    x += op.x;
    y += op.y;
  }
  return { x: x / living.length, y: y / living.length };
}

function nearestPoint(point, points) {
  return (points || [])
    .filter(Boolean)
    .sort((a, b) => Math.hypot(a.x - point.x, a.y - point.y) - Math.hypot(b.x - point.x, b.y - point.y))[0] || null;
}

function allStairPoints() {
  const points = [];
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      if (mapTile(x, y).type === "stairs") points.push({ ...tileCenter(x, y), tx: x, ty: y });
    }
  }
  return points;
}

function visibleThreats() {
  return state.enemies.filter((enemy) => !enemy.down && entityVisible(enemy));
}

function tacticalObjectivePoint(center) {
  const unsecured = state.objectives.filter((obj) => !obj.secured);
  const unrescued = state.civilians.filter((civ) => !civ.rescued || (state.extraction && !civ.extracted));
  return (
    nearestPoint(center, unrescued) ||
    nearestPoint(center, unsecured) ||
    nearestPoint(center, allStairPoints()) ||
    state.extraction ||
    center
  );
}

function nearestClosedDoor(center) {
  const doors = state.doors
    .filter((door) => !door.open)
    .map((door) => ({ ...tileCenter(door.tx, door.ty), tx: door.tx, ty: door.ty, door }));
  return nearestPoint(center, doors);
}

function nearestOpening(center) {
  const openings = state.doors.map((door) => ({ ...tileCenter(door.tx, door.ty), tx: door.tx, ty: door.ty, kind: "door", door }));
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      if (mapTile(x, y).type === "window") openings.push({ ...tileCenter(x, y), tx: x, ty: y, kind: "window" });
    }
  }
  return nearestPoint(center, openings);
}

function adjacentPassableTiles(tx, ty) {
  const out = [];
  for (const dir of [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]) {
    const nx = tx + dir[0];
    const ny = ty + dir[1];
    if (isPassable(nx, ny)) out.push({ ...tileCenter(nx, ny), tx: nx, ty: ny });
  }
  return out;
}

function farSideOfOpening(opening, from) {
  if (!opening) return from;
  const options = adjacentPassableTiles(opening.tx, opening.ty);
  if (!options.length) return { x: opening.x, y: opening.y };
  return options.sort((a, b) => Math.hypot(b.x - from.x, b.y - from.y) - Math.hypot(a.x - from.x, a.y - from.y))[0];
}

function nearSideOfOpening(opening, from) {
  if (!opening) return from;
  const options = adjacentPassableTiles(opening.tx, opening.ty);
  if (!options.length) return { x: opening.x, y: opening.y };
  return options.sort((a, b) => Math.hypot(a.x - from.x, a.y - from.y) - Math.hypot(b.x - from.x, b.y - from.y))[0];
}

function maneuverContext() {
  computeVisibility();
  const ops = selectedOperators();
  const group = ops.length ? ops : livingOperators();
  const center = centerOfOperators(group);
  const threats = visibleThreats().sort((a, b) => dist(center, a) - dist(center, b));
  const avgSuppression = group.length ? group.reduce((sum, op) => sum + (op.suppression || 0) + (op.underFire > 0 ? 18 : 0), 0) / group.length : 0;
  const door = nearestClosedDoor(center);
  const opening = nearestOpening(center);
  const stairs = nearestPoint(center, allStairPoints());
  const civilian = nearestPoint(center, state.civilians.filter((civ) => !civ.rescued || (state.extraction && !civ.extracted)));
  const objective = nearestPoint(center, state.objectives.filter((obj) => !obj.secured));
  const target = tacticalObjectivePoint(center);
  let recommended = "bounding";
  let reason = "Move by covered bounds toward the objective.";
  if (avgSuppression > 42 || group.some((op) => op.underFire > 0)) {
    recommended = "regroup_cover";
    reason = "The team is under pressure; break into cover and re-aim.";
  } else if (civilian && Math.hypot(civilian.x - center.x, civilian.y - center.y) < 360) {
    recommended = "rescue_escort";
    reason = "A civilian/patient is the nearest priority.";
  } else if (stairs && state.mission && state.mission.levels > 1 && Math.hypot(stairs.x - center.x, stairs.y - center.y) < 430) {
    recommended = "stair_sweep";
    reason = "Multi-level building: secure the stairwell before pushing.";
  } else if (door && Math.hypot(door.x - center.x, door.y - center.y) < 270) {
    recommended = threats.length ? "slice_pie" : "dynamic_entry";
    reason = threats.length ? "Known contact near an opening; slice before entry." : "Closed room ahead; stack and breach/flash.";
  } else if (threats.length) {
    recommended = "smoke_cross";
    reason = "Visible hostile lane; mask it before moving.";
  }
  state.tacticalAdvice = { recommended, reason, avgSuppression, visibleThreats: threats.length };
  return { group, center, threats, avgSuppression, door, opening, stairs, civilian, objective, target, recommended, reason };
}

function applyManeuver(id) {
  const def = maneuverDefs[id];
  if (!def || !state.mission) return;
  const ctxData = maneuverContext();
  const group = ctxData.group.length ? ctxData.group : livingOperators();
  if (!group.length) return;
  if (id === "dynamic_entry") applyDynamicEntry(ctxData);
  else if (id === "slice_pie") applySlicePie(ctxData);
  else if (id === "bounding") applyBoundingMove(ctxData);
  else if (id === "smoke_cross") applySmokeCross(ctxData);
  else if (id === "stair_sweep") applyStairSweep(ctxData);
  else if (id === "rescue_escort") applyRescueEscort(ctxData);
  else if (id === "regroup_cover") applyRegroupCover(ctxData);
  activateManeuver(id, group.map((op) => op.id), ctxData.target || ctxData.center);
  markUiDirty();
}

function activateManeuver(id, ids, anchor) {
  state.activeManeuvers = state.activeManeuvers.filter((item) => item.id !== id);
  state.activeManeuvers.push({ id, ids: ids.slice(), x: anchor.x, y: anchor.y, t: 16, adapted: false, smokeDeployed: false, exfilQueued: false });
  state.activeManeuvers = state.activeManeuvers.slice(-4);
  addLog(`${maneuverDefs[id].label}: adaptive tactic active.`);
}

function bestBreacher(group) {
  return (
    group.find((op) => op.role === "Breacher" && op.charges > 0) ||
    group.find((op) => op.charges > 0) ||
    group[group.length - 1] ||
    group[0]
  );
}

function bestThrower(group, inventory) {
  return group.find((op) => op[inventory] > 0) || group[0];
}

function applyDynamicEntry(ctxData) {
  const group = ctxData.group;
  const opening = ctxData.door || ctxData.opening;
  if (!opening) {
    addLog("Dynamic Entry needs a nearby door or window.");
    return;
  }
  const far = farSideOfOpening(opening, ctxData.center);
  stackSquadAt(opening.x, opening.y, group, "Dynamic entry");
  const breacher = bestBreacher(group);
  if (breacher && opening.door && !opening.door.open) queuePlanAction(breacher.charges > 0 ? "breach" : "wait", breacher, { x: opening.x, y: opening.y });
  if (breacher && opening.kind === "window") queuePlanAction("step_breach_window", breacher, { x: opening.x, y: opening.y });
  const thrower = bestThrower(group.filter((op) => op !== breacher), "flash") || bestThrower(group, "flash");
  if (thrower && thrower.flash > 0) queuePlanAction("flash", thrower, far);
  for (const op of group) {
    if (op !== breacher) queuePlanAction("focus", op, far);
    if (op === group[0] || op === breacher) queuePlanAction("clear_room", op);
  }
  addLog("Dynamic entry queued: stack, breach/flash, focus, clear.");
}

function applySlicePie(ctxData) {
  const group = ctxData.group;
  const opening = ctxData.opening || ctxData.door;
  if (!opening) {
    addLog("Slice Pie needs a door or window.");
    return;
  }
  const near = nearSideOfOpening(opening, ctxData.center);
  const far = farSideOfOpening(opening, ctxData.center);
  addGroupWaypoints(group, near.x, near.y, "Slice team");
  const baseAngle = angleTo(opening, far);
  for (let i = 0; i < group.length; i += 1) {
    const spread = (i - (group.length - 1) / 2) * 0.26;
    const focus = { x: opening.x + Math.cos(baseAngle + spread) * 150, y: opening.y + Math.sin(baseAngle + spread) * 150 };
    queuePlanAction("focus", group[i], focus);
    queuePlanAction("wait", group[i]);
  }
  addLog("Slice Pie queued: staggered angles through the opening.");
}

function applyBoundingMove(ctxData) {
  const group = ctxData.group;
  const target = ctxData.target || ctxData.center;
  const movers = group.filter((_, index) => index % 2 === 0);
  const cover = group.filter((_, index) => index % 2 === 1);
  const threat = ctxData.threats[0] || state.enemyIntel.lastKnown || target;
  if (cover.length) {
    for (const op of cover) executeOperatorAction(op, "focus", threat.x, threat.y, { queued: false });
  }
  addGroupWaypoints(movers.length ? movers : group, target.x, target.y, "Bounding element");
  addLog("Bounding move: cover element holds while movers advance.");
}

function applySmokeCross(ctxData) {
  const group = ctxData.group;
  const target = ctxData.target || ctxData.center;
  const threat = ctxData.threats[0] || state.enemyIntel.lastKnown;
  const smoker = bestThrower(group, "smoke");
  if (smoker && smoker.smoke > 0 && threat) {
    const x = (ctxData.center.x + threat.x) / 2;
    const y = (ctxData.center.y + threat.y) / 2;
    executeOperatorAction(smoker, "smoke", x, y, { queued: false });
  }
  addGroupWaypoints(group, target.x, target.y, "Smoke-cross");
  addLog("Smoke Cross: lane masked and movement plotted.");
}

function applyStairSweep(ctxData) {
  const group = ctxData.group;
  const stairs = ctxData.stairs;
  if (!stairs) {
    addLog("No stairwell found on this map.");
    return;
  }
  addGroupWaypoints(group, stairs.x, stairs.y, "Stair team");
  const thrower = bestThrower(group, "flash");
  if (thrower && thrower.flash > 0) queuePlanAction("flash", thrower, { x: stairs.x + 64, y: stairs.y });
  for (const op of group) queuePlanAction("focus", op, { x: stairs.x + 96, y: stairs.y + (op.id === state.selectedId ? -48 : 48) });
  addLog("Stair Sweep queued: stack, flash, and cover upper/lower angles.");
}

function applyRescueEscort(ctxData) {
  const group = ctxData.group;
  const civilian = ctxData.civilian;
  if (!civilian) {
    addLog("No active civilian rescue target.");
    return;
  }
  addGroupWaypoints(group, civilian.x, civilian.y, "Escort team");
  const threat = ctxData.threats[0] || state.enemyIntel.lastKnown || state.extraction || civilian;
  for (const op of group.slice(1)) executeOperatorAction(op, "focus", threat.x, threat.y, { queued: false });
  addLog("Rescue Escort: point moves to civilian, rear covers.");
}

function applyRegroupCover(ctxData) {
  const group = ctxData.group;
  const threat = ctxData.threats[0] || state.enemyIntel.lastKnown || { x: ctxData.center.x + 80, y: ctxData.center.y };
  for (const op of group) {
    const tile = worldToTile(op.x, op.y);
    const cover = findReactionCoverStep(op, threat) || nearestPassableAround(tile.tx, tile.ty, tile.tx, tile.ty);
    if (cover) op.path = [makeWaypointNode(cover.x, cover.y)];
    executeOperatorAction(op, "focus", threat.x, threat.y, { queued: false });
  }
  addLog("Regroup Cover: suppressed operators breaking to cover.");
}

function mapTile(tx, ty) {
  if (tx < 0 || ty < 0 || tx >= COLS || ty >= ROWS) return { type: "wall" };
  return (state.map[ty] && state.map[ty][tx]) || { type: "floor" };
}

function doorAt(tx, ty) {
  return state.doors.find((door) => door.tx === tx && door.ty === ty);
}

function windowAt(tx, ty) {
  return state.windows.find((item) => item.tx === tx && item.ty === ty);
}

function isPassable(tx, ty) {
  const tile = mapTile(tx, ty);
  if (tile.type === "window") {
    const win = windowAt(tx, ty);
    return Boolean(win && win.breached);
  }
  return tile.type !== "wall" && tile.type !== "crate";
}

function blocksSight(tx, ty) {
  const tile = mapTile(tx, ty);
  if (tile.type === "wall" || tile.type === "crate") return true;
  if (tile.type === "door") {
    const door = doorAt(tx, ty);
    return !(door && door.open);
  }
  return false;
}

function smokeBlocks(a, b) {
  return state.smokes.some((smoke) => {
    const abx = b.x - a.x;
    const aby = b.y - a.y;
    const apx = smoke.x - a.x;
    const apy = smoke.y - a.y;
    const ab2 = abx * abx + aby * aby || 1;
    const t = clamp((apx * abx + apy * aby) / ab2, 0, 1);
    const px = a.x + abx * t;
    const py = a.y + aby * t;
    return Math.hypot(px - smoke.x, py - smoke.y) < smoke.r * 0.72;
  });
}

function lineOfSight(a, b) {
  if (smokeBlocks(a, b)) return false;
  const steps = Math.ceil(Math.hypot(a.x - b.x, a.y - b.y) / 8);
  for (let i = 1; i < steps; i += 1) {
    const t = i / steps;
    const x = a.x + (b.x - a.x) * t;
    const y = a.y + (b.y - a.y) * t;
    const tile = worldToTile(x, y);
    if (blocksSight(tile.tx, tile.ty)) return false;
  }
  return true;
}

function canSee(observer, target, range, cone = Math.PI * 0.84) {
  if (target.down) return false;
  const d = Math.hypot(observer.x - target.x, observer.y - target.y);
  if (d > range) return false;
  const close = d < 70;
  if (!close && angleDiff(observer.facing, angleTo(observer, target)) > cone / 2) return false;
  return lineOfSight(observer, target);
}

function visibilitySources() {
  const sources = state.operators
    .filter((op) => !op.down)
    .map((op) => ({
      x: op.x,
      y: op.y,
      range: state.mission && state.mission.night ? 150 : 220,
      kind: "operator",
    }));
  for (const drone of state.drones) {
    sources.push({ x: drone.x, y: drone.y, range: drone.r, kind: "drone" });
  }
  return sources;
}

function computeVisibility() {
  if (!state.mission) return;
  const visible = new Set();
  for (const source of visibilitySources()) {
    const minX = clamp(Math.floor((source.x - source.range) / TILE), 0, COLS - 1);
    const maxX = clamp(Math.floor((source.x + source.range) / TILE), 0, COLS - 1);
    const minY = clamp(Math.floor((source.y - source.range) / TILE), 0, ROWS - 1);
    const maxY = clamp(Math.floor((source.y + source.range) / TILE), 0, ROWS - 1);
    const sourceTile = worldToTile(source.x, source.y);

    for (let y = minY; y <= maxY; y += 1) {
      for (let x = minX; x <= maxX; x += 1) {
        const center = tileCenter(x, y);
        if (Math.hypot(center.x - source.x, center.y - source.y) > source.range) continue;
        if (source.kind === "operator" && Math.abs(x - sourceTile.tx) <= 1 && Math.abs(y - sourceTile.ty) <= 1) {
          visible.add(visibilityKey(x, y));
          continue;
        }
        if (lineOfSight(source, center)) visible.add(visibilityKey(x, y));
      }
    }
  }

  for (const key of [...visible]) {
    const [x, y] = key.split(",").map(Number);
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nx = x + dx;
      const ny = y + dy;
      if (mapTile(nx, ny).type === "wall") visible.add(visibilityKey(nx, ny));
    }
  }

  state.visibility.visible = visible;
  for (const key of visible) state.visibility.seen.add(key);
  rememberExtractionArea();
}

function rememberExtractionArea() {
  if (!state.extraction) return;
  const tile = worldToTile(state.extraction.x, state.extraction.y);
  for (let y = tile.ty - 2; y <= tile.ty + 2; y += 1) {
    for (let x = tile.tx - 2; x <= tile.tx + 2; x += 1) {
      if (x < 0 || y < 0 || x >= COLS || y >= ROWS) continue;
      if (Math.hypot(x - tile.tx, y - tile.ty) > 2.25) continue;
      state.visibility.seen.add(visibilityKey(x, y));
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        if (mapTile(x + dx, y + dy).type === "wall") state.visibility.seen.add(visibilityKey(x + dx, y + dy));
      }
    }
  }
}

function updateCamera() {
  if (!state.mission) return;
  state.camera.zoom += (state.camera.targetZoom - state.camera.zoom) * 0.12;
  const halfW = VIEW_W / (2 * state.camera.zoom);
  const halfH = VIEW_H / (2 * state.camera.zoom);
  if (!state.camera.follow) {
    state.camera.x = clamp(state.camera.x, halfW, VIEW_W - halfW);
    state.camera.y = clamp(state.camera.y, halfH, VIEW_H - halfH);
    return;
  }
  const selected = selectedOperator();
  const target = selected && !selected.down ? selected : nearestLivingOperator({ x: state.camera.x, y: state.camera.y });
  if (!target) return;
  const lead = (target.path && target.path[0]) || target.focus || null;
  const targetX = lead ? target.x * 0.72 + lead.x * 0.28 : target.x;
  const targetY = lead ? target.y * 0.72 + lead.y * 0.28 : target.y;
  state.camera.x += (clamp(targetX, halfW, VIEW_W - halfW) - state.camera.x) * 0.18;
  state.camera.y += (clamp(targetY, halfH, VIEW_H - halfH) - state.camera.y) * 0.18;
}

function panCamera(dx, dy) {
  if (!state.mission) return;
  state.camera.follow = false;
  const halfW = VIEW_W / (2 * state.camera.zoom);
  const halfH = VIEW_H / (2 * state.camera.zoom);
  state.camera.x = clamp(state.camera.x + dx, halfW, VIEW_W - halfW);
  state.camera.y = clamp(state.camera.y + dy, halfH, VIEW_H - halfH);
  markUiDirty();
}

function zoomCamera(delta) {
  if (!state.mission) return;
  state.camera.targetZoom = clamp(state.camera.targetZoom + delta, 1.05, 2.45);
  markUiDirty();
}

function recenterCamera() {
  if (!state.mission) return;
  state.camera.follow = true;
  const op = selectedOperator();
  if (op) {
    const halfW = VIEW_W / (2 * state.camera.zoom);
    const halfH = VIEW_H / (2 * state.camera.zoom);
    state.camera.x = clamp(op.x, halfW, VIEW_W - halfW);
    state.camera.y = clamp(op.y, halfH, VIEW_H - halfH);
  }
  markUiDirty();
}

function cameraStep() {
  return 96 / state.camera.zoom;
}

function applyCameraTransform() {
  const shake = state.screenShake;
  let sx = 0;
  let sy = 0;
  if (shake.t > 0 && shake.mag > 0) {
    const decay = Math.min(1, shake.t / 0.45);
    const k = shake.mag * decay;
    sx = (Math.random() * 2 - 1) * k;
    sy = (Math.random() * 2 - 1) * k;
  }
  ctx.translate(VIEW_W / 2 + sx, VIEW_H / 2 + sy);
  ctx.scale(state.camera.zoom, state.camera.zoom);
  ctx.translate(-state.camera.x, -state.camera.y);
}

function addScreenShake(strength, duration) {
  if (state.screenShake.t < duration) state.screenShake.t = duration;
  state.screenShake.mag = Math.max(state.screenShake.mag, strength);
}

function findPath(from, to) {
  if (!isPassable(to.tx, to.ty)) return [];
  const start = { tx: from.tx, ty: from.ty };
  const goalKey = keyOf(to.tx, to.ty);
  const startKey = keyOf(start.tx, start.ty);
  const queue = [start];
  const came = new Map([[startKey, null]]);
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  while (queue.length) {
    const current = queue.shift();
    if (keyOf(current.tx, current.ty) === goalKey) break;
    for (const [dx, dy] of dirs) {
      const nx = current.tx + dx;
      const ny = current.ty + dy;
      const k = keyOf(nx, ny);
      if (came.has(k) || !isPassable(nx, ny)) continue;
      came.set(k, current);
      queue.push({ tx: nx, ty: ny });
    }
  }

  if (!came.has(goalKey)) return [];
  const path = [];
  let cursor = { tx: to.tx, ty: to.ty };
  while (cursor && keyOf(cursor.tx, cursor.ty) !== startKey) {
    path.push(tileCenter(cursor.tx, cursor.ty));
    cursor = came.get(keyOf(cursor.tx, cursor.ty));
  }
  return path.reverse();
}

function addWaypoint(op, x, y) {
  const target = worldToTile(x, y);
  if (!isPassable(target.tx, target.ty)) {
    addLog("Path blocked.");
    return false;
  }
  const last = op.path.length ? op.path[op.path.length - 1] : { x: op.x, y: op.y };
  const from = worldToTile(last.x, last.y);
  const route = findPath(from, target);
  if (!route.length) {
    addLog("No route found.");
    return false;
  }
  op.path.push(...route.map((point) => makeWaypointNode(point.x, point.y)));
  state.selectedWaypoint = { opId: op.id, index: op.path.length - 1 };
  op.focus = null;
  addLog(`${op.name}: path queued (${op.path.length} nodes).`);
  markUiDirty();
  return true;
}

function addSquadWaypoints(x, y) {
  return addGroupWaypoints(livingOperators(), x, y, "Squad");
}

function addGroupWaypoints(operators, x, y, label = "Group") {
  const offsets = [
    [0, 0],
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
    [-1, -1],
    [1, 1],
    [-1, 1],
    [1, -1],
  ];
  const squad = (operators || []).filter((op) => op && !op.down);
  let queued = 0;
  for (let i = 0; i < squad.length; i += 1) {
    const tile = worldToTile(x, y);
    const spot = nearestPassableAround(tile.tx + offsets[i][0], tile.ty + offsets[i][1], tile.tx, tile.ty);
    if (spot && addWaypoint(squad[i], spot.x, spot.y)) queued += 1;
  }
  if (queued) addLog(`${label} move plotted for ${queued} operators.`);
  return queued;
}

function stackSquadAt(x, y, operators = null, label = "Squad") {
  const tile = worldToTile(x, y);
  const door = doorAt(tile.tx, tile.ty) || nearestDoor(tile.tx, tile.ty);
  const base = door ? { tx: door.tx, ty: door.ty } : tile;
  const candidates = stackCandidatesAround(base.tx, base.ty);
  const squad = (operators || livingOperators()).filter((op) => op && !op.down);
  let queued = 0;
  for (let i = 0; i < squad.length; i += 1) {
    const candidate = candidates[i] || nearestPassableAround(base.tx, base.ty, base.tx, base.ty);
    if (candidate && addWaypoint(squad[i], candidate.x, candidate.y)) queued += 1;
  }
  if (door) addLog(`${label} stack set on door ${door.tx},${door.ty}.`);
  else if (queued) addLog(`${label} stack set on target area.`);
}

function stackCandidatesAround(tx, ty) {
  const points = [
    [tx - 1, ty],
    [tx + 1, ty],
    [tx, ty - 1],
    [tx, ty + 1],
    [tx - 1, ty - 1],
    [tx + 1, ty + 1],
  ];
  return points.map((p) => nearestPassableAround(p[0], p[1], tx, ty)).filter(Boolean);
}

function nearestPassableAround(tx, ty, fallbackTx, fallbackTy) {
  const candidates = [[tx, ty]];
  for (let r = 1; r <= 3; r += 1) {
    for (let y = ty - r; y <= ty + r; y += 1) {
      for (let x = tx - r; x <= tx + r; x += 1) {
        if (Math.abs(x - tx) !== r && Math.abs(y - ty) !== r) continue;
        candidates.push([x, y]);
      }
    }
  }
  candidates.push([fallbackTx, fallbackTy]);
  for (const point of candidates) {
    if (isPassable(point[0], point[1])) return tileCenter(point[0], point[1]);
  }
  return null;
}

function haltAllOperators() {
  for (const op of state.operators) {
    op.path = [];
    op.focus = null;
  }
  state.selectedWaypoint = null;
  state.pendingPlanAction = null;
  addLog("All operators halted.");
  markUiDirty();
}

function haltSelectedOperators() {
  const ops = selectedOperators();
  for (const op of ops) {
    op.path = [];
    op.focus = null;
  }
  state.selectedWaypoint = null;
  state.pendingPlanAction = null;
  addLog(`${selectedGroupName()} halted.`);
  markUiDirty();
}

function clearSelectedPaths() {
  const ops = selectedOperators();
  for (const op of ops) op.path = [];
  state.selectedWaypoint = null;
  state.pendingPlanAction = null;
  addLog(`${selectedGroupName()} path cleared.`);
  markUiDirty();
}

function makeWaypointNode(x, y) {
  return { x, y, actions: [], actionIndex: 0 };
}

function currentPlanWaypoint(op, preferredIndex = null) {
  if (!op || !op.path.length) return null;
  const selected = state.selectedWaypoint && state.selectedWaypoint.opId === op.id ? state.selectedWaypoint.index : null;
  const index = preferredIndex != null ? preferredIndex : selected != null ? selected : op.path.length - 1;
  const clamped = clamp(index, 0, op.path.length - 1);
  const node = op.path[clamped];
  node.actions = node.actions || [];
  node.actionIndex = node.actionIndex || 0;
  return { node, index: clamped };
}

function selectWaypointAt(x, y) {
  const best = waypointAt(x, y);
  if (!best) return false;
  if (!isOperatorSelected(best.op)) setSelectedOperator(best.op.id);
  else state.selectedId = best.op.id;
  state.selectedWaypoint = { opId: best.op.id, index: best.index };
  addLog(`${best.op.name}: waypoint ${best.index + 1} selected.`);
  markUiDirty();
  return true;
}

function waypointAt(x, y) {
  let best = null;
  for (const op of state.operators) {
    for (const [index, node] of op.path.entries()) {
      const d = Math.hypot(node.x - x, node.y - y);
      if (d < 15 && (!best || d < best.d)) best = { op, index, node, d };
    }
  }
  return best;
}

function queuePlanAction(actionType, op, target = null, preferredIndex = null) {
  const def = planActionDefs[actionType];
  if (!def || !op || op.down) return;
  const waypoint = currentPlanWaypoint(op, preferredIndex);
  if (!waypoint) {
    addLog("Add a waypoint before planning an action.");
    return;
  }
  state.selectedWaypoint = { opId: op.id, index: waypoint.index };
  if (def.targeted && !target) {
    state.pendingPlanAction = { opId: op.id, waypointIndex: waypoint.index, actionType };
    addLog(`${op.name}: click a map target for ${def.label}.`);
    markUiDirty();
    return;
  }
  waypoint.node.actions.push({
    id: `${actionType}-${Date.now()}-${waypoint.node.actions.length}`,
    type: actionType,
    target: target ? { x: target.x, y: target.y } : null,
    label: def.label,
    duration: def.duration || 0,
    remaining: def.duration || 0,
    status: "queued",
  });
  state.pendingPlanAction = null;
  addLog(`${op.name}: ${def.label} planned at waypoint ${waypoint.index + 1}.`);
  markUiDirty();
}

function processWaypointActions(op, node, dt) {
  if (!node.actions || !node.actions.length) return true;
  node.actionIndex = node.actionIndex || 0;
  const action = node.actions[node.actionIndex];
  if (!action) return true;
  if (action.type === "wait") {
    if (action.status === "queued") {
      action.status = "executing";
      action.remaining = action.duration || 1.15;
      addLog(`${op.name}: holding for timing.`);
      markUiDirty();
    }
    action.remaining -= dt;
    if (action.remaining > 0) return false;
    action.status = "done";
    node.actionIndex += 1;
    markUiDirty();
    return processWaypointActions(op, node, 0);
  }
  if (action.status !== "done") {
    executePlannedAction(op, action);
    action.status = "done";
    node.actionIndex += 1;
    markUiDirty();
    return processWaypointActions(op, node, 0);
  }
  node.actionIndex += 1;
  return processWaypointActions(op, node, 0);
}

function executePlannedAction(op, action) {
  const target = action.target || { x: op.x, y: op.y };
  if (action.type === "clear_room") {
    executeClearRoom(op);
    return;
  }
  executeOperatorAction(op, action.type, target.x, target.y, { queued: true });
}

function executeClearRoom(op) {
  const origin = worldToTile(op.x, op.y);
  const roomTiles = floodRoom(origin.tx, origin.ty, 56);
  let cx = 0;
  let cy = 0;
  for (const tile of roomTiles) {
    const center = tileCenter(tile.tx, tile.ty);
    cx += center.x;
    cy += center.y;
  }
  const count = Math.max(1, roomTiles.length);
  const focus = { x: cx / count, y: cy / count };
  op.focus = focus;
  op.suppression = Math.max(0, op.suppression - 18);
  let tagged = 0;
  const keys = new Set(roomTiles.map((tile) => keyOf(tile.tx, tile.ty)));
  for (const enemy of state.enemies) {
    if (enemy.down) continue;
    const tile = worldToTile(enemy.x, enemy.y);
    if (keys.has(keyOf(tile.tx, tile.ty)) && lineOfSight(op, enemy)) {
      enemy.tagged = Math.max(enemy.tagged, 2.6);
      tagged += 1;
    }
  }
  addLog(`${op.name}: clear-room sweep${tagged ? ` tagged ${tagged}` : ""}.`);
}

function floodRoom(tx, ty, limit) {
  const start = { tx, ty };
  const queue = [start];
  const seen = new Set([keyOf(tx, ty)]);
  const out = [];
  while (queue.length && out.length < limit) {
    const current = queue.shift();
    out.push(current);
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nx = current.tx + dx;
      const ny = current.ty + dy;
      const key = keyOf(nx, ny);
      if (seen.has(key) || !isPassable(nx, ny)) continue;
      seen.add(key);
      queue.push({ tx: nx, ty: ny });
    }
  }
  return out;
}

function update(dt) {
  if (!state.mission || state.outcome) return;
  state.effects = state.effects.filter((effect) => {
    effect.t -= dt;
    return effect.t > 0;
  });
  state.smokes = state.smokes.filter((smoke) => {
    smoke.t -= dt;
    return smoke.t > 0;
  });
  state.drones = state.drones.filter((drone) => {
    drone.t -= dt;
    drone.pulse += dt;
    return drone.t > 0;
  });
  state.noise = state.noise.filter((noise) => {
    noise.t -= dt;
    return noise.t > 0;
  });
  if (state.screenShake.t > 0) {
    state.screenShake.t = Math.max(0, state.screenShake.t - dt);
    if (state.screenShake.t === 0) state.screenShake.mag = 0;
  }
  if (state.killFeed.length) {
    for (const entry of state.killFeed) entry.t -= dt;
    state.killFeed = state.killFeed.filter((entry) => entry.t > 0);
  }
  updateEnemyIntel(dt);
  updateIntelTags(dt);
  computeVisibility();
  // Refresh per-entity floor every frame (even while paused) so the HUD reflects the
  // currently selected operator's floor immediately.
  if (state.floors && state.floors.levels > 1) {
    for (const op of state.operators) {
      const next = entityLevel(op, op.level || 1);
      if (op.level && next !== op.level) {
        addLog(`${op.name} moved to floor ${next}.`);
        playTone(380, 0.07, "triangle", 0.03);
      }
      op.level = next;
    }
    for (const enemy of state.enemies) enemy.level = entityLevel(enemy, enemy.level || 1);
  }
  if (!state.running) return;

  state.missionTime += dt;
  updateActiveManeuvers(dt);
  for (const op of state.operators) updateOperator(op, dt);
  for (const enemy of state.enemies) updateEnemy(enemy, dt);
  updateCivilians(dt);
  updateObjectives(dt);
  evaluateMission();
}

function updateOperator(op, dt) {
  if (op.down) return;
  op.suppression = Math.max(0, op.suppression - dt * 12);
  op.underFire = Math.max(0, op.underFire - dt);
  op.hitFlash = Math.max(0, (op.hitFlash || 0) - dt * 3.4);
  op.reactionCooldown = Math.max(0, op.reactionCooldown - dt);
  // Floor refresh runs in update() every frame, even when paused, so it isn't repeated here.
  if (op.reaction) {
    op.reaction.t -= dt;
    if (op.reaction.t <= 0) op.reaction = null;
  }
  op.reload = Math.max(0, op.reload - dt);
  moveAlongPath(op, dt, true);
  if (op.focus && !op.path.length) op.facing = angleTo(op, op.focus);
  const target = nearestVisibleEnemy(op);
  if (target) {
    op.facing = angleTo(op, target);
    if (op.reload <= 0) fireWeapon(op, target, "operator");
  }
}

function updateIntelTags(dt) {
  for (const enemy of state.enemies) {
    enemy.tagged = Math.max(0, enemy.tagged - dt);
    for (const drone of state.drones) {
      if (!enemy.down && Math.hypot(enemy.x - drone.x, enemy.y - drone.y) < drone.r) {
        enemy.tagged = 2.2;
        if (!enemy.alert && Math.hypot(enemy.x - drone.x, enemy.y - drone.y) < drone.r * 0.55) enemy.alert = true;
      }
    }
  }
}

function updateEnemyIntel(dt) {
  const intel = state.enemyIntel;
  intel.alertLevel = Math.max(0, intel.alertLevel - dt * 0.08);
  if (intel.lastKnown) {
    intel.lastKnown.t -= dt;
    if (intel.lastKnown.t <= 0) intel.lastKnown = null;
  }
  if (intel.lastNoise) {
    intel.lastNoise.t -= dt;
    if (intel.lastNoise.t <= 0) intel.lastNoise = null;
  }
  if (intel.regroup) {
    intel.regroup.t -= dt;
    if (intel.regroup.t <= 0) intel.regroup = null;
  }
  if (intel.reinforce) {
    intel.reinforce.t -= dt;
    if (intel.reinforce.t <= 0) intel.reinforce = null;
  }
  for (const [id, sighting] of Object.entries(intel.sightings)) {
    sighting.t -= dt;
    if (sighting.t <= 0) delete intel.sightings[id];
  }
  for (const key of Object.keys(intel.squadAlert)) {
    intel.squadAlert[key] = Math.max(0, intel.squadAlert[key] - dt * 0.25);
    if (intel.squadAlert[key] <= 0.01) delete intel.squadAlert[key];
  }
}

function squadAlertFor(enemy) {
  if (!enemy || enemy.squadId == null) return 0;
  return state.enemyIntel.squadAlert[enemy.squadId] || 0;
}

function bumpSquadAlert(squadId, level) {
  if (squadId == null) return;
  state.enemyIntel.squadAlert[squadId] = Math.max(state.enemyIntel.squadAlert[squadId] || 0, level);
}

function updateActiveManeuvers(dt) {
  if (!state.activeManeuvers.length) return;
  const threats = visibleThreats().sort((a, b) => dist(centerOfOperators(livingOperators()), a) - dist(centerOfOperators(livingOperators()), b));
  for (const item of state.activeManeuvers) {
    item.t -= dt;
    const ops = item.ids.map((id) => operatorById(id)).filter((op) => op && !op.down);
    if (!ops.length) {
      item.t = 0;
      continue;
    }
    const center = centerOfOperators(ops);
    const threat = threats[0] || state.enemyIntel.lastKnown;
    if (threat && (item.id === "bounding" || item.id === "dynamic_entry" || item.id === "stair_sweep")) {
      for (let i = 0; i < ops.length; i += 1) {
        if (i % 2 === 1 || ops[i].suppression > 55) ops[i].focus = { x: threat.x, y: threat.y };
      }
    }
    if (threat && !item.adapted) {
      const pressured = ops.filter((op) => op.underFire > 0 || op.suppression > 68);
      for (const op of pressured) {
        const cover = findReactionCoverStep(op, threat);
        if (cover) op.path = [makeWaypointNode(cover.x, cover.y)];
      }
      if (pressured.length) {
        item.adapted = true;
        addLog(`${maneuverDefs[item.id].label}: adapting to contact, shifting cover.`);
      }
    }
    if (threat && item.id === "smoke_cross" && !item.smokeDeployed && !smokeBlocks(center, threat)) {
      const smoker = bestThrower(ops, "smoke");
      if (smoker && smoker.smoke > 0) {
        executeOperatorAction(smoker, "smoke", (center.x + threat.x) / 2, (center.y + threat.y) / 2, { queued: false });
        item.smokeDeployed = true;
        addLog("Smoke Cross: renewed smoke after new contact.");
      }
    }
    if (item.id === "rescue_escort" && !item.exfilQueued && state.extraction && state.civilians.some((civ) => civ.rescued && !civ.extracted)) {
      addGroupWaypoints(ops, state.extraction.x, state.extraction.y, "Escort exfil");
      item.exfilQueued = true;
      addLog("Rescue Escort: civilian secured, exfil route plotted.");
    }
  }
  state.activeManeuvers = state.activeManeuvers.filter((item) => item.t > 0);
}

function recordEnemySighting(enemy, op) {
  if (!enemy || !op) return;
  const sighting = { x: op.x, y: op.y, t: 5.5, opId: op.id, by: enemy.id };
  state.enemyIntel.sightings[op.id] = sighting;
  state.enemyIntel.lastKnown = { ...sighting };
  state.enemyIntel.regroup = { x: enemy.x, y: enemy.y, t: 4.2 };
  state.enemyIntel.alertLevel = clamp(state.enemyIntel.alertLevel + 0.65, 0, 3);
  bumpSquadAlert(enemy.squadId, 2);
}

function recordNoise(x, y, r, t, type = "noise") {
  state.noise.push({ x, y, r, t, type });
  const preserveTacticalNoise = type === "shot" && state.enemyIntel.lastNoise && state.enemyIntel.lastNoise.type !== "shot" && state.enemyIntel.lastNoise.t > 0.6;
  if (!preserveTacticalNoise && (type !== "shot" || state.enemyIntel.alertLevel < 2.6)) {
    state.enemyIntel.lastNoise = { x, y, r, t: Math.max(t, 2.4), type };
  }
  state.enemyIntel.alertLevel = clamp(state.enemyIntel.alertLevel + (type === "breach" ? 0.9 : 0.32), 0, 3);
  if (type === "breach" || type === "flash" || type === "window_breach" || type === "smoke") {
    const earshot = r * 1.6;
    const level = type === "breach" ? 2.6 : type === "flash" ? 2 : type === "window_breach" ? 1.8 : 1.4;
    const touched = new Set();
    for (const enemy of state.enemies) {
      if (enemy.down || enemy.squadId == null) continue;
      if (touched.has(enemy.squadId)) continue;
      if (Math.hypot(enemy.x - x, enemy.y - y) <= earshot) {
        bumpSquadAlert(enemy.squadId, level);
        touched.add(enemy.squadId);
      }
    }
  }
}

function rollRandom() {
  return state.rng ? state.rng() : Math.random();
}

function moveAlongPath(entity, dt, isOperator) {
  if (!entity.path.length) return;
  const target = entity.path[0];
  const tile = worldToTile(target.x, target.y);
  const door = doorAt(tile.tx, tile.ty);
  if (isOperator && door && !door.open && Math.hypot(entity.x - target.x, entity.y - target.y) < TILE * 0.95) {
    entity.openTimer += dt;
    if (entity.openTimer > 0.38) {
      door.open = true;
      door.opening = 1;
      entity.openTimer = 0;
      addLog(`${entity.name} opened a door.`);
      playTone(180, 0.04, "square", 0.04);
    }
    return;
  }
  entity.openTimer = 0;

  const dx = target.x - entity.x;
  const dy = target.y - entity.y;
  const d = Math.hypot(dx, dy);
  if (d < 2) {
    entity.x = target.x;
    entity.y = target.y;
    if (isOperator && !processWaypointActions(entity, target, dt)) return;
    entity.path.shift();
    if (isOperator) {
      if (state.selectedWaypoint && state.selectedWaypoint.opId === entity.id) {
        state.selectedWaypoint.index = clamp(state.selectedWaypoint.index - 1, 0, Math.max(0, entity.path.length - 1));
        if (!entity.path.length) state.selectedWaypoint = null;
      }
      markUiDirty();
    }
    return;
  }
  entity.facing = Math.atan2(dy, dx);
  const pressure = clamp(1 - (entity.suppression || 0) / 170, 0.48, 1);
  const step = Math.min(d, entity.speed * pressure * dt);
  entity.x += (dx / d) * step;
  entity.y += (dy / d) * step;
}

function nearestVisibleEnemy(op) {
  const gear = weaponFor(op.gear);
  let best = null;
  let bestD = Infinity;
  const range = gear.range * (state.mission.night ? 0.72 : 1);
  for (const enemy of state.enemies) {
    if (enemy.down || enemy.stunned > 0.05) continue;
    if (!canSee(op, enemy, range, Math.PI * 0.95)) continue;
    const d = dist(op, enemy);
    if (d < bestD) {
      best = enemy;
      bestD = d;
    }
  }
  return best;
}

function updateEnemy(enemy, dt) {
  if (enemy.down) return;
  enemy.suppression = Math.max(0, enemy.suppression - dt * 10);
  enemy.reload = Math.max(0, enemy.reload - dt);
  const wasStunned = enemy.stunned > 0;
  enemy.stunned = Math.max(0, enemy.stunned - dt);
  if (wasStunned && enemy.stunned === 0) {
    enemy.postStunBoost = 2;
    bumpSquadAlert(enemy.squadId, 2.2);
    enemy.alert = true;
  }
  enemy.postStunBoost = Math.max(0, (enemy.postStunBoost || 0) - dt);
  enemy.peekT = Math.max(0, (enemy.peekT || 0) - dt);
  enemy.think = Math.max(0, enemy.think - dt);
  enemy.regroup = Math.max(0, enemy.regroup - dt);
  if (enemy.investigate) {
    enemy.investigate.t -= dt;
    if (enemy.investigate.t <= 0) enemy.investigate = null;
  }
  if (enemy.stunned > 0) return;

  const seen = nearestVisibleOperator(enemy);
  if (seen) {
    enemy.alert = true;
    recordEnemySighting(enemy, seen);
    enemy.facing = angleTo(enemy, seen);
    const cover = enemy.suppression > (enemy.role === "armored" ? 82 : 62) ? findEnemyCoverStep(enemy, seen) : null;
    if (cover) {
      enemy.path = [cover];
      moveAlongPath(enemy, dt, false);
      return;
    }
    if (enemy.reload <= 0 && !pointInsideSmoke(enemy)) fireWeapon(enemy, seen, "enemy");
    return;
  }

  const heard = heardNoiseForEnemy(enemy);
  if (heard) {
    enemy.alert = true;
    enemy.investigate = { x: heard.x, y: heard.y, t: heard.type === "breach" ? 4 : 2.6, type: heard.type };
  }

  const objective = enemyObjective(enemy);
  const holds = enemy.role === "sentry" || enemy.role === "armored";
  if (objective) {
    enemy.alert = true;
    if (enemy.think <= 0) {
      enemy.think = enemyThinkDelay(enemy);
      enemy.path = planEnemyPath(enemy, objective);
    }
    moveAlongPath(enemy, dt, false);
  } else {
    const farFromGuard = Math.hypot(enemy.x - enemy.guard.x, enemy.y - enemy.guard.y) > (holds ? 28 : 80);
    if (holds && farFromGuard && enemy.think <= 0) {
      enemy.think = 1.2;
      enemy.path = findPath(worldToTile(enemy.x, enemy.y), worldToTile(enemy.guard.x, enemy.guard.y)).slice(0, 4);
    }
    moveAlongPath(enemy, dt, false);
    const alertLevel = squadAlertFor(enemy);
    if (holds && alertLevel > 0.4) {
      const peekTarget = state.enemyIntel.lastKnown || state.enemyIntel.lastNoise || state.enemyIntel.reinforce;
      if (peekTarget) {
        const target = angleTo(enemy.guard, peekTarget);
        const diff = ((target - enemy.facing + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
        enemy.facing += clamp(diff, -dt * 2.2, dt * 2.2);
      } else {
        enemy.facing += Math.sin(state.missionTime * 0.5 + enemy.x) * dt * 0.18;
      }
    } else {
      enemy.facing += Math.sin(state.missionTime * 0.6 + enemy.x) * dt * 0.18;
    }
  }
}

function nearestVisibleOperator(enemy) {
  let best = null;
  let bestD = Infinity;
  let range = (state.mission.night ? 150 : enemy.range) + (state.profile.addons.hardline ? 30 : 0);
  if (pointInsideSmoke(enemy)) range *= 0.35;
  if (enemy.suppression > 58) range *= 0.76;
  for (const op of state.operators) {
    if (op.down) continue;
    if (!canSee(enemy, op, range, Math.PI * 0.78)) continue;
    const d = dist(enemy, op);
    if (d < bestD) {
      best = op;
      bestD = d;
    }
  }
  return best;
}

function heardNoiseForEnemy(enemy) {
  return state.noise
    .filter((noise) => Math.hypot(noise.x - enemy.x, noise.y - enemy.y) < noise.r)
    .sort((a, b) => {
      const priority = (item) => (item.type === "breach" ? 3 : item.type === "shot" ? 2 : 1);
      return priority(b) - priority(a) || Math.hypot(a.x - enemy.x, a.y - enemy.y) - Math.hypot(b.x - enemy.x, b.y - enemy.y);
    })[0];
}

function enemyObjective(enemy) {
  const holds = enemy.role === "sentry" || enemy.role === "armored";
  const within = (point) => !holds || Math.hypot(point.x - enemy.guard.x, point.y - enemy.guard.y) <= enemy.leashRange;
  if (enemy.investigate) {
    if (within(enemy.investigate)) return enemy.investigate;
  }
  const reinforce = state.enemyIntel.reinforce;
  if (reinforce && (enemy.role === "rusher" || enemy.role === "flanker" || enemy.role === "suppressor")) {
    return reinforce;
  }
  const sightings = Object.values(state.enemyIntel.sightings).filter(Boolean);
  if (sightings.length) {
    const closest = sightings.sort((a, b) => Math.hypot(a.x - enemy.x, a.y - enemy.y) - Math.hypot(b.x - enemy.x, b.y - enemy.y))[0];
    if (within(closest)) return closest;
  }
  if (state.enemyIntel.lastKnown && within(state.enemyIntel.lastKnown)) return state.enemyIntel.lastKnown;
  if (state.enemyIntel.lastNoise && enemy.role !== "sentry" && within(state.enemyIntel.lastNoise)) return state.enemyIntel.lastNoise;
  if (state.enemyIntel.alertLevel > 1.6 && state.enemyIntel.regroup && enemy.role !== "rusher" && within(state.enemyIntel.regroup)) return state.enemyIntel.regroup;
  return null;
}

function enemyThinkDelay(enemy) {
  let base = state.profile.addons.hardline ? 0.46 : 0.76;
  if (enemy.role === "rusher") base *= 0.72;
  else if (enemy.role === "flanker") base *= 0.88;
  else if (enemy.role === "suppressor") base *= 1.08;
  const squadAlert = squadAlertFor(enemy);
  if (squadAlert > 1.5) base *= 0.6;
  else if (squadAlert > 0.6) base *= 0.8;
  return base;
}

function planEnemyPath(enemy, target) {
  const threat = nearestLivingOperator(enemy);
  if (threat && enemy.suppression > 62) {
    const cover = findEnemyCoverStep(enemy, threat);
    if (cover) return [cover];
  }
  const destination = roleDestination(enemy, target, threat);
  const from = worldToTile(enemy.x, enemy.y);
  const to = worldToTile(destination.x, destination.y);
  let route = findPath(from, to);
  const limit = enemyPathLimit(enemy);
  if (enemy.role === "sentry" && target !== enemy.investigate) route = route.slice(0, Math.min(limit, 3));
  else route = route.slice(0, limit);
  return route;
}

function roleDestination(enemy, target, threat) {
  if (enemy.role === "flanker") return flankPoint(enemy, target);
  if (enemy.role === "suppressor") {
    const lane = suppressorPoint(enemy, target);
    if (lane) return lane;
  }
  if (enemy.role === "sentry" && threat && Math.hypot(enemy.x - enemy.guard.x, enemy.y - enemy.guard.y) > 150) return enemy.guard;
  return target;
}

function enemyPathLimit(enemy) {
  const suppressed = enemy.suppression > 45;
  if (enemy.role === "rusher") return suppressed ? 3 : 7;
  if (enemy.role === "flanker") return suppressed ? 3 : 6;
  if (enemy.role === "armored") return suppressed ? 2 : 4;
  if (enemy.role === "suppressor") return suppressed ? 2 : 5;
  return suppressed ? 2 : 4;
}

function flankPoint(enemy, target) {
  const targetTile = worldToTile(target.x, target.y);
  const seed = hashString(enemy.id) % 2 ? 1 : -1;
  const candidates = [
    [2 * seed, 1],
    [2 * seed, -1],
    [-2 * seed, 1],
    [-2 * seed, -1],
    [1 * seed, 2],
    [1 * seed, -2],
  ];
  for (const [dx, dy] of candidates) {
    const tx = targetTile.tx + dx;
    const ty = targetTile.ty + dy;
    if (isPassable(tx, ty)) return tileCenter(tx, ty);
  }
  return target;
}

function suppressorPoint(enemy, target) {
  const targetTile = worldToTile(target.x, target.y);
  const candidates = [
    [0, 4],
    [0, -4],
    [4, 0],
    [-4, 0],
    [3, 3],
    [-3, 3],
    [3, -3],
    [-3, -3],
  ];
  let best = null;
  let bestScore = -Infinity;
  for (const [dx, dy] of candidates) {
    const tx = targetTile.tx + dx;
    const ty = targetTile.ty + dy;
    if (!isPassable(tx, ty)) continue;
    const point = tileCenter(tx, ty);
    const d = Math.hypot(point.x - target.x, point.y - target.y);
    const los = lineOfSight(point, target) ? 40 : 0;
    const score = los + Math.min(d, enemy.range) * 0.12 - Math.hypot(point.x - enemy.x, point.y - enemy.y) * 0.04;
    if (score > bestScore) {
      bestScore = score;
      best = point;
    }
  }
  return best;
}

function findEnemyCoverStep(enemy, threat) {
  const current = worldToTile(enemy.x, enemy.y);
  const currentScore = coverScore(tileCenter(current.tx, current.ty), threat);
  let best = null;
  let bestScore = currentScore;
  for (const [dx, dy] of [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1],
  ]) {
    const tx = current.tx + dx;
    const ty = current.ty + dy;
    if (!isPassable(tx, ty)) continue;
    const p = tileCenter(tx, ty);
    if (state.enemies.some((ally) => ally !== enemy && !ally.down && Math.hypot(ally.x - p.x, ally.y - p.y) < 16)) continue;
    const score = coverScore(p, threat) + (pointInsideSmoke(p) ? 30 : 0);
    if (score > bestScore) {
      bestScore = score;
      best = p;
    }
  }
  return bestScore > currentScore + 14 ? best : null;
}

function pointInsideSmoke(point) {
  return state.smokes.some((smoke) => Math.hypot(point.x - smoke.x, point.y - smoke.y) < smoke.r * 0.82);
}

function nearestLivingOperator(from) {
  return state.operators
    .filter((op) => !op.down)
    .sort((a, b) => dist(from, a) - dist(from, b))[0];
}

function reactToIncomingFire(operator, attacker, hit) {
  if (!operator || operator.down || !operator.name) return;
  operator.underFire = 1.5;
  operator.reaction = { x: attacker.x, y: attacker.y, t: 1.2, hit };
  operator.facing = angleTo(operator, attacker);
  if (!operator.path.length) operator.focus = { x: attacker.x, y: attacker.y };

  if (operator.reactionCooldown <= 0) {
    addLog(hit ? `${operator.name} hit, returning fire.` : `${operator.name} taking fire.`);
    operator.reactionCooldown = 2.4;
  }

  const cover = findReactionCoverStep(operator, attacker);
  if (!operator.path.length && cover && (hit || operator.suppression > 42)) {
    operator.path = [cover];
    addLog(`${operator.name} breaks toward cover.`);
  }
}

function findReactionCoverStep(operator, attacker) {
  const current = worldToTile(operator.x, operator.y);
  const currentScore = coverScore(tileCenter(current.tx, current.ty), attacker);
  let best = null;
  let bestScore = currentScore;
  for (const [dx, dy] of [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1],
  ]) {
    const tx = current.tx + dx;
    const ty = current.ty + dy;
    if (!isPassable(tx, ty)) continue;
    const p = tileCenter(tx, ty);
    if (state.operators.some((ally) => ally !== operator && !ally.down && Math.hypot(ally.x - p.x, ally.y - p.y) < 16)) continue;
    const score = coverScore(p, attacker);
    if (score > bestScore) {
      bestScore = score;
      best = p;
    }
  }
  return bestScore > currentScore + 18 ? best : null;
}

function coverScore(point, attacker) {
  const tile = worldToTile(point.x, point.y);
  let score = Math.hypot(point.x - attacker.x, point.y - attacker.y) * 0.18;
  if (!lineOfSight(attacker, point)) score += 120;
  for (const [dx, dy] of [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]) {
    const type = mapTile(tile.tx + dx, tile.ty + dy).type;
    if (type === "wall" || type === "crate" || type === "door") score += 16;
  }
  return score;
}

function fireWeapon(attacker, target, side) {
  const gear = side === "operator" ? weaponFor(attacker.gear) : null;
  const baseDamage = side === "operator" ? gear.damage : attacker.damage;
  let cooldown = side === "operator" ? gear.cooldown : attacker.cooldownBase;
  let spread = side === "operator" ? gear.spread - attacker.nightBonus : 0.13;
  if (side === "enemy") {
    const alert = squadAlertFor(attacker);
    if (alert > 1.5) {
      cooldown *= 0.72;
      spread = 0.09;
    } else if (alert > 0.6) {
      cooldown *= 0.86;
      spread = 0.11;
    }
    if (attacker.postStunBoost > 0) {
      cooldown *= 0.78;
      spread = Math.min(spread, 0.09);
    }
  }
  const d = dist(attacker, target);
  const focusBonus =
    side === "operator" && attacker.focus && angleDiff(angleTo(attacker, attacker.focus), angleTo(attacker, target)) < 0.35 ? 0.09 : 0;
  const pressurePenalty = (attacker.suppression || 0) / 220;
  const accuracy = clamp(0.92 - spread - d / 900 + focusBonus - pressurePenalty, 0.22, 0.97);
  attacker.reload = cooldown;
  attacker.facing = angleTo(attacker, target);
  state.effects.push({ type: "shot", x1: attacker.x, y1: attacker.y, x2: target.x, y2: target.y, t: 0.08, side });
  state.effects.push({ type: "muzzle", x: attacker.x + Math.cos(attacker.facing) * 17, y: attacker.y + Math.sin(attacker.facing) * 17, r: 18, t: 0.06 });
  recordNoise(attacker.x, attacker.y, 260, 1.4, "shot");
  playTone(side === "operator" ? 420 : 310, 0.035, "square", 0.025);
  target.suppression = clamp((target.suppression || 0) + (side === "operator" ? gear.suppression : attacker.role === "suppressor" ? 24 : 12), 0, 100);

  const hit = rollRandom() <= accuracy;
  if (side === "enemy") reactToIncomingFire(target, attacker, hit);

  if (!hit) {
    markUiDirty();
    return;
  }
  const targetArmor = target.armor || 0;
  const pierce = side === "operator" ? gear.pierce : 0;
  const armorMod = side === "operator" ? gear.armorModifier || 0 : 0;
  const damage = Math.max(4, baseDamage - Math.max(0, targetArmor - pierce) * 0.62 + armorMod * 0.05);
  target.hp -= damage;
  if (side === "enemy") {
    target.hitFlash = 1;
    addScreenShake(3.5, 0.35);
  }
  if (target.hp <= 0) {
    target.down = true;
    target.hp = 0;
    target.path = [];
    if (side === "operator") {
      attacker.kills += 1;
      addLog(`${attacker.name} neutralized a hostile.`);
      state.killFeed.unshift({ text: `${attacker.name} ► hostile down`, t: 3 });
      if (state.killFeed.length > 5) state.killFeed.length = 5;
      state.enemyIntel.reinforce = { x: target.x, y: target.y, t: 7 };
      state.enemyIntel.alertLevel = clamp(state.enemyIntel.alertLevel + 0.55, 0, 3);
      if (target.squadId != null) bumpSquadAlert(target.squadId, 2.6);
      state.lastEnemyKillTime = state.missionTime;
      state.stuckRevealLogged = false;
    } else {
      addLog(`${target.name} is down.`);
      addScreenShake(7, 0.6);
      state.killFeed.unshift({ text: `${target.name} is down`, t: 4 });
      if (state.killFeed.length > 5) state.killFeed.length = 5;
    }
  }
  markUiDirty();
}

function updateCivilians(dt) {
  for (const civ of state.civilians) {
    if (civ.extracted) continue;
    const near = state.operators.find((op) => !op.down && Math.hypot(op.x - civ.x, op.y - civ.y) < 38);
    if (near && !civ.rescued) {
      civ.rescued = true;
      civ.followId = near.id;
      addLog("Civilian secured.");
    }
    if (civ.rescued) {
      const leader = state.operators.find((op) => op.id === civ.followId && !op.down) || nearestLivingOperator(civ);
      if (leader) {
        const target = { x: leader.x - Math.cos(leader.facing) * 28, y: leader.y - Math.sin(leader.facing) * 28 };
        const d = Math.hypot(target.x - civ.x, target.y - civ.y);
        if (d > 8) {
          civ.x += ((target.x - civ.x) / d) * Math.min(d, 60 * dt);
          civ.y += ((target.y - civ.y) / d) * Math.min(d, 60 * dt);
        }
      }
      if (state.extraction && Math.hypot(civ.x - state.extraction.x, civ.y - state.extraction.y) < 54) {
        civ.extracted = true;
        state.profile.stats.rescues += 1;
        addLog("Civilian reached extraction.");
      }
    }
  }
}

function updateObjectives(dt) {
  for (const obj of state.objectives) {
    if (obj.secured) continue;
    const near = state.operators.find((op) => !op.down && Math.hypot(op.x - obj.x, op.y - obj.y) < 42);
    if (near) {
      obj.progress += dt;
      near.objectiveTimer += dt;
      if (obj.progress > 1.35) {
        obj.secured = true;
        addLog(`${near.name} secured an objective.`);
        playTone(650, 0.09, "sine", 0.04);
      }
    } else {
      obj.progress = Math.max(0, obj.progress - dt * 0.4);
    }
  }
}

function evaluateMission() {
  const allDown = state.operators.every((op) => op.down);
  if (allDown) {
    finishMission(false, "Squad incapacitated");
    return;
  }
  const remainingHostiles = state.enemies.filter((enemy) => !enemy.down);
  const hostilesCleared = remainingHostiles.length === 0;
  const objectivesSecured = state.objectives.every((obj) => obj.secured);
  const civiliansSafe = state.civilians.every((civ) => (state.extraction ? civ.extracted : civ.rescued));
  const extractionOk =
    !state.extraction || state.operators.some((op) => !op.down && Math.hypot(op.x - state.extraction.x, op.y - state.extraction.y) < 58);
  if (hostilesCleared && objectivesSecured && civiliansSafe && extractionOk) {
    finishMission(true, "Mission complete");
    return;
  }
  // Stuck-contact reveal: if it's been a long time since the last kill and there are still
  // hostiles around, tag them as visible so the player can finish the run. Doesn't auto-win —
  // the squad still has to engage. Fires in two passes:
  //  • After 60s no-kill when 3 or fewer holdouts remain AND objectives + civilians are done
  //    (the original gentler pass — "you've cleared the work, find the last few").
  //  • After 90s no-kill regardless of objective state when 5 or fewer hostiles remain
  //    (the new safety net — "you've been stuck on this for ages, here's where they are").
  const stuckTime = state.lastEnemyKillTime != null ? state.missionTime - state.lastEnemyKillTime : 0;
  const fullClearStuck = objectivesSecured && civiliansSafe && remainingHostiles.length <= 3 && stuckTime > 60;
  const longStallStuck = remainingHostiles.length <= 5 && stuckTime > 90;
  if (!hostilesCleared && (fullClearStuck || longStallStuck) && !state.stuckRevealLogged) {
    let revealed = 0;
    for (const enemy of remainingHostiles) {
      if (enemy.tagged < 900) {
        enemy.tagged = 999;
        revealed += 1;
      }
    }
    if (revealed) {
      const reason = fullClearStuck ? "objectives clear" : `${Math.round(stuckTime)}s stalemate`;
      addLog(`Intel marked ${revealed} remaining contact${revealed === 1 ? "" : "s"} (${reason}).`);
      state.stuckRevealLogged = true;
      markUiDirty();
    }
  }
}

function finishMission(success, reason) {
  state.running = false;
  const wounds = state.operators.filter((op) => op.hp < op.maxHp).length;
  const grade = success ? gradeMission(wounds) : "F";
  const kills = state.operators.reduce((sum, op) => sum + (op.kills || 0), 0);
  const hostilesLeft = state.enemies.filter((enemy) => !enemy.down).length;
  const downed = state.operators.filter((op) => op.down).length;
  const rescued = state.civilians.filter((civ) => civ.extracted).length;
  const totalCiv = state.civilians.length;
  const reward = success ? missionReward(state.mission, grade) : 0;
  state.outcome = {
    success,
    reason,
    grade,
    stats: {
      kills,
      hostilesLeft,
      wounds,
      downed,
      rescued,
      totalCiv,
      time: state.missionTime,
      reward,
    },
  };
  if (success) {
    recordMissionCompletion(state.profile, state.mission, grade, state.missionTime, reward);
    state.profile.credits += reward;
    state.profile.stats.missions += 1;
    state.profile.stats.clears += 1;
    for (const op of state.operators) {
      const armory = state.profile.armory[op.id];
      armory.xp += 8 + op.kills * 2;
      if (op.down) armory.wounds += 1;
    }
    addLog(`Success. Grade ${grade}. +${reward} credits.`);
    addScreenShake(2, 0.4);
  } else {
    addLog(`Failed: ${reason}.`);
    addScreenShake(12, 0.7);
  }
  saveProfile();
  markUiDirty();
}

function gradeMission(wounds) {
  if (wounds === 0 && state.missionTime < 95) return "A";
  if (wounds <= 1 && state.missionTime < 150) return "B";
  return "C";
}

function betterGrade(a, b) {
  const order = { F: 0, C: 1, B: 2, A: 3 };
  return order[b] > order[a] ? b : a;
}

function useToolAt(op, x, y) {
  if (!op || op.down) return;
  const group = selectedOperators();
  if (state.selectedTool === "waypoint") {
    if (group.length > 1) addGroupWaypoints(group, x, y, "Fireteam");
    else addWaypoint(op, x, y);
    return;
  }
  if (state.selectedTool === "squad") {
    addSquadWaypoints(x, y);
    return;
  }
  if (state.selectedTool === "stack") {
    const stackGroup = group.length > 1 ? group : livingOperators();
    stackSquadAt(x, y, stackGroup, group.length > 1 ? "Fireteam" : "Squad");
    return;
  }
  if (state.selectedTool === "select") {
    return;
  }
  if (state.selectedTool === "focus" && group.length > 1) {
    for (const unit of group) executeOperatorAction(unit, state.selectedTool, x, y, { queued: false });
    return;
  }
  executeOperatorAction(op, state.selectedTool, x, y, { queued: false });
}

function executeOperatorAction(op, actionType, x, y, options = {}) {
  if (!op || op.down) return false;
  const queued = Boolean(options.queued);
  if (actionType === "focus") {
    op.focus = { x, y };
    addLog(`${op.name}: ${queued ? "planned " : ""}overwatch focus set.`);
    markUiDirty();
    return true;
  }
  if (actionType === "drone") {
    if (op.drones <= 0) return addLog(`${op.name} has no recon drones.`);
    op.drones -= 1;
    state.drones.push({ id: `drone${Date.now()}`, x, y, r: 112, t: 75, pulse: 0 });
    for (const enemy of state.enemies) {
      if (!enemy.down && Math.hypot(enemy.x - x, enemy.y - y) < 112) enemy.tagged = 5;
    }
    state.effects.push({ type: "scan", x, y, r: 18, t: 0.55 });
    addLog(`${op.name} deployed a recon drone.`);
    playTone(720, 0.07, "triangle", 0.03);
    markUiDirty();
    return true;
  }
  if (actionType === "flash") {
    if (op.flash <= 0) return addLog(`${op.name} has no flashbangs.`);
    op.flash -= 1;
    state.effects.push({ type: "flash", x, y, r: 18, t: 0.42 });
    for (const enemy of state.enemies) {
      if (!enemy.down && Math.hypot(enemy.x - x, enemy.y - y) < 105 && lineOfSight({ x, y }, enemy)) {
        const base = enemy.role === "armored" ? 1.4 : enemy.role === "sentry" ? 2.1 : 3.3;
        enemy.stunned = Math.max(enemy.stunned, base);
        enemy.alert = true;
        bumpSquadAlert(enemy.squadId, 2.4);
      }
    }
    recordNoise(x, y, 220, 1.4, "flash");
    addLog(`${op.name} deployed a flashbang.`);
    addScreenShake(4, 0.3);
    playTone(900, 0.12, "sawtooth", 0.04);
    markUiDirty();
    return true;
  }
  if (actionType === "smoke") {
    if (op.smoke <= 0) return addLog(`${op.name} has no smoke.`);
    op.smoke -= 1;
    state.smokes.push({ x, y, r: 76, t: 12 });
    state.effects.push({ type: "smoke-pop", x, y, r: 18, t: 0.35 });
    recordNoise(x, y, 150, 1.2, "smoke");
    addLog(`${op.name} popped smoke.`);
    playTone(120, 0.08, "triangle", 0.035);
    markUiDirty();
    return true;
  }
  if (actionType === "breach") {
    if (op.charges <= 0) return addLog(`${op.name} has no charges.`);
    const tile = worldToTile(x, y);
    const door = doorAt(tile.tx, tile.ty) || nearestDoor(tile.tx, tile.ty);
    if (!door || Math.hypot(op.x - (door.tx + 0.5) * TILE, op.y - (door.ty + 0.5) * TILE) > 180) {
      return addLog("No breachable door in range.");
    }
    op.charges -= 1;
    door.open = true;
    state.effects.push({ type: "breach", x: (door.tx + 0.5) * TILE, y: (door.ty + 0.5) * TILE, r: 20, t: 0.45 });
    recordNoise((door.tx + 0.5) * TILE, (door.ty + 0.5) * TILE, 360, 2, "breach");
    addScreenShake(10, 0.55);
    for (const enemy of state.enemies) {
      if (!enemy.down && Math.hypot(enemy.x - (door.tx + 0.5) * TILE, enemy.y - (door.ty + 0.5) * TILE) < 80) {
        enemy.stunned = 2;
        enemy.hp -= 10;
        if (enemy.hp <= 0) enemy.down = true;
      }
    }
    addLog(`${op.name} breached a door.`);
    playTone(80, 0.16, "square", 0.06);
    markUiDirty();
    return true;
  }
  if (actionType === "step_breach_window") {
    const tile = worldToTile(x, y);
    const win = windowAt(tile.tx, tile.ty) || nearestWindow(tile.tx, tile.ty);
    if (!win || Math.hypot(op.x - (win.tx + 0.5) * TILE, op.y - (win.ty + 0.5) * TILE) > 95) {
      return addLog("No breachable window in step-breach range.");
    }
    win.breached = true;
    state.windowBreaches.push({ tx: win.tx, ty: win.ty, t: state.missionTime });
    state.effects.push({ type: "breach", x: (win.tx + 0.5) * TILE, y: (win.ty + 0.5) * TILE, r: 14, t: 0.38 });
    recordNoise((win.tx + 0.5) * TILE, (win.ty + 0.5) * TILE, 235, 1.6, "window_breach");
    addScreenShake(6, 0.4);
    for (const enemy of state.enemies) {
      if (!enemy.down && Math.hypot(enemy.x - (win.tx + 0.5) * TILE, enemy.y - (win.ty + 0.5) * TILE) < 64) {
        enemy.stunned = Math.max(enemy.stunned, 1.4);
        enemy.alert = true;
      }
    }
    addLog(`${op.name} step-breached a window.`);
    playTone(180, 0.12, "square", 0.045);
    markUiDirty();
    return true;
  }
  if (actionType === "medkit") {
    if (op.medkits <= 0) return addLog(`${op.name} has no medkits.`);
    const target =
      state.operators
        .filter((ally) => !ally.down && ally.hp < ally.maxHp && Math.hypot(ally.x - op.x, ally.y - op.y) < 70)
        .sort((a, b) => a.hp - b.hp)[0] || op;
    if (target.hp >= target.maxHp) return addLog("No wounded operator nearby.");
    op.medkits -= 1;
    target.hp = Math.min(target.maxHp, target.hp + 42);
    addLog(`${op.name} treated ${target.name}.`);
    playTone(520, 0.1, "sine", 0.035);
    markUiDirty();
    return true;
  }
  return false;
}

function nearestDoor(tx, ty) {
  return state.doors
    .filter((door) => !door.open)
    .sort((a, b) => Math.hypot(a.tx - tx, a.ty - ty) - Math.hypot(b.tx - tx, b.ty - ty))[0];
}

function nearestWindow(tx, ty) {
  return state.windows
    .filter((win) => !win.breached)
    .sort((a, b) => Math.hypot(a.tx - tx, a.ty - ty) - Math.hypot(b.tx - tx, b.ty - ty))[0];
}

function playTone(freq, duration, type, gainValue) {
  if (!state.profile.settings.sfx) return;
  try {
    const audio = playTone.audio || new AudioContext();
    playTone.audio = audio;
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = gainValue;
    gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + duration);
    osc.connect(gain);
    gain.connect(audio.destination);
    osc.start();
    osc.stop(audio.currentTime + duration);
  } catch {
    state.profile.settings.sfx = false;
  }
}

function render() {
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, VIEW_W, VIEW_H);
  if (state.activeTab === "editor") {
    renderEditorMap();
  } else if (state.mission) {
    renderMission();
  } else {
    renderAttract();
  }
  if (state.uiDirty) renderUI();
}

function renderAttract() {
  drawPixelBackdrop();
  ctx.fillStyle = "rgba(7, 10, 9, 0.7)";
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  if (aiSheet.complete && aiSheet.naturalWidth) {
    ctx.globalAlpha = 0.18;
    ctx.drawImage(aiSheet, 0, 0, VIEW_W, VIEW_H);
    ctx.globalAlpha = 1;
  }
  drawText("BREACHLINE PIXEL", 48, 88, 38, "#f5e3a0");
  drawText("Plan paths. Pause time. Clear rooms. Build add-ons.", 52, 134, 16, "#cbd8d0");
  drawText("Select an operation on the left to begin.", 52, 166, 14, "#94a69b");
  drawMiniOperator(110, 280, 0, "#5db7b0", true);
  drawMiniOperator(160, 304, 0, "#e7bc4e", false);
  drawMiniEnemy(740, 285, Math.PI, false);
  drawMiniEnemy(790, 330, Math.PI, false);
  drawPathPreview();
}

function drawPixelBackdrop() {
  ctx.fillStyle = "#17201d";
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      ctx.fillStyle = (x + y) % 2 ? "#1c2521" : "#19221f";
      ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
      if ((x * 17 + y * 29) % 11 === 0) {
        ctx.fillStyle = "rgba(255,255,255,0.025)";
        ctx.fillRect(x * TILE + 6, y * TILE + 8, 4, 4);
      }
    }
  }
}

function drawPathPreview() {
  ctx.strokeStyle = colors.path;
  ctx.lineWidth = 4;
  ctx.setLineDash([9, 8]);
  ctx.beginPath();
  ctx.moveTo(180, 300);
  ctx.lineTo(290, 300);
  ctx.lineTo(290, 230);
  ctx.lineTo(500, 230);
  ctx.lineTo(620, 300);
  ctx.stroke();
  ctx.setLineDash([]);
}

function renderMission() {
  computeVisibility();
  updateCamera();
  ctx.save();
  applyCameraTransform();
  drawMap();
  drawRoomLabels();
  drawExtraction();
  drawObjectives();
  drawDrones();
  drawSmokes();
  drawPaths();
  drawFocusOrders();
  drawEffectsUnder();
  for (const civ of state.civilians) {
    if (entityVisible(civ)) drawCivilian(civ);
  }
  for (const enemy of state.enemies) {
    if (entityVisible(enemy)) drawEnemy(enemy);
  }
  for (const op of state.operators) drawOperator(op);
  drawEffectsOver();
  drawNightOverlay();
  drawFogOverlay();
  drawSelectionBox();
  ctx.restore();
  drawCameraHud();
  drawMiniMap();
  drawKillFeed();
  if (state.outcome) drawOutcome();
}

function drawMap() {
  const backdropDrawn = drawGeneratedMapBackdrop();
  if (!backdropDrawn) {
    ctx.fillStyle = "#141a18";
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  }
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      const tile = mapTile(x, y);
      const px = x * TILE;
      const py = y * TILE;
      const visible = isTileVisible(x, y);
      const seen = isTileSeen(x, y);
      const revealWall = tile.type === "wall" && isWallAdjacentToVisible(x, y);
      if (!visible && !seen && !revealWall) {
        ctx.fillStyle = "#050707";
        ctx.fillRect(px, py, TILE, TILE);
        if ((x * 23 + y * 31) % 13 === 0) {
          ctx.fillStyle = "rgba(255,255,255,0.018)";
          ctx.fillRect(px + 12, py + 12, 3, 3);
        }
        continue;
      }
      if (tile.type === "floor") {
        if (backdropDrawn) {
          drawBackdropTileSheen(x, y, px, py, visible);
        } else {
          ctx.fillStyle = (x + y) % 2 ? colors.floor : colors.floorAlt;
          ctx.fillRect(px, py, TILE, TILE);
          drawAtlasSprite(spriteForFloor(x, y), px + TILE / 2, py + TILE / 2, TILE + 2, 0, 0.22);
          ctx.fillStyle = "rgba(255,255,255,0.025)";
          if ((x * 19 + y * 7) % 9 === 0) ctx.fillRect(px + 5, py + 6, 4, 4);
        }
      } else if (tile.type === "wall") {
        if (backdropDrawn) drawBackdropWallOverlay(x, y, px, py, visible || revealWall, seen);
        else drawWallTile(x, y, px, py, visible || revealWall, seen);
      } else if (tile.type === "door") {
        if (backdropDrawn) {
          drawBackdropTileSheen(x, y, px, py, visible);
          drawLiveOpeningTile(ctx, x, y, px, py, "door", visible);
          continue;
        } else {
          ctx.fillStyle = colors.floor;
          ctx.fillRect(px, py, TILE, TILE);
          drawAtlasSprite(spriteForFloor(x, y), px + TILE / 2, py + TILE / 2, TILE + 2, 0, 0.16);
        }
        const door = doorAt(x, y);
        drawOpeningFrame(x, y, px, py, "door", door && door.open);
        if (drawAtlasSprite(door && door.open ? "door_breach" : "door_wood", px + TILE / 2, py + TILE / 2, TILE + 8, 0, 0.95)) {
          continue;
        }
        ctx.fillStyle = door && door.open ? colors.doorOpen : colors.door;
        if (door && door.open) {
          ctx.fillRect(px + 4, py + 5, 7, TILE - 10);
          ctx.fillRect(px + 21, py + 5, 7, TILE - 10);
        } else {
          ctx.fillRect(px + 5, py + 8, TILE - 10, TILE - 16);
          ctx.fillStyle = "#d7b076";
          ctx.fillRect(px + 22, py + 15, 3, 3);
        }
      } else if (tile.type === "window") {
        if (backdropDrawn) {
          drawBackdropTileSheen(x, y, px, py, visible);
          drawLiveOpeningTile(ctx, x, y, px, py, "window", visible);
          continue;
        } else {
          ctx.fillStyle = colors.floor;
          ctx.fillRect(px, py, TILE, TILE);
          drawAtlasSprite(spriteForFloor(x, y), px + TILE / 2, py + TILE / 2, TILE + 2, 0, 0.16);
        }
        const win = windowAt(x, y);
        drawOpeningFrame(x, y, px, py, "window", win && win.breached);
        if (win && win.breached && drawGeneratedAsset("window_breach", px + TILE / 2, py + TILE / 2, TILE + 8, visible ? 0.95 : 0.45)) continue;
        if (drawAtlasSprite("window", px + TILE / 2, py + TILE / 2, TILE + 8, 0, 0.96)) continue;
        ctx.fillStyle = "#2f5458";
        ctx.fillRect(px + 2, py + 9, TILE - 4, 14);
        ctx.fillStyle = colors.window;
        ctx.fillRect(px + 4, py + 12, TILE - 8, 8);
      } else if (tile.type === "crate") {
        if (backdropDrawn) {
          drawBackdropTileSheen(x, y, px, py, visible);
          continue;
        } else {
          ctx.fillStyle = colors.floorAlt;
          ctx.fillRect(px, py, TILE, TILE);
          drawAtlasSprite(spriteForFloor(x, y), px + TILE / 2, py + TILE / 2, TILE + 2, 0, 0.14);
        }
        if (drawAtlasSprite((x + y) % 2 ? "crate" : "metal_crate", px + TILE / 2, py + TILE / 2, TILE + 4, 0, 0.95)) continue;
        ctx.fillStyle = colors.crate;
        ctx.fillRect(px + 4, py + 5, TILE - 8, TILE - 10);
        ctx.strokeStyle = "#3c2f1d";
        ctx.lineWidth = 2;
        ctx.strokeRect(px + 5, py + 6, TILE - 10, TILE - 12);
        ctx.beginPath();
        ctx.moveTo(px + 6, py + 7);
        ctx.lineTo(px + TILE - 7, py + TILE - 7);
        ctx.stroke();
      } else if (tile.type === "stairs") {
        if (backdropDrawn) {
          drawBackdropTileSheen(x, y, px, py, visible);
          continue;
        } else {
          ctx.fillStyle = visible ? "#162624" : "#0c1413";
          ctx.fillRect(px, py, TILE, TILE);
          drawAtlasSprite(spriteForFloor(x, y), px + TILE / 2, py + TILE / 2, TILE + 2, 0, 0.12);
        }
        if (!drawGeneratedAsset("stairs", px + TILE / 2, py + TILE / 2, TILE + 4, visible ? 0.95 : 0.42)) {
          const step = visible ? "#9bf0f3" : "#3d6669";
          const stepDeep = visible ? "#62b6a6" : "#26464a";
          for (let i = 0; i < 4; i += 1) {
            const sy = py + 6 + i * 5;
            const inset = 4 + i * 2;
            ctx.fillStyle = i === 0 ? step : stepDeep;
            ctx.fillRect(px + inset, sy, TILE - inset * 2, 3);
          }
        }
      }
      if (!backdropDrawn && tile.type !== "wall" && (visible || seen)) drawRoomPurposeTint(x, y, px, py, visible);
      if (!visible && seen) {
        ctx.fillStyle = "rgba(9, 16, 14, 0.1)";
        ctx.fillRect(px, py, TILE, TILE);
      }
    }
  }
}

function drawGeneratedMapBackdrop() {
  if (!state.mission) return false;
  const key = `${state.mission.id}:${ASSET_VERSION}`;
  if (!mapBackdropCache.canvas || mapBackdropCache.key !== key) {
    mapBackdropCache.key = key;
    mapBackdropCache.canvas = buildMissionBackdropCanvas();
  }
  if (!mapBackdropCache.canvas) return false;
  ctx.drawImage(mapBackdropCache.canvas, 0, 0);
  return true;
}

function buildMissionBackdropCanvas() {
  if (typeof document === "undefined" || !state.map || !state.map.length) return null;
  const c = document.createElement("canvas");
  c.width = VIEW_W;
  c.height = VIEW_H;
  const g = c.getContext("2d");
  if (!g) return null;
  g.imageSmoothingEnabled = false;
  g.fillStyle = "#070b0c";
  g.fillRect(0, 0, VIEW_W, VIEW_H);
  drawBackdropRoomMasses(g);
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      const tile = mapTile(x, y);
      const px = x * TILE;
      const py = y * TILE;
      if (tile.type !== "wall") drawBackdropFloorTile(g, x, y, px, py, tile.type);
    }
  }
  drawBackdropRoomDetails(g);
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      const tile = mapTile(x, y);
      const px = x * TILE;
      const py = y * TILE;
      if (tile.type === "wall") drawBackdropWallTile(g, x, y, px, py);
    }
  }
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      const tile = mapTile(x, y);
      const px = x * TILE;
      const py = y * TILE;
      if (tile.type === "door") drawBackdropOpening(g, x, y, px, py, "door");
      if (tile.type === "window") drawBackdropOpening(g, x, y, px, py, "window");
      if (tile.type === "crate") drawBackdropProp(g, x, y, px, py);
      if (tile.type === "stairs") drawBackdropStairs(g, px, py);
    }
  }
  drawBackdropVignette(g);
  return c;
}

function drawBackdropRoomMasses(g) {
  for (const item of state.rooms || []) {
    const color = backdropRoomColor(item.kind);
    g.fillStyle = color;
    g.fillRect(item.x * TILE + 4, item.y * TILE + 4, item.w * TILE - 8, item.h * TILE - 8);
  }
}

function backdropRoomColor(kind) {
  if (kind === "objective" || kind === "records" || kind === "power") return "rgba(101, 85, 44, 0.22)";
  if (kind === "open" || kind === "platform") return "rgba(52, 72, 58, 0.22)";
  if (kind === "service" || kind === "storage" || kind === "garage" || kind === "shed") return "rgba(72, 79, 82, 0.2)";
  if (kind === "level-2" || kind === "suite") return "rgba(73, 60, 94, 0.2)";
  if (kind === "rescue" || kind === "hospital") return "rgba(94, 58, 62, 0.2)";
  return "rgba(55, 68, 63, 0.22)";
}

function drawBackdropFloorTile(g, x, y, px, py, type) {
  const item = roomAtTile(x, y, state.rooms);
  const floor = floorTileForRoom(item, state.mission, type);
  g.fillStyle = "#111918";
  g.fillRect(px, py, TILE, TILE);
  if (!drawCroppedTile(g, floor, px, py, 10, 1)) {
    g.fillStyle = (x + y) % 2 ? "#202b27" : "#1b2522";
    g.fillRect(px, py, TILE, TILE);
  }
  if ((x * 19 + y * 7) % 13 === 0) drawLocalImage(g, decalForRoom(item, state.mission), px + TILE / 2, py + TILE / 2, TILE, TILE, 0.28, ((x + y) % 4) * Math.PI / 2);
  g.strokeStyle = "rgba(0,0,0,0.025)";
  g.lineWidth = 1;
  g.strokeRect(px + 0.5, py + 0.5, TILE - 1, TILE - 1);
}

function floorTileForRoom(item, mission, type) {
  const kind = item ? item.kind : "";
  const tags = mission && mission.tags ? mission.tags.join(" ") : "";
  const id = mission && mission.id ? mission.id : "";
  if (type === "stairs") return "tile_floor_dark";
  if (id === "catacomb" || kind === "den" || tags.indexOf("crypt") >= 0) return "tile_floor_catacomb";
  if (id === "greenroom" || tags.indexOf("nightclub") >= 0) return "tile_floor_nightclub";
  if (id === "cargo_hold" || id === "dockside_relay") return "tile_floor_ship";
  if (id === "metro_switch" || kind === "platform" || kind === "power") return "tile_floor_metro";
  if (id === "clinic_tower" || kind === "hospital" || kind === "level-2") return "tile_floor_clinic";
  if (id === "castiron" || kind === "foyer") return "tile_floor_bank";
  if (id === "market_rescue" || kind === "shop" || kind === "rescue") return "tile_floor_market";
  if (id === "server_vault" || kind === "records" || kind === "objective") return "tile_floor_server";
  if (kind === "office" || kind === "lobby" || kind === "suite") return "tile_floor_office";
  if (kind === "garage" || kind === "storage" || kind === "service" || type === "crate") return "tile_floor_warehouse";
  if (id && id.indexOf("generated_") === 0) return "tile_floor_residential";
  return "tile_floor_concrete";
}

function decalForRoom(item, mission) {
  const kind = item ? item.kind : "";
  const id = mission && mission.id ? mission.id : "";
  if (id === "greenroom") return "decal_neon";
  if (id === "catacomb" || kind === "service") return "decal_puddle";
  if (id === "server_vault") return "decal_cable";
  if (kind === "training" || id === "training_block") return "decal_lane";
  return "decal_grime";
}

function drawBackdropRoomDetails(g) {
  for (const item of state.rooms || []) {
    const x = item.x * TILE;
    const y = item.y * TILE;
    const w = item.w * TILE;
    const h = item.h * TILE;
    g.save();
    g.beginPath();
    g.rect(x + 6, y + 6, w - 12, h - 12);
    g.clip();
    drawBackdropRoomBorder(g, x, y, w, h);
    const kind = item.kind || "room";
    if (kind === "objective" || kind === "records" || kind === "power") drawBackdropObjectiveRoom(g, x, y, w, h);
    else if (kind === "service" || kind === "storage" || kind === "garage" || kind === "shed") drawBackdropStorageRoom(g, x, y, w, h);
    else if (kind === "open" || kind === "platform") drawBackdropOpenRoom(g, x, y, w, h);
    else if (kind === "level-2" || kind === "suite" || kind === "rescue" || kind === "hospital") drawBackdropSoftRoom(g, x, y, w, h);
    else drawBackdropOfficeRoom(g, x, y, w, h);
    g.restore();
  }
}

function drawBackdropRoomBorder(g, x, y, w, h) {
  g.strokeStyle = "rgba(210, 226, 214, 0.08)";
  g.lineWidth = 2;
  g.strokeRect(x + 8.5, y + 8.5, w - 17, h - 17);
  g.strokeStyle = "rgba(0,0,0,0.28)";
  g.lineWidth = 1;
  g.strokeRect(x + 13.5, y + 13.5, w - 27, h - 27);
}

function drawBackdropDesk(g, x, y, w, h, color) {
  g.fillStyle = "rgba(0,0,0,0.26)";
  g.fillRect(x + 3, y + h - 2, w, 5);
  g.fillStyle = color;
  g.fillRect(x, y, w, h);
  g.fillStyle = "rgba(255,255,255,0.08)";
  g.fillRect(x + 3, y + 3, w - 6, 3);
  g.strokeStyle = "rgba(0,0,0,0.38)";
  g.lineWidth = 2;
  g.strokeRect(x + 1, y + 1, w - 2, h - 2);
}

function drawBackdropOfficeRoom(g, x, y, w, h) {
  drawLocalImage(g, "prop_desk", x + 52, y + 42, 58, 58, 0.95, 0);
  if (w > 180) drawLocalImage(g, "prop_counter", x + w - 58, y + h - 48, 58, 58, 0.9, Math.PI);
  if (h > 170) drawLocalImage(g, "prop_laptop", x + w / 2, y + h / 2, 46, 46, 0.9, 0);
}

function drawBackdropObjectiveRoom(g, x, y, w, h) {
  const prop = state.mission && state.mission.id === "castiron" ? "prop_vault_table" : state.mission && state.mission.id === "server_vault" ? "prop_laptop" : "prop_objective_case";
  drawLocalImage(g, prop, x + w / 2, y + h / 2, 62, 62, 0.98, 0);
  if (state.mission && state.mission.id === "server_vault") {
    for (let i = 0; i < Math.max(2, Math.floor(w / 78)); i += 1) drawLocalImage(g, "prop_server_rack", x + 34 + i * 54, y + 42, 44, 58, 0.9, 0);
  }
}

function drawBackdropStorageRoom(g, x, y, w, h) {
  for (let i = 0; i < Math.max(2, Math.floor(w / 82)); i += 1) {
    drawLocalImage(g, i % 2 ? "prop_crate_metal" : "prop_crate_wood", x + 38 + i * 58, y + 44, 42, 42, 0.92, 0);
  }
  if (w > 170) drawLocalImage(g, "prop_barrel", x + w - 48, y + h - 42, 42, 42, 0.92, 0);
}

function drawBackdropOpenRoom(g, x, y, w, h) {
  const missionId = state.mission && state.mission.id ? state.mission.id : "";
  for (let i = 0; i < Math.max(1, Math.floor(w / 120)); i += 1) {
    const prop = missionId === "cargo_hold" ? "prop_cargo_container" : missionId === "metro_switch" ? "prop_rail_track" : missionId === "greenroom" ? "decal_neon" : "prop_sandbag";
    drawLocalImage(g, prop, x + 44 + i * 92, y + h / 2, 52, 52, 0.88, i % 2 ? Math.PI / 2 : 0);
  }
}

function drawBackdropSoftRoom(g, x, y, w, h) {
  const bed = state.mission && state.mission.id === "clinic_tower";
  drawLocalImage(g, bed ? "prop_hospital_bed" : "prop_couch", x + 56, y + 48, 58, 58, 0.93, 0);
  if (w > 150) drawLocalImage(g, "prop_desk", x + w - 58, y + h - 48, 52, 52, 0.88, Math.PI);
}

function drawBackdropWallTile(g, x, y, px, py) {
  const n = wallVisualConnects(x, y - 1);
  const s = wallVisualConnects(x, y + 1);
  const e = wallVisualConnects(x + 1, y);
  const w = wallVisualConnects(x - 1, y);
  const piece = tileWallPieceFor(n, e, s, w);
  g.fillStyle = "#111716";
  g.fillRect(px, py, TILE, TILE);
  if (!drawLocalImage(g, piece.name, px + TILE / 2, py + TILE / 2, TILE + 8, TILE + 8, 1, piece.angle)) {
    g.fillStyle = "#6d746a";
    g.fillRect(px + 4, py + 4, TILE - 8, TILE - 8);
    g.fillStyle = "#343b36";
    g.fillRect(px + 4, py + TILE - 10, TILE - 8, 6);
  }
  g.fillStyle = "rgba(255,255,255,0.06)";
  if ((x * 17 + y * 23) % 5 === 0) g.fillRect(px + 7, py + 7, 4, 2);
}

function drawBackdropOpening(g, x, y, px, py, kind) {
  const vertical = openingOrientation(x, y) === "vertical";
  const key = kind === "window" ? "tile_window" : (x + y) % 3 === 0 ? "tile_door_metal" : "tile_door_wood";
  g.fillStyle = "#1f2926";
  g.fillRect(px, py, TILE, TILE);
  if (drawLocalImage(g, key, px + TILE / 2, py + TILE / 2, TILE + 7, TILE + 7, 1, vertical ? Math.PI / 2 : 0)) return;
  if (vertical) {
    g.fillStyle = kind === "window" ? "#718a88" : "#5c5244";
    g.fillRect(px, py + 3, 6, TILE - 6);
    g.fillRect(px + TILE - 6, py + 3, 6, TILE - 6);
    g.fillStyle = kind === "window" ? "#55a6b1" : "#8a653d";
    g.fillRect(px + 8, py + 7, TILE - 16, TILE - 14);
  } else {
    g.fillStyle = kind === "window" ? "#718a88" : "#5c5244";
    g.fillRect(px + 3, py, TILE - 6, 6);
    g.fillRect(px + 3, py + TILE - 6, TILE - 6, 6);
    g.fillStyle = kind === "window" ? "#55a6b1" : "#8a653d";
    g.fillRect(px + 7, py + 8, TILE - 14, TILE - 16);
  }
  if (kind === "window") {
    g.strokeStyle = "rgba(220,250,255,0.7)";
    g.lineWidth = 1;
    g.beginPath();
    g.moveTo(px + 9, py + 22);
    g.lineTo(px + 21, py + 10);
    g.stroke();
  }
}

function drawBackdropProp(g, x, y, px, py) {
  const prop = propForTile(x, y, roomAtTile(x, y, state.rooms), state.mission);
  if (drawLocalImage(g, prop, px + TILE / 2, py + TILE / 2, TILE + 8, TILE + 8, 1, 0)) return;
  drawLocalImage(g, (x + y) % 2 ? "prop_crate_wood" : "prop_crate_metal", px + TILE / 2, py + TILE / 2, TILE + 6, TILE + 6, 1, 0);
}

function drawBackdropStairs(g, px, py) {
  if (drawLocalImage(g, "tile_stairs", px + TILE / 2, py + TILE / 2, TILE + 7, TILE + 7, 1, 0)) return;
  g.fillStyle = "#203432";
  g.fillRect(px, py, TILE, TILE);
  g.fillStyle = "#79ccd0";
  for (let i = 0; i < 4; i += 1) g.fillRect(px + 5 + i * 2, py + 7 + i * 5, TILE - 10 - i * 4, 3);
}

function propForTile(x, y, item, mission) {
  const kind = item ? item.kind : "";
  const id = mission && mission.id ? mission.id : "";
  if (id === "server_vault" || kind === "records") return "prop_server_rack";
  if (id === "clinic_tower") return "prop_hospital_bed";
  if (id === "market_rescue" || kind === "shop") return "prop_market_shelf";
  if (id === "greenroom") return (x + y) % 2 ? "prop_bar_counter" : "prop_couch";
  if (id === "castiron") return (x + y) % 2 ? "prop_bank_counter" : "prop_vault_table";
  if (id === "cargo_hold") return "prop_cargo_container";
  if (id === "metro_switch") return (x + y) % 2 ? "prop_train_cover" : "prop_rail_track";
  if (kind === "office" || kind === "lobby") return "prop_desk";
  return (x + y) % 2 ? "prop_crate_wood" : "prop_crate_metal";
}

function tileWallPieceFor(n, e, s, w) {
  const count = (n ? 1 : 0) + (e ? 1 : 0) + (s ? 1 : 0) + (w ? 1 : 0);
  if (count === 0) return { name: "tile_wall_single", angle: 0 };
  if (count === 1) {
    if (n) return { name: "tile_wall_end", angle: 0 };
    if (e) return { name: "tile_wall_end", angle: Math.PI / 2 };
    if (s) return { name: "tile_wall_end", angle: Math.PI };
    return { name: "tile_wall_end", angle: -Math.PI / 2 };
  }
  if (count === 2) {
    if (n && s) return { name: "tile_wall_vertical", angle: 0 };
    if (e && w) return { name: "tile_wall_horizontal", angle: 0 };
    if (n && e) return { name: "tile_wall_corner_outer", angle: 0 };
    if (e && s) return { name: "tile_wall_corner_outer", angle: Math.PI / 2 };
    if (s && w) return { name: "tile_wall_corner_outer", angle: Math.PI };
    return { name: "tile_wall_corner_outer", angle: -Math.PI / 2 };
  }
  if (count === 3) {
    if (!n) return { name: "tile_wall_t", angle: 0 };
    if (!e) return { name: "tile_wall_t", angle: Math.PI / 2 };
    if (!s) return { name: "tile_wall_t", angle: Math.PI };
    return { name: "tile_wall_t", angle: -Math.PI / 2 };
  }
  return { name: "tile_wall_cross", angle: 0 };
}

function drawLiveOpeningTile(g, x, y, px, py, kind, visible) {
  const angle = openingOrientation(x, y) === "vertical" ? Math.PI / 2 : 0;
  let key = "tile_door_wood";
  if (kind === "window") {
    const win = windowAt(x, y);
    key = win && win.breached ? "tile_window_breached" : "tile_window";
  } else {
    const door = doorAt(x, y);
    key = door && door.open ? "tile_door_open" : (x + y) % 3 === 0 ? "tile_door_metal" : "tile_door_wood";
  }
  drawLocalImage(g, key, px + TILE / 2, py + TILE / 2, TILE + 7, TILE + 7, visible ? 1 : 0.42, angle);
}

function drawBackdropVignette(g) {
  const gradient = g.createRadialGradient(VIEW_W / 2, VIEW_H / 2, 80, VIEW_W / 2, VIEW_H / 2, VIEW_W * 0.72);
  gradient.addColorStop(0, "rgba(255,255,255,0.03)");
  gradient.addColorStop(1, "rgba(0,0,0,0.28)");
  g.fillStyle = gradient;
  g.fillRect(0, 0, VIEW_W, VIEW_H);
}

function drawLocalImage(g, name, x, y, width, height, alpha, angle) {
  const img = imageAssets[name];
  if (!loadedImage(img)) return false;
  g.save();
  g.translate(Math.round(x), Math.round(y));
  g.rotate(angle || 0);
  g.globalAlpha *= alpha == null ? 1 : alpha;
  g.drawImage(img, -width / 2, -height / 2, width, height);
  g.restore();
  return true;
}

function drawCroppedTile(g, name, px, py, crop, alpha) {
  const img = imageAssets[name];
  if (!loadedImage(img)) return false;
  const inset = crop || 0;
  const sw = Math.max(1, img.naturalWidth - inset * 2);
  const sh = Math.max(1, img.naturalHeight - inset * 2);
  g.save();
  g.globalAlpha *= alpha == null ? 1 : alpha;
  g.drawImage(img, inset, inset, sw, sh, px, py, TILE, TILE);
  g.restore();
  return true;
}

function drawBackdropTileSheen(x, y, px, py, visible) {
  if (!visible) {
    ctx.fillStyle = "rgba(5, 9, 9, 0.22)";
    ctx.fillRect(px, py, TILE, TILE);
    return;
  }
  if ((x * 29 + y * 17) % 7 === 0) {
    ctx.fillStyle = "rgba(230, 244, 234, 0.035)";
    ctx.fillRect(px + 2, py + 2, TILE - 4, TILE - 4);
  }
}

function drawBackdropWallOverlay(x, y, px, py, visible, seen) {
  ctx.fillStyle = visible ? "rgba(4, 6, 6, 0.02)" : "rgba(4, 6, 6, 0.28)";
  ctx.fillRect(px, py, TILE, TILE);
  if (!visible && seen) {
    ctx.fillStyle = "rgba(8, 14, 13, 0.16)";
    ctx.fillRect(px, py, TILE, TILE);
  }
}

function drawRoomPurposeTint(tx, ty, px, py, visible) {
  const item = roomAtTile(tx, ty, state.rooms);
  if (!item) return;
  const color = roomPurposeColor(item.kind);
  if (!color) return;
  ctx.fillStyle = color.replace("ALPHA", visible ? "0.075" : "0.035");
  ctx.fillRect(px, py, TILE, TILE);
  if ((tx + ty) % 5 === 0 && visible) {
    ctx.fillStyle = color.replace("ALPHA", "0.1");
    ctx.fillRect(px + 4, py + 4, 3, 3);
  }
}

function roomPurposeColor(kind) {
  if (kind === "objective" || kind === "records" || kind === "power") return "rgba(226, 198, 92, ALPHA)";
  if (kind === "entry" || kind === "lobby" || kind === "training") return "rgba(91, 170, 209, ALPHA)";
  if (kind === "open" || kind === "platform") return "rgba(110, 183, 128, ALPHA)";
  if (kind === "service" || kind === "storage" || kind === "garage" || kind === "shed") return "rgba(154, 164, 176, ALPHA)";
  if (kind === "level-2" || kind === "suite") return "rgba(155, 121, 205, ALPHA)";
  if (kind === "level-1" || kind === "office" || kind === "den") return "rgba(198, 136, 88, ALPHA)";
  if (kind === "rescue" || kind === "hospital") return "rgba(222, 118, 126, ALPHA)";
  return null;
}

function openingOrientation(tx, ty) {
  const leftWall = mapTile(tx - 1, ty).type === "wall";
  const rightWall = mapTile(tx + 1, ty).type === "wall";
  const upWall = mapTile(tx, ty - 1).type === "wall";
  const downWall = mapTile(tx, ty + 1).type === "wall";
  if (leftWall && rightWall) return "vertical";
  if (upWall && downWall) return "horizontal";
  if (leftWall || rightWall) return "vertical";
  return "horizontal";
}

function drawOpeningFrame(tx, ty, px, py, kind, open) {
  const vertical = openingOrientation(tx, ty) === "vertical";
  ctx.fillStyle = kind === "window" ? "#3b5655" : "#4f4a38";
  if (vertical) {
    ctx.fillRect(px, py + 2, 6, TILE - 4);
    ctx.fillRect(px + TILE - 6, py + 2, 6, TILE - 4);
    ctx.fillStyle = open ? "rgba(233, 214, 133, 0.28)" : "rgba(12, 16, 15, 0.34)";
    ctx.fillRect(px + 6, py + 8, TILE - 12, TILE - 16);
  } else {
    ctx.fillRect(px + 2, py, TILE - 4, 6);
    ctx.fillRect(px + 2, py + TILE - 6, TILE - 4, 6);
    ctx.fillStyle = open ? "rgba(233, 214, 133, 0.28)" : "rgba(12, 16, 15, 0.34)";
    ctx.fillRect(px + 8, py + 6, TILE - 16, TILE - 12);
  }
}

function drawWallTile(x, y, px, py, visible, seen) {
  const n = wallVisualConnects(x, y - 1);
  const s = wallVisualConnects(x, y + 1);
  const e = wallVisualConnects(x + 1, y);
  const w = wallVisualConnects(x - 1, y);
  drawWallPieceAt(px, py, n, e, s, w, visible, seen);
}

function drawWallPieceAt(px, py, n, e, s, w, visible, seen) {
  ctx.fillStyle = visible ? "#1c2422" : "#0c1110";
  ctx.fillRect(px, py, TILE, TILE);
  const piece = wallPieceFor(n, e, s, w);
  if (!drawSheetAsset(piece.name, px + TILE / 2, py + TILE / 2, TILE + 7, TILE + 7, visible ? 0.98 : 0.35, piece.angle)) {
    ctx.fillStyle = visible ? "#495650" : "#1f2926";
    ctx.fillRect(px + 2, py + 2, TILE - 4, TILE - 4);
  }
  if (!visible && seen) {
    ctx.fillStyle = "rgba(8, 14, 13, 0.12)";
    ctx.fillRect(px, py, TILE, TILE);
  }
}

function wallVisualConnects(tx, ty) {
  const type = mapTile(tx, ty).type;
  return type === "wall" || type === "door" || type === "window" || type === "stairs";
}

function wallPieceFor(n, e, s, w) {
  const count = (n ? 1 : 0) + (e ? 1 : 0) + (s ? 1 : 0) + (w ? 1 : 0);
  if (count === 0) return { name: "wall_single", angle: 0 };
  if (count === 1) {
    if (n) return { name: "wall_end", angle: 0 };
    if (e) return { name: "wall_end", angle: Math.PI / 2 };
    if (s) return { name: "wall_end", angle: Math.PI };
    return { name: "wall_end", angle: -Math.PI / 2 };
  }
  if (count === 2) {
    if (n && s) return { name: "wall_straight", angle: 0 };
    if (e && w) return { name: "wall_straight", angle: Math.PI / 2 };
    if (n && e) return { name: "wall_corner", angle: 0 };
    if (e && s) return { name: "wall_corner", angle: Math.PI / 2 };
    if (s && w) return { name: "wall_corner", angle: Math.PI };
    return { name: "wall_corner", angle: -Math.PI / 2 };
  }
  if (count === 3) {
    if (!n) return { name: "wall_t", angle: 0 };
    if (!e) return { name: "wall_t", angle: Math.PI / 2 };
    if (!s) return { name: "wall_t", angle: Math.PI };
    return { name: "wall_t", angle: -Math.PI / 2 };
  }
  return { name: "wall_cross", angle: 0 };
}

function drawFogOverlay() {
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      if (isTileVisible(x, y)) continue;
      if (isTileSeen(x, y)) continue;
      const px = x * TILE;
      const py = y * TILE;
      ctx.fillStyle = "rgba(1, 3, 3, 0.92)";
      ctx.fillRect(px, py, TILE, TILE);
    }
  }

  for (const source of visibilitySources()) {
    const gradient = ctx.createRadialGradient(source.x, source.y, 14, source.x, source.y, source.range);
    gradient.addColorStop(0, "rgba(126, 212, 184, 0.08)");
    gradient.addColorStop(0.7, "rgba(126, 212, 184, 0.018)");
    gradient.addColorStop(1, "rgba(126, 212, 184, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(source.x, source.y, source.range, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCameraHud() {
  const op = selectedOperator();
  ctx.fillStyle = "rgba(8, 12, 11, 0.72)";
  ctx.fillRect(12, VIEW_H - 44, 322, 28);
  ctx.strokeStyle = "rgba(232, 239, 233, 0.12)";
  ctx.strokeRect(12.5, VIEW_H - 43.5, 322, 28);
  ctx.fillStyle = "#d9e7dc";
  ctx.font = "700 12px ui-sans-serif, system-ui";
  const visibleHostiles = state.enemies.filter((enemy) => !enemy.down && entityVisible(enemy)).length;
  const hiddenContacts = state.enemies.filter((enemy) => !enemy.down && !entityVisible(enemy)).length;
  ctx.fillText(
    `${(op && op.name) || "Squad"} ${state.camera.follow ? "follow" : "free"} ${Math.round(state.camera.zoom * 100)}% | visible ${visibleHostiles} | hidden contacts ${hiddenContacts}`,
    24,
    VIEW_H - 25,
  );
}

function drawMiniMap() {
  const scale = 4;
  const w = COLS * scale;
  const h = ROWS * scale;
  const x0 = VIEW_W - w - 14;
  const y0 = 14;
  ctx.fillStyle = "rgba(8, 12, 11, 0.78)";
  ctx.fillRect(x0 - 7, y0 - 7, w + 14, h + 14);
  ctx.strokeStyle = "rgba(232, 239, 233, 0.16)";
  ctx.strokeRect(x0 - 6.5, y0 - 6.5, w + 13, h + 13);
  const multiLevel = state.floors && state.floors.levels > 1;
  const focused = selectedOperator();
  const activeFloor = focused && focused.level ? focused.level : 1;
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      if (!isTileSeen(x, y)) {
        ctx.fillStyle = "#030505";
      } else {
        const type = mapTile(x, y).type;
        ctx.fillStyle =
          type === "wall"
            ? "#66746d"
            : type === "door"
              ? "#9a7547"
              : type === "window"
                ? "#62b6a6"
                : type === "crate"
                  ? "#76613e"
                  : type === "stairs"
                    ? "#6bd6da"
                    : "#26312d";
      }
      if (isTileVisible(x, y)) ctx.fillStyle = mapTile(x, y).type === "wall" ? "#9bac9f" : "#3c4d47";
      ctx.fillRect(x0 + x * scale, y0 + y * scale, scale, scale);
      if (multiLevel) {
        const v = state.floors.map.get(`${x},${y}`);
        if (typeof v === "number" && v !== activeFloor) {
          ctx.fillStyle = "rgba(4, 6, 6, 0.55)";
          ctx.fillRect(x0 + x * scale, y0 + y * scale, scale, scale);
        } else if (v === "stair") {
          ctx.fillStyle = "rgba(107, 214, 218, 0.55)";
          ctx.fillRect(x0 + x * scale, y0 + y * scale, scale, scale);
        }
      }
    }
  }
  if (multiLevel) {
    ctx.fillStyle = "rgba(8,12,11,0.82)";
    ctx.fillRect(x0 - 6, y0 + h - 16, 84, 14);
    ctx.fillStyle = "#e8efe9";
    ctx.font = "700 10px ui-sans-serif, system-ui";
    ctx.fillText(`Floor ${activeFloor}/${state.floors.levels}`, x0, y0 + h - 6);
  }
  for (const op of state.operators) {
    if (op.down) continue;
    const tile = worldToTile(op.x, op.y);
    const dim = multiLevel && op.level && op.level !== activeFloor;
    ctx.globalAlpha = dim ? 0.5 : 1;
    ctx.fillStyle = op.color;
    ctx.fillRect(x0 + tile.tx * scale - 1, y0 + tile.ty * scale - 1, scale + 2, scale + 2);
    ctx.globalAlpha = 1;
  }
  for (const enemy of state.enemies) {
    if (enemy.down || !entityVisible(enemy)) continue;
    const tile = worldToTile(enemy.x, enemy.y);
    const dim = multiLevel && enemy.level && enemy.level !== activeFloor;
    ctx.globalAlpha = dim ? 0.45 : 1;
    ctx.fillStyle = colors.hostile;
    ctx.fillRect(x0 + tile.tx * scale, y0 + tile.ty * scale, scale, scale);
    ctx.globalAlpha = 1;
  }
  if (state.extraction) {
    const tile = worldToTile(state.extraction.x, state.extraction.y);
    ctx.fillStyle = colors.extract;
    ctx.fillRect(x0 + tile.tx * scale - 1, y0 + tile.ty * scale - 1, scale + 2, scale + 2);
  }
  const halfW = VIEW_W / (2 * state.camera.zoom);
  const halfH = VIEW_H / (2 * state.camera.zoom);
  ctx.strokeStyle = "#f3dd7d";
  ctx.lineWidth = 1;
  ctx.strokeRect(
    x0 + ((state.camera.x - halfW) / TILE) * scale,
    y0 + ((state.camera.y - halfH) / TILE) * scale,
    ((halfW * 2) / TILE) * scale,
    ((halfH * 2) / TILE) * scale,
  );
}

function drawExtraction() {
  if (!state.extraction) return;
  if (!entityVisible(state.extraction) && !isTileSeen(worldToTile(state.extraction.x, state.extraction.y).tx, worldToTile(state.extraction.x, state.extraction.y).ty)) return;
  const { x, y } = state.extraction;
  ctx.strokeStyle = colors.extract;
  ctx.lineWidth = 3;
  ctx.setLineDash([6, 5]);
  ctx.strokeRect(x - 20, y - 20, 40, 40);
  ctx.setLineDash([]);
  ctx.fillStyle = "rgba(131,211,111,0.16)";
  ctx.fillRect(x - 18, y - 18, 36, 36);
  drawAtlasSprite("extract", x, y, 38, 0, 0.95);
}

function drawRoomLabels() {
  if (!state.rooms || !state.rooms.length) return;
  ctx.save();
  ctx.font = "700 9px ui-sans-serif, system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const item of state.rooms) {
    const cx = (item.x + item.w / 2) * TILE;
    const cy = (item.y + item.h / 2) * TILE;
    const tile = worldToTile(cx, cy);
    if (!isTileSeen(tile.tx, tile.ty)) continue;
    const label = item.label.toUpperCase();
    const width = Math.min(item.w * TILE - 10, Math.max(42, label.length * 6 + 12));
    ctx.fillStyle = "rgba(8, 12, 11, 0.46)";
    ctx.fillRect(cx - width / 2, cy - 8, width, 16);
    ctx.strokeStyle = "rgba(232, 239, 233, 0.1)";
    ctx.strokeRect(cx - width / 2 + 0.5, cy - 7.5, width, 15);
    ctx.fillStyle = item.kind === "objective" ? "rgba(232, 210, 112, 0.78)" : "rgba(202, 217, 208, 0.58)";
    ctx.fillText(label, cx, cy);
  }
  ctx.restore();
  drawFloorLabels();
}

function drawFloorLabels() {
  if (!state.floors || state.floors.levels < 2) return;
  // Group tiles by floor and find each floor's bounding centroid for a top-edge label.
  const buckets = {};
  state.floors.map.forEach((value, key) => {
    if (typeof value !== "number") return;
    if (!buckets[value]) buckets[value] = { minX: COLS, maxX: 0, minY: ROWS, maxY: 0, count: 0 };
    const parts = key.split(",");
    const tx = parseInt(parts[0], 10);
    const ty = parseInt(parts[1], 10);
    buckets[value].minX = Math.min(buckets[value].minX, tx);
    buckets[value].maxX = Math.max(buckets[value].maxX, tx);
    buckets[value].minY = Math.min(buckets[value].minY, ty);
    buckets[value].maxY = Math.max(buckets[value].maxY, ty);
    buckets[value].count += 1;
  });
  const focused = selectedOperator();
  const activeFloor = focused && focused.level ? focused.level : 1;
  ctx.save();
  ctx.font = "900 14px ui-sans-serif, system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const key of Object.keys(buckets)) {
    const lvl = parseInt(key, 10);
    const b = buckets[key];
    if (!b.count) continue;
    const cx = ((b.minX + b.maxX) / 2 + 0.5) * TILE;
    const cy = (b.minY + 0.5) * TILE + 4;
    const active = lvl === activeFloor;
    const fill = active ? "rgba(232, 210, 112, 0.92)" : "rgba(159, 176, 166, 0.7)";
    const bg = active ? "rgba(8, 12, 11, 0.88)" : "rgba(8, 12, 11, 0.6)";
    const text = `FLOOR ${lvl}${active ? " · ACTIVE" : ""}`;
    const w = text.length * 7 + 12;
    ctx.fillStyle = bg;
    ctx.fillRect(cx - w / 2, cy - 10, w, 20);
    ctx.strokeStyle = active ? "rgba(232, 210, 112, 0.6)" : "rgba(232, 239, 233, 0.18)";
    ctx.lineWidth = 1;
    ctx.strokeRect(cx - w / 2 + 0.5, cy - 9.5, w - 1, 19);
    ctx.fillStyle = fill;
    ctx.fillText(text, cx, cy);
  }
  ctx.restore();
}

function drawObjectives() {
  for (const obj of state.objectives) {
    if (!entityVisible(obj)) continue;
    if (!drawAtlasSprite(obj.secured ? "extract" : "objective", obj.x, obj.y, 36, 0, 0.98)) {
      ctx.fillStyle = obj.secured ? colors.extract : colors.objective;
      ctx.fillRect(obj.x - 10, obj.y - 9, 20, 18);
      ctx.fillStyle = "#101817";
      ctx.fillRect(obj.x - 6, obj.y - 5, 12, 7);
    }
    ctx.strokeStyle = obj.secured ? colors.extract : "#bfeaf4";
    ctx.lineWidth = 2;
    ctx.strokeRect(obj.x - 13, obj.y - 12, 26, 24);
    if (!obj.secured && obj.progress > 0) {
      ctx.fillStyle = "#e8d270";
      ctx.fillRect(obj.x - 14, obj.y + 16, 28 * clamp(obj.progress / 1.35, 0, 1), 4);
    }
  }
}

function drawDrones() {
  for (const drone of state.drones) {
    const pulse = 0.5 + Math.sin(drone.pulse * 5) * 0.5;
    ctx.strokeStyle = `rgba(108, 214, 218, ${0.28 + pulse * 0.22})`;
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 8]);
    ctx.beginPath();
    ctx.arc(drone.x, drone.y, drone.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    drawAtlasSprite("radio_icon", drone.x, drone.y, 28, 0, 0.95);
  }
}

function drawSmokes() {
  for (const smoke of state.smokes) {
    const alpha = clamp(smoke.t / 2, 0.2, 0.55);
    ctx.fillStyle = `rgba(174, 184, 174, ${alpha})`;
    drawAtlasSprite("smoke", smoke.x, smoke.y, smoke.r * 1.5, 0, alpha);
    for (let i = 0; i < 7; i += 1) {
      const ang = i * 1.7 + state.missionTime * 0.2;
      const r = smoke.r * (0.45 + (i % 3) * 0.12);
      ctx.beginPath();
      ctx.arc(smoke.x + Math.cos(ang) * 16, smoke.y + Math.sin(ang) * 12, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawPaths() {
  for (const op of state.operators) {
    if (!op.path.length) continue;
    const selected = isOperatorSelected(op);
    ctx.strokeStyle = selected ? colors.path : "rgba(232, 200, 80, 0.45)";
    ctx.lineWidth = selected ? 3 : 2;
    ctx.setLineDash([9, 7]);
    ctx.beginPath();
    ctx.moveTo(op.x, op.y);
    for (const p of op.path) ctx.lineTo(p.x, p.y);
    ctx.stroke();
    ctx.setLineDash([]);
    for (const [index, p] of op.path.entries()) {
      const selected = state.selectedWaypoint && state.selectedWaypoint.opId === op.id && state.selectedWaypoint.index === index;
      ctx.fillStyle = selected ? "#ffffff" : index === op.path.length - 1 ? "#fff0a3" : colors.path;
      ctx.fillRect(p.x - 4, p.y - 4, selected ? 8 : 6, selected ? 8 : 6);
      if (p.actions && p.actions.length) {
        for (const [actionIndex, action] of p.actions.entries()) {
          const def = planActionDefs[action.type];
          if (!def) continue;
          drawWorldIcon(def.icon, p.x + 12 + actionIndex * 8, p.y - 12, 18, action.status === "done" ? 0.38 : 0.95);
        }
      }
    }
  }
}

function drawWorldIcon(icon, x, y, size, alpha) {
  if (uiSprites[icon]) {
    drawGeneratedAsset(icon, x, y, size, alpha);
    return;
  }
  drawAtlasSprite(icon, x, y, size, 0, alpha);
}

function drawFocusOrders() {
  for (const op of state.operators) {
    if (!op.focus || op.down) continue;
    const selected = isOperatorSelected(op);
    ctx.strokeStyle = selected ? "rgba(107, 214, 218, 0.9)" : "rgba(107, 214, 218, 0.42)";
    ctx.lineWidth = selected ? 2 : 1;
    ctx.setLineDash([3, 6]);
    ctx.beginPath();
    ctx.moveTo(op.x, op.y);
    ctx.lineTo(op.focus.x, op.focus.y);
    ctx.stroke();
    ctx.setLineDash([]);
    drawAtlasSprite("eye_icon", op.focus.x, op.focus.y, 24, 0, 0.9);
  }
}

function drawEffectsUnder() {
  for (const effect of state.effects) {
    if (effect.type === "flash" || effect.type === "breach" || effect.type === "smoke-pop") {
      const t = clamp(effect.t, 0, 1);
      ctx.fillStyle = effect.type === "flash" ? `rgba(255,244,188,${t})` : `rgba(240,158,82,${t * 0.75})`;
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, effect.r + (1 - t) * 80, 0, Math.PI * 2);
      ctx.fill();
      drawAtlasSprite(effect.type === "flash" ? "flash" : "muzzle", effect.x, effect.y, 34 + (1 - t) * 20, 0, t);
    } else if (effect.type === "scan") {
      const t = clamp(effect.t, 0, 1);
      ctx.strokeStyle = `rgba(108, 214, 218, ${t})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, effect.r + (1 - t) * 95, 0, Math.PI * 2);
      ctx.stroke();
      drawAtlasSprite("eye_icon", effect.x, effect.y, 28, 0, t);
    }
  }
}

function drawEffectsOver() {
  for (const effect of state.effects) {
    if (effect.type === "shot") {
      ctx.strokeStyle = effect.side === "operator" ? "#ffe27d" : "#ff9d82";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(effect.x1, effect.y1);
      ctx.lineTo(effect.x2, effect.y2);
      ctx.stroke();
    } else if (effect.type === "muzzle") {
      drawAtlasSprite("muzzle", effect.x, effect.y, effect.r, 0, clamp(effect.t * 15, 0, 1));
    }
  }
}

function drawNightOverlay() {
  if (!state.mission.night) return;
  ctx.fillStyle = "rgba(4, 9, 13, 0.34)";
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  for (const op of state.operators) {
    if (op.down) continue;
    const glow = ctx.createRadialGradient(op.x, op.y, 8, op.x, op.y, 180);
    glow.addColorStop(0, "rgba(140, 206, 168, 0.16)");
    glow.addColorStop(1, "rgba(140, 206, 168, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(op.x, op.y, 180, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawOperator(op) {
  if (op.down) {
    drawDownMarker(op.x, op.y, op.color, op.sprite);
    return;
  }
  const selected = isOperatorSelected(op);
  if (selected) drawSightCone(op);
  if (!drawAtlasUnit(op.sprite, op.x, op.y, op.facing, 38, selected)) {
    drawMiniOperator(op.x, op.y, op.facing, op.color, selected);
  }
  if (selected && op.id !== state.selectedId) drawGroupBadge(op.x, op.y);
  if (op.underFire > 0) drawUnderFireMarker(op);
  if (op.hitFlash > 0) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = clamp(op.hitFlash, 0, 1) * 0.7;
    ctx.fillStyle = "#ff8a72";
    ctx.beginPath();
    ctx.arc(op.x, op.y, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  drawHealth(op.x, op.y - 22, op.hp / op.maxHp, selected);
  if (op.suppression > 18) drawPressurePips(op.x, op.y + 21, op.suppression);
}

function drawGroupBadge(x, y) {
  ctx.save();
  ctx.fillStyle = "rgba(107, 214, 218, 0.88)";
  ctx.strokeStyle = "#101514";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x + 15, y - 15, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawSelectionBox() {
  const box = state.selectionBox;
  if (!box || !box.moved) return;
  const left = Math.min(box.startX, box.x);
  const top = Math.min(box.startY, box.y);
  const width = Math.abs(box.x - box.startX);
  const height = Math.abs(box.y - box.startY);
  ctx.save();
  ctx.fillStyle = "rgba(107, 214, 218, 0.12)";
  ctx.strokeStyle = "rgba(107, 214, 218, 0.86)";
  ctx.lineWidth = 2 / state.camera.zoom;
  ctx.setLineDash([8 / state.camera.zoom, 5 / state.camera.zoom]);
  ctx.fillRect(left, top, width, height);
  ctx.strokeRect(left, top, width, height);
  ctx.restore();
}

function drawSightCone(op) {
  const gear = weaponFor(op.gear);
  const range = gear.range * (state.mission.night ? 0.72 : 1);
  ctx.fillStyle = "rgba(232, 200, 80, 0.09)";
  ctx.beginPath();
  ctx.moveTo(op.x, op.y);
  ctx.arc(op.x, op.y, range, op.facing - 0.48, op.facing + 0.48);
  ctx.closePath();
  ctx.fill();
}

function drawMiniOperator(x, y, angle, body, selected) {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.rotate(angle);
  if (selected) {
    ctx.strokeStyle = colors.select;
    ctx.lineWidth = 2;
    ctx.strokeRect(-15, -15, 30, 30);
  }
  ctx.fillStyle = "#1a2220";
  ctx.fillRect(-9, -9, 18, 18);
  ctx.fillStyle = body;
  ctx.fillRect(-7, -7, 14, 14);
  ctx.fillStyle = "#d8eadf";
  ctx.fillRect(4, -4, 8, 8);
  ctx.fillStyle = "#202827";
  ctx.fillRect(8, -2, 12, 4);
  ctx.fillStyle = "#111616";
  ctx.fillRect(-5, -10, 10, 4);
  ctx.fillRect(-5, 6, 10, 4);
  ctx.restore();
}

function drawEnemy(enemy) {
  if (enemy.down) {
    drawDownMarker(enemy.x, enemy.y, colors.hostileDark, enemy.sprite);
    return;
  }
  if (!drawAtlasUnit(enemy.sprite, enemy.x, enemy.y, enemy.facing, 36, false, enemy.stunned > 0 ? 0.58 : 1)) {
    drawMiniEnemy(enemy.x, enemy.y, enemy.facing, enemy.stunned > 0);
  }
  drawHealth(enemy.x, enemy.y - 21, enemy.hp / enemy.maxHp, false);
  if (enemy.tagged > 0) drawIntelBadge(enemy.x, enemy.y - 34);
  if (enemy.suppression > 18) drawPressurePips(enemy.x, enemy.y + 20, enemy.suppression);
  if (enemy.alert) {
    ctx.fillStyle = "#f0d36b";
    ctx.fillRect(enemy.x - 2, enemy.y - 30, 4, 12);
    ctx.fillRect(enemy.x - 2, enemy.y - 15, 4, 4);
  }
}

function drawAtlasUnit(sprite, x, y, angle, size, selected, alpha = 1) {
  ctx.save();
  if (selected) {
    ctx.strokeStyle = colors.select;
    ctx.lineWidth = 2;
    ctx.strokeRect(Math.round(x - 18), Math.round(y - 18), 36, 36);
  }
  ctx.fillStyle = "rgba(0,0,0,0.28)";
  ctx.beginPath();
  ctx.ellipse(x, y + 12, 13, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  return drawAtlasSprite(sprite, x, y, size, angle + Math.PI / 2, alpha);
}

function drawIntelBadge(x, y) {
  ctx.fillStyle = "rgba(98, 182, 166, 0.88)";
  ctx.fillRect(x - 8, y - 7, 16, 14);
  ctx.fillStyle = "#10201d";
  ctx.fillRect(x - 3, y - 2, 6, 4);
  ctx.strokeStyle = "#d7fff1";
  ctx.lineWidth = 1;
  ctx.strokeRect(x - 8, y - 7, 16, 14);
}

function drawUnderFireMarker(op) {
  const alpha = clamp(op.underFire, 0, 1);
  ctx.strokeStyle = `rgba(255, 214, 103, ${0.35 + alpha * 0.5})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(op.x, op.y, 18 + Math.sin(state.missionTime * 18) * 2, 0, Math.PI * 2);
  ctx.stroke();
  if (op.reaction) {
    ctx.strokeStyle = `rgba(255, 157, 130, ${alpha})`;
    ctx.setLineDash([3, 5]);
    ctx.beginPath();
    ctx.moveTo(op.x, op.y);
    ctx.lineTo(op.reaction.x, op.reaction.y);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

function drawPressurePips(x, y, amount) {
  const count = clamp(Math.ceil(amount / 24), 1, 4);
  ctx.fillStyle = "#f0d36b";
  for (let i = 0; i < count; i += 1) ctx.fillRect(x - 9 + i * 6, y, 4, 4);
}

function drawMiniEnemy(x, y, angle, stunned) {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.rotate(angle);
  ctx.fillStyle = stunned ? "#8e8171" : colors.hostileDark;
  ctx.fillRect(-8, -8, 16, 16);
  ctx.fillStyle = stunned ? "#c6b89e" : colors.hostile;
  ctx.fillRect(-6, -6, 12, 12);
  ctx.fillStyle = "#1a1111";
  ctx.fillRect(7, -2, 10, 4);
  ctx.fillStyle = "#211818";
  ctx.fillRect(-4, -8, 8, 4);
  ctx.restore();
}

function drawCivilian(civ) {
  if (civ.extracted) return;
  ctx.save();
  ctx.translate(Math.round(civ.x), Math.round(civ.y));
  if (!drawAtlasSprite("civilian", 0, 0, 35, 0, civ.rescued ? 1 : 0.95)) {
    ctx.fillStyle = civ.rescued ? colors.extract : colors.civilian;
    ctx.fillRect(-6, -7, 12, 14);
    ctx.fillStyle = "#17301b";
    ctx.fillRect(-4, -9, 8, 4);
  }
  if (civ.rescued) {
    ctx.strokeStyle = colors.extract;
    ctx.lineWidth = 2;
    ctx.strokeRect(-11, -12, 22, 24);
  }
  ctx.restore();
}

function drawDownMarker(x, y, color, sprite) {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.rotate(-0.65);
  if (sprite && drawAtlasSprite(sprite, 0, 0, 32, 0, 0.42)) {
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.strokeRect(-12, -12, 24, 24);
  } else {
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.55;
    ctx.fillRect(-9, -5, 18, 10);
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawHealth(x, y, pct, selected) {
  ctx.fillStyle = "#101514";
  ctx.fillRect(x - 12, y, 24, 4);
  ctx.fillStyle = pct < 0.35 ? colors.hostile : selected ? colors.select : colors.extract;
  ctx.fillRect(x - 12, y, 24 * clamp(pct, 0, 1), 4);
}

function drawOutcome() {
  ctx.fillStyle = "rgba(6, 8, 8, 0.82)";
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  const panelW = 560;
  const panelH = 280;
  const px = (VIEW_W - panelW) / 2;
  const py = (VIEW_H - panelH) / 2;
  ctx.fillStyle = "#0d1614";
  ctx.fillRect(px, py, panelW, panelH);
  ctx.strokeStyle = state.outcome.success ? "#e8d270" : "#ff9f91";
  ctx.lineWidth = 3;
  ctx.strokeRect(px + 1.5, py + 1.5, panelW - 3, panelH - 3);
  ctx.fillStyle = state.outcome.success ? "#e8d270" : "#ff9f91";
  drawText(state.outcome.success ? "MISSION COMPLETE" : "MISSION FAILED", px + 32, py + 56, 28, ctx.fillStyle);
  drawText(`Grade ${state.outcome.grade}`, px + panelW - 130, py + 56, 24, ctx.fillStyle);
  drawText(state.outcome.reason || "", px + 32, py + 84, 14, "#9fb0a6");
  const stats = state.outcome.stats || {};
  const time = stats.time || 0;
  const minutes = Math.floor(time / 60).toString().padStart(2, "0");
  const seconds = Math.floor(time % 60).toString().padStart(2, "0");
  const lines = [
    `Time on target: ${minutes}:${seconds}`,
    `Hostiles down: ${stats.kills || 0}${stats.hostilesLeft ? ` | ${stats.hostilesLeft} active` : ""}`,
    `Operators wounded: ${stats.wounds || 0}${stats.downed ? ` | ${stats.downed} down` : ""}`,
    stats.totalCiv ? `Civilians extracted: ${stats.rescued}/${stats.totalCiv}` : "No civilians on site",
    state.outcome.success ? `Payout: +${stats.reward || 0} credits` : "Payout: none",
  ];
  for (let i = 0; i < lines.length; i += 1) {
    drawText(lines[i], px + 32, py + 122 + i * 24, 16, "#d9e6dd");
  }
  drawText("Restart  |  Pick another op  |  Editor", px + 32, py + panelH - 28, 13, "#62b6a6");
}

function drawKillFeed() {
  if (!state.killFeed.length) return;
  ctx.save();
  ctx.textBaseline = "top";
  for (let i = 0; i < state.killFeed.length; i += 1) {
    const entry = state.killFeed[i];
    const alpha = clamp(entry.t, 0, 1);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(8, 12, 12, 0.75)";
    ctx.fillRect(VIEW_W - 230, 16 + i * 22, 214, 18);
    ctx.fillStyle = "#e8efe9";
    ctx.font = "700 12px ui-sans-serif, system-ui";
    ctx.fillText(entry.text, VIEW_W - 222, 18 + i * 22);
  }
  ctx.restore();
}

function drawText(text, x, y, size, color) {
  ctx.fillStyle = color;
  ctx.font = `700 ${size}px ui-sans-serif, system-ui`;
  ctx.fillText(text, x, y);
}

function renderEditorMap() {
  const editor = state.editor;
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      const ch = editor.grid[y][x];
      const px = x * TILE;
      const py = y * TILE;
      if (ch === "#") {
        drawEditorWallTile(editor.grid, x, y, px, py);
        continue;
      }
      ctx.fillStyle = ch === "B" ? colors.crate : colors.floor;
      ctx.fillRect(px, py, TILE, TILE);
      ctx.strokeStyle = "rgba(0,0,0,0.16)";
      ctx.strokeRect(px, py, TILE, TILE);
      if (ch === "D") {
        ctx.fillStyle = colors.door;
        ctx.fillRect(px + 5, py + 8, TILE - 10, TILE - 16);
      } else if (ch === "W") {
        ctx.fillStyle = colors.window;
        ctx.fillRect(px + 4, py + 12, TILE - 8, 8);
      } else if (ch === "A") {
        if (!drawGeneratedAsset("stairs", px + TILE / 2, py + TILE / 2, TILE, 0.9)) drawEditorGlyph(px, py, "#6bd6da", "A");
      } else if (ch === "S") {
        if (!drawAtlasSprite("op_rook", px + TILE / 2, py + TILE / 2, TILE, 0, 0.9)) drawEditorGlyph(px, py, "#77c7bd", "S");
      } else if (ch === "E") {
        if (!drawAtlasSprite("enemy_a", px + TILE / 2, py + TILE / 2, TILE, 0, 0.9)) drawEditorGlyph(px, py, colors.hostile, "E");
      } else if (ch === "C") {
        if (!drawAtlasSprite("civilian", px + TILE / 2, py + TILE / 2, TILE, 0, 0.9)) drawEditorGlyph(px, py, colors.civilian, "C");
      } else if (ch === "O") {
        if (!drawAtlasSprite("objective", px + TILE / 2, py + TILE / 2, TILE, 0, 0.9)) drawEditorGlyph(px, py, colors.objective, "O");
      } else if (ch === "X") {
        if (!drawAtlasSprite("extract", px + TILE / 2, py + TILE / 2, TILE, 0, 0.9)) drawEditorGlyph(px, py, colors.extract, "X");
      }
    }
  }
}

function drawEditorWallTile(grid, x, y, px, py) {
  const n = editorWallConnects(grid, x, y - 1);
  const s = editorWallConnects(grid, x, y + 1);
  const e = editorWallConnects(grid, x + 1, y);
  const w = editorWallConnects(grid, x - 1, y);
  drawWallPieceAt(px, py, n, e, s, w, true, true);
}

function editorWallConnects(grid, x, y) {
  if (x < 0 || y < 0 || y >= grid.length || x >= grid[y].length) return false;
  const ch = grid[y][x];
  return ch === "#" || ch === "D" || ch === "W" || ch === "A";
}

function drawEditorGlyph(px, py, color, label) {
  ctx.fillStyle = color;
  ctx.fillRect(px + 8, py + 8, 16, 16);
  ctx.fillStyle = "#101514";
  ctx.font = "700 12px ui-sans-serif, system-ui";
  ctx.fillText(label, px + 12, py + 21);
}

function renderUI() {
  state.uiDirty = false;
  renderHomeHub();
  renderRadialMenu();
  profileLine.textContent = `${state.profile.credits} credits | ${Object.keys(state.profile.completed).length} ops complete`;
  const editorMode = state.activeTab === "editor";
  missionTitle.textContent = editorMode
    ? "Mission editor | synced"
    : state.mission
      ? `${state.mission.title} | ${state.running ? "live" : "paused"} | ${formatTime(state.missionTime)}`
      : "Select an operation";
  goBtn.textContent = state.running ? "Live" : "Go";
  pauseBtn.textContent = state.running ? "Pause" : "Paused";
  goBtn.disabled = editorMode || !state.mission || Boolean(state.outcome);
  pauseBtn.disabled = editorMode || !state.mission || Boolean(state.outcome);
  restartBtn.disabled = editorMode || !state.mission;
  canvas.classList.toggle("pan-cursor", state.selectedTool === "pan");
  canvas.classList.toggle("dragging-map", Boolean(state.camera.drag));
  hintLine.textContent =
    state.activeTab === "editor"
      ? "Editor: choose a tile/object on the left and paint on the canvas."
      : state.pendingPlanAction
        ? `Planning ${planActionDefs[state.pendingPlanAction.actionType].label}: click a map target, or right click to cancel.`
      : state.selectedTool === "pan"
        ? "Move Map: drag the map to look around. Use wheel or +/- to zoom, and C to snap back to the selected operator."
      : "Left click orders. Hold Q for radial tactics at the cursor. Mouse wheel/WASD move the view; C returns to the squad.";

  if (state.activeTab === "campaign") renderCampaignPanel();
  if (state.activeTab === "armory") renderArmoryPanel();
  if (state.activeTab === "addons") renderAddonsPanel();
  if (state.activeTab === "editor") renderEditorPanel();
  renderRightPanel();
}

function renderHomeHub() {
  if (!homeHub) return;
  const show = state.screen === "home";
  homeHub.classList.toggle("hidden", !show);
  document.body.classList.toggle("home-active", show);
  if (!show) return;
  const missions = availableMissions();
  const unlocked = missions.filter((mission) => isMissionUnlocked(mission));
  const lastById = missions.find((mission) => mission.id === state.profile.lastMissionId);
  const last = (lastById && isMissionUnlocked(lastById)) ? lastById : unlocked[0];
  const completed = completionCount(state.profile);
  const stars = totalStars(state.profile);
  const locked = missions.length - unlocked.length;
  const best = last ? bestGradeForMission(state.profile, last.id) || "none" : "none";
  homeHub.innerHTML = `
    <div class="home-backdrop">
      <img class="home-keyart" src="./assets/home-keyart.png?v=${ASSET_VERSION}" alt="" />
    </div>
    <div class="home-topline">
      <img class="home-logo" src="./assets/logo.png?v=${ASSET_VERSION}" alt="" />
      <span>Breachline Pixel</span>
      <em>${completed} ops complete | ${stars} stars | ${state.profile.credits} credits${locked > 0 ? ` | ${locked} locked` : ""}</em>
    </div>
    <div class="home-main">
      <div class="home-title">
        <span>TACTICAL COMMAND</span>
        <img class="home-lockup" src="./assets/logo-lockup.png?v=${ASSET_VERSION}" alt="Breachline Pixel" />
        <p>Plan, breach, adapt, and clear original pixel-art operations with persistent local progress.</p>
      </div>
      <div class="home-actions">
        <button class="home-primary" data-home-action="continue">Continue ${last ? esc(last.title) : "Operation"}</button>
        <button data-home-action="play">Play First Operation</button>
        <button data-home-action="ops">Operations</button>
        <button data-home-action="armory">Armory</button>
        <button data-home-action="addons">Add-ons</button>
        <button data-home-action="editor">Editor</button>
        <button data-home-action="settings">Settings: SFX ${state.profile.settings.sfx ? "On" : "Off"}</button>
      </div>
      <div class="home-panel">
        <h3>${last ? esc(last.title) : "No Operation"}</h3>
        <p>${last ? esc(last.brief || last.objectiveText || "") : "Pick an operation to begin."}</p>
        <div class="home-stats">
          <span>${last ? `Difficulty ${last.difficulty || 1}` : "Difficulty -"}</span>
          <span>${last && last.levels > 1 ? `${last.levels} levels` : "single level"}</span>
          <span>best ${esc(best)}</span>
        </div>
      </div>
    </div>
  `;
  homeHub.querySelectorAll("[data-home-action]").forEach((button) => {
    button.addEventListener("click", () => handleHomeAction(button.dataset.homeAction));
  });
}

function handleHomeAction(action) {
  const missions = availableMissions();
  const unlocked = missions.filter((mission) => isMissionUnlocked(mission));
  const lastById = missions.find((mission) => mission.id === state.profile.lastMissionId);
  const last = (lastById && isMissionUnlocked(lastById)) ? lastById : unlocked[0];
  if (action === "continue" && last) {
    startMission(last);
    return;
  }
  if (action === "play" && unlocked[0]) {
    startMission(unlocked[0]);
    return;
  }
  if (action === "ops" || action === "armory" || action === "addons" || action === "editor") {
    const tab = action === "ops" ? "campaign" : action;
    state.screen = "game";
    setTab(tab);
    markUiDirty();
    return;
  }
  if (action === "settings") {
    state.profile.settings.sfx = !state.profile.settings.sfx;
    saveProfile();
    markUiDirty();
  }
}

function renderRadialMenu() {
  if (!radialMenu) return;
  if (!state.radial.open || state.screen === "home") {
    radialMenu.hidden = true;
    radialMenu.innerHTML = "";
    return;
  }
  radialMenu.hidden = false;
  radialMenu.style.left = `${Math.round(state.radial.x)}px`;
  radialMenu.style.top = `${Math.round(state.radial.y)}px`;
  const radius = 168;
  radialMenu.innerHTML = `
    <button class="radial-center" type="button" aria-label="Radial command anchor">${iconMarkup("radial_center", "radial-center-icon")}<span>Q</span></button>
    ${radialActionOrder
      .map((id, index) => {
        const def = radialActionDefs[id];
        const angle = -Math.PI / 2 + (Math.PI * 2 * index) / radialActionOrder.length;
        const x = Math.round(Math.cos(angle) * radius);
        const y = Math.round(Math.sin(angle) * radius);
        return `<button class="radial-item" style="--rx:${x}px;--ry:${y}px" data-radial-action="${id}" title="${esc(def.label)}">
          ${iconMarkup(def.icon, "radial-icon")}
          <span>${esc(def.short || def.label)}</span>
        </button>`;
      })
      .join("")}
  `;
  radialMenu.querySelectorAll("[data-radial-action]").forEach((button) => {
    button.addEventListener("click", () => executeRadialAction(button.dataset.radialAction));
  });
}

function clientPointFromWorld(point) {
  const rect = canvas.getBoundingClientRect();
  const canvasX = VIEW_W / 2 + (point.x - state.camera.x) * state.camera.zoom;
  const canvasY = VIEW_H / 2 + (point.y - state.camera.y) * state.camera.zoom;
  return {
    x: rect.left + (canvasX / VIEW_W) * rect.width,
    y: rect.top + (canvasY / VIEW_H) * rect.height,
  };
}

function selectedWaypointPoint() {
  if (!state.selectedWaypoint) return null;
  const op = operatorById(state.selectedWaypoint.opId);
  if (!op || !op.path.length) return null;
  const node = op.path[clamp(state.selectedWaypoint.index, 0, op.path.length - 1)];
  return node ? { x: node.x, y: node.y } : null;
}

function openRadialMenu() {
  if (!state.mission || state.activeTab === "editor" || state.screen === "home") return;
  const world = { x: state.lastPointer.x, y: state.lastPointer.y };
  const client = { x: state.lastPointer.screenX, y: state.lastPointer.screenY };
  state.radial.open = true;
  const fallbackRect = canvas.getBoundingClientRect();
  const fallbackX = fallbackRect.left + fallbackRect.width / 2;
  const fallbackY = fallbackRect.top + fallbackRect.height / 2;
  state.radial.x = clamp(client.x || fallbackX, 190, Math.max(190, window.innerWidth - 190));
  state.radial.y = clamp(client.y || fallbackY, 190, Math.max(190, window.innerHeight - 190));
  state.radial.worldX = world.x;
  state.radial.worldY = world.y;
  state.radial.selected = null;
  state.radial.source = "cursor";
  markUiDirty();
}

function closeRadialMenu() {
  if (!state.radial.open) return;
  state.radial.open = false;
  markUiDirty();
}

function executeRadialAction(action) {
  if (action === "cancel") {
    state.radial.selected = "cancel";
    closeRadialMenu();
    return;
  }
  const op = selectedOperator();
  if (!op) {
    closeRadialMenu();
    return;
  }
  const x = state.radial.worldX;
  const y = state.radial.worldY;
  state.radial.selected = action;
  if (action === "regroup_cover") {
    applyManeuver("regroup_cover");
  } else if (action === "waypoint") {
    const group = selectedOperators();
    if (group.length > 1) addGroupWaypoints(group, x, y, "Fireteam");
    else addWaypoint(op, x, y);
  } else if (action === "stack") {
    const group = selectedOperators();
    stackSquadAt(x, y, group.length > 1 ? group : livingOperators(), group.length > 1 ? "Fireteam" : "Squad");
  } else if (action === "clear_room") {
    if (state.selectedWaypoint) queuePlanAction("clear_room", op);
    else executeClearRoom(op);
  } else if (planActionDefs[action] && state.selectedWaypoint) {
    const def = planActionDefs[action];
    queuePlanAction(action, op, def.targeted ? { x, y } : null);
  } else if (action === "focus") {
    const group = selectedOperators();
    if (group.length > 1) {
      for (const unit of group) executeOperatorAction(unit, "focus", x, y, { queued: false });
    } else {
      executeOperatorAction(op, "focus", x, y, { queued: false });
    }
  } else {
    executeOperatorAction(op, action, x, y, { queued: false });
  }
  closeRadialMenu();
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

function renderCampaignPanel() {
  const missions = availableMissions();
  const stars = totalStars(state.profile);
  leftContent.innerHTML = `
    <div class="stack">
      <div class="row between">
        <h2>Operations</h2>
        <span class="pill">${stars} stars | ${missions.length} missions</span>
      </div>
      ${missions
        .map((mission) => {
          const grade = bestGradeForMission(state.profile, mission.id);
          const missionStars = completionStars(state.profile, mission.id);
          const lock = missionUnlockStatus(mission, state.profile);
          const lockedClass = lock.unlocked ? "" : "locked";
          const activeClass = state.mission && state.mission.id === mission.id ? "active" : "";
          const thumbKey = missionThumbnailKey(mission);
          return `
            <button class="mission-btn ${activeClass} ${lockedClass}" data-mission="${esc(mission.id)}" ${lock.unlocked ? "" : 'aria-disabled="true"'}>
              ${assetImageMarkup(thumbKey, "mission-thumb", mission.title)}
              ${lock.unlocked ? "" : `
                <span class="mission-lock-stamp" aria-hidden="true">
                  ${iconMarkup("shield", "mission-lock-icon")}
                  <em>CLASSIFIED</em>
                </span>
                <span class="mission-lock-hatch" aria-hidden="true"></span>
                <span class="mission-lock-badge" aria-hidden="true">DIFF ${mission.difficulty || 1}</span>
              `}
              <strong>${esc(mission.title)}</strong>
              <span class="mission-progress">
                <em>Diff ${mission.difficulty || 1}</em>
                <em>${mission.levels && mission.levels > 1 ? `${mission.levels} floors` : "single floor"}</em>
                ${mission.night ? "<em>night</em>" : ""}
                <em>${grade ? `best ${grade}` : "unscored"}</em>
                <em>${"*".repeat(missionStars)}${missionStars ? "" : "no stars"}</em>
              </span>
              ${mission.tags && mission.tags.length ? `<span class="mission-tags">${mission.tags.map((tag) => `<em>${esc(tag)}</em>`).join("")}</span>` : ""}
              <p>${esc(mission.brief || mission.objectiveText || "")}</p>
              ${lock.unlocked ? "" : `<span class="mission-lock-req">${iconMarkup("shield", "mission-lock-icon")} ${esc(lock.reason)}</span>`}
            </button>
          `;
        })
        .join("")}
      <div class="divider"></div>
      <button id="generatedBtn">Generate Blueprint Op</button>
      <button id="exportProfileBtn">Export Save</button>
    </div>
  `;
  leftContent.querySelectorAll("[data-mission]").forEach((button) => {
    button.addEventListener("click", () => {
      const mission = availableMissions().find((item) => item.id === button.dataset.mission);
      if (!mission) return;
      const status = missionUnlockStatus(mission, state.profile);
      if (!status.unlocked) {
        addLog(`${mission.title} is locked: ${status.reason}.`);
        markUiDirty();
        return;
      }
      startMission(mission);
    });
  });
  document.getElementById("generatedBtn").addEventListener("click", () => {
    const seed = window.prompt("Seed for blueprint mission:", String(Date.now()).slice(-6));
    if (!seed) return;
    startMission(missionProcedural(seed));
  });
  document.getElementById("exportProfileBtn").addEventListener("click", () => {
    downloadText("breachline-save.json", JSON.stringify(state.profile, null, 2));
  });
}

function renderArmoryPanel() {
  const classes = ["all", ...new Set(weaponOrder.map((id) => weaponDefs[id].class))];
  const nextUnlock = nextWeaponUnlock(state.profile);
  leftContent.innerHTML = `
    <div class="stack">
      <div class="row between">
        <h2>Armory</h2>
        <span class="pill">${state.profile.credits} credits | ${totalStars(state.profile)} stars</span>
      </div>
      ${nextUnlock ? `<p class="armory-next">Next unlock: ${esc(weaponDefs[nextUnlock.id].label)} requires ${esc(nextUnlock.status.reason)}.</p>` : `<p class="armory-next">All listed weapons are unlocked.</p>`}
      <div class="class-filters">
        ${classes
          .map(
            (className) =>
              `<button class="filter-btn ${state.armoryFilter === className ? "active" : ""}" data-armory-filter="${className}">${esc(
                className === "all" ? "All" : className,
              )}</button>`,
          )
          .join("")}
      </div>
      ${operatorTemplates
        .map((unit) => {
          const armory = state.profile.armory[unit.id];
          const current = weaponFor(armory.gear, unit.gear);
          const entries = compatibleWeaponEntries(unit).filter(([, weapon]) => state.armoryFilter === "all" || weapon.class === state.armoryFilter);
          return `
            <div class="gear-row">
              <div class="row between">
                <span class="op-heading">${portraitMarkup(unit.id, "mini", unit.name)}<strong>${unit.name} | ${unit.role}</strong></span>
                <span>${esc(current.label)} | XP ${armory.xp} | Wounds ${armory.wounds}</span>
              </div>
              <div class="weapon-grid">
                ${
                  entries.length
                    ? entries.map(([id, weapon]) => renderWeaponCard(unit, id, weapon, normalizeWeaponId(armory.gear, unit.gear) === id)).join("")
                    : `<p>No compatible ${esc(state.armoryFilter)} weapons for ${esc(unit.role)}.</p>`
                }
              </div>
            </div>
          `;
        })
        .join("")}
      <button id="healRosterBtn">Spend 25 credits to clear wounds</button>
    </div>
  `;
  leftContent.querySelectorAll("[data-armory-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.armoryFilter = button.dataset.armoryFilter;
      markUiDirty();
    });
  });
  leftContent.querySelectorAll("[data-weapon-unit]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = normalizeWeaponId(button.dataset.weaponId);
      const status = weaponUnlockStatus(id, state.profile);
      if (!status.unlocked) {
        if (!status.purchasable) {
          addLog(`${weaponDefs[id].label} locked: needs ${status.reason}.`);
          markUiDirty();
          return;
        }
        state.profile.credits -= status.credits;
        state.profile.unlockedWeapons[id] = true;
        addLog(`Unlocked ${weaponDefs[id].label}.`);
      }
      state.profile.armory[button.dataset.weaponUnit].gear = id;
      saveProfile();
      if (state.mission) addLog("Armory changes apply next deployment.");
      markUiDirty();
    });
  });
  document.getElementById("healRosterBtn").addEventListener("click", () => {
    if (state.profile.credits < 25) return;
    state.profile.credits -= 25;
    for (const key of Object.keys(state.profile.armory)) state.profile.armory[key].wounds = 0;
    saveProfile();
    markUiDirty();
  });
}

function renderWeaponCard(unit, id, weapon, active) {
  const status = weaponUnlockStatus(id, state.profile);
  return `
    <button class="weapon-card ${active ? "active" : ""} ${status.unlocked ? "" : "locked"} ${status.purchasable ? "purchasable" : ""}" data-weapon-unit="${unit.id}" data-weapon-id="${id}">
      ${assetImageMarkup(weaponIconKey(id), "weapon-icon", weapon.label)}
      <span class="weapon-title">${esc(weapon.label)}</span>
      <span class="weapon-meta">${esc(weapon.class)} | reload ${weapon.reloadTime.toFixed(1)}s${status.unlocked ? "" : ` | ${status.purchasable ? `buy ${status.credits}c` : `locked ${status.reason}`}`}</span>
      ${renderWeaponStat("Damage", weapon.damage, 50)}
      ${renderWeaponStat("Range", weapon.range, 380)}
      ${renderWeaponStat("Rate", weapon.fireRate, 900)}
      ${renderWeaponStat("Pen", weapon.penetration, 8)}
      ${renderWeaponStat("Supp", weapon.suppression, 42)}
      ${renderWeaponStat("Handle", weapon.handling, 110)}
    </button>
  `;
}

function renderWeaponStat(label, value, max) {
  return `
    <span class="stat-row">
      <span>${esc(label)}</span>
      <span class="stat-bar"><span style="width:${weaponStatPct(value, max)}%"></span></span>
    </span>
  `;
}

function renderAddonsPanel() {
  leftContent.innerHTML = `
    <div class="stack">
      <h2>Add-ons</h2>
      ${builtinAddons
        .map(
          (addon) => `
        <label class="addon-row">
          <input type="checkbox" data-addon="${addon.id}" ${state.profile.addons[addon.id] ? "checked" : ""} />
          <strong>${esc(addon.title)}</strong>
          <p>${esc(addon.summary)}</p>
        </label>
      `,
        )
        .join("")}
      <div class="divider"></div>
      <button id="importAddonBtn">Import Mission JSON</button>
      <button id="loadSampleAddonBtn">Load Sample Add-on</button>
      <button id="clearCustomBtn" class="danger">Clear Custom Missions</button>
      <img class="asset-thumb" src="./assets/ai-generated-pixel-asset-sheet.png?v=${ASSET_VERSION}" alt="Generated pixel asset sheet" />
    </div>
  `;
  leftContent.querySelectorAll("[data-addon]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      state.profile.addons[checkbox.dataset.addon] = checkbox.checked;
      saveProfile();
      markUiDirty();
    });
  });
  document.getElementById("importAddonBtn").addEventListener("click", () => addonFile.click());
  document.getElementById("loadSampleAddonBtn").addEventListener("click", async () => {
    const response = await fetch("./addons/sample-custom-mission.json");
    const json = await response.json();
    importMissionJson(json);
  });
  document.getElementById("clearCustomBtn").addEventListener("click", () => {
    if (!window.confirm("Clear locally saved custom missions?")) return;
    state.profile.customMissions = [];
    saveProfile();
    markUiDirty();
  });
}

function renderEditorPanel() {
  const report = editorValidationReport();
  const palette = [
    ["floor", "Floor", "."],
    ["wall", "Wall", "#"],
    ["door", "Door", "D"],
    ["window", "Window", "W"],
    ["crate", "Crate", "B"],
    ["stairs", "Stairs", "A"],
    ["start", "Start", "S"],
    ["hostile", "Hostile", "E"],
    ["civilian", "Civilian", "C"],
    ["objective", "Objective", "O"],
    ["extract", "Extract", "X"],
  ];
  leftContent.innerHTML = `
    <div class="stack">
      <div class="row between">
        <h2>Mission Editor</h2>
        <span class="pill ${report.ok ? "good" : "warn"}">${report.ok ? "ready" : `${report.warnings.length} checks`}</span>
      </div>
      <div class="editor-fields">
        <label><span>Operation name</span><input id="editorName" type="text" value="${esc(state.editor.name)}" /></label>
        <label><span>Briefing</span><input id="editorBrief" type="text" value="${esc(state.editor.brief)}" /></label>
        <label><span>Objective</span><input id="editorObjective" type="text" value="${esc(state.editor.objectiveText)}" /></label>
        <div class="grid2">
          <label><span>Difficulty</span><select id="editorDifficulty">
            ${[1, 2, 3, 4, 5].map((value) => `<option value="${value}" ${Number(state.editor.difficulty) === value ? "selected" : ""}>${value}</option>`).join("")}
          </select></label>
          <label><span>Levels</span><select id="editorLevels">
            ${[1, 2, 3].map((value) => `<option value="${value}" ${Number(state.editor.levels) === value ? "selected" : ""}>${value}</option>`).join("")}
          </select></label>
        </div>
        <label><span>Tags</span><input id="editorTags" type="text" value="${esc(state.editor.tagsText)}" /></label>
        <label><span>Scenario</span><textarea id="editorScenario" class="small-textarea" spellcheck="false">${esc(state.editor.scenario)}</textarea></label>
        <label class="check-row"><input id="editorNight" type="checkbox" ${state.editor.night ? "checked" : ""} /> Night operation</label>
      </div>
      <div class="palette">
        ${palette
          .map(
            ([id, label]) =>
              `<button class="palette-btn ${state.editor.palette === id ? "active" : ""}" data-palette="${id}" title="${esc(label)}">${label}</button>`,
          )
          .join("")}
      </div>
      <div class="grid2">
        <button id="newEditorBtn">New</button>
        <button id="loadCurrentEditorBtn" ${state.mission ? "" : "disabled"}>Load Current</button>
        <button id="repairEditorBtn">Repair Layout</button>
        <button id="validateEditorBtn">Validate</button>
        <button id="saveEditorBtn" class="primary">Save Mission</button>
        <button id="testEditorBtn">Test</button>
      </div>
      <div class="grid2">
        <button id="exportEditorBtn">Export JSON</button>
        <button id="importEditorTextBtn">Import Text</button>
      </div>
      <textarea id="editorExport" spellcheck="false">${esc(state.editor.exportText)}</textarea>
      <div class="objective-row">
        <strong>Sync</strong>
        <p>${report.rooms.length} inferred rooms | ${report.counts.starts} starts | ${report.counts.hostiles} contacts | ${report.counts.objectives} obj | ${report.counts.extraction} exits</p>
      </div>
      <p>${esc(state.editor.message)}</p>
    </div>
  `;
  document.getElementById("editorName").addEventListener("input", (event) => {
    state.editor.name = event.target.value;
    state.editor.exportText = "";
  });
  document.getElementById("editorBrief").addEventListener("input", (event) => {
    state.editor.brief = event.target.value;
    state.editor.exportText = "";
  });
  document.getElementById("editorObjective").addEventListener("input", (event) => {
    state.editor.objectiveText = event.target.value;
    state.editor.exportText = "";
  });
  document.getElementById("editorTags").addEventListener("input", (event) => {
    state.editor.tagsText = event.target.value;
    state.editor.exportText = "";
  });
  document.getElementById("editorScenario").addEventListener("input", (event) => {
    state.editor.scenario = event.target.value;
    state.editor.exportText = "";
  });
  document.getElementById("editorDifficulty").addEventListener("change", (event) => {
    state.editor.difficulty = Number(event.target.value);
    state.editor.exportText = "";
    markUiDirty();
  });
  document.getElementById("editorLevels").addEventListener("change", (event) => {
    state.editor.levels = Number(event.target.value);
    state.editor.exportText = "";
    markUiDirty();
  });
  document.getElementById("editorNight").addEventListener("change", (event) => {
    state.editor.night = event.target.checked;
    state.editor.exportText = "";
    markUiDirty();
  });
  leftContent.querySelectorAll("[data-palette]").forEach((button) => {
    button.addEventListener("click", () => {
      state.editor.palette = button.dataset.palette;
      markUiDirty();
    });
  });
  document.getElementById("newEditorBtn").addEventListener("click", () => {
    state.editor = makeEditorState();
    markUiDirty();
  });
  document.getElementById("loadCurrentEditorBtn").addEventListener("click", () => {
    if (!state.mission) return;
    loadMissionIntoEditor(state.mission);
    markUiDirty();
  });
  document.getElementById("repairEditorBtn").addEventListener("click", () => {
    try {
      repairEditorLayout();
    } catch (error) {
      state.editor.message = error.message;
    }
    markUiDirty();
  });
  document.getElementById("validateEditorBtn").addEventListener("click", () => {
    const latest = editorValidationReport();
    state.editor.message = latest.ok ? "Mission validates cleanly." : latest.warnings.join(" ");
    markUiDirty();
  });
  document.getElementById("saveEditorBtn").addEventListener("click", () => saveEditorMission(false));
  document.getElementById("testEditorBtn").addEventListener("click", () => saveEditorMission(true));
  document.getElementById("exportEditorBtn").addEventListener("click", () => {
    state.editor.exportText = JSON.stringify({ type: "breachline-pixel-mission", version: 1, mission: buildEditorMission() }, null, 2);
    markUiDirty();
  });
  document.getElementById("importEditorTextBtn").addEventListener("click", () => {
    try {
      const text = document.getElementById("editorExport").value;
      const mission = normalizeImportedMission(JSON.parse(text));
      loadMissionIntoEditor(mission);
      state.editor.exportText = text;
      state.editor.message = "Imported text into editor.";
    } catch (error) {
      state.editor.message = error.message;
    }
    markUiDirty();
  });
}

function renderRightPanel() {
  if (state.activeTab === "editor") {
    renderEditorInspector();
    return;
  }
  if (!state.mission) {
    rightContent.innerHTML = `
      <div class="stack">
        <h2>Command Surface</h2>
        <p>Pick an operation, draw paths while paused, then execute. Progress, add-ons, custom missions, armory choices, and editor work save locally.</p>
        <div class="objective-row">
          <strong>Controls</strong>
          <p>1-4 select operators. Shift+1-4 adds to fireteam. 0 selects all. V enables box select. G starts. Space pauses.</p>
        </div>
      </div>
    `;
    return;
  }
  const op = selectedOperator();
  const group = selectedOperators();
  const groupSuffix = group.length > 1 ? ` ${group.length}` : "";
  rightContent.innerHTML = `
    <div class="stack">
      <div class="row between">
        <h2>${esc(state.mission.title)}</h2>
        <span class="pill ${state.running ? "good" : "warn"}">${state.running ? "live" : "paused"}</span>
      </div>
      <p>${esc(state.mission.objectiveText || "")}</p>
      ${renderMissionIntel()}
      <div class="tools">
        ${sideToolOrder.map((id) => toolButton(id, commandLabel(id, op, group))).join("")}
        <button id="clearPathBtn" title="Cancels the selected operator's planned route — they hold their current position.">Cancel Orders</button>
        <button id="haltAllBtn" title="Stops every operator and clears all planned routes.">Halt All</button>
      </div>
      ${renderGroupSelectionPanel(group)}
      ${renderManeuverPanel()}
      ${op ? renderSelectedOperator(op) : ""}
      ${renderMapControls()}
      ${op ? renderPlanActionPanel(op) : ""}
      <div class="divider"></div>
      <h2>Squad</h2>
      ${state.operators.map(renderUnitRow).join("")}
      <div class="divider"></div>
      <h2>Status</h2>
      ${renderStatusRows()}
      <div class="divider"></div>
      <h2>Log</h2>
      <div class="log">${state.log.map((entry) => `<div class="log-row">${formatTime(entry.t)} ${esc(entry.text)}</div>`).join("")}</div>
    </div>
  `;
  rightContent.querySelectorAll("[data-tool]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedTool = button.dataset.tool;
      markUiDirty();
    });
  });
  rightContent.querySelectorAll("[data-select-unit]").forEach((button) => {
    button.addEventListener("click", () => {
      setSelectedOperator(button.dataset.selectUnit);
    });
  });
  rightContent.querySelectorAll("[data-toggle-unit]").forEach((button) => {
    button.addEventListener("click", () => {
      toggleOperatorInGroup(button.dataset.toggleUnit);
    });
  });
  rightContent.querySelectorAll("[data-group-select]").forEach((button) => {
    button.addEventListener("click", () => {
      selectGroupPreset(button.dataset.groupSelect);
    });
  });
  rightContent.querySelectorAll("[data-group-action]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.groupAction === "halt") haltSelectedOperators();
      if (button.dataset.groupAction === "clear") clearSelectedPaths();
    });
  });
  rightContent.querySelectorAll("[data-maneuver]").forEach((button) => {
    button.addEventListener("click", () => {
      applyManeuver(button.dataset.maneuver);
    });
  });
  rightContent.querySelectorAll("[data-plan-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const selected = selectedOperator();
      if (!selected) return;
      queuePlanAction(button.dataset.planAction, selected);
    });
  });
  rightContent.querySelectorAll("[data-camera]").forEach((button) => {
    button.addEventListener("click", () => handleCameraButton(button.dataset.camera));
  });
  const clearPathBtn = document.getElementById("clearPathBtn");
  if (clearPathBtn) clearPathBtn.addEventListener("click", () => {
    clearSelectedPaths();
  });
  const haltAllBtn = document.getElementById("haltAllBtn");
  if (haltAllBtn) haltAllBtn.addEventListener("click", haltAllOperators);
}

function renderEditorInspector() {
  const report = editorValidationReport();
  const counts = report.counts;
  const layout = report.layout;
  const customs = state.profile.customMissions || [];
  rightContent.innerHTML = `
    <div class="stack">
      <div class="row between">
        <h2>Editor Sync</h2>
        <span class="pill ${report.ok ? "good" : "warn"}">${report.ok ? "clean" : "review"}</span>
      </div>
      <p>Editor missions use the same repair, audit, metadata, fog, AI, window breach, stairs, and save pipeline as campaign operations.</p>
      <div class="objective-row">
        <strong>Architecture</strong>
        <p>${layout ? `${layout.rooms} rooms | ${layout.doors} doors | ${layout.unreachable} unreachable | ${layout.warnings} warnings` : "Not validated"}</p>
      </div>
      <div class="objective-row">
        <strong>Mission Pieces</strong>
        <p>${counts.starts} starts | ${counts.hostiles} hostiles | ${counts.objectives} objectives | ${counts.civilians} civilians | ${counts.extraction} exits</p>
      </div>
      <div class="objective-row">
        <strong>Connectors</strong>
        <p>${counts.doors} doors | ${counts.windows} windows | ${counts.stairs} stairs | ${counts.cover} cover</p>
      </div>
      <div class="objective-row">
        <strong>Inferred Rooms</strong>
        <p>${report.rooms.length ? report.rooms.map((item) => esc(item.label)).join(" | ") : "Paint enclosed spaces to create room intel."}</p>
      </div>
      <div class="divider"></div>
      <h2>Audit</h2>
      <div class="log">
        ${report.warnings.length ? report.warnings.map((warning) => `<div class="log-row">${esc(warning)}</div>`).join("") : `<div class="log-row">Mission validates cleanly.</div>`}
      </div>
      <div class="divider"></div>
      <h2>Saved Customs</h2>
      ${customs.length ? `<div class="log">${customs
        .map(
          (mission) => `
            <div class="log-row" style="display:flex;justify-content:space-between;gap:6px;align-items:center;">
              <span>${esc(mission.title)}</span>
              <span style="display:flex;gap:4px;">
                <button data-custom-load="${esc(mission.id)}">Load</button>
                <button data-custom-play="${esc(mission.id)}">Play</button>
                <button data-custom-delete="${esc(mission.id)}">×</button>
              </span>
            </div>`,
        )
        .join("")}</div>` : `<p>No custom missions saved yet. Save from the editor panel.</p>`}
    </div>
  `;
  rightContent.querySelectorAll("[data-custom-load]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.customLoad;
      const mission = (state.profile.customMissions || []).find((item) => item.id === id);
      if (!mission) return;
      loadMissionIntoEditor(mission);
      markUiDirty();
    });
  });
  rightContent.querySelectorAll("[data-custom-play]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.customPlay;
      const mission = (state.profile.customMissions || []).find((item) => item.id === id);
      if (!mission) return;
      state.activeTab = "campaign";
      startMission(mission);
    });
  });
  rightContent.querySelectorAll("[data-custom-delete]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.customDelete;
      state.profile.customMissions = (state.profile.customMissions || []).filter((item) => item.id !== id);
      saveProfile();
      state.editor.message = "Removed custom mission.";
      markUiDirty();
    });
  });
}

function renderMissionIntel() {
  const tags = state.mission.tags || [];
  const roomCount = state.rooms ? state.rooms.length : 0;
  const levels = state.floors ? state.floors.levels : (state.mission.levels || 1);
  const focused = selectedOperator();
  const activeFloor = levels > 1 && focused ? `<span>Floor ${focused.level || 1}/${levels}</span>` : (levels > 1 ? `<span>${levels} levels</span>` : "");
  return `
    <div class="intel-strip">
      <span>${roomCount} rooms</span>
      ${activeFloor}
      <span>${state.enemies.length} contacts</span>
      <span>${state.objectives.length || 0} obj</span>
      ${tags.map((tag) => `<span>${esc(tag)}</span>`).join("")}
    </div>
  `;
}

function renderGroupSelectionPanel(group) {
  const ops = group && group.length ? group : selectedOperators();
  const summary = ops.map((op) => op.name).join(" + ");
  return `
    <div class="group-panel">
      <div class="row between">
        <h2>Fireteam</h2>
        <span class="pill ${ops.length > 1 ? "good" : "warn"}">${ops.length} selected</span>
      </div>
      <div class="group-chips">
        <button data-group-select="all">All</button>
        <button data-group-select="alpha">Alpha</button>
        <button data-group-select="bravo">Bravo</button>
        <button data-group-select="leader">Leader</button>
        <button data-group-action="halt">Halt Group</button>
        <button data-group-action="clear">Clear Group</button>
      </div>
      <div class="group-strip">
        ${state.operators
          .map((op) => {
            const selected = isOperatorSelected(op);
            return `<button class="group-op ${selected ? "active" : ""} ${op.id === state.selectedId ? "leader" : ""}" data-toggle-unit="${op.id}">
              ${portraitMarkup(op.id, "mini", op.name)}
              <span>${esc(op.name)}</span>
            </button>`;
          })
          .join("")}
      </div>
      <div class="plan-summary">${esc(summary || "No operators selected.")}</div>
    </div>
  `;
}

function iconMarkup(icon, className = "asset-icon") {
  // Prefer a real <img> when a standalone PNG exists so transparent crop edges don't get
  // swallowed by a parent dark background (same fix we made for portraits).
  if (imageAssetSources[icon]) {
    const size = className.indexOf("radial-center") >= 0 ? 36 : className.indexOf("radial-icon") >= 0 ? 26 : className.indexOf("tool-icon") >= 0 ? 22 : 32;
    return `<img class="${className} ui-sheet-icon" width="${size}" height="${size}" alt="" src="${imageAssetSources[icon]}?v=${ASSET_VERSION}" />`;
  }
  if (uiSprites[icon]) {
    const size = className.indexOf("radial-center") >= 0 ? 36 : className.indexOf("radial-icon") >= 0 ? 26 : className.indexOf("tool-icon") >= 0 ? 22 : 32;
    return `<span class="${className} ui-sheet-icon" style="${uiSpriteStyle(icon, size, size)}"></span>`;
  }
  return `<span class="atlas-icon ${className}" style="${atlasIconStyle(icon)}"></span>`;
}

function assetIcon(id) {
  return iconMarkup(id, "asset-icon");
}

function renderManeuverPanel() {
  const advice = maneuverContext();
  const active = state.activeManeuvers.map((item) => maneuverDefs[item.id] ? maneuverDefs[item.id].label : item.id).join(" + ");
  return `
    <div class="maneuver-panel">
      <div class="row between">
        <h2>Tactics</h2>
        <span class="pill good">${esc(maneuverDefs[advice.recommended].label)}</span>
      </div>
      <p>${esc(advice.reason)}</p>
      <div class="maneuver-grid">
        ${maneuverOrder
          .map((id) => {
            const def = maneuverDefs[id];
            return `<button class="maneuver-btn ${id === advice.recommended ? "recommended" : ""}" data-maneuver="${id}">
              ${assetIcon(def.icon)}
              <span><strong>${esc(def.label)}</strong><em>${esc(def.summary)}</em></span>
            </button>`;
          })
          .join("")}
      </div>
      <div class="plan-summary">${esc(active ? `Active: ${active}` : "Adaptive maneuvers monitor contact, suppression, smoke, rescue state, and stairwell control while running.")}</div>
    </div>
  `;
}

function renderMapControls() {
  return `
    <div class="map-panel">
      <div class="row between">
        <h2>Map</h2>
        <span class="pill ${state.camera.follow ? "good" : "warn"}">${state.camera.follow ? "follow" : "free"}</span>
      </div>
      <div class="map-controls">
        <button data-camera="up">Up</button>
        <button data-camera="left">Left</button>
        <button data-camera="center">Center</button>
        <button data-camera="right">Right</button>
        <button data-camera="down">Down</button>
        <button data-camera="zoom-out">-</button>
        <button data-camera="zoom-in">+</button>
      </div>
    </div>
  `;
}

function commandLabel(id, op, group) {
  const def = commandDefs[id] || { label: id };
  const count = group && group.length > 1 ? group.length : 0;
  if (id === "waypoint" && count) return `Move ${count}`;
  if (id === "focus" && count) return `Focus ${count}`;
  if (def.inventory && op) return `${def.label} ${op[def.inventory]}`;
  return def.label;
}

function handleCameraButton(action) {
  const step = cameraStep();
  if (action === "up") panCamera(0, -step);
  if (action === "down") panCamera(0, step);
  if (action === "left") panCamera(-step, 0);
  if (action === "right") panCamera(step, 0);
  if (action === "center") recenterCamera();
  if (action === "zoom-in") zoomCamera(0.16);
  if (action === "zoom-out") zoomCamera(-0.16);
}

function toolButton(id, label, sprite) {
  const icon = sprite || (commandDefs[id] && commandDefs[id].icon) || "radio_icon";
  const title = id === "pan" ? "Move the camera: drag the canvas, use wheel to zoom, C to follow the squad." : label;
  return `<button class="tool-btn ${state.selectedTool === id ? "active" : ""}" data-tool="${id}" title="${esc(title)}">
    ${iconMarkup(icon, "tool-icon")}
    <span>${esc(label)}</span>
  </button>`;
}

function renderSelectedOperator(op) {
  const gear = weaponFor(op.gear);
  const groupCount = selectedOperators().length;
  return `
    <div class="unit-row selected-card">
      ${portraitMarkup(op.id, "", op.name)}
      <div class="unit-copy">
        <strong>${esc(op.name)} | ${esc(op.role)}</strong>
        <span>${esc(gear.label)} | ${op.down ? "Down" : `${Math.round(op.hp)} HP`} | ${groupCount} selected | ${op.path.length} nodes | ${op.kills} neutralized | ${op.focus ? "focus set" : "free aim"}</span>
        <div class="meter"><span class="${op.hp / op.maxHp < 0.35 ? "low" : ""}" style="width:${clamp(op.hp / op.maxHp, 0, 1) * 100}%"></span></div>
        <div class="meter pressure"><span style="width:${clamp(op.suppression / 100, 0, 1) * 100}%"></span></div>
      </div>
    </div>
  `;
}

function renderPlanActionPanel(op) {
  const waypoint = currentPlanWaypoint(op);
  const pending =
    state.pendingPlanAction && state.pendingPlanAction.opId === op.id ? `Click map target for ${planActionDefs[state.pendingPlanAction.actionType].label}` : "";
  const actionSummary =
    waypoint && waypoint.node.actions && waypoint.node.actions.length
      ? waypoint.node.actions
          .map((action) => `${(planActionDefs[action.type] && planActionDefs[action.type].label) || action.type}${action.status === "done" ? " done" : ""}`)
          .join(" -> ")
      : "No actions queued.";
  return `
    <div class="plan-panel">
      <div class="row between">
        <h2>Plan Action</h2>
        <span class="pill">${waypoint ? `WP ${waypoint.index + 1}` : "no waypoint"}</span>
      </div>
      <p>${esc(pending || "Actions execute only when this operator reaches the selected waypoint.")}</p>
      <div class="plan-actions">
        ${planActionOrder
          .map((id) => {
            const def = planActionDefs[id];
            return `<button class="tool-btn plan-btn" data-plan-action="${id}" ${!waypoint ? "disabled" : ""}>
              ${iconMarkup(def.icon, "tool-icon")}
              <span>${esc(def.label)}</span>
            </button>`;
          })
          .join("")}
      </div>
      <div class="plan-summary">${esc(actionSummary)}</div>
    </div>
  `;
}

function renderUnitRow(op) {
  const selected = isOperatorSelected(op);
  const leader = op.id === state.selectedId;
  const showLevel = state.floors && state.floors.levels > 1;
  const levelBadge = showLevel ? ` | L${op.level || 1}` : "";
  return `
    <button class="unit-row ${selected ? "active grouped" : ""} ${leader ? "leader" : ""}" data-select-unit="${op.id}">
      ${portraitMarkup(op.id, "mini", op.name)}
      <span class="unit-copy">
        <strong>${esc(op.name)}${leader ? " | Lead" : ""}${levelBadge}</strong>
        <span>${op.down ? "Down" : `${Math.round(op.hp)} HP`} | ${weaponFor(op.gear).label} | ${op.drones} drone</span>
        <span class="meter"><span class="${op.hp / op.maxHp < 0.35 ? "low" : ""}" style="width:${clamp(op.hp / op.maxHp, 0, 1) * 100}%"></span></span>
      </span>
    </button>
  `;
}

function renderStatusRows() {
  computeVisibility();
  const hostiles = state.enemies.filter((enemy) => !enemy.down && entityVisible(enemy)).length;
  const hiddenHostiles = state.enemies.filter((enemy) => !enemy.down && !entityVisible(enemy)).length;
  const tagged = state.enemies.filter((enemy) => !enemy.down && enemy.tagged > 0).length;
  const objectives = `${state.objectives.filter((obj) => obj.secured).length}/${state.objectives.length || 0}`;
  const civs = `${state.civilians.filter((civ) => (state.extraction ? civ.extracted : civ.rescued)).length}/${state.civilians.length || 0}`;
  const extract = state.extraction
    ? state.operators.some((op) => !op.down && Math.hypot(op.x - state.extraction.x, op.y - state.extraction.y) < 58)
      ? "ready"
      : "needed"
    : "none";
  return `
    <div class="objective-row"><strong>Hostiles</strong><p>${hostiles} visible | ${hiddenHostiles} hidden</p></div>
    <div class="objective-row"><strong>Intel</strong><p>${tagged} tagged | ${state.drones.length} drone active</p></div>
    <div class="objective-row"><strong>Objectives</strong><p>${objectives} secured</p></div>
    <div class="objective-row"><strong>Civilians</strong><p>${civs} safe</p></div>
    <div class="objective-row"><strong>Extraction</strong><p>${extract}</p></div>
  `;
}

function editorSlug(value) {
  const slug = String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  return slug || "mission";
}

function editorTags() {
  return String(state.editor.tagsText || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 6);
}

function countEditorTiles(grid) {
  const counts = { starts: 0, hostiles: 0, civilians: 0, objectives: 0, extraction: 0, doors: 0, windows: 0, stairs: 0, cover: 0 };
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      const ch = grid[y][x];
      if (ch === "S") counts.starts += 1;
      if (ch === "E") counts.hostiles += 1;
      if (ch === "C") counts.civilians += 1;
      if (ch === "O") counts.objectives += 1;
      if (ch === "X") counts.extraction += 1;
      if (ch === "D") counts.doors += 1;
      if (ch === "W") counts.windows += 1;
      if (ch === "A") counts.stairs += 1;
      if (ch === "B") counts.cover += 1;
    }
  }
  return counts;
}

function editorRoomLabel(component, index) {
  const counts = component.reduce(
    (acc, point) => {
      const ch = state.editor.grid[point.ty][point.tx];
      if (ch === "S") acc.starts += 1;
      if (ch === "E") acc.hostiles += 1;
      if (ch === "C") acc.civilians += 1;
      if (ch === "O") acc.objectives += 1;
      if (ch === "X") acc.extraction += 1;
      if (ch === "A") acc.stairs += 1;
      return acc;
    },
    { starts: 0, hostiles: 0, civilians: 0, objectives: 0, extraction: 0, stairs: 0 },
  );
  if (counts.starts) return { label: "Entry Stack", kind: "entry" };
  if (counts.objectives) return { label: "Objective Room", kind: "objective" };
  if (counts.civilians) return { label: "Rescue Room", kind: "rescue" };
  if (counts.extraction) return { label: "Extraction Lane", kind: "extract" };
  if (counts.stairs) return { label: "Stair Core", kind: "stairs" };
  if (counts.hostiles) return { label: `Contact Room ${index}`, kind: "contact" };
  return { label: `Room ${index}`, kind: "editor" };
}

function inferEditorRooms(grid) {
  const visited = new Set();
  const rooms = [];
  const blocksRoom = (ch) => ch === "#" || ch === "D" || ch === "W";
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  for (let y = 1; y < ROWS - 1; y += 1) {
    for (let x = 1; x < COLS - 1; x += 1) {
      const key = keyOf(x, y);
      if (visited.has(key) || blocksRoom(grid[y][x])) continue;
      const queue = [{ tx: x, ty: y }];
      const component = [];
      visited.add(key);
      let minX = x;
      let maxX = x;
      let minY = y;
      let maxY = y;
      while (queue.length) {
        const current = queue.shift();
        component.push(current);
        minX = Math.min(minX, current.tx);
        maxX = Math.max(maxX, current.tx);
        minY = Math.min(minY, current.ty);
        maxY = Math.max(maxY, current.ty);
        for (const dir of dirs) {
          const nx = current.tx + dir[0];
          const ny = current.ty + dir[1];
          const nextKey = keyOf(nx, ny);
          if (nx <= 0 || ny <= 0 || nx >= COLS - 1 || ny >= ROWS - 1 || visited.has(nextKey) || blocksRoom(grid[ny][nx])) continue;
          visited.add(nextKey);
          queue.push({ tx: nx, ty: ny });
        }
      }
      if (component.length < 6) continue;
      const w = maxX - minX + 1;
      const h = maxY - minY + 1;
      if (w < 2 || h < 2) continue;
      const meta = editorRoomLabel(component, rooms.length + 1);
      rooms.push(room(meta.label, minX, minY, w, h, meta.kind));
      if (rooms.length >= 12) return rooms;
    }
  }
  return rooms;
}

function editorValidationReport() {
  try {
    const mission = normalizeImportedMission(buildEditorMission());
    const counts = countEditorTiles(state.editor.grid);
    const warnings = collectMissionAuditWarnings(mission);
    if (counts.starts < 4) warnings.push("Place four start tiles for a full squad insertion.");
    if (!counts.extraction) warnings.push("Place an extraction tile so successful missions have a clear exit.");
    if (!counts.hostiles) warnings.push("Place at least one hostile contact.");
    if (!counts.objectives && !counts.civilians) warnings.push("Place an objective or civilian rescue target.");
    return {
      ok: warnings.length === 0,
      counts,
      rooms: mission.rooms || [],
      layout: auditMissionLayout(mission),
      warnings: warnings.slice(0, 8),
    };
  } catch (error) {
    return {
      ok: false,
      counts: countEditorTiles(state.editor.grid),
      rooms: [],
      layout: null,
      warnings: [error.message],
    };
  }
}

function loadMissionIntoEditor(mission) {
  const normalized = normalizeImportedMission(mission);
  state.editor.name = normalized.title;
  state.editor.brief = normalized.brief || "";
  state.editor.objectiveText = normalized.objectiveText || "";
  state.editor.tagsText = (normalized.tags || []).join(", ");
  state.editor.scenario = normalized.scenario || "";
  state.editor.difficulty = normalized.difficulty || 2;
  state.editor.levels = normalized.levels || 1;
  state.editor.night = Boolean(normalized.night);
  state.editor.grid = normalized.tiles.map((row) => row.split(""));
  state.editor.exportText = "";
  state.editor.message = `Loaded ${normalized.title} into the editor.`;
}

function repairEditorLayout() {
  const normalized = normalizeImportedMission(buildEditorMission());
  state.editor.grid = normalized.tiles.map((row) => row.split(""));
  state.editor.message = "Repaired layout access, doors, and mission flow.";
  state.editor.exportText = "";
}

function loadedImage(image) {
  return Boolean(image && image.complete && image.naturalWidth);
}

function missingTacticalAssets() {
  return tacticalSpriteIds.filter((id) => {
    const standalone = imageAssets[id];
    if (standalone && loadedImage(standalone)) return false;
    if (loadedImage(uiSheet) && uiSprites[id]) return false;
    return true;
  });
}

function saveEditorMission(testNow) {
  try {
    const mission = buildEditorMission();
    const normalized = normalizeImportedMission(mission);
    const existing = state.profile.customMissions.filter((item) => item.id !== normalized.id);
    state.profile.customMissions = [...existing, normalized];
    saveProfile();
    if (testNow) {
      state.activeTab = "campaign";
      startMission(normalized);
      state.editor.message = `Testing ${normalized.title}.`;
    } else {
      state.editor.message = `Saved ${normalized.title} to custom missions.`;
    }
  } catch (error) {
    state.editor.message = error.message;
  }
  markUiDirty();
}

function buildEditorMission() {
  return {
    id: `custom_${editorSlug(state.editor.name)}`,
    title: state.editor.name || "Custom Mission",
    brief: state.editor.brief || "Built in the Breachline Pixel editor.",
    difficulty: clamp(Number(state.editor.difficulty || 2), 1, 5),
    objectiveText: state.editor.objectiveText || "Complete all placed objectives and extract.",
    night: Boolean(state.editor.night),
    tags: editorTags(),
    rooms: inferEditorRooms(state.editor.grid),
    levels: clamp(Number(state.editor.levels || 1), 1, 3),
    scenario: state.editor.scenario || "",
    tiles: state.editor.grid.map((row) => row.join("")),
    custom: true,
  };
}

function paintEditorAt(x, y) {
  const tile = worldToTile(x, y);
  if (tile.tx === 0 || tile.ty === 0 || tile.tx === COLS - 1 || tile.ty === ROWS - 1) return;
  const chars = {
    floor: ".",
    wall: "#",
    door: "D",
    window: "W",
    crate: "B",
    stairs: "A",
    start: "S",
    hostile: "E",
    civilian: "C",
    objective: "O",
    extract: "X",
  };
  state.editor.grid[tile.ty][tile.tx] = chars[state.editor.palette] || ".";
  state.editor.exportText = "";
  markUiDirty();
  render();
}

function importMissionJson(json) {
  try {
    const mission = normalizeImportedMission(json);
    const exists = state.profile.customMissions.filter((item) => item.id !== mission.id);
    state.profile.customMissions = [...exists, mission];
    saveProfile();
    setTab("campaign", false);
    addLog(`Imported add-on mission: ${mission.title}`);
  } catch (error) {
    window.alert(error.message);
  }
  markUiDirty();
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function handleCanvasClick(event) {
  updatePointerFromEvent(event);
  if (state.camera.suppressClick) {
    state.camera.suppressClick = false;
    return;
  }
  const { x, y } = canvasPoint(event);
  if (state.activeTab === "editor") {
    paintEditorAt(x, y);
    return;
  }
  if (!state.mission || state.outcome) return;
  if (state.pendingPlanAction) {
    const op = state.operators.find((unit) => unit.id === state.pendingPlanAction.opId) || selectedOperator();
    queuePlanAction(state.pendingPlanAction.actionType, op, { x, y }, state.pendingPlanAction.waypointIndex);
    return;
  }
  const clickedOp = state.operators.find((unit) => !unit.down && Math.hypot(unit.x - x, unit.y - y) < 18);
  const additiveSelect = event.shiftKey || event.metaKey || event.ctrlKey;
  if (clickedOp && additiveSelect) {
    toggleOperatorInGroup(clickedOp.id);
    return;
  }
  if (clickedOp && state.selectedTool === "select") {
    setSelectedOperator(clickedOp.id);
    return;
  }
  if (state.selectedTool === "pan") return;
  if (state.selectedTool === "waypoint") {
    const selected = selectedOperator();
    const group = selectedOperators();
    const hit = waypointAt(x, y);
    if (hit) {
      if (group.length > 1 && !isOperatorSelected(hit.op)) {
        addGroupWaypoints(group, hit.node.x, hit.node.y, "Fireteam");
        addLog(`${selectedGroupName()}: rallying to ${hit.op.name}'s route.`);
        return;
      }
      if (selected && selected.id !== hit.op.id && group.length === 1) {
        addWaypoint(selected, hit.node.x, hit.node.y);
        addLog(`${selected.name}: rallying to ${hit.op.name}'s route.`);
        return;
      }
      selectWaypointAt(x, y);
      return;
    }
  }
  if (clickedOp && state.selectedTool === "waypoint") {
    const selected = selectedOperator();
    const group = selectedOperators();
    if (group.length > 1 && !isOperatorSelected(clickedOp)) {
      addGroupWaypoints(group, clickedOp.x, clickedOp.y, "Fireteam");
      addLog(`${selectedGroupName()}: rallying to ${clickedOp.name}.`);
      return;
    }
    if (selected && selected.id !== clickedOp.id && group.length === 1) {
      addWaypoint(selected, clickedOp.x, clickedOp.y);
      addLog(`${selected.name}: rallying to ${clickedOp.name}.`);
      return;
    }
    setSelectedOperator(clickedOp.id);
    return;
  }
  useToolAt(selectedOperator(), x, y);
}

function handleCanvasRightClick(event) {
  event.preventDefault();
  if (!state.mission) return;
  if (state.pendingPlanAction) {
    state.pendingPlanAction = null;
    addLog("Planned action targeting canceled.");
    markUiDirty();
    return;
  }
  const op = selectedOperator();
  if (op && op.path.length) {
    op.path.pop();
    addLog(`${op.name}: removed last waypoint.`);
    markUiDirty();
  }
}

function selectOperatorsInBox(box) {
  const left = Math.min(box.startX, box.x);
  const right = Math.max(box.startX, box.x);
  const top = Math.min(box.startY, box.y);
  const bottom = Math.max(box.startY, box.y);
  const ids = livingOperators()
    .filter((op) => op.x >= left && op.x <= right && op.y >= top && op.y <= bottom)
    .map((op) => op.id);
  if (!ids.length) return;
  if (box.additive) {
    setSelectedGroup(ensureSelectedGroup().concat(ids), state.selectedId);
  } else {
    setSelectedGroup(ids, ids[0]);
  }
  addLog(`${ids.length} operators boxed.`);
}

function handleCanvasMouseDown(event) {
  updatePointerFromEvent(event);
  if (!state.mission || state.activeTab === "editor") return;
  if (event.button === 0 && (state.selectedTool === "select" || event.shiftKey || event.metaKey || event.ctrlKey)) {
    const point = canvasPoint(event);
    state.selectionBox = {
      startX: point.x,
      startY: point.y,
      x: point.x,
      y: point.y,
      moved: false,
      additive: event.shiftKey || event.metaKey || event.ctrlKey,
    };
    event.preventDefault();
    return;
  }
  if (state.selectedTool !== "pan" && event.button !== 1 && !event.altKey) return;
  event.preventDefault();
  state.camera.drag = {
    x: event.clientX,
    y: event.clientY,
    moved: false,
  };
  state.camera.follow = false;
  markUiDirty();
}

function handleCanvasMouseMove(event) {
  updatePointerFromEvent(event);
  if (state.selectionBox) {
    const point = canvasPoint(event);
    state.selectionBox.x = point.x;
    state.selectionBox.y = point.y;
    if (Math.abs(point.x - state.selectionBox.startX) + Math.abs(point.y - state.selectionBox.startY) > 10) {
      state.selectionBox.moved = true;
    }
    markUiDirty();
    return;
  }
  if (!state.camera.drag) return;
  const rect = canvas.getBoundingClientRect();
  const dx = ((event.clientX - state.camera.drag.x) / rect.width) * VIEW_W;
  const dy = ((event.clientY - state.camera.drag.y) / rect.height) * VIEW_H;
  if (Math.abs(dx) + Math.abs(dy) > 1) {
    state.camera.drag.moved = true;
    panCamera(-dx / state.camera.zoom, -dy / state.camera.zoom);
    state.camera.drag.x = event.clientX;
    state.camera.drag.y = event.clientY;
  }
}

function handleCanvasMouseUp() {
  if (state.selectionBox) {
    if (state.selectionBox.moved) {
      selectOperatorsInBox(state.selectionBox);
      state.camera.suppressClick = true;
    }
    state.selectionBox = null;
    markUiDirty();
    return;
  }
  if (!state.camera.drag) return;
  if (state.camera.drag.moved) state.camera.suppressClick = true;
  state.camera.drag = null;
}

function handleCanvasWheel(event) {
  updatePointerFromEvent(event);
  if (!state.mission || state.activeTab === "editor") return;
  event.preventDefault();
  zoomCamera(event.deltaY < 0 ? 0.16 : -0.16);
  state.camera.follow = false;
}

function canvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  const canvasX = ((event.clientX - rect.left) / rect.width) * VIEW_W;
  const canvasY = ((event.clientY - rect.top) / rect.height) * VIEW_H;
  if (state.mission && state.activeTab !== "editor") {
    const x = state.camera.x + (canvasX - VIEW_W / 2) / state.camera.zoom;
    const y = state.camera.y + (canvasY - VIEW_H / 2) / state.camera.zoom;
    return { x: clamp(x, 0, VIEW_W), y: clamp(y, 0, VIEW_H) };
  }
  const x = canvasX;
  const y = canvasY;
  return { x: clamp(x, 0, VIEW_W), y: clamp(y, 0, VIEW_H) };
}

function updatePointerFromEvent(event) {
  const point = canvasPoint(event);
  state.lastPointer.x = point.x;
  state.lastPointer.y = point.y;
  state.lastPointer.screenX = event.clientX;
  state.lastPointer.screenY = event.clientY;
}

function toggleRunning(force) {
  if (!state.mission || state.outcome) return;
  state.running = typeof force === "boolean" ? force : !state.running;
  addLog(state.running ? "Execute." : "Paused.");
  markUiDirty();
}

function restartMission() {
  if (state.missionSource) startMission(state.missionSource);
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
  }
}

function gameLoop(now) {
  // If the browser tab is hidden, requestAnimationFrame either pauses outright (most
  // browsers) or throttles to ~1Hz. Without this guard, mission time keeps creeping
  // (clamped to 0.05s per frame so still ~3s per real minute) and the canvas appears
  // "frozen" when the player returns because the visual catch-up is jarring. Drop the
  // frame entirely while hidden and re-anchor lastFrame on resume so dt isn't a giant
  // spike that yanks the simulation forward.
  if (typeof document !== "undefined" && document.hidden) {
    state.lastFrame = now;
    requestAnimationFrame(gameLoop);
    return;
  }
  const rawDt = (now - state.lastFrame) / 1000;
  state.lastFrame = now;
  // A dt > 0.2s almost always means the tab was just unhidden or a long stall happened;
  // skip update so the simulation doesn't pop forward, but still render the frame.
  if (rawDt > 0.2) {
    render();
    requestAnimationFrame(gameLoop);
    return;
  }
  const dt = Math.min(0.05, rawDt);
  update(dt);
  render();
  requestAnimationFrame(gameLoop);
}

document.querySelectorAll(".tab").forEach((button) => {
  button.addEventListener("click", () => {
    state.screen = "game";
    setTab(button.dataset.tab);
  });
});
// Re-anchor the frame clock when the tab regains focus so the first post-resume frame
// starts a fresh dt instead of dumping a multi-second jump into the simulation.
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    state.lastFrame = performance.now();
    markUiDirty();
  }
});
canvas.addEventListener("click", handleCanvasClick);
canvas.addEventListener("mousedown", handleCanvasMouseDown);
canvas.addEventListener("contextmenu", handleCanvasRightClick);
canvas.addEventListener("wheel", handleCanvasWheel, { passive: false });
window.addEventListener("mousemove", handleCanvasMouseMove);
window.addEventListener("mouseup", handleCanvasMouseUp);
goBtn.addEventListener("click", () => toggleRunning(true));
pauseBtn.addEventListener("click", () => toggleRunning(false));
restartBtn.addEventListener("click", restartMission);
fullscreenBtn.addEventListener("click", toggleFullscreen);
addonFile.addEventListener("change", async () => {
  const file = addonFile.files && addonFile.files[0];
  if (!file) return;
  importMissionJson(JSON.parse(await file.text()));
  addonFile.value = "";
});

window.addEventListener("keydown", (event) => {
  if (event.target && ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)) return;
  const key = event.key.toLowerCase();
  if (state.radial.open && event.key === "Escape") {
    event.preventDefault();
    closeRadialMenu();
  } else if (state.mission && key === "q") {
    event.preventDefault();
    openRadialMenu();
  } else if (event.key >= "1" && event.key <= "4") {
    const op = state.operators[Number(event.key) - 1];
    if (op) {
      if (event.shiftKey || event.metaKey || event.ctrlKey) toggleOperatorInGroup(op.id);
      else setSelectedOperator(op.id);
    }
  } else if (state.mission && event.key === "0") {
    selectGroupPreset("all");
  } else if (state.mission && key === "v") {
    state.selectedTool = "select";
    markUiDirty();
  } else if (event.code === "Space") {
    event.preventDefault();
    toggleRunning();
  } else if (state.mission && (event.key === "ArrowUp" || key === "w")) {
    event.preventDefault();
    panCamera(0, -cameraStep());
  } else if (state.mission && (event.key === "ArrowDown" || key === "s")) {
    event.preventDefault();
    panCamera(0, cameraStep());
  } else if (state.mission && (event.key === "ArrowLeft" || key === "a")) {
    event.preventDefault();
    panCamera(-cameraStep(), 0);
  } else if (state.mission && (event.key === "ArrowRight" || key === "d")) {
    event.preventDefault();
    panCamera(cameraStep(), 0);
  } else if (state.mission && key === "c") {
    recenterCamera();
  } else if (state.mission && (event.key === "+" || event.key === "=")) {
    zoomCamera(0.16);
  } else if (state.mission && event.key === "-") {
    zoomCamera(-0.16);
  } else if (key === "g") {
    toggleRunning(true);
  } else if (key === "r") {
    restartMission();
  } else if (key === "f") {
    toggleFullscreen();
  } else if (event.key === "Escape" && state.screen === "game" && !document.fullscreenElement) {
    state.screen = "home";
    markUiDirty();
  } else if (event.key === "Escape" && document.fullscreenElement) {
    if (document.exitFullscreen) document.exitFullscreen();
  }
});

window.advanceTime = (ms) => {
  const steps = Math.max(1, Math.round(ms / (1000 / 60)));
  for (let i = 0; i < steps; i += 1) update(1 / 60);
  render();
};

window.render_game_to_text = () => {
  computeVisibility();
  const payload = {
    note: "Canvas coordinates use origin top-left; x right, y down; tiles are 32 px.",
    screen: state.screen,
    tab: state.activeTab,
    mission: state.mission ? state.mission.id : null,
    running: state.running,
    time: Number(state.missionTime.toFixed(1)),
    outcome: state.outcome,
    selected: state.selectedId,
    selectedGroup: ensureSelectedGroup().slice(),
    tool: state.selectedTool,
    pendingPlanAction: state.pendingPlanAction
      ? { opId: state.pendingPlanAction.opId, actionType: state.pendingPlanAction.actionType, waypoint: state.pendingPlanAction.waypointIndex + 1 }
      : null,
    radial: {
      open: state.radial.open,
      source: state.radial.source,
      selected: state.radial.selected,
      tile: worldToTile(state.radial.worldX, state.radial.worldY),
    },
    camera: {
      x: Number(state.camera.x.toFixed(1)),
      y: Number(state.camera.y.toFixed(1)),
      tile: worldToTile(state.camera.x, state.camera.y),
      zoom: Number(state.camera.zoom.toFixed(2)),
      follow: state.camera.follow,
    },
    visibility: {
      visibleTiles: state.visibility.visible.size,
      seenTiles: state.visibility.seen.size,
      hiddenActiveEnemies: state.enemies.filter((enemy) => !enemy.down && !entityVisible(enemy)).length,
      hiddenStunnedEnemies: state.enemies.filter((enemy) => !enemy.down && !entityVisible(enemy) && enemy.stunned > 0).length,
      hiddenObjectives: state.objectives.filter((obj) => !obj.secured && !entityVisible(obj)).length,
      extractionAreaRemembered: state.extraction ? isTileSeen(worldToTile(state.extraction.x, state.extraction.y).tx, worldToTile(state.extraction.x, state.extraction.y).ty) : false,
    },
    assets: {
      runtimeAtlas: loadedImage(runtimeAtlas),
      generatedSheet: loadedImage(aiSheet),
      uiSheet: loadedImage(uiSheet),
      logo: loadedImage(logoImage),
      portraits: ["portrait_rook", "portrait_mako", "portrait_lynx", "portrait_volt"].every((id) => loadedImage(imageAssets[id])),
      standalone: Object.keys(imageAssets).reduce((acc, key) => {
        acc[key] = loadedImage(imageAssets[key]);
        return acc;
      }, {}),
      tactical: missingTacticalAssets().length === 0,
      tacticalMissing: missingTacticalAssets(),
    },
    missionIntel: {
      rooms: state.rooms.map((item) => ({ label: item.label, kind: item.kind })),
      tags: state.mission && state.mission.tags ? state.mission.tags : [],
      levels: state.mission && state.mission.levels ? state.mission.levels : 1,
      scenario: state.mission && state.mission.scenario ? state.mission.scenario : "",
      floors: state.floors
        ? {
            levels: state.floors.levels,
            stairTiles: Array.from(state.floors.map.entries()).filter(([, v]) => v === "stair").length,
            tilesPerFloor: Array.from(state.floors.map.values()).reduce((acc, v) => {
              const key = typeof v === "number" ? `floor${v}` : v;
              acc[key] = (acc[key] || 0) + 1;
              return acc;
            }, {}),
            activeFloor: (() => {
              const focused = selectedOperator();
              return focused && focused.level ? focused.level : 1;
            })(),
            operatorFloors: state.operators.map((op) => ({ id: op.id, level: op.level || 1 })),
          }
        : null,
      layout: auditMissionLayout(state.mission),
      auditWarnings: state.mapAuditWarnings.slice(),
    },
    editor:
      state.activeTab === "editor"
        ? (() => {
            const report = editorValidationReport();
            return {
              name: state.editor.name,
              palette: state.editor.palette,
              difficulty: state.editor.difficulty,
              levels: state.editor.levels,
              night: Boolean(state.editor.night),
              tags: editorTags(),
              counts: report.counts,
              rooms: report.rooms.map((item) => ({ label: item.label, kind: item.kind })),
              warnings: report.warnings.slice(),
              clean: report.ok,
            };
          })()
        : null,
    maneuvers: {
      recommended: state.tacticalAdvice ? state.tacticalAdvice.recommended : null,
      reason: state.tacticalAdvice ? state.tacticalAdvice.reason : null,
      active: state.activeManeuvers.map((item) => ({ id: item.id, seconds: Number(item.t.toFixed(1)), adapted: Boolean(item.adapted) })),
    },
    operators: state.operators.map((op) => ({
      id: op.id,
      tile: worldToTile(op.x, op.y),
      hp: Math.round(op.hp),
      down: op.down,
      path: op.path.length,
      gear: op.gear,
      focus: op.focus ? worldToTile(op.focus.x, op.focus.y) : null,
      drones: op.drones,
      suppression: Math.round(op.suppression || 0),
      underFire: Number(op.underFire ? op.underFire.toFixed(1) : 0),
      queuedActions: op.path
        .map((node, index) => ({
          waypoint: index + 1,
          tile: worldToTile(node.x, node.y),
          actions: (node.actions || []).map((action) => ({
            type: action.type,
            status: action.status,
            target: action.target ? worldToTile(action.target.x, action.target.y) : null,
          })),
        }))
        .filter((node) => node.actions.length),
    })),
    enemies: state.enemies
      .filter((enemy) => !enemy.down && entityVisible(enemy))
      .map((enemy) => ({
        id: enemy.id,
        role: enemy.role,
        tile: worldToTile(enemy.x, enemy.y),
        hp: Math.round(enemy.hp),
        armor: enemy.armor,
        alert: enemy.alert,
        tagged: enemy.tagged > 0,
        suppression: Math.round(enemy.suppression || 0),
        stunned: Number(enemy.stunned.toFixed(1)),
        squadId: enemy.squadId,
        squadAlert: Number((squadAlertFor(enemy) || 0).toFixed(2)),
        postStunBoost: Number((enemy.postStunBoost || 0).toFixed(2)),
        leashRange: enemy.leashRange,
      })),
    enemyIntel: {
      alertLevel: Number(state.enemyIntel.alertLevel.toFixed(1)),
      lastKnown: state.enemyIntel.lastKnown ? worldToTile(state.enemyIntel.lastKnown.x, state.enemyIntel.lastKnown.y) : null,
      lastNoise: state.enemyIntel.lastNoise ? { type: state.enemyIntel.lastNoise.type, tile: worldToTile(state.enemyIntel.lastNoise.x, state.enemyIntel.lastNoise.y) } : null,
      sightings: Object.keys(state.enemyIntel.sightings).length,
      reinforce: state.enemyIntel.reinforce ? { tile: worldToTile(state.enemyIntel.reinforce.x, state.enemyIntel.reinforce.y), seconds: Number(state.enemyIntel.reinforce.t.toFixed(1)) } : null,
      squadAlert: Object.keys(state.enemyIntel.squadAlert).reduce((acc, key) => {
        acc[key] = Number(state.enemyIntel.squadAlert[key].toFixed(1));
        return acc;
      }, {}),
      squads: Array.from(new Set(state.enemies.filter((enemy) => !enemy.down && enemy.squadId != null).map((enemy) => enemy.squadId))).length,
    },
    smokes: state.smokes.map((smoke) => ({ tile: worldToTile(smoke.x, smoke.y), seconds: Number(smoke.t.toFixed(1)) })),
    doors: state.doors.filter((door) => door.open).map((door) => ({ tile: { tx: door.tx, ty: door.ty }, open: true })),
    windows: state.windows.map((win) => ({ tile: { tx: win.tx, ty: win.ty }, breached: Boolean(win.breached) })),
    windowBreaches: state.windows.filter((win) => win.breached).map((win) => ({ tile: { tx: win.tx, ty: win.ty }, breached: true })),
    drones: state.drones.map((drone) => ({ tile: worldToTile(drone.x, drone.y), seconds: Number(drone.t.toFixed(1)) })),
    objectives: state.objectives
      .filter((obj) => entityVisible(obj))
      .map((obj) => ({ tile: worldToTile(obj.x, obj.y), secured: obj.secured })),
    civilians: state.civilians.map((civ) => ({ tile: worldToTile(civ.x, civ.y), rescued: civ.rescued, extracted: civ.extracted })),
    extraction: state.extraction ? worldToTile(state.extraction.x, state.extraction.y) : null,
  };
  return JSON.stringify(payload);
};

window.audit_mission_layouts = () =>
  JSON.stringify(
    availableMissions().map((mission) => {
      const parsed = parseMission(mission);
      const roleCounts = parsed.enemies.reduce((acc, enemy) => {
        acc[enemy.role] = (acc[enemy.role] || 0) + 1;
        return acc;
      }, {});
      return {
        id: mission.id,
        title: mission.title,
        enemies: parsed.enemies.length,
        roles: roleCounts,
        windows: parsed.windows.length,
        crates: parsed.map.reduce((count, row) => count + row.filter((tile) => tile.type === "crate").length, 0),
        ...auditMissionLayout(mission),
      };
    }),
  );

if (window.location.search.indexOf("devtools=1") >= 0) {
  window.breachline_dev_start_mission = (id) => {
    const mission = availableMissions().find((item) => item.id === id || item.title === id);
    if (!mission) return false;
    const previousCompleted = { ...state.profile.completed };
    for (const item of baseMissions()) state.profile.completed[item.id] = state.profile.completed[item.id] || { grade: "A", dev: true };
    startMission(mission);
    state.profile.completed = previousCompleted;
    return true;
  };

  window.breachline_dev_camera = (x, y, zoom) => {
    state.camera.follow = false;
    if (Number.isFinite(Number(zoom))) state.camera.zoom = clamp(Number(zoom), 0.72, 2.6);
    state.camera.x = clamp(Number(x) || VIEW_W / 2, VIEW_W / 2 / state.camera.zoom, COLS * TILE - VIEW_W / 2 / state.camera.zoom);
    state.camera.y = clamp(Number(y) || VIEW_H / 2, VIEW_H / 2 / state.camera.zoom, ROWS * TILE - VIEW_H / 2 / state.camera.zoom);
    render();
    return true;
  };

  window.breachline_dev_reveal_all = () => {
    for (let y = 0; y < ROWS; y += 1) {
      for (let x = 0; x < COLS; x += 1) state.visibility.seen.add(keyOf(x, y));
    }
    render();
    return true;
  };
}

saveProfile();
render();
boot();

async function boot() {
  await preloadAssets();
  if (loadingScreen) {
    loadingScreen.classList.add("done");
    loadingScreen.setAttribute("aria-hidden", "true");
    setTimeout(() => {
      loadingScreen.hidden = true;
    }, 280);
  }
  requestAnimationFrame(gameLoop);
}

async function preloadAssets() {
  const standaloneAssets = Object.keys(imageAssets).map((key) => ({
    label: `Loading ${key.replace(/_/g, " ")}`,
    image: imageAssets[key],
  }));
  const assets = [
    { label: "Loading generated operators", image: aiSheet },
    { label: "Building runtime atlas", image: runtimeAtlas },
    { label: "Loading master UI sheet", image: uiSheet },
    { label: "Painting command logo", image: logoImage },
  ].concat(standaloneAssets);
  updateLoadingProgress(0, "Initializing tactical map");
  for (let i = 0; i < assets.length; i += 1) {
    const asset = assets[i];
    updateLoadingProgress(i / assets.length, asset.label);
    await waitForImage(asset.image);
    updateLoadingProgress((i + 1) / assets.length, asset.label);
  }
  await new Promise((resolve) => setTimeout(resolve, 220));
  updateLoadingProgress(1, "Ready");
}

function waitForImage(image) {
  return new Promise((resolve) => {
    if (image.complete && image.naturalWidth) {
      resolve(true);
      return;
    }
    const done = () => resolve(Boolean(image.naturalWidth));
    image.addEventListener("load", done, { once: true });
    image.addEventListener("error", done, { once: true });
    setTimeout(done, 3200);
  });
}

function updateLoadingProgress(progress, label) {
  const pct = Math.round(clamp(progress, 0, 1) * 100);
  if (loadingBar) loadingBar.style.width = `${pct}%`;
  if (loadingStatus) loadingStatus.textContent = label;
  if (loadingPercent) loadingPercent.textContent = `${pct}%`;
}
