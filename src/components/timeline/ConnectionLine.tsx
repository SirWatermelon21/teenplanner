'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Event, Connection, Point } from './types';
import { 
  EVENT_CARD_WIDTH, 
  EVENT_CARD_HEIGHT, 
  CONNECTION_LINE_COLOR,
  CONNECTION_LINE_WIDTH, 
  LINE_GLOW_FILTER_ID, 
  TRANSPORT_ICON_RADIUS, 
  TRANSPORT_ICON_BG_COLOR, 
  TRANSPORT_ICON_EMOJI_SIZE,
  transportColorMap
} from './constants';
import { getPointOnCubicBezier } from './utils';

interface ConnectionLineProps {
  connection: Connection;
  fromEvent: Event;
  toEvent: Event;
}

const ConnectionLine: React.FC<ConnectionLineProps> = ({ connection, fromEvent, toEvent }) => {
  if (!fromEvent || !toEvent) return null;

  const p0 = { x: fromEvent.x + EVENT_CARD_WIDTH / 2, y: fromEvent.y + EVENT_CARD_HEIGHT / 2 };
  const p1 = { x: toEvent.x + EVENT_CARD_WIDTH / 2, y: toEvent.y + EVENT_CARD_HEIGHT / 2 };
  let pathData = ``, midpoint: Point = { x: 0, y: 0 };
  let c1: Point, c2: Point;

  if (Math.abs(p0.y - p1.y) < 10) { 
    pathData = `M ${p0.x},${p0.y} L ${p1.x},${p1.y}`;
    midpoint = { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 };
  } else {
    c1 = { x: p0.x + (p1.x - p0.x) * 0.3, y: p0.y };
    c2 = { x: p1.x - (p1.x - p0.x) * 0.3, y: p1.y };
    pathData = `M ${p0.x},${p0.y} C ${c1.x},${c1.y} ${c2.x},${c2.y} ${p1.x},${p1.y}`;
    midpoint = getPointOnCubicBezier(p0, c1, c2, p1, 0.5);
  }

  const lineColor = transportColorMap[connection.transportEmoji] || CONNECTION_LINE_COLOR;

  return (
    <React.Fragment key={`${connection.id}-${connection.version}-fragment`}>
      <motion.path
        key={`${connection.id}-${connection.version}-path`}
        d={pathData}
        stroke={lineColor}
        strokeWidth={CONNECTION_LINE_WIDTH}
        fill="none"
        filter={`url(#${LINE_GLOW_FILTER_ID})`}
        initial={{ opacity: 0, pathLength: 0 }}
        animate={{ opacity: 1, pathLength: 1 }}
        exit={{ opacity: 0, pathLength: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      />
      <motion.g
        key={`${connection.id}-${connection.version}-icon`}
        initial={{ opacity: 0, scale: 0.5, x: midpoint.x, y: midpoint.y }}
        animate={{ opacity: 1, scale: 1, x: midpoint.x, y: midpoint.y }}
        exit={{ opacity: 0, scale: 0.5, x: midpoint.x, y: midpoint.y }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <circle cx="0" cy="0" r={TRANSPORT_ICON_RADIUS} fill={TRANSPORT_ICON_BG_COLOR} />
        <text x="0" y="0" textAnchor="middle" dominantBaseline="central" style={{ fontSize: TRANSPORT_ICON_EMOJI_SIZE, userSelect: 'none' }}>{connection.transportEmoji}</text>
      </motion.g>
    </React.Fragment>
  );
};

export default ConnectionLine; 