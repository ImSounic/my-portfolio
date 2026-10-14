// The three states the contribution hero morphs between, keyed by scroll
// progress (0 = flat contribution graph, 1 = MLP, 2 = CNN). Pure: safe to
// import without three.

export type ContribStage = "Graph" | "MLP" | "CNN";

export const CONTRIB_STAGES: readonly ContribStage[] = ["Graph", "MLP", "CNN"];

/** Index (0, 1 or 2) of the stage nearest to `progress`. */
export function contribStageIndex(progress: number): 0 | 1 | 2 {
  if (!Number.isFinite(progress)) return 0;
  const i = Math.round(Math.min(2, Math.max(0, progress)));
  return i === 0 ? 0 : i === 1 ? 1 : 2;
}

/** Name of the stage nearest to `progress`. */
export function stageOf(progress: number): ContribStage {
  return CONTRIB_STAGES[contribStageIndex(progress)];
}
