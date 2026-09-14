'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

export type CopyState = 'idle' | 'copied' | 'failed'

type Props = {
  email: string
  className?: string
  style?: CSSProperties
  /** Render the button contents for the current state. */
  children?: (state: CopyState) => ReactNode
  'aria-label'?: string
}

// Click copies the address. On success the label reads COPIED for 1.6 s. If
// the clipboard is unavailable the address is shown as selectable text so the
// visitor can copy it by hand; never a false COPIED.
export function CopyEmail({ email, className, style, children, ...rest }: Props) {
  const [state, setState] = useState<CopyState>('idle')
  const timer = useRef(0)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    let next: CopyState = 'copied'
    try {
      await navigator.clipboard.writeText(email)
    } catch {
      next = 'failed'
    }
    setState(next)
    clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setState('idle'), next === 'failed' ? 6000 : 1600)
  }

  if (state === 'failed') {
    return (
      <span className={className} style={{ ...style, userSelect: 'all' }} role="status">
        {email}
      </span>
    )
  }

  return (
    <button type="button" onClick={copy} className={className} style={style} aria-live="polite" data-lr-host data-cursor="COPY" {...rest}>
      {children ? children(state) : state === 'copied' ? 'COPIED' : email}
    </button>
  )
}
