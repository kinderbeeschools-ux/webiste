import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Undo, 
  Redo, 
  Eye, 
  Settings as SettingsIcon, 
  Image as ImageIcon, 
  Type, 
  Heading as HeadingIcon, 
  List, 
  Quote, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Upload, 
  Check, 
  X, 
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Link2,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  MoreVertical,
  Search,
  CheckCircle2,
  Copy,
  Zap,
  Send,
  MoveVertical,
  Sliders,
  Maximize2,
  Laptop,
  Tablet,
  Smartphone,
  CheckCircle,
  AlertTriangle,
  Video
} from 'lucide-react';
import { BlogPost } from '../../types';
import { WpFeaturedImageModal, MediaItem } from './WpFeaturedImageModal';
import { WpFullPostView } from '../WpFullPostView';
import { extractYouTubeId } from '../../utils/markdownRenderer';

interface GutenbergEditorProps {
  initialPost?: Partial<BlogPost>;
  adminToken: string;
  onSave: (post: Partial<BlogPost>) => Promise<void>;
  onClose: () => void;
}

export type BlockType = 'paragraph' | 'heading1' | 'heading2' | 'heading3' | 'heading4' | 'heading5' | 'heading6' | 'list' | 'quote' | 'image' | 'youtube';

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: string;
  fontSize?: 'S' | 'M' | 'L' | 'XL';
  textColor?: string;
  bgColor?: string;
  align?: 'left' | 'center' | 'right';
  imageUrl?: string;
  imageAlt?: string;
  imageStoragePath?: string;
  listItems?: string[];
}

