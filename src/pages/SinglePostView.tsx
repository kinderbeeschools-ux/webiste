import React, { useEffect, useState } from 'react';
import { 
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
  Sparkles, 
  MessageSquare, 
  TrendingUp, 
  Mail, 
  CheckCircle2,
  Globe
} from 'lucide-react';
import { BlogPost, SystemSettings } from '../types';
import { SEOHead } from '../components/SEOHead';
import { SmartImage } from '../components/SmartImage';
import { WpFullPostView } from '../components/WpFullPostView';

interface SinglePostViewProps {
  blog: BlogPost;
  allBlogs: BlogPost[];
  onBack: () => void;
  onSelectBlog: (blog: BlogPost) => void;
  onSelectCategory?: (category: string) => void;
  settings?: SystemSettings | null;
}

export const SinglePostView: React.FC<SinglePostViewProps> = ({ 
  blog, 
  allBlogs, 
  onBack,
  onSelectBlog,
  onSelectCategory,
  settings 
}) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    // Scroll smoothly to top on article change
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Increment view count via API
    fetch(`/api/blogs/${blog.id}/view`, { method: 'POST' }).catch(err => console.error(err));
  }, [blog.id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const relatedPosts = allBlogs
    .filter(b => b.id !== blog.id && (b.category === blog.category || true))
    .slice(0, 3);

  const trendingPosts = [...allBlogs]
    .filter(b => b.id !== blog.id)
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 4);

  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-24 space-y-10">
      
      {/* React Helmet Dynamic Meta Management */}
      <SEOHead 
        blogPost={blog} 
        settings={settings}
        ogType="article"
      />
      
      {/* WordPress Editorial Top Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#200213] via-[#12010B] to-[#1F0214] text-white py-16 px-4 sm:px-8 border-b border-pink-950/40">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#E1007A_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-15"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(225,0,122,0.28),transparent_60%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,212,0,0.14),transparent_50%)]"></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10 space-y-4">
          
          {/* Breadcrumb Navigation with WordPress Category Taxonomy */}
          <div className="flex items-center gap-2 text-xs text-pink-200 font-medium flex-wrap">
            <button 
              onClick={onBack}
              className="text-pink-300 hover:text-white flex items-center gap-1 font-semibold transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Blogs Feed</span>
            </button>
            <span className="text-pink-500">/</span>
            <button
              onClick={() => {
                if (onSelectCategory) {
                  onSelectCategory(blog.category);
                  onBack();
                } else {
                  onBack();
                }
              }}
              className="bg-pink-950/60 hover:bg-pink-900 border border-pink-700/40 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-[#FFD400] transition cursor-pointer"
            >
              {blog.category}
            </button>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white leading-tight tracking-tight pt-2">
            {blog.title}
          </h1>

          {/* Author Byline & Meta details */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-pink-900/40 text-xs text-pink-200/90">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E1007A] to-amber-400 p-0.5 shadow-md">
                <div className="w-full h-full bg-stone-900 rounded-full flex items-center justify-center font-bold text-[#FFD400]">
                  {blog.author.charAt(0)}
                </div>
              </div>
              <div>
                <div className="font-bold text-white text-sm">{blog.author}</div>
                <div className="text-[11px] text-pink-300">KinderBee Research & Curriculum Specialist</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[#FFD400]" /> {blog.date}</span>
              <span>&bull;</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#FFD400]" /> {blog.readTime}</span>
              <span>&bull;</span>
              <span className="flex items-center gap-1 text-[#FFD400] font-bold"><Eye className="w-3.5 h-3.5" /> {blog.views || 0} views</span>
            </div>
          </div>

        </div>
      </section>

      {/* Main Single Page Article & WordPress Sidebar Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Article Content (8 Columns) */}
          <article className="lg:col-span-8 bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden p-6 sm:p-10 space-y-8">
            
            {/* Action Bar (Share, Bookmark, Back) */}
            <div className="flex items-center justify-between pb-6 border-b border-stone-100">
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-[#E1007A] transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>&larr; Return to All Articles</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSaved(!saved)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    saved 
                      ? 'bg-pink-50 border-pink-200 text-[#E1007A]' 
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-[#E1007A]' : ''}`} />
                  <span>{saved ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="px-3 py-1.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Share'}</span>
                </button>
              </div>
            </div>

            {/* Featured Article Image with Automated Descriptive Alt */}
            <div className="rounded-2xl overflow-hidden shadow-md bg-stone-900 max-h-[460px]">
              <SmartImage 
                src={blog.image} 
                altContext={{
                  title: blog.title,
                  category: blog.category,
                  author: blog.author,
                  type: 'blog'
                }}
                className="w-full h-full object-cover" 
              />
            </div>

            {/* Key Takeaway Callout Box */}
            <div className="bg-gradient-to-r from-pink-50 via-pink-50/50 to-amber-50/40 border-l-4 border-[#E1007A] p-5 rounded-r-2xl space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[#E1007A] flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>Executive Summary & Takeaways</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium italic">
                "{blog.excerpt}"
              </p>
            </div>

            {/* Formatted Article Body */}
            <div className="prose prose-stone max-w-none text-stone-800 text-base leading-relaxed space-y-5 whitespace-pre-line">
              {blog.content}
            </div>

            {/* Author Bio Box (Classic WordPress Style) */}
            <div className="mt-12 p-6 rounded-2xl bg-stone-50 border border-stone-200/90 flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E1007A] to-amber-400 p-0.5 shrink-0 shadow-md">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center font-display font-black text-[#E1007A] text-xl">
                  {blog.author.charAt(0)}
                </div>
              </div>
              <div className="space-y-1 text-center sm:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="font-bold text-stone-900 text-base">{blog.author}</span>
                  <span className="text-[10px] bg-pink-100 text-[#E1007A] font-bold px-2.5 py-0.5 rounded-full">
                    Verified KinderBee Fellow
                  </span>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Senior educator and curriculum director at KinderBee International Preschools, leading early development programs aligned with Finnish active learning systems.
                </p>
              </div>
            </div>

            {/* Article Navigation & Related Stories */}
            <div className="pt-8 border-t border-stone-200 space-y-6">
              <h3 className="font-display font-bold text-lg text-stone-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#E1007A]" />
                <span>Related Publications in {blog.category}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedPosts.map(rel => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectBlog(rel)}
                    className="group bg-stone-50 hover:bg-white rounded-2xl p-3.5 border border-stone-200/80 hover:border-pink-200 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="h-28 rounded-xl overflow-hidden bg-stone-200">
                        <SmartImage 
                          src={rel.image} 
                          altContext={{ title: rel.title, category: rel.category, type: 'blog' }}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                        />
                      </div>
                      <h4 className="font-bold text-xs text-stone-900 line-clamp-2 group-hover:text-[#E1007A] transition leading-snug">
                        {rel.title}
                      </h4>
                    </div>
                    <span className="text-[11px] text-[#E1007A] font-bold mt-2 inline-flex items-center gap-1">
                      Read story &rarr;
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </article>

          {/* WordPress Sticky Right Sidebar (4 Columns) */}
          <aside className="lg:col-span-4 space-y-6">

            {/* Author / Desk Widget */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                <Award className="w-4 h-4 text-[#E1007A]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">KinderBee Research Desk</h4>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Published by KinderBee International Research & Pedagogical Advisory Council. Dedicated to zero-royalty education and Finnish active play frameworks.
              </p>
            </div>

            {/* Trending / Top Reads */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                <TrendingUp className="w-4 h-4 text-[#E1007A]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">Most Read Articles</h4>
              </div>
              <div className="space-y-3">
                {trendingPosts.map((trend, idx) => (
                  <div
                    key={trend.id}
                    onClick={() => onSelectBlog(trend)}
                    className="flex items-start gap-3 group cursor-pointer"
                  >
                    <span className="font-display font-black text-lg text-stone-300 group-hover:text-[#E1007A] transition-colors shrink-0 w-6">
                      0{idx + 1}
                    </span>
                    <div className="flex-1 space-y-1">
                      <h5 className="text-xs font-bold text-stone-900 group-hover:text-[#E1007A] transition line-clamp-2 leading-snug">
                        {trend.title}
                      </h5>
                      <div className="text-[10px] text-stone-400">{trend.views || 0} views &bull; {trend.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter Dispatch Widget */}
            <div className="bg-gradient-to-br from-[#200213] to-[#12010B] text-white rounded-2xl p-6 shadow-md space-y-4 relative overflow-hidden">
              <div className="flex items-center gap-2 text-xs font-bold text-pink-200 uppercase tracking-widest">
                <Mail className="w-3.5 h-3.5 text-[#FFD400]" />
                <span>WP Education Dispatch</span>
              </div>
              <h4 className="text-sm font-display font-bold leading-snug">
                Never Miss a Nordic Pedagogical Study
              </h4>
              <p className="text-xs text-pink-100/75 leading-relaxed">
                Join 4,500+ Indian school founders receiving weekly NEP updates and curriculum guides.
              </p>
              {subscribed ? (
                <div className="bg-emerald-950 border border-emerald-500/50 text-emerald-200 text-xs p-3 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Subscribed! Check your inbox.</span>
                </div>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (newsletterEmail) setSubscribed(true);
                  }} 
                  className="space-y-2"
                >
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={e => setNewsletterEmail(e.target.value)}
                    placeholder="Your email address..."
                    className="w-full bg-stone-900/90 border border-pink-900/50 rounded-xl px-3.5 py-2 text-xs text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#E1007A]"
                  />
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#E1007A] to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-2 rounded-xl text-xs shadow-md transition cursor-pointer"
                  >
                    Subscribe &rarr;
                  </button>
                </form>
              )}
            </div>

            {/* Franchise CTA Banner */}
            <div className="bg-gradient-to-br from-pink-50 via-amber-50 to-purple-50 rounded-2xl border border-pink-200/70 p-6 space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#E1007A] bg-white px-2.5 py-1 rounded-md border border-pink-100 inline-block">
                100% Zero Royalty
              </span>
              <h4 className="font-display font-extrabold text-sm text-[#1C1917]">
                Launch Your Finnish Preschool
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Unlock full curriculum licensing, architectural design, and 18-month payback guidance.
              </p>
              <button 
                onClick={() => {
                  const event = new CustomEvent('open-consultation', { detail: { type: 'franchise' } });
                  window.dispatchEvent(event);
                }}
                className="w-full bg-[#E1007A] hover:bg-pink-700 text-white text-xs font-bold py-2 rounded-xl shadow-xs transition cursor-pointer"
              >
                Request Free Prospectus
              </button>
            </div>

          </aside>

        </div>
      </div>

    </div>
  );
};

