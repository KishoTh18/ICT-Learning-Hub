import { 
  users, topics, userProgress, quizzes, userQuizResults, achievements, games, userGameScores,
  type User, type InsertUser, type Topic, type InsertTopic, type UserProgress, type InsertUserProgress,
  type Quiz, type InsertQuiz, type UserQuizResult, type InsertUserQuizResult,
  type Achievement, type InsertAchievement, type Game, type InsertGame,
  type UserGameScore, type InsertUserGameScore
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  
  // Topic methods
  getAllTopics(): Promise<Topic[]>;
  getTopic(id: number): Promise<Topic | undefined>;
  createTopic(topic: InsertTopic): Promise<Topic>;
  
  // Progress methods
  getUserProgress(userId: number): Promise<UserProgress[]>;
  getTopicProgress(userId: number, topicId: number): Promise<UserProgress | undefined>;
  updateProgress(userId: number, topicId: number, progress: number): Promise<UserProgress>;
  
  // Quiz methods
  getQuizzesByTopic(topicId: number): Promise<Quiz[]>;
  getQuiz(id: number): Promise<Quiz | undefined>;
  submitQuizResult(result: InsertUserQuizResult): Promise<UserQuizResult>;
  getUserQuizResults(userId: number): Promise<UserQuizResult[]>;
  
  // Achievement methods
  getUserAchievements(userId: number): Promise<Achievement[]>;
  addAchievement(achievement: InsertAchievement): Promise<Achievement>;
  
  // Game methods
  getAllGames(): Promise<Game[]>;
  getGame(id: number): Promise<Game | undefined>;
  getUserGameScores(userId: number): Promise<UserGameScore[]>;
  addGameScore(score: InsertUserGameScore): Promise<UserGameScore>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private topics: Map<number, Topic> = new Map();
  private userProgress: Map<string, UserProgress> = new Map();
  private quizzes: Map<number, Quiz> = new Map();
  private userQuizResults: UserQuizResult[] = [];
  private achievements: Achievement[] = [];
  private games: Map<number, Game> = new Map();
  private userGameScores: UserGameScore[] = [];
  private currentId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create default user
    const defaultUser: User = {
      id: 1,
      username: "student",
      email: "student@example.com",
      level: 5,
      totalPoints: 1250,
      streak: 7,
      timeSpent: 720, // 12 hours
      completedTopics: 3,
      createdAt: new Date(),
    };
    this.users.set(1, defaultUser);

    // Create topics
    const topicsData: Topic[] = [
      {
        id: 1,
        title: "Number Systems",
        description: "Learn binary, decimal, hexadecimal conversions with interactive games and visual tools.",
        difficulty: "Basic",
        duration: 45,
        rating: 48,
        icon: "calculator",
        gradient: "from-electric-blue to-purple",
        isLocked: false,
        prerequisiteId: null,
      },
      {
        id: 2,
        title: "IP Addressing",
        description: "Master IPv4 and IPv6 addressing with practical examples and subnet calculators.",
        difficulty: "Intermediate",
        duration: 60,
        rating: 49,
        icon: "network-wired",
        gradient: "from-emerald to-electric-blue",
        isLocked: false,
        prerequisiteId: null,
      },
      {
        id: 3,
        title: "Subnetting",
        description: "Practice subnet calculations with visual network diagrams and interactive tools.",
        difficulty: "Advanced",
        duration: 90,
        rating: 47,
        icon: "sitemap",
        gradient: "from-purple to-orange",
        isLocked: true,
        prerequisiteId: 2,
      },
      {
        id: 4,
        title: "Logic Gates",
        description: "Build circuits with AND, OR, NOT gates through drag-and-drop simulation tools.",
        difficulty: "Basic",
        duration: 50,
        rating: 48,
        icon: "microchip",
        gradient: "from-orange to-emerald",
        isLocked: false,
        prerequisiteId: null,
      },
      {
        id: 5,
        title: "Basic Programming",
        description: "Learn programming fundamentals with Python through interactive coding challenges.",
        difficulty: "Beginner",
        duration: 120,
        rating: 49,
        icon: "code",
        gradient: "from-purple to-electric-blue",
        isLocked: false,
        prerequisiteId: null,
      },
      {
        id: 6,
        title: "Mixed Challenges",
        description: "Test your knowledge across all topics with challenging puzzles and brain teasers.",
        difficulty: "Fun",
        duration: 30,
        rating: 46,
        icon: "puzzle-piece",
        gradient: "from-emerald to-orange",
        isLocked: false,
        prerequisiteId: null,
      },
    ];

    topicsData.forEach(topic => this.topics.set(topic.id, topic));

    // Create user progress
    const progressData = [
      { userId: 1, topicId: 1, progress: 75, completed: false },
      { userId: 1, topicId: 2, progress: 45, completed: false },
      { userId: 1, topicId: 3, progress: 20, completed: false },
      { userId: 1, topicId: 4, progress: 65, completed: false },
      { userId: 1, topicId: 5, progress: 30, completed: false },
      { userId: 1, topicId: 6, progress: 15, completed: false },
    ];

    progressData.forEach(progress => {
      const key = `${progress.userId}-${progress.topicId}`;
      this.userProgress.set(key, {
        id: this.currentId++,
        ...progress,
        lastAccessed: new Date(),
      });
    });

    // Create sample quizzes
    const quizzesData: Quiz[] = [
      {
        id: 1,
        topicId: 1,
        question: "What is the decimal equivalent of binary 1010?",
        options: ["8", "10", "12", "16"],
        correctAnswer: 1,
        difficulty: "Basic",
      },
      {
        id: 2,
        topicId: 1,
        question: "Convert hexadecimal FF to decimal:",
        options: ["255", "256", "254", "257"],
        correctAnswer: 0,
        difficulty: "Basic",
      },
      {
        id: 3,
        topicId: 2,
        question: "What class does IP address 192.168.1.1 belong to?",
        options: ["Class A", "Class B", "Class C", "Class D"],
        correctAnswer: 2,
        difficulty: "Intermediate",
      },
    ];

    quizzesData.forEach(quiz => this.quizzes.set(quiz.id, quiz));

    // Create achievements
    const achievementsData: Achievement[] = [
      {
        id: 1,
        userId: 1,
        title: "Binary Master",
        description: "Completed all number systems challenges",
        icon: "medal",
        color: "emerald",
        earnedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        id: 2,
        userId: 1,
        title: "Speed Demon",
        description: "Completed 10 quizzes in perfect time",
        icon: "lightning-bolt",
        color: "electric-blue",
        earnedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      },
      {
        id: 3,
        userId: 1,
        title: "Logic Wizard",
        description: "Built complex circuits with logic gates",
        icon: "code",
        color: "purple",
        earnedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      },
    ];

    this.achievements = achievementsData;

    // Create games
    const gamesData: Game[] = [
      {
        id: 1,
        title: "Binary Race",
        description: "Convert numbers as fast as you can in this thrilling race against time!",
        type: "Binary Race",
        highScore: 2450,
        timesPlayed: 127,
        gradient: "from-electric-blue to-purple",
        icon: "dice",
      },
      {
        id: 2,
        title: "Network Builder",
        description: "Design and configure networks by dragging and connecting devices!",
        type: "Network Builder",
        highScore: 0,
        timesPlayed: 89,
        gradient: "from-emerald to-electric-blue",
        icon: "network-wired",
      },
      {
        id: 3,
        title: "Logic Puzzle",
        description: "Solve complex logic gate circuits by connecting the right components!",
        type: "Logic Puzzle",
        highScore: 0,
        timesPlayed: 156,
        gradient: "from-purple to-orange",
        icon: "puzzle-piece",
      },
    ];

    gamesData.forEach(game => this.games.set(game.id, game));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Topic methods
  async getAllTopics(): Promise<Topic[]> {
    return Array.from(this.topics.values());
  }

  async getTopic(id: number): Promise<Topic | undefined> {
    return this.topics.get(id);
  }

  async createTopic(insertTopic: InsertTopic): Promise<Topic> {
    const id = this.currentId++;
    const topic: Topic = { ...insertTopic, id };
    this.topics.set(id, topic);
    return topic;
  }

  // Progress methods
  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(progress => progress.userId === userId);
  }

  async getTopicProgress(userId: number, topicId: number): Promise<UserProgress | undefined> {
    const key = `${userId}-${topicId}`;
    return this.userProgress.get(key);
  }

  async updateProgress(userId: number, topicId: number, progress: number): Promise<UserProgress> {
    const key = `${userId}-${topicId}`;
    const existing = this.userProgress.get(key);
    
    const updatedProgress: UserProgress = {
      id: existing?.id || this.currentId++,
      userId,
      topicId,
      progress,
      completed: progress >= 100,
      lastAccessed: new Date(),
    };
    
    this.userProgress.set(key, updatedProgress);
    return updatedProgress;
  }

  // Quiz methods
  async getQuizzesByTopic(topicId: number): Promise<Quiz[]> {
    return Array.from(this.quizzes.values()).filter(quiz => quiz.topicId === topicId);
  }

  async getQuiz(id: number): Promise<Quiz | undefined> {
    return this.quizzes.get(id);
  }

  async submitQuizResult(result: InsertUserQuizResult): Promise<UserQuizResult> {
    const userQuizResult: UserQuizResult = {
      ...result,
      id: this.currentId++,
      completedAt: new Date(),
    };
    this.userQuizResults.push(userQuizResult);
    return userQuizResult;
  }

  async getUserQuizResults(userId: number): Promise<UserQuizResult[]> {
    return this.userQuizResults.filter(result => result.userId === userId);
  }

  // Achievement methods
  async getUserAchievements(userId: number): Promise<Achievement[]> {
    return this.achievements.filter(achievement => achievement.userId === userId);
  }

  async addAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const achievement: Achievement = {
      ...insertAchievement,
      id: this.currentId++,
      earnedAt: new Date(),
    };
    this.achievements.push(achievement);
    return achievement;
  }

  // Game methods
  async getAllGames(): Promise<Game[]> {
    return Array.from(this.games.values());
  }

  async getGame(id: number): Promise<Game | undefined> {
    return this.games.get(id);
  }

  async getUserGameScores(userId: number): Promise<UserGameScore[]> {
    return this.userGameScores.filter(score => score.userId === userId);
  }

  async addGameScore(insertScore: InsertUserGameScore): Promise<UserGameScore> {
    const score: UserGameScore = {
      ...insertScore,
      id: this.currentId++,
      playedAt: new Date(),
    };
    this.userGameScores.push(score);
    return score;
  }
}

export const storage = new MemStorage();
