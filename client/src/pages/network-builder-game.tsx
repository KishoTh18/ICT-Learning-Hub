import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Network, Router, Monitor, Wifi, CheckCircle, XCircle, Target } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface NetworkDevice {
  id: string;
  type: 'computer' | 'router' | 'switch' | 'server';
  x: number;
  y: number;
  ip?: string;
  connected: string[];
  name: string;
}

interface Connection {
  from: string;
  to: string;
  type: 'ethernet' | 'wifi';
}

interface Scenario {
  id: number;
  title: string;
  description: string;
  objective: string;
  requiredDevices: { type: string; count: number }[];
  requiredConnections: number;
  hints: string[];
  solution: {
    devices: NetworkDevice[];
    connections: Connection[];
  };
}

const scenarios: Scenario[] = [
  {
    id: 1,
    title: "Home Network Setup",
    description: "Create a basic home network with internet access",
    objective: "Connect 2 computers to the internet through a router",
    requiredDevices: [
      { type: 'router', count: 1 },
      { type: 'computer', count: 2 }
    ],
    requiredConnections: 2,
    hints: [
      "Routers provide internet access to devices",
      "Computers need to connect to the router",
      "Each device needs an IP address in the same subnet"
    ],
    solution: {
      devices: [],
      connections: []
    }
  },
  {
    id: 2,
    title: "Office Network",
    description: "Set up a small office network with a server",
    objective: "Connect 3 computers and 1 server through a switch and router",
    requiredDevices: [
      { type: 'router', count: 1 },
      { type: 'switch', count: 1 },
      { type: 'computer', count: 3 },
      { type: 'server', count: 1 }
    ],
    requiredConnections: 5,
    hints: [
      "Switches connect multiple devices in a LAN",
      "The router connects the LAN to the internet",
      "Servers typically have static IP addresses"
    ],
    solution: {
      devices: [],
      connections: []
    }
  },
  {
    id: 3,
    title: "Multi-Floor Network",
    description: "Design a network spanning multiple floors",
    objective: "Create a network with wireless and wired connections across floors",
    requiredDevices: [
      { type: 'router', count: 2 },
      { type: 'switch', count: 1 },
      { type: 'computer', count: 4 }
    ],
    requiredConnections: 6,
    hints: [
      "Multiple routers can extend network coverage",
      "Switches can connect devices on the same floor",
      "Plan IP addressing for different subnets"
    ],
    solution: {
      devices: [],
      connections: []
    }
  }
];

const deviceIcons = {
  computer: Monitor,
  router: Router,
  switch: Network,
  server: Wifi,
};

const deviceColors = {
  computer: 'bg-blue-500',
  router: 'bg-green-500',
  switch: 'bg-purple-500',
  server: 'bg-orange-500',
};

