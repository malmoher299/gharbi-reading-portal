
import { Book } from './types';

export const GHARBIA_CENTERS = [
  "السنطه",
  "المحلة الكبري",
  "بسيون",
  "سمنود",
  "زفتي",
  "طنطا",
  "قطور",
  "كفرالزيات"
];

export const BOOKS: Book[] = [
  Book.ARD_AL_NIFAQ,
  Book.THARTHARA,
  Book.MAGDOLINE,
  Book.AKHER_AYAM
];

export const BRAND_COLORS = {
  primary: "#2563eb", 
  accent: "#f47322",  
  dark: "#0f172a",    
  surface: "#ffffff",
  white: "#ffffff"
};

export const QUIZ_TIMER_SECONDS = 25;
export const QUESTIONS_PER_BOOK = 40;

// Environment variable for Netlify
export const SCRIPT_URL = (import.meta as any).env?.VITE_APP_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbyC2AAsGCeKELpypftPvVedfpI9qCmKHJgEsM2hI0oEogqfta9dA22AnQxJUncc8YM5/exec';
