// Where every drawn contribution cell sits in each of the three stages.
// Pure data: no three, no DOM. The graph lies in the xy plane facing +z; the
// MLP and CNN reuse the network canvas's layouts (../net/layouts) unchanged.
//
// Stage 1 (MLP): letter cells take the MLP's nodes in left-to-right order. The
// MLP has fewer nodes than letters, so letters are spread over the nodes
// proportionally; the first letter on a node is its "primary" and draws it,
// the rest merge into the same spot with size 0. Non-letter cells sink back.
// Stage 2 (CNN): every drawn cell (sorted by col, row) takes a CNN node (sorted
// by x, then top-down y), the same way. When the graph has fewer cells than
// the CNN has nodes, nodes are dropped evenly from the feature maps.

import { NODE_COUNT, buildLayouts, type Layout } from "../net/layouts";
import { CELLS, WEEKS, WORD_END, WORD_START, type Cell } from "./grid";

/** Centre-to-centre distance of two graph cells (world units). */
export const PITCH = 0.26;
/** Side of one graph cell: GitHub's gap is about 22% of the cell. */
export const CELL = PITCH / 1.22;
/** Diameter of a net node of scale 1 (the network layouts' node radius × 2). */
const NODE_DIAM = 0.34;
/** Network cubes are a touch larger than the net's spheres: a cube reads smaller. */
const CUBE_GAIN = 1.15;
/** How far non-letter cells sink behind the graph plane in the MLP stage. */
const SINK_Z = -2.6;
/** Their size there, as a share of a graph cell. */
const SINK_SIZE = 0.42;

/** Role of a cell in a network stage. */
export const Role = {
  /** Not part of the network: sunk (MLP stage). */
  Idle: 0,
  /** Draws a node. */
  Node: 1,
  /** Shares a node with a primary cell; shrinks to nothing on top of it. */
  Merged: 2,
} as const;

/** CNN node kinds, for colouring. */
export const CnnKind = {
  None: 0,
  Input: 1,
  Feature: 2,
  Dense: 3,
} as const;

export interface Targets {
  /** Drawn cells, in instance order. */
  cells: Cell[];
  count: number;
  /** count * 3 positions per stage. */
  graphPos: Float32Array;
  mlpPos: Float32Array;
  cnnPos: Float32Array;
  /** count world-unit cube sides per stage. */
  graphSize: Float32Array;
  mlpSize: Float32Array;
  cnnSize: Float32Array;
  mlpRole: Uint8Array;
  cnnRole: Uint8Array;
  cnnKind: Uint8Array;
  /** 0..1 position of the cell's column across the whole graph. */
  colNorm: Float32Array;
  /** 0..1 position of a letter's column across the word (0 for other cells). */
  wordNorm: Float32Array;
  /** Flat cell-index pairs. */
  mlpEdges: Uint16Array;
  cnnEdges: Uint16Array;
  /** Graph frame boxes [x0, x1, y0, y1]: the whole graph, and the word only. */
  graphBox: [number, number, number, number];
  wordBox: [number, number, number, number];
  /** Every network-stage node as [x, y, z, radius]: what the network camera frames. */
  netFit: Float32Array;
}

type Assignment = { primary: Int32Array; nodeOfItem: Int32Array };

// Spreads `items` (already ordered) over `nodes` (already ordered). Returns the
// node each item lands on and, per node slot, the item that draws it (-1 none).
function assign(items: number, nodes: number[], droppable: (node: number) => boolean): Assignment {
  let kept = nodes;
  if (items < nodes.length) {
    const drop = nodes.length - items;
    const pool = nodes.filter(droppable);
    const gone = new Set<number>();
    const from = pool.length >= drop ? pool : nodes;
    for (let i = 0; i < drop; i++) gone.add(from[Math.floor(((i + 0.5) * from.length) / drop)]);
    kept = nodes.filter((n) => !gone.has(n));
  }
  const primary = new Int32Array(NODE_COUNT).fill(-1);
  const nodeOfItem = new Int32Array(items).fill(-1);
  if (kept.length === 0) return { primary, nodeOfItem };
  for (let i = 0; i < items; i++) {
    const node = kept[Math.min(kept.length - 1, Math.floor((i * kept.length) / items))];
    nodeOfItem[i] = node;
    if (primary[node] < 0) primary[node] = i;
  }
  return { primary, nodeOfItem };
}

const visibleNodes = (L: Layout) => {
  const out: number[] = [];
  for (let k = 0; k < NODE_COUNT; k++) if (L.scale[k] > 0) out.push(k);
  // Left to right, then top to bottom, then front to back.
  return out.sort((a, b) => L.pos[a * 3] - L.pos[b * 3] || L.pos[b * 3 + 1] - L.pos[a * 3 + 1] || L.pos[b * 3 + 2] - L.pos[a * 3 + 2]);
};

function edgesOf(L: Layout, primary: Int32Array, cellOfItem: (item: number) => number): Uint16Array {
  const out: number[] = [];
  for (let e = 0; e < L.edgeCount; e++) {
    const a = primary[L.edges[e * 2]];
    const b = primary[L.edges[e * 2 + 1]];
    if (a >= 0 && b >= 0) out.push(cellOfItem(a), cellOfItem(b));
  }
  return Uint16Array.from(out);
}

