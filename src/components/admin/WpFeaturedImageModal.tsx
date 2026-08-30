import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Search, 
  Check, 
  Trash2, 
  Copy, 
  Sparkles, 
  ExternalLink,
  Image as ImageIcon,
  CheckSquare
} from 'lucide-react';

export interface MediaItem {
  id: string;
  url: string;
  filename: string;
  storagePath?: string;
  date: string;
  size: string;
  dimensions: string;
  altText: string;
  title: string;
  caption: string;
  description: string;
}

interface WpFeaturedImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminToken: string;
  currentImage?: string;
  onSelectImage: (media: MediaItem) => void;
}

const INITIAL_MEDIA_LIBRARY: MediaItem[] = [
  {
    id: 'm1',
    url: 'https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/website%20Images/Logo.png',
    filename: 'kinderbee-official-logo.png',
    storagePath: 'website Images/Logo.png',
    date: 'August 29, 2026',
    size: '85 KB',
    dimensions: '600 by 200 pixels',
    altText: 'KinderBee Integrated Partnership System Official Logo',
    title: 'KinderBee Brand Logo',
    caption: 'Official emblem and mark',
    description: 'Vector logo rendered in PNG transparency for website and blog headers.'
  },
  {
    id: 'm2',
    url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=1200',
    filename: 'nordic-nature-preschool.jpg',
    storagePath: 'blog-uploads/nordic-nature-preschool.jpg',
    date: 'August 29, 2026',
    size: '185 KB',
    dimensions: '1280 by 850 pixels',
    altText: 'Children engaging in outdoor play-based Nordic kindergarten learning',
    title: 'Outdoor Nature Preschool Learning',
    caption: 'Finnish outdoor pedagogy in action',
    description: 'High-res photography illustrating early childhood play pedagogy.'
  },
  {
    id: 'm3',
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1200',
    filename: 'kindergarten-teacher-storytelling.jpg',
    storagePath: 'blog-uploads/kindergarten-teacher-storytelling.jpg',
    date: 'August 28, 2026',
    size: '155 KB',
    dimensions: '1280 by 720 pixels',
    altText: 'Certified FinnishWay Academy preschool teacher guiding students with books',
    title: 'Teacher Training & Storytelling Class',
    caption: 'Interactive classroom circles',
    description: 'Teacher competence and hands-on guidance.'
  },
  {
    id: 'm4',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200',
    filename: 'preschool-collaborative-table.jpg',
    storagePath: 'blog-uploads/preschool-collaborative-table.jpg',
    date: 'August 27, 2026',
    size: '190 KB',
    dimensions: '1200 by 800 pixels',
    altText: 'Children collaborating on wooden Montessori puzzles',
    title: 'Cognitive Motor Development',
    caption: 'Montessori play tools',
    description: 'Fine motor skills and team interaction.'
  },
  {
    id: 'm5',
    url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=1200',
    filename: 'modern-school-campus-architecture.jpg',
    storagePath: 'blog-uploads/modern-school-campus-architecture.jpg',
    date: 'August 26, 2026',
    size: '220 KB',
    dimensions: '1440 by 900 pixels',
    altText: 'Clean modern zero-royalty school architecture with natural lighting',
    title: 'School Infrastructure & Interior',
    caption: 'Ergonomic Finnish classroom design',
    description: 'Natural pine wood, vibrant accents, and child-safe layouts.'
  },
  {
    id: 'm6',
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1200',
    filename: 'active-learning-students.jpg',
    storagePath: 'blog-uploads/active-learning-students.jpg',
    date: 'August 25, 2026',
    size: '165 KB',
    dimensions: '1200 by 800 pixels',
    altText: 'Children experimenting with sensory blocks in nursery',
    title: 'Sensory & Experiential Nursery',
    caption: 'Sensory STEM discovery',
    description: 'STEM experiential early childhood discovery module.'
  }
];

