import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Cpu, Zap, Play, RotateCcw } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface Gate {
  type: 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR';
  inputs: boolean[];
  output: boolean;
}

interface DragGate {
  id: string;
  type: Gate['type'];
  x: number;
  y: number;
  inputs: boolean[];
}

const gateLogic = {
  AND: (inputs: boolean[]) => inputs.every(Boolean),
  OR: (inputs: boolean[]) => inputs.some(Boolean),
  NOT: (inputs: boolean[]) => !inputs[0],
  NAND: (inputs: boolean[]) => !inputs.every(Boolean),
  NOR: (inputs: boolean[]) => !inputs.some(Boolean),
  XOR: (inputs: boolean[]) => inputs.filter(Boolean).length === 1,
};

const gateDescriptions = {
  AND: "Output is HIGH only when ALL inputs are HIGH",
  OR: "Output is HIGH when ANY input is HIGH",
  NOT: "Output is the OPPOSITE of the input",
  NAND: "Output is LOW only when ALL inputs are HIGH",
  NOR: "Output is LOW when ANY input is HIGH",
  XOR: "Output is HIGH when EXACTLY ONE input is HIGH",
};

export default function LogicGates() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'learn' | 'simulator' | 'challenge'>('learn');
  const [selectedGate, setSelectedGate] = useState<Gate['type']>('AND');
  const [gateInputs, setGateInputs] = useState<boolean[]>([false, false]);
  const [draggedGates, setDraggedGates] = useState<DragGate[]>([]);
  const [challengeLevel, setChallengeLevel] = useState(1);
  const [challengeComplete, setChallengeComplete] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const calculateOutput = (type: Gate['type'], inputs: boolean[]) => {
    return gateLogic[type](inputs);
  };

  const toggleInput = (index: number) => {
    const newInputs = [...gateInputs];
    newInputs[index] = !newInputs[index];
    setGateInputs(newInputs);
  };

  const addGateToCanvas = (gateType: Gate['type']) => {
    const newGate: DragGate = {
      id: `gate-${Date.now()}`,
      type: gateType,
      x: Math.random() * 300 + 50,
      y: Math.random() * 200 + 50,
      inputs: gateType === 'NOT' ? [false] : [false, false],
    };
    setDraggedGates([...draggedGates, newGate]);
  };

  const clearCanvas = () => {
    setDraggedGates([]);
  };

  const checkChallenge = () => {
    // Simple challenge: Create an AND gate with both inputs HIGH
    if (challengeLevel === 1) {
      const hasAndGate = draggedGates.some(gate => 
        gate.type === 'AND' && gate.inputs.every(Boolean)
      );
      if (hasAndGate) {
        setChallengeComplete(true);
        toast({
          title: "Challenge Complete!",
          description: "Great job! You've created a working AND gate.",
        });
      }
    }
  };

  const resetChallenge = () => {
    setChallengeComplete(false);
    setDraggedGates([]);
  };

  const currentOutput = calculateOutput(selectedGate, gateInputs);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-orange-500 to-emerald-500 text-white py-8">
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
              <Cpu className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Logic Gates</h1>
              <p className="text-xl opacity-90">Build circuits with AND, OR, NOT gates and more</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex space-x-1 mb-8 bg-white p-1 rounded-lg shadow-sm">
          {[
            { key: 'learn', label: 'Learn', icon: Cpu },
            { key: 'simulator', label: 'Simulator', icon: Zap },
            { key: 'challenge', label: 'Challenge', icon: Play },
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              onClick={() => setActiveTab(key as any)}
              variant={activeTab === key ? "default" : "ghost"}
              className={`flex-1 ${activeTab === key ? 'bg-orange-500 text-white' : ''}`}
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
                  <CardTitle className="text-2xl">Understanding Logic Gates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-gray-600">
                    Logic gates are the building blocks of digital circuits. They perform basic logical functions 
                    that are fundamental to digital circuits and computer processors.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(gateDescriptions).map(([gateType, description]) => (
                      <motion.div
                        key={gateType}
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-orange-50 to-emerald-50 p-6 rounded-xl border"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-bold text-orange-700">{gateType} Gate</h3>
                          <Badge className="bg-orange-500">{gateType}</Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">{description}</p>
                        
                        {/* Truth table */}
                        <div className="bg-white p-3 rounded">
                          <div className="text-xs font-bold mb-2">Truth Table:</div>
                          <div className="grid grid-cols-3 gap-1 text-xs font-mono">
                            {gateType === 'NOT' ? (
                              <>
                                <div className="font-bold">A</div>
                                <div></div>
                                <div className="font-bold">OUT</div>
                                <div>0</div>
                                <div></div>
                                <div>{gateLogic[gateType as keyof typeof gateLogic]([false]) ? '1' : '0'}</div>
                                <div>1</div>
                                <div></div>
                                <div>{gateLogic[gateType as keyof typeof gateLogic]([true]) ? '1' : '0'}</div>
                              </>
                            ) : (
                              <>
                                <div className="font-bold">A</div>
                                <div className="font-bold">B</div>
                                <div className="font-bold">OUT</div>
                                <div>0</div>
                                <div>0</div>
                                <div>{gateLogic[gateType as keyof typeof gateLogic]([false, false]) ? '1' : '0'}</div>
                                <div>0</div>
                                <div>1</div>
                                <div>{gateLogic[gateType as keyof typeof gateLogic]([false, true]) ? '1' : '0'}</div>
                                <div>1</div>
                                <div>0</div>
                                <div>{gateLogic[gateType as keyof typeof gateLogic]([true, false]) ? '1' : '0'}</div>
                                <div>1</div>
                                <div>1</div>
                                <div>{gateLogic[gateType as keyof typeof gateLogic]([true, true]) ? '1' : '0'}</div>
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'simulator' && (
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
                      <Zap className="mr-2 h-5 w-5 text-orange-500" />
                      Gate Selector
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      {Object.keys(gateDescriptions).map((gate) => (
                        <Button
                          key={gate}
                          onClick={() => {
                            setSelectedGate(gate as Gate['type']);
                            setGateInputs(gate === 'NOT' ? [false] : [false, false]);
                          }}
                          variant={selectedGate === gate ? "default" : "outline"}
                          className="text-sm"
                        >
                          {gate}
                        </Button>
                      ))}
                    </div>
                    
                    <div className="border-t pt-4">
                      <h4 className="font-bold mb-2">Current Gate: {selectedGate}</h4>
                      <p className="text-sm text-gray-600">
                        {gateDescriptions[selectedGate]}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-lg">
                  <CardHeader>
                    <CardTitle>Input Controls</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {gateInputs.map((input, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium">Input {String.fromCharCode(65 + index)}:</span>
                        <Button
                          onClick={() => toggleInput(index)}
                          className={`w-16 ${input ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                        >
                          {input ? 'HIGH' : 'LOW'}
                        </Button>
                      </div>
                    ))}
                    
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between">
                        <span className="font-bold">Output:</span>
                        <div className={`px-4 py-2 rounded font-bold ${
                          currentOutput ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                        }`}>
                          {currentOutput ? 'HIGH (1)' : 'LOW (0)'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-lg">
                  <CardHeader>
                    <CardTitle>Visual Circuit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-100 p-6 rounded-lg min-h-48 flex items-center justify-center">
                      <div className="text-center">
                        <div className="mb-4">
                          <div className="text-2xl font-bold mb-2">{selectedGate} Gate</div>
                          <div className="flex items-center justify-center space-x-4">
                            {gateInputs.map((input, index) => (
                              <div key={index} className="text-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                                  input ? 'bg-green-500' : 'bg-red-500'
                                }`}>
                                  {input ? '1' : '0'}
                                </div>
                                <div className="text-xs mt-1">IN{index + 1}</div>
                              </div>
                            ))}
                            <div className="text-2xl">→</div>
                            <div className="text-center">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg ${
                                currentOutput ? 'bg-green-500' : 'bg-red-500'
                              }`}>
                                {currentOutput ? '1' : '0'}
                              </div>
                              <div className="text-xs mt-1">OUT</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {activeTab === 'challenge' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Play className="mr-2 h-5 w-5 text-orange-500" />
                      Logic Gates Challenge
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={clearCanvas} variant="outline" size="sm">
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Clear
                      </Button>
                      <Button onClick={checkChallenge} className="bg-orange-500">
                        Check Solution
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div>
                      <h3 className="font-bold mb-4">Challenge {challengeLevel}</h3>
                      <div className="bg-blue-50 p-4 rounded-lg mb-4">
                        <p className="text-sm">
                          <strong>Goal:</strong> Create an AND gate circuit where both inputs are HIGH, 
                          resulting in a HIGH output.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Available Gates:</h4>
                        {Object.keys(gateDescriptions).map((gate) => (
                          <Button
                            key={gate}
                            onClick={() => addGateToCanvas(gate as Gate['type'])}
                            variant="outline"
                            size="sm"
                            className="w-full text-xs"
                          >
                            Add {gate}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="lg:col-span-3">
                      <div 
                        ref={canvasRef}
                        className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-96 relative"
                      >
                        <div className="text-center text-gray-500 mb-4">
                          Circuit Canvas - Drag gates here
                        </div>
                        
                        {draggedGates.map((gate) => (
                          <motion.div
                            key={gate.id}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            style={{ left: gate.x, top: gate.y }}
                            className="absolute bg-white border-2 border-orange-500 rounded-lg p-3 shadow-lg"
                          >
                            <div className="text-center">
                              <div className="font-bold text-sm mb-2">{gate.type}</div>
                              <div className="flex items-center space-x-2">
                                {gate.inputs.map((input, index) => (
                                  <button
                                    key={index}
                                    onClick={() => {
                                      const newGates = draggedGates.map(g => {
                                        if (g.id === gate.id) {
                                          const newInputs = [...g.inputs];
                                          newInputs[index] = !newInputs[index];
                                          return { ...g, inputs: newInputs };
                                        }
                                        return g;
                                      });
                                      setDraggedGates(newGates);
                                    }}
                                    className={`w-6 h-6 rounded text-xs font-bold ${
                                      input ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                    }`}
                                  >
                                    {input ? '1' : '0'}
                                  </button>
                                ))}
                                <div className="text-xs">→</div>
                                <div className={`w-6 h-6 rounded text-xs font-bold ${
                                  calculateOutput(gate.type, gate.inputs) ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                }`}>
                                  {calculateOutput(gate.type, gate.inputs) ? '1' : '0'}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      
                      {challengeComplete && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg"
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-green-800">
                              <strong>Challenge Complete!</strong> Well done!
                            </div>
                            <Button onClick={resetChallenge} size="sm">
                              Next Challenge
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}