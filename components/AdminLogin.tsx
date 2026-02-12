
import React, { useState } from 'react';
import { verifyAdminLogin } from '../services/dataService';

interface Props {
  onLogin: (success: boolean) => void;
}

const AdminLogin: React.FC<Props> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const success = await verifyAdminLogin(username, password);
      if (success) {
        onLogin(true);
      } else {
        setError('بيانات الدخول غير صحيحة');
        setLoading(false);
      }
    } catch (err) {
      setError('فشل الاتصال بالنظام');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="custom-card p-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl mx-auto flex items-center justify-center text-3xl mb-4 text-blue-600">
            🔒
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">دخول المشرفين</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">المستخدم</label>
            <input
              type="text"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition-all"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Username"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">كلمة المرور</label>
            <input
              type="password"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition-all"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                جاري التحقق...
              </>
            ) : 'تسجيل الدخول'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
