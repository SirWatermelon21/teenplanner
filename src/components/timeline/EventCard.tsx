'use client';

import React from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Event } from './types';
import {
  // SELECTED_CARD_BORDER_COLOR_OLD, // Keep if needed for other states, but not for primary selection now
  SELECTED_CARD_BORDER_COLOR_ENHANCED,
  SELECTED_CARD_GLOW_EFFECT,
  DELETE_INDICATOR_CARD_BG,
  DELETE_INDICATOR_CARD_TEXT,
  DELETE_INDICATOR_FRAME_GLOW, // This is for the frame, card has its own delete glow
  DEFAULT_CARD_BG,
  DEFAULT_CARD_TEXT
} from './constants';

interface EventCardProps {
  event: Event;
  eventContainerRef: React.RefObject<HTMLDivElement | null>;
  onDragStart: () => void;
  onDragMove: (info: PanInfo, eventId: string) => void;
  onDragEnd: (info: PanInfo, eventId: string) => void;
  onDoubleClick: (eventId: string) => void;
  isHoveringEdgeForDelete: boolean;
  isSelected: boolean;
  scale: number; // This is the canvas zoom scale
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  eventContainerRef,
  onDragStart,
  onDragMove,
  onDragEnd,
  onDoubleClick,
  isHoveringEdgeForDelete,
  isSelected,
  scale,
}) => {
  const cardBoxShadow = isHoveringEdgeForDelete 
    ? DELETE_INDICATOR_FRAME_GLOW // Use frame-like glow for card too when deleting
    : (isSelected ? SELECTED_CARD_GLOW_EFFECT : undefined);

  // Base font sizes (unscaled)
  const baseTimeFontSize = 12; // px
  const baseTitleFontSize = 14; // px
  const baseLocationFontSize = 12; // px
  const dragScaleEffect = 1.05; // How much to magnify on drag

  return (
    <motion.div
      key={event.id}
      drag
      dragConstraints={eventContainerRef}
      onDragStart={onDragStart}
      onDrag={(e, info) => onDragMove(info, event.id)}
      onDragEnd={(e, info) => onDragEnd(info, event.id)}
      onDoubleClick={() => onDoubleClick(event.id)}
      // Apply canvas zoom scale normally, and canvas zoom * drag effect during drag
      whileDrag={{ scale: scale * dragScaleEffect, zIndex: 10, cursor: 'grabbing' }}
      initial={{ opacity: 0, x: event.x, y: event.y, scale: scale * 0.5 }} // Initial entry animation relative to current scale
      animate={{
        opacity: 1,
        x: event.x,
        y: event.y,
        scale: scale, // Apply current canvas zoom scale
        backgroundColor: isHoveringEdgeForDelete ? DELETE_INDICATOR_CARD_BG : DEFAULT_CARD_BG,
        color: isHoveringEdgeForDelete ? DELETE_INDICATOR_CARD_TEXT : DEFAULT_CARD_TEXT,
        borderColor: isHoveringEdgeForDelete ? DELETE_INDICATOR_CARD_BG : (isSelected ? SELECTED_CARD_BORDER_COLOR_ENHANCED : 'transparent'),
        boxShadow: cardBoxShadow,
      }}
      transition={{ 
        type: 'spring', stiffness: 260, damping: 20, duration: 0.15, 
        backgroundColor: {duration: 0.1}, 
        color: {duration: 0.1}, 
        borderColor: {duration: 0.1}, 
        boxShadow: { duration: 0.15 }
      }}
      // Tailwind classes define base dimensions (w-52, min-h-[8rem]). 
      // The `scale` transform on this div will scale these dimensions and all children.
      className="bg-white text-black rounded-lg p-4 w-52 min-h-[8rem] flex flex-col items-center justify-start shadow-xl absolute border-2 origin-top-left"
      style={{ 
        zIndex: 2,
      }}
    >
      <div className="flex items-center mt-2 mb-1">
        {/* SVG uses Tailwind classes for base size (w-4 h-4), will be scaled by parent's transform */}
        <svg className="w-4 h-4 mr-1.5 flex-shrink-0" style={{color: isHoveringEdgeForDelete ? DELETE_INDICATOR_CARD_TEXT : 'rgb(55 65 81)'}} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M12 7v5l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {/* Font sizes are now base, unscaled. Parent's transform will scale them. */}
        <span className="font-medium" style={{color: isHoveringEdgeForDelete ? DELETE_INDICATOR_CARD_TEXT : 'rgb(55 65 81)', fontSize: `${baseTimeFontSize}px`}}>{event.time}</span>
      </div>
      <div className="text-center mb-2 flex-grow flex flex-col justify-center">
        <div className="font-semibold break-words mb-0.5" style={{fontSize: `${baseTitleFontSize}px`}}>{event.title}</div>
        {event.location && <div className="break-words" style={{color: isHoveringEdgeForDelete ? DELETE_INDICATOR_CARD_TEXT : 'rgb(107 114 128)', fontSize: `${baseLocationFontSize}px`}}>• {event.location}</div>}
      </div>
    </motion.div>
  );
};

export default EventCard; 