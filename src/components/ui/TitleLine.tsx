// src/components/ui/TitleLine.tsx
'use client'

interface TitleLineProps {
  flipped?: boolean
}

export default function TitleLine({ flipped = false }: TitleLineProps) {
  return (
    <div className={`relative h-[120px] w-[350px] ${flipped ? 'scale-x-[-1]' : ''}`}>
      {/* Horizontal line */}
      <div className="absolute top-0 left-0 w-[200px] h-[3px] bg-[#35EE17]" />
      
      {/* Diagonal line */}
      <div 
        className="absolute top-0 left-[200px] w-[180px] h-[3px] bg-[#35EE17] origin-left"
        style={{ transform: 'rotate(45deg)' }}
      />
      
      {/* Glowing dot */}
      <div className="absolute top-[115px] left-[310px]">
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 w-[16px] h-[16px] bg-[#35EE17] rounded-full blur-md opacity-80" />
          <div className="absolute inset-0 w-[16px] h-[16px] bg-[#35EE17] rounded-full blur-sm opacity-60" />
          {/* Core dot */}
          <div className="w-[16px] h-[16px] bg-[#35EE17] rounded-full" />
          {/* Ring around dot */}
          <div className="absolute -inset-[4px] border-2 border-[#35EE17] rounded-full opacity-50" />
        </div>
      </div>
    </div>
  )
}
