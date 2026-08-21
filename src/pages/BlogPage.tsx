import React, { useState } from 'react';
import { Sparkles, Search, ArrowRight, Eye, Calendar, Clock } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogPageProps {
  blogs: BlogPost[];
  onSelectBlog: (blog: BlogPost) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ blogs, onSelectBlog }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(blogs.map(b => b.category)))];

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-16 pb-20">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-stone-900 to-stone-950 text-white py-20 px-4 sm:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E1007A_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-4xl mx-auto relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-[#E1007A]/20 border border-[#E1007A]/40 text-pink-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-[#E1007A]" />
            <span>Educational Leadership & Research</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight">
            Insights & Nordic Pedagogy Blogs
          </h1>
          <p className="text-lg text-stone-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Explore expert articles on early childhood development, NEP 2020 compliance, preschool franchise business models, and school setup strategies.
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Categories */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  selectedCategory === cat 
                    ? 'bg-[#E1007A] text-white shadow-md' 
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search articles..."
              className="w-full bg-white border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A]"
            />
          </div>

        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map(blog => (
            <div 
              key={blog.id}
              onClick={() => onSelectBlog(blog)}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-xl transition duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="h-52 overflow-hidden relative">
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs text-[#1C1917] font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow">
                    {blog.category}
                  </span>
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-4 text-xs text-stone-400 font-medium">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{blog.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{blog.readTime}</span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-[#1C1917] line-clamp-2 hover:text-[#E1007A] transition">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>
              </div>
              <div className="p-6 pt-0 flex items-center justify-between text-xs text-stone-500 font-medium border-t border-stone-100 mt-4">
                <span>By {blog.author}</span>
                <span className="text-[#E1007A] font-semibold flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> {blog.views || 0} views
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredBlogs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200">
            <p className="text-stone-500 text-sm">No articles found matching your search criteria.</p>
          </div>
        )}

      </section>

    </div>
  );
};