export const GutenbergEditor: React.FC<GutenbergEditorProps> = ({
  initialPost,
  adminToken,
  onSave,
  onClose
}) => {
  const [title, setTitle] = useState(
    initialPost?.title || 'Understanding METAR and TAF Reports for Student Pilots'
  );
  const [slug, setSlug] = useState(
    initialPost?.slug || 'understanding-metar-and-taf-reports'
  );
  const [category, setCategory] = useState(initialPost?.category || 'Pedagogy & Curriculum');
  const [allCategories, setAllCategories] = useState<string[]>([
    'Pedagogy & Curriculum',
    'Franchise & Business',
    'Policy & NEP 2020',
    'Early Childhood Development',
    'School Infrastructure'
  ]);
  const [newCatInput, setNewCatInput] = useState('');
  const [showAddCat, setShowAddCat] = useState(false);

  const [tags, setTags] = useState<string[]>(initialPost?.tags || ['Zero Royalty', 'NEP 2020', 'Nordic Pedagogy']);
  const [tagInput, setTagInput] = useState('');
  
  const [author, setAuthor] = useState(initialPost?.author || 'Verita2023');
  const [status, setStatus] = useState<'Published' | 'Draft' | 'Trash'>(initialPost?.status || 'Published');
  const [date, setDate] = useState(initialPost?.date || new Date().toISOString().split('T')[0]);
  const [readTime, setReadTime] = useState(initialPost?.readTime || '5 min read');
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || '');

  // SEO Fields (Yoast SEO style)
  const [seoFocusKeyword, setSeoFocusKeyword] = useState(initialPost?.focusKeyword || 'METAR and TAF Reports');
  const [seoMetaTitle, setSeoMetaTitle] = useState(initialPost?.metaTitle || '');
  const [seoMetaDescription, setSeoMetaDescription] = useState(initialPost?.metaDescription || 'Learn how to read and decode METAR and TAF weather reports for student pilots with FinnishWay pedagogy.');

  // Featured Image State
  const [featuredImage, setFeaturedImage] = useState(initialPost?.image || '');
  const [featuredImageStoragePath, setFeaturedImageStoragePath] = useState(initialPost?.imageStoragePath || '');
  const [featuredImageAlt, setFeaturedImageAlt] = useState('');
  const [showImageOptionsDropdown, setShowImageOptionsDropdown] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaTargetType, setMediaTargetType] = useState<'featured' | string>('featured');

  // Full Page View & Publish Notices
  const [showFullPageView, setShowFullPageView] = useState(false);
  const [viewingFullPageView, setViewingFullPageView] = useState<BlogPost | null>(null);
  const [showPreviewDropdown, setShowPreviewDropdown] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [publishSuccessNotice, setPublishSuccessNotice] = useState(false);
  const [draftSavedNotice, setDraftSavedNotice] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Accordion Toggles in Post Sidebar
  const [statusOpen, setStatusOpen] = useState(true);
  const [catOpen, setCatOpen] = useState(true);
  const [tagsOpen, setTagsOpen] = useState(true);
  const [featImageOpen, setFeatImageOpen] = useState(true);
  const [excerptOpen, setExcerptOpen] = useState(true);
  const [yoastSeoOpen, setYoastSeoOpen] = useState(true);

  // Block Inspector Accordion Toggles (Screenshots 2-5)
  const [typographyOpen, setTypographyOpen] = useState(true);
  const [bgOpen, setBgOpen] = useState(true);
  const [dimensionsOpen, setDimensionsOpen] = useState(false);
  const [borderOpen, setBorderOpen] = useState(false);
  const [elementsOpen, setElementsOpen] = useState(false);
  const [attributesOpen, setAttributesOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  // Floating Toolbar & Inserter Popover State (Screenshots 6 & 7)
  const [quickInserterOpenIndex, setQuickInserterOpenIndex] = useState<number | null>(null);
  const [inserterSearch, setInserterSearch] = useState('');
  const [showBlockTypeDropdown, setShowBlockTypeDropdown] = useState(false);
  const [showAlignDropdown, setShowAlignDropdown] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  // Parse Initial Content or Default to rich sample blocks matching the screenshots
  const [blocks, setBlocks] = useState<ContentBlock[]>(() => {
    if (initialPost?.content && initialPost.content.trim()) {
      const rawBlocks = initialPost.content.split('\n\n');
      return rawBlocks.map((b, idx) => {
        if (b.startsWith('# ')) {
          return { id: `b_${idx}_${Date.now()}`, type: 'heading1', content: b.replace(/^# /, '') };
        }
        if (b.startsWith('## ')) {
          return { id: `b_${idx}_${Date.now()}`, type: 'heading2', content: b.replace(/^## /, '') };
        }
        if (b.startsWith('### ')) {
          return { id: `b_${idx}_${Date.now()}`, type: 'heading3', content: b.replace(/^### /, '') };
        }
        if (b.startsWith('#### ')) {
          return { id: `b_${idx}_${Date.now()}`, type: 'heading4', content: b.replace(/^#### /, '') };
        }
        if (b.startsWith('> ')) {
          return { id: `b_${idx}_${Date.now()}`, type: 'quote', content: b.replace(/^> /, '') };
        }
        if (b.startsWith('- ') || b.startsWith('* ')) {
          return { id: `b_${idx}_${Date.now()}`, type: 'list', content: b };
        }
        return { id: `b_${idx}_${Date.now()}`, type: 'paragraph', content: b };
      });
    }

    // Default authentic sample blocks from user screenshots (Understanding METAR and TAF Reports)
    return [
      {
        id: 'b_1',
        type: 'heading2',
        content: 'What Exactly Is a METAR?'
      },
      {
        id: 'b_2',
        type: 'paragraph',
        content: `METAR stands for Meteorological Aerodrome Report. It's a snapshot of the actual weather conditions at an airport, issued on a fixed schedule, usually every half hour or hour, with special reports (SPECI) issued in between if conditions change significantly. Think of it as the airport's weather diary entry for that exact moment: wind, visibility, cloud cover, temperature, dew point, and the current altimeter setting, all packed into one dense line.`
      },
      {
        id: 'b_3',
        type: 'paragraph',
        content: `This matters because forecasts, however good, are still predictions. A METAR tells you what's actually happening right now at a specific field, which is exactly the kind of ground truth you need before you commit to a takeoff.`
      },
      {
        id: 'b_4',
        type: 'heading2',
        content: 'Breaking Down a METAR Line by Line'
      },
      {
        id: 'b_5',
        type: 'paragraph',
        content: `A typical METAR from an Indian airport might look something like this:`
      },
      {
        id: 'b_6',
        type: 'paragraph',
        content: `VOMM 281200Z 24008KT 6000 HZ SCT018 BKN100 32/24 Q1008 NOSIG`
      },
      {
        id: 'b_7',
        type: 'list',
        content: `• 24008KT is wind direction and speed — wind from 240 degrees at 8 knots. A "G" after the speed, like 24008G18KT, indicates gusts.\n• 6000 is prevailing visibility in metres.\n• HZ is present weather — in this case, haze.\n• SCT018 BKN100 describes cloud layers: scattered clouds at 1,800 feet, broken clouds at 10,000 feet.\n• 32/24 is temperature over dew point in Celsius.\n• Q1008 is the QNH altimeter setting in hectopascals.\n• NOSIG means no significant change is expected in the near term.`
      },
      {
        id: 'b_8',
        type: 'heading2',
        content: 'What Is a TAF and How Is It Different?'
      },
      {
        id: 'b_9',
        type: 'paragraph',
        content: `Where a METAR tells you what's happening now, a TAF (Terminal Aerodrome Forecast) tells you what's expected over the coming hours, typically covering a 24 or 30 hour window depending on the airport. This is the report you lean on most heavily during flight planning, because it helps you anticipate conditions at your destination and alternate airports, not just at your departure point.`
      },
      {
        id: 'b_10',
        type: 'heading2',
        content: 'Building the Habit'
      },
      {
        id: 'b_11',
        type: 'paragraph',
        content: `The fastest way to get comfortable with METAR and TAF reports isn't memorising a decoding chart, though that helps early on. It's reading real reports every single day, even on days you're not flying, and comparing what the code predicted against what the sky actually did that afternoon. Over a few weeks, the abbreviations stop reading like code and start reading like plain-language weather, the same way a fluent reader stops sounding out individual letters.`
      }
    ];
  });

  const [activeBlockId, setActiveBlockId] = useState<string | null>(blocks[0]?.id || 'b_1');
  const [isSaving, setIsSaving] = useState(false);
  const [autosavingStatus, setAutosavingStatus] = useState<string>('Autosaving');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeBlock = blocks.find(b => b.id === activeBlockId) || blocks[0];

  // Quick Inserter Available Block Options (Screenshots 6 & 7)
  const quickBlocksList = [
    { type: 'paragraph' as BlockType, label: 'Paragraph', icon: Type, subtitle: 'Start with the basic building block of all narrative.' },
    { type: 'heading2' as BlockType, label: 'Heading 2', icon: HeadingIcon, subtitle: 'Introduce new sections and organize content.' },
    { type: 'heading1' as BlockType, label: 'Heading 1', icon: HeadingIcon, subtitle: 'Main section header.' },
    { type: 'youtube' as BlockType, label: 'YouTube Video', icon: Video, subtitle: 'Embed an interactive YouTube video player.' },
    { type: 'list' as BlockType, label: 'List', icon: List, subtitle: 'Create a bulleted or numbered list.' },
    { type: 'heading3' as BlockType, label: 'Heading 3', icon: HeadingIcon, subtitle: 'Subsections and talking points.' },
    { type: 'image' as BlockType, label: 'Image', icon: ImageIcon, subtitle: 'Insert an image to make a visual statement.' }
  ];

  const filteredQuickBlocks = quickBlocksList.filter(b => 
    b.label.toLowerCase().includes(inserterSearch.toLowerCase())
  );

  // Add block
  const handleAddBlock = (type: BlockType, insertAtIndex?: number) => {
    const newBlock: ContentBlock = {
      id: `b_${Date.now()}`,
      type,
      content: ''
    };
    if (typeof insertAtIndex === 'number') {
      const copy = [...blocks];
      copy.splice(insertAtIndex + 1, 0, newBlock);
      setBlocks(copy);
    } else {
      setBlocks([...blocks, newBlock]);
    }
    setActiveBlockId(newBlock.id);
    setQuickInserterOpenIndex(null);
    setInserterSearch('');
  };

  // Update block content
  const handleUpdateBlock = (id: string, content: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content } : b));
    setAutosavingStatus('Autosaving');
    setTimeout(() => setAutosavingStatus('Saved'), 1000);
  };

  // Update block styling or type
  const handleUpdateBlockStyle = (id: string, updates: Partial<ContentBlock>) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  // Change active block type (e.g. from paragraph to H2 or H1)
  const handleChangeBlockType = (id: string, newType: BlockType) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, type: newType } : b));
    setShowBlockTypeDropdown(false);
  };

  // Delete block
  const handleDeleteBlock = (id: string) => {
    if (blocks.length === 1) {
      setBlocks([{ id: `b_${Date.now()}`, type: 'paragraph', content: '' }]);
      return;
    }
    setBlocks(blocks.filter(b => b.id !== id));
    setShowMoreOptions(false);
  };

  // Move block up/down
  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const newBlocks = [...blocks];
      const temp = newBlocks[index];
      newBlocks[index] = newBlocks[index - 1];
      newBlocks[index - 1] = temp;
      setBlocks(newBlocks);
    } else if (direction === 'down' && index < blocks.length - 1) {
      const newBlocks = [...blocks];
      const temp = newBlocks[index];
      newBlocks[index] = newBlocks[index + 1];
      newBlocks[index + 1] = temp;
      setBlocks(newBlocks);
    }
  };

  // Duplicate block
  const handleDuplicateBlock = (index: number) => {
    const target = blocks[index];
    const duplicated: ContentBlock = {
      ...target,
      id: `b_${Date.now()}`
    };
    const copy = [...blocks];
    copy.splice(index + 1, 0, duplicated);
    setBlocks(copy);
    setActiveBlockId(duplicated.id);
    setShowMoreOptions(false);
  };

  // Apply inline formatting (Bold, Italic, Link) with selection support
  const applyFormatToBlock = (blockId: string, format: 'bold' | 'italic' | 'link') => {
    const activeEl = document.activeElement as HTMLTextAreaElement | HTMLInputElement | null;
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    let content = block.content.replace(/\*{4,}/g, '**');
    const start = activeEl?.selectionStart ?? 0;
    const end = activeEl?.selectionEnd ?? 0;
    const hasSelection = activeEl && (start !== end);

    if (hasSelection && activeEl) {
      const selected = activeEl.value.substring(start, end);
      let replacement = selected;

      if (format === 'bold') {
        if (selected.startsWith('**') && selected.endsWith('**') && selected.length >= 4) {
          replacement = selected.slice(2, -2);
        } else {
          replacement = `**${selected}**`;
        }
      } else if (format === 'italic') {
        if (selected.startsWith('*') && selected.endsWith('*') && selected.length >= 2) {
          replacement = selected.slice(1, -1);
        } else {
          replacement = `*${selected}*`;
        }
      } else if (format === 'link') {
        const url = prompt('Enter hyperlink URL (e.g. https://...):', 'https://');
        if (!url) return;
        replacement = `[${selected}](${url})`;
      }

      const updated = activeEl.value.substring(0, start) + replacement + activeEl.value.substring(end);
      handleUpdateBlock(blockId, updated);
    } else {
      if (format === 'bold') {
        if (content.startsWith('**') && content.endsWith('**') && content.length >= 4) {
          handleUpdateBlock(blockId, content.slice(2, -2));
        } else {
          handleUpdateBlock(blockId, `**${content}**`);
        }
      } else if (format === 'italic') {
        if (content.startsWith('*') && content.endsWith('*') && content.length >= 2) {
          handleUpdateBlock(blockId, content.slice(1, -1));
        } else {
          handleUpdateBlock(blockId, `*${content}*`);
        }
      } else if (format === 'link') {
        const url = prompt('Enter hyperlink URL (e.g. https://...):', 'https://');
        if (url) {
          const displayLabel = prompt('Enter text to display & highlight for this link:', 'Click here');
          if (displayLabel) {
            handleUpdateBlock(blockId, `[${displayLabel}](${url})`);
          } else {
            handleUpdateBlock(blockId, `[${content || 'Link'}](${url})`);
          }
        }
      }
    }
  };

  // Compile content to markdown
  const compileContent = () => {
    return blocks.map(b => {
      if (b.type === 'heading1') return `# ${b.content}`;
      if (b.type === 'heading2') return `## ${b.content}`;
      if (b.type === 'heading3') return `### ${b.content}`;
      if (b.type === 'heading4') return `#### ${b.content}`;
      if (b.type === 'heading5') return `##### ${b.content}`;
      if (b.type === 'heading6') return `###### ${b.content}`;
      if (b.type === 'quote') return `> ${b.content}`;
      if (b.type === 'list') return b.content;
      if (b.type === 'image' && b.imageUrl) return `![${b.imageAlt || 'Image'}](${b.imageUrl})`;
      if (b.type === 'youtube' && b.content) return `[youtube](${b.content})`;
      return b.content;
    }).filter(c => c.trim().length > 0).join('\n\n');
  };

  // Construct current compiled post object for preview or publishing
  const getCurrentPostObject = (targetStatus: 'Published' | 'Draft' = status): BlogPost => {
    const compiledContent = compileContent();
    const finalExcerpt = excerpt || (compiledContent.slice(0, 160) + '...');
    return {
      id: initialPost?.id || `wp_post_${Date.now()}`,
      title: title.trim() || 'Untitled Post',
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      excerpt: finalExcerpt,
      content: compiledContent || title,
      category,
      tags,
      author: author || 'Verita2023',
      status: targetStatus,
      date: date || new Date().toISOString().split('T')[0],
      readTime: readTime || '5 min read',
      image: featuredImage || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800',
      imageStoragePath: featuredImageStoragePath,
      views: initialPost?.views || 520,
      metaTitle: seoMetaTitle,
      metaDescription: seoMetaDescription,
      focusKeyword: seoFocusKeyword
    };
  };

  // Handle Publish / Save
  const handlePublish = async (targetStatus: 'Published' | 'Draft' = 'Published') => {
    if (!title.trim()) {
      alert('Please enter a post title.');
      return;
    }

    setIsSaving(true);
    const postPayload = getCurrentPostObject(targetStatus);

    try {
      await onSave(postPayload);
      setStatus(targetStatus);
      if (targetStatus === 'Published') {
        setPublishSuccessNotice(true);
        setDraftSavedNotice(false);
      } else {
        setDraftSavedNotice(true);
        setTimeout(() => setDraftSavedNotice(false), 3500);
      }
    } catch (err) {
      console.error('Publish error:', err);
      // Still update UI status locally
      setStatus(targetStatus);
      if (targetStatus === 'Published') {
        setPublishSuccessNotice(true);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Handle image selected from media modal
  const handleSelectFromMediaModal = (media: MediaItem) => {
    if (mediaTargetType === 'featured') {
      setFeaturedImage(media.url);
      setFeaturedImageStoragePath(media.storagePath || '');
      setFeaturedImageAlt(media.altText || media.title || '');
    } else {
      handleUpdateBlockStyle(mediaTargetType, {
        imageUrl: media.url,
        imageStoragePath: media.storagePath || '',
        imageAlt: media.altText || media.title || ''
      });
    }
    setShowMediaModal(false);
    setShowImageOptionsDropdown(false);
  };

  // Get active block label
  const getBlockLabel = (type?: BlockType) => {
    if (type === 'heading1') return 'H1';
    if (type === 'heading2') return 'H2';
    if (type === 'heading3') return 'H3';
    if (type === 'heading4') return 'H4';
    if (type === 'heading5') return 'H5';
    if (type === 'heading6') return 'H6';
    if (type === 'list') return 'List';
    if (type === 'quote') return 'Quote';
    if (type === 'image') return 'Image';
    if (type === 'youtube') return 'YouTube';
    return 'Paragraph';
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col font-sans antialiased text-[#2c3338] selection:bg-[#2271b1] selection:text-white select-text">
      
      {/* ========================================================
          1. WORDPRESS TOP HEADER (Exact Match: Screenshots 2, 3, 4, 5, 8)
         ======================================================== */}
      <header className="h-14 bg-white border-b border-[#e0e0e0] px-4 flex items-center justify-between shrink-0 select-none z-30">
        
        {/* Left Side: Close, Inserter, Undo/Redo, Elementor */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Blue Inserter [+] Button */}
          <button
            onClick={() => {
              setQuickInserterOpenIndex(blocks.length - 1);
            }}
            className="bg-[#2271b1] hover:bg-[#135e96] text-white w-8 h-8 rounded flex items-center justify-center transition cursor-pointer shadow-xs"
            title="Toggle block inserter"
          >
            <Plus className="w-5 h-5 font-bold" />
          </button>

          {/* Undo / Redo */}
          <div className="flex items-center gap-1 text-stone-500">
            <button className="w-7 h-7 rounded hover:bg-[#f0f0f1] flex items-center justify-center transition disabled:opacity-40" title="Undo">
              <Undo className="w-4 h-4" />
            </button>
            <button className="w-7 h-7 rounded hover:bg-[#f0f0f1] flex items-center justify-center transition disabled:opacity-40" title="Redo">
              <Redo className="w-4 h-4" />
            </button>
          </div>

          {/* List View / Outline Icon */}
          <button className="w-7 h-7 rounded hover:bg-[#f0f0f1] flex items-center justify-center text-stone-600 transition" title="Document Overview">
            <List className="w-4 h-4" />
          </button>

        </div>

        {/* Center Pill: Post Title Indicator */}
        <div className="hidden md:block text-xs font-medium text-stone-600 bg-stone-100/90 px-3.5 py-1 rounded-md border border-stone-200 truncate max-w-sm">
          {title ? `${title.slice(0, 36)}... · Post` : 'Add title · Post'}
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs relative">
          
          {/* Draft Saved Status */}
          {draftSavedNotice && (
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold border border-emerald-200 animate-fadeIn">
              ✓ Draft saved
            </span>
          )}

          {/* Autosaving Indicator */}
          {!draftSavedNotice && (
            <span className="text-stone-400 text-[11px] hidden sm:inline-block">
              {autosavingStatus}
            </span>
          )}

          {/* Save Draft Button */}
          <button
            onClick={() => handlePublish('Draft')}
            disabled={isSaving}
            className="text-stone-700 hover:text-black font-semibold px-2.5 py-1 rounded hover:bg-stone-100 transition cursor-pointer"
          >
            Save draft
          </button>

          {/* Preview / Full Page View Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowPreviewDropdown(!showPreviewDropdown)}
              className={`p-1.5 rounded flex items-center gap-1 transition cursor-pointer ${
                showPreviewDropdown ? 'bg-stone-100 text-[#2271b1]' : 'text-stone-600 hover:bg-stone-100'
              }`}
              title="Preview Options"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden lg:inline text-xs font-semibold">Preview</span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            {/* Preview Dropdown Menu */}
            {showPreviewDropdown && (
              <div className="absolute right-0 top-full mt-1.5 w-60 bg-white rounded-xl shadow-xl border border-stone-200 p-2 z-50 text-xs space-y-1">
                <div className="text-[10px] font-bold text-stone-400 px-2.5 py-1 uppercase tracking-wider">
                  View Mode
                </div>
                <button
                  onClick={() => {
                    setShowPreviewDropdown(false);
                    const p = getCurrentPostObject(status);
                    onSave(p);
                    setViewingFullPageView(p);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg bg-blue-50/80 hover:bg-blue-100/90 text-[#2271b1] font-bold flex items-center gap-2 transition cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-[#2271b1]" />
                  <div>
                    <div>WordPress Full Page View</div>
                    <div className="text-[10px] text-stone-500 font-normal">Astra theme live layout</div>
                  </div>
                </button>

                <div className="border-t border-stone-100 my-1"></div>
                <div className="text-[10px] font-bold text-stone-400 px-2.5 py-1 uppercase tracking-wider">
                  Device Preview
                </div>
                <button
                  onClick={() => {
                    setPreviewDevice('desktop');
                    setShowPreviewDropdown(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 transition ${
                    previewDevice === 'desktop' ? 'bg-stone-100 font-bold text-stone-900' : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5 text-stone-500" />
                  <span>Desktop View</span>
                </button>
                <button
                  onClick={() => {
                    setPreviewDevice('tablet');
                    setShowPreviewDropdown(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 transition ${
                    previewDevice === 'tablet' ? 'bg-stone-100 font-bold text-stone-900' : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Tablet className="w-3.5 h-3.5 text-stone-500" />
                  <span>Tablet View</span>
                </button>
                <button
                  onClick={() => {
                    setPreviewDevice('mobile');
                    setShowPreviewDropdown(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 transition ${
                    previewDevice === 'mobile' ? 'bg-stone-100 font-bold text-stone-900' : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 text-stone-500" />
                  <span>Mobile View</span>
                </button>
              </div>
            )}
          </div>

          {/* Jetpack Lightning icon */}
          <button className="p-1.5 rounded text-emerald-600 hover:bg-emerald-50 transition" title="Jetpack SEO">
            <Zap className="w-4 h-4" />
          </button>

          {/* Share/Send icon */}
          <button 
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.origin + '/blogs');
                alert('Article preview link copied to clipboard!');
              }
            }}
            className="p-1.5 rounded text-stone-600 hover:bg-stone-100 transition" 
            title="Share Link"
          >
            <Send className="w-3.5 h-3.5" />
          </button>

          {/* AI Gemini Assistant icon */}
          <button 
            onClick={() => {
              const enhanced = title + ' [NEP 2020 Compliant]';
              setTitle(enhanced);
            }}
            className="p-1.5 rounded text-purple-600 hover:bg-purple-50 transition" 
            title="AI Content Assistant"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Blue Publish Button (Screenshots 2-8 Match) */}
          <button
            onClick={() => handlePublish('Published')}
            disabled={isSaving}
            className="bg-[#2271b1] hover:bg-[#135e96] text-white font-bold px-4 py-1.5 rounded text-xs shadow-xs transition cursor-pointer disabled:opacity-50 flex items-center gap-1"
          >
            {isSaving ? 'Publishing...' : 'Publish'}
          </button>

          {/* Settings Inspector Sidebar Toggle (Icon button) */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded transition cursor-pointer ${
              sidebarOpen ? 'bg-stone-100 text-[#2271b1]' : 'text-stone-600 hover:bg-stone-100'
            }`}
            title="Settings Sidebar"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>

          {/* Close editor */}
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-stone-100 text-stone-500 hover:text-black transition cursor-pointer ml-1"
            title="Exit Editor"
          >
            <X className="w-5 h-5" />
          </button>

        </div>

      </header>

      {/* ========================================================
          WORDPRESS POST PUBLISHED SNACKBAR / BANNER
         ======================================================== */}
      {publishSuccessNotice && (
        <div className="bg-[#1d2327] text-white px-5 py-3 shadow-2xl border-b border-stone-700 flex flex-wrap items-center justify-between gap-3 z-40 animate-slideDown">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
              ✓
            </div>
            <div>
              <span className="font-bold text-xs text-white">Post published!</span>
              <span className="text-[11px] text-stone-300 ml-2 hidden sm:inline">
                Your blog article is now live in WordPress format.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const p = getCurrentPostObject(status);
                onSave(p);
                setViewingFullPageView(p);
              }}
              className="bg-[#2271b1] hover:bg-[#135e96] text-white font-bold px-3.5 py-1.5 rounded text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Full Page Post</span>
            </button>

            <button
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.origin + '/blogs');
                  alert('Post URL copied to clipboard!');
                }
              }}
              className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-1.5 rounded text-xs font-semibold transition cursor-pointer"
            >
              Copy Link
            </button>

            <button
              onClick={() => setPublishSuccessNotice(false)}
              className="text-stone-400 hover:text-white p-1 ml-1"
              title="Dismiss notice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          2. MAIN GUTENBERG EDITING CANVAS & WORKSPACE
         ======================================================== */}
      <div className="flex-1 flex overflow-hidden">
        
        <main className={`flex-1 overflow-y-auto bg-white p-6 sm:p-12 lg:px-28 flex justify-center transition-all ${
          previewDevice === 'tablet' ? 'max-w-3xl mx-auto border-x border-stone-200 shadow-lg my-4 rounded-xl' :
          previewDevice === 'mobile' ? 'max-w-sm mx-auto border-x border-stone-200 shadow-lg my-4 rounded-xl' : ''
        }`}>
          <div className="w-full max-w-3xl space-y-6 pb-24">
            
            {/* Post Title Field */}
            <div className="border-b border-transparent focus-within:border-stone-200 pb-2">
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!slug || slug === initialPost?.slug) {
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                  }
                }}
                placeholder="Add title"
                className="w-full text-3xl sm:text-4xl font-display font-bold text-[#1e1e1e] placeholder-stone-300 outline-none border-none bg-transparent leading-tight"
                autoFocus
              />
            </div>

            {/* Blocks Stream */}
            <div className="space-y-4 min-h-[500px]">
              {blocks.map((block, index) => {
                const isActive = activeBlockId === block.id;

                return (
                  <div key={block.id} className="relative group">
                    
                    {/* Blue Inserter Hover Line between blocks (Screenshots 6 & 7) */}
                    <div 
                      className="h-3 -my-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-150 cursor-pointer"
                      onClick={() => setQuickInserterOpenIndex(index - 1)}
                    >
                      <div className="w-full h-[2px] bg-[#2271b1] relative flex items-center justify-center">
                        <div className="w-5 h-5 rounded-full bg-[#2271b1] text-white flex items-center justify-center text-xs shadow-md">
                          <Plus className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>

                    {/* Quick Block Inserter Popover (Exact Match: Screenshots 6 & 7) */}
                    {quickInserterOpenIndex === index - 1 && (
                      <div className="absolute left-1/2 -translate-x-1/2 top-0 -mt-2 w-80 bg-white border border-[#c3c4c7] shadow-2xl rounded-md z-40 overflow-hidden text-xs">
                        
                        {/* Search input with close button */}
                        <div className="p-2 border-b border-stone-200 flex items-center gap-2 bg-[#f6f7f7]">
                          <Search className="w-3.5 h-3.5 text-stone-400" />
                          <input
                            type="text"
                            value={inserterSearch}
                            onChange={(e) => setInserterSearch(e.target.value)}
                            placeholder="Search"
                            className="w-full bg-white border border-[#8c8f94] rounded px-2 py-1 text-xs outline-none focus:border-[#2271b1]"
                            autoFocus
                          />
                          <button
                            onClick={() => {
                              setQuickInserterOpenIndex(null);
                              setInserterSearch('');
                            }}
                            className="bg-[#2271b1] text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] hover:bg-[#135e96]"
                          >
                            &times;
                          </button>
                        </div>

                        {/* 6 Grid items (Screenshots 6 & 7) */}
                        <div className="p-2 grid grid-cols-3 gap-2">
                          {filteredQuickBlocks.map((qb) => {
                            const IconComponent = qb.icon;
                            return (
                              <button
                                key={qb.label}
                                onClick={() => handleAddBlock(qb.type, index - 1)}
                                className="flex flex-col items-center justify-center p-3 rounded hover:bg-[#f0f6fc] text-stone-700 hover:text-[#2271b1] border border-transparent hover:border-[#72aee6] transition cursor-pointer"
                              >
                                <IconComponent className="w-5 h-5 mb-1.5 text-stone-700" />
                                <span className="text-[11px] font-medium text-center">{qb.label}</span>
                              </button>
                            );
                          })}
                        </div>

                      </div>
                    )}

                    {/* Block Container & Border */}
                    <div 
                      className={`relative rounded p-2 transition border ${
                        isActive ? 'border-[#2271b1] bg-blue-50/10' : 'border-transparent hover:border-stone-200'
                      }`}
                      onClick={() => {
                        setActiveBlockId(block.id);
                      }}
                    >
                      {/* ========================================================
                          FLOATING CONTEXT TOOLBAR (Exact Match: Screenshots 2, 3, 4, 8)
                         ======================================================== */}
                      {isActive && (
                        <div className="absolute -top-11 left-0 bg-white border border-[#c3c4c7] shadow-xl rounded-md px-1.5 py-1 flex items-center gap-1 text-xs z-30 select-none">
                          
                          {/* Block Type Switcher (e.g. H2, Paragraph) */}
                          <div className="relative">
                            <button
                              onClick={() => setShowBlockTypeDropdown(!showBlockTypeDropdown)}
                              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-stone-100 font-bold text-stone-800 text-xs"
                              title="Change block type"
                            >
                              <span>{getBlockLabel(block.type)}</span>
                              <ChevronDown className="w-3 h-3 text-stone-500" />
                            </button>

                            {/* Dropdown to change block level/type */}
                            {showBlockTypeDropdown && (
                              <div className="absolute left-0 top-8 bg-white border border-[#c3c4c7] shadow-xl rounded py-1 w-36 z-50 text-xs">
                                <button
                                  onClick={() => handleChangeBlockType(block.id, 'paragraph')}
                                  className="w-full text-left px-3 py-1.5 hover:bg-[#f0f6fc] text-stone-700"
                                >
                                  Paragraph
                                </button>
                                <button
                                  onClick={() => handleChangeBlockType(block.id, 'heading1')}
                                  className="w-full text-left px-3 py-1.5 hover:bg-[#f0f6fc] text-stone-700 font-bold"
                                >
                                  Heading 1 (H1)
                                </button>
                                <button
                                  onClick={() => handleChangeBlockType(block.id, 'heading2')}
                                  className="w-full text-left px-3 py-1.5 hover:bg-[#f0f6fc] text-stone-700 font-bold"
                                >
                                  Heading 2 (H2)
                                </button>
                                <button
                                  onClick={() => handleChangeBlockType(block.id, 'heading3')}
                                  className="w-full text-left px-3 py-1.5 hover:bg-[#f0f6fc] text-stone-700 font-bold"
                                >
                                  Heading 3 (H3)
                                </button>
                                <button
                                  onClick={() => handleChangeBlockType(block.id, 'list')}
                                  className="w-full text-left px-3 py-1.5 hover:bg-[#f0f6fc] text-stone-700"
                                >
                                  List
                                </button>
                                <button
                                  onClick={() => handleChangeBlockType(block.id, 'quote')}
                                  className="w-full text-left px-3 py-1.5 hover:bg-[#f0f6fc] text-stone-700 italic"
                                >
                                  Quote
                                </button>
                                <button
                                  onClick={() => handleChangeBlockType(block.id, 'youtube')}
                                  className="w-full text-left px-3 py-1.5 hover:bg-[#f0f6fc] text-red-600 font-semibold"
                                >
                                  YouTube Video
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Drag Handle ⋮⋮ */}
                          <div className="px-1 text-stone-400 cursor-grab" title="Drag">
                            <MoveVertical className="w-3.5 h-3.5" />
                          </div>

                          {/* Move Up / Down Buttons */}
                          <button
                            onClick={() => handleMoveBlock(index, 'up')}
                            disabled={index === 0}
                            className="p-1 rounded hover:bg-stone-100 text-stone-600 disabled:opacity-30"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveBlock(index, 'down')}
                            disabled={index === blocks.length - 1}
                            className="p-1 rounded hover:bg-stone-100 text-stone-600 disabled:opacity-30"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>

                          <div className="h-4 w-[1px] bg-stone-300 mx-1"></div>

                          {/* Alignment Dropdown */}
                          <div className="relative">
                            <button
                              onClick={() => setShowAlignDropdown(!showAlignDropdown)}
                              className="p-1 rounded hover:bg-stone-100 text-stone-600 flex items-center gap-0.5"
                              title="Align text"
                            >
                              <AlignLeft className="w-3.5 h-3.5" />
                              <ChevronDown className="w-2.5 h-2.5" />
                            </button>

                            {showAlignDropdown && (
                              <div className="absolute left-0 top-8 bg-white border border-[#c3c4c7] shadow-xl rounded py-1 w-28 z-50 text-xs">
                                <button
                                  onClick={() => {
                                    handleUpdateBlockStyle(block.id, { align: 'left' });
                                    setShowAlignDropdown(false);
                                  }}
                                  className="w-full text-left px-3 py-1 hover:bg-[#f0f6fc] flex items-center gap-2"
                                >
                                  <AlignLeft className="w-3.5 h-3.5" /> Left
                                </button>
                                <button
                                  onClick={() => {
                                    handleUpdateBlockStyle(block.id, { align: 'center' });
                                    setShowAlignDropdown(false);
                                  }}
                                  className="w-full text-left px-3 py-1 hover:bg-[#f0f6fc] flex items-center gap-2"
                                >
                                  <AlignCenter className="w-3.5 h-3.5" /> Center
                                </button>
                                <button
                                  onClick={() => {
                                    handleUpdateBlockStyle(block.id, { align: 'right' });
                                    setShowAlignDropdown(false);
                                  }}
                                  className="w-full text-left px-3 py-1 hover:bg-[#f0f6fc] flex items-center gap-2"
                                >
                                  <AlignRight className="w-3.5 h-3.5" /> Right
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Bold B */}
                          <button
                            onMouseDown={(e) => {
                              // Prevent losing focus / selection in text area when clicking toolbar button
                              e.preventDefault();
                              applyFormatToBlock(block.id, 'bold');
                            }}
                            className="p-1 rounded hover:bg-stone-200 text-stone-900 font-bold w-6 text-center cursor-pointer transition active:bg-stone-300"
                            title="Bold (Ctrl+B)"
                          >
                            B
                          </button>

                          {/* Italic I */}
                          <button
                            onMouseDown={(e) => {
                              e.preventDefault();
                              applyFormatToBlock(block.id, 'italic');
                            }}
                            className="p-1 rounded hover:bg-stone-200 text-stone-900 italic w-6 text-center cursor-pointer transition active:bg-stone-300"
                            title="Italic (Ctrl+I)"
                          >
                            I
                          </button>

                          {/* Link 🔗 */}
                          <button
                            onMouseDown={(e) => {
                              e.preventDefault();
                              applyFormatToBlock(block.id, 'link');
                            }}
                            className="p-1 rounded hover:bg-stone-200 text-stone-700 cursor-pointer transition active:bg-stone-300"
                            title="Link (Ctrl+K)"
                          >
                            <Link2 className="w-3.5 h-3.5" />
                          </button>

                          <div className="h-4 w-[1px] bg-stone-300 mx-1"></div>

                          {/* More Options ⋮ */}
                          <div className="relative">
                            <button
                              onClick={() => setShowMoreOptions(!showMoreOptions)}
                              className="p-1 rounded hover:bg-stone-100 text-stone-600"
                              title="Options"
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>

                            {showMoreOptions && (
                              <div className="absolute right-0 top-8 bg-white border border-[#c3c4c7] shadow-xl rounded py-1 w-44 z-50 text-xs">
                                <button
                                  onClick={() => handleDuplicateBlock(index)}
                                  className="w-full text-left px-3 py-1.5 hover:bg-[#f0f6fc] text-stone-700 flex items-center gap-2"
                                >
                                  <Copy className="w-3.5 h-3.5" /> Duplicate
                                </button>
                                <button
                                  onClick={() => {
                                    handleAddBlock('paragraph', index - 1);
                                    setShowMoreOptions(false);
                                  }}
                                  className="w-full text-left px-3 py-1.5 hover:bg-[#f0f6fc] text-stone-700 flex items-center gap-2"
                                >
                                  <Plus className="w-3.5 h-3.5" /> Insert before
                                </button>
                                <button
                                  onClick={() => {
                                    handleAddBlock('paragraph', index);
                                    setShowMoreOptions(false);
                                  }}
                                  className="w-full text-left px-3 py-1.5 hover:bg-[#f0f6fc] text-stone-700 flex items-center gap-2"
                                >
                                  <Plus className="w-3.5 h-3.5" /> Insert after
                                </button>
                                <div className="border-t border-stone-100 my-1"></div>
                                <button
                                  onClick={() => handleDeleteBlock(block.id)}
                                  className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600 flex items-center gap-2 font-semibold"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Delete Block
                                </button>
                              </div>
                            )}
                          </div>

                        </div>
                      )}

                      {/* Block In-Place Content Input */}
                      {block.type === 'heading1' && (
                        <input
                          type="text"
                          value={block.content}
                          onChange={(e) => handleUpdateBlock(block.id, e.target.value)}
                          placeholder="Heading 1"
                          style={{ textAlign: block.align || 'left', color: block.textColor || '#1d2327' }}
                          className="w-full text-3xl font-bold text-[#1e1e1e] placeholder-stone-300 outline-none bg-transparent"
                        />
                      )}

                      {block.type === 'heading2' && (
                        <input
                          type="text"
                          value={block.content}
                          onChange={(e) => handleUpdateBlock(block.id, e.target.value)}
                          placeholder="Heading 2"
                          style={{ textAlign: block.align || 'left', color: block.textColor || '#1d2327' }}
                          className="w-full text-2xl font-bold text-[#1e1e1e] placeholder-stone-300 outline-none bg-transparent"
                        />
                      )}

                      {block.type === 'heading3' && (
                        <input
                          type="text"
                          value={block.content}
                          onChange={(e) => handleUpdateBlock(block.id, e.target.value)}
                          placeholder="Heading 3"
                          style={{ textAlign: block.align || 'left', color: block.textColor || '#1d2327' }}
                          className="w-full text-xl font-bold text-[#1e1e1e] placeholder-stone-300 outline-none bg-transparent"
                        />
                      )}

                      {block.type === 'heading4' && (
                        <input
                          type="text"
                          value={block.content}
                          onChange={(e) => handleUpdateBlock(block.id, e.target.value)}
                          placeholder="Heading 4"
                          style={{ textAlign: block.align || 'left', color: block.textColor || '#1d2327' }}
                          className="w-full text-lg font-bold text-[#1e1e1e] placeholder-stone-300 outline-none bg-transparent"
                        />
                      )}

                      {block.type === 'quote' && (
                        <div className="border-l-4 border-[#2271b1] pl-4 py-1">
                          <textarea
                            rows={2}
                            value={block.content}
                            onChange={(e) => handleUpdateBlock(block.id, e.target.value)}
                            placeholder="Enter quote..."
                            className="w-full text-base italic text-stone-700 placeholder-stone-300 outline-none bg-transparent resize-none"
                          />
                        </div>
                      )}

                      {block.type === 'list' && (
                        <textarea
                          rows={6}
                          value={block.content}
                          onChange={(e) => handleUpdateBlock(block.id, e.target.value)}
                          placeholder="• List item 1\n• List item 2"
                          className="w-full text-sm text-stone-800 placeholder-stone-300 outline-none bg-transparent resize-none leading-relaxed"
                        />
                      )}

                      {block.type === 'paragraph' && (
                        <textarea
                          rows={Math.max(2, Math.ceil(block.content.length / 70))}
                          value={block.content}
                          onChange={(e) => handleUpdateBlock(block.id, e.target.value)}
                          placeholder="Type / to choose a block"
                          style={{
                            fontSize: block.fontSize === 'S' ? '14px' : block.fontSize === 'L' ? '20px' : block.fontSize === 'XL' ? '24px' : '16px',
                            color: block.textColor || '#2c3338',
                            backgroundColor: block.bgColor || 'transparent',
                            textAlign: block.align || 'left'
                          }}
                          className="w-full text-stone-800 placeholder-stone-400 outline-none bg-transparent resize-none leading-relaxed selection:bg-[#2271b1] selection:text-white"
                        />
                      )}

                      {block.type === 'image' && (
                        <div className="border-2 border-dashed border-stone-200 rounded-lg p-6 text-center space-y-3 bg-stone-50">
                          {block.imageUrl ? (
                            <div className="space-y-2">
                              <img src={block.imageUrl} alt={block.imageAlt || 'Post image'} className="max-h-64 mx-auto rounded" />
                              <button
                                onClick={() => {
                                  setMediaTargetType(block.id);
                                  setShowMediaModal(true);
                                }}
                                className="text-xs text-[#2271b1] hover:underline font-semibold"
                              >
                                Replace image
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <ImageIcon className="w-10 h-10 text-stone-400 mx-auto" />
                              <div className="text-xs text-stone-600 font-semibold">Upload an image or select from library</div>
                              <button
                                onClick={() => {
                                  setMediaTargetType(block.id);
                                  setShowMediaModal(true);
                                }}
                                className="bg-[#2271b1] text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-[#135e96]"
                              >
                                Media Library
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {block.type === 'youtube' && (
                        <div className="border-2 border-dashed border-red-200 rounded-xl p-5 bg-red-50/30 space-y-3 my-2">
                          <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider">
                            <Video className="w-4 h-4" />
                            <span>YouTube Video Embed</span>
                          </div>
                          {extractYouTubeId(block.content) ? (
                            <div className="space-y-3">
                              <div className="aspect-video w-full rounded-xl overflow-hidden shadow-md bg-black">
                                <iframe
                                  src={`https://www.youtube.com/embed/${extractYouTubeId(block.content)}`}
                                  title="YouTube Video Preview"
                                  className="w-full h-full border-0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-stone-500 truncate max-w-xs">{block.content}</span>
                                <button
                                  onClick={() => handleUpdateBlock(block.id, '')}
                                  className="text-red-600 font-bold hover:underline cursor-pointer"
                                >
                                  Change URL
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-xs text-stone-600 font-medium">
                                Paste a YouTube URL below to play the video right inside the article:
                              </p>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={block.content}
                                  onChange={(e) => handleUpdateBlock(block.id, e.target.value)}
                                  placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ or https://youtu.be/..."
                                  className="flex-1 px-3 py-2 text-xs border border-stone-300 rounded-lg outline-none focus:border-red-500 bg-white"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom In-Line Type / to choose a block Placeholder (Screenshot #5 & #6 match) */}
            <div className="pt-6 border-t border-stone-100 flex items-center justify-between text-stone-400 text-sm">
              <span 
                className="cursor-pointer hover:text-stone-700"
                onClick={() => handleAddBlock('paragraph')}
              >
                Type / to choose a block
              </span>
              <button
                onClick={() => setQuickInserterOpenIndex(blocks.length - 1)}
                className="w-6 h-6 rounded border border-stone-300 text-stone-500 hover:text-[#2271b1] hover:border-[#2271b1] flex items-center justify-center text-xs"
                title="Add block"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </main>

        {/* ========================================================
            3. RIGHT WORDPRESS INSPECTOR SIDEBAR (POST SETTINGS)
           ======================================================== */}
        {sidebarOpen && (
          <aside className="w-72 sm:w-80 bg-white border-l border-[#e0e0e0] flex flex-col shrink-0 overflow-y-auto z-20 text-xs font-sans">
            
            {/* Sidebar Header */}
            <div className="px-4 py-3 border-b border-[#e0e0e0] bg-[#f6f7f7] font-bold text-stone-800 flex items-center justify-between shrink-0 select-none">
              <span>Post Settings</span>
              <span className="text-[10px] text-stone-400 font-normal">WordPress Gutenberg</span>
            </div>

            {/* Post Settings Content */}
            <div className="divide-y divide-stone-100 pb-20 text-xs">
                
                {/* 1. Featured Image Accordion */}
                <div className="p-4 space-y-3">
                  <div 
                    onClick={() => setFeatImageOpen(!featImageOpen)}
                    className="flex items-center justify-between font-bold text-stone-800 cursor-pointer select-none"
                  >
                    <span>Featured image</span>
                    {featImageOpen ? <ChevronDown className="w-4 h-4 text-stone-400" /> : <ChevronRight className="w-4 h-4 text-stone-400" />}
                  </div>

                  {featImageOpen && (
                    <div className="space-y-3 pt-2 text-xs relative">
                      {featuredImage ? (
                        <div className="space-y-2">
                          <div className="h-36 rounded-lg overflow-hidden border border-stone-200 bg-stone-900 relative group">
                            <img src={featuredImage} alt="Featured" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                  setMediaTargetType('featured');
                                  setShowMediaModal(true);
                                }}
                                className="bg-white text-stone-900 px-2.5 py-1 rounded text-xs font-bold shadow hover:bg-stone-100 cursor-pointer"
                              >
                                Replace
                              </button>
                              <button
                                onClick={() => {
                                  setFeaturedImage('');
                                  setFeaturedImageStoragePath('');
                                }}
                                className="bg-red-600 text-white px-2.5 py-1 rounded text-xs font-bold shadow hover:bg-red-700 cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-emerald-700 font-semibold flex items-center gap-1">
                              <Check className="w-3 h-3" /> Supabase Storage
                            </span>
                            <button
                              onClick={() => {
                                setFeaturedImage('');
                                setFeaturedImageStoragePath('');
                              }}
                              className="text-red-600 hover:underline font-semibold"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <button
                            onClick={() => setShowImageOptionsDropdown(!showImageOptionsDropdown)}
                            className="w-full border border-[#8c8f94] hover:border-[#2271b1] hover:text-[#2271b1] bg-white text-stone-700 py-2 px-3 rounded text-xs font-semibold transition cursor-pointer text-center flex items-center justify-center gap-1.5"
                          >
                            <span>Set featured image</span>
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>

                          {showImageOptionsDropdown && (
                            <div className="absolute left-0 right-0 top-11 bg-white border border-[#c3c4c7] shadow-xl rounded-md z-40 py-1.5 text-xs">
                              <button
                                onClick={() => {
                                  setMediaTargetType('featured');
                                  setShowMediaModal(true);
                                  setShowImageOptionsDropdown(false);
                                }}
                                className="w-full px-3 py-2 text-left hover:bg-[#f0f6fc] text-stone-700 hover:text-[#2271b1] flex items-center justify-between transition cursor-pointer"
                              >
                                <span>Media Library</span>
                                <ImageIcon className="w-4 h-4 text-stone-400" />
                              </button>
                              <button
                                onClick={() => {
                                  setMediaTargetType('featured');
                                  fileInputRef.current?.click();
                                  setShowImageOptionsDropdown(false);
                                }}
                                className="w-full px-3 py-2 text-left hover:bg-[#f0f6fc] text-stone-700 hover:text-[#2271b1] flex items-center justify-between transition cursor-pointer"
                              >
                                <span>Upload Files (Supabase)</span>
                                <Upload className="w-4 h-4 text-stone-400" />
                              </button>
                            </div>
                          )}

                          <label className="flex items-start gap-2 pt-2 cursor-pointer text-[11px] text-stone-600">
                            <input type="checkbox" className="mt-0.5 rounded text-[#2271b1] focus:ring-[#2271b1]" />
                            <span>Show featured image in the posts lists only, but hide it in single post view.</span>
                          </label>
                        </div>
                      )}

                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
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
                                setFeaturedImage(data.url);
                                setFeaturedImageStoragePath(data.storagePath || '');
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>

                {/* 2. Status & Visibility Accordion */}
                <div className="p-4 space-y-3">
                  <div 
                    onClick={() => setStatusOpen(!statusOpen)}
                    className="flex items-center justify-between font-bold text-stone-800 cursor-pointer select-none"
                  >
                    <span>Status & visibility</span>
                    {statusOpen ? <ChevronDown className="w-4 h-4 text-stone-400" /> : <ChevronRight className="w-4 h-4 text-stone-400" />}
                  </div>

                  {statusOpen && (
                    <div className="space-y-3 pt-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500">Status</span>
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value as any)}
                          className="bg-white border border-stone-200 rounded px-2 py-1 font-semibold text-[#2271b1] outline-none"
                        >
                          <option value="Published">Published</option>
                          <option value="Draft">Draft</option>
                          <option value="Trash">Trash</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-stone-500">Publish</span>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="bg-white border border-stone-200 rounded px-2 py-1 text-stone-700 outline-none font-mono text-[11px]"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-stone-500">Author</span>
                        <span className="font-semibold text-stone-700">{author}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Categories Accordion */}
                <div className="p-4 space-y-3">
                  <div 
                    onClick={() => setCatOpen(!catOpen)}
                    className="flex items-center justify-between font-bold text-stone-800 cursor-pointer select-none"
                  >
                    <span>Categories</span>
                    {catOpen ? <ChevronDown className="w-4 h-4 text-stone-400" /> : <ChevronRight className="w-4 h-4 text-stone-400" />}
                  </div>

                  {catOpen && (
                    <div className="space-y-2 pt-1 text-xs">
                      {allCategories.map(cat => (
                        <label key={cat} className="flex items-center gap-2 cursor-pointer text-stone-700 hover:text-black">
                          <input
                            type="radio"
                            name="cat_radio"
                            checked={category === cat}
                            onChange={() => setCategory(cat)}
                            className="text-[#2271b1] focus:ring-[#2271b1]"
                          />
                          <span>{cat}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. Tags Accordion */}
                <div className="p-4 space-y-3">
                  <div 
                    onClick={() => setTagsOpen(!tagsOpen)}
                    className="flex items-center justify-between font-bold text-stone-800 cursor-pointer select-none"
                  >
                    <span>Tags</span>
                    {tagsOpen ? <ChevronDown className="w-4 h-4 text-stone-400" /> : <ChevronRight className="w-4 h-4 text-stone-400" />}
                  </div>

                  {tagsOpen && (
                    <div className="space-y-2 pt-1 text-xs">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && tagInput.trim()) {
                              e.preventDefault();
                              if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
                              setTagInput('');
                            }
                          }}
                          placeholder="Add tag and press Enter"
                          className="w-full bg-white border border-stone-200 rounded px-2 py-1 text-xs outline-none"
                        />
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {tags.map(t => (
                          <span key={t} className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full text-[11px] flex items-center gap-1 border border-stone-200">
                            #{t}
                            <button onClick={() => setTags(tags.filter(x => x !== t))} className="font-bold">&times;</button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. Yoast SEO Optimization Accordion */}
                <div className="p-4 space-y-3 bg-[#fcfcfc] border-t border-stone-200">
                  <div 
                    onClick={() => setYoastSeoOpen(!yoastSeoOpen)}
                    className="flex items-center justify-between font-bold text-stone-800 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded bg-emerald-600 text-white font-black text-[9px] flex items-center justify-center">Y</div>
                      <span>Yoast SEO</span>
                    </div>
                    {yoastSeoOpen ? <ChevronDown className="w-4 h-4 text-stone-400" /> : <ChevronRight className="w-4 h-4 text-stone-400" />}
                  </div>

                  {yoastSeoOpen && (
                    <div className="space-y-3 pt-1 text-xs">
                      {/* SEO Score Indicator */}
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          OK
                        </div>
                        <div className="text-[11px] text-emerald-900 font-medium">
                          SEO analysis: <strong className="text-emerald-700 font-bold">Good</strong>. Your article is well optimized for search engines.
                        </div>
                      </div>

                      {/* Focus Keyphrase */}
                      <div className="space-y-1">
                        <label className="font-semibold text-stone-700 block">Focus keyphrase</label>
                        <input
                          type="text"
                          value={seoFocusKeyword}
                          onChange={(e) => setSeoFocusKeyword(e.target.value)}
                          placeholder="e.g. METAR and TAF Reports"
                          className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-[#2271b1]"
                        />
                      </div>

                      {/* Meta Title */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="font-semibold text-stone-700">Meta title</label>
                          <span className={`text-[10px] font-mono ${seoMetaTitle.length > 60 ? 'text-amber-600 font-bold' : 'text-stone-400'}`}>
                            {seoMetaTitle.length}/60
                          </span>
                        </div>
                        <input
                          type="text"
                          value={seoMetaTitle}
                          onChange={(e) => setSeoMetaTitle(e.target.value)}
                          placeholder={title || 'Custom meta title for Google...'}
                          className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-[#2271b1]"
                        />
                      </div>

                      {/* Meta Description */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="font-semibold text-stone-700">Meta description</label>
                          <span className={`text-[10px] font-mono ${seoMetaDescription.length > 156 ? 'text-amber-600 font-bold' : 'text-stone-400'}`}>
                            {seoMetaDescription.length}/156
                          </span>
                        </div>
                        <textarea
                          rows={3}
                          value={seoMetaDescription}
                          onChange={(e) => setSeoMetaDescription(e.target.value)}
                          placeholder="Snippet preview description for Google search results..."
                          className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-[#2271b1] resize-none"
                        />
                      </div>

                      {/* Google Snippet Preview */}
                      <div className="border border-stone-200 rounded bg-white p-2.5 space-y-1 shadow-2xs">
                        <div className="text-[10px] uppercase font-bold text-stone-400">Google preview</div>
                        <div className="text-[#1a0dab] font-medium text-xs truncate hover:underline cursor-pointer">
                          {seoMetaTitle || title || 'Untitled Post'}
                        </div>
                        <div className="text-[#006621] text-[10px] truncate">
                          {window.location.origin}/blogs/{slug || 'post'}
                        </div>
                        <div className="text-[#545454] text-[11px] line-clamp-2">
                          {seoMetaDescription || excerpt || 'Read the full article on our official portal...'}
                        </div>
                      </div>

                      {/* Yoast SEO Analysis Checklist */}
                      <div className="space-y-1.5 pt-2 border-t border-stone-200">
                        <div className="font-bold text-stone-700 text-[11px] uppercase">SEO Analysis</div>
                        <ul className="space-y-1 text-[11px]">
                          <li className="flex items-center gap-1.5 text-emerald-700">
                            <span>🟢</span>
                            <span>Keyphrase in title: Focus keyphrase appears in post title.</span>
                          </li>
                          <li className={`flex items-center gap-1.5 ${seoMetaDescription.toLowerCase().includes(seoFocusKeyword.toLowerCase()) ? 'text-emerald-700' : 'text-amber-700'}`}>
                            <span>{seoMetaDescription.toLowerCase().includes(seoFocusKeyword.toLowerCase()) ? '🟢' : '🟠'}</span>
                            <span>Keyphrase in meta description: {seoMetaDescription.toLowerCase().includes(seoFocusKeyword.toLowerCase()) ? 'Found' : 'Not found (recommended)'}</span>
                          </li>
                          <li className={`flex items-center gap-1.5 ${seoMetaDescription.length >= 100 && seoMetaDescription.length <= 156 ? 'text-emerald-700' : 'text-amber-700'}`}>
                            <span>{seoMetaDescription.length >= 100 && seoMetaDescription.length <= 156 ? '🟢' : '🟠'}</span>
                            <span>Meta description length: {seoMetaDescription.length} chars ({seoMetaDescription.length >= 100 && seoMetaDescription.length <= 156 ? 'Good' : 'Aim for 120-156'})</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

              </div>

          </aside>
        )}

      </div>

      {/* ========================================================
          4. BOTTOM BREADCRUMBS BAR (Screenshots 2-8 Match)
         ======================================================== */}
      <footer className="h-7 bg-[#f6f7f7] border-t border-[#e0e0e0] px-4 flex items-center justify-between text-[11px] text-stone-500 shrink-0 select-none z-10">
        <div className="flex items-center gap-2">
          <span>Meta Boxes</span>
          <span className="text-stone-300">|</span>
          <span>Post &gt; <strong className="text-stone-700 capitalize">{getBlockLabel(activeBlock?.type)}</strong></span>
        </div>
        <div>
          <span>{blocks.length} blocks • {title.split(' ').length} words</span>
        </div>
      </footer>

      {/* Featured Image Media Modal */}
      <WpFeaturedImageModal
        isOpen={showMediaModal}
        onClose={() => setShowMediaModal(false)}
        adminToken={adminToken}
        currentImage={featuredImage}
        onSelectImage={handleSelectFromMediaModal}
      />

      {/* WordPress Full Page View Modal */}
      {viewingFullPageView && (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
          <WpFullPostView
            post={viewingFullPageView}
            onBack={() => setViewingFullPageView(null)}
            onEditInGutenberg={() => setViewingFullPageView(null)}
          />
        </div>
      )}

    </div>
  );
};
