import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Network, Calculator, Target, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface SubnetInfo {
  network: string;
  broadcast: string;
  firstHost: string;
  lastHost: string;
  subnetMask: string;
  wildcardMask: string;
  totalHosts: number;
  usableHosts: number;
}

interface SubnettingScenario {
  title: string;
  description: string;
  network: string;
  requirements: number[];
  solution?: SubnetInfo[];
}

const scenarios: SubnettingScenario[] = [
  {
    title: "Small Office Network",
    description: "Divide 192.168.1.0/24 into 4 equal subnets",
    network: "192.168.1.0/24",
    requirements: [62, 62, 62, 62],
  },
  {
    title: "Department Subnetting",
    description: "Create subnets for: Sales (50 hosts), IT (30 hosts), HR (10 hosts)",
    network: "10.0.0.0/24",
    requirements: [50, 30, 10],
  },
  {
    title: "VLSM Challenge",
    description: "Optimize 172.16.0.0/16 for: Main Office (500), Branch 1 (100), Branch 2 (50)",
    network: "172.16.0.0/16",
    requirements: [500, 100, 50],
  },
];

export default function Subnetting() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'learn' | 'calculator' | 'practice'>('learn');
  const [networkInput, setNetworkInput] = useState("192.168.1.0");
  const [subnetBits, setSubnetBits] = useState(2);
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [userSolution, setUserSolution] = useState<string[]>([]);
  
  const validateNetworkInput = (input: string) => {
    const pattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = input.match(pattern);
    if (!match) return false;
    return match.slice(1).every(octet => parseInt(octet) <= 255);
  };

  const calculateSubnets = (network: string, subnetBits: number): SubnetInfo[] => {
    if (!validateNetworkInput(network)) return [];
    
    const networkOctets = network.split('.').map(n => parseInt(n));
    const totalSubnets = Math.pow(2, subnetBits);
    const hostsPerSubnet = Math.pow(2, 8 - subnetBits);
    const subnetMask = `255.255.255.${256 - hostsPerSubnet}`;
    const wildcardMask = `0.0.0.${hostsPerSubnet - 1}`;
    
    const subnets: SubnetInfo[] = [];
    
    for (let i = 0; i < totalSubnets; i++) {
      const subnetStart = networkOctets[3] + (i * hostsPerSubnet);
      const subnetEnd = subnetStart + hostsPerSubnet - 1;
      
      const networkAddr = `${networkOctets[0]}.${networkOctets[1]}.${networkOctets[2]}.${subnetStart}`;
      const broadcastAddr = `${networkOctets[0]}.${networkOctets[1]}.${networkOctets[2]}.${subnetEnd}`;
      const firstHost = `${networkOctets[0]}.${networkOctets[1]}.${networkOctets[2]}.${subnetStart + 1}`;
      const lastHost = `${networkOctets[0]}.${networkOctets[1]}.${networkOctets[2]}.${subnetEnd - 1}`;
      
      subnets.push({
        network: networkAddr,
        broadcast: broadcastAddr,
        firstHost,
        lastHost,
        subnetMask,
        wildcardMask,
        totalHosts: hostsPerSubnet,
        usableHosts: hostsPerSubnet - 2,
      });
    }
    
    return subnets;
  };

  const calculateVLSM = (baseNetwork: string, requirements: number[]): SubnetInfo[] => {
    // Sort requirements in descending order for VLSM
    const sortedReqs = [...requirements].sort((a, b) => b - a);
    const subnets: SubnetInfo[] = [];
    
    let currentNetwork = baseNetwork.split('.').map(n => parseInt(n));
    let currentOctet = 0; // Start with the last octet
    
    sortedReqs.forEach((hostReq) => {
      // Calculate required subnet size (next power of 2 that fits hostReq + 2)
      const requiredHosts = hostReq + 2; // +2 for network and broadcast
      const subnetSize = Math.pow(2, Math.ceil(Math.log2(requiredHosts)));
      const subnetBits = 8 - Math.log2(subnetSize);
      
      const subnetMask = `255.255.255.${256 - subnetSize}`;
      const wildcardMask = `0.0.0.${subnetSize - 1}`;
      
      const networkAddr = `${currentNetwork[0]}.${currentNetwork[1]}.${currentNetwork[2]}.${currentOctet}`;
      const broadcastAddr = `${currentNetwork[0]}.${currentNetwork[1]}.${currentNetwork[2]}.${currentOctet + subnetSize - 1}`;
      const firstHost = `${currentNetwork[0]}.${currentNetwork[1]}.${currentNetwork[2]}.${currentOctet + 1}`;
      const lastHost = `${currentNetwork[0]}.${currentNetwork[1]}.${currentNetwork[2]}.${currentOctet + subnetSize - 2}`;
      
      subnets.push({
        network: networkAddr,
        broadcast: broadcastAddr,
        firstHost,
        lastHost,
        subnetMask,
        wildcardMask,
        totalHosts: subnetSize,
        usableHosts: subnetSize - 2,
      });
      
      currentOctet += subnetSize;
    });
    
    return subnets;
  };

  const checkSolution = () => {
    const scenario = scenarios[selectedScenario];
    const correctSolution = calculateVLSM(scenario.network.split('/')[0], scenario.requirements);
    
    // Simple check - compare number of subnets created
    if (userSolution.length === correctSolution.length) {
      toast({
        title: "Great job!",
        description: "Your subnetting solution looks correct!",
      });
    } else {
      toast({
        title: "Try again",
        description: `Expected ${correctSolution.length} subnets, but found ${userSolution.length}`,
        variant: "destructive",
      });
    }
  };

  const subnets = calculateSubnets(networkInput, subnetBits);
  const scenario = scenarios[selectedScenario];
  const scenarioSolution = calculateVLSM(scenario.network.split('/')[0], scenario.requirements);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-600 to-orange-500 text-white py-8">
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
              <h1 className="text-4xl font-bold mb-2">Subnetting</h1>
              <p className="text-xl opacity-90">Master subnet calculations and VLSM techniques</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex space-x-1 mb-8 bg-white p-1 rounded-lg shadow-sm">
          {[
            { key: 'learn', label: 'Learn', icon: Network },
            { key: 'calculator', label: 'Calculator', icon: Calculator },
            { key: 'practice', label: 'Practice', icon: Target },
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
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Understanding Subnetting</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-purple-50 p-6 rounded-xl">
                      <h3 className="text-lg font-bold text-purple-700 mb-3">What is Subnetting?</h3>
                      <p className="text-gray-600">
                        Subnetting is the practice of dividing a network into smaller, more manageable sub-networks. 
                        This improves network performance, security, and organization.
                      </p>
                    </div>
                    <div className="bg-orange-50 p-6 rounded-xl">
                      <h3 className="text-lg font-bold text-orange-700 mb-3">Benefits</h3>
                      <ul className="text-gray-600 space-y-1 text-sm">
                        <li>• Reduced broadcast traffic</li>
                        <li>• Better security isolation</li>
                        <li>• Efficient IP address usage</li>
                        <li>• Easier network management</li>
                      </ul>
                    </div>
                  </div>
                  
                  <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4">Subnetting Process</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="font-bold">1</span>
                          </div>
                          <h4 className="font-bold mb-2">Determine Requirements</h4>
                          <p className="text-sm text-gray-600">Calculate how many subnets and hosts you need</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="font-bold">2</span>
                          </div>
                          <h4 className="font-bold mb-2">Calculate Subnet Bits</h4>
                          <p className="text-sm text-gray-600">Determine how many bits to borrow for subnetting</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="font-bold">3</span>
                          </div>
                          <h4 className="font-bold mb-2">Create Subnet Table</h4>
                          <p className="text-sm text-gray-600">List all subnet ranges and their properties</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="bg-gradient-to-r from-purple-600 to-orange-500 text-white p-6 rounded-xl">
                    <h3 className="text-xl font-bold mb-4">Key Formulas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Number of Subnets:</strong> 2^(subnet bits)
                      </div>
                      <div>
                        <strong>Hosts per Subnet:</strong> 2^(host bits) - 2
                      </div>
                      <div>
                        <strong>Subnet Increment:</strong> 256 - subnet mask value
                      </div>
                      <div>
                        <strong>Broadcast Address:</strong> Next subnet - 1
                      </div>
                    </div>
                  </div>
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
                    <Calculator className="mr-2 h-5 w-5 text-purple-500" />
                    Subnet Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Network Address:</label>
                      <Input
                        value={networkInput}
                        onChange={(e) => setNetworkInput(e.target.value)}
                        placeholder="e.g., 192.168.1.0"
                        className="font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Subnet Bits:</label>
                      <Input
                        type="number"
                        min="1"
                        max="6"
                        value={subnetBits}
                        onChange={(e) => setSubnetBits(parseInt(e.target.value) || 2)}
                        className="font-mono"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-bold text-blue-700 mb-2">Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div><strong>Total Subnets:</strong> {Math.pow(2, subnetBits)}</div>
                      <div><strong>Hosts per Subnet:</strong> {Math.pow(2, 8 - subnetBits) - 2}</div>
                      <div><strong>Subnet Mask:</strong> 255.255.255.{256 - Math.pow(2, 8 - subnetBits)}</div>
                      <div><strong>Increment:</strong> {Math.pow(2, 8 - subnetBits)}</div>
                    </div>
                  </div>
                  
                  {validateNetworkInput(networkInput) && subnets.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2">Subnet</th>
                            <th className="border border-gray-300 p-2">Network</th>
                            <th className="border border-gray-300 p-2">First Host</th>
                            <th className="border border-gray-300 p-2">Last Host</th>
                            <th className="border border-gray-300 p-2">Broadcast</th>
                            <th className="border border-gray-300 p-2">Usable Hosts</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subnets.map((subnet, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="border border-gray-300 p-2 font-bold">{index + 1}</td>
                              <td className="border border-gray-300 p-2 font-mono">{subnet.network}</td>
                              <td className="border border-gray-300 p-2 font-mono">{subnet.firstHost}</td>
                              <td className="border border-gray-300 p-2 font-mono">{subnet.lastHost}</td>
                              <td className="border border-gray-300 p-2 font-mono">{subnet.broadcast}</td>
                              <td className="border border-gray-300 p-2 text-center">{subnet.usableHosts}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
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
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Target className="mr-2 h-5 w-5 text-orange-500" />
                      Subnetting Practice
                    </div>
                    <Button onClick={checkSolution} className="bg-orange-500">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Check Solution
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {scenarios.map((scenario, index) => (
                      <Button
                        key={index}
                        onClick={() => setSelectedScenario(index)}
                        variant={selectedScenario === index ? "default" : "outline"}
                        className={`p-4 h-auto text-left ${selectedScenario === index ? 'bg-purple-600' : ''}`}
                      >
                        <div>
                          <div className="font-bold">{scenario.title}</div>
                          <div className="text-sm opacity-75 mt-1">{scenario.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                  
                  <Card className="border-l-4 border-l-orange-500">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4">{scenario.title}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-bold mb-2">Requirements:</h4>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm space-y-1">
                              <div><strong>Base Network:</strong> {scenario.network}</div>
                              <div><strong>Host Requirements:</strong></div>
                              <ul className="ml-4">
                                {scenario.requirements.map((req, index) => (
                                  <li key={index}>• Subnet {index + 1}: {req} hosts</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-bold mb-2">Solution (VLSM):</h4>
                          <div className="space-y-2">
                            {scenarioSolution.map((subnet, index) => (
                              <div key={index} className="bg-green-50 p-3 rounded border">
                                <div className="text-sm">
                                  <strong>Subnet {index + 1}:</strong> {subnet.network}
                                  <br />
                                  <span className="text-gray-600">
                                    Hosts: {subnet.firstHost} - {subnet.lastHost} ({subnet.usableHosts} usable)
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}