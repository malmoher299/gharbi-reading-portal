
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Registration from './components/Registration';
import BookSelection from './components/BookSelection';
import Quiz from './components/Quiz';
import Essay from './components/Essay';
import UserProfile from './components/UserProfile';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import { User, Book } from './types';
import { saveParticipant } from './services/dataService';

enum AppStep {
  REGISTER,
  SELECT_BOOKS,
  QUIZ_1,
  ESSAY_1,
  QUIZ_2,
  ESSAY_2,
  COMPLETED,
  ADMIN_LOGIN,
  ADMIN_DASHBOARD
}

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.REGISTER);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  useEffect(() => {
    const isExamInProgress = [AppStep.QUIZ_1, AppStep.ESSAY_1, AppStep.QUIZ_2, AppStep.ESSAY_2].includes(step);
    if (isExamInProgress) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = '';
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [step]);

  const handleRegister = (userData: Partial<User>) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      fullName: userData.fullName || "",
      nationalId: userData.nationalId || "",
      phone: userData.phone || "",
      center: userData.center || "",
      selectedBooks: [],
      registrationDate: new Date().toISOString(),
      status: 'pending',
      scores: {},
      totalScore: 0
    };
    setCurrentUser(newUser);
    setStep(AppStep.SELECT_BOOKS);
  };

  const handleBooksSelected = (books: Book[]) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, selectedBooks: books });
      setStep(AppStep.QUIZ_1);
    }
  };

  const handleQuizComplete = (bookIndex: number, answers: Record<number, string>, score: number) => {
    if (currentUser) {
      const book = currentUser.selectedBooks[bookIndex];
      const updatedScores = {
        ...currentUser.scores,
        [book]: {
          mcqScore: score,
          essayScore: 0,
          aiFeedback: "",
          answers,
          essay: ""
        }
      };
      setCurrentUser({ ...currentUser, scores: updatedScores });
      setStep(bookIndex === 0 ? AppStep.ESSAY_1 : AppStep.ESSAY_2);
    }
  };

  const handleEssayComplete = async (bookIndex: number, essay: string, aiResult: { score: number; feedback: string }) => {
    if (currentUser) {
      const book = currentUser.selectedBooks[bookIndex];
      const currentBookData = currentUser.scores[book];
      
      const updatedScores = {
        ...currentUser.scores,
        [book]: {
          ...currentBookData!,
          essay,
          essayScore: aiResult.score,
          aiFeedback: aiResult.feedback
        }
      };

      const finalTotal = Object.values(updatedScores).reduce((acc: number, curr: any) => acc + (curr?.mcqScore || 0) + (curr?.essayScore || 0), 0);

      const updatedUser: User = { 
        ...currentUser, 
        scores: updatedScores, 
        totalScore: finalTotal,
        status: (bookIndex === 1 || currentUser.selectedBooks.length === 1) ? 'completed' : 'pending'
      };

      setCurrentUser(updatedUser);
      
      if (bookIndex === 0 && currentUser.selectedBooks.length > 1) {
        setStep(AppStep.QUIZ_2);
      } else {
        try {
          await saveParticipant(updatedUser);
          setStep(AppStep.COMPLETED);
        } catch (e) {
          setGlobalError("تعذر حفظ النتائج، يرجى المحاولة لاحقاً.");
        }
      }
    }
  };

  const handleAdminLogin = (success: boolean) => {
    if (success) {
      setIsAdmin(true);
      setStep(AppStep.ADMIN_DASHBOARD);
    }
  };

  if (globalError) {
    return (
      <Layout>
        <div className="max-w-md mx-auto my-20 p-8 custom-card text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-4">{globalError}</h2>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary px-8 py-3 rounded-full font-bold"
          >
            تحديث الصفحة
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full">
        {step === AppStep.REGISTER && (
          <Registration onComplete={handleRegister} />
        )}

        {step === AppStep.SELECT_BOOKS && currentUser && (
          <BookSelection onComplete={handleBooksSelected} onBack={() => setStep(AppStep.REGISTER)} />
        )}

        {step === AppStep.QUIZ_1 && currentUser && (
          <Quiz 
            book={currentUser.selectedBooks[0]} 
            onComplete={(answers, score) => handleQuizComplete(0, answers, score)} 
          />
        )}

        {step === AppStep.ESSAY_1 && currentUser && (
          <Essay 
            book={currentUser.selectedBooks[0]} 
            onComplete={(essay, result) => handleEssayComplete(0, essay, result)} 
          />
        )}

        {step === AppStep.QUIZ_2 && currentUser && (
          <Quiz 
            book={currentUser.selectedBooks[1]} 
            onComplete={(answers, score) => handleQuizComplete(1, answers, score)} 
          />
        )}

        {step === AppStep.ESSAY_2 && currentUser && (
          <Essay 
            book={currentUser.selectedBooks[1]} 
            onComplete={(essay, result) => handleEssayComplete(1, essay, result)} 
          />
        )}

        {step === AppStep.COMPLETED && currentUser && (
          <UserProfile user={currentUser} isAdminView={false} />
        )}

        {step === AppStep.ADMIN_LOGIN && (
          <AdminLogin onLogin={handleAdminLogin} />
        )}

        {step === AppStep.ADMIN_DASHBOARD && isAdmin && (
          <AdminDashboard />
        )}

        {/* Admin Login Button - ONLY visible on the first (Registration) step */}
        {step === AppStep.REGISTER && (
          <div className="mt-20 flex justify-center">
            <button 
              onClick={() => setStep(AppStep.ADMIN_LOGIN)}
              className="bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 px-8 py-3.5 rounded-full font-bold text-xs transition-all border border-slate-200 shadow-sm"
            >
              دخول المشرفين
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
