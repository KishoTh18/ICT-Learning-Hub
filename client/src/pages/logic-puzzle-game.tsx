import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Cpu, Lightbulb, CheckCircle, XCircle, RotateCcw, Play } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface LogicGate {
  id: string;
  type: 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR';
  x: number;
  y: number;
  inputs: boolean[];
  output: boolean;
}

interface Wire {
  from: { gateId: string; port: 'output' | number };
  to: { gateId: string; port: number };
}

interface Puzzle {
  id: number;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  targetOutputs: boolean[];
  inputCombinations: boolean[][];
  hints: string[];
  maxGates: number;
  allowedGates: ('AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR')[];
}

const puzzles: Puzzle[] = [
  {
    id: 1,
    title: "Simple AND Gate",
    description: "Create a circuit that outputs TRUE only when both inputs are TRUE",
    difficulty: 'Easy',
    targetOutputs: [false, false, false, true],
    inputCombinations: [
      [false, false],
      [false, true],
      [true, false],
      [true, true]
    ],
    hints: [
      "You need an AND gate",
      "Connect both inputs to the AND gate",
      "The output should be TRUE only when both inputs are TRUE"
    ],
    maxGates: 1,
    allowedGates: ['AND', 'OR', 'NOT']
  },
  {
    id: 2,
    title: "NOT Gate Chain",
    description: "Create a circuit that inverts the input signal",
    difficulty: 'Easy',
    targetOutputs: [true, false],
    inputCombinations: [
      [false],
      [true]
    ],
    hints: [
      "Use a NOT gate to invert the signal",
      "Connect the input to the NOT gate",
      "The output should be opposite of the input"
    ],
    maxGates: 1,
    allowedGates: ['NOT', 'AND', 'OR']
  },
  {
    id: 3,
    title: "XOR Implementation",
    description: "Build an XOR gate using AND, OR, and NOT gates",
    difficulty: 'Medium',
    targetOutputs: [false, true, true, false],
    inputCombinations: [
      [false, false],
      [false, true],
      [true, false],
      [true, true]
    ],
    hints: [
      "XOR is TRUE when inputs are different",
      "Use (A AND NOT B) OR (NOT A AND B)",
      "You'll need AND, OR, and NOT gates"
    ],
    maxGates: 5,
    allowedGates: ['AND', 'OR', 'NOT']
  },
  {
    id: 4,
    title: "Half Adder",
    description: "Create a half adder that adds two bits and produces sum and carry",
    difficulty: 'Hard',
    targetOutputs: [false, false, true, false, false, true, true, true],
    inputCombinations: [
      [false, false],
      [false, true],
      [true, false],
      [true, true]
    ],
    hints: [
      "A half adder has two outputs: sum and carry",
      "Sum = A XOR B, Carry = A AND B",
      "You need to implement XOR using basic gates"
    ],
    maxGates: 8,
    allowedGates: ['AND', 'OR', 'NOT']
  }
];

const gateLogic = {
  AND: (inputs: boolean[]) => inputs.every(Boolean),
  OR: (inputs: boolean[]) => inputs.some(Boolean),
  NOT: (inputs: boolean[]) => !inputs[0],
  NAND: (inputs: boolean[]) => !inputs.every(Boolean),
  NOR: (inputs: boolean[]) => !inputs.some(Boolean),
  XOR: (inputs: boolean[]) => inputs.filter(Boolean).length === 1,
};

