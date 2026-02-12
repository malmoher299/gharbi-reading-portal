
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Book, Question } from '../types';
import { fetchQuestionsByBook } from '../services/dataService';
import { QUIZ_TIMER_SECONDS } from '../constants';

interface Props {
  book: Book;
  onComplete: (answers: Record<number, string>, totalScore: number) => void;
}

const Quiz: React.FC<Props> = ({ book, onComplete }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIMER_SECONDS);
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const timerRef = useRef<any>(null);

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = await fetchQuestionsByBook(book);
      if (!qs || qs.length === 0) {
        throw new Error("لم يتم العثور على أسئلة لهذا الكتاب حالياً في قاعدة البيانات.");
      }
      setQuestions(qs);
      setLoading(false);
    } catch (err: any) {
      console.error("Quiz load error:", err);
      setError(err.message || "تعذر تحميل الأسئلة. يرجى التحقق من اتصالك بالإنترنت.");
      setLoading(false);
    }
  }, [book]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setTimeLeft(QUIZ_TIMER_SECONDS);
        setIsTransitioning(false);
      } else {
        let score = 0;
        questions.forEach(q => {
          if (answers[q.id] === q.correctAnswer) {
            score += q.points;
          }
        });
        onComplete(answers, score);
      }
    }, 400);
  }, [currentIndex, questions, answers, onComplete, isTransitioning]);

  useEffect(() => {
    if (loading || isTransitioning || error || questions.length === 0) return;
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleNext();
          return QUIZ_TIMER_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, handleNext, isTransitioning, error, questions.length]);

  const selectAnswer = (answer: string) => {
    if (isTransitioning) return;
    setAnswers(prev => ({ ...prev, [questions[currentIndex].id]: answer }));
    handleNext();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6"></div>
        <p className="text-slate-600 font-bold text-lg">جاري تحميل الأسئلة...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto py-20 text-center custom-card p-10 bg-white">
        <div className="text-red-500 text-6xl mb-6">⚠️</div>
        <h2 className="text-xl font-bold text-slate-800 mb-6">{error}</h2>
        <button 
          onClick={loadQuestions} 
          className="btn-primary w-full py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-blue-200"
        >
          إعادة محاولة التحميل
        </button>
      </div>
    );
  }

  if (questions.length === 0) return null;

  const q = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 px-4">
        <div className="text-right">
           <span className="text-blue-600 font-bold text-xs uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">{book}</span>
           <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
             السؤال {currentIndex + 1} <span className="text-slate-300 mx-1">/</span> <span className="text-slate-400">{questions.length}</span>
           </h2>
        </div>

        <div className="bg-white border-2 border-slate-100 px-8 py-4 rounded-3xl shadow-sm flex items-center gap-4">
           <div className="text-right">
             <span className={`text-4xl font-black tabular-nums transition-colors ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-blue-600'}`}>
               {timeLeft}
             </span>
           </div>
           <div className="h-10 w-px bg-slate-100"></div>
           <span className="text-xs font-bold text-slate-400 uppercase">ثانية متبقية</span>
        </div>
      </div>

      <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'}`}>
        <div className="custom-card p-8 md:p-14 mb-8 bg-white shadow-xl ring-1 ring-slate-100">
          <h3 className="text-xl md:text-2xl font-extrabold text-slate-800 leading-relaxed mb-12 text-center">{q.text}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => selectAnswer(opt)}
                className="w-full text-right p-6 rounded-2xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center gap-5 group relative overflow-hidden"
              >
                <span className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center font-black text-slate-400 transition-all shrink-0">
                  {i + 1}
                </span>
                <span className="text-lg font-bold text-slate-700 group-hover:text-blue-900">{opt}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-3 bg-slate-200 rounded-full overflow-hidden mx-4 shadow-inner">
        <div 
          className="h-full bg-blue-600 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(37,99,235,0.4)]" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Quiz;
