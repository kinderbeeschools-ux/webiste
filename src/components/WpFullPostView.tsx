import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Eye, 
  User, 
  Share2, 
  Bookmark, 
  Check, 
  MessageSquare, 
  Sparkles, 
  ChevronRight, 
  Search, 
  Edit, 
  Heart, 
  Send, 
  ThumbsUp, 
  ExternalLink,
  Tag as TagIcon,
  Globe,
  Sliders,
  CheckCircle2,
  Plus,
  Maximize2,
  Minimize2,
  X
} from 'lucide-react';
import { BlogPost, SystemSettings } from '../types';
import { SmartImage } from './SmartImage';
import { renderMarkdown } from '../utils/markdownRenderer';

interface Comment {
  id: string;
  author: string;
  avatarBg: string;
  date: string;
  text: string;
}

interface WpFullPostViewProps {
  post: BlogPost;
  allPosts?: BlogPost[];
  onBack?: () => void;
  onEditInGutenberg?: (post: BlogPost) => void;
  onSelectPost?: (post: BlogPost) => void;
  settings?: SystemSettings | null;
}

export const WpFullPostView: React.FC<WpFullPostViewProps> = ({
  post,
  allPosts = [],
  onBack,
  onEditInGutenberg,
  onSelectPost,
  settings
}) => {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likes, setLikes] = useState(24);
  const [hasLiked, setHasLiked] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Comments state
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 'c1',
      author: 'Capt. R. Deshmukh',
      avatarBg: 'from-blue-600 to-indigo-700',
      date: 'August 29, 2026 at 4:15 pm',
      text: 'Superbly articulated breakdown! The explanation of dew point spread and variable gust reporting will be immensely helpful for foundational ground school trainees.'
    },
    {
      id: 'c2',
      author: 'Priya Sundaram (Flight Cadette)',
      avatarBg: 'from-pink-600 to-rose-700',
      date: 'August 30, 2026 at 10:20 am',
      text: 'Clear, concise, and straight to the point. Bookmarked this for my upcoming DGCA Meteorology exam revision.'
    }
  ]);

  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentEmail, setNewCommentEmail] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [commentSubmitted, setCommentSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Record view
    fetch(`/api/blogs/${post.id}/view`, { method: 'POST' }).catch(() => {});
  }, [post.id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleLike = () => {
    if (!hasLiked) {
      setLikes(likes + 1);
      setHasLiked(true);
    } else {
      setLikes(likes - 1);
      setHasLiked(false);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !newCommentName.trim()) return;

    const newComment: Comment = {
      id: `c_${Date.now()}`,
      author: newCommentName.trim(),
      avatarBg: 'from-amber-500 to-orange-600',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + ' at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: newCommentText.trim()
    };

    setComments([...comments, newComment]);
    setNewCommentText('');
    setNewCommentName('');
    setNewCommentEmail('');
    setCommentSubmitted(true);
    setTimeout(() => setCommentSubmitted(false), 4000);
  };

  // Find previous and next posts
  const currentIndex = allPosts.findIndex(p => p.id === post.id);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex >= 0 && currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const relatedPosts = allPosts
    .filter(p => p.id !== post.id && (p.category === post.category || true))
    .slice(0, 3);

  return (
    <div className={`min-h-screen bg-[#f8f9fa] text-[#2c3338] font-sans antialiased selection:bg-[#2271b1] selection:text-white ${isFullscreen ? 'fixed inset-0 z-50 overflow-y-auto' : ''}`}>
      
      {/* Top Preview Control Bar */}
      <div className="bg-[#1C1917] text-stone-200 text-xs py-2 px-4 flex items-center justify-between sticky top-0 z-40 border-b border-stone-800 shadow-xs">
        <div className="flex items-center gap-3">
          {onBack && (
            <button 
              onClick={onBack}
              className="bg-stone-800 hover:bg-stone-700 text-white font-semibold px-3 py-1 rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#E1007A]" />
              <span>Back to Editor</span>
            </button>
          )}
          <span className="text-stone-500 hidden sm:inline">|</span>
          <span className="font-semibold text-white text-xs hidden sm:inline">Full Article Preview</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-stone-300">
          {onEditInGutenberg && (
            <button
              onClick={() => onEditInGutenberg(post)}
              className="bg-[#E1007A] hover:bg-pink-700 text-white font-bold px-3 py-1 rounded-lg text-xs flex items-center gap-1 transition cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Post</span>
            </button>
          )}
          {onBack && (
            <button
              onClick={onBack}
              className="p-1 text-stone-400 hover:text-white transition cursor-pointer"
              title="Close Preview"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>



      {/* ========================================================
          3. MAIN ARTICLE CONTAINER (WordPress Editorial Layout)
         ======================================================== */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-stone-400 flex-wrap">
          <span className="hover:text-stone-700 cursor-pointer">Home</span>
          <span>&gt;</span>
          <span className="hover:text-stone-700 cursor-pointer">Blog</span>
          <span>&gt;</span>
          <span className="text-[#2271b1] font-semibold cursor-pointer">{post.category}</span>
          <span>&gt;</span>
          <span className="text-stone-600 font-medium truncate max-w-xs">{post.title}</span>
        </div>

        {/* Post Header */}
        <div className="space-y-4">
          
          {/* Category Pill */}
          <div className="inline-flex items-center gap-1.5 bg-[#2271b1]/10 text-[#2271b1] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <span>{post.category}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-[#1e1e1e] leading-tight tracking-tight">
            {post.title}
          </h1>

          {/* Author Byline & Meta */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-b border-stone-200 py-3 text-xs text-stone-500">
            
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#2271b1] to-purple-600 p-0.5 shadow-xs">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-bold text-[#2271b1]">
                  {(post.author || 'V').charAt(0)}
                </div>
              </div>
              <div>
                <div className="font-bold text-stone-900 text-xs">{post.author || 'KinderBee'}</div>
                <div className="text-[10px] text-stone-400">Author & Content Strategist</div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                {post.date || 'August 29, 2026'}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                {post.readTime || '5 min read'}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <Eye className="w-3.5 h-3.5" />
                {post.views || 520} views
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1 text-blue-600 font-semibold">
                <MessageSquare className="w-3.5 h-3.5" />
                {comments.length} comments
              </span>
            </div>

          </div>

        </div>

        {/* Featured Image */}
        {post.image && (
          <div className="rounded-2xl overflow-hidden shadow-md bg-stone-900 border border-stone-200">
            <SmartImage
              src={post.image}
              altContext={{
                title: post.title,
                category: post.category,
                author: post.author,
                type: 'blog'
              }}
              className="w-full max-h-[480px] object-cover"
            />
          </div>
        )}

        {/* Key Takeaway Callout Box */}
        {post.excerpt && (
          <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-stone-50 border-l-4 border-[#2271b1] p-5 rounded-r-xl space-y-1.5 shadow-xs">
            <div className="text-xs font-bold uppercase tracking-wider text-[#2271b1] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Key Insight & Summary</span>
            </div>
            <p className="text-sm text-stone-700 leading-relaxed font-medium italic">
              "{post.excerpt}"
            </p>
          </div>
        )}

        {/* ========================================================
            ARTICLE BODY (Formatted Gutenberg Content)
           ======================================================== */}
        <article className="bg-white rounded-2xl p-6 sm:p-10 border border-stone-200 shadow-xs space-y-6">
          <div className="prose prose-stone max-w-none text-stone-800 text-base leading-relaxed space-y-6">
            {renderMarkdown(post.content)}
          </div>

          {/* Tags Cloud */}
          {post.tags && post.tags.length > 0 && (
            <div className="pt-6 border-t border-stone-100 flex items-center gap-2 flex-wrap">
              <TagIcon className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-xs font-bold text-stone-500">Tags:</span>
              {post.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs px-2.5 py-1 rounded-md font-medium transition cursor-pointer border border-stone-200/60"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Social Share & Engagement Bar */}
          <div className="pt-6 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleLike}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                  hasLiked 
                    ? 'bg-rose-50 border-rose-200 text-rose-600' 
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-600' : ''}`} />
                <span>{likes} Likes</span>
              </button>

              <button
                onClick={() => setBookmarked(!bookmarked)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                  bookmarked 
                    ? 'bg-blue-50 border-blue-200 text-[#2271b1]' 
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-[#2271b1]' : ''}`} />
                <span>{bookmarked ? 'Saved' : 'Save'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-400 font-semibold">Share:</span>
              <button
                onClick={handleShare}
                className="p-2 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-600 transition cursor-pointer"
                title="Copy Link"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              </button>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' ' + window.location.href)}`}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition"
              >
                WhatsApp
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1.5 rounded-lg bg-[#0077b5] hover:bg-[#005582] text-white font-semibold transition"
              >
                LinkedIn
              </a>
            </div>

          </div>

        </article>

        {/* ========================================================
            POST NAVIGATION (Previous / Next Post)
           ======================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prevPost ? (
            <div
              onClick={() => onSelectPost && onSelectPost(prevPost)}
              className="bg-white hover:bg-stone-50 p-4 rounded-xl border border-stone-200 shadow-xs transition cursor-pointer space-y-1 group"
            >
              <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1 group-hover:text-[#2271b1] transition">
                <span>&larr; Previous Post</span>
              </div>
              <div className="text-xs font-bold text-stone-900 line-clamp-1 group-hover:text-[#2271b1] transition">
                {prevPost.title}
              </div>
            </div>
          ) : <div />}

          {nextPost ? (
            <div
              onClick={() => onSelectPost && onSelectPost(nextPost)}
              className="bg-white hover:bg-stone-50 p-4 rounded-xl border border-stone-200 shadow-xs transition cursor-pointer space-y-1 text-right group"
            >
              <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center justify-end gap-1 group-hover:text-[#2271b1] transition">
                <span>Next Post &rarr;</span>
              </div>
              <div className="text-xs font-bold text-stone-900 line-clamp-1 group-hover:text-[#2271b1] transition">
                {nextPost.title}
              </div>
            </div>
          ) : <div />}
        </div>

        {/* ========================================================
            INTERACTIVE COMMENTS SECTION (Leave a Reply)
           ======================================================== */}
        <section className="bg-white rounded-2xl p-6 sm:p-10 border border-stone-200 shadow-xs space-y-8">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <h3 className="font-display font-bold text-lg text-stone-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#2271b1]" />
              <span>{comments.length} Thoughts on "{post.title}"</span>
            </h3>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-4 pb-6 border-b border-stone-100 last:border-0 last:pb-0">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${comment.avatarBg} text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs`}>
                  {comment.author.charAt(0)}
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-xs text-stone-900">{comment.author}</div>
                    <div className="text-[10px] text-stone-400">{comment.date}</div>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-3.5 rounded-xl border border-stone-100">
                    {comment.text}
                  </p>
                  <button className="text-[11px] text-[#2271b1] font-semibold hover:underline cursor-pointer">
                    Reply
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Leave a Comment Form */}
          <div className="pt-6 border-t border-stone-200 space-y-4">
            <h4 className="font-bold text-sm text-stone-900">Leave a Reply</h4>
            <p className="text-xs text-stone-500">Your email address will not be published. Required fields are marked *</p>

            {commentSubmitted && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Thank you! Your comment has been posted successfully.</span>
              </div>
            )}

            <form onSubmit={handleAddComment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Comment *</label>
                <textarea
                  rows={4}
                  required
                  value={newCommentText}
                  onChange={e => setNewCommentText(e.target.value)}
                  placeholder="Type your response here..."
                  className="w-full border border-stone-200 rounded-xl p-3 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#2271b1] focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={newCommentName}
                    onChange={e => setNewCommentName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#2271b1]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={newCommentEmail}
                    onChange={e => setNewCommentEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#2271b1]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-[#2271b1] hover:bg-[#135e96] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
              >
                Post Comment
              </button>
            </form>
          </div>
        </section>

        {/* ========================================================
            RELATED POSTS (Grid of 3 cards)
           ======================================================== */}
        {relatedPosts.length > 0 && (
          <div className="pt-6 space-y-4">
            <h3 className="font-display font-bold text-lg text-stone-900">
              Related Articles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedPosts.map(rel => (
                <div
                  key={rel.id}
                  onClick={() => onSelectPost && onSelectPost(rel)}
                  className="bg-white hover:shadow-md p-3.5 rounded-2xl border border-stone-200 transition cursor-pointer space-y-3 group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="h-32 rounded-xl overflow-hidden bg-stone-100">
                      <SmartImage
                        src={rel.image}
                        altContext={{ title: rel.title, category: rel.category, type: 'blog' }}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-[#2271b1] uppercase tracking-wider">
                      {rel.category}
                    </span>
                    <h4 className="font-bold text-xs text-stone-900 group-hover:text-[#2271b1] transition line-clamp-2 leading-snug">
                      {rel.title}
                    </h4>
                  </div>
                  <span className="text-[11px] text-[#2271b1] font-semibold inline-flex items-center gap-1">
                    Read article &rarr;
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 mt-16 py-8 text-center text-xs text-stone-400">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <p>© {new Date().getFullYear()} KinderBee Integrated Partnership System (KIPS). All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};
