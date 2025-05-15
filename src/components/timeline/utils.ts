import { Point } from './types';

// Helper to get a point on a cubic Bezier curve
export function getPointOnCubicBezier(p0:Point, c1:Point, c2:Point, p1:Point, t:number): Point {
  const tInv = 1 - t;
  const tInvSq = tInv * tInv;
  const tSq = t * t;
  return {
    x: tInvSq * tInv * p0.x + 3 * tInvSq * t * c1.x + 3 * tInv * tSq * c2.x + tSq * t * p1.x,
    y: tInvSq * tInv * p0.y + 3 * tInvSq * t * c1.y + 3 * tInv * tSq * c2.y + tSq * t * p1.y,
  };
} 