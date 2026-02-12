
import React, { useState } from 'react';
import { BOOKS } from '../constants';
import { Book } from '../types';

interface Props {
  onComplete: (books: Book[]) => void;
  onBack: () => void;
}

const BookSelection: React.FC<Props> = ({ onComplete, onBack }) => {
  const [selected, setSelected] = useState<Book[]>([]);

  const toggleBook = (book: Book) => {
    if (selected.includes(book)) {
      setSelected(selected.filter(b => b !== book));
    } else if (selected.length < 2) {
      setSelected([...selected, book]);
    }
  };

  const isLimitReached = selected.length === 2;

  return (
    <div className="animate-fade-in px-4 max-w-5xl mx-auto py-10">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">اختر رحلتك القرائية</h2>
        <div className="inline-flex items-center gap-2 bg-blue-50 px-5 py-2.5 rounded-2xl border border-blue-100">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          <p className="text-blue-800 font-bold text-sm tracking-wide">
            يرجى اختيار <span className="underline underline-offset-4 decoration-2">كتابين فقط</span> لبدء المسابقة
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {BOOKS.map(book => {
          const isSelected = selected.includes(book);
          const isDisabled = isLimitReached && !isSelected;

          return (
            <div
              key={book}
              onClick={() => !isDisabled && toggleBook(book)}
              className={`relative cursor-pointer group rounded-[2.5rem] p-8 border-2 transition-all duration-500 bg-white flex flex-col justify-between h-full shadow-sm ${
                isSelected 
                  ? 'border-blue-600 shadow-2xl shadow-blue-100 ring-8 ring-blue-50 scale-[1.03] z-10' 
                  : isDisabled 
                    ? 'border-slate-50 opacity-30 grayscale cursor-not-allowed scale-[0.97]'
                    : 'border-slate-200 hover:border-blue-300 hover:shadow-xl hover:scale-[1.01]'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <h3 className={`text-2xl font-extrabold transition-colors leading-tight ${isSelected ? 'text-blue-700' : 'text-slate-900'}`}>
                    {book}
                  </h3>
                  <div className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 ${
                    isSelected 
                      ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-200' 
                      : 'border-slate-200 bg-slate-50 text-slate-300'
                  }`}>
                    {isSelected ? (
                      <span className="font-bold text-xl">✓</span>
                    ) : (
                      <span className="text-[10px] font-black uppercase">Plus</span>
                    )}
                  </div>
                </div>
                
                <p className={`font-medium leading-relaxed mb-6 text-base transition-colors ${isSelected ? 'text-blue-900/70' : 'text-slate-500'}`}>
                  استعد لخوض اختبار معرفي مكثف يضم ٤٠ سؤالاً اختيارياً صُممت خصيصاً لقياس استيعابك لهذا العمل الأدبي.
                </p>
              </div>

              {isSelected && (
                <div className="mt-auto pt-5 border-t border-blue-100 flex items-center justify-between">
                  <span className="text-blue-700 font-extrabold text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    تمت الإضافة للمسابقة
                  </span>
                  <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">Selected</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-20 flex flex-col md:flex-row justify-center items-center gap-6">
        <button
          onClick={onBack}
          className="w-full md:w-auto px-10 py-4 rounded-2xl font-bold text-slate-500 hover:bg-white hover:text-slate-900 transition-all text-sm border border-slate-200 hover:border-slate-400 hover:shadow-sm"
        >
          العودة وتعديل البيانات
        </button>
        <button
          onClick={() => onComplete(selected)}
          disabled={selected.length !== 2}
          className={`w-full md:w-auto px-16 py-5 rounded-2xl font-bold transition-all text-base shadow-2xl flex items-center justify-center gap-4 ${
            selected.length === 2 
              ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200 active:scale-95' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          <span>تأكيد الاختيار والانتقال</span>
          <span className="bg-white/20 px-3 py-1 rounded-xl text-xs font-black">({selected.length}/2)</span>
        </button>
      </div>
    </div>
  );
};

export default BookSelection;
