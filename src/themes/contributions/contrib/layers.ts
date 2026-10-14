// Layer labels for the MLP and CNN stages, derived from the layouts the cells
// morph into (../net/layouts), never typed in by hand. Pure: no three, no DOM.
//
// A layout only exposes node positions, so layers are recovered from them:
// every layer of both networks is a grid standing in a plane of constant x.
// MLP: one plane per layer. CNN: consecutive planes with the same grid are
// the stacked feature maps of one conv layer.

import { NODE_COUNT, buildLayouts, type Layout } from "../net/layouts";

export interface LayerLabel {
  /** Full name, e.g. "Hidden layer". */
  name: string;
  /** Full count, e.g. "12" or "4 maps, 6 × 6". */
  count: string;
  /** Narrow-container forms. */
  shortName: string;
  shortCount: string;
  /** World point just above the layer, where the label's leader ends. */
  anchor: [number, number, number];
}

/** World units between a layer's top node centre and its label anchor. */
const ABOVE = 0.42;

interface Plane {
  x: number;
  nodes: number[];
  rows: number; // distinct y values
  cols: number; // distinct z values
}

const key = (v: number) => Math.round(v * 1000);

function planes(L: Layout): Plane[] {
  const byX = new Map<number, number[]>();
  for (let k = 0; k < NODE_COUNT; k++) {
    if (L.scale[k] <= 0) continue;
    const x = key(L.pos[k * 3]);
    const list = byX.get(x);
    if (list) list.push(k);
    else byX.set(x, [k]);
  }
  return [...byX.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([x, nodes]) => ({
      x: x / 1000,
      nodes,
      rows: new Set(nodes.map((k) => key(L.pos[k * 3 + 1]))).size,
      cols: new Set(nodes.map((k) => key(L.pos[k * 3 + 2]))).size,
    }));
}

function anchorOf(L: Layout, nodes: number[]): [number, number, number] {
  let x = 0;
  let z = 0;
  let top = -Infinity;
  for (const k of nodes) {
    x += L.pos[k * 3];
    z += L.pos[k * 3 + 2];
    top = Math.max(top, L.pos[k * 3 + 1]);
  }
  return [x / nodes.length, top + ABOVE, z / nodes.length];
}

const dims = (p: Plane) => `${p.rows} × ${p.cols}`;

function mlpLabels(L: Layout): LayerLabel[] {
  const ps = planes(L);
  return ps.map((p, i) => {
    const first = i === 0;
    const last = i === ps.length - 1;
    const name = first ? "Input layer" : last ? "Output" : "Hidden layer";
    const shortName = first ? "Input" : last ? "Output" : "Hidden";
    const count = String(p.nodes.length);
    return { name, count, shortName, shortCount: count, anchor: anchorOf(L, p.nodes) };
  });
}

function cnnLabels(L: Layout): LayerLabel[] {
  // Merge runs of identical grids (after the input image) into conv blocks.
  const ps = planes(L);
  const blocks: Plane[][] = [];
  ps.forEach((p, i) => {
    const prev = blocks[blocks.length - 1];
    const same = prev && i > 1 && prev[0].nodes.length === p.nodes.length && prev[0].rows === p.rows && prev[0].cols === p.cols;
    if (same) prev.push(p);
    else blocks.push([p]);
  });
  let conv = 0;
  return blocks.map((block, i) => {
    const nodes = block.flatMap((p) => p.nodes);
    const anchor = anchorOf(L, nodes);
    const p = block[0];
    if (i === 0) return { name: "Input image", count: dims(p), shortName: "Input", shortCount: dims(p), anchor };
    if (i === blocks.length - 1) return { name: "Classes", count: String(nodes.length), shortName: "Classes", shortCount: String(nodes.length), anchor };
    if (block.length > 1) {
      conv += 1;
      const maps = `${block.length} maps`;
      return { name: `Conv ${conv}`, count: `${maps}, ${dims(p)}`, shortName: `Conv ${conv}`, shortCount: maps, anchor };
    }
    return { name: "Dense", count: String(nodes.length), shortName: "Dense", shortCount: String(nodes.length), anchor };
  });
}

/** [MLP labels, CNN labels], left to right. */
export function buildLayerLabels(): [LayerLabel[], LayerLabel[]] {
  const [mlp, cnn] = buildLayouts();
  return [mlpLabels(mlp), cnnLabels(cnn)];
}
