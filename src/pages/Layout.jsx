
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
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">質問最適化AI</h1>
                <p className="text-xs text-slate-500 leading-none">プロレベルの質問に変換</p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-2">
              <Link
                to={createPageUrl("Home")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive("Home")
                    ? "bg-purple-100 text-purple-900"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">質問を最適化</span>
              </Link>
              <Link
                to={createPageUrl("History")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive("History")
                    ? "bg-purple-100 text-purple-900"
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
              AI時代の質問補助装置 - 誰でもプロ級の質問ができる
            </p>
            <p className="text-slate-400">
              © 2024 質問最適化AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