export default function LogicPuzzleGame() {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [gates, setGates] = useState<LogicGate[]>([]);
  const [wires, setWires] = useState<Wire[]>([]);
  const [inputValues, setInputValues] = useState<boolean[]>([false, false]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState<{ gateId: string; port: 'output' | number } | null>(null);
  const [score, setScore] = useState(0);
  const [completedPuzzles, setCompletedPuzzles] = useState<number[]>([]);
  const [showHints, setShowHints] = useState(false);

  const puzzle = puzzles[currentPuzzle];

  const addGate = (type: LogicGate['type']) => {
    if (gates.length >= puzzle.maxGates) {
      toast({
        title: "Gate Limit Reached",
        description: `Maximum ${puzzle.maxGates} gates allowed for this puzzle`,
        variant: "destructive",
      });
      return;
    }

    const newGate: LogicGate = {
      id: `gate-${Date.now()}`,
      type,
      x: Math.random() * 400 + 100,
      y: Math.random() * 200 + 100,
      inputs: type === 'NOT' ? [false] : [false, false],
      output: false,
    };

    setGates([...gates, newGate]);
  };

  const updateGateOutput = (gate: LogicGate): boolean => {
    return gateLogic[gate.type](gate.inputs);
  };

  const simulateCircuit = () => {
    const updatedGates = [...gates];
    
    // Reset all gate inputs
    updatedGates.forEach(gate => {
      gate.inputs = gate.type === 'NOT' ? [false] : [false, false];
    });

    // Apply input values from external inputs
    // For this simulation, we'll assume the first two gates represent inputs
    // In a real implementation, you'd have dedicated input nodes

    // Propagate signals through wires
    wires.forEach(wire => {
      const fromGate = updatedGates.find(g => g.id === wire.from.gateId);
      const toGate = updatedGates.find(g => g.id === wire.to.gateId);
      
      if (fromGate && toGate) {
        if (wire.from.port === 'output') {
          toGate.inputs[wire.to.port] = fromGate.output;
        }
      }
    });

    // Calculate outputs for all gates
    updatedGates.forEach(gate => {
      gate.output = updateGateOutput(gate);
    });

    setGates(updatedGates);
    return updatedGates;
  };

  const testSolution = () => {
    const results: boolean[] = [];
    
    puzzle.inputCombinations.forEach(inputCombo => {
      setInputValues(inputCombo);
      const simulatedGates = simulateCircuit();
      
      // Find output gates (gates not connected to other gates' inputs)
      const outputGates = simulatedGates.filter(gate => 
        !wires.some(wire => wire.from.gateId === gate.id)
      );
      
      if (outputGates.length > 0) {
        results.push(outputGates[0].output);
      } else {
        results.push(false);
      }
    });

    const isCorrect = results.every((result, index) => result === puzzle.targetOutputs[index]);
    
    if (isCorrect) {
      const points = puzzle.difficulty === 'Easy' ? 100 : puzzle.difficulty === 'Medium' ? 200 : 300;
      setScore(score + points);
      setCompletedPuzzles([...completedPuzzles, puzzle.id]);
      
      toast({
        title: "Puzzle Solved!",
        description: `Excellent work! You earned ${points} points.`,
      });
    } else {
      toast({
        title: "Solution Incorrect",
        description: "The circuit doesn't produce the expected outputs. Try again!",
        variant: "destructive",
      });
    }
  };

  const clearCircuit = () => {
    setGates([]);
    setWires([]);
    setConnectionStart(null);
    setIsConnecting(false);
  };

  const handleGateClick = (gateId: string, port: 'output' | number) => {
    if (isConnecting && connectionStart) {
      // Complete connection
      if (connectionStart.gateId !== gateId) {
        const newWire: Wire = {
          from: connectionStart,
          to: { gateId, port: port as number },
        };
        setWires([...wires, newWire]);
      }
      setIsConnecting(false);
      setConnectionStart(null);
    } else {
      // Start connection
      setIsConnecting(true);
      setConnectionStart({ gateId, port });
    }
  };

  const toggleInput = (index: number) => {
    const newInputs = [...inputValues];
    newInputs[index] = !newInputs[index];
    setInputValues(newInputs);
  };

  const nextPuzzle = () => {
    if (currentPuzzle < puzzles.length - 1) {
      setCurrentPuzzle(currentPuzzle + 1);
      clearCircuit();
      setShowHints(false);
    }
  };

  const selectPuzzle = (index: number) => {
    setCurrentPuzzle(index);
    clearCircuit();
    setShowHints(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-600 to-orange-500 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
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
              <Cpu className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Logic Puzzle</h1>
              <p className="text-xl opacity-90">Solve complex logic gate circuits by connecting components</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Puzzle Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Puzzles</span>
                  <Badge variant="secondary">Score: {score}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {puzzles.map((pz, index) => (
                  <Button
                    key={pz.id}
                    onClick={() => selectPuzzle(index)}
                    variant={currentPuzzle === index ? "default" : "outline"}
                    className={`w-full text-left h-auto p-3 ${currentPuzzle === index ? 'bg-purple-600' : ''}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <div className="font-bold text-sm">{pz.title}</div>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {pz.difficulty}
                        </Badge>
                      </div>
                      {completedPuzzles.includes(pz.id) && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Gate Palette */}
            <Card>
              <CardHeader>
                <CardTitle>Logic Gates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {puzzle.allowedGates.map((gateType) => (
                  <Button
                    key={gateType}
                    onClick={() => addGate(gateType)}
                    variant="outline"
                    disabled={gates.length >= puzzle.maxGates}
                    className="w-full"
                  >
                    {gateType} Gate
                  </Button>
                ))}
                <div className="text-xs text-gray-500 mt-2">
                  Gates used: {gates.length}/{puzzle.maxGates}
                </div>
              </CardContent>
            </Card>

            {/* Input Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Test Inputs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {inputValues.map((value, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">Input {String.fromCharCode(65 + index)}:</span>
                    <Button
                      onClick={() => toggleInput(index)}
                      size="sm"
                      className={value ? 'bg-green-500' : 'bg-red-500'}
                    >
                      {value ? 'HIGH' : 'LOW'}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={simulateCircuit} className="w-full bg-blue-500 hover:bg-blue-600">
                  <Play className="mr-2 h-4 w-4" />
                  Simulate
                </Button>
                <Button onClick={testSolution} className="w-full bg-green-500 hover:bg-green-600">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Test Solution
                </Button>
                <Button onClick={() => setShowHints(!showHints)} variant="outline" className="w-full">
                  <Lightbulb className="mr-2 h-4 w-4" />
                  {showHints ? 'Hide' : 'Show'} Hints
                </Button>
                <Button onClick={clearCircuit} variant="outline" className="w-full">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Canvas Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Puzzle Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{puzzle.title}</span>
                  <Badge variant="outline">{puzzle.difficulty}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{puzzle.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold mb-2">Truth Table:</h4>
                    <div className="bg-gray-50 p-3 rounded">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            {puzzle.inputCombinations[0].map((_, index) => (
                              <th key={index} className="text-left py-1">
                                {String.fromCharCode(65 + index)}
                              </th>
                            ))}
                            <th className="text-left py-1">Output</th>
                          </tr>
                        </thead>
                        <tbody>
                          {puzzle.inputCombinations.map((inputs, index) => (
                            <tr key={index}>
                              {inputs.map((input, inputIndex) => (
                                <td key={inputIndex} className="py-1 font-mono">
                                  {input ? '1' : '0'}
                                </td>
                              ))}
                              <td className="py-1 font-mono font-bold">
                                {puzzle.targetOutputs[index] ? '1' : '0'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-bold mb-2">Progress:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Completed:</span>
                        <span>{completedPuzzles.length}/{puzzles.length}</span>
                      </div>
                      <Progress 
                        value={(completedPuzzles.length / puzzles.length) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>

                {showHints && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200"
                  >
                    <h4 className="font-bold text-yellow-700 mb-2">Hints:</h4>
                    <ul className="text-yellow-600 text-sm space-y-1">
                      {puzzle.hints.map((hint, index) => (
                        <li key={index}>💡 {hint}</li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Circuit Canvas */}
            <Card>
              <CardHeader>
                <CardTitle>Circuit Designer</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  ref={canvasRef}
                  className="relative bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg h-96 overflow-hidden"
                  style={{ minHeight: '400px' }}
                >
                  {/* Wire connections */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {wires.map((wire, index) => {
                      const fromGate = gates.find(g => g.id === wire.from.gateId);
                      const toGate = gates.find(g => g.id === wire.to.gateId);
                      if (!fromGate || !toGate) return null;

                      return (
                        <line
                          key={index}
                          x1={fromGate.x + 40}
                          y1={fromGate.y + 20}
                          x2={toGate.x}
                          y2={toGate.y + 15 + (wire.to.port * 10)}
                          stroke={fromGate.output ? "#10B981" : "#EF4444"}
                          strokeWidth="3"
                        />
                      );
                    })}
                  </svg>

                  {/* Logic gates */}
                  {gates.map((gate) => (
                    <motion.div
                      key={gate.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      style={{ left: gate.x, top: gate.y }}
                      className="absolute bg-white border-2 border-gray-300 rounded-lg p-2 shadow-lg cursor-pointer hover:border-blue-500"
                    >
                      <div className="text-center font-bold text-sm mb-1">{gate.type}</div>
                      
                      {/* Input ports */}
                      <div className="flex flex-col space-y-1">
                        {gate.inputs.map((input, index) => (
                          <button
                            key={index}
                            onClick={() => handleGateClick(gate.id, index)}
                            className={`w-4 h-4 rounded border-2 ${
                              input ? 'bg-green-500 border-green-600' : 'bg-red-500 border-red-600'
                            }`}
                            style={{ marginLeft: '-8px' }}
                          />
                        ))}
                      </div>
                      
                      {/* Output port */}
                      <button
                        onClick={() => handleGateClick(gate.id, 'output')}
                        className={`absolute right-0 top-1/2 transform translate-x-2 -translate-y-1/2 w-4 h-4 rounded border-2 ${
                          gate.output ? 'bg-green-500 border-green-600' : 'bg-red-500 border-red-600'
                        }`}
                      />
                    </motion.div>
                  ))}

                  {gates.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <Cpu className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p>Add logic gates from the sidebar to build your circuit</p>
                        <p className="text-sm mt-2">Click gates to connect them with wires</p>
                      </div>
                    </div>
                  )}

                  {isConnecting && (
                    <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm">
                      Click another gate port to connect
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}