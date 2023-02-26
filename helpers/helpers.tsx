export enum Difficulty {
  Easy = "EASY",
  Medium = "MEDIUM",
  Hard = "HARD",
}

export function getColorDifficulty(difficulty: string) {
  if (Difficulty.Easy === difficulty.toUpperCase()) return `bg-green-500`;
  if (Difficulty.Medium === difficulty.toUpperCase()) return `bg-yellow-400`;
  if (Difficulty.Hard === difficulty.toUpperCase()) return `bg-red-500`;

  return "bg-blue-500";
}
