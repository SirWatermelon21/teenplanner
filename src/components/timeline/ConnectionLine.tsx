'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Connection, Point } from './types';
import { 
  CONNECTION_LINE_WIDTH, 
  LINE_GLOW_FILTER_ID, 
  TRANSPORT_ICON_RADIUS, 
  TRANSPORT_ICON_EMOJI_SIZE,
  transportColorMap,
  CONNECTION_LINE_COLOR,
  EVENT_CARD_WIDTH,
  EVENT_CARD_HEIGHT
} from './constants';
import { getPointOnCubicBezier } from './utils';

interface ConnectionLineProps {
  connection: Connection;
  p0: Point;
  p1: Point;
  scale: number;
}

const ConnectionLine: React.FC<ConnectionLineProps> = ({ connection, p0, p1, scale }) => {
  if (!p0 || !p1) return null;

  const controlPointOffset = 50 * scale;
  let c1: Point, c2: Point;

  const yDiff = Math.abs(p0.y - p1.y);
  const xDiff = Math.abs(p0.x - p1.x);
  
  const scaledCardWidth = EVENT_CARD_WIDTH * scale;
  const scaledCardHeight = EVENT_CARD_HEIGHT * scale;

  if (yDiff < scaledCardHeight / 2 && xDiff > scaledCardWidth) {
      const midX = (p0.x + p1.x) / 2;
      c1 = { x: midX, y: p0.y };
      c2 = { x: midX, y: p1.y };
  } else if (xDiff < scaledCardWidth / 2 && yDiff > scaledCardHeight) {
      const midY = (p0.y + p1.y) / 2;
      c1 = { x: p0.x, y: midY };
      c2 = { x: p1.x, y: midY };
  } else {
      const angle = Math.atan2(p1.y - p0.y, p1.x - p0.x);
      const dx = Math.cos(angle) * controlPointOffset;
      const dy = Math.sin(angle) * controlPointOffset;
      c1 = { x: p0.x + dx, y: p0.y + dy };
      c2 = { x: p1.x - dx, y: p1.y - dy };
  }

  const pathD = `M ${p0.x} ${p0.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${p1.x} ${p1.y}`;
  
  const iconMidPoint = getPointOnCubicBezier(p0, c1, c2, p1, 0.5);
  const currentIconRadius = TRANSPORT_ICON_RADIUS * scale;
  const baseEmojiSize = parseFloat(TRANSPORT_ICON_EMOJI_SIZE.replace('px', ''));
  const currentEmojiSize = baseEmojiSize * scale + 'px';
  const currentStrokeWidth = CONNECTION_LINE_WIDTH * scale;
  const lineColor = transportColorMap[connection.transportEmoji] || CONNECTION_LINE_COLOR;

  return (
    <motion.g 
      key={`${connection.id}-${connection.version}-group`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.path
        d={pathD}
        stroke={lineColor}
        strokeWidth={currentStrokeWidth}
        fill="none"
        filter={`url(#${LINE_GLOW_FILTER_ID})`}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        exit={{ pathLength: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
      {iconMidPoint && (
        <motion.g 
          initial={{ opacity: 0, scale: 0.5, x: iconMidPoint.x - currentIconRadius, y: iconMidPoint.y - currentIconRadius }}
          animate={{ opacity: 1, scale: 1, x: iconMidPoint.x - currentIconRadius, y: iconMidPoint.y - currentIconRadius }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3 }}
        >
          <circle
            cx={currentIconRadius}
            cy={currentIconRadius}
            r={currentIconRadius}
            fill="white"
            stroke="rgba(173, 216, 230, 0.5)"
            strokeWidth={1.5 * scale} 
          />
          <text
            x={currentIconRadius}
            y={currentIconRadius}
            textAnchor="middle"
            dominantBaseline="central"
            style={{ fontSize: currentEmojiSize, userSelect: 'none' }}
          >
            {connection.transportEmoji}
          </text>
        </motion.g>
      )}
    </motion.g>
  );
};

export default ConnectionLine; 