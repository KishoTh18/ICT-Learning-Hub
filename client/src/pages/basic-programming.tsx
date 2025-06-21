import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Code, Play, CheckCircle, XCircle, Lightbulb } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface CodeChallenge {
  id: number;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  starter_code: string;
  expected_output: string;
  test_cases: { input: string; output: string }[];
  hints: string[];
}

const challenges: CodeChallenge[] = [
  {
    id: 1,
    title: "Hello World",
    description: "Write a program that prints 'Hello, World!' to the console",
    difficulty: 'Beginner',
    starter_code: '# Write your code here\n',
    expected_output: 'Hello, World!',
    test_cases: [
      { input: '', output: 'Hello, World!' }
    ],
    hints: [
      "Use the print() function",
      "Remember to include the exact text with punctuation"
    ]
  },
  {
    id: 2,
    title: "Variable Practice",
    description: "Create variables for your name and age, then print them",
    difficulty: 'Beginner',
    starter_code: '# Create variables for name and age\n# Print them in a sentence\n',
    expected_output: 'My name is John and I am 16 years old',
    test_cases: [
      { input: '', output: 'My name is John and I am 16 years old' }
    ],
    hints: [
      "Use variables to store your name and age",
      "Use string concatenation or f-strings to combine text"
    ]
  },
  {
    id: 3,
    title: "Simple Calculator",
    description: "Write a function that adds two numbers and returns the result",
    difficulty: 'Beginner',
    starter_code: 'def add_numbers(a, b):\n    # Write your code here\n    pass\n\n# Test your function\nresult = add_numbers(5, 3)\nprint(result)',
    expected_output: '8',
    test_cases: [
      { input: 'add_numbers(5, 3)', output: '8' },
      { input: 'add_numbers(10, 7)', output: '17' }
    ],
    hints: [
      "Use the + operator to add the numbers",
      "Don't forget to return the result"
    ]
  },
  {
    id: 4,
    title: "Loop Practice",
    description: "Use a for loop to print numbers from 1 to 5",
    difficulty: 'Intermediate',
    starter_code: '# Use a for loop to print numbers 1 to 5\n',
    expected_output: '1\n2\n3\n4\n5',
    test_cases: [
      { input: '', output: '1\n2\n3\n4\n5' }
    ],
    hints: [
      "Use range(1, 6) to get numbers 1 to 5",
      "Print each number on a new line"
    ]
  },
  {
    id: 5,
    title: "List Operations",
    description: "Create a list of your favorite subjects and print each one",
    difficulty: 'Intermediate',
    starter_code: '# Create a list of subjects\nsubjects = []\n\n# Print each subject\n',
    expected_output: 'Math\nScience\nHistory',
    test_cases: [
      { input: '', output: 'Math\nScience\nHistory' }
    ],
    hints: [
      "Create a list with your favorite subjects",
      "Use a for loop to iterate through the list"
    ]
  }
];

const concepts = [
  {
    title: "Variables",
    description: "Store and manage data in your programs",
    example: "name = 'Alice'\nage = 16\nprint(f'Hello, {name}!')",
    explanation: "Variables are containers that store data values. In Python, you can create variables by simply assigning values to them."
  },
  {
    title: "Data Types",
    description: "Different kinds of data: strings, numbers, booleans",
    example: "text = 'Hello'  # String\nnumber = 42    # Integer\nfloat_num = 3.14  # Float\nis_student = True  # Boolean",
    explanation: "Python has several built-in data types including strings (text), integers (whole numbers), floats (decimal numbers), and booleans (True/False)."
  },
  {
    title: "Functions",
    description: "Reusable blocks of code that perform specific tasks",
    example: "def greet(name):\n    return f'Hello, {name}!'\n\nmessage = greet('Bob')\nprint(message)",
    explanation: "Functions help organize code into reusable blocks. They can accept parameters and return values."
  },
  {
    title: "Loops",
    description: "Repeat code multiple times efficiently",
    example: "# For loop\nfor i in range(3):\n    print(f'Count: {i}')\n\n# While loop\ncount = 0\nwhile count < 3:\n    print(count)\n    count += 1",
    explanation: "Loops allow you to repeat code. For loops are great for known repetitions, while loops continue until a condition is false."
  }
];

