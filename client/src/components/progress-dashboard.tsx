import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Flame, Star, Clock, Medal, Zap, Code } from "lucide-react";
import { motion } from "framer-motion";
import { useProgress } from "@/hooks/use-progress";
import type { WeeklyGoal } from "@/lib/types";

const weeklyGoals: WeeklyGoal[] = [
  { title: "Complete 3 Topics", current: 2, target: 3, progress: 67 },
  { title: "Practice 30 mins daily", current: 5, target: 7, progress: 71 },
  { title: "Score 90%+ on quizzes", current: 8, target: 10, progress: 80 },
];

export default function ProgressDashboard() {
  const { user, achievements, isLoading } = useProgress();

  if (isLoading) {
    return (
      <section id="progress" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Your Learning Progress</h2>
            <p className="text-xl text-gray-600">Track your achievements and see how far you've come</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-12 bg-gray-200 rounded mb-4" />
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

  const stats = [
    {
      icon: Trophy,
      value: user?.completedTopics || 0,
      label: "Topics Completed",
      subtitle: "Out of 6 available",
      gradient: "from-blue-500 to-purple-600",
    },
    {
      icon: Flame,
      value: user?.streak || 0,
      label: "Day Streak",
      subtitle: "Keep it going!",
      gradient: "from-emerald-500 to-blue-500",
    },
    {
      icon: Star,
      value: user?.totalPoints || 0,
      label: "Total XP",
      subtitle: "750 to next level",
      gradient: "from-purple-600 to-orange-500",
    },
    {
      icon: Clock,
      value: `${Math.floor((user?.timeSpent || 0) / 60)}h`,
      label: "Time Learning",
      subtitle: "This week",
      gradient: "from-orange-500 to-emerald-500",
    },
  ];

  const getAchievementIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      medal: Medal,
      'lightning-bolt': Zap,
      code: Code,
    };
    return icons[iconName] || Medal;
  };

  const getAchievementColor = (color: string) => {
    const colors: { [key: string]: string } = {
      emerald: "bg-emerald-500",
      'electric-blue': "bg-blue-500",
      purple: "bg-purple-600",
    };
    return colors[color] || "bg-gray-500";
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return "1 week ago";
    return `${Math.floor(diffDays / 7)} weeks ago`;
  };

  return (
    <section id="progress" className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Your Learning Progress</h2>
          <p className="text-xl text-gray-600">Track your achievements and see how far you've come</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white rounded-2xl shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center`}>
                        <IconComponent className="text-white h-6 w-6" />
                      </div>
                      <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">{stat.label}</h3>
                    <p className="text-sm text-gray-600">{stat.subtitle}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-white rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-800">Recent Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {achievements?.map((achievement, index) => {
                  const IconComponent = getAchievementIcon(achievement.icon);
                  const colorClass = getAchievementColor(achievement.color);
                  
                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`flex items-center space-x-4 p-4 ${achievement.color === 'emerald' ? 'bg-emerald-50' : achievement.color === 'electric-blue' ? 'bg-blue-50' : 'bg-purple-50'} rounded-xl`}
                    >
                      <div className={`w-12 h-12 ${colorClass} rounded-xl flex items-center justify-center`}>
                        <IconComponent className="text-white h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{achievement.title}</h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatTimeAgo(achievement.earnedAt)}
                      </span>
                    </motion.div>
                  );
                }) || (
                  <div className="text-center py-8 text-gray-500">
                    No achievements yet. Keep learning to earn your first badge!
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="bg-white rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-800">Weekly Goals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {weeklyGoals.map((goal, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{goal.title}</span>
                      <span className="text-sm text-gray-500">{goal.current}/{goal.target}</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
