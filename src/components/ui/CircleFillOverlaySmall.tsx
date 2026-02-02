// src/components/ui/CircleFillOverlaySmall.tsx
'use client'

/**
 * Smaller circle variant for compact buttons (e.g. About nav arrows).
 */

const CIRCLE_POSITIONS = [
  // Corners
  { top: '0%', left: '0%' },
  { top: '0%', left: '100%' },
  { top: '100%', left: '0%' },
  { top: '100%', left: '100%' },
  // Edge midpoints
  { top: '0%', left: '50%' },
  { top: '100%', left: '50%' },
  { top: '50%', left: '0%' },
  { top: '50%', left: '100%' },
]

export default function CircleFillOverlaySmall() {
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
            width: '6px',
            height: '6px',
            background: '#E9F5DB',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%) scale(0)',
            transition: `transform 0.4s cubic-bezier(0.23, 1, 0.32, 1) ${i * 0.012}s`,
            pointerEvents: 'none' as const,
            zIndex: 0,
          }}
        />
      ))}
    </>
  )
}
