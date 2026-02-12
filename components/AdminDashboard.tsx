
import React, { useState, useEffect } from 'react';
import { User, Book } from '../types';
import { getParticipants } from '../services/dataService';
import { GHARBIA_CENTERS, BOOKS } from '../constants';

const AdminDashboard: React.FC = () => {
  const [participants, setParticipants] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterBook, setFilterBook] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getParticipants();
      setParticipants(data);
    };
    fetchData();
  }, []);

  const filteredParticipants = participants.filter(p => {
    const matchesSearch = p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || p.nationalId.includes(searchTerm);
    const matchesDistrict = filterDistrict === '' || p.center === filterDistrict;
    const matchesBook = filterBook === '' || (p.selectedBooks && p.selectedBooks.includes(filterBook as Book));
    return matchesSearch && matchesDistrict && matchesBook;
  });

  return (
    <div className="animate-fade-in space-y-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-4 bg-black/40 border border-white/5 p-8 rounded-[2rem] shadow-xl backdrop-blur-md">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h2 className="text-3xl font-black text-white">لوحة إدارة المتسابقين</h2>
              <p className="text-slate-500 text-sm font-bold mt-1">مؤسسة حياة كريمة - مكتب الغربية</p>
            </div>
            <div className="flex gap-4">
               <div className="bg-[#121212] p-4 rounded-2xl border border-white/5 text-center min-w-[120px]">
                 <span className="block text-[10px] text-[#22a99b] font-black uppercase mb-1">المشاركين</span>
                 <span className="text-2xl font-black text-white">{participants.length}</span>
               </div>
               <div className="bg-[#121212] p-4 rounded-2xl border border-white/5 text-center min-w-[120px]">
                 <span className="block text-[10px] text-[#f47322] font-black uppercase mb-1">المكتملين</span>
                 <span className="text-2xl font-black text-white">{participants.filter(p => p.status === 'completed').length}</span>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="relative">
              <input
                type="text"
                placeholder="البحث بالاسم أو الهوية..."
                className="w-full bg-[#121212] border border-white/5 rounded-xl px-5 py-4 text-white text-sm outline-none focus:ring-1 focus:ring-[#22a99b]"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="bg-[#121212] border border-white/5 rounded-xl px-5 py-4 text-white text-sm outline-none cursor-pointer focus:ring-1 focus:ring-[#22a99b] appearance-none"
              value={filterDistrict}
              onChange={e => setFilterDistrict(e.target.value)}
            >
              <option value="">جميع المراكز</option>
              {GHARBIA_CENTERS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              className="bg-[#121212] border border-white/5 rounded-xl px-5 py-4 text-white text-sm outline-none cursor-pointer focus:ring-1 focus:ring-[#22a99b] appearance-none"
              value={filterBook}
              onChange={e => setFilterBook(e.target.value)}
            >
              <option value="">جميع الكتب</option>
              {BOOKS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </div>

        <div className="md:col-span-1 space-y-4">
          <div className="bg-black/40 border border-white/5 rounded-[2rem] overflow-hidden shadow-xl">
            <div className="p-5 border-b border-white/5 bg-slate-800/30">
              <h3 className="font-black text-xs text-slate-400 uppercase tracking-widest">قائمة المشاركين</h3>
            </div>
            <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
              {filteredParticipants.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedUser(p)}
                  className={`w-full text-right p-5 hover:bg-white/5 transition-all border-b border-white/5 flex items-center justify-between group ${
                    selectedUser?.id === p.id ? 'bg-[#22a99b]/5 border-r-4 border-[#22a99b]' : ''
                  }`}
                >
                  <div className="flex flex-col">
                    <span className={`font-bold text-sm transition-colors ${selectedUser?.id === p.id ? 'text-[#22a99b]' : 'text-slate-200'}`}>
                      {p.fullName.split(' ').slice(0, 2).join(' ')}...
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold">{p.center}</span>
                  </div>
                  <div className="text-left">
                    <span className="text-[#f47322] font-black text-sm">{Math.round(p.totalScore)}</span>
                  </div>
                </button>
              ))}
              {filteredParticipants.length === 0 && (
                <div className="p-12 text-center text-slate-600 text-xs italic">لا توجد بيانات مطابقة.</div>
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          {selectedUser ? (
            <div className="bg-black border border-white/5 rounded-[2rem] p-10 shadow-xl space-y-10 animate-fade-in relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#22a99b] to-transparent opacity-30"></div>
               
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h3 className="text-3xl font-black text-white mb-2">{selectedUser.fullName}</h3>
                  <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500 uppercase">
                    <span className="bg-[#121212] px-3 py-1 rounded-lg border border-white/5">ID: {selectedUser.nationalId}</span>
                    <span className="bg-[#121212] px-3 py-1 rounded-lg border border-white/5">المركز: {selectedUser.center}</span>
                    <span className="bg-[#121212] px-3 py-1 rounded-lg border border-white/5">الهاتف: {selectedUser.phone}</span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-[#22a99b]/10 to-[#f47322]/10 border border-white/5 p-6 rounded-3xl text-center min-w-[160px]">
                  <span className="block text-[10px] text-slate-400 font-black uppercase mb-1">الدرجة الكلية</span>
                  <span className="text-5xl font-black text-[#22a99b] drop-shadow-lg">{Math.round(selectedUser.totalScore)}</span>
                  <span className="text-xs text-slate-600 font-bold block mt-1">/ 300</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {selectedUser.selectedBooks && selectedUser.selectedBooks.map(book => {
                  const data = selectedUser.scores[book];
                  if (!data) return null;
                  return (
                    <div key={book} className="bg-slate-800/30 border border-white/5 rounded-[2rem] p-8 space-y-6">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xl font-black text-white">{book}</h4>
                        <span className="bg-[#22a99b]/10 text-[#22a99b] px-3 py-1 rounded-full text-[10px] font-black uppercase">
                          {Math.round(data.mcqScore + data.essayScore)} نقطة
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                         <div className="bg-black p-4 rounded-2xl border border-white/5">
                            <span className="block text-[9px] text-slate-500 font-black uppercase mb-1">الأسئلة (MCQ)</span>
                            <span className="text-lg font-black text-white">{data.mcqScore}</span>
                         </div>
                         <div className="bg-black p-4 rounded-2xl border border-white/5">
                            <span className="block text-[9px] text-slate-500 font-black uppercase mb-1">المقال</span>
                            <span className="text-lg font-black text-white">{data.essayScore}</span>
                         </div>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-[#121212] p-5 rounded-2xl border border-white/5">
                          <span className="block text-[10px] text-[#f47322] font-black uppercase mb-2">النص المقالي</span>
                          <p className="text-xs text-slate-400 leading-relaxed italic line-clamp-4">
                            "{data.essay || 'لا يوجد نص متاح'}"
                          </p>
                        </div>
                        <div className="bg-[#22a99b]/5 p-5 rounded-2xl border border-[#22a99b]/10">
                          <span className="block text-[10px] text-[#22a99b] font-black uppercase mb-2 flex items-center gap-1">
                             التقييم الآلي (AI Evaluation)
                          </span>
                          <p className="text-xs text-[#22a99b]/80 font-medium leading-relaxed">
                            {data.aiFeedback}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-black/40 border-2 border-dashed border-white/5 rounded-[3rem] h-[600px] flex flex-col items-center justify-center text-center p-20 animate-pulse">
              <div className="w-24 h-24 bg-[#121212] rounded-full flex items-center justify-center text-5xl mb-8 border border-white/5 opacity-20">👤</div>
              <h3 className="text-xl font-black text-slate-700 uppercase tracking-widest">بانتظار اختيار سجل...</h3>
              <p className="text-slate-800 text-xs mt-2 font-bold uppercase">اختر متسابقاً لبدء الفحص الرقمي</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
