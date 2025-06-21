import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Star, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useProgress } from "@/hooks/use-progress";
import { Link } from "wouter";
import type { Topic } from "@shared/schema";

const iconMap: { [key: string]: string } = {
  'calculator': '🧮',
  'network-wired': '🌐',
  'sitemap': '🗺️',
  'microchip': '💾',
  'code': '💻',
  'puzzle-piece': '🧩',
};

const gradientMap: { [key: string]: string } = {
  'from-electric-blue to-purple': 'from-blue-500 to-purple-600',
  'from-emerald to-electric-blue': 'from-emerald-500 to-blue-500',
  'from-purple to-orange': 'from-purple-600 to-orange-500',
  'from-orange to-emerald': 'from-orange-500 to-emerald-500',
  'from-purple to-electric-blue': 'from-purple-600 to-blue-500',
  'from-emerald to-orange': 'from-emerald-500 to-orange-500',
};

export default function TopicsGrid() {
  const { data: topics, isLoading } = useQuery<Topic[]>({
    queryKey: ['/api/topics'],
  });
  
  const { progress } = useProgress();

  const getTopicProgress = (topicId: number) => {
    return progress?.find(p => p.topicId === topicId)?.progress || 0;
  };

  const getButtonText = (topic: Topic) => {
    if (topic.isLocked) return 'Locked';
    const topicProgress = getTopicProgress(topic.id);
    if (topicProgress > 0) return 'Continue Learning';
    return 'Start Module';
  };

  const getButtonClass = (topic: Topic) => {
    if (topic.isLocked) {
      return 'w-full bg-gray-300 text-gray-500 py-3 rounded-lg font-semibold cursor-not-allowed';
    }
    const gradientClass = gradientMap[topic.gradient] || 'from-blue-500 to-purple-600';
    return `w-full bg-gradient-to-r ${gradientClass} text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-200`;
  };

  const getTopicPath = (topic: Topic) => {
    const pathMap: { [key: string]: string } = {
      'Number Systems': '/number-systems',
      'IP Addressing': '/ip-addressing',
      'Subnetting': '/subnetting',
      'Logic Gates': '/logic-gates',
      'Basic Programming': '/basic-programming',
      'Mixed Challenges': '/mixed-challenges',
    };
    return pathMap[topic.title] || '/';
  };

  if (isLoading) {
    return (
      <section id="topics" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Explore ICT Topics</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Interactive modules designed to make complex concepts simple and engaging
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
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
    <section id="topics" className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Explore ICT Topics</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Interactive modules designed to make complex concepts simple and engaging
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topics?.map((topic, index) => {
            const topicProgress = getTopicProgress(topic.id);
            const gradientClass = gradientMap[topic.gradient] || 'from-blue-500 to-purple-600';
            
            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white rounded-2xl shadow-lg card-hover overflow-hidden">
                  <div className={`h-48 bg-gradient-to-br ${gradientClass} relative overflow-hidden`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl opacity-20 animate-pulse-slow">
                        {iconMap[topic.icon] || '📚'}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-white bg-opacity-20 text-white">
                        {topic.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">{topic.title}</h3>
                    <p className="text-gray-600 mb-4">{topic.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{topic.duration} min</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-orange-500" />
                        <span className="text-sm text-gray-500">{(topic.rating / 10).toFixed(1)}/5</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div 
                        className="progress-bar h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${topicProgress}%` }}
                      />
                    </div>
                    {topic.isLocked ? (
                      <Button 
                        className={getButtonClass(topic)}
                        disabled={true}
                      >
                        <Lock className="mr-2 h-4 w-4" />
                        {getButtonText(topic)}
                      </Button>
                    ) : (
                      <Link href={getTopicPath(topic)}>
                        <Button className={getButtonClass(topic)}>
                          {getButtonText(topic)}
                        </Button>
                      </Link>
                    )}
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
