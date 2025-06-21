import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LaptopIcon, BookOpen, Gamepad2, HelpCircle, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NavigationHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const navItems = [
    { id: 'topics', label: 'Topics', icon: BookOpen, color: 'from-blue-500 to-cyan-500' },
    { id: 'games', label: 'Games', icon: Gamepad2, color: 'from-purple-500 to-pink-500' },
    { id: 'quizzes', label: 'Quizzes', icon: HelpCircle, color: 'from-green-500 to-emerald-500' },
  ];

  return (
    <nav className="bg-gradient-to-r from-indigo-600/80 via-purple-600/80 to-pink-600/80 backdrop-blur-lg shadow-2xl sticky top-0 z-50 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <div className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white border-opacity-30">
                <LaptopIcon className="text-white h-6 w-6" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <div className="text-2xl font-bold text-white drop-shadow-lg">
                ICT Learning Hub
              </div>
              <div className="text-xs text-white text-opacity-80 font-medium">
                Interactive Computer Technology
              </div>
            </div>
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="relative group"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={`bg-gradient-to-r ${item.color} p-3 rounded-xl shadow-lg backdrop-blur-sm border border-white border-opacity-20 transition-all duration-300 hover:shadow-2xl hover:border-opacity-40`}>
                    <div className="flex items-center space-x-2">
                      <Icon className="h-5 w-5 text-white" />
                      <span className="text-white font-semibold text-sm">
                        {item.label}
                      </span>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"></div>
                </motion.button>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 border border-white border-opacity-30 backdrop-blur-sm"
            >
              {isMenuOpen ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gradient-to-r from-indigo-700/90 via-purple-700/90 to-pink-700/90 backdrop-blur-lg border-t border-white/20"
          >
            <div className="px-4 py-6 space-y-3">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="w-full text-left"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className={`bg-gradient-to-r ${item.color} p-4 rounded-xl shadow-lg backdrop-blur-sm border border-white border-opacity-20`}>
                      <div className="flex items-center space-x-3">
                        <Icon className="h-6 w-6 text-white" />
                        <span className="text-white font-semibold">
                          {item.label}
                        </span>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
