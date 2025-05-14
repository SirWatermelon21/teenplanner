'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Event {
  id: string;
  title: string;
  time: string;
  location?: string;
  group?: string;
}

interface TimelinePlanningModeProps {
  events?: Event[];
}

const TimelinePlanningMode = ({ 
  events: initialEvents = []
}: TimelinePlanningModeProps) => {
  // Default initial events if none provided
  const defaultEvents: Event[] = initialEvents.length > 0 ? initialEvents : [
    { id: '1', title: 'Event', time: '09:00', location: 'New York' },
    { id: '2', title: 'Pizza', time: '12:00', location: 'New York', group: 'group 1' },
    { id: '3', title: 'Laser Tag', time: '15:00', location: 'New York', group: 'group 2' },
    { id: '4', title: 'Event', time: '18:00', location: 'New York' },
  ];
  
  const [events] = useState<Event[]>(defaultEvents);

  // Sort events by time
  const sortedEvents = [...events].sort((a, b) => {
    const [hoursA, minutesA] = a.time.split(':').map(Number);
    const [hoursB, minutesB] = b.time.split(':').map(Number);
    const timeA = hoursA * 60 + minutesA;
    const timeB = hoursB * 60 + minutesB;
    return timeA - timeB;
  });

  return (
    <div className="relative h-full w-full bg-black text-white overflow-hidden p-8">
      <div className="flex flex-col items-center justify-center h-full">
        <div className="relative">
          {/* Main vertical timeline line */}
          <div className="absolute h-full w-4 bg-white left-1/2 transform -translate-x-1/2 z-0" />
          
          {/* Events */}
          {sortedEvents.map((event, index) => (
            <div key={event.id} className="relative mb-20">
              {/* Event Node */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-blue-500 text-white rounded-full p-4 w-64 h-16 flex items-center justify-center z-10 relative"
              >
                <div className="text-center">
                  <div className="font-medium text-lg">
                    {event.title}
                    {event.group && <div className="text-sm font-normal">({event.group})</div>}
                  </div>
                  <div className="text-xs mt-1">{event.time} - {event.location}</div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelinePlanningMode; 