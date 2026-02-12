
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const LOGO_URL = "https://drive.google.com/uc?export=view&id=1N4E-PylAF9LIv4nGSf4kEjy6F5YB-pTi";

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src={LOGO_URL} 
              alt="Logo" 
              className="h-12 w-auto object-contain"
              onError={(e) => { 
                (e.target as HTMLImageElement).src = "https://upload.wikimedia.org/wikipedia/commons/e/e3/Haya_Karima_Logo.png"; 
              }}
            />
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex flex-col">
              <h1 className="text-xl font-extrabold text-slate-900 leading-none">مؤسسة حياة كريمة</h1>
              <span className="text-blue-600 text-[10px] font-bold mt-1">مكتب الغربية • ٢٠٢٦</span>
            </div>
          </div>
          <div className="hidden md:flex flex-col items-end">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Portal System</span>
          </div>
        </div>
      </header>
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <img src={LOGO_URL} alt="Logo" className="h-8 w-auto grayscale opacity-50" />
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900">مؤسسة حياة كريمة - مكتب الغربية</p>
              <p className="text-slate-400 text-[10px]">جميع الحقوق محفوظة © ٢٠٢٦</p>
            </div>
          </div>
          <div className="flex gap-4">
             <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-[10px] font-bold text-slate-500">
                منصة المسابقات المعتمدة
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
