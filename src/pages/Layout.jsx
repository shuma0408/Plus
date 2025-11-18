
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Sparkles, History } from "lucide-react";

export default function Layout({ children }) {
  const location = useLocation();

  const isActive = (pageName) => {
    return location.pathname === createPageUrl(pageName);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-2 group">
              <div className="w-10 h-10 flex items-center justify-center group-hover:scale-105 transition-transform">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691b2d7a553ce20461470bd8/9c02490eb_icon_code_brackets.png" 
                  alt="Q+" 
                  className="w-10 h-10 brightness-0 saturate-100"
                  style={{ filter: 'invert(57%) sepia(82%) saturate(3000%) hue-rotate(175deg) brightness(95%) contrast(101%)' }}
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">Q+</h1>
                <p className="text-xs text-slate-500 leading-none">Question Plus</p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-2">
              <Link
                to={createPageUrl("Home")}
                onClick={() => window.location.href = createPageUrl("Home")}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">ホーム</span>
              </Link>
              <Link
                to={createPageUrl("History")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive("History")
                    ? "bg-sky-100 text-sky-900"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">履歴</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-sm text-slate-600">
            <p className="mb-2">
              Q+ (Question Plus) - AIから最高の答えを引き出す
            </p>
            <p className="text-slate-400">
              © 2024 Q+. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