export default function BasicProgramming() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'challenges'>('learn');
  const [selectedConcept, setSelectedConcept] = useState(0);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [userCode, setUserCode] = useState(challenges[0].starter_code);
  const [codeOutput, setCodeOutput] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState<number[]>([]);

  const runCode = () => {
    // Simple code execution simulation
    const challenge = challenges[currentChallenge];
    
    // Basic pattern matching for expected outputs
    if (challenge.id === 1 && userCode.includes("print('Hello, World!')")) {
      setCodeOutput('Hello, World!');
      if (!completedChallenges.includes(challenge.id)) {
        setCompletedChallenges([...completedChallenges, challenge.id]);
        toast({
          title: "Challenge Complete!",
          description: "Great job! You've completed your first challenge.",
        });
      }
    } else if (challenge.id === 2 && userCode.includes('name') && userCode.includes('age')) {
      setCodeOutput('My name is John and I am 16 years old');
      if (!completedChallenges.includes(challenge.id)) {
        setCompletedChallenges([...completedChallenges, challenge.id]);
        toast({
          title: "Variables mastered!",
          description: "You've successfully used variables in Python.",
        });
      }
    } else if (challenge.id === 3 && userCode.includes('return a + b')) {
      setCodeOutput('8');
      if (!completedChallenges.includes(challenge.id)) {
        setCompletedChallenges([...completedChallenges, challenge.id]);
        toast({
          title: "Function created!",
          description: "Your add_numbers function works perfectly.",
        });
      }
    } else if (challenge.id === 4 && userCode.includes('for') && userCode.includes('range')) {
      setCodeOutput('1\n2\n3\n4\n5');
      if (!completedChallenges.includes(challenge.id)) {
        setCompletedChallenges([...completedChallenges, challenge.id]);
        toast({
          title: "Loop master!",
          description: "You've successfully used a for loop.",
        });
      }
    } else if (challenge.id === 5 && userCode.includes('[') && userCode.includes('for')) {
      setCodeOutput('Math\nScience\nHistory');
      if (!completedChallenges.includes(challenge.id)) {
        setCompletedChallenges([...completedChallenges, challenge.id]);
        toast({
          title: "List expert!",
          description: "You've mastered list operations.",
        });
      }
    } else {
      setCodeOutput('Try again! Check the hints if you need help.');
      toast({
        title: "Keep trying!",
        description: "Your code doesn't match the expected output yet.",
        variant: "destructive",
      });
    }
  };

  const selectChallenge = (index: number) => {
    setCurrentChallenge(index);
    setUserCode(challenges[index].starter_code);
    setCodeOutput('');
    setShowHints(false);
  };

  const resetCode = () => {
    setUserCode(challenges[currentChallenge].starter_code);
    setCodeOutput('');
  };

  const challenge = challenges[currentChallenge];
  const concept = concepts[selectedConcept];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white py-8">
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
              <Code className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Basic Programming</h1>
              <p className="text-xl opacity-90">Learn Python fundamentals through interactive coding</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex space-x-1 mb-8 bg-white p-1 rounded-lg shadow-sm">
          {[
            { key: 'learn', label: 'Learn', icon: Code },
            { key: 'practice', label: 'Practice', icon: Play },
            { key: 'challenges', label: 'Challenges', icon: CheckCircle },
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              onClick={() => setActiveTab(key as any)}
              variant={activeTab === key ? "default" : "ghost"}
              className={`flex-1 ${activeTab === key ? 'bg-purple-600 text-white' : ''}`}
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
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <Card className="bg-white shadow-lg">
                  <CardHeader>
                    <CardTitle>Programming Concepts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {concepts.map((concept, index) => (
                      <Button
                        key={index}
                        onClick={() => setSelectedConcept(index)}
                        variant={selectedConcept === index ? "default" : "ghost"}
                        className={`w-full justify-start text-left h-auto p-3 ${selectedConcept === index ? 'bg-purple-600' : ''}`}
                      >
                        <div>
                          <div className="font-bold">{concept.title}</div>
                          <div className="text-xs opacity-75 mt-1">{concept.description}</div>
                        </div>
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                <div className="lg:col-span-3">
                  <Card className="bg-white shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Code className="mr-2 h-5 w-5 text-purple-500" />
                        {concept.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <p className="text-gray-600">{concept.explanation}</p>
                      
                      <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                        <div className="text-gray-400 mb-2"># Example Code:</div>
                        <pre>{concept.example}</pre>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-bold text-blue-700 mb-2">Key Points:</h4>
                        <ul className="text-blue-600 text-sm space-y-1">
                          {concept.title === 'Variables' && (
                            <>
                              <li>• Variables store data that can be used later</li>
                              <li>• Python automatically determines the data type</li>
                              <li>• Use descriptive names for your variables</li>
                            </>
                          )}
                          {concept.title === 'Data Types' && (
                            <>
                              <li>• Strings are text enclosed in quotes</li>
                              <li>• Integers are whole numbers</li>
                              <li>• Floats are decimal numbers</li>
                              <li>• Booleans are True or False values</li>
                            </>
                          )}
                          {concept.title === 'Functions' && (
                            <>
                              <li>• Functions help organize and reuse code</li>
                              <li>• Use 'def' keyword to define functions</li>
                              <li>• Functions can accept parameters and return values</li>
                            </>
                          )}
                          {concept.title === 'Loops' && (
                            <>
                              <li>• For loops iterate over sequences</li>
                              <li>• While loops continue until a condition is false</li>
                              <li>• Use range() to create number sequences</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'practice' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Play className="mr-2 h-5 w-5 text-blue-500" />
                    Python Code Playground
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Write Your Python Code:</label>
                      <Textarea
                        value={userCode}
                        onChange={(e) => setUserCode(e.target.value)}
                        placeholder="# Write your Python code here
print('Hello, World!')
name = 'Alice'
age = 16
print(f'My name is {name} and I am {age} years old')"
                        className="font-mono text-sm h-64 resize-none"
                      />
                      <div className="flex space-x-2 mt-4">
                        <Button onClick={runCode} className="bg-green-500 hover:bg-green-600">
                          <Play className="mr-2 h-4 w-4" />
                          Run Code
                        </Button>
                        <Button onClick={() => setUserCode('')} variant="outline">
                          Clear
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Output:</label>
                      <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-64 overflow-y-auto">
                        {codeOutput ? (
                          <pre className="whitespace-pre-wrap">{codeOutput}</pre>
                        ) : (
                          <div className="text-gray-500">Run your code to see output here...</div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-bold text-yellow-700 mb-2">Try These Examples:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Variables:</strong>
                        <pre className="bg-white p-2 rounded mt-1 text-xs">{`name = "Your Name"
age = 16
print(f"Hello, {name}!")`}</pre>
                      </div>
                      <div>
                        <strong>Simple Math:</strong>
                        <pre className="bg-white p-2 rounded mt-1 text-xs">{`x = 10
y = 5
result = x + y
print(f"{x} + {y} = {result}")`}</pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'challenges' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <Card className="bg-white shadow-lg">
                  <CardHeader>
                    <CardTitle>Challenges</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {challenges.map((challenge, index) => (
                      <Button
                        key={challenge.id}
                        onClick={() => selectChallenge(index)}
                        variant={currentChallenge === index ? "default" : "ghost"}
                        className={`w-full justify-start text-left h-auto p-3 ${currentChallenge === index ? 'bg-purple-600' : ''}`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div>
                            <div className="font-bold">{challenge.title}</div>
                            <Badge variant="secondary" className="mt-1 text-xs">
                              {challenge.difficulty}
                            </Badge>
                          </div>
                          {completedChallenges.includes(challenge.id) && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                <div className="lg:col-span-3">
                  <Card className="bg-white shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                          {challenge.title}
                        </div>
                        <Badge variant="outline">{challenge.difficulty}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-bold text-blue-700 mb-2">Challenge Description:</h4>
                        <p className="text-blue-600">{challenge.description}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium">Your Code:</label>
                            <div className="space-x-2">
                              <Button onClick={resetCode} variant="outline" size="sm">
                                Reset
                              </Button>
                              <Button 
                                onClick={() => setShowHints(!showHints)} 
                                variant="outline" 
                                size="sm"
                              >
                                <Lightbulb className="mr-1 h-3 w-3" />
                                Hints
                              </Button>
                            </div>
                          </div>
                          <Textarea
                            value={userCode}
                            onChange={(e) => setUserCode(e.target.value)}
                            className="font-mono text-sm h-48 resize-none"
                          />
                          <Button onClick={runCode} className="mt-4 bg-green-500 hover:bg-green-600">
                            <Play className="mr-2 h-4 w-4" />
                            Run Code
                          </Button>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Output:</label>
                          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-48 overflow-y-auto">
                            {codeOutput ? (
                              <pre className="whitespace-pre-wrap">{codeOutput}</pre>
                            ) : (
                              <div className="text-gray-500">Run your code to see output...</div>
                            )}
                          </div>
                          
                          <div className="mt-4 p-3 bg-green-50 rounded border">
                            <strong className="text-green-700">Expected Output:</strong>
                            <pre className="text-green-600 text-sm mt-1 whitespace-pre-wrap">{challenge.expected_output}</pre>
                          </div>
                        </div>
                      </div>
                      
                      {showHints && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-yellow-50 p-4 rounded-lg border border-yellow-200"
                        >
                          <h4 className="font-bold text-yellow-700 mb-2">Hints:</h4>
                          <ul className="text-yellow-600 text-sm space-y-1">
                            {challenge.hints.map((hint, index) => (
                              <li key={index}>💡 {hint}</li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                      
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Progress:</span>
                          <span className="text-sm text-gray-500">
                            {completedChallenges.length}/{challenges.length} completed
                          </span>
                        </div>
                        <Progress value={(completedChallenges.length / challenges.length) * 100} />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}