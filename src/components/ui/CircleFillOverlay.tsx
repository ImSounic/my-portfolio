// src/components/ui/CircleFillOverlay.tsx
'use client'

/**
 * Multiple circles that expand from distributed points on hover,
 * merging into a solid fill. Place inside a relative + overflow-hidden container.
 */

const CIRCLE_POSITIONS = [
  // Edges and corners — 12 circles for good coverage
  { top: '0%', left: '10%' },
  { top: '0%', left: '50%' },
  { top: '0%', left: '90%' },
  { top: '50%', left: '0%' },
  { top: '50%', left: '100%' },
  { top: '100%', left: '10%' },
  { top: '100%', left: '50%' },
  { top: '100%', left: '90%' },
  // A few interior points to fill gaps
  { top: '30%', left: '25%' },
  { top: '30%', left: '75%' },
  { top: '70%', left: '25%' },
  { top: '70%', left: '75%' },
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
            width: '20px',
            height: '20px',
            background: '#E9F5DB',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%) scale(0)',
            transition: `transform 0.45s cubic-bezier(0.23, 1, 0.32, 1) ${i * 0.02}s`,
            pointerEvents: 'none' as const,
            zIndex: 0,
          }}
        />
      ))}
    </>
  )
}
