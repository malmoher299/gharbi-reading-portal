
import React, { useState } from 'react';
import { GHARBIA_CENTERS } from '../constants';
import { User } from '../types';

interface Props {
  onComplete: (data: Partial<User>) => void;
  onBack?: () => void;
}

const Registration: React.FC<Props> = ({ onComplete, onBack }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    nationalId: '',
    phone: '',
    center: ''
  });
  const [error, setError] = useState('');

  const validateId = (id: string) => /^\d{14}$/.test(id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nameWords = formData.fullName.trim().split(/\s+/);
    if (nameWords.length < 4) {
      return setError('يرجى إدخال الاسم الرباعي بالكامل');
    }
    if (!validateId(formData.nationalId)) {
      return setError('الرقم القومي يجب أن يتكون من ١٤ رقماً');
    }
    if (!formData.phone || formData.phone.length < 11) {
      return setError('يرجى إدخال رقم هاتف صحيح');
    }
    if (!formData.center) {
      return setError('يرجى اختيار المركز');
    }
    onComplete(formData);
  };

  return (
    <div className="max-w-2xl mx-auto custom-card p-8 md:p-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-4">بوابة المشاركة</h2>
        <p className="text-slate-500">يرجى إدخال بياناتك بدقة لبدء الاختبار</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">الاسم الرباعي الكامل</label>
          <input
            type="text"
            required
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            value={formData.fullName}
            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="الاسم كما هو في البطاقة"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">الرقم القومي (١٤ رقم)</label>
            <input
              type="text"
              required
              maxLength={14}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              value={formData.nationalId}
              onChange={e => setFormData({ ...formData, nationalId: e.target.value.replace(/\D/g, '') })}
              placeholder="29000000000000"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">رقم الهاتف</label>
            <input
              type="tel"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              placeholder="01000000000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">المركز التابع له</label>
          <select
            required
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 outline-none cursor-pointer"
            value={formData.center}
            onChange={e => setFormData({ ...formData, center: e.target.value })}
          >
            <option value="">اختر المركز...</option>
            {GHARBIA_CENTERS.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-bold text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="btn-primary w-full py-4 rounded-xl font-bold text-lg"
        >
          تأكيد البيانات والانتقال
        </button>
      </form>
    </div>
  );
};

export default Registration;
