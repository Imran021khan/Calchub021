import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calculator, Languages } from 'lucide-react';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isHindi = location.pathname.startsWith('/hi');

  const toggleLanguage = () => {
    if (isHindi) {
      navigate(location.pathname.replace('/hi', '') || '/');
    } else {
      navigate('/hi' + (location.pathname === '/' ? '' : location.pathname));
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to={isHindi ? "/hi" : "/"} className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">CalcHub</span>
          </Link>
          <div className="flex items-center space-x-4 md:space-x-8">
            <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-zinc-500">
              <Link to={isHindi ? "/hi" : "/"} className="hover:text-zinc-900 transition-colors">
                {isHindi ? "कैलकुलेटर" : "Calculators"}
              </Link>
              <Link to="#" className="hover:text-zinc-900 transition-colors">
                {isHindi ? "श्रेणियां" : "Categories"}
              </Link>
            </nav>
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors text-xs font-semibold text-zinc-600"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{isHindi ? "English" : "हिंदी"}</span>
            </button>
            <button className="md:hidden p-2 text-zinc-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {children}
      </main>

      <footer className="bg-zinc-50 border-t border-zinc-100 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <Calculator className="w-6 h-6" />
                <span className="font-bold text-xl">CalcHub</span>
              </Link>
              <p className="text-zinc-500 text-sm max-w-xs">
                The ultimate platform for fast, accurate, and SEO-optimized calculators for every need.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Categories</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><Link to="#" className="hover:text-zinc-900">Finance</Link></li>
                <li><Link to="#" className="hover:text-zinc-900">Health</Link></li>
                <li><Link to="#" className="hover:text-zinc-900">Math</Link></li>
                <li><Link to="#" className="hover:text-zinc-900">General</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><Link to="#" className="hover:text-zinc-900">Privacy Policy</Link></li>
                <li><Link to="#" className="hover:text-zinc-900">Terms of Service</Link></li>
                <li><Link to="#" className="hover:text-zinc-900">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-zinc-200 text-center text-xs text-zinc-400">
            © {new Date().getFullYear()} CalcHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