export function buildTargets(): Targets {
  const cells = CELLS.filter((c) => c.letter || c.level >= 0);
  const count = cells.length;
  const [mlp, cnn] = buildLayouts();

  const graphPos = new Float32Array(count * 3);
  const mlpPos = new Float32Array(count * 3);
  const cnnPos = new Float32Array(count * 3);
  const graphSize = new Float32Array(count).fill(CELL);
  const mlpSize = new Float32Array(count);
  const cnnSize = new Float32Array(count);
  const mlpRole = new Uint8Array(count);
  const cnnRole = new Uint8Array(count);
  const cnnKind = new Uint8Array(count);
  const colNorm = new Float32Array(count);
  const wordNorm = new Float32Array(count);
  const wordSpan = Math.max(1, WORD_END - 1 - WORD_START);

  cells.forEach((c, i) => {
    const x = (c.col - (WEEKS - 1) / 2) * PITCH;
    const y = (3 - c.row) * PITCH;
    graphPos.set([x, y, 0], i * 3);
    // Default MLP target: sink back in place, small and (via colour) faded.
    mlpPos.set([x, y, SINK_Z], i * 3);
    mlpSize[i] = CELL * SINK_SIZE;
    colNorm[i] = WEEKS > 1 ? c.col / (WEEKS - 1) : 0;
    wordNorm[i] = c.letter ? Math.min(1, Math.max(0, (c.col - WORD_START) / wordSpan)) : 0;
  });

  const byColRow = (a: number, b: number) => cells[a].col - cells[b].col || cells[a].row - cells[b].row;

  // MLP: letters, left to right.
  const letters = cells.map((_, i) => i).filter((i) => cells[i].letter).sort(byColRow);
  const mlpNodes = visibleNodes(mlp);
  const m = assign(letters.length, mlpNodes, () => true);
  letters.forEach((cell, item) => {
    const node = m.nodeOfItem[item];
    if (node < 0) return;
    mlpPos.set(mlp.pos.subarray(node * 3, node * 3 + 3), cell * 3);
    const own = m.primary[node] === item;
    mlpRole[cell] = own ? Role.Node : Role.Merged;
    mlpSize[cell] = own ? NODE_DIAM * mlp.scale[node] * CUBE_GAIN : 0;
  });

  // CNN: every drawn cell, col then row.
  const all = cells.map((_, i) => i).sort(byColRow);
  const cnnNodes = visibleNodes(cnn);
  let minX = Infinity;
  for (const k of cnnNodes) minX = Math.min(minX, cnn.pos[k * 3]);
  const kindOf = (k: number) => (cnn.pos[k * 3] <= minX + 1e-3 ? CnnKind.Input : cnn.scale[k] > 0.8 ? CnnKind.Dense : CnnKind.Feature);
  const c = assign(all.length, cnnNodes, (k) => kindOf(k) === CnnKind.Feature);
  all.forEach((cell, item) => {
    const node = c.nodeOfItem[item];
    if (node < 0) return;
    cnnPos.set(cnn.pos.subarray(node * 3, node * 3 + 3), cell * 3);
    const own = c.primary[node] === item;
    cnnRole[cell] = own ? Role.Node : Role.Merged;
    cnnKind[cell] = kindOf(node);
    cnnSize[cell] = own ? NODE_DIAM * cnn.scale[node] * CUBE_GAIN : 0;
  });

  const mlpEdges = edgesOf(mlp, m.primary, (item) => letters[item]);
  const cnnEdges = edgesOf(cnn, c.primary, (item) => all[item]);

  const half = CELL / 2;
  const colX = (col: number) => (col - (WEEKS - 1) / 2) * PITCH;
  const yTop = 3 * PITCH + half;
  const yBottom = -3 * PITCH - half;
  const graphBox: [number, number, number, number] = [colX(0) - half, colX(WEEKS - 1) + half, yBottom, yTop];
  const w0 = Math.max(0, WORD_START - 2);
  const w1 = Math.min(WEEKS - 1, WORD_END + 1);
  const wordBox: [number, number, number, number] = [colX(w0) - half, colX(w1) + half, yBottom, yTop];

  const fit: number[] = [];
  for (let i = 0; i < count; i++) {
    for (const [pos, size, role] of [
      [mlpPos, mlpSize, mlpRole],
      [cnnPos, cnnSize, cnnRole],
    ] as const) {
      if (role[i] !== Role.Node) continue;
      // Half the cube's space diagonal: the cube's bounding sphere.
      fit.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2], size[i] * 0.87);
    }
  }

  return {
    cells,
    count,
    graphPos,
    mlpPos,
    cnnPos,
    graphSize,
    mlpSize,
    cnnSize,
    mlpRole,
    cnnRole,
    cnnKind,
    colNorm,
    wordNorm,
    mlpEdges,
    cnnEdges,
    graphBox,
    wordBox,
    netFit: Float32Array.from(fit),
  };
}
