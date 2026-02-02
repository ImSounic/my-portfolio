// src/components/ui/CircleFillOverlay.tsx
'use client'

/**
 * Multiple circles that expand from distributed points on hover,
 * merging into a solid fill. Place inside a relative + overflow-hidden container.
 */

const CIRCLE_POSITIONS = [
  // Top edge
  { top: '0%', left: '0%' },
  { top: '0%', left: '15%' },
  { top: '0%', left: '30%' },
  { top: '0%', left: '50%' },
  { top: '0%', left: '70%' },
  { top: '0%', left: '85%' },
  { top: '0%', left: '100%' },
  // Bottom edge
  { top: '100%', left: '0%' },
  { top: '100%', left: '15%' },
  { top: '100%', left: '30%' },
  { top: '100%', left: '50%' },
  { top: '100%', left: '70%' },
  { top: '100%', left: '85%' },
  { top: '100%', left: '100%' },
  // Left edge
  { top: '25%', left: '0%' },
  { top: '50%', left: '0%' },
  { top: '75%', left: '0%' },
  // Right edge
  { top: '25%', left: '100%' },
  { top: '50%', left: '100%' },
  { top: '75%', left: '100%' },
  // Interior grid
  { top: '25%', left: '20%' },
  { top: '25%', left: '40%' },
  { top: '25%', left: '60%' },
  { top: '25%', left: '80%' },
  { top: '50%', left: '20%' },
  { top: '50%', left: '40%' },
  { top: '50%', left: '60%' },
  { top: '50%', left: '80%' },
  { top: '75%', left: '20%' },
  { top: '75%', left: '40%' },
  { top: '75%', left: '60%' },
  { top: '75%', left: '80%' },
]

export default function CircleFillOverlay() {
  return (
    <>
      {CIRCLE_POSITIONS.map((pos, i) => (
        <span
          key={i}
          className="circle-dot"
          style={{
            position: 'absolute',
            top: pos.top,
            left: pos.left,
            width: '10px',
            height: '10px',
            background: '#E9F5DB',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%) scale(0)',
            transition: `transform 0.45s cubic-bezier(0.23, 1, 0.32, 1) ${i * 0.015}s`,
            pointerEvents: 'none' as const,
            zIndex: 0,
          }}
        />
      ))}
    </>
  )
}
