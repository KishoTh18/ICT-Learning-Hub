import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import type { BinaryConverterState } from "@/lib/types";

export default function InteractiveDemo() {
  const [converter, setConverter] = useState<BinaryConverterState>({
    binaryInput: "1101",
    decimalResult: 13,
    isValid: true,
  });

  const validateBinary = (input: string): boolean => {
    return /^[01]+$/.test(input) && input.length > 0;
  };

  const binaryToDecimal = (binary: string): number => {
    return parseInt(binary, 2);
  };

  const handleBinaryChange = (value: string) => {
    const isValid = validateBinary(value);
    const decimalResult = isValid ? binaryToDecimal(value) : 0;
    
    setConverter({
      binaryInput: value,
      decimalResult,
      isValid,
    });
  };

  const binaryDigits = converter.binaryInput.split('').map((digit, index) => ({
    digit,
    position: converter.binaryInput.length - 1 - index,
    value: digit === '1' ? Math.pow(2, converter.binaryInput.length - 1 - index) : 0
  }));

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Try Interactive Learning</h2>
          <p className="text-xl text-gray-600">Experience our hands-on approach with this binary conversion demo</p>
        </div>
        
        <Card className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <CardContent className="p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Binary to Decimal Converter</h3>
                <div className="space-y-6">
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter Binary Number:
                    </Label>
                    <Input
                      type="text"
                      placeholder="e.g., 1101"
                      value={converter.binaryInput}
                      onChange={(e) => handleBinaryChange(e.target.value)}
                      className={`text-lg font-mono ${
                        !converter.isValid && converter.binaryInput ? 'border-red-500' : ''
                      }`}
                    />
                    {!converter.isValid && converter.binaryInput && (
                      <p className="text-red-500 text-sm mt-1">Please enter only 0s and 1s</p>
                    )}
                  </div>
                  
                  <div className="drag-drop-zone p-6 rounded-xl">
                    <p className="text-center text-gray-600 mb-4">
                      Binary digits with their position values
                    </p>
                    <div className="flex justify-center space-x-4 flex-wrap gap-2">
                      {binaryDigits.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex flex-col items-center p-3 rounded-lg ${
                            item.digit === '1' 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-300 text-gray-600'
                          }`}
                        >
                          <div className="text-xl font-bold">{item.digit}</div>
                          <div className="text-xs mt-1">2^{item.position}</div>
                          <div className="text-xs">= {Math.pow(2, item.position)}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                    <p className="text-emerald-700 font-semibold">
                      Decimal Result: <span className="text-2xl font-bold">{converter.decimalResult}</span>
                    </p>
                    {converter.isValid && converter.binaryInput && (
                      <div className="mt-2 text-sm text-emerald-600">
                        {converter.binaryInput}₂ = {binaryDigits
                          .filter(item => item.digit === '1')
                          .map(item => `${item.value}`)
                          .join(' + ')} = {converter.decimalResult}₁₀
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 rounded-2xl text-white">
                <h4 className="text-xl font-bold mb-4">How it works:</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center font-bold">
                      1
                    </div>
                    <p>Each position represents a power of 2</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center font-bold">
                      2
                    </div>
                    <p>Multiply digit by its position value</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                    <p>Add all values together</p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-white bg-opacity-10 rounded-lg">
                  <p className="text-sm font-mono">
                    Example: 1101₂ = 1×8 + 1×4 + 0×2 + 1×1 = 13₁₀
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
