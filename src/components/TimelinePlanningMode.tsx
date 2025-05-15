'use client';

import React from 'react';
import { useState, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Event, NewEventData, Connection, NewConnectionData } from './timeline/types';
import {
  EVENT_CARD_WIDTH,
  EVENT_CARD_HEIGHT,
  DANGER_ZONE_PADDING,
  LINE_GLOW_FILTER_ID,
  DELETE_INDICATOR_FRAME_GLOW,
  genericLocations,
  transportEmojis,
  distanceUnits,
  timeUnits
} from './timeline/constants';
import EventCard from './timeline/EventCard';
import ConnectionLine from './timeline/ConnectionLine';
import EventModal from './timeline/EventModal';
import ConnectionModal from './timeline/ConnectionModal';

// Example of disabling ESLint for a specific line
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const unusedVariable = 'example';

const TimelinePlanningMode = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEventData, setNewEventData] = useState<NewEventData>({
    title: '',
    time: '',
    location: '',
  });
  const [hoveringEdgeForDelete, setHoveringEdgeForDelete] = useState<string | null>(null);
  const [firstSelectedCardId, setFirstSelectedCardId] = useState<string | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);

  // State for Connection Modal
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);
  const [newConnectionData, setNewConnectionData] = useState<NewConnectionData>({
    transportEmoji: transportEmojis[0].emoji,
    distanceValue: undefined,
    distanceUnit: distanceUnits[0].value,
    timeValue: undefined,
    timeUnit: timeUnits[0].value
  });
  const [pendingConnectionFromId, setPendingConnectionFromId] = useState<string | null>(null);
  const [pendingConnectionToId, setPendingConnectionToId] = useState<string | null>(null);

  const eventContainerRef = useRef<HTMLDivElement>(null); // Ref for the event container

  const handleOpenModal = () => {
    setNewEventData({ title: '', time: '', location: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const createAndPlaceEvent = (eventData: NewEventData) => {
    let randomX = 0;
    let randomY = 0;

    if (eventContainerRef.current) {
      const containerWidth = eventContainerRef.current.offsetWidth;
      const containerHeight = eventContainerRef.current.offsetHeight;
      
      randomX = Math.random() * Math.max(0, containerWidth - EVENT_CARD_WIDTH);
      randomY = Math.random() * Math.max(0, containerHeight - EVENT_CARD_HEIGHT);
    }

    const newNode: Event = {
      id: Date.now().toString(),
      ...eventData,
      x: randomX,
      y: randomY,
    };
    setEvents(prevEvents => [...prevEvents, newNode]);
    handleCloseModal();
  };

  const handleSaveEvent = () => {
    if (!newEventData.title.trim() || !newEventData.time) {
      alert("Event Title and Time are required.");
      return;
    }
    createAndPlaceEvent(newEventData);
  };

  const handleCreateGenericEvent = () => {
    const randomHour = Math.floor(Math.random() * 24).toString().padStart(2, '0');
    const randomMinute = ['00', '15', '30', '45'][Math.floor(Math.random() * 4)];
    const randomLocation = genericLocations[Math.floor(Math.random() * genericLocations.length)];

    const genericEventData: NewEventData = {
      title: `Event ${events.length + 1}`,
      time: `${randomHour}:${randomMinute}`,
      location: randomLocation,
    };
    createAndPlaceEvent(genericEventData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEventData(prev => ({ ...prev, [name]: value }));
  };

  const handleDragStart = () => {
    setHoveringEdgeForDelete(null); // Clear any glow when starting a new drag
  };

  const handleDragMove = (info: PanInfo, eventId: string) => {
    const eventBeingDragged = events.find(ev => ev.id === eventId);
    if (!eventBeingDragged || !eventContainerRef.current) return;

    const currentX = eventBeingDragged.x + info.offset.x;
    const currentY = eventBeingDragged.y + info.offset.y;
    const { offsetWidth, offsetHeight } = eventContainerRef.current;

    const isNearEdge = 
      currentX < DANGER_ZONE_PADDING ||
      currentX + EVENT_CARD_WIDTH > offsetWidth - DANGER_ZONE_PADDING ||
      currentY < DANGER_ZONE_PADDING ||
      currentY + EVENT_CARD_HEIGHT > offsetHeight - DANGER_ZONE_PADDING;

    if (isNearEdge) {
      setHoveringEdgeForDelete(eventId);
    } else {
      if (hoveringEdgeForDelete === eventId) {
        setHoveringEdgeForDelete(null);
      }
    }
  };

  const handleDragEnd = (info: PanInfo, eventId: string) => {
    const wasHoveringEdge = hoveringEdgeForDelete === eventId;
    setHoveringEdgeForDelete(null); // Always clear glow after drag ends

    const originalEvent = events.find(ev => ev.id === eventId);
    if (!originalEvent || !eventContainerRef.current) return;

    const finalX = originalEvent.x + info.offset.x;
    const finalY = originalEvent.y + info.offset.y;
    const { offsetWidth, offsetHeight } = eventContainerRef.current;

    if (wasHoveringEdge) {
      const isAtEdgeForDelete = 
        finalX < DANGER_ZONE_PADDING ||
        finalX + EVENT_CARD_WIDTH > offsetWidth - DANGER_ZONE_PADDING ||
        finalY < DANGER_ZONE_PADDING ||
        finalY + EVENT_CARD_HEIGHT > offsetHeight - DANGER_ZONE_PADDING;

      if (isAtEdgeForDelete) {
        setEvents(prevEvents => prevEvents.filter(ev => ev.id !== eventId));
        setConnections(prev => prev.filter(c => c.fromId !== eventId && c.toId !== eventId));
        return; // Event deleted, no need to update position
      }
    }
    // If not deleted, update position
    setEvents(prevEvents => 
      prevEvents.map(ev => 
        ev.id === eventId 
          ? { ...ev, x: finalX, y: finalY } 
          : ev
      )
    );
    setConnections(prev => prev.map(conn => (conn.fromId === eventId || conn.toId === eventId) ? { ...conn, version: conn.version + 1 } : conn));
  };

  const handleCardDoubleClick = (cardId: string) => {
    if (!firstSelectedCardId) {
      setFirstSelectedCardId(cardId);
    } else {
      if (firstSelectedCardId === cardId) {
        setFirstSelectedCardId(null); // Deselect if double-clicking the same selected card
      } else {
        // Prevent duplicate connections (simple check)
        const existingConnection = connections.find(c => (c.fromId === firstSelectedCardId && c.toId === cardId) || (c.fromId === cardId && c.toId === firstSelectedCardId));
        if (!existingConnection) {
          handleOpenConnectionModal(firstSelectedCardId, cardId);
        } else {
          setFirstSelectedCardId(null); // Clear selection if connection already exists
        }
      }
    }
  };

  // Connection Modal Handlers
  const handleOpenConnectionModal = (fromId: string, toId: string) => {
    setPendingConnectionFromId(fromId);
    setPendingConnectionToId(toId);
    setNewConnectionData({ // Reset to default
      transportEmoji: transportEmojis[0].emoji,
      distanceValue: undefined,
      distanceUnit: distanceUnits[0].value,
      timeValue: undefined,
      timeUnit: timeUnits[0].value
    });
    setIsConnectionModalOpen(true);
  };

  const handleCloseConnectionModal = () => {
    setIsConnectionModalOpen(false);
    setPendingConnectionFromId(null);
    setPendingConnectionToId(null);
    setFirstSelectedCardId(null); // Also clear card selection
  };

  const handleConnectionInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const valueToSet = e.target.type === 'number' ? parseFloat(value) : value;
    setNewConnectionData(prev => ({ ...prev, [name]: valueToSet }));
  };

  const handleSaveConnection = () => {
    if (!pendingConnectionFromId || !pendingConnectionToId || !newConnectionData.transportEmoji) {
      alert("Transportation type is required.");
      return;
    }

    let finalDistance: string | undefined = undefined;
    if (newConnectionData.distanceValue && newConnectionData.distanceUnit) {
      finalDistance = `${newConnectionData.distanceValue} ${newConnectionData.distanceUnit}`;
    }

    let finalEstimatedTime: string | undefined = undefined;
    if (newConnectionData.timeValue && newConnectionData.timeUnit) {
      finalEstimatedTime = `${newConnectionData.timeValue} ${newConnectionData.timeUnit}`;
    }

    const newConnection: Connection = {
      id: Date.now().toString(),
      fromId: pendingConnectionFromId,
      toId: pendingConnectionToId,
      version: 0,
      transportEmoji: newConnectionData.transportEmoji,
      distance: finalDistance,
      estimatedTime: finalEstimatedTime
    };
    setConnections(prev => [...prev, newConnection]);
    handleCloseConnectionModal();
  };

  const handleCreateGenericConnection = () => {
    if (!pendingConnectionFromId || !pendingConnectionToId) return; // Should not happen if modal is open
    
    const randomTransport = transportEmojis[Math.floor(Math.random() * transportEmojis.length)];
    const randomDistValue = Math.floor(Math.random() * 100) + 1;
    const randomDistUnit = distanceUnits[Math.floor(Math.random() * distanceUnits.length)];
    const randomTimeValue = Math.floor(Math.random() * 50) + 10;
    const randomTimeUnit = timeUnits[Math.floor(Math.random() * timeUnits.length)];

    const genericConnection: Connection = {
      id: Date.now().toString(),
      fromId: pendingConnectionFromId,
      toId: pendingConnectionToId,
      version: 0,
      transportEmoji: randomTransport.emoji,
      distance: `${randomDistValue} ${randomDistUnit.value}`,
      estimatedTime: `${randomTimeValue} ${randomTimeUnit.value}`
    };
    setConnections(prev => [...prev, genericConnection]);
    handleCloseConnectionModal();
  };

  return (
    <div className="relative h-full w-full bg-black text-white overflow-hidden p-8 flex flex-col items-center justify-center">
      {/* Container for event nodes - now relative for absolute positioning of children */}
      <div 
        ref={eventContainerRef} 
        className="flex-grow w-full h-full relative cursor-grab"
        style={{
          boxShadow: hoveringEdgeForDelete !== null ? DELETE_INDICATOR_FRAME_GLOW : undefined,
          transition: 'box-shadow 0.2s ease-in-out'
        }}
      >
        {/* SVG Layer for Connections */}
        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, zIndex: 1, pointerEvents: 'none' }}>
          <defs>
            <filter id={LINE_GLOW_FILTER_ID} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="7" result="coloredBlur"/>
              <feComponentTransfer in="coloredBlur" result="opaquedBlur">
                <feFuncA type="linear" slope="1"/>
              </feComponentTransfer>
              <feMerge>
                <feMergeNode in="opaquedBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <AnimatePresence>
            {connections.map(conn => {
              const fromCard = events.find(e => e.id === conn.fromId);
              const toCard = events.find(e => e.id === conn.toId);
              if (!fromCard || !toCard) return null;

              return (
                <ConnectionLine 
                  key={`${conn.id}-${conn.version}-wrapper`}
                  connection={conn} 
                  fromEvent={fromCard} 
                  toEvent={toCard} 
                />
              );
            })}
          </AnimatePresence>
        </svg>

        {events.map((event) => (
          <EventCard 
            key={event.id}
            event={event}
            eventContainerRef={eventContainerRef}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
            onDoubleClick={handleCardDoubleClick}
            isHoveringEdgeForDelete={hoveringEdgeForDelete === event.id}
            isSelected={firstSelectedCardId === event.id}
          />
        ))}
      </div>

      {/* Add Node Button (Arrow) */}
      <motion.button
        onClick={handleOpenModal}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 bg-gray-200 text-black p-4 rounded-full shadow-lg flex items-center justify-center w-14 h-14 z-30"
        aria-label="Add new event node"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </motion.button>

      <EventModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        newEventData={newEventData}
        onInputChange={handleInputChange}
        onSave={handleSaveEvent}
        onCreateGeneric={handleCreateGenericEvent}
      />

      <ConnectionModal
        isOpen={isConnectionModalOpen}
        onClose={handleCloseConnectionModal}
        connectionData={newConnectionData}
        onInputChange={handleConnectionInputChange}
        onSave={handleSaveConnection}
        onCreateGeneric={handleCreateGenericConnection}
      />
    </div>
  );
};

export default TimelinePlanningMode;  