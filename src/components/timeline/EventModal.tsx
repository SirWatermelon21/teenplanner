'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NewEventData } from './types';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NewEventData) => void;
  onCreateGeneric: () => void;
  initialEventData?: NewEventData;
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onCreateGeneric,
  initialEventData,
}) => {
  const [internalNewEventData, setInternalNewEventData] = useState<NewEventData>(
    initialEventData || { title: '', time: '', location: '' }
  );

  useEffect(() => {
    if (isOpen) {
      setInternalNewEventData(initialEventData || { title: '', time: '', location: '' });
    }
  }, [isOpen, initialEventData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInternalNewEventData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!internalNewEventData.title.trim() || !internalNewEventData.time) {
      alert("Event Title and Time are required.");
      return;
    }
    onSave(internalNewEventData);
  };
  
  const handleCreateGeneric = () => {
    onCreateGeneric();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-40"
          onClick={onClose}
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
                <label htmlFor="eventTitleModal" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="eventTitleModal"
                  name="title"
                  value={internalNewEventData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Museum Visit"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black shadow-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="eventTimeModal" className="block text-sm font-medium text-gray-700 mb-1">
                  Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  id="eventTimeModal"
                  name="time"
                  value={internalNewEventData.time}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black shadow-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="eventLocationModal" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="eventLocationModal"
                  name="location"
                  value={internalNewEventData.location || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., City Center Art Gallery"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black shadow-sm"
                />
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 justify-end pt-4">
                <motion.button
                  type="button"
                  onClick={handleCreateGeneric}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 font-medium w-full sm:w-auto"
                >
                  Create Generic
                </motion.button>
                <div className="flex space-x-3 w-full sm:w-auto">
                  <motion.button
                    type="button"
                    onClick={onClose}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium flex-1 sm:flex-initial"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleSave}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed font-medium flex-1 sm:flex-initial shadow-md"
                    disabled={!internalNewEventData.title.trim() || !internalNewEventData.time}
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
  );
};

export default EventModal; 