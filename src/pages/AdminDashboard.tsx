import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, FileText, Settings, BarChart3, HelpCircle, LogOut, Sparkles, CheckCircle2, Trash2, Edit, Plus, X, Send, Mail, Phone, MapPin } from 'lucide-react';
import { Enquiry, BlogPost, FAQItem, SystemSettings } from '../types';

interface AdminDashboardProps {
  adminToken: string;
  onLogout: () => void;
  settings: SystemSettings | null;
  onUpdateSettings: (newSettings: SystemSettings) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ adminToken, onLogout, settings: initialSettings, onUpdateSettings }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'enquiries' | 'blogs' | 'faqs' | 'settings'>('analytics');

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [settingsForm, setSettingsForm] = useState<SystemSettings>(initialSettings || {
    phone: '', email: '', officeAddress: '', whatsappNumber: '', facebookUrl: '', linkedinUrl: '', instagramUrl: '', workingHours: ''
  });

  // AI Email Draft Modal State
  const [selectedEnquiryForEmail, setSelectedEnquiryForEmail] = useState<Enquiry | null>(null);
  const [emailDraftText, setEmailDraftText] = useState('');
  const [emailDraftLoading, setEmailDraftLoading] = useState(false);

  // Blog CRUD state
  const [isEditingBlog, setIsEditingBlog] = useState(false);
  const [currentBlogForm, setCurrentBlogForm] = useState<Partial<BlogPost>>({});

  // FAQ CRUD state
  const [isEditingFaq, setIsEditingFaq] = useState(false);
  const [currentFaqForm, setCurrentFaqForm] = useState<Partial<FAQItem>>({});

  const headers = { 'Authorization': `Bearer ${adminToken}`, 'Content-Type': 'application/json' };

  const fetchData = async () => {
    try {
      const [enqRes, blogRes, faqRes, analyticsRes] = await Promise.all([
        fetch('/api/enquiries', { headers }),
        fetch('/api/blogs'),
        fetch('/api/faqs'),
        fetch('/api/analytics', { headers })
      ]);

      if (enqRes.ok) setEnquiries(await enqRes.json());
      if (blogRes.ok) setBlogs(await blogRes.json());
      if (faqRes.ok) setFaqs(await faqRes.json());
      if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update Enquiry Status or Notes
  const handleUpdateEnquiry = async (id: string, updates: { status?: string; notes?: string }) => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (data.success) {
        setEnquiries(enquiries.map(e => e.id === id ? data.enquiry : e));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry record?')) return;
    try {
      const res = await fetch(`/api/enquiries/${id}`, { method: 'DELETE', headers });
      if (res.ok) {
        setEnquiries(enquiries.filter(e => e.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Generate AI Email Reply
  const handleGenerateAiEmail = async (enquiry: Enquiry) => {
    setSelectedEnquiryForEmail(enquiry);
    setEmailDraftLoading(true);
    setEmailDraftText('');
    try {
      const res = await fetch('/api/ai/suggest-reply', {
        method: 'POST',
        headers,
        body: JSON.stringify({ enquiryId: enquiry.id })
      });
      const data = await res.json();
      if (data.success) {
        setEmailDraftText(data.emailDraft);
      } else {
        setEmailDraftText('Failed to generate AI email draft.');
      }
    } catch (err) {
      console.error(err);
      setEmailDraftText('Network error while generating email draft.');
    } finally {
      setEmailDraftLoading(false);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers,
        body: JSON.stringify(settingsForm)
      });
      const data = await res.json();
      if (data.success) {
        onUpdateSettings(data.settings);
        alert('System settings updated successfully!');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating settings.');
    }
  };

  // Save Blog
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = currentBlogForm.id && blogs.some(b => b.id === currentBlogForm.id) ? 'PUT' : 'POST';
    const url = method === 'PUT' ? `/api/blogs/${currentBlogForm.id}` : '/api/blogs';

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(currentBlogForm)
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        setIsEditingBlog(false);
        setCurrentBlogForm({});
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Delete this blog post?')) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE', headers });
      if (res.ok) {
        setBlogs(blogs.filter(b => b.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Save FAQ
  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = currentFaqForm.id && faqs.some(f => f.id === currentFaqForm.id) ? 'PUT' : 'POST';
    const url = method === 'PUT' ? `/api/faqs/${currentFaqForm.id}` : '/api/faqs';

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(currentFaqForm)
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        setIsEditingFaq(false);
        setCurrentFaqForm({});
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm('Delete this FAQ item?')) return;
    try {
      const res = await fetch(`/api/faqs/${id}`, { method: 'DELETE', headers });
      if (res.ok) {
        setFaqs(faqs.filter(f => f.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      
      {/* Admin Header */}
      <div className="bg-stone-900 text-white p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#E1007A] flex items-center justify-center text-white font-bold text-2xl shadow">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-block bg-white/10 text-pink-300 text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1">
              Secure Administration
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold">KinderBee Control Panel</h1>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="bg-stone-800 hover:bg-red-600 text-stone-200 hover:text-white px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out Admin</span>
        </button>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-4">
        {[
          { id: 'analytics', label: 'Analytics & Pipeline', icon: BarChart3 },
          { id: 'enquiries', label: `Enquiries (${enquiries.length})`, icon: Users },
          { id: 'blogs', label: `Blog Posts (${blogs.length})`, icon: FileText },
          { id: 'faqs', label: `FAQs (${faqs.length})`, icon: HelpCircle },
          { id: 'settings', label: 'System Settings', icon: Settings },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
                isActive 
                  ? 'bg-[#E1007A] text-white shadow-md' 
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ANALYTICS */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-8 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Total Leads Received</span>
              <div className="text-3xl font-display font-black text-stone-900">{analytics.totalLeads}</div>
              <div className="text-xs text-emerald-600 font-medium pt-1">+{analytics.pendingLeads} pending review</div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Estimated Revenue Potential</span>
              <div className="text-3xl font-display font-black text-[#E1007A]">{analytics.estimatedRevenuePotential}</div>
              <div className="text-xs text-stone-500 font-medium pt-1">Based on active budget brackets</div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Total Blog Articles</span>
              <div className="text-3xl font-display font-black text-stone-900">{analytics.totalBlogs}</div>
              <div className="text-xs text-stone-500 font-medium pt-1">Published insights online</div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Reviewed Leads</span>
              <div className="text-3xl font-display font-black text-amber-600">{analytics.reviewedLeads}</div>
              <div className="text-xs text-stone-500 font-medium pt-1">In active consultation</div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
            <h3 className="font-display font-bold text-xl text-stone-900">Leads Breakdown by Partnership Category</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {analytics.leadsByType?.map((item: any) => (
                <div key={item.name} className="bg-stone-50 p-5 rounded-2xl border border-stone-100 space-y-2">
                  <div className="text-xs text-stone-500 font-semibold">{item.name}</div>
                  <div className="text-2xl font-display font-black text-stone-900">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ENQUIRIES */}
      {activeTab === 'enquiries' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-bold text-xl text-stone-900">All Incoming Partnership Enquiries</h3>
            <span className="text-xs bg-pink-50 text-[#E1007A] font-bold px-3 py-1 rounded-full">{enquiries.length} Total Leads</span>
          </div>

          <div className="space-y-4">
            {enquiries.map(enq => (
              <div key={enq.id} className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-100 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-lg text-stone-900">{enq.fields.name}</span>
                      <span className="text-xs font-semibold bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-full uppercase">{enq.type}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500">
                      <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{enq.fields.email}</span>
                      <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{enq.fields.phone}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{enq.fields.city || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={enq.status}
                      onChange={e => handleUpdateEnquiry(enq.id, { status: e.target.value })}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${
                        enq.status === 'pending' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                        enq.status === 'reviewed' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                        enq.status === 'contacted' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                        'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed / Won</option>
                    </select>

                    <button
                      onClick={() => handleDeleteEnquiry(enq.id)}
                      className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition"
                      title="Delete Enquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="bg-stone-50 p-3 rounded-xl">
                    <span className="text-stone-400 font-semibold block mb-0.5">Budget / Investment</span>
                    <span className="font-bold text-stone-900">{enq.fields.budget || 'Not Specified'}</span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl">
                    <span className="text-stone-400 font-semibold block mb-0.5">Partnership Model</span>
                    <span className="font-bold text-stone-900">{enq.fields.partnershipModel || enq.fields.courseOfInterest || 'General'}</span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl">
                    <span className="text-stone-400 font-semibold block mb-0.5">Submitted Date</span>
                    <span className="font-bold text-stone-900">{new Date(enq.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {enq.fields.message && (
                  <div className="text-xs text-stone-600 bg-stone-50/50 p-3 rounded-xl border border-stone-100">
                    <span className="font-bold text-stone-700 block mb-1">Message:</span>
                    {enq.fields.message}
                  </div>
                )}

                {/* AI Lead Summary */}
                {enq.aiSummary && (
                  <div className="bg-pink-50 border border-pink-100 p-4 rounded-2xl space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#E1007A] uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Strategic Lead Assessment</span>
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed font-medium">
                      {enq.aiSummary}
                    </p>
                  </div>
                )}

                {/* Notes & AI Email Action */}
                <div className="pt-2 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <input
                    type="text"
                    value={enq.notes || ''}
                    placeholder="Add internal advisor notes here..."
                    onChange={e => {
                      const val = e.target.value;
                      setEnquiries(enquiries.map(item => item.id === enq.id ? { ...item, notes: val } : item));
                    }}
                    onBlur={e => handleUpdateEnquiry(enq.id, { notes: e.target.value })}
                    className="w-full sm:w-1/2 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A]"
                  />

                  <button
                    onClick={() => handleGenerateAiEmail(enq)}
                    className="w-full sm:w-auto bg-[#E1007A] hover:bg-pink-700 text-white font-medium px-4 py-2 rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate AI Email Reply</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: BLOGS */}
      {activeTab === 'blogs' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-bold text-xl text-stone-900">Manage Insights & Blog Articles</h3>
            <button
              onClick={() => {
                setCurrentBlogForm({ title: '', category: 'Nordic Education', excerpt: '', content: '', image: '', author: 'KinderBee Editorial' });
                setIsEditingBlog(true);
              }}
              className="bg-[#E1007A] hover:bg-pink-700 text-white font-medium px-4 py-2.5 rounded-xl text-xs transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Article</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map(blog => (
              <div key={blog.id} className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold bg-pink-50 text-[#E1007A] px-2.5 py-1 rounded-full uppercase">{blog.category}</span>
                  <h4 className="font-display font-bold text-base text-stone-900 line-clamp-2">{blog.title}</h4>
                  <p className="text-xs text-stone-500 line-clamp-2">{blog.excerpt}</p>
                </div>
                <div className="pt-4 border-t border-stone-100 flex justify-between items-center text-xs">
                  <span className="text-stone-400">{blog.views || 0} views</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setCurrentBlogForm(blog);
                        setIsEditingBlog(true);
                      }}
                      className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 transition"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBlog(blog.id)}
                      className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: FAQS */}
      {activeTab === 'faqs' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-bold text-xl text-stone-900">Manage FAQ Items</h3>
            <button
              onClick={() => {
                setCurrentFaqForm({ question: '', answer: '', section: 'home' });
                setIsEditingFaq(true);
              }}
              className="bg-[#E1007A] hover:bg-pink-700 text-white font-medium px-4 py-2.5 rounded-xl text-xs transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="space-y-4">
            {faqs.map(faq => (
              <div key={faq.id} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-stone-900 text-sm">{faq.question}</h4>
                  <p className="text-xs text-stone-600">{faq.answer}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setCurrentFaqForm(faq);
                      setIsEditingFaq(true);
                    }}
                    className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 transition"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteFaq(faq.id)}
                    className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xs max-w-2xl mx-auto space-y-6 animate-fadeIn">
          <div className="space-y-1">
            <h3 className="font-display font-bold text-xl text-stone-900">System Contact & Brand Settings</h3>
            <p className="text-xs text-stone-500">Update corporate phone, email, and social links displayed across the portal.</p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">Contact Phone</label>
              <input
                type="text"
                value={settingsForm.phone || ''}
                onChange={e => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">Support Email</label>
              <input
                type="email"
                value={settingsForm.email || ''}
                onChange={e => setSettingsForm({ ...settingsForm, email: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">Office Address</label>
              <input
                type="text"
                value={settingsForm.officeAddress || ''}
                onChange={e => setSettingsForm({ ...settingsForm, officeAddress: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">WhatsApp Number</label>
              <input
                type="text"
                value={settingsForm.whatsappNumber || ''}
                onChange={e => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#E1007A] hover:bg-pink-700 text-white font-medium py-3 rounded-xl transition text-sm"
            >
              Save Settings
            </button>
          </form>
        </div>
      )}

      {/* AI Email Draft Modal */}
      {selectedEnquiryForEmail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative border border-stone-100 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-xs font-bold text-[#E1007A] uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Gemini AI Suggested Email Response</span>
              </div>
              <button 
                onClick={() => setSelectedEnquiryForEmail(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {emailDraftLoading ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-8 h-8 border-4 border-[#E1007A] border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-stone-500 font-medium">Generating professional response tailored to {selectedEnquiryForEmail.fields.name}...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <textarea
                  rows={12}
                  value={emailDraftText}
                  onChange={e => setEmailDraftText(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs font-mono text-stone-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#E1007A]"
                ></textarea>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(emailDraftText);
                      alert('Email draft copied to clipboard!');
                    }}
                    className="bg-[#1C1917] hover:bg-stone-800 text-white font-medium px-6 py-2.5 rounded-xl text-xs transition"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Blog Editor Modal */}
      {isEditingBlog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-stone-100 my-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display font-bold text-xl text-stone-900">{currentBlogForm.id ? 'Edit Article' : 'New Article'}</h3>
              <button onClick={() => setIsEditingBlog(false)} className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBlog} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={currentBlogForm.title || ''}
                  onChange={e => setCurrentBlogForm({ ...currentBlogForm, title: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={currentBlogForm.category || ''}
                    onChange={e => setCurrentBlogForm({ ...currentBlogForm, category: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">Author</label>
                  <input
                    type="text"
                    required
                    value={currentBlogForm.author || ''}
                    onChange={e => setCurrentBlogForm({ ...currentBlogForm, author: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">Image URL</label>
                <input
                  type="text"
                  required
                  value={currentBlogForm.image || ''}
                  onChange={e => setCurrentBlogForm({ ...currentBlogForm, image: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">Excerpt</label>
                <textarea
                  rows={2}
                  required
                  value={currentBlogForm.excerpt || ''}
                  onChange={e => setCurrentBlogForm({ ...currentBlogForm, excerpt: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-sm text-stone-900"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">Content (Markdown supported)</label>
                <textarea
                  rows={6}
                  required
                  value={currentBlogForm.content || ''}
                  onChange={e => setCurrentBlogForm({ ...currentBlogForm, content: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-sm text-stone-900 font-mono"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#E1007A] hover:bg-pink-700 text-white font-medium py-3 rounded-xl transition text-sm"
              >
                Save Article
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FAQ Editor Modal */}
      {isEditingFaq && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-stone-100 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-bold text-xl text-stone-900">{currentFaqForm.id ? 'Edit FAQ' : 'New FAQ'}</h3>
              <button onClick={() => setIsEditingFaq(false)} className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">Question</label>
                <input
                  type="text"
                  required
                  value={currentFaqForm.question || ''}
                  onChange={e => setCurrentFaqForm({ ...currentFaqForm, question: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">Answer</label>
                <textarea
                  rows={4}
                  required
                  value={currentFaqForm.answer || ''}
                  onChange={e => setCurrentFaqForm({ ...currentFaqForm, answer: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-sm text-stone-900"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#E1007A] hover:bg-pink-700 text-white font-medium py-3 rounded-xl transition text-sm"
              >
                Save FAQ
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
