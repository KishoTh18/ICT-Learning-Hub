import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Network, Globe, Router, CheckCircle, XCircle } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface IPQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const ipQuizQuestions: IPQuizQuestion[] = [
  {
    question: "What class does the IP address 192.168.1.1 belong to?",
    options: ["Class A", "Class B", "Class C", "Class D"],
    correctAnswer: 2,
    explanation: "IP addresses starting with 192 are Class C addresses (192.0.0.0 to 223.255.255.255)"
  },
  {
    question: "What is the default subnet mask for a Class B network?",
    options: ["255.0.0.0", "255.255.0.0", "255.255.255.0", "255.255.255.255"],
    correctAnswer: 1,
    explanation: "Class B networks use 255.255.0.0 as the default subnet mask"
  },
  {
    question: "Which IP address is reserved for loopback testing?",
    options: ["192.168.1.1", "10.0.0.1", "127.0.0.1", "172.16.0.1"],
    correctAnswer: 2,
    explanation: "127.0.0.1 is the standard loopback address used for testing network software"
  },
  {
    question: "What does DHCP stand for?",
    options: ["Dynamic Host Control Protocol", "Dynamic Host Configuration Protocol", "Direct Host Configuration Protocol", "Dynamic Hardware Configuration Protocol"],
    correctAnswer: 1,
    explanation: "DHCP stands for Dynamic Host Configuration Protocol, which automatically assigns IP addresses"
  }
];

