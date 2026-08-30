import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  ArrowRight, 
  Eye, 
  Calendar, 
  Clock, 
  LayoutGrid, 
  List, 
  User, 
  Tag, 
  TrendingUp, 
  Mail, 
  CheckCircle2, 
  Bookmark, 
  Share2,
  ChevronRight,
  BookOpen,
  Award,
  Filter,
  FolderOpen
} from 'lucide-react';
import { BlogPost, SystemSettings } from '../types';
import { SEOHead } from '../components/SEOHead';
import { SmartImage } from '../components/SmartImage';

interface BlogPageProps {
  blogs: BlogPost[];
  onSelectBlog: (blog: BlogPost) => void;
  initialCategory?: string;
  settings?: SystemSettings | null;
}

export const BlogPage: React.FC<BlogPageProps> = ({ 
  blogs, 
  onSelectBlog,
  initialCategory = 'All',
  settings
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  useEffect(() => {
    if (initialCategory && initialCategory !== selectedCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // WordPress Tags Taxonomy
  const wpTags = [
    'Zero Royalty',
    'NEP 2020',
    'Play-Based',
    'Preschool ROI',
    'Teacher Training',
    'CBSE Setup',
    'Finnish Curriculum',
    'Montessori vs Nordic'
  ];

  const categories: string[] = ['All', ...Array.from(new Set<string>(blogs.map(b => b.category)))];

  // Category counts
  const categoryCounts = categories.reduce((acc, cat) => {
    acc[cat] = cat === 'All' ? blogs.length : blogs.filter(b => b.category === cat).length;
    return acc;
  }, {} as Record<string, number>);

  // Filter & Sort
  const filteredBlogs = blogs
    .filter(blog => {
      const matchesSearch = 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
      const matchesTag = !selectedTag || 
        blog.title.toLowerCase().includes(selectedTag.toLowerCase()) || 
        blog.excerpt.toLowerCase().includes(selectedTag.toLowerCase()) ||
        blog.category.toLowerCase().includes(selectedTag.toLowerCase());
      return matchesSearch && matchesCategory && matchesTag;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') {
        return (b.views || 0) - (a.views || 0);
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  // Featured Sticky Post (Top post when not searching and viewing All)
  const featuredPost = filteredBlogs.length > 0 ? filteredBlogs[0] : null;
  // Feed posts
  const regularPosts = (selectedCategory === 'All' && !searchTerm && !selectedTag && filteredBlogs.length > 1) 
    ? filteredBlogs.slice(1) 
    : filteredBlogs;

  // Trending Posts (Top 4 by views)
  const trendingPosts = [...blogs].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 4);

  const postsPerPage = 6;
  const totalPages = Math.ceil(regularPosts.length / postsPerPage) || 1;
  const paginatedPosts = regularPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 3000);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Nordic Education':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Investment':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'School Setup':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Teacher Training':
        return 'bg-pink-100 text-[#E1007A] border-pink-200';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  return (
    <div className="space-y-12 pb-20 bg-[#FAF9F6] min-h-screen">
      
      {/* React Helmet Dynamic Meta Tags */}
      <SEOHead
        title={selectedCategory === 'All' ? 'Research Dispatches & Pedagogical Blogs' : `${selectedCategory} Insights & Research`}
        description={`Explore peer-reviewed articles, curriculum updates, and zero-royalty school setup insights for ${selectedCategory === 'All' ? 'Preschools in India' : selectedCategory}.`}
        keywords={`nordic education, ${selectedCategory.toLowerCase()}, preschool franchise blogs, NEP 2020 compliance, play based pedagogy`}
        settings={settings}
      />

      {/* Header Banner with KinderBee Brand Colors */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#200213] via-[#12010B] to-[#1F0214] text-white py-20 px-4 sm:px-8 text-center border-b border-pink-950/40">
        {/* Glow & Atmospheric Brand Overlays */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#E1007A_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-15"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(225,0,122,0.28),transparent_60%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,212,0,0.14),transparent_50%)]"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 bg-stone-900/80 border border-[#E1007A]/50 text-pink-200 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD400]" />
            <span>WordPress Editorial & Nordic Research</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight text-white leading-tight">
            Insights & Nordic <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD400] via-pink-300 to-[#E1007A]">Pedagogy Blogs</span>
          </h1>
          <p className="text-base sm:text-lg text-pink-100/80 max-w-2xl mx-auto font-normal leading-relaxed">
            Explore peer-reviewed articles on early childhood development, NEP 2020 compliance, zero-royalty preschool franchise models, and institutional excellence.
          </p>
        </div>
      </section>

      {/* WordPress Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">

        {/* WordPress Editorial Top Bar */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
            
            {/* Category Navigation Taxonomy Pills with Post Counts */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              <div className="flex items-center gap-1.5 text-xs text-stone-400 font-bold uppercase tracking-wider pr-2 border-r border-stone-200 shrink-0">
                <FolderOpen className="w-3.5 h-3.5 text-[#E1007A]" />
                <span className="hidden sm:inline">Category:</span>
              </div>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSelectedTag(null);
                    setCurrentPage(1);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
                    selectedCategory === cat && !selectedTag
                      ? 'bg-gradient-to-r from-[#E1007A] to-pink-600 text-white shadow-md' 
                      : 'bg-stone-100/80 text-stone-600 hover:bg-stone-200/70 hover:text-stone-900'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                    selectedCategory === cat && !selectedTag
                      ? 'bg-white/20 text-white' 
                      : 'bg-stone-200 text-stone-600'
                  }`}>
                    {categoryCounts[cat] || 0}
                  </span>
                </button>
              ))}
            </div>

            {/* Controls: Search, Sort, View Toggle */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {/* Search Bar */}
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search articles, topics..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A] focus:bg-white transition"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 text-xs font-bold cursor-pointer"
                  >
                    &times;
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'latest' | 'popular')}
                className="bg-stone-50 border border-stone-200 text-stone-700 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E1007A] cursor-pointer"
              >
                <option value="latest">Latest Dispatches</option>
                <option value="popular">Most Popular</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-stone-100 rounded-xl p-1 border border-stone-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                    viewMode === 'grid' 
                      ? 'bg-white text-[#E1007A] shadow-xs font-bold' 
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                  title="Grid Layout"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                    viewMode === 'list' 
                      ? 'bg-white text-[#E1007A] shadow-xs font-bold' 
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                  title="List Layout"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

          {/* Active Tag & Filter Indicator */}
          {(selectedTag || selectedCategory !== 'All' || searchTerm) && (
            <div className="flex items-center flex-wrap gap-2 pt-2 border-t border-stone-100 text-xs text-stone-600">
              <span className="font-semibold text-stone-500 flex items-center gap-1">
                <Filter className="w-3 h-3 text-[#E1007A]" /> Active Filters:
              </span>
              
              {selectedCategory !== 'All' && (
                <span className="bg-pink-100 text-[#E1007A] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')} className="hover:text-pink-900 font-black cursor-pointer">&times;</button>
                </span>
              )}

              {selectedTag && (
                <span className="bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  #{selectedTag}
                  <button onClick={() => setSelectedTag(null)} className="hover:text-amber-950 font-black cursor-pointer">&times;</button>
                </span>
              )}

              {searchTerm && (
                <span className="bg-stone-200 text-stone-800 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  Keyword: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="hover:text-black font-black cursor-pointer">&times;</button>
                </span>
              )}

              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedTag(null);
                  setSearchTerm('');
                }}
                className="text-[11px] text-[#E1007A] hover:underline font-bold ml-auto cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* WordPress Featured / Sticky Hero Post (When on All Categories & First Page) */}
        {featuredPost && selectedCategory === 'All' && !searchTerm && !selectedTag && currentPage === 1 && (
          <div 
            onClick={() => onSelectBlog(featuredPost)}
            className="group bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-0"
          >
            {/* Featured Image */}
            <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-full overflow-hidden bg-stone-900">
              <SmartImage 
                src={featuredPost.image} 
                altContext={{
                  title: featuredPost.title,
                  category: featuredPost.category,
                  author: featuredPost.author,
                  type: 'blog'
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent lg:hidden"></div>
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="bg-[#FFD400] text-stone-950 font-black text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> FEATURED STORY
                </span>
                <span className="bg-white/90 backdrop-blur-md text-[#1C1917] font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-sm">
                  {featuredPost.category}
                </span>
              </div>
            </div>

            {/* Featured Details */}
            <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs text-stone-400 font-medium">
                  <span className="flex items-center gap-1.5 text-stone-600">
                    <Calendar className="w-3.5 h-3.5 text-[#E1007A]" />
                    {featuredPost.date}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1.5 text-stone-600">
                    <Clock className="w-3.5 h-3.5 text-[#E1007A]" />
                    {featuredPost.readTime}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1.5 text-[#E1007A] font-bold">
                    <Eye className="w-3.5 h-3.5" />
                    {featuredPost.views || 0} views
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[#1C1917] leading-tight group-hover:text-[#E1007A] transition-colors">
                  {featuredPost.title}
                </h2>

                <p className="text-sm text-stone-600 leading-relaxed font-normal line-clamp-4">
                  {featuredPost.excerpt}
                </p>
              </div>

              <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-pink-100 text-[#E1007A] flex items-center justify-center font-bold text-xs border border-pink-200">
                    {featuredPost.author.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">{featuredPost.author}</div>
                    <div className="text-[10px] text-stone-400">KinderBee Editorial Team</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-[#E1007A] group-hover:translate-x-1 transition-transform">
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

            </div>

          </div>
        )}

        {/* WordPress Two-Column Editorial Layout (Left 8 Cols Main Feed, Right 4 Cols WP Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Feed (8 Columns) */}
          <div className="lg:col-span-8 space-y-8">
            
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#E1007A]"></div>
                <h3 className="text-lg font-display font-extrabold text-[#1C1917]">
                  {selectedCategory === 'All' ? 'Latest Publications & Pedagogical Papers' : `${selectedCategory} Articles`}
                </h3>
              </div>
              <span className="text-xs text-stone-400 font-semibold">
                Showing {paginatedPosts.length} of {regularPosts.length} articles
              </span>
            </div>

            {/* Blog Post List (Grid or List View) */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paginatedPosts.map(blog => (
                  <article 
                    key={blog.id}
                    onClick={() => onSelectBlog(blog)}
                    className="group bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      {/* Image with Automated Descriptive Alt */}
                      <div className="h-48 overflow-hidden relative bg-stone-100">
                        <SmartImage 
                          src={blog.image} 
                          altContext={{
                            title: blog.title,
                            category: blog.category,
                            author: blog.author,
                            type: 'blog'
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <span className={`absolute top-3.5 left-3.5 border font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs backdrop-blur-md ${getCategoryColor(blog.category)}`}>
                          {blog.category}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-2.5">
                        <div className="flex items-center gap-3 text-[11px] text-stone-400 font-medium">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-[#E1007A]" />{blog.date}</span>
                          <span>&bull;</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-stone-400" />{blog.readTime}</span>
                        </div>

                        <h4 className="font-display font-bold text-base text-[#1C1917] line-clamp-2 group-hover:text-[#E1007A] transition-colors leading-snug">
                          {blog.title}
                        </h4>

                        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                          {blog.excerpt}
                        </p>
                      </div>
                    </div>

                    {/* Meta Footer */}
                    <div className="p-5 pt-0 flex items-center justify-between text-xs text-stone-500 font-medium border-t border-stone-100 mt-2">
                      <span className="truncate max-w-[140px] text-[11px] text-stone-500 font-semibold">By {blog.author}</span>
                      <span className="text-[#E1007A] font-bold text-[11px] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Read Story &rarr;
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              /* Classic WordPress List View */
              <div className="space-y-5">
                {paginatedPosts.map(blog => (
                  <article
                    key={blog.id}
                    onClick={() => onSelectBlog(blog)}
                    className="group bg-white rounded-2xl overflow-hidden border border-stone-200/90 p-4 sm:p-5 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col sm:flex-row gap-5 items-center"
                  >
                    <div className="w-full sm:w-56 h-40 shrink-0 overflow-hidden rounded-xl relative bg-stone-100">
                      <SmartImage 
                        src={blog.image} 
                        altContext={{
                          title: blog.title,
                          category: blog.category,
                          author: blog.author,
                          type: 'blog'
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <span className={`absolute top-2.5 left-2.5 border font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs ${getCategoryColor(blog.category)}`}>
                        {blog.category}
                      </span>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3 text-[11px] text-stone-400 font-medium">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-[#E1007A]" />{blog.date}</span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{blog.readTime}</span>
                        <span>&bull;</span>
                        <span className="text-[#E1007A] font-semibold flex items-center gap-1"><Eye className="w-3 h-3" />{blog.views || 0} views</span>
                      </div>

                      <h4 className="font-display font-bold text-lg text-[#1C1917] group-hover:text-[#E1007A] transition-colors leading-snug">
                        {blog.title}
                      </h4>

                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {blog.excerpt}
                      </p>

                      <div className="pt-2 flex items-center justify-between text-xs text-stone-500">
                        <span className="font-semibold text-stone-700">By {blog.author}</span>
                        <span className="text-[#E1007A] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Continue Reading <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Empty State */}
            {filteredBlogs.length === 0 && (
              <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 space-y-3">
                <BookOpen className="w-10 h-10 text-stone-300 mx-auto" />
                <h4 className="text-base font-bold text-stone-700">No articles matched your criteria</h4>
                <p className="text-stone-500 text-xs max-w-sm mx-auto">
                  Try searching with different keywords or reset your active category and tag filters.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setSelectedTag(null);
                  }}
                  className="bg-pink-50 text-[#E1007A] text-xs font-bold px-4 py-2 rounded-xl hover:bg-pink-100 transition cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* WordPress Classic Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  &laquo; Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition cursor-pointer ${
                      currentPage === num 
                        ? 'bg-[#E1007A] text-white shadow-md' 
                        : 'border border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  Next &raquo;
                </button>
              </div>
            )}

          </div>

          {/* WordPress Sidebar (4 Columns) */}
          <aside className="lg:col-span-4 space-y-6">

            {/* Widget 1: Editorial Desk Spotlight */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                <Award className="w-4 h-4 text-[#E1007A]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">KinderBee Research Desk</h4>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E1007A] to-amber-400 p-0.5 shadow-md">
                  <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center font-display font-black text-[#E1007A] text-sm">
                    KB
                  </div>
                </div>
                <div>
                  <div className="text-sm font-bold text-stone-900">Nordic & NEP Advisory</div>
                  <div className="text-[11px] text-stone-500">Early Childhood Specialists</div>
                </div>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Authored by certified FinnishWay master trainers and senior school strategists guiding zero-royalty institutions across India.
              </p>
            </div>

            {/* Widget 2: Trending / Most Read Stories */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                <TrendingUp className="w-4 h-4 text-[#E1007A]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">Trending & Most Read</h4>
              </div>
              <div className="space-y-3.5">
                {trendingPosts.map((blog, idx) => (
                  <div 
                    key={blog.id} 
                    onClick={() => onSelectBlog(blog)}
                    className="flex items-start gap-3 group cursor-pointer"
                  >
                    <span className="font-display font-black text-lg text-stone-300 group-hover:text-[#E1007A] transition-colors shrink-0 w-6">
                      0{idx + 1}
                    </span>
                    <div className="flex-1 space-y-1">
                      <h5 className="text-xs font-bold text-stone-900 group-hover:text-[#E1007A] transition line-clamp-2 leading-snug">
                        {blog.title}
                      </h5>
                      <div className="flex items-center gap-2 text-[10px] text-stone-400">
                        <span>{blog.date}</span>
                        <span>&bull;</span>
                        <span className="text-[#E1007A] font-semibold">{blog.views || 0} views</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 3: WordPress Newsletter Box */}
            <div className="bg-gradient-to-br from-[#200213] to-[#12010B] text-white rounded-2xl p-6 shadow-md space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle,rgba(225,0,122,0.35),transparent_70%)] pointer-events-none"></div>
              
              <div className="flex items-center gap-2 text-xs font-bold text-pink-200 uppercase tracking-widest">
                <Mail className="w-3.5 h-3.5 text-[#FFD400]" />
                <span>WP Education Dispatch</span>
              </div>

              <h4 className="text-base font-display font-bold leading-snug">
                Get Weekly Nordic Pedagogy & Franchise Insights
              </h4>

              <p className="text-xs text-pink-100/75 leading-relaxed">
                Curated digests on curriculum best practices, school ROI, and NEP 2020 regulatory updates directly to your inbox.
              </p>

              {newsletterSubscribed ? (
                <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs p-3 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Subscribed successfully! Check your inbox for updates.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={e => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="w-full bg-stone-900/90 border border-pink-900/50 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#E1007A]"
                  />
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#E1007A] to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition cursor-pointer"
                  >
                    Subscribe Now &rarr;
                  </button>
                </form>
              )}
            </div>

            {/* Widget 4: WordPress Tag Cloud */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                <Tag className="w-4 h-4 text-[#E1007A]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">Popular Topics & Tags</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {wpTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSelectedTag(tag === selectedTag ? null : tag);
                      setCurrentPage(1);
                    }}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                      selectedTag === tag 
                        ? 'bg-[#E1007A] text-white font-bold shadow-xs' 
                        : 'bg-stone-100 text-stone-600 hover:bg-pink-50 hover:text-[#E1007A]'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Widget 5: Franchise Callout Banner */}
            <div className="bg-gradient-to-br from-pink-50 via-amber-50 to-purple-50 rounded-2xl border border-pink-200/70 p-6 space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#E1007A] bg-white px-2.5 py-1 rounded-md border border-pink-100 inline-block">
                100% Zero Royalty
              </span>
              <h4 className="font-display font-extrabold text-base text-[#1C1917]">
                Ready to Start Your Finnish Preschool?
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Discover our comprehensive setup kit, curriculum licensing, and projected 18-month ROI model.
              </p>
              <a 
                href="https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/Files/_FRANCHISE.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download="KinderBee_Franchise_Brochure.pdf"
                className="w-full bg-[#E1007A] hover:bg-pink-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                Download Free Prospectus PDF &rarr;
              </a>
            </div>

          </aside>

        </div>

      </div>

    </div>
  );
};

