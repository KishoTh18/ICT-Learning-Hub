import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Calculator, Binary, Shuffle, Trophy } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface ConversionGame {
  question: string;
  answer: string;
  type: 'bin-to-dec' | 'dec-to-bin' | 'hex-to-dec' | 'dec-to-hex';
}

const gameQuestions: ConversionGame[] = [
  { question: "1011", answer: "11", type: "bin-to-dec" },
  { question: "25", answer: "11001", type: "dec-to-bin" },
  { question: "FF", answer: "255", type: "hex-to-dec" },
  { question: "100", answer: "64", type: "dec-to-hex" },
  { question: "1101", answer: "13", type: "bin-to-dec" },
  { question: "42", answer: "101010", type: "dec-to-bin" },
];

export default function NumberSystems() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'game'>('learn');
  const [binaryInput, setBinaryInput] = useState("1010");
  const [decimalInput, setDecimalInput] = useState("10");
  const [hexInput, setHexInput] = useState("A");
  
  // Game state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const validateBinary = (input: string) => /^[01]+$/.test(input);
  const validateDecimal = (input: string) => /^\d+$/.test(input);
  const validateHex = (input: string) => /^[0-9A-Fa-f]+$/.test(input);

  const binaryToDecimal = (binary: string) => parseInt(binary, 2);
  const decimalToBinary = (decimal: string) => parseInt(decimal).toString(2);
  const hexToDecimal = (hex: string) => parseInt(hex, 16);
  const decimalToHex = (decimal: string) => parseInt(decimal).toString(16).toUpperCase();

  const currentGameQuestion = gameQuestions[currentQuestion];
  const gameProgress = ((currentQuestion + 1) / gameQuestions.length) * 100;

  const startGame = () => {
    setGameStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setUserAnswer("");
    setShowResult(false);
  };

  const submitAnswer = () => {
    if (!userAnswer.trim()) return;
    
    const isCorrect = userAnswer.toLowerCase() === currentGameQuestion.answer.toLowerCase();
    
    if (isCorrect) {
      setScore(score + 1);
      toast({
        title: "Correct!",
        description: "Great job! Moving to next question.",
      });
    } else {
      toast({
        title: "Incorrect",
        description: `The correct answer is: ${currentGameQuestion.answer}`,
        variant: "destructive",
      });
    }
    
    setShowResult(true);
    
    setTimeout(() => {
      if (currentQuestion < gameQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setUserAnswer("");
        setShowResult(false);
      } else {
        // Game finished
        toast({
          title: "Game Complete!",
          description: `Final Score: ${isCorrect ? score + 1 : score}/${gameQuestions.length}`,
        });
        setGameStarted(false);
      }
    }, 2000);
  };

  const getQuestionLabel = (type: string) => {
    switch (type) {
      case 'bin-to-dec': return 'Binary to Decimal';
      case 'dec-to-bin': return 'Decimal to Binary';
      case 'hex-to-dec': return 'Hexadecimal to Decimal';
      case 'dec-to-hex': return 'Decimal to Hexadecimal';
      default: return 'Convert';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
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
              <Calculator className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Number Systems</h1>
              <p className="text-xl opacity-90">Master binary, decimal, and hexadecimal conversions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex space-x-1 mb-8 bg-white p-1 rounded-lg shadow-sm">
          {[
            { key: 'learn', label: 'Learn', icon: Calculator },
            { key: 'practice', label: 'Practice', icon: Binary },
            { key: 'game', label: 'Game', icon: Trophy },
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              onClick={() => setActiveTab(key as any)}
              variant={activeTab === key ? "default" : "ghost"}
              className={`flex-1 ${activeTab === key ? 'bg-blue-500 text-white' : ''}`}
            >
              <Icon className="mr-2 h-4 w-4" />
              {label}
            </Button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'learn' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Understanding Number Systems</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-6 rounded-xl">
                      <h3 className="text-lg font-bold text-blue-700 mb-3">Binary (Base 2)</h3>
                      <p className="text-gray-600 mb-3">Uses only digits 0 and 1</p>
                      <div className="font-mono text-sm bg-white p-3 rounded">
                        Example: 1011₂ = 11₁₀
                      </div>
                    </div>
                    <div className="bg-emerald-50 p-6 rounded-xl">
                      <h3 className="text-lg font-bold text-emerald-700 mb-3">Decimal (Base 10)</h3>
                      <p className="text-gray-600 mb-3">Uses digits 0-9</p>
                      <div className="font-mono text-sm bg-white p-3 rounded">
                        Example: 42₁₀ = Normal counting
                      </div>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-xl">
                      <h3 className="text-lg font-bold text-purple-700 mb-3">Hexadecimal (Base 16)</h3>
                      <p className="text-gray-600 mb-3">Uses digits 0-9 and A-F</p>
                      <div className="font-mono text-sm bg-white p-3 rounded">
                        Example: FF₁₆ = 255₁₀
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl">
                    <h3 className="text-xl font-bold mb-4">How Binary Works</h3>
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      {[3, 2, 1, 0].map((position) => (
                        <div key={position} className="text-center">
                          <div className="bg-white bg-opacity-20 rounded-lg p-3 mb-2">
                            <div className="text-sm opacity-75">Position {position}</div>
                            <div className="text-lg font-bold">2^{position}</div>
                            <div className="text-sm">= {Math.pow(2, position)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-center">
                      Example: 1011₂ = (1×8) + (0×4) + (1×2) + (1×1) = 11₁₀
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'practice' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="bg-white shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Binary className="mr-2 h-5 w-5 text-blue-500" />
                      Binary Converter
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Binary Input:</label>
                      <Input
                        value={binaryInput}
                        onChange={(e) => setBinaryInput(e.target.value)}
                        placeholder="e.g., 1010"
                        className="font-mono"
                      />
                      {validateBinary(binaryInput) && (
                        <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                          <div className="text-sm text-blue-700">
                            {binaryInput}₂ = {binaryToDecimal(binaryInput)}₁₀
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calculator className="mr-2 h-5 w-5 text-emerald-500" />
                      Decimal Converter
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Decimal Input:</label>
                      <Input
                        value={decimalInput}
                        onChange={(e) => setDecimalInput(e.target.value)}
                        placeholder="e.g., 42"
                        className="font-mono"
                      />
                      {validateDecimal(decimalInput) && (
                        <div className="mt-2 p-3 bg-emerald-50 rounded-lg">
                          <div className="text-sm text-emerald-700">
                            {decimalInput}₁₀ = {decimalToBinary(decimalInput)}₂
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shuffle className="mr-2 h-5 w-5 text-purple-500" />
                      Hex Converter
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Hex Input:</label>
                      <Input
                        value={hexInput}
                        onChange={(e) => setHexInput(e.target.value)}
                        placeholder="e.g., FF"
                        className="font-mono"
                      />
                      {validateHex(hexInput) && (
                        <div className="mt-2 p-3 bg-purple-50 rounded-lg">
                          <div className="text-sm text-purple-700">
                            {hexInput.toUpperCase()}₁₆ = {hexToDecimal(hexInput)}₁₀
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {activeTab === 'game' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Trophy className="mr-2 h-5 w-5 text-orange-500" />
                      Number Systems Challenge
                    </div>
                    {gameStarted && (
                      <Badge variant="secondary">
                        Score: {score}/{gameQuestions.length}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!gameStarted ? (
                    <div className="text-center py-12">
                      <Trophy className="mx-auto h-16 w-16 text-orange-500 mb-4" />
                      <h3 className="text-2xl font-bold mb-4">Ready for the Challenge?</h3>
                      <p className="text-gray-600 mb-6">
                        Test your number conversion skills with {gameQuestions.length} questions
                      </p>
                      <Button onClick={startGame} className="bg-orange-500 hover:bg-orange-600">
                        Start Game
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Question {currentQuestion + 1} of {gameQuestions.length}
                        </span>
                        <Progress value={gameProgress} className="w-1/2" />
                      </div>
                      
                      <div className="bg-gray-50 p-6 rounded-xl text-center">
                        <div className="mb-4">
                          <Badge className="mb-2">
                            {getQuestionLabel(currentGameQuestion.type)}
                          </Badge>
                        </div>
                        <div className="text-3xl font-bold mb-4 font-mono">
                          {currentGameQuestion.question}
                        </div>
                        <Input
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          placeholder="Enter your answer"
                          className="max-w-xs mx-auto font-mono text-center"
                          disabled={showResult}
                        />
                      </div>
                      
                      <div className="text-center">
                        <Button
                          onClick={submitAnswer}
                          disabled={!userAnswer.trim() || showResult}
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          {showResult ? "Processing..." : "Submit Answer"}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}