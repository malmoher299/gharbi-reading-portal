
import React from 'react';
import { User } from '../types';

interface Props {
  user: User;
  isAdminView?: boolean;
}

const UserProfile: React.FC<Props> = ({ user, isAdminView = false }) => {
  // Calculate only MCQ scores for public/contestant view
  const totalMcqScore = Object.values(user.scores).reduce((acc: number, curr: any) => acc + (curr?.mcqScore || 0), 0);

  return (
    <div className="animate-fade-in space-y-12">
      <div className="bg-black border-2 border-white/10 rounded-[4rem] p-14 md:p-20 text-center shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden backdrop-blur-xl ring-1 ring-[#22a99b]/20">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#22a99b] to-transparent shadow-[0_0_20px_#22a99b]"></div>
        
        <div className="w-32 h-32 bg-gradient-to-br from-[#22a99b] to-[#111111] rounded-[2.5rem] mx-auto flex items-center justify-center text-white text-6xl font-black mb-12 shadow-[0_30px_60px_rgba(34,169,155,0.4)] rotate-3 border-2 border-white/20">
          {user.fullName[0]}
        </div>
        
        <h2 className="text-5xl font-black text-white mb-4 tracking-tight leading-tight">{user.fullName}</h2>
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-16">
          <span className="bg-white/5 px-4 py-1 rounded-lg">{user.center}</span>
          <span className="w-2 h-2 rounded-full bg-[#f47322]"></span>
          <span className="bg-white/5 px-4 py-1 rounded-lg">ID: {user.nationalId}</span>
        </div>

        <div className="max-w-xl mx-auto">
          <div className="bg-[#050505] p-14 rounded-[3.5rem] border-2 border-[#22a99b]/30 relative group shadow-inner ring-4 ring-[#22a99b]/5">
            <span className="block text-xs text-[#22a99b] font-black uppercase tracking-[0.4em] mb-6">إجمالي نقاط الـ MCQ</span>
            <span className="text-9xl font-black text-[#22a99b] drop-shadow-[0_0_40px_rgba(34,169,155,0.6)] tabular-nums">{totalMcqScore}</span>
            <div className="flex flex-col items-center mt-6">
               <span className="text-slate-600 text-xl font-black uppercase tracking-widest border-t border-white/10 pt-4 px-10">نقطة / 200</span>
               <div className="mt-8 flex gap-3">
                  {user.selectedBooks.map(b => (
                    <span key={b} className="text-[10px] font-black text-white bg-[#22a99b]/20 py-2 px-5 rounded-full border border-[#22a99b]/40">
                      {b}
                    </span>
                  ))}
               </div>
            </div>
          </div>
        </div>

        {isAdminView && (
          <div className="mt-14 p-10 bg-gradient-to-b from-[#22a99b]/5 to-transparent border border-[#22a99b]/20 rounded-3xl">
            <p className="text-sm font-black text-[#22a99b] uppercase tracking-[0.3em]">إجمالي النقاط الفعلي (شامل تقييم المقال)</p>
            <p className="text-5xl font-black text-white mt-4">{user.totalScore.toFixed(1)} / 300</p>
          </div>
        )}
      </div>

      {!isAdminView && (
        <div className="bg-black/50 border-2 border-white/10 p-12 rounded-[3rem] text-center backdrop-blur-md shadow-2xl">
          <p className="text-slate-200 text-lg font-bold leading-relaxed">
            تم تسجيل وحفظ نتائجك بنجاح في سجلات مؤسسة حياة كريمة بالغربية.
            <br/>
            <span className="text-slate-500 text-sm mt-4 block leading-loose">
              سيتم عرض النتائج النهائية بعد اكتمال مراجعة الأقسام المقالية من قبل لجنة التحكيم المختصة.
            </span>
            <span className="text-[#22a99b] text-xl font-black mt-8 block uppercase tracking-widest">شكراً لمشاركتك الفعالة!</span>
          </p>
        </div>
      )}

      {isAdminView && (
        <div className="space-y-10">
          <h3 className="text-3xl font-black text-white flex items-center gap-5 px-6">
            <span className="w-3 h-12 bg-[#f47322] rounded-full shadow-[0_0_20px_#f47322]"></span>
            تحليل الأداء التفصيلي (خاص بالمشرفين)
          </h3>

          {user.selectedBooks.map(book => {
            const data = user.scores[book];
            if (!data) return null;
            return (
              <div key={book} className="bg-black border-2 border-white/10 rounded-[3rem] overflow-hidden shadow-2xl transition-all hover:border-[#22a99b]/30">
                <div className="bg-slate-900 px-10 py-8 flex justify-between items-center border-b border-white/10">
                  <h4 className="text-2xl font-black text-white tracking-wide">{book}</h4>
                  <div className="text-right">
                    <span className="text-xs font-black text-slate-500 block uppercase mb-1">Total Book Pts</span>
                    <span className="text-2xl font-black text-[#22a99b]">{(data.mcqScore + data.essayScore).toFixed(1)}</span>
                  </div>
                </div>
                <div className="p-10 md:p-14 space-y-10">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="bg-slate-950 p-8 rounded-[2rem] border border-white/5 shadow-inner">
                      <span className="text-[11px] text-slate-500 font-black uppercase tracking-widest mb-2 block">MCQ Score</span>
                      <p className="font-black text-white text-3xl">{data.mcqScore} <span className="text-sm opacity-30">/ 100</span></p>
                    </div>
                    <div className="bg-slate-950 p-8 rounded-[2rem] border border-white/5 shadow-inner">
                      <span className="text-[11px] text-slate-500 font-black uppercase tracking-widest mb-2 block">Essay Score</span>
                      <p className="font-black text-white text-3xl">{data.essayScore} <span className="text-sm opacity-30">/ 50</span></p>
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                     <div className="bg-[#050505] p-8 rounded-[2.5rem] border border-white/10">
                        <span className="block text-xs text-[#f47322] font-black uppercase tracking-widest mb-5 border-b border-[#f47322]/20 pb-2">نص المقال المحرر</span>
                        <p className="text-base text-slate-300 leading-relaxed italic font-medium">"{data.essay}"</p>
                     </div>
                     <div className="bg-[#22a99b]/5 border-2 border-[#22a99b]/20 p-10 rounded-[2.5rem] shadow-[inset_0_0_40px_rgba(34,169,155,0.05)]">
                        <h5 className="text-xs font-black text-[#22a99b] uppercase tracking-[0.3em] mb-5 flex items-center gap-3">
                          <span className="w-2 h-2 rounded-full bg-[#22a99b] animate-pulse"></span>
                          تحليل المقيم الذكي (AI Insight)
                        </h5>
                        <p className="text-sm text-[#22a99b]/90 leading-loose font-bold bg-black/40 p-6 rounded-2xl border border-[#22a99b]/10">
                          {data.aiFeedback || "لم يتم استلام تقييم آلي بعد."}
                        </p>
                     </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="text-center pt-12 pb-20">
        <button 
          onClick={() => window.print()}
          className="bg-black hover:bg-slate-900 border-2 border-white/10 text-white px-14 py-6 rounded-[2rem] text-xs font-black uppercase tracking-[0.4em] transition-all hover:text-[#22a99b] hover:border-[#22a99b] shadow-xl"
        >
          تحميل بطاقة المشاركة المعتمدة
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
