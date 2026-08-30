import React, { useEffect, useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Eye, 
  User, 
  Share2, 
  Bookmark, 
  Check, 
  ChevronRight, 
  Award, 
  BookOpen, 
  Tag,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { BlogPost } from '../types';

interface BlogDetailModalProps {
  blog: BlogPost | null;
  onClose: () => void;
}

export const BlogDetailModal: React.FC<BlogDetailModalProps> = ({ blog, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (blog) {
      // Increment view count via API
      fetch(`/api/blogs/${blog.id}/view`, { method: 'POST' }).catch(err => console.error(err));
    }
  }, [blog]);

  if (!blog) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative border border-stone-200/80 my-auto">
        
        {/* WordPress Top Action Bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium truncate max-w-[70%]">
            <span className="text-stone-400">Blogs</span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-300 shrink-0" />
            <span className="text-[#E1007A] font-semibold">{blog.category}</span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-300 shrink-0 hidden sm:inline" />
            <span className="text-stone-700 truncate hidden sm:inline">{blog.title}</span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSaved(!saved)}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                saved 
                  ? 'bg-pink-50 border-pink-200 text-[#E1007A]' 
                  : 'border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
              title="Bookmark article"
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-[#E1007A]' : ''}`} />
              <span className="hidden sm:inline">{saved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-semibold flex items-center gap-1.5 transition"
              title="Share article"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Link Copied!' : 'Share'}</span>
            </button>

            <button 
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 transition"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Article Header */}
        <div className="p-6 sm:p-10 pb-0 space-y-6">
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#E1007A] text-white font-bold text-xs uppercase tracking-wider px-3.5 py-1 rounded-full shadow-xs">
              {blog.category}
            </span>
            <span className="bg-amber-100 text-amber-900 font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#FFD400]" />
              WordPress Editorial
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-[#1C1917] leading-tight tracking-tight">
            {blog.title}
          </h1>

          {/* Author Byline & Meta */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-stone-100 text-xs text-stone-600">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pink-100 border border-pink-200 flex items-center justify-center font-bold text-[#E1007A]">
                {blog.author.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-stone-900 text-sm">{blog.author}</div>
                <div className="text-[11px] text-stone-400">KinderBee Research & Curriculum Specialist</div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-stone-500 font-medium">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[#E1007A]" /> {blog.date}</span>
              <span>&bull;</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#E1007A]" /> {blog.readTime}</span>
              <span>&bull;</span>
              <span className="flex items-center gap-1 text-[#E1007A] font-semibold"><Eye className="w-3.5 h-3.5" /> {blog.views || 0} reads</span>
            </div>
          </div>

        </div>

        {/* Featured Image */}
        <div className="px-6 sm:px-10 pt-6">
          <div className="rounded-2xl overflow-hidden relative shadow-md bg-stone-100 max-h-[420px]">
            <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
          </div>
          <div className="text-[11px] text-stone-400 italic pt-2 text-center">
            Figure: Pedagogical environment modeling aligned with FinnishWay Academy early education standards.
          </div>
        </div>

        {/* Article Body */}
        <div className="p-6 sm:p-10 space-y-8 text-stone-700 leading-relaxed text-base">
          
          {/* Key Takeaways Callout Box */}
          <div className="bg-pink-50/70 border-l-4 border-[#E1007A] p-5 rounded-r-2xl space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[#E1007A] flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>Key Takeaway & Summary</span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed italic">
              "{blog.excerpt}"
            </p>
          </div>

          {/* Formatted Content */}
          <div className="prose prose-stone max-w-none space-y-4 whitespace-pre-line text-sm sm:text-base leading-relaxed">
            {blog.content}
          </div>

          {/* WordPress Author Bio Box */}
          <div className="mt-10 p-6 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E1007A] to-amber-400 p-0.5 shrink-0 shadow-md">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center font-display font-black text-[#E1007A] text-lg">
                {blog.author.charAt(0)}
              </div>
            </div>
            <div className="space-y-1 text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="font-bold text-stone-900 text-sm">{blog.author}</span>
                <span className="text-[10px] bg-pink-100 text-[#E1007A] font-bold px-2 py-0.5 rounded-full">Verified Contributor</span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                Contributing editor for the KinderBee Research Desk, specializing in early childhood pedagogy, NEP 2020 regulatory compliance, and scalable zero-royalty educational frameworks.
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              onClick={onClose}
              className="w-full sm:w-auto bg-stone-900 hover:bg-stone-800 text-white font-semibold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Articles</span>
            </button>

            <button
              onClick={handleShare}
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs font-bold text-stone-600 hover:text-[#E1007A] transition px-4 py-2 border border-stone-200 rounded-xl"
            >
              <Share2 className="w-4 h-4" />
              <span>{copied ? 'Link Copied to Clipboard!' : 'Share This Publication'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
