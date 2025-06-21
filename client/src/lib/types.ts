export interface BinaryConverterState {
  binaryInput: string;
  decimalResult: number;
  isValid: boolean;
}

export interface QuizState {
  currentQuestion: number;
  selectedAnswer: string;
  isAnswered: boolean;
  score: number;
  totalQuestions: number;
}

export interface GameStats {
  binaryRaceScore: number;
  networksBuilt: number;
  puzzlesSolved: number;
}

export interface WeeklyGoal {
  title: string;
  current: number;
  target: number;
  progress: number;
}
