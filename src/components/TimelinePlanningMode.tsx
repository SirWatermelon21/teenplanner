'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Event {
  id: string;
  title: string;
  time: string;
  location?: string;
  group?: string;
}

interface TimelinePlanningModeProps {
  events?: Event[];
  onAdd?: (event: Event) => void;
}

const TimelinePlanningMode = ({ 
  events: initialEvents = [], 
  onAdd 
}: TimelinePlanningModeProps) => {
  // Default initial events if none provided
  const defaultEvents: Event[] = initialEvents.length > 0 ? initialEvents : [
    { id: '1', title: 'Event', time: '09:00', location: 'New York' },
    { id: '2', title: 'Pizza', time: '12:00', location: 'New York', group: 'group 1' },
    { id: '3', title: 'Laser Tag', time: '15:00', location: 'New York', group: 'group 2' },
    { id: '4', title: 'Event', time: '18:00', location: 'New York' },
  ];
  
  const [events, setEvents] = useState<Event[]>(defaultEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<{title: string; time: string; location: string; group?: string}>({
    title: '',
    time: '',
    location: 'New York',
    group: ''
  });
  const timelineRef = useRef<HTMLDivElement>(null);

  // Helper to convert time string to position in timeline
  const timeToPosition = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    // Map 24 hours to a position value (can be adjusted as needed)
    return (hours + minutes / 60) * 40; // 40px per hour
  };

  // Sort events by time
  const sortedEvents = [...events].sort((a, b) => {
    return timeToPosition(a.time) - timeToPosition(b.time);
  });

  const handleAddEvent = () => {
    if (newEvent.title.trim() && newEvent.time) {
      const newEventObj = {
        id: Date.now().toString(),
        title: newEvent.title,
        time: newEvent.time,
        location: newEvent.location,
        ...(newEvent.group ? { group: newEvent.group } : {})
      };
      
      const updatedEvents = [...events, newEventObj];
      setEvents(updatedEvents);
      
      // Call the onAdd prop if provided
      if (onAdd) {
        onAdd(newEventObj);
      }
      
      // Reset and close modal
      setNewEvent({
        title: '',
        time: '',
        location: 'New York',
        group: ''
      });
      setIsModalOpen(false);
    }
  };

  // Calculate positions for zigzag layout
  const calculateNodePosition = (index: number, totalEvents: number) => {
    // Alternate top and bottom positioning
    const isEvenIndex = index % 2 === 0;
    return {
      top: isEvenIndex ? '25%' : '65%',
      left: `${(index / (totalEvents - 1 || 1)) * 80 + 10}%` // Distribute horizontally
    };
  };

  return (
    <div className="relative h-full w-full bg-black text-white overflow-hidden">
      {/* Background timeline line */}
      <div className="absolute w-full h-1 bg-gray-700 top-1/2 transform -translate-y-1/2 z-0" />
      
      {/* Timeline Container */}
      <div 
        ref={timelineRef}
        className="w-full h-[calc(100vh-100px)] overflow-x-auto p-4 relative z-10"
      >
        <div className="relative min-w-full h-full" style={{ minHeight: '400px' }}>
          {/* Events */}
          {sortedEvents.map((event, index, arr) => {
            const position = calculateNodePosition(index, arr.length);
            

            return (
              <div key={event.id} className="absolute" style={{ top: position.top, left: position.left }}>
                {/* Event Card */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white text-black rounded-lg p-4 shadow-md w-48"
                >
                  <div className="flex items-start mb-2">
                    <div className="mr-3">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                        <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">
                        {event.title}
                        {event.group && <span className="text-sm"> ({event.group})</span>}
                      </div>
                      <div className="text-xs">• {event.location}</div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Connection line to next event */}
                {index < arr.length - 1 && (
                  <svg 
                    className="absolute top-1/2 left-1/2 z-0 pointer-events-none" 
                    style={{ 
                      width: '150px', 
                      height: '100px',
                      transform: arr[index + 1] && calculateNodePosition(index + 1, arr.length).top === '25%' 
                        ? 'rotate(45deg)' 
                        : 'rotate(-45deg)'
                    }}
                  >
                    <line 
                      x1="0" 
                      y1="0" 
                      x2="150" 
                      y2="100" 
                      stroke="white" 
                      strokeWidth="1"
                    />
                  </svg>
                )}
              </div>
            );
          })}

          {/* Timeline label */}
          <div className="absolute bottom-8 right-16 font-cursive text-blue-500 text-3xl transform rotate-2">
            timeline &#8594;
          </div>
        </div>
      </div>

      {/* Add Event Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-10 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </motion.button>
      
      {/* Add Event Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white text-black rounded-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Event</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="eventTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Event Title
                  </label>
                  <input
                    type="text"
                    id="eventTitle"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    placeholder="Enter event title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                    autoFocus
                  />
                </div>
                
                <div>
                  <label htmlFor="eventTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    id="eventTime"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                  />
                </div>
                
                <div>
                  <label htmlFor="eventLocation" className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    id="eventLocation"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                    placeholder="Enter location"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                  />
                </div>
                
                <div>
                  <label htmlFor="eventGroup" className="block text-sm font-medium text-gray-700 mb-1">
                    Group (Optional)
                  </label>
                  <input
                    type="text"
                    id="eventGroup"
                    value={newEvent.group || ''}
                    onChange={(e) => setNewEvent({...newEvent, group: e.target.value})}
                    placeholder="e.g. group 1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                  />
                </div>
                
                <div className="flex space-x-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddEvent}
                    disabled={!newEvent.title.trim() || !newEvent.time}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Event
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Future integration comment */}
      {/* 
        TODO: 
        - Add event editing functionality
        - Implement drag-and-drop for events
        - Add group color coding
        - Connect with Supabase for real-time collaboration
      */}
    </div>
  );
};

export default TimelinePlanningMode; 