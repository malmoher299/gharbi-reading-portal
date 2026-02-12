
import React, { useState } from 'react';
import { Book, EvaluationResult } from '../types';
import { evaluateEssay } from '../services/geminiService';

interface Props {
  book: Book;
  onComplete: (essay: string, result: EvaluationResult) => void;
}

const Essay: React.FC<Props> = ({ book, onComplete }) => {
  const [essay, setEssay] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (essay.trim().length < 50) {
      return setError('المقال قصير جداً. يرجى كتابة ٥٠ حرفاً على الأقل لتعبر عن رأيك بشكل وافٍ.');
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await evaluateEssay(book, essay);
      onComplete(essay, result);
    } catch (err) {
      setError('حدث خطأ أثناء تقييم المقال. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in px-4">
      <div className="text-center mb-12">
        <div className="inline-block px-4 py-1 bg-[#22a99b]/10 text-[#22a99b] rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
          القسم المقالي التحليلي
        </div>
        <h2 className="text-4xl font-black text-white mb-4 leading-tight">ما هو انطباعك عن كتاب {book}؟</h2>
        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">قسم اختياري لقياس القدرة التحليلية • الوقت مفتوح</p>
      </div>

      <div className="bg-black/40 border border-white/5 rounded-[3rem] p-10 md:p-14 shadow-2xl backdrop-blur-sm">
        <textarea
          className="w-full bg-[#121212] border border-white/5 rounded-[2rem] p-8 text-white min-h-[400px] focus:ring-1 focus:ring-[#22a99b] outline-none transition-all leading-relaxed text-lg placeholder:text-slate-800"
          placeholder="اكتب خلاصة فكرك هنا..."
          value={essay}
          onChange={e => setEssay(e.target.value)}
          disabled={loading}
        />

        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
             <div className="bg-slate-800 px-4 py-2 rounded-xl text-[10px] font-black text-slate-500 uppercase">
               عدد الحروف: {essay.length}
             </div>
          </div>
          
          <div className="flex gap-6 w-full md:w-auto">
            <button
              onClick={() => onComplete(essay, { score: 0, feedback: "تم تخطي القسم المقالي." })}
              disabled={loading}
              className="flex-1 md:flex-none px-8 py-4 text-slate-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
            >
              تخطي القسم
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`flex-1 md:flex-none px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                loading ? 'bg-slate-800 text-slate-600' : 'bg-[#22a99b] text-white shadow-xl shadow-[#22a99b]/20 hover:scale-105 active:scale-95'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  جاري التقييم الرقمي
                </>
              ) : (
                'إرسال للتقييم'
              )}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-8 p-5 bg-orange-500/10 border border-orange-500/20 text-[#f47322] text-xs font-bold rounded-2xl text-center flex items-center justify-center gap-3">
          <span>⚠️</span>
          {error}
        </div>
      )}
    </div>
  );
};

export default Essay;
