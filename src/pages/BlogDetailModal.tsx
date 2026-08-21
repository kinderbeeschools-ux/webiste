import React, { useEffect } from 'react';
import { X, Calendar, Clock, Eye, User, Share2 } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogDetailModalProps {
  blog: BlogPost | null;
  onClose: () => void;
}

export const BlogDetailModal: React.FC<BlogDetailModalProps> = ({ blog, onClose }) => {
  useEffect(() => {
    if (blog) {
      // Increment view count via API
      fetch(`/api/blogs/${blog.id}/view`, { method: 'POST' }).catch(err => console.error(err));
    }
  }, [blog]);

  if (!blog) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-stone-100 my-8">
        
        {/* Cover Image */}
        <div className="relative h-72 sm:h-80 w-full overflow-hidden">
          <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent"></div>
          
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-stone-800 shadow-lg transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-6 left-6 right-6 space-y-2">
            <span className="bg-[#E1007A] text-white font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full">
              {blog.category}
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white leading-tight">
              {blog.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-300 pt-1">
              <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-[#E1007A]" />{blog.author}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{blog.date}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{blog.readTime}</span>
              <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" />{blog.views || 0} views</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 space-y-6 text-stone-700 leading-relaxed text-base">
          <div className="prose prose-stone max-w-none whitespace-pre-line">
            {blog.content}
          </div>

          <div className="pt-8 border-t border-stone-200 flex justify-between items-center">
            <button
              onClick={onClose}
              className="bg-stone-900 hover:bg-stone-800 text-white font-medium px-6 py-2.5 rounded-xl text-sm transition"
            >
              Back to Insights
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Article link copied to clipboard!');
              }}
              className="flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-[#E1007A] transition"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Article</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
