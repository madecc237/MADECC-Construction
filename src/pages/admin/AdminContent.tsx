import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  FileEdit, 
  Image as ImageIcon, 
  Search, 
  Plus, 
  Globe, 
  Tag, 
  Calendar, 
  Save, 
  Eye, 
  Trash2,
  CheckCircle2,
  Layout,
  Newspaper,
  X,
  Upload,
  Filter
} from 'lucide-react';
import { useContent, ContentItem } from '../../context/ContentContext';

export default function AdminContent() {
  const { content: contentList, addContent, updateContent, deleteContent } = useContent();
  const [activeTab, setActiveTab] = useState<'projects' | 'insights'>('projects');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Published' | 'Draft'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<ContentItem> | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const filteredContent = contentList.filter(item => {
    const typeMatch = activeTab === 'projects' ? item.type === 'project' : item.type === 'insight';
    const statusMatch = statusFilter === 'All' || item.status === statusFilter;
    const searchMatch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return typeMatch && statusMatch && searchMatch;
  });

  const handleEdit = (item: ContentItem) => {
    setEditingItem(JSON.parse(JSON.stringify(item))); // Deep clone for editing
    setIsEditorOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem({
      type: activeTab === 'projects' ? 'project' : 'insight',
      status: 'Draft',
      seo: { title: '', description: '', caption: '' },
      image: 'https://images.unsplash.com/photo-1541976590-713941fbc1c6?auto=format&fit=crop&q=80&w=2070'
    });
    setIsEditorOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingItem(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (editingItem?.id) {
      updateContent(editingItem as ContentItem);
    } else {
      addContent(editingItem as Omit<ContentItem, 'id' | 'date'>);
    }
    setIsEditorOpen(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">Content Management</h2>
            <p className="text-gray-400 mt-1">Manage public projects, insights, news, and SEO settings.</p>
          </div>
          <button 
            onClick={handleAddNew}
            className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-orange-500 transition-all shadow-lg shadow-orange-600/20 active:scale-95"
          >
            <Plus size={18} />
            {activeTab === 'projects' ? 'Add Featured Project' : 'Add Insight Post'}
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-black/40 border border-gray-800 p-1.5 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'projects' ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            <Layout size={16} />
            Featured Projects
          </button>
          <button 
            onClick={() => setActiveTab('insights')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'insights' ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            <Newspaper size={16} />
            Insights & News
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row items-center gap-4 bg-black/40 border border-gray-800 p-4 rounded-2xl">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900/50 border border-transparent focus:border-orange-600/50 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter size={16} className="text-gray-500 hidden md:block" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="flex-1 md:flex-none bg-gray-900/50 border border-gray-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-orange-600 text-xs font-black uppercase tracking-widest"
            >
              <option value="All">All Status</option>
              <option value="Published">Published</option>
              <option value="Draft">Drafts</option>
            </select>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredContent.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group bg-black/40 border border-gray-800 rounded-3xl overflow-hidden hover:border-orange-600/50 transition-all duration-300 flex flex-col"
            >
              <div className="relative h-48 bg-gray-900">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    item.status === 'Published' ? 'bg-green-600' : 'bg-gray-600'
                  } text-white`}>
                    {item.status}
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-4 flex-1 flex flex-col">
                <div>
                  <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">{item.category}</span>
                  <h3 className="text-xl font-black text-white uppercase italic tracking-tighter leading-tight mt-1">{item.title}</h3>
                </div>
                
                <div className="flex items-center gap-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest border-t border-gray-800 pt-4">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {item.date}</span>
                  <span className="flex items-center gap-1 text-green-500"><Globe size={12} /> SEO Optimized</span>
                </div>

                <div className="flex gap-2 pt-4 mt-auto">
                  <button 
                    onClick={() => handleEdit(item)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-700 transition-all"
                  >
                    <FileEdit size={14} />
                    Edit Content
                  </button>
                  <button className="p-3 bg-gray-800 text-gray-400 rounded-xl hover:text-white hover:bg-gray-700 transition-all">
                    <Eye size={18} />
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this artifact? This cannot be undone.')) {
                        deleteContent(item.id);
                      }
                    }}
                    className="p-3 bg-gray-800 text-gray-400 rounded-xl hover:text-red-500 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {isEditorOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditorOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <div className="flex items-center justify-between mb-8 sticky top-0 bg-gray-900 z-10 pb-4 border-b border-gray-800">
                <div>
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">
                    {editingItem?.id ? 'Edit' : 'Create'} {activeTab === 'projects' ? 'Featured Project' : 'Insight Post'}
                  </h3>
                  <p className="text-gray-400 text-sm font-medium">Configure content details and search engine visibility.</p>
                </div>
                <button 
                  onClick={() => setIsEditorOpen(false)}
                  className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-xl transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Left Side: General Info */}
                <div className="space-y-6">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-orange-600 border-l-2 border-orange-600 pl-3">General Information</h4>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest block">Display Title</label>
                    <input 
                      type="text" 
                      value={editingItem?.title || ''}
                      onChange={e => setEditingItem(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-black border border-gray-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-orange-600" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest block">Category</label>
                      <input 
                        type="text" 
                        value={editingItem?.category || ''}
                        onChange={e => setEditingItem(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full bg-black border border-gray-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-orange-600" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest block">Status</label>
                      <select 
                        value={editingItem?.status || 'Draft'}
                        onChange={e => setEditingItem(prev => ({ ...prev, status: e.target.value as any }))}
                        className="w-full bg-black border border-gray-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-orange-600"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Published">Published</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest block">Featured Identity Image</label>
                    <div className="relative group/img aspect-video bg-black rounded-2xl border border-gray-800 overflow-hidden">
                      {editingItem?.image ? (
                        <img src={editingItem.image} alt="Preview" className="w-full h-full object-cover opacity-60 group-hover/img:opacity-40 transition-all" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-700">
                          <ImageIcon size={48} />
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all">
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="px-6 py-3 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-2xl"
                        >
                          <Upload size={16} />
                          Replace Image
                        </button>
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        className="hidden" 
                        accept="image/*"
                      />
                    </div>
                    <p className="text-[8px] text-gray-600 uppercase font-black tracking-widest text-center mt-2 italic">Recommended: 1600x900px, Under 2MB</p>
                  </div>
                </div>

                {/* Right Side: SEO Optimization */}
                <div className="space-y-6">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-green-500 border-l-2 border-green-500 pl-3">Search Engine Optimization</h4>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">SEO Title Tag</label>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded ${
                        (editingItem?.seo?.title?.length || 0) > 60 ? 'bg-red-500/10 text-red-500' : 
                        (editingItem?.seo?.title?.length || 0) >= 50 ? 'bg-green-500/10 text-green-500' : 'text-gray-500'
                      }`}>
                        {editingItem?.seo?.title?.length || 0} / 60
                      </span>
                    </div>
                    <input 
                      type="text" 
                      value={editingItem?.seo?.title || ''}
                      onChange={e => setEditingItem(prev => ({ ...prev, seo: { ...prev.seo!, title: e.target.value } }))}
                      placeholder="Target keyword focused title..."
                      className={`w-full bg-black border rounded-xl py-3 px-4 text-white focus:outline-none transition-all ${
                        (editingItem?.seo?.title?.length || 0) > 60 ? 'border-red-600' : 'border-gray-800 focus:border-green-600'
                      }`} 
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Meta Description</label>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded ${
                        (editingItem?.seo?.description?.length || 0) > 160 ? 'bg-red-500/10 text-red-500' : 
                        (editingItem?.seo?.description?.length || 0) >= 120 ? 'bg-green-500/10 text-green-500' : 'text-gray-500'
                      }`}>
                        {editingItem?.seo?.description?.length || 0} / 160
                      </span>
                    </div>
                    <textarea 
                      rows={4}
                      value={editingItem?.seo?.description || ''}
                      onChange={e => setEditingItem(prev => ({ ...prev, seo: { ...prev.seo!, description: e.target.value } }))}
                      placeholder="160 characters to capture search interest..."
                      className={`w-full bg-black border rounded-xl py-3 px-4 text-white focus:outline-none transition-all resize-none ${
                        (editingItem?.seo?.description?.length || 0) > 160 ? 'border-red-600' : 'border-gray-800 focus:border-green-600'
                      }`} 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest block">Social Media Caption / snippet</label>
                    <textarea 
                      rows={2}
                      value={editingItem?.seo?.caption || ''}
                      onChange={e => setEditingItem(prev => ({ ...prev, seo: { ...prev.seo!, caption: e.target.value } }))}
                      placeholder="Short catchy snippet for social sharing..."
                      className="w-full bg-black border border-gray-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-green-600 resize-none" 
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-10 mt-10 border-t border-gray-800">
                <button 
                  onClick={() => setIsEditorOpen(false)}
                  className="flex-1 py-4 border border-gray-800 text-gray-400 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-gray-800 transition-all"
                >
                  Cancel Changes
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-[2] flex items-center justify-center gap-3 py-4 bg-orange-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-orange-500 transition-all shadow-xl shadow-orange-600/20 active:scale-[0.98]"
                >
                  <Save size={18} />
                  Save & Publish
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