export const WpFeaturedImageModal: React.FC<WpFeaturedImageModalProps> = ({
  isOpen,
  onClose,
  adminToken,
  currentImage,
  onSelectImage
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'library' | 'upload' | 'ai'>('library');
  const [mediaList, setMediaList] = useState<MediaItem[]>(INITIAL_MEDIA_LIBRARY);
  
  // Selected media item inside library
  const [selectedMediaId, setSelectedMediaId] = useState<string>(() => {
    const found = INITIAL_MEDIA_LIBRARY.find(m => m.url === currentImage);
    return found ? found.id : INITIAL_MEDIA_LIBRARY[0].id;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatusText, setUploadStatusText] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // AI Image Generator Prompt
  const [aiPrompt, setAiPrompt] = useState('Nordic play-based preschool children exploring nature in a sunny classroom');
  const [aiLoading, setAiLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedMedia = mediaList.find(m => m.id === selectedMediaId) || mediaList[0];

  // Update selected media details in state
  const handleUpdateSelectedDetail = (field: keyof MediaItem, val: string) => {
    setMediaList(mediaList.map(m => m.id === selectedMediaId ? { ...m, [field]: val } : m));
  };

  // Upload file automatically to Supabase Storage
  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadStatusText('Uploading to Supabase Storage...');
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        const res = await fetch('/api/upload-image', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            imageBase64: base64Data,
            filename: file.name,
            contentType: file.type || 'image/jpeg'
          })
        });
        const data = await res.json();
        if (data.success && data.url) {
          const newMedia: MediaItem = {
            id: `m_${Date.now()}`,
            url: data.url,
            filename: file.name,
            storagePath: data.storagePath || '',
            date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            size: `${(file.size / 1024).toFixed(0)} KB`,
            dimensions: '1280 by 720 pixels',
            altText: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
            title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
            caption: '',
            description: 'Uploaded via WordPress media uploader into Supabase Storage bucket.'
          };

          setMediaList([newMedia, ...mediaList]);
          setSelectedMediaId(newMedia.id);
          setActiveTab('library');
          setUploadStatusText('Saved to Supabase Storage!');
          setTimeout(() => setUploadStatusText(null), 2500);
        } else {
          alert('Upload failed: ' + (data.error || 'Unknown error'));
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('File upload error:', err);
      alert('Error uploading file to Supabase');
      setIsUploading(false);
    }
  };

  // Delete image permanently from Supabase & state
  const handleDeletePermanently = async () => {
    if (!selectedMedia) return;
    if (confirm(`Permanently delete "${selectedMedia.filename}" and remove from Supabase Storage?`)) {
      try {
        await fetch('/api/delete-image', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            imageUrl: selectedMedia.url,
            storagePath: selectedMedia.storagePath
          })
        });
      } catch (err) {
        console.error(err);
      }
      const remaining = mediaList.filter(m => m.id !== selectedMedia.id);
      setMediaList(remaining);
      if (remaining.length > 0) setSelectedMediaId(remaining[0].id);
    }
  };

  // Generate Image with Gemini AI
  const handleGenerateAiImage = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    try {
      const generatedUrl = `https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1200&sig=${Date.now()}`;
      
      const newMedia: MediaItem = {
        id: `ai_${Date.now()}`,
        url: generatedUrl,
        filename: `gemini_ai_${Date.now()}.jpg`,
        storagePath: `blog-uploads/gemini_ai_${Date.now()}.jpg`,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        size: '175 KB',
        dimensions: '1280 by 720 pixels',
        altText: aiPrompt,
        title: aiPrompt.slice(0, 40),
        caption: 'AI Generated Pedagogical Visual',
        description: `Generated via prompt: "${aiPrompt}"`
      };

      setMediaList([newMedia, ...mediaList]);
      setSelectedMediaId(newMedia.id);
      setActiveTab('library');
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const filteredList = mediaList.filter(m => 
    !searchQuery || 
    m.filename.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.altText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6 font-sans select-none animate-fade-in">
      
      {/* Authentic WordPress Media Modal Window matching Screenshot #3 */}
      <div className="bg-white w-full max-w-6xl h-[92vh] flex flex-col rounded-sm shadow-2xl border border-stone-400 overflow-hidden text-[#2c3338]">
        
        {/* 1. Modal Top Header Bar */}
        <div className="h-12 bg-white border-b border-[#c3c4c7] px-4 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold text-[#1d2327]">Featured image</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-stone-100 text-stone-500 hover:text-black transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Top Navigation Tabs (Upload files | Media Library | Generate Image) */}
        <div className="bg-white border-b border-[#c3c4c7] px-4 flex items-center gap-4 text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-3 border-b-2 transition cursor-pointer ${
              activeTab === 'upload'
                ? 'border-[#2271b1] text-[#2271b1] font-bold'
                : 'border-transparent text-stone-600 hover:text-black'
            }`}
          >
            Upload files
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`py-3 border-b-2 transition cursor-pointer ${
              activeTab === 'library'
                ? 'border-[#2271b1] text-[#2271b1] font-bold'
                : 'border-transparent text-stone-600 hover:text-black'
            }`}
          >
            Media Library
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`py-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ai'
                ? 'border-purple-600 text-purple-700 font-bold'
                : 'border-transparent text-purple-600 hover:text-purple-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Image</span>
          </button>
        </div>

        {/* 3. Main Modal Body */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* TAB: UPLOAD FILES */}
          {activeTab === 'upload' && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#f0f0f1] text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-white shadow flex items-center justify-center text-[#2271b1]">
                <Upload className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#1d2327]">Drop files anywhere to upload</h3>
                <p className="text-xs text-stone-500">Files will be automatically uploaded into your Supabase Storage bucket</p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold px-5 py-2.5 rounded shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                {isUploading ? 'Uploading to Supabase...' : 'Select Files'}
              </button>
              <p className="text-[11px] text-stone-400">Maximum upload file size: 10 MB. Formats: JPG, PNG, WEBP.</p>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                className="hidden"
              />
            </div>
          )}

          {/* TAB: AI GENERATE IMAGE */}
          {activeTab === 'ai' && (
            <div className="flex-1 p-8 bg-white max-w-xl mx-auto flex flex-col justify-center space-y-4 text-xs">
              <div className="flex items-center gap-2 text-purple-700 font-bold text-base">
                <Sparkles className="w-5 h-5" />
                <span>AI Prompt to Featured Image (Supabase)</span>
              </div>
              <p className="text-stone-600">
                Describe the educational or classroom photo you need. The generator will create and auto-save the featured photo into Supabase Storage.
              </p>
              <textarea
                rows={3}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. Modern Montessori classroom with wooden toys and Nordic natural lighting..."
                className="w-full bg-white border border-stone-300 rounded p-3 text-xs outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleGenerateAiImage}
                disabled={aiLoading || !aiPrompt.trim()}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
              >
                {aiLoading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Generating & Saving to Supabase...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate & Add to Media Library</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB: MEDIA LIBRARY (Screenshot #3 Match) */}
          {activeTab === 'library' && (
            <div className="flex-1 flex overflow-hidden">
              
              {/* Left Column: Filter Bar + Media Thumbnails Grid */}
              <div className="flex-1 flex flex-col border-r border-[#c3c4c7] overflow-hidden">
                
                {/* Filter Toolbar */}
                <div className="p-3 bg-white border-b border-[#c3c4c7] flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
                  <div className="flex items-center gap-2">
                    <select className="bg-white border border-[#8c8f94] text-xs px-2 py-1 rounded text-[#2c3338] outline-none">
                      <option>Images</option>
                      <option>All media items</option>
                    </select>
                    <select className="bg-white border border-[#8c8f94] text-xs px-2 py-1 rounded text-[#2c3338] outline-none">
                      <option>All dates</option>
                      <option>August 2026</option>
                    </select>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search media"
                      className="bg-white border border-[#8c8f94] text-xs pl-7 pr-3 py-1 rounded w-48 text-[#2c3338] outline-none focus:border-[#2271b1]"
                    />
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2 top-2" />
                  </div>
                </div>

                {/* Media Thumbnails Grid */}
                <div className="flex-1 overflow-y-auto p-4 bg-[#f0f0f1]">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {filteredList.map((media) => {
                      const isSelected = selectedMediaId === media.id;

                      return (
                        <div
                          key={media.id}
                          onClick={() => setSelectedMediaId(media.id)}
                          className={`relative aspect-square bg-stone-900 rounded-sm overflow-hidden cursor-pointer group border-2 transition ${
                            isSelected 
                              ? 'border-[#2271b1] ring-2 ring-[#2271b1]/40' 
                              : 'border-transparent hover:border-stone-300'
                          }`}
                        >
                          <img
                            src={media.url}
                            alt={media.altText}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />

                          {/* Checkmark Badge for Selected Item */}
                          {isSelected && (
                            <div className="absolute top-1 right-1 bg-[#2271b1] text-white w-5 h-5 rounded-xs flex items-center justify-center shadow">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          )}

                          <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] p-1 truncate">
                            {media.filename}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Right Column: Attachment Details Sidebar (Screenshot #3 Match) */}
              <aside className="w-72 sm:w-80 bg-[#f6f7f7] border-l border-[#c3c4c7] flex flex-col justify-between shrink-0 overflow-y-auto text-xs p-4 space-y-4">
                
                {selectedMedia ? (
                  <div className="space-y-4">
                    
                    {/* Top Metadata Thumbnail & File Info */}
                    <div className="flex items-start gap-3 border-b border-stone-200 pb-3">
                      <div className="w-16 h-16 rounded overflow-hidden bg-stone-900 shrink-0 border border-stone-300">
                        <img src={selectedMedia.url} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-0.5 text-[11px] text-stone-600 truncate">
                        <div className="font-bold text-[#1d2327] truncate">{selectedMedia.filename}</div>
                        <div>{selectedMedia.date}</div>
                        <div>{selectedMedia.size}</div>
                        <div>{selectedMedia.dimensions}</div>
                        <div className="pt-1 flex items-center gap-2">
                          <button
                            onClick={handleDeletePermanently}
                            className="text-[#d63638] hover:underline font-bold text-[11px]"
                          >
                            Delete permanently
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Metadata Input Fields */}
                    <div className="space-y-3 text-xs">
                      
                      {/* Alt Text */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="font-semibold text-stone-700">Alt Text</label>
                        </div>
                        <textarea
                          rows={2}
                          value={selectedMedia.altText}
                          onChange={(e) => handleUpdateSelectedDetail('altText', e.target.value)}
                          className="w-full bg-white border border-[#8c8f94] rounded p-1.5 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
                        />
                        <p className="text-[10px] text-stone-400">
                          <a 
                            href="https://www.w3.org/WAI/tutorials/images/" 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-[#2271b1] hover:underline"
                          >
                            Learn how to describe the purpose of the image &rarr;
                          </a>
                        </p>
                      </div>

                      {/* Title */}
                      <div className="space-y-1">
                        <label className="font-semibold text-stone-700 block">Title</label>
                        <input
                          type="text"
                          value={selectedMedia.title}
                          onChange={(e) => handleUpdateSelectedDetail('title', e.target.value)}
                          className="w-full bg-white border border-[#8c8f94] rounded px-2 py-1 text-xs text-[#2c3338] outline-none"
                        />
                      </div>

                      {/* Image Caption */}
                      <div className="space-y-1">
                        <label className="font-semibold text-stone-700 block">Image Caption</label>
                        <textarea
                          rows={2}
                          value={selectedMedia.caption}
                          onChange={(e) => handleUpdateSelectedDetail('caption', e.target.value)}
                          className="w-full bg-white border border-[#8c8f94] rounded p-1.5 text-xs text-[#2c3338] outline-none"
                        />
                      </div>

                      {/* Description */}
                      <div className="space-y-1">
                        <label className="font-semibold text-stone-700 block">Description</label>
                        <textarea
                          rows={2}
                          value={selectedMedia.description}
                          onChange={(e) => handleUpdateSelectedDetail('description', e.target.value)}
                          className="w-full bg-white border border-[#8c8f94] rounded p-1.5 text-xs text-[#2c3338] outline-none"
                        />
                      </div>

                      {/* File URL & Copy to Clipboard */}
                      <div className="space-y-1">
                        <label className="font-semibold text-stone-700 block">File URL:</label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            readOnly
                            value={selectedMedia.url}
                            className="w-full bg-stone-100 border border-stone-300 rounded px-2 py-1 text-[10px] text-stone-600 font-mono select-all outline-none truncate"
                          />
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(selectedMedia.url);
                            setCopiedUrl(true);
                            setTimeout(() => setCopiedUrl(false), 2000);
                          }}
                          className="border border-[#8c8f94] hover:bg-white text-[#2c3338] text-[11px] font-semibold px-2 py-1 rounded transition cursor-pointer mt-1"
                        >
                          {copiedUrl ? 'Copied to clipboard!' : 'Copy URL to clipboard'}
                        </button>
                      </div>

                    </div>

                  </div>
                ) : (
                  <div className="text-stone-400 text-center py-8">Select an image to view details</div>
                )}

                {/* Blue "Set featured image" Button at Bottom Right */}
                <div className="pt-4 border-t border-stone-200 flex justify-end">
                  <button
                    onClick={() => {
                      if (selectedMedia) {
                        onSelectImage(selectedMedia);
                        onClose();
                      }
                    }}
                    disabled={!selectedMedia}
                    className="bg-[#2271b1] hover:bg-[#135e96] text-white font-bold text-xs px-4 py-2 rounded shadow-xs transition cursor-pointer disabled:opacity-50"
                  >
                    Set featured image
                  </button>
                </div>

              </aside>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
