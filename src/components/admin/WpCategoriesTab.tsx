import React, { useState } from 'react';
import { Search, Plus, Trash2, Check, ExternalLink } from 'lucide-react';
import { BlogPost } from '../../types';

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  parent?: string;
  description?: string;
  count: number;
  metaTitle?: string;
  metaDesc?: string;
  index: boolean;
}

interface WpCategoriesTabProps {
  blogs: BlogPost[];
  categories: CategoryItem[];
  onAddCategory: (cat: CategoryItem) => void;
  onDeleteCategory: (id: string) => void;
}

export const WpCategoriesTab: React.FC<WpCategoriesTabProps> = ({
  blogs,
  categories,
  onAddCategory,
  onDeleteCategory
}) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [parent, setParent] = useState('None');
  const [description, setDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState('Bulk actions');

  const filtered = categories.filter(c =>
    !searchTerm ||
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isAllSelected = filtered.length > 0 && filtered.every(cat => selectedIds.includes(cat.id));

  const handleSelectAllToggle = () => {
    if (isAllSelected) {
      setSelectedIds(selectedIds.filter(id => !filtered.some(f => f.id === id)));
    } else {
      const newSelected = [...selectedIds];
      filtered.forEach(cat => {
        if (!newSelected.includes(cat.id)) {
          newSelected.push(cat.id);
        }
      });
      setSelectedIds(newSelected);
    }
  };

  const handleBulkApply = () => {
    if (bulkAction === 'Delete') {
      if (selectedIds.length === 0) {
        alert('Please select one or more categories first.');
        return;
      }
      if (confirm(`Are you sure you want to delete ${selectedIds.length} selected categories?`)) {
        selectedIds.forEach(id => {
          onDeleteCategory(id);
        });
        setSelectedIds([]);
        setBulkAction('Bulk actions');
      }
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCat: CategoryItem = {
      id: `cat_${Date.now()}`,
      name: name.trim(),
      slug: newSlug,
      parent,
      description,
      count: 0,
      metaTitle: `${name.trim()} - KinderBee Preschool Network`,
      metaDesc: description || `${name.trim()} articles and updates`,
      index: true
    };

    onAddCategory(newCat);
    setName('');
    setSlug('');
    setParent('None');
    setDescription('');
  };

  return (
    <div className="space-y-4 font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-xl font-bold text-[#1d2327]">Categories</h2>
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Categories"
            className="bg-white border border-[#8c8f94] text-xs px-2.5 py-1 rounded w-48 text-[#2c3338] outline-none focus:border-[#2271b1]"
          />
          <button className="border border-[#8c8f94] hover:bg-stone-100 text-[#2c3338] text-xs font-semibold px-2.5 py-1 rounded transition cursor-pointer">
            Search Categories
          </button>
        </div>
      </div>

      {/* 2-Column Layout matching Screenshot #2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Add Category Form */}
        <div className="lg:col-span-4 bg-white border border-[#c3c4c7] p-4 shadow-xs rounded-sm space-y-4 text-xs">
          <h3 className="font-bold text-sm text-[#1d2327]">Add Category</h3>
          
          <form onSubmit={handleAddSubmit} className="space-y-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!slug) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                }}
                className="w-full bg-white border border-[#8c8f94] rounded px-3 py-1.5 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
                required
              />
              <p className="text-[11px] text-stone-500 pt-1">The name is how it appears on your site.</p>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}
                className="w-full bg-white border border-[#8c8f94] rounded px-3 py-1.5 text-xs text-[#2c3338] outline-none font-mono"
              />
              <p className="text-[11px] text-stone-500 pt-1">
                The &ldquo;slug&rdquo; is the URL-friendly version of the name. It is usually all lowercase and contains only letters, numbers, and hyphens.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Parent Category</label>
              <select
                value={parent}
                onChange={(e) => setParent(e.target.value)}
                className="w-full bg-white border border-[#8c8f94] rounded px-3 py-1.5 text-xs text-[#2c3338] outline-none"
              >
                <option value="None">None</option>
                {categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
              <p className="text-[11px] text-stone-500 pt-1">
                Categories, unlike tags, can have a hierarchy. You might have a Jazz category, and under that have children categories for Bebop and Big Band.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white border border-[#8c8f94] rounded px-3 py-1.5 text-xs text-[#2c3338] outline-none"
              />
              <p className="text-[11px] text-stone-500 pt-1">
                The description is not prominent by default; however, some themes may show it.
              </p>
            </div>

            <button
              type="submit"
              className="bg-[#2271b1] hover:bg-[#135e96] text-white font-bold text-xs px-4 py-2 rounded shadow-xs transition cursor-pointer"
            >
              Add Category
            </button>
          </form>
        </div>

        {/* Right Column: Categories Table matching Screenshot #2 */}
        <div className="lg:col-span-8 space-y-3">
          
          <div className="flex items-center justify-between text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <select 
                value={bulkAction} 
                onChange={(e) => setBulkAction(e.target.value)} 
                className="bg-white border border-[#8c8f94] text-xs px-2.5 py-1 rounded outline-none"
              >
                <option value="Bulk actions">Bulk actions</option>
                <option value="Delete">Delete</option>
              </select>
              <button 
                type="button"
                onClick={handleBulkApply} 
                className="border border-[#8c8f94] hover:bg-stone-100 px-2.5 py-1 rounded text-xs font-semibold cursor-pointer"
              >
                Apply
              </button>
            </div>
            <span>{categories.length} items</span>
          </div>

          <div className="bg-white border border-[#c3c4c7] shadow-xs rounded-xs overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f6f7f7] border-b border-[#c3c4c7] text-[#1d2327] font-semibold">
                  <th className="p-2.5 w-8">
                    <input 
                      type="checkbox" 
                      checked={isAllSelected}
                      onChange={handleSelectAllToggle}
                      className="rounded text-[#2271b1]" 
                    />
                  </th>
                  <th className="p-2.5 font-bold">Name</th>
                  <th className="p-2.5 font-bold">Description</th>
                  <th className="p-2.5 font-bold">Slug</th>
                  <th className="p-2.5 font-bold text-center">Count</th>
                  <th className="p-2.5 font-bold">Meta title</th>
                  <th className="p-2.5 font-bold text-center">Index</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filtered.map(cat => {
                  const postCount = blogs.filter(b => b.category === cat.name).length;

                  return (
                    <tr key={cat.id} className="hover:bg-[#f6f7f7] transition group">
                      <td className="p-2.5 align-top">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(cat.id)}
                          onChange={() => {
                            if (selectedIds.includes(cat.id)) {
                              setSelectedIds(selectedIds.filter(x => x !== cat.id));
                            } else {
                              setSelectedIds([...selectedIds, cat.id]);
                            }
                          }}
                          className="rounded text-[#2271b1]"
                        />
                      </td>
                      <td className="p-2.5 align-top">
                        <div className="font-semibold text-[#2271b1] hover:underline cursor-pointer">
                          {cat.name}
                        </div>
                        <div className="flex items-center gap-1.5 pt-1 text-[11px] text-stone-500 opacity-90 group-hover:opacity-100">
                          <button className="text-[#2271b1] hover:underline">Edit</button>
                          <span>|</span>
                          <button className="text-[#2271b1] hover:underline">Quick Edit</button>
                          <span>|</span>
                          <button 
                            type="button"
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete the category "${cat.name}"?`)) {
                                onDeleteCategory(cat.id);
                              }
                            }}
                            className="text-[#d63638] hover:underline cursor-pointer font-semibold"
                          >
                            Delete
                          </button>
                          <span>|</span>
                          <button className="text-[#2271b1] hover:underline">View</button>
                        </div>
                      </td>
                      <td className="p-2.5 text-stone-500 align-top max-w-xs">
                        {cat.description || '—'}
                      </td>
                      <td className="p-2.5 text-stone-600 font-mono text-[11px] align-top">
                        {cat.slug}
                      </td>
                      <td className="p-2.5 text-center text-[#2271b1] font-bold align-top">
                        {postCount || cat.count || 0}
                      </td>
                      <td className="p-2.5 text-stone-600 text-[11px] align-top max-w-[150px] truncate">
                        {cat.metaTitle || `${cat.name} - KinderBee`}
                      </td>
                      <td className="p-2.5 text-center align-top">
                        <span className="inline-block w-3.5 h-3.5 rounded-full bg-emerald-500 text-white text-[9px] font-black leading-tight">
                          ✓
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-stone-500 pt-2">
            Deleting a category does not delete the posts in that category. Instead, posts that were only assigned to the deleted category are set to the default category Uncategorized.
          </p>

        </div>

      </div>

    </div>
  );
};
