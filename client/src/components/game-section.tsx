import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Users, Brain, Lightbulb, Dice1 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import type { Game } from "@shared/schema";

const iconMap: { [key: string]: any } = {
  dice: Dice1,
  'network-wired': Brain,
  'puzzle-piece': Lightbulb,
};

const gradientMap: { [key: string]: string } = {
  'from-electric-blue to-purple': 'from-blue-500 to-purple-600',
  'from-emerald to-electric-blue': 'from-emerald-500 to-blue-500',
  'from-purple to-orange': 'from-purple-600 to-orange-500',
};

const gameTypes: { [key: string]: { icon: any; label: string } } = {
  'Binary Race': { icon: Users, label: 'Multiplayer' },
  'Network Builder': { icon: Brain, label: 'Strategy' },
  'Logic Puzzle': { icon: Lightbulb, label: 'Logic' },
};

export default function GameSection() {
  const { data: games, isLoading } = useQuery<Game[]>({
    queryKey: ['/api/games'],
  });

  const getGamePath = (game: Game) => {
    const pathMap: { [key: string]: string } = {
      'Binary Race': '/games/binary-race',
      'Network Builder': '/games/network-builder',
      'Logic Puzzle': '/games/logic-puzzle',
    };
    return pathMap[game.title] || '/';
  };

  if (isLoading) {
    return (
      <section id="games" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Learning Games</h2>
            <p className="text-xl text-gray-600">Master concepts through fun, interactive challenges</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200" />
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="games" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Learning Games</h2>
          <p className="text-xl text-gray-600">Master concepts through fun, interactive challenges</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games?.map((game, index) => {
            const IconComponent = iconMap[game.icon] || Dice1;
            const gradientClass = gradientMap[game.gradient] || 'from-blue-500 to-purple-600';
            const gameTypeInfo = gameTypes[game.type] || { icon: Users, label: 'Game' };
            const GameTypeIcon = gameTypeInfo.icon;
            
            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white rounded-2xl shadow-lg card-hover overflow-hidden">
                  <div className={`h-48 bg-gradient-to-br ${gradientClass} p-6 flex items-center justify-center`}>
                    <div className="text-center text-white">
                      <IconComponent className="h-16 w-16 mb-4 animate-pulse mx-auto" />
                      <h3 className="text-xl font-bold">{game.title}</h3>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-gray-600 mb-4">{game.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-500">
                        {game.type === 'Binary Race' 
                          ? `High Score: ${game.highScore.toLocaleString()}`
                          : `Times Played: ${game.timesPlayed}`
                        }
                      </span>
                      <div className="flex items-center">
                        <GameTypeIcon className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-500">{gameTypeInfo.label}</span>
                      </div>
                    </div>
                    <Link href={getGamePath(game)}>
                      <Button
                        className={`w-full bg-gradient-to-r ${gradientClass} text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity`}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        {game.type === 'Binary Race' 
                          ? 'Play Now'
                          : game.type === 'Network Builder'
                          ? 'Start Building'
                          : 'Solve Puzzles'
                        }
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