export default function IPAddressing() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'learn' | 'calculator' | 'quiz'>('learn');
  const [ipInput, setIpInput] = useState("192.168.1.100");
  const [subnetInput, setSubnetInput] = useState("255.255.255.0");
  
  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);

  const validateIP = (ip: string) => {
    const pattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = ip.match(pattern);
    if (!match) return false;
    return match.slice(1).every(octet => parseInt(octet) <= 255);
  };

  const getIPClass = (ip: string) => {
    if (!validateIP(ip)) return "Invalid IP";
    const firstOctet = parseInt(ip.split('.')[0]);
    if (firstOctet >= 1 && firstOctet <= 126) return "Class A";
    if (firstOctet >= 128 && firstOctet <= 191) return "Class B";
    if (firstOctet >= 192 && firstOctet <= 223) return "Class C";
    if (firstOctet >= 224 && firstOctet <= 239) return "Class D (Multicast)";
    if (firstOctet >= 240 && firstOctet <= 255) return "Class E (Experimental)";
    return "Reserved";
  };

  const getNetworkInfo = (ip: string, subnet: string) => {
    if (!validateIP(ip) || !validateIP(subnet)) return null;
    
    const ipOctets = ip.split('.').map(n => parseInt(n));
    const subnetOctets = subnet.split('.').map(n => parseInt(n));
    
    const networkOctets = ipOctets.map((octet, i) => octet & subnetOctets[i]);
    const broadcastOctets = networkOctets.map((octet, i) => octet | (255 - subnetOctets[i]));
    
    return {
      network: networkOctets.join('.'),
      broadcast: broadcastOctets.join('.'),
      firstHost: networkOctets.map((octet, i) => i === 3 ? octet + 1 : octet).join('.'),
      lastHost: broadcastOctets.map((octet, i) => i === 3 ? octet - 1 : octet).join('.'),
    };
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
  };

  const selectAnswer = (answerIndex: number) => {
    if (showAnswer) return;
    setSelectedAnswer(answerIndex);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === ipQuizQuestions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
      toast({
        title: "Correct!",
        description: "Well done!",
      });
    } else {
      toast({
        title: "Incorrect",
        description: ipQuizQuestions[currentQuestion].explanation,
        variant: "destructive",
      });
    }
    
    setShowAnswer(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < ipQuizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else {
      toast({
        title: "Quiz Complete!",
        description: `Final Score: ${score}/${ipQuizQuestions.length}`,
      });
      setQuizStarted(false);
    }
  };

  const networkInfo = getNetworkInfo(ipInput, subnetInput);
  const currentQuiz = ipQuizQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-8">
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
              <Network className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">IP Addressing</h1>
              <p className="text-xl opacity-90">Master IPv4 addressing and network fundamentals</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex space-x-1 mb-8 bg-white p-1 rounded-lg shadow-sm">
          {[
            { key: 'learn', label: 'Learn', icon: Network },
            { key: 'calculator', label: 'Calculator', icon: Globe },
            { key: 'quiz', label: 'Quiz', icon: Router },
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              onClick={() => setActiveTab(key as any)}
              variant={activeTab === key ? "default" : "ghost"}
              className={`flex-1 ${activeTab === key ? 'bg-emerald-500 text-white' : ''}`}
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
                  <CardTitle className="text-2xl">Understanding IP Addresses</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-emerald-50 p-6 rounded-xl">
                      <h3 className="text-lg font-bold text-emerald-700 mb-3">What is an IP Address?</h3>
                      <p className="text-gray-600 mb-4">
                        An IP (Internet Protocol) address is a unique identifier assigned to each device on a network. 
                        It consists of 4 numbers (octets) separated by dots, each ranging from 0 to 255.
                      </p>
                      <div className="bg-white p-3 rounded font-mono text-center">
                        192.168.1.100
                      </div>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-xl">
                      <h3 className="text-lg font-bold text-blue-700 mb-3">Subnet Masks</h3>
                      <p className="text-gray-600 mb-4">
                        Subnet masks determine which part of an IP address represents the network 
                        and which part represents the host (device).
                      </p>
                      <div className="bg-white p-3 rounded font-mono text-center">
                        255.255.255.0
                      </div>
                    </div>
                  </div>
                  
                  <Card className="border-l-4 border-l-emerald-500">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4">IP Address Classes</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div>
                            <span className="font-bold">Class A:</span> 1.0.0.0 to 126.255.255.255
                          </div>
                          <Badge className="bg-red-500">Large Networks</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div>
                            <span className="font-bold">Class B:</span> 128.0.0.0 to 191.255.255.255
                          </div>
                          <Badge className="bg-yellow-500">Medium Networks</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div>
                            <span className="font-bold">Class C:</span> 192.0.0.0 to 223.255.255.255
                          </div>
                          <Badge className="bg-green-500">Small Networks</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'calculator' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="mr-2 h-5 w-5 text-emerald-500" />
                    IP Address Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">IP Address:</label>
                      <Input
                        value={ipInput}
                        onChange={(e) => setIpInput(e.target.value)}
                        placeholder="e.g., 192.168.1.100"
                        className="font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Subnet Mask:</label>
                      <Input
                        value={subnetInput}
                        onChange={(e) => setSubnetInput(e.target.value)}
                        placeholder="e.g., 255.255.255.0"
                        className="font-mono"
                      />
                    </div>
                  </div>
                  
                  {validateIP(ipInput) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="border-l-4 border-l-emerald-500">
                        <CardContent className="p-4">
                          <h3 className="font-bold text-emerald-700 mb-2">IP Information</h3>
                          <div className="space-y-2 text-sm">
                            <div><strong>IP Address:</strong> {ipInput}</div>
                            <div><strong>Class:</strong> {getIPClass(ipInput)}</div>
                            <div><strong>Type:</strong> {ipInput.startsWith('192.168.') || ipInput.startsWith('10.') || ipInput.startsWith('172.') ? 'Private' : 'Public'}</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {networkInfo && (
                        <Card className="border-l-4 border-l-blue-500">
                          <CardContent className="p-4">
                            <h3 className="font-bold text-blue-700 mb-2">Network Information</h3>
                            <div className="space-y-2 text-sm font-mono">
                              <div><strong>Network:</strong> {networkInfo.network}</div>
                              <div><strong>Broadcast:</strong> {networkInfo.broadcast}</div>
                              <div><strong>First Host:</strong> {networkInfo.firstHost}</div>
                              <div><strong>Last Host:</strong> {networkInfo.lastHost}</div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'quiz' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Router className="mr-2 h-5 w-5 text-blue-500" />
                      IP Addressing Quiz
                    </div>
                    {quizStarted && (
                      <Badge variant="secondary">
                        Score: {score}/{ipQuizQuestions.length}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!quizStarted ? (
                    <div className="text-center py-12">
                      <Router className="mx-auto h-16 w-16 text-blue-500 mb-4" />
                      <h3 className="text-2xl font-bold mb-4">Test Your Knowledge</h3>
                      <p className="text-gray-600 mb-6">
                        Challenge yourself with {ipQuizQuestions.length} IP addressing questions
                      </p>
                      <Button onClick={startQuiz} className="bg-blue-500 hover:bg-blue-600">
                        Start Quiz
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Question {currentQuestion + 1} of {ipQuizQuestions.length}
                        </span>
                        <Progress value={((currentQuestion + 1) / ipQuizQuestions.length) * 100} className="w-1/2" />
                      </div>
                      
                      <div className="bg-gray-50 p-6 rounded-xl">
                        <h3 className="text-xl font-bold mb-6">{currentQuiz.question}</h3>
                        <div className="space-y-3">
                          {currentQuiz.options.map((option, index) => {
                            const isSelected = selectedAnswer === index;
                            const isCorrect = index === currentQuiz.correctAnswer;
                            const isWrong = showAnswer && isSelected && !isCorrect;
                            const showCorrect = showAnswer && isCorrect;
                            
                            return (
                              <button
                                key={index}
                                onClick={() => selectAnswer(index)}
                                disabled={showAnswer}
                                className={`w-full p-4 text-left rounded-lg border transition-all ${
                                  showCorrect
                                    ? 'bg-green-500 text-white border-green-500'
                                    : isWrong
                                    ? 'bg-red-500 text-white border-red-500'
                                    : isSelected
                                    ? 'bg-blue-500 text-white border-blue-500'
                                    : 'bg-white hover:bg-blue-50 border-gray-200'
                                }`}
                              >
                                <div className="flex items-center">
                                  <span className="font-bold mr-3">
                                    {String.fromCharCode(65 + index)})
                                  </span>
                                  {option}
                                  {showAnswer && isCorrect && (
                                    <CheckCircle className="ml-auto h-5 w-5" />
                                  )}
                                  {showAnswer && isWrong && (
                                    <XCircle className="ml-auto h-5 w-5" />
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        
                        {showAnswer && (
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                            <p className="text-blue-800 text-sm">
                              <strong>Explanation:</strong> {currentQuiz.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-center">
                        {!showAnswer ? (
                          <Button
                            onClick={submitAnswer}
                            disabled={selectedAnswer === null}
                            className="bg-blue-500 hover:bg-blue-600"
                          >
                            Submit Answer
                          </Button>
                        ) : (
                          <Button
                            onClick={nextQuestion}
                            className="bg-emerald-500 hover:bg-emerald-600"
                          >
                            {currentQuestion < ipQuizQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
                          </Button>
                        )}
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