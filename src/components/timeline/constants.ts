export const EVENT_CARD_WIDTH = 208; // w-52 is 13rem = 208px
export const EVENT_CARD_HEIGHT = 128; // min-h-[8rem] is 8rem = 128px
export const DANGER_ZONE_PADDING = 40; // How close to the edge to activate glow/delete

// Original selection color, keeping for reference or if needed elsewhere
export const SELECTED_CARD_BORDER_COLOR_OLD = 'rgba(59, 130, 246, 0.9)'; // Tailwind blue-500

// Enhanced selection for Event Cards
export const SELECTED_CARD_BORDER_COLOR_ENHANCED = 'rgba(135, 206, 250, 0.85)'; // LightSkyBlue, slightly more opaque for border
export const SELECTED_CARD_GLOW_EFFECT = '0 0 20px 7px rgba(135, 206, 250, 0.6)'; // LightSkyBlue glow, increased magnitude

export const CONNECTION_LINE_COLOR = 'rgba(135, 206, 250, 0.7)'; // Default LightSkyBlue with alpha
export const CONNECTION_LINE_WIDTH = 3;
export const LINE_GLOW_FILTER_ID = "line-glow-effect";
export const TRANSPORT_ICON_RADIUS = 25;
export const TRANSPORT_ICON_BG_COLOR = '#FFFFFF';
export const TRANSPORT_ICON_EMOJI_SIZE = '32px';

// Colors for deletion indication
export const DELETE_INDICATOR_CARD_BG = 'rgba(254, 202, 202, 1)'; // Tailwind red-200
export const DELETE_INDICATOR_CARD_TEXT = 'rgba(153, 27, 27, 1)'; // Tailwind red-800
export const DELETE_INDICATOR_FRAME_GLOW = '0 0 15px 5px rgba(255, 80, 80, 0.7)';
export const DEFAULT_CARD_BG = '#FFFFFF';
export const DEFAULT_CARD_TEXT = '#000000';

export const genericLocations = ["Park", "Cafe", "Library", "Online", "Meeting Point", "Venue A", "Venue B"];

// Updated transportEmojis to include descriptions
export const transportEmojis = [
  { emoji: '🚶', description: 'Walk' },
  { emoji: '🏃', description: 'Run' },
  { emoji: '🚲', description: 'Bike' },
  { emoji: '🚗', description: 'Car' },
  { emoji: '🚌', description: 'Bus' },
  { emoji: '🚆', description: 'Train' },
  { emoji: '🚠', description: 'Gondola' },
  { emoji: '✈️', description: 'Plane' },
  { emoji: '🚢', description: 'Ship' }
];

// Color map for connections based on transport type
export const transportColorMap: { [key: string]: string } = {
  '🚶': 'rgba(144, 238, 144, 0.8)', // Light Green (Walk)
  '🏃': 'rgba(255, 215, 0, 0.8)',   // Light Orange/Gold (Run)
  '🚲': 'rgba(0, 255, 255, 0.8)',   // Light Cyan (Bike)
  '🚗': 'rgba(173, 216, 230, 0.8)', // Light Blue (Car)
  '🚌': 'rgba(221, 160, 221, 0.8)', // Light Purple/Plum (Bus)
  '🚆': 'rgba(175, 238, 238, 0.8)', // Pale Turquoise/Teal (Train)
  '🚠': 'rgba(255, 182, 193, 0.8)', // Light Pink (Gondola)
  '✈️': 'rgba(135, 206, 250, 0.8)', // Light Sky Blue (Plane - default connection color variant)
  '🚢': 'rgba(127, 255, 212, 0.8)'  // Aquamarine (Ship)
};

export const distanceUnits = [
  { value: 'ft', label: 'feet' },
  { value: 'm', label: 'meters' },
  { value: 'km', label: 'kilometers' },
  { value: 'miles', label: 'miles' }
];

export const timeUnits = [
  { value: 's', label: 'seconds' },
  { value: 'min', label: 'minutes' },
  { value: 'hr', label: 'hours' },
  { value: 'days', label: 'days' }
]; 