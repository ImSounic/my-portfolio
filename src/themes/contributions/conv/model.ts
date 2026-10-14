// The truth source for the contact printer figure: a real 2D convolution of the input shown.
// Every number on the page (cell, sum, every output tone, the kernel plate's tones) comes from here.

export const SIZE = 12; // input and output are 12 x 12

export type KernelName = "edges" | "blur" | "sharpen";
export type Grid = number[][];

// The input: a house (walls, roof, chimney, door, two windows) on a dark ground. 0 = black, 1 = white.
const GROUND = 0.12;
const WALL = 0.84;
const ROOF = 0.58;
const DARK = 0.3;
export const INPUT: Grid = (() => {
  const grid: Grid = Array.from({ length: SIZE }, () => Array<number>(SIZE).fill(GROUND));
  const roof: [number, number, number][] = [
    [1, 5, 6],
    [2, 4, 7],
    [3, 3, 8],
    [4, 2, 9],
  ];
  for (const [row, from, to] of roof) for (let col = from; col <= to; col++) grid[row][col] = ROOF;
  grid[1][8] = ROOF; // chimney
  grid[2][8] = ROOF;
  for (let row = 5; row <= 10; row++) for (let col = 3; col <= 8; col++) grid[row][col] = WALL;
  for (let row = 8; row <= 10; row++) for (let col = 5; col <= 6; col++) grid[row][col] = DARK; // door
  grid[6][4] = DARK; // windows
  grid[6][7] = DARK;
  return grid;
})();

export const KERNELS: Record<KernelName, { name: string; weights: Grid }> = {
  edges: { name: "Edges", weights: [[0, 1, 0], [1, -4, 1], [0, 1, 0]] }, // Laplacian
  blur: { name: "Blur", weights: [[1 / 9, 1 / 9, 1 / 9], [1 / 9, 1 / 9, 1 / 9], [1 / 9, 1 / 9, 1 / 9]] }, // 3x3 box
  sharpen: { name: "Sharpen", weights: [[0, -1, 0], [-1, 5, -1], [0, -1, 0]] },
};
export const ORDER: readonly KernelName[] = ["edges", "blur", "sharpen"];

// Padding: "same" size output. Pixels outside the input are taken from the nearest border pixel
// (edge replication), so the border of the picture does not read as an edge.
const at = (row: number, col: number) => INPUT[Math.min(SIZE - 1, Math.max(0, row))][Math.min(SIZE - 1, Math.max(0, col))];

// True convolution flips the kernel; all three kernels here are symmetric, so the flip changes nothing,
// and the sum below is both the correlation and the convolution.
export function sumAt(kernel: KernelName, row: number, col: number) {
  const w = KERNELS[kernel].weights;
  let sum = 0;
  for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) sum += w[1 - i][1 - j] * at(row + i, col + j);
  return sum;
}

export function sumsOf(kernel: KernelName): Grid {
  return Array.from({ length: SIZE }, (_, row) => Array.from({ length: SIZE }, (_, col) => sumAt(kernel, row, col)));
}

// Display tone (0 black .. 1 white) for an output sum. How each kernel is shown, honestly:
//   edges:   |sum| divided by the largest |sum| in this map (a Laplacian is signed; both signs are edges)
//   blur:    the sum as it is (an average of values in 0..1 stays in 0..1)
//   sharpen: the sum clipped to 0..1 (overshoot past black or white is cut, as paper would)
export function displayOf(kernel: KernelName): Grid {
  const sums = sumsOf(kernel);
  if (kernel === "edges") {
    let most = 0;
    for (const row of sums) for (const s of row) most = Math.max(most, Math.abs(s));
    return sums.map((row) => row.map((s) => Math.abs(s) / (most || 1)));
  }
  return sums.map((row) => row.map((s) => Math.min(1, Math.max(0, s))));
}

// The kernel plate's cell tones: weight / largest |weight|, -1 .. 1 (positive lighter, negative darker).
export function plateOf(kernel: KernelName): Grid {
  const w = KERNELS[kernel].weights;
  const most = Math.max(...w.flat().map(Math.abs));
  return w.map((row) => row.map((v) => v / most));
}

export const CELLS = SIZE * SIZE; // scan positions 0..CELLS-1; position CELLS means the pass is finished
export const cellOf = (index: number) => ({ row: Math.floor(index / SIZE), col: index % SIZE });

const fmt = (value: number) => {
  const text = value.toFixed(2);
  return text === "-0.00" ? "0.00" : text.replace("-", "−");
};

export function readoutOf(kernel: KernelName, index: number) {
  const name = KERNELS[kernel].name;
  if (index >= CELLS) return `${name} kernel. Pass complete: ${CELLS} cells, one sum each.`;
  const { row, col } = cellOf(index);
  return `${name} kernel. Cell ${row + 1}, ${col + 1}: sum ${fmt(sumAt(kernel, row, col))}`;
}

export function valueTextOf(index: number) {
  if (index >= CELLS) return "Pass complete";
  const { row, col } = cellOf(index);
  return `Cell ${row + 1}, ${col + 1}`;
}
