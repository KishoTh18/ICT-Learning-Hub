import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, SkipForward } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Quiz } from "@shared/schema";
import type { QuizState } from "@/lib/types";

const SAMPLE_QUIZZES = [
  // Number Systems Questions
  {
    id: 1,
    question: "What is the decimal equivalent of binary 1010?",
    options: ["8", "10", "12", "16"],
    correctAnswer: 1,
    explanation: "Binary 1010 equals (1×8) + (0×4) + (1×2) + (0×1) = 8 + 0 + 2 + 0 = 10 in decimal.",
    encouragement: "Great attempt! Binary conversion just takes practice. Remember to multiply each digit by its place value (powers of 2)."
  },
  {
    id: 2,
    question: "Convert hexadecimal A3 to decimal:",
    options: ["161", "163", "165", "167"],
    correctAnswer: 1,
    explanation: "Hexadecimal A3 = (A×16) + (3×1) = (10×16) + 3 = 160 + 3 = 163.",
    encouragement: "Keep going! In hexadecimal, A=10, B=11, C=12, D=13, E=14, F=15. You'll get it!"
  },
  {
    id: 3,
    question: "What is binary 1111 in decimal?",
    options: ["14", "15", "16", "17"],
    correctAnswer: 1,
    explanation: "Binary 1111 = (1×8) + (1×4) + (1×2) + (1×1) = 8 + 4 + 2 + 1 = 15.",
    encouragement: "Nice try! Remember that 1111 in binary is the largest 4-bit number, which equals 15 in decimal."
  },
  
  // Logic Gates Questions
  {
    id: 4,
    question: "Which logic gate produces a HIGH output only when all inputs are HIGH?",
    options: ["OR Gate", "AND Gate", "NOT Gate", "XOR Gate"],
    correctAnswer: 1,
    explanation: "An AND gate outputs HIGH (1) only when ALL inputs are HIGH (1). If any input is LOW (0), the output is LOW (0).",
    encouragement: "Good thinking! Logic gates can be tricky at first. AND gates need ALL inputs to be true to output true."
  },
  {
    id: 5,
    question: "What does a NOT gate do?",
    options: ["Amplifies the input", "Inverts the input", "Delays the input", "Combines inputs"],
    correctAnswer: 1,
    explanation: "A NOT gate (inverter) simply inverts its input: if input is HIGH (1), output is LOW (0), and vice versa.",
    encouragement: "You're learning! NOT gates are the simplest - they just flip the input signal to its opposite."
  },
  {
    id: 6,
    question: "An XOR gate outputs HIGH when:",
    options: ["Both inputs are HIGH", "Both inputs are LOW", "Inputs are different", "At least one input is HIGH"],
    correctAnswer: 2,
    explanation: "XOR (Exclusive OR) outputs HIGH only when inputs are different. Same inputs (both 0 or both 1) produce LOW output.",
    encouragement: "Excellent effort! XOR is special - it's like asking 'are these inputs different?' True only when they don't match."
  },

  // Networking Questions
  {
    id: 7,
    question: "What is the default subnet mask for a Class C network?",
    options: ["255.0.0.0", "255.255.0.0", "255.255.255.0", "255.255.255.255"],
    correctAnswer: 2,
    explanation: "Class C networks use /24 subnet mask (255.255.255.0), giving 256 possible addresses per network (0-255).",
    encouragement: "Keep studying! Class C is the most common for small networks. The pattern is 255.255.255.0 for /24 networks."
  },
  {
    id: 8,
    question: "What does IP stand for?",
    options: ["Internet Provider", "Internet Protocol", "Internal Processing", "Information Packet"],
    correctAnswer: 1,
    explanation: "IP stands for Internet Protocol - the fundamental protocol that governs how data packets are sent across networks.",
    encouragement: "Nice try! IP is the foundation of internet communication - it's how devices find and talk to each other online."
  },
  {
    id: 9,
    question: "Which IP address range is reserved for private networks?",
    options: ["1.0.0.0 - 126.255.255.255", "128.0.0.0 - 191.255.255.255", "192.168.0.0 - 192.168.255.255", "224.0.0.0 - 239.255.255.255"],
    correctAnswer: 2,
    explanation: "192.168.x.x is one of the private IP ranges, commonly used in home and office networks. Others include 10.x.x.x and 172.16-31.x.x.",
    encouragement: "Great question to tackle! Private IPs like 192.168.x.x are used internally and can't be reached from the internet directly."
  },

  // Subnetting Questions
  {
    id: 10,
    question: "How many host addresses are available in a /26 subnet?",
    options: ["62", "64", "126", "128"],
    correctAnswer: 0,
    explanation: "A /26 subnet has 6 host bits (32-26=6). 2^6 = 64 total addresses, minus 2 (network and broadcast) = 62 usable host addresses.",
    encouragement: "Subnetting math takes practice! Remember: total addresses minus network address minus broadcast address = usable hosts."
  },
  {
    id: 11,
    question: "What is the broadcast address for network 192.168.1.0/28?",
    options: ["192.168.1.15", "192.168.1.16", "192.168.1.31", "192.168.1.255"],
    correctAnswer: 0,
    explanation: "/28 means 4 host bits. Network 192.168.1.0 with 4 host bits covers .0-.15, so broadcast is 192.168.1.15.",
    encouragement: "Subnetting is challenging but you're thinking in the right direction! /28 creates small 16-address subnets."
  },

  // Programming Questions
  {
    id: 12,
    question: "What does a 'for' loop do in programming?",
    options: ["Makes decisions", "Repeats code a specific number of times", "Stores data", "Connects to internet"],
    correctAnswer: 1,
    explanation: "A 'for' loop repeats a block of code a predetermined number of times, making it perfect for counting or iterating through lists.",
    encouragement: "You're getting into programming concepts! Loops are fundamental - they help us avoid writing the same code over and over."
  },
  {
    id: 13,
    question: "What is a variable in programming?",
    options: ["A constant value", "A container for storing data", "A type of loop", "An error in code"],
    correctAnswer: 1,
    explanation: "A variable is like a labeled box that stores data (numbers, text, etc.) that can be used and changed throughout a program.",
    encouragement: "Great programming question! Think of variables as labeled containers - you can put different things in them and use them later."
  },
  {
    id: 14,
    question: "Which symbol is commonly used for comments in many programming languages?",
    options: ["*", "#", "//", "%"],
    correctAnswer: 2,
    explanation: "// is widely used for single-line comments in languages like JavaScript, C++, Java, and many others.",
    encouragement: "Good thinking about code structure! Comments with // help explain code to other programmers (and future you!)."
  },

  // General ICT Questions
  {
    id: 15,
    question: "What does CPU stand for?",
    options: ["Computer Processing Unit", "Central Processing Unit", "Central Program Unit", "Computer Program Unit"],
    correctAnswer: 1,
    explanation: "CPU stands for Central Processing Unit - it's the 'brain' of the computer that executes instructions and performs calculations.",
    encouragement: "Fundamental computer knowledge! The CPU is like the brain - it processes all the instructions that make programs work."
  },
  {
    id: 16,
    question: "What is the main purpose of an operating system?",
    options: ["Create documents", "Manage computer resources", "Browse the internet", "Play games"],
    correctAnswer: 1,
    explanation: "An operating system (like Windows, macOS, Linux) manages hardware resources, runs programs, and provides a user interface.",
    encouragement: "You're thinking about system fundamentals! The OS is like a manager that coordinates everything happening in your computer."
  },
  {
    id: 17,
    question: "What does RAM stand for?",
    options: ["Read Access Memory", "Random Access Memory", "Rapid Access Memory", "Remote Access Memory"],
    correctAnswer: 1,
    explanation: "RAM (Random Access Memory) is the computer's temporary, fast storage that holds data currently being used by programs.",
    encouragement: "Memory concepts are important! RAM is like your computer's short-term memory - fast but temporary."
  },
  {
    id: 18,
    question: "What is the difference between hardware and software?",
    options: ["No difference", "Hardware is physical, software is digital instructions", "Software is faster", "Hardware is newer"],
    correctAnswer: 1,
    explanation: "Hardware refers to physical components (CPU, memory, screen), while software refers to programs and instructions that run on hardware.",
    encouragement: "Great fundamental question! Think of hardware as the physical parts you can touch, and software as the instructions that make them work."
  }
];

