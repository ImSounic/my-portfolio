"use client";

// The flat contribution graph as plain SVG, for browsers without WebGL2 or
// after a lost context: the same cells and colours as the canvas's Graph stage,
// no morph. Narrow containers frame the lettering only, as the canvas does.

import * as React from "react";
import { CELLS, LETTER_GREEN, WEEKS, WORD_END, WORD_START, backgroundColorOf } from "./grid";

const NARROW_PX = 640;
const CELL = 10;
const GAP = 2.2; // about 22% of the cell, as on GitHub
const PITCH = CELL + GAP;
const RADIUS = CELL * 0.18;
const FILL = 0.9; // share of the container the graph may occupy

export function ContribFallback() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [narrow, setNarrow] = React.useState(false);

  React.useEffect(() => {
    const box = ref.current;
    if (!box) return;
    const update = () => setNarrow(box.clientWidth > 0 && box.clientWidth < NARROW_PX);
    const ro = new ResizeObserver(update);
    ro.observe(box);
    update();
    return () => ro.disconnect();
  }, []);

  const c0 = narrow ? Math.max(0, WORD_START - 2) : 0;
  const c1 = narrow ? Math.min(WEEKS - 1, WORD_END + 1) : WEEKS - 1;
  const width = (c1 - c0) * PITCH + CELL;
  const height = 6 * PITCH + CELL;

  return (
    <div ref={ref} aria-hidden="true" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg
        viewBox={`${c0 * PITCH} 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        width={`${FILL * 100}%`}
        height={`${FILL * 100}%`}
        aria-hidden="true"
        focusable="false"
      >
        {CELLS.map((c) =>
          c.letter || c.level >= 0 ? (
            <rect
              key={`${c.row}-${c.col}`}
              x={c.col * PITCH}
              y={c.row * PITCH}
              width={CELL}
              height={CELL}
              rx={RADIUS}
              ry={RADIUS}
              fill={c.letter ? LETTER_GREEN : backgroundColorOf(c.shown)}
            />
          ) : null,
        )}
      </svg>
    </div>
  );
}
