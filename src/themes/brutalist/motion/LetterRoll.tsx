import type { CSSProperties, ElementType } from 'react'

type Props = {
  text: string
  as?: ElementType
  className?: string
  style?: CSSProperties
}

// Each character is a two-row column; on hover the column rolls up one row.
// Hover fires on the element itself or on an ancestor marked data-lr-host, so
// a whole button or link can drive the roll. Styles live in brutalist.css.
export function LetterRoll({ text, as = 'span', className, style }: Props) {
  const Tag = as
  const chars = Array.from(text)
  return (
    <Tag className={`bz-lr ${className ?? ''}`} style={style}>
      <span className="bz-lr__sr">{text}</span>
      <span className="bz-lr__stack" aria-hidden="true">
        {chars.map((ch, i) => {
          const glyph = ch === ' ' ? ' ' : ch
          return (
            <span key={i} className="bz-lr__ch" style={{ '--i': i } as CSSProperties}>
              <span className="bz-lr__col">
                <span>{glyph}</span>
                <span>{glyph}</span>
              </span>
            </span>
          )
        })}
      </span>
    </Tag>
  )
}
