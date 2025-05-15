export interface Event {
  id: string;
  title: string;
  time: string;
  location?: string;
  group?: string;
  x: number;
  y: number;
}

// Initial type for newEventData, x and y will be set before saving
export interface NewEventData {
  title: string;
  time: string;
  location?: string;
  group?: string;
}

export interface Connection {
  id: string;
  fromId: string;
  toId: string;
  version: number;
  transportEmoji: string;
  distance?: string;
  estimatedTime?: string;
}

// Updated for structured input in the modal
export interface NewConnectionData {
  transportEmoji: string;
  distanceValue?: number;
  distanceUnit?: string;
  timeValue?: number;
  timeUnit?: string;
}

export interface Point { x: number; y: number; } 