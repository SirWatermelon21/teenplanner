'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NewConnectionData } from './types';
import { transportEmojis, distanceUnits, timeUnits } from './constants';

interface ConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NewConnectionData) => void;
  onCreateGeneric: () => void;
}

const defaultConnectionData: NewConnectionData = {
  transportEmoji: transportEmojis[0].emoji,
  distanceValue: undefined,
  distanceUnit: distanceUnits[0].value,
  timeValue: undefined,
  timeUnit: timeUnits[0].value,
};

const ConnectionModal: React.FC<ConnectionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onCreateGeneric,
}) => {
  const [internalConnectionData, setInternalConnectionData] = useState<NewConnectionData>(defaultConnectionData);

  useEffect(() => {
    if (isOpen) {
      setInternalConnectionData(defaultConnectionData);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const valueToSet = e.target.type === 'number' ? (value === '' ? undefined : parseFloat(value)) : value;
    setInternalConnectionData(prev => ({ ...prev, [name]: valueToSet }));
  };

  const handleSave = () => {
    if (!internalConnectionData.transportEmoji) {
      alert("Transportation type is required.");
      return;
    }
    onSave(internalConnectionData);
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
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Connection Details</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="transportEmoji" className="block text-sm font-medium text-gray-700 mb-1">
                  Transportation <span className="text-red-500">*</span>
                </label>
                <select
                  id="transportEmoji"
                  name="transportEmoji"
                  value={internalConnectionData.transportEmoji}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black shadow-sm"
                  required
                >
                  {transportEmojis.map(item => (
                    <option key={item.emoji} value={item.emoji}>
                      {item.emoji} - {item.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Distance</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    id="distanceValue"
                    name="distanceValue"
                    value={internalConnectionData.distanceValue || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., 5"
                    className="w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black shadow-sm"
                  />
                  <select
                    id="distanceUnit"
                    name="distanceUnit"
                    value={internalConnectionData.distanceUnit || distanceUnits[0].value}
                    onChange={handleInputChange}
                    className="w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black shadow-sm"
                  >
                    {distanceUnits.map(unit => (
                      <option key={unit.value} value={unit.value}>{unit.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Time</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    id="timeValue"
                    name="timeValue"
                    value={internalConnectionData.timeValue || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., 15"
                    className="w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black shadow-sm"
                  />
                  <select
                    id="timeUnit"
                    name="timeUnit"
                    value={internalConnectionData.timeUnit || timeUnits[0].value}
                    onChange={handleInputChange}
                    className="w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black shadow-sm"
                  >
                    {timeUnits.map(unit => (
                      <option key={unit.value} value={unit.value}>{unit.label}</option>
                    ))}
                  </select>
                </div>
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
                    disabled={!internalConnectionData.transportEmoji}
                  >
                    Save Connection
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

export default ConnectionModal; 