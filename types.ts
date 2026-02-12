
export enum Book {
  ARD_AL_NIFAQ = "أرض النفاق",
  THARTHARA = "ثرثرة فوق النيل",
  MAGDOLINE = "ماجدولين",
  AKHER_AYAM = "آخر أيام نوفمبر"
}

export interface User {
  id: string;
  fullName: string;
  nationalId: string;
  phone: string;
  center: string;
  selectedBooks: Book[];
  registrationDate: string;
  status: 'pending' | 'completed';
  scores: {
    [key in Book]?: {
      mcqScore: number;
      essayScore: number;
      aiFeedback: string;
      answers: Record<number, string>;
      essay: string;
    };
  };
  totalScore: number;
}

export interface Question {
  id: number;
  book: Book;
  text: string;
  options: string[];
  correctAnswer: string;
  points: number;
}

export interface EvaluationResult {
  score: number;
  feedback: string;
}