export default function NetworkBuilderGame() {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [devices, setDevices] = useState<NetworkDevice[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [score, setScore] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const scenario = scenarios[currentScenario];

  const addDevice = (type: 'computer' | 'router' | 'switch' | 'server') => {
    const newDevice: NetworkDevice = {
      id: `${type}-${Date.now()}`,
      type,
      x: Math.random() * 500 + 50,
      y: Math.random() * 300 + 50,
      connected: [],
      name: `${type.charAt(0).toUpperCase() + type.slice(1)}-${devices.filter(d => d.type === type).length + 1}`,
    };

    // Auto-assign IP addresses
    if (type === 'router') {
      newDevice.ip = `192.168.${devices.filter(d => d.type === 'router').length + 1}.1`;
    } else {
      const routerCount = devices.filter(d => d.type === 'router').length || 1;
      const deviceCount = devices.filter(d => d.type !== 'router').length;
      newDevice.ip = `192.168.${routerCount}.${deviceCount + 2}`;
    }

    setDevices([...devices, newDevice]);
  };

  const connectDevices = (device1Id: string, device2Id: string) => {
    if (device1Id === device2Id) return;

    const existing = connections.find(c => 
      (c.from === device1Id && c.to === device2Id) ||
      (c.from === device2Id && c.to === device1Id)
    );

    if (existing) {
      toast({
        title: "Already Connected",
        description: "These devices are already connected",
        variant: "destructive",
      });
      return;
    }

    const newConnection: Connection = {
      from: device1Id,
      to: device2Id,
      type: 'ethernet',
    };

    setConnections([...connections, newConnection]);
    
    // Update device connections
    setDevices(prev => prev.map(device => {
      if (device.id === device1Id) {
        return { ...device, connected: [...device.connected, device2Id] };
      }
      if (device.id === device2Id) {
        return { ...device, connected: [...device.connected, device1Id] };
      }
      return device;
    }));

    toast({
      title: "Connection Made",
      description: "Devices connected successfully",
    });
  };

  const handleDeviceClick = (deviceId: string) => {
    if (isConnecting && selectedDevice && selectedDevice !== deviceId) {
      connectDevices(selectedDevice, deviceId);
      setSelectedDevice(null);
      setIsConnecting(false);
    } else {
      setSelectedDevice(deviceId);
      setIsConnecting(true);
    }
  };

  const clearCanvas = () => {
    setDevices([]);
    setConnections([]);
    setSelectedDevice(null);
    setIsConnecting(false);
    setIsCompleted(false);
  };

  const checkSolution = () => {
    const deviceCounts = scenario.requiredDevices.reduce((acc, req) => {
      acc[req.type] = req.count;
      return acc;
    }, {} as { [key: string]: number });

    const actualCounts = devices.reduce((acc, device) => {
      acc[device.type] = (acc[device.type] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    let isCorrect = true;
    let feedback = [];

    // Check device counts
    for (const [type, requiredCount] of Object.entries(deviceCounts)) {
      const actualCount = actualCounts[type] || 0;
      if (actualCount < requiredCount) {
        isCorrect = false;
        feedback.push(`Need ${requiredCount - actualCount} more ${type}(s)`);
      }
    }

    // Check connections
    if (connections.length < scenario.requiredConnections) {
      isCorrect = false;
      feedback.push(`Need ${scenario.requiredConnections - connections.length} more connections`);
    }

    // Basic network validation
    const routers = devices.filter(d => d.type === 'router');
    const otherDevices = devices.filter(d => d.type !== 'router');
    
    if (routers.length > 0) {
      const connectedToRouter = otherDevices.filter(device => 
        device.connected.some(connId => 
          devices.find(d => d.id === connId)?.type === 'router'
        )
      );

      if (connectedToRouter.length < otherDevices.length) {
        isCorrect = false;
        feedback.push("All devices should connect to the network through a router");
      }
    }

    if (isCorrect) {
      setIsCompleted(true);
      const points = 100 + (scenario.id * 50);
      setScore(score + points);
      toast({
        title: "Network Complete!",
        description: `Great job! You earned ${points} points.`,
      });
    } else {
      toast({
        title: "Network Incomplete",
        description: feedback.join(", "),
        variant: "destructive",
      });
    }
  };

  const nextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      clearCanvas();
    }
  };

  const resetScenario = () => {
    setCurrentScenario(0);
    setScore(0);
    clearCanvas();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-8">
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
              <Network className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Network Builder</h1>
              <p className="text-xl opacity-90">Design and configure networks by dragging and connecting devices</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Scenario Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Scenarios</span>
                  <Badge variant="secondary">Score: {score}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {scenarios.map((sc, index) => (
                  <Button
                    key={sc.id}
                    onClick={() => {
                      setCurrentScenario(index);
                      clearCanvas();
                    }}
                    variant={currentScenario === index ? "default" : "outline"}
                    className={`w-full text-left h-auto p-3 ${currentScenario === index ? 'bg-emerald-500' : ''}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <div className="font-bold text-sm">{sc.title}</div>
                        <div className="text-xs opacity-75 mt-1">{sc.description}</div>
                      </div>
                      {index < currentScenario && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Device Palette */}
            <Card>
              <CardHeader>
                <CardTitle>Network Devices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(deviceIcons).map(([type, Icon]) => (
                  <Button
                    key={type}
                    onClick={() => addDevice(type as any)}
                    variant="outline"
                    className="w-full flex items-center justify-start space-x-3 h-auto p-3"
                  >
                    <div className={`w-8 h-8 rounded-lg ${deviceColors[type as keyof typeof deviceColors]} flex items-center justify-center`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="capitalize">{type}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={checkSolution} className="w-full bg-green-500 hover:bg-green-600">
                  <Target className="mr-2 h-4 w-4" />
                  Check Network
                </Button>
                <Button onClick={() => setShowHints(!showHints)} variant="outline" className="w-full">
                  {showHints ? 'Hide' : 'Show'} Hints
                </Button>
                <Button onClick={clearCanvas} variant="outline" className="w-full">
                  Clear Canvas
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Canvas Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Scenario Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{scenario.title}</span>
                  <Badge variant="outline">Scenario {scenario.id}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold mb-2">Objective:</h4>
                    <p className="text-sm text-gray-600 mb-4">{scenario.objective}</p>
                    <div className="space-y-2">
                      <div className="text-xs font-medium">Required Devices:</div>
                      {scenario.requiredDevices.map((req, index) => (
                        <div key={index} className="flex items-center justify-between text-xs">
                          <span className="capitalize">{req.type}:</span>
                          <Badge variant="secondary">{req.count}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">Progress:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Devices:</span>
                        <span>{devices.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Connections:</span>
                        <span>{connections.length}/{scenario.requiredConnections}</span>
                      </div>
                      <Progress 
                        value={(connections.length / scenario.requiredConnections) * 100} 
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
                      {scenario.hints.map((hint, index) => (
                        <li key={index}>💡 {hint}</li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Network Canvas */}
            <Card>
              <CardHeader>
                <CardTitle>Network Canvas</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  ref={canvasRef}
                  className="relative bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg h-96 overflow-hidden"
                  style={{ minHeight: '400px' }}
                >
                  {/* Connection Lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {connections.map((connection, index) => {
                      const fromDevice = devices.find(d => d.id === connection.from);
                      const toDevice = devices.find(d => d.id === connection.to);
                      if (!fromDevice || !toDevice) return null;

                      return (
                        <line
                          key={index}
                          x1={fromDevice.x + 24}
                          y1={fromDevice.y + 24}
                          x2={toDevice.x + 24}
                          y2={toDevice.y + 24}
                          stroke="#3B82F6"
                          strokeWidth="2"
                          strokeDasharray={connection.type === 'wifi' ? "5,5" : "none"}
                        />
                      );
                    })}
                  </svg>

                  {/* Devices */}
                  {devices.map((device) => {
                    const Icon = deviceIcons[device.type];
                    const isSelected = selectedDevice === device.id;
                    
                    return (
                      <motion.div
                        key={device.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        style={{ left: device.x, top: device.y }}
                        className={`absolute cursor-pointer ${
                          isSelected ? 'ring-4 ring-blue-500' : ''
                        }`}
                        onClick={() => handleDeviceClick(device.id)}
                      >
                        <div className={`w-12 h-12 rounded-lg ${deviceColors[device.type]} flex items-center justify-center shadow-lg hover:scale-110 transition-transform`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-xs text-center mt-1 bg-white px-1 rounded shadow">
                          {device.name}
                        </div>
                        {device.ip && (
                          <div className="text-xs text-center text-gray-500 font-mono">
                            {device.ip}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}

                  {devices.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <Network className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p>Add network devices from the sidebar to get started</p>
                        <p className="text-sm mt-2">Click devices to connect them</p>
                      </div>
                    </div>
                  )}

                  {isConnecting && selectedDevice && (
                    <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm">
                      Click another device to connect
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Completion Modal */}
            {isCompleted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              >
                <Card className="max-w-md mx-4">
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-600">
                      <CheckCircle className="mr-2 h-6 w-6" />
                      Network Complete!
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <p>Congratulations! You've successfully built the network.</p>
                    <div className="flex space-x-4 justify-center">
                      {currentScenario < scenarios.length - 1 ? (
                        <Button onClick={nextScenario} className="bg-green-500 hover:bg-green-600">
                          Next Scenario
                        </Button>
                      ) : (
                        <Button onClick={resetScenario} className="bg-blue-500 hover:bg-blue-600">
                          Play Again
                        </Button>
                      )}
                      <Button onClick={() => setIsCompleted(false)} variant="outline">
                        Continue Building
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}