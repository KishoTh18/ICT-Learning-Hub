import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Pause, RotateCcw, Trophy, Timer, Zap } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface GameQuestion {
  binary: string;
  decimal: number;
  type: 'bin-to-dec' | 'dec-to-bin';
}

interface GameState {
  score: number;
  timeLeft: number;
  currentQuestion: number;
  isPlaying: boolean;
  isPaused: boolean;
  streak: number;
  gameQuestions: GameQuestion[];
  playerAnswer: string;
  showResult: boolean;
  bestScore: number;
}

const generateQuestion = (): GameQuestion => {
  const types: ('bin-to-dec' | 'dec-to-bin')[] = ['bin-to-dec', 'dec-to-bin'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  if (type === 'bin-to-dec') {
    const decimal = Math.floor(Math.random() * 255) + 1;
    const binary = decimal.toString(2);
    return { binary, decimal, type };
  } else {
    const decimal = Math.floor(Math.random() * 255) + 1;
    const binary = decimal.toString(2);
    return { binary, decimal, type };
  }
};

const generateQuestions = (count: number): GameQuestion[] => {
  return Array.from({ length: count }, () => generateQuestion());
};

export default function BinaryRaceGame() {
  const { toast } = useToast();
  const timerRef = useRef<NodeJS.Timeout>();
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    timeLeft: 60,
    currentQuestion: 0,
    isPlaying: false,
    isPaused: false,
    streak: 0,
    gameQuestions: [],
    playerAnswer: '',
    showResult: false,
    bestScore: parseInt(localStorage.getItem('binaryRaceBestScore') || '0'),
  });

  const currentQuestion = gameState.gameQuestions[gameState.currentQuestion];
  const progress = gameState.gameQuestions.length > 0 ? 
    ((gameState.currentQuestion + 1) / gameState.gameQuestions.length) * 100 : 0;

  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused && gameState.timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (gameState.timeLeft === 0) {
      endGame();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [gameState.isPlaying, gameState.isPaused, gameState.timeLeft]);

  const startGame = () => {
    const questions = generateQuestions(50); // Generate 50 questions for endless play
    setGameState({
      score: 0,
      timeLeft: 60,
      currentQuestion: 0,
      isPlaying: true,
      isPaused: false,
      streak: 0,
      gameQuestions: questions,
      playerAnswer: '',
      showResult: false,
      bestScore: gameState.bestScore,
    });
  };

  const pauseGame = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const endGame = () => {
    setGameState(prev => {
      const newBestScore = Math.max(prev.score, prev.bestScore);
      localStorage.setItem('binaryRaceBestScore', newBestScore.toString());
      return {
        ...prev,
        isPlaying: false,
        isPaused: false,
        bestScore: newBestScore,
      };
    });

    toast({
      title: "Game Over!",
      description: `Final Score: ${gameState.score} points`,
    });
  };

  const submitAnswer = () => {
    if (!currentQuestion || !gameState.playerAnswer.trim()) return;

    const userAnswer = gameState.playerAnswer.trim();
    let isCorrect = false;

    if (currentQuestion.type === 'bin-to-dec') {
      isCorrect = parseInt(userAnswer) === currentQuestion.decimal;
    } else {
      isCorrect = userAnswer === currentQuestion.binary;
    }

    const points = isCorrect ? (10 + gameState.streak * 2) : 0;
    const newStreak = isCorrect ? gameState.streak + 1 : 0;
    const bonusTime = isCorrect && newStreak >= 5 ? 2 : 0;

    setGameState(prev => ({
      ...prev,
      score: prev.score + points,
      streak: newStreak,
      timeLeft: Math.min(prev.timeLeft + bonusTime, 60),
      showResult: true,
    }));

    if (isCorrect) {
      toast({
        title: "Correct!",
        description: `+${points} points${bonusTime > 0 ? ' +2 bonus seconds!' : ''}`,
      });
    } else {
      toast({
        title: "Incorrect",
        description: `Correct answer: ${currentQuestion.type === 'bin-to-dec' ? currentQuestion.decimal : currentQuestion.binary}`,
        variant: "destructive",
      });
    }

    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        playerAnswer: '',
        showResult: false,
      }));
    }, 1500);
  };

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      score: 0,
      timeLeft: 60,
      currentQuestion: 0,
      isPlaying: false,
      isPaused: false,
      streak: 0,
      gameQuestions: [],
      playerAnswer: '',
      showResult: false,
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      submitAnswer();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/">
              <Button variant="ghost" className="text-white hover:bg-white hover:bg-opacity-20">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
              <Zap className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Binary Race</h1>
              <p className="text-xl opacity-90">Convert numbers as fast as you can!</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {!gameState.isPlaying ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Card className="bg-white shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-center text-3xl">
                  <Trophy className="mr-4 h-8 w-8 text-yellow-500" />
                  Binary Race Challenge
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-blue-50 rounded-xl">
                    <Zap className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Fast Conversions</h3>
                    <p className="text-gray-600">Convert between binary and decimal as quickly as possible</p>
                  </div>
                  <div className="text-center p-6 bg-purple-50 rounded-xl">
                    <Timer className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">60 Second Timer</h3>
                    <p className="text-gray-600">Beat the clock to achieve the highest score possible</p>
                  </div>
                  <div className="text-center p-6 bg-green-50 rounded-xl">
                    <Trophy className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Streak Bonus</h3>
                    <p className="text-gray-600">Get consecutive answers right for bonus points and time</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl">
                  <h3 className="text-xl font-bold mb-4">How to Play:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>• Convert binary to decimal numbers</div>
                    <div>• Convert decimal to binary numbers</div>
                    <div>• Answer as quickly as possible</div>
                    <div>• Build streaks for bonus points</div>
                    <div>• Get 5+ streak for bonus time</div>
                    <div>• Beat your personal best score</div>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{gameState.bestScore}</div>
                    <div className="text-sm text-gray-600">Best Score</div>
                  </div>
                  <Button
                    onClick={startGame}
                    className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-xl"
                  >
                    <Play className="mr-2 h-6 w-6" />
                    Start Game
                  </Button>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">60s</div>
                    <div className="text-sm text-gray-600">Game Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="bg-white shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      Score: {gameState.score}
                    </Badge>
                    <Badge variant="outline" className="text-lg px-4 py-2">
                      Streak: {gameState.streak}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className={`text-2xl font-bold ${gameState.timeLeft <= 10 ? 'text-red-500' : 'text-blue-600'}`}>
                      {gameState.timeLeft}s
                    </div>
                    <Button onClick={pauseGame} variant="outline">
                      {gameState.isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                    </Button>
                    <Button onClick={resetGame} variant="outline">
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Progress value={(gameState.timeLeft / 60) * 100} className="h-2" />
              </CardHeader>
              
              <CardContent className="space-y-8">
                {currentQuestion && (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={gameState.currentQuestion}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="text-center"
                    >
                      <div className="mb-6">
                        <Badge className="mb-4 text-sm">
                          {currentQuestion.type === 'bin-to-dec' ? 'Binary → Decimal' : 'Decimal → Binary'}
                        </Badge>
                        <div className="text-6xl font-bold font-mono mb-4 p-8 bg-gray-100 rounded-xl">
                          {currentQuestion.type === 'bin-to-dec' ? currentQuestion.binary : currentQuestion.decimal}
                        </div>
                        <p className="text-gray-600">
                          {currentQuestion.type === 'bin-to-dec' 
                            ? 'Convert this binary number to decimal'
                            : 'Convert this decimal number to binary'
                          }
                        </p>
                      </div>

                      <div className="max-w-md mx-auto">
                        <Input
                          value={gameState.playerAnswer}
                          onChange={(e) => setGameState(prev => ({ ...prev, playerAnswer: e.target.value }))}
                          onKeyPress={handleKeyPress}
                          placeholder="Enter your answer"
                          className="text-center text-2xl font-mono h-16 text-lg"
                          disabled={gameState.showResult || gameState.isPaused}
                          autoFocus
                        />
                        <Button
                          onClick={submitAnswer}
                          disabled={!gameState.playerAnswer.trim() || gameState.showResult || gameState.isPaused}
                          className="mt-4 bg-blue-500 hover:bg-blue-600 px-8 py-3 text-lg"
                        >
                          Submit Answer
                        </Button>
                      </div>

                      {gameState.showResult && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-6"
                        >
                          <div className={`p-4 rounded-lg ${
                            (currentQuestion.type === 'bin-to-dec' 
                              ? parseInt(gameState.playerAnswer) === currentQuestion.decimal
                              : gameState.playerAnswer === currentQuestion.binary
                            ) ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                          }`}>
                            {currentQuestion.type === 'bin-to-dec' 
                              ? parseInt(gameState.playerAnswer) === currentQuestion.decimal
                              : gameState.playerAnswer === currentQuestion.binary
                            } ? 'Correct!' : `Incorrect - Answer: ${
                              currentQuestion.type === 'bin-to-dec' ? currentQuestion.decimal : currentQuestion.binary
                            }`
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                )}

                {gameState.isPaused && (
                  <div className="text-center py-8">
                    <h3 className="text-2xl font-bold text-gray-600 mb-4">Game Paused</h3>
                    <Button onClick={pauseGame} className="bg-green-500 hover:bg-green-600">
                      <Play className="mr-2 h-4 w-4" />
                      Resume Game
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}