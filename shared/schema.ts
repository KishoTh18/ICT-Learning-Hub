import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  level: integer("level").notNull().default(1),
  totalPoints: integer("total_points").notNull().default(0),
  streak: integer("streak").notNull().default(0),
  timeSpent: integer("time_spent").notNull().default(0), // in minutes
  completedTopics: integer("completed_topics").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(), // Basic, Intermediate, Advanced
  duration: integer("duration").notNull(), // in minutes
  rating: integer("rating").notNull().default(0), // out of 50 (4.8 * 10)
  icon: text("icon").notNull(),
  gradient: text("gradient").notNull(),
  isLocked: boolean("is_locked").notNull().default(false),
  prerequisiteId: integer("prerequisite_id"),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  topicId: integer("topic_id").notNull(),
  progress: integer("progress").notNull().default(0), // percentage 0-100
  completed: boolean("completed").notNull().default(false),
  lastAccessed: timestamp("last_accessed").defaultNow(),
});

export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  topicId: integer("topic_id").notNull(),
  question: text("question").notNull(),
  options: json("options").notNull(), // array of strings
  correctAnswer: integer("correct_answer").notNull(), // index of correct option
  difficulty: text("difficulty").notNull(),
});

export const userQuizResults = pgTable("user_quiz_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  quizId: integer("quiz_id").notNull(),
  selectedAnswer: integer("selected_answer").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  timeSpent: integer("time_spent").notNull(), // in seconds
  completedAt: timestamp("completed_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  earnedAt: timestamp("earned_at").defaultNow(),
});

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // Binary Race, Network Builder, Logic Puzzle
  highScore: integer("high_score").notNull().default(0),
  timesPlayed: integer("times_played").notNull().default(0),
  gradient: text("gradient").notNull(),
  icon: text("icon").notNull(),
});

export const userGameScores = pgTable("user_game_scores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  gameId: integer("game_id").notNull(),
  score: integer("score").notNull(),
  playedAt: timestamp("played_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertTopicSchema = createInsertSchema(topics).omit({ id: true });
export const insertUserProgressSchema = createInsertSchema(userProgress).omit({ id: true, lastAccessed: true });
export const insertQuizSchema = createInsertSchema(quizzes).omit({ id: true });
export const insertUserQuizResultSchema = createInsertSchema(userQuizResults).omit({ id: true, completedAt: true });
export const insertAchievementSchema = createInsertSchema(achievements).omit({ id: true, earnedAt: true });
export const insertGameSchema = createInsertSchema(games).omit({ id: true });
export const insertUserGameScoreSchema = createInsertSchema(userGameScores).omit({ id: true, playedAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Topic = typeof topics.$inferSelect;
export type InsertTopic = z.infer<typeof insertTopicSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type UserQuizResult = typeof userQuizResults.$inferSelect;
export type InsertUserQuizResult = z.infer<typeof insertUserQuizResultSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Game = typeof games.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;
export type UserGameScore = typeof userGameScores.$inferSelect;
export type InsertUserGameScore = z.infer<typeof insertUserGameScoreSchema>;