// Shuffle array function
const shuffleArray = (array: any[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function QuizSection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Generate random quiz questions on component mount
  const [shuffledQuizzes] = useState(() => shuffleArray(SAMPLE_QUIZZES).slice(0, 10));
  
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    selectedAnswer: "",
    isAnswered: false,
    score: 0,
    totalQuestions: shuffledQuizzes.length,
  });

  const [isQuizComplete, setIsQuizComplete] = useState(false);

  const currentQuiz = shuffledQuizzes[quizState.currentQuestion];
  const progress = ((quizState.currentQuestion + 1) / quizState.totalQuestions) * 100;

  const submitAnswerMutation = useMutation({
    mutationFn: async (answerIndex: number) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return { correct: answerIndex === currentQuiz.correctAnswer };
    },
    onSuccess: (data) => {
      const isCorrect = data.correct;
      
      setQuizState(prev => ({
        ...prev,
        isAnswered: true,
        score: isCorrect ? prev.score + 1 : prev.score,
      }));

      // Don't show toast here - we'll show detailed feedback in the UI instead
    },
  });

  const selectAnswer = (answerIndex: number) => {
    if (quizState.isAnswered) return;
    
    setQuizState(prev => ({
      ...prev,
      selectedAnswer: answerIndex.toString(),
    }));
  };

  const submitAnswer = () => {
    if (!quizState.selectedAnswer || quizState.isAnswered) return;
    
    const answerIndex = parseInt(quizState.selectedAnswer);
    submitAnswerMutation.mutate(answerIndex);
  };

  const nextQuestion = () => {
    if (quizState.currentQuestion < quizState.totalQuestions - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        selectedAnswer: "",
        isAnswered: false,
      }));
    } else {
      setIsQuizComplete(true);
    }
  };

  const restartQuiz = () => {
    setQuizState({
      currentQuestion: 0,
      selectedAnswer: "",
      isAnswered: false,
      score: 0,
      totalQuestions: shuffledQuizzes.length,
    });
    setIsQuizComplete(false);
  };

  const previousQuestion = () => {
    if (quizState.currentQuestion > 0) {
      setQuizState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion - 1,
        selectedAnswer: "",
        isAnswered: false,
      }));
    }
  };

  const skipQuestion = () => {
    nextQuestion();
  };

  const isLastQuestion = quizState.currentQuestion === quizState.totalQuestions - 1;

  // Quiz completion screen
  if (isQuizComplete) {
    const percentage = Math.round((quizState.score / quizState.totalQuestions) * 100);
    const getPerformanceMessage = () => {
      if (percentage >= 90) return { title: "Outstanding!", message: "You're an ICT master! Excellent work!", color: "green" };
      if (percentage >= 80) return { title: "Great Job!", message: "You have a strong grasp of ICT concepts!", color: "blue" };
      if (percentage >= 70) return { title: "Well Done!", message: "Good understanding! Keep practicing to improve further.", color: "purple" };
      if (percentage >= 60) return { title: "Good Effort!", message: "You're on the right track! Review the concepts and try again.", color: "yellow" };
      return { title: "Keep Learning!", message: "Don't worry, learning takes time. Review the materials and practice more!", color: "orange" };
    };
    
    const performance = getPerformanceMessage();
    
    return (
      <section id="quizzes" className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Quiz Complete!</h2>
            <p className="text-xl text-gray-600">Here are your results</p>
          </div>
          
          <Card className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <div className={`w-32 h-32 mx-auto rounded-full ${
                  performance.color === 'green' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                  performance.color === 'blue' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                  performance.color === 'purple' ? 'bg-gradient-to-r from-purple-400 to-purple-600' :
                  performance.color === 'yellow' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                  'bg-gradient-to-r from-orange-400 to-orange-600'
                } flex items-center justify-center mb-6`}>
                  <span className="text-4xl font-bold text-white">{percentage}%</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-4">{performance.title}</h3>
                <p className="text-xl text-gray-600 mb-6">{performance.message}</p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-blue-600 mb-2">{quizState.score}</div>
                  <div className="text-sm text-blue-800">Correct Answers</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-purple-600 mb-2">{quizState.totalQuestions}</div>
                  <div className="text-sm text-purple-800">Total Questions</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-green-600 mb-2">{percentage}%</div>
                  <div className="text-sm text-green-800">Final Score</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={restartQuiz}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold px-8 py-3"
                >
                  Try Again
                </Button>
                <Button
                  onClick={() => {
                    const element = document.getElementById('topics');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  variant="outline"
                  className="font-semibold px-8 py-3"
                >
                  Explore Topics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="quizzes" className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Quick Knowledge Check</h2>
          <p className="text-xl text-gray-600">Test your understanding with instant feedback</p>
        </div>
        
        <Card className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <CardContent className="p-8">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500">
                  Question {quizState.currentQuestion + 1} of {quizState.totalQuestions}
                </span>
                <div className="flex space-x-2">
                  {Array.from({ length: quizState.totalQuestions }).map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full ${
                        index === quizState.currentQuestion
                          ? 'bg-blue-500'
                          : index < quizState.currentQuestion
                          ? 'bg-emerald-500'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={quizState.currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  {currentQuiz.question}
                </h3>
                <div className="space-y-4">
                  {currentQuiz.options.map((option: string, index: number) => {
                    const isSelected = quizState.selectedAnswer === index.toString();
                    const isCorrect = index === currentQuiz.correctAnswer;
                    const isWrong = quizState.isAnswered && isSelected && !isCorrect;
                    const showCorrect = quizState.isAnswered && isCorrect;
                    
                    return (
                      <motion.button
                        key={index}
                        onClick={() => selectAnswer(index)}
                        disabled={quizState.isAnswered}
                        whileHover={{ scale: quizState.isAnswered ? 1 : 1.02 }}
                        whileTap={{ scale: quizState.isAnswered ? 1 : 0.98 }}
                        className={`quiz-option w-full p-4 text-left rounded-xl border font-medium transition-all duration-200 ${
                          showCorrect
                            ? 'bg-emerald-500 text-white border-emerald-500'
                            : isWrong
                            ? 'bg-red-500 text-white border-red-500'
                            : isSelected
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-gray-50 hover:bg-blue-500 hover:text-white border-gray-200'
                        }`}
                      >
                        <span className="font-bold mr-3">
                          {String.fromCharCode(65 + index)})
                        </span>
                        {option}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
            
            <div className="flex justify-between items-center">
              <Button
                onClick={previousQuestion}
                disabled={quizState.currentQuestion === 0}
                variant="ghost"
                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              
              <div className="flex space-x-4">
                {!quizState.isAnswered ? (
                  <>
                    <Button
                      onClick={skipQuestion}
                      variant="outline"
                      className="px-6 py-3 font-medium"
                    >
                      <SkipForward className="mr-2 h-4 w-4" />
                      Skip
                    </Button>
                    <Button
                      onClick={submitAnswer}
                      disabled={!quizState.selectedAnswer || submitAnswerMutation.isPending}
                      className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold"
                    >
                      {submitAnswerMutation.isPending ? "Submitting..." : "Submit Answer"}
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={nextQuestion}
                    disabled={isLastQuestion}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold"
                  >
                    {isLastQuestion ? "Quiz Complete!" : "Next Question"}
                    {!isLastQuestion && <ChevronRight className="ml-2 h-4 w-4" />}
                  </Button>
                )}
              </div>
            </div>
            
            {quizState.isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-6"
              >
                {parseInt(quizState.selectedAnswer) === currentQuiz.correctAnswer ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-bold text-green-800">Excellent! That's correct!</h4>
                    </div>
                    <p className="text-green-700 mb-3">{currentQuiz.explanation}</p>
                    <div className="bg-green-100 rounded-lg p-3">
                      <p className="text-green-800 font-medium text-sm">
                        🎉 Great job! You're mastering these ICT concepts. Keep up the fantastic work!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-bold text-blue-800">Learning Opportunity!</h4>
                    </div>
                    <div className="mb-4">
                      <p className="text-blue-700 font-medium mb-2">
                        Correct Answer: <span className="font-bold">{currentQuiz.options[currentQuiz.correctAnswer]}</span>
                      </p>
                      <p className="text-blue-700 mb-3">{currentQuiz.explanation}</p>
                    </div>
                    <div className="bg-blue-100 rounded-lg p-3">
                      <p className="text-blue-800 font-medium text-sm">
                        💪 {currentQuiz.encouragement}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center bg-gray-100 rounded-full px-4 py-2">
                    <span className="text-sm font-medium text-gray-600 mr-2">Progress:</span>
                    <span className="text-lg font-bold text-gray-800">
                      {quizState.score}/{quizState.currentQuestion + 1}
                    </span>
                    <span className="text-sm text-gray-600 ml-2">
                      ({Math.round((quizState.score / (quizState.currentQuestion + 1)) * 100)}%)
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
