
export type User = {
  id: string;
  name: string;
  email: string;
  role: 'learner' | 'admin';
  avatar?: string;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  modules: Module[];
  progress?: number; // 0-100
};

export type Module = {
  id: string;
  title: string;
  description: string;
  content: ContentItem[];
  assessments: Assessment[];
};

export type ContentItem = {
  id: string;
  title: string;
  type: 'pdf' | 'document' | 'text' | 'video' | 'link';
  content: string; // URL for files/videos, actual content for text
  completed?: boolean;
};

export type Assessment = {
  id: string;
  title: string;
  description: string;
  type: 'practice' | 'graded' | 'sectional' | 'full';
  timeLimit?: number; // in minutes
  questions: Question[];
  completed?: boolean;
  score?: number; // 0-100
};

export type Question = {
  id: string;
  text: string;
  type: 'mcq' | 'true-false';
  options?: string[]; // For MCQ
  correctAnswer: string | number; // Option index or true/false
  aiGenerated?: boolean;
  approved?: boolean;
};

export type AIGeneratedQuestion = Question & {
  sourceContent: string;
  status: 'pending' | 'approved' | 'rejected' | 'edited';
};
