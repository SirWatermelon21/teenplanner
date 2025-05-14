'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';

interface Event {
  id: string;
  title: string;
  time: string;
  location?: string;
  group?: string;
  x: number;
  y: number;
}

// Initial type for newEventData, x and y will be set before saving
interface NewEventData {
  title: string;
  time: string;
  location?: string;
  group?: string;
}

interface Connection {
  id: string;
  fromId: string;
  toId: string;
  version: number;
}

const EVENT_CARD_WIDTH = 208; // w-52 is 13rem = 208px
const EVENT_CARD_HEIGHT = 128; // min-h-[8rem] is 8rem = 128px
const DANGER_ZONE_PADDING = 40; // How close to the edge to activate glow/delete
const SELECTED_CARD_BORDER_COLOR = 'rgba(59, 130, 246, 0.9)'; // Tailwind blue-500
const CONNECTION_LINE_COLOR = 'rgba(135, 206, 250, 0.7)'; // LightSkyBlue with alpha
const CONNECTION_LINE_WIDTH = 3;
const LINE_GLOW_FILTER_ID = "line-glow-effect";

// Colors for deletion indication
const DELETE_INDICATOR_CARD_BG = 'rgba(254, 202, 202, 1)'; // Tailwind red-200
const DELETE_INDICATOR_CARD_TEXT = 'rgba(153, 27, 27, 1)'; // Tailwind red-800
const DELETE_INDICATOR_FRAME_GLOW = '0 0 15px 5px rgba(255, 80, 80, 0.7)';
const DEFAULT_CARD_BG = '#FFFFFF';
const DEFAULT_CARD_TEXT = '#000000';

const genericLocations = ["Park", "Cafe", "Library", "Online", "Meeting Point", "Venue A", "Venue B"];

// Example of disabling ESLint for a specific line
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const unusedVariable = 'example';

// Example of disabling multiple rules for a specific line
// eslint-disable-next-line react-hooks/exhaustive-deps, @typescript-eslint/no-explicit-any
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
          const newConnection: Connection = { id: Date.now().toString(), fromId: firstSelectedCardId, toId: cardId, version: 0 };
          setConnections(prev => [...prev, newConnection]);
        }
        setFirstSelectedCardId(null); // Clear selection after attempting to connect
      }
    }
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
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
              <feComponentTransfer in="coloredBlur" result="opaquedBlur">
                <feFuncA type="linear" slope="0.7"/>
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

              const fromCenter = { x: fromCard.x + EVENT_CARD_WIDTH / 2, y: fromCard.y + EVENT_CARD_HEIGHT / 2 };
              const toCenter = { x: toCard.x + EVENT_CARD_WIDTH / 2, y: toCard.y + EVENT_CARD_HEIGHT / 2 };
              
              let d = ``;
              if (Math.abs(fromCenter.y - toCenter.y) < 10) { // Relatively same Y-level
                d = `M ${fromCenter.x},${fromCenter.y} L ${toCenter.x},${toCenter.y}`;
              } else {
                const c1x = fromCenter.x + (toCenter.x - fromCenter.x) * 0.3;
                const c1y = fromCenter.y;
                const c2x = toCenter.x - (toCenter.x - fromCenter.x) * 0.3;
                const c2y = toCenter.y;
                d = `M ${fromCenter.x},${fromCenter.y} C ${c1x},${c1y} ${c2x},${c2y} ${toCenter.x},${toCenter.y}`;
              }

              return (
                <motion.path
                  key={`${conn.id}-${conn.version}`}
                  d={d}
                  stroke={CONNECTION_LINE_COLOR}
                  strokeWidth={CONNECTION_LINE_WIDTH}
                  fill="none"
                  filter={`url(#${LINE_GLOW_FILTER_ID})`}
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ opacity: 1, pathLength: 1 }}
                  exit={{ opacity: 0, pathLength: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              );
            })}
          </AnimatePresence>
        </svg>

        {events.map((event) => (
          <motion.div
            key={event.id}
            drag
            dragConstraints={eventContainerRef}
            onDragStart={handleDragStart}
            onDrag={(e, info) => handleDragMove(info, event.id)}
            onDragEnd={(e, info) => handleDragEnd(info, event.id)}
            onDoubleClick={() => handleCardDoubleClick(event.id)}
            whileDrag={{ scale: 1.05, zIndex: 10, cursor: 'grabbing' }}
            initial={{ opacity: 0, x: event.x, y: event.y, scale: 0.5 }}
            animate={{
              opacity: 1,
              x: event.x,
              y: event.y,
              scale: 1,
              backgroundColor: hoveringEdgeForDelete === event.id ? DELETE_INDICATOR_CARD_BG : DEFAULT_CARD_BG,
              color: hoveringEdgeForDelete === event.id ? DELETE_INDICATOR_CARD_TEXT : DEFAULT_CARD_TEXT,
              borderColor: firstSelectedCardId === event.id ? SELECTED_CARD_BORDER_COLOR : 'transparent',
              boxShadow: hoveringEdgeForDelete === event.id ? DELETE_INDICATOR_FRAME_GLOW : undefined,
            }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, duration: 0.15, backgroundColor: {duration: 0.1}, color: {duration: 0.1}, borderColor: {duration: 0.1}, boxShadow: { duration: 0.15 } }}
            className="bg-white text-black rounded-lg p-4 w-52 min-h-[8rem] flex flex-col items-center justify-start shadow-xl absolute border-2"
            style={{ zIndex: 2 }} // Ensure cards are above lines
          >
            <div className="flex items-center mt-2 mb-1">
              <svg className="w-4 h-4 mr-1.5 flex-shrink-0" style={{color: hoveringEdgeForDelete === event.id ? DELETE_INDICATOR_CARD_TEXT : 'rgb(55 65 81)'}} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12 7v5l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xs font-medium" style={{color: hoveringEdgeForDelete === event.id ? DELETE_INDICATOR_CARD_TEXT : 'rgb(55 65 81)'}}>{event.time}</span>
            </div>
            <div className="text-center mb-2 flex-grow flex flex-col justify-center">
              <div className="font-semibold text-sm mb-0.5 break-words">{event.title}</div>
              {event.location && <div className="text-xs break-words" style={{color: hoveringEdgeForDelete === event.id ? DELETE_INDICATOR_CARD_TEXT : 'rgb(107 114 128)'}}>• {event.location}</div>}
            </div>
          </motion.div>
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

      {/* Add Event Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-40"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white text-black rounded-xl p-6 w-full max-w-md shadow-2xl z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Create Event</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="eventTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Event Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="eventTitle"
                    name="title"
                    value={newEventData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Museum Visit"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="eventTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    id="eventTime"
                    name="time"
                    value={newEventData.time}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="eventLocation" className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    id="eventLocation"
                    name="location"
                    value={newEventData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., City Center Art Gallery"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black shadow-sm"
                  />
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 justify-end pt-4">
                  <motion.button
                    type="button"
                    onClick={handleCreateGenericEvent}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 font-medium w-full sm:w-auto"
                  >
                    Create Generic
                  </motion.button>
                  <div className="flex space-x-3 w-full sm:w-auto">
                    <motion.button
                      type="button"
                      onClick={handleCloseModal}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium flex-1 sm:flex-initial"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={handleSaveEvent}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed font-medium flex-1 sm:flex-initial shadow-md"
                      disabled={!newEventData.title.trim() || !newEventData.time}
                    >
                      Save Event
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TimelinePlanningMode;  