import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

import api from '../../../utils/api';
import StatusPopup from './StatusPopup';

const CMSManager = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [customSections, setCustomSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ isOpen: false, message: '', type: 'success' });
  
  // Modal State for Adding/Editing Sections
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [sectionForm, setSectionForm] = useState({
    title: '',
    subtitle: '',
    image: '',
    buttonText: '',
    buttonLink: '',
    isActive: true
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodRes, homeRes] = await Promise.all([
        api.get('/products'),
        api.get('/homepage')
      ]);
      setProducts(prodRes.data || []);
      setCustomSections(homeRes.data?.customSections || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const toggleProductHome = async (productId, currentStatus) => {
    try {
      // Update specifically the product's featured status on backend
      await api.put(`/products/${productId}`, { featured: !currentStatus });
      
      // Update UI only after confirmed success
      const updatedProducts = products.map(p => 
        p.id === productId ? { ...p, featured: !currentStatus } : p
      );
      setProducts(updatedProducts);
      setStatus({ isOpen: true, message: 'Product visibility updated!', type: 'success' });
    } catch (err) {
      console.error(err);
      setStatus({ isOpen: true, message: 'Failed to update product status.', type: 'error' });
    }
  };

  const handleSectionSave = async () => {
    try {
      let updatedSections;
      if (editingSection !== null) {
        // Edit existing
        updatedSections = customSections.map((s, i) => i === editingSection ? sectionForm : s);
      } else {
        // Add new
        updatedSections = [...customSections, sectionForm];
      }
      
      // Update homepage data on backend FIRST
      await api.put('/homepage', { customSections: updatedSections });
      
      // ONLY update UI if backend saves successfully
      setCustomSections(updatedSections);
      
      setStatus({ isOpen: true, message: 'Sections updated successfully!', type: 'success' });
      setIsSectionModalOpen(false);
      setEditingSection(null);
      setSectionForm({ title: '', subtitle: '', image: '', buttonText: '', buttonLink: '', isActive: true });
    } catch (err) {
      console.error(err);
      setStatus({ isOpen: true, message: 'Database schema sync required: Failed to store sections', type: 'error' });
    }
  };

  const deleteSection = async (index) => {
    if (!window.confirm('Are you sure you want to remove this section?')) return;
    try {
      const updatedSections = customSections.filter((_, i) => i !== index);
      // Wait for backend confirmation
      await api.put('/homepage', { customSections: updatedSections });
      
      setCustomSections(updatedSections);
      setStatus({ isOpen: true, message: 'Section removed!', type: 'success' });
    } catch (err) {
      console.error(err);
      setStatus({ isOpen: true, message: 'Failed to delete section', type: 'error' });
    }
  };

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        setSectionForm({ ...sectionForm, image: canvas.toDataURL('image/jpeg', 0.8) });
      };
    };
  };

  if (loading) return <div className="text-xs font-medium text-slate-400 animate-pulse text-center py-20 uppercase tracking-widest">Optimizing CMS...</div>;

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 pt-6 space-y-8 min-h-[600px]">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-50 pb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Home Page CMS</h2>
          <p className="text-[13px] text-slate-400 font-medium uppercase tracking-widest mt-1">Manage featured products & custom banners</p>
        </div>
        
        <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
          <button 
            onClick={() => setActiveTab('products')}
            className={`px-6 py-2 rounded-lg text-xs font-semibold transition-all uppercase tracking-wider ${activeTab === 'products' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Featured Products
          </button>
          <button 
            onClick={() => setActiveTab('sections')}
            className={`px-6 py-2 rounded-lg text-xs font-semibold transition-all uppercase tracking-wider ${activeTab === 'sections' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Custom Banners
          </button>
        </div>
      </header>

      {activeTab === 'products' ? (
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-widest flex items-center">
              <span className="w-1.5 h-4 bg-secondary rounded-full mr-3"></span> Selection Library
            </h3>
            <span className="text-[12px] font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase">
              {products.filter(p => p.featured).length} Selected
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products.map((product) => (
              <div 
                key={product.id} 
                onClick={() => toggleProductHome(product.id, product.featured)}
                className={`relative group cursor-pointer border rounded-2xl p-4 transition-all duration-300 ${product.featured ? 'border-primary bg-primary/5 shadow-md' : 'border-slate-100 hover:border-slate-300'}`}
              >
                <div className="aspect-square bg-white rounded-xl overflow-hidden mb-3 border border-slate-50">
                  <img src={product.images?.[0] || 'https://via.placeholder.com/150'} alt={product.name} className="w-full h-full object-contain p-2" />
                </div>
                <h4 className="text-[13px] font-semibold text-slate-800 line-clamp-1 uppercase tracking-tight">{product.name}</h4>
                <p className="text-[11px] text-slate-400 uppercase font-medium mt-1 truncate">{product.category}</p>
                
                {product.featured && (
                  <div className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full shadow-lg">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-widest flex items-center">
              <span className="w-1.5 h-4 bg-secondary rounded-full mr-3"></span> Banner Stacks
            </h3>
            <button 
              onClick={() => {
                setEditingSection(null);
                setSectionForm({ title: '', subtitle: '', image: '', buttonText: '', buttonLink: '', isActive: true });
                setIsSectionModalOpen(true);
              }}
              className="bg-primary text-white text-[11px] font-semibold uppercase px-6 py-2.5 rounded-lg hover:scale-105 transition-all shadow-lg shadow-primary/20"
            >
              Add New Banner
            </button>
          </div>

          <div className="space-y-4">
            {customSections.length === 0 ? (
              <div className="border-2 border-dashed border-slate-100 rounded-[2rem] py-20 text-center">
                <p className="text-[13px] text-slate-400 font-medium uppercase tracking-widest">No custom sections deployed yet</p>
              </div>
            ) : (
              customSections.map((section, idx) => (
                <div key={idx} className="bg-slate-50/50 border border-slate-100 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 group hover:border-primary/20 transition-all">
                  <div className="w-full md:w-48 h-32 bg-white rounded-2xl overflow-hidden border border-slate-100 flex-shrink-0">
                    <img src={section.image || 'https://via.placeholder.com/300x200'} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-grow space-y-1 text-center md:text-left">
                    <h4 className="text-lg font-semibold text-slate-800">{section.title}</h4>
                    <p className="text-sm text-slate-500 line-clamp-2">{section.subtitle}</p>
                    <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-2">
                       <span className="text-[10px] font-semibold bg-white px-2 py-1 rounded border border-slate-100 uppercase text-slate-400">CTA: {section.buttonText || 'None'}</span>
                       <span className={`text-[10px] font-semibold px-2 py-1 rounded uppercase ${section.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                         {section.isActive ? 'Live' : 'Hidden'}
                       </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setEditingSection(idx);
                        setSectionForm(section);
                        setIsSectionModalOpen(true);
                      }}
                      className="p-3 bg-white border border-slate-100 rounded-xl hover:border-primary transition-colors text-slate-400 hover:text-primary"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button 
                      onClick={() => deleteSection(idx)}
                      className="p-3 bg-white border border-slate-100 rounded-xl hover:border-red-500 transition-colors text-slate-400 hover:text-red-500"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* Section/Banner Modal */}
      {isSectionModalOpen && createPortal(
        <div 
          style={{ position: 'fixed', inset: 0, zIndex: 99999, backgroundColor: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)' }}
          className="flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="bg-white rounded-[2rem] w-full max-w-4xl shadow-2xl overflow-hidden border border-slate-100 font-sans flex flex-col transform transition-all h-[90vh]">
            {/* Modal Header */}
            <div className="px-8 py-5 border-b border-slate-50 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
                 </div>
                 <div>
                    <h2 className="text-lg font-medium text-slate-800 tracking-tight">
                      {editingSection !== null ? 'Modify Global Banner' : 'Compose New Banner'}
                    </h2>
                    <p className="text-[14px] text-slate-400 font-medium uppercase tracking-[0.2em]">Promote Your Culinary Specials</p>
                 </div>
              </div>
              <button onClick={() => setIsSectionModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 lg:p-10 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <label className="text-[13px] font-medium text-slate-400 uppercase tracking-widest pl-1 mb-2 block">Banner Headline</label>
                    <input 
                      type="text" 
                      value={sectionForm.title} 
                      onChange={e => setSectionForm({...sectionForm, title: e.target.value})}
                      className="w-full text-base font-medium border border-slate-100 rounded-xl px-4 py-3.5 focus:border-primary outline-none transition-all placeholder:text-slate-300 bg-slate-50/50" 
                      placeholder="e.g. Traditional Flavor, Modern Health..." 
                    />
                  </div>

                  <div>
                    <label className="text-[13px] font-medium text-slate-400 uppercase tracking-widest pl-1 mb-2 block">Supporting Subtext</label>
                    <textarea 
                      rows="6" 
                      value={sectionForm.subtitle} 
                      onChange={e => setSectionForm({...sectionForm, subtitle: e.target.value})}
                      className="w-full text-sm font-medium border border-slate-100 rounded-xl px-4 py-3.5 focus:border-primary outline-none transition-all placeholder:text-slate-300 bg-slate-50/50 resize-none" 
                      placeholder="Deep dive into the banner's message..." 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[13px] font-medium text-slate-400 uppercase tracking-widest pl-1 mb-2 block">CTA Button Label</label>
                      <input 
                        type="text" 
                        value={sectionForm.buttonText} 
                        onChange={e => setSectionForm({...sectionForm, buttonText: e.target.value})}
                        className="w-full text-sm font-medium border border-slate-100 rounded-xl px-4 py-3.5 focus:border-primary outline-none bg-slate-50/50" 
                        placeholder="Shop Grains"
                      />
                    </div>
                    <div>
                      <label className="text-[13px] font-medium text-slate-400 uppercase tracking-widest pl-1 mb-2 block">Redirect Route</label>
                      <div className="relative">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l4-4" /></svg>
                        <input 
                          type="text" 
                          value={sectionForm.buttonLink} 
                          onChange={e => setSectionForm({...sectionForm, buttonLink: e.target.value})}
                          className="w-full text-sm font-medium border border-slate-100 rounded-xl pl-11 pr-4 py-3.5 focus:border-primary outline-none bg-slate-50/50" 
                          placeholder="/products"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <label className="text-[13px] font-medium text-slate-400 uppercase tracking-widest pl-1 mb-2 block">Visual Asset</label>
                    <div 
                      onClick={() => document.getElementById('banner-asset').click()}
                      className="relative group h-64 rounded-[1.5rem] border-2 border-dashed border-slate-100 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all overflow-hidden"
                    >
                      {sectionForm.image ? (
                        <img src={sectionForm.image} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <div className="text-center space-y-3">
                          <div className="w-12 h-12 bg-white rounded-2xl mx-auto shadow-sm flex items-center justify-center text-slate-300 group-hover:text-primary transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </div>
                          <div>
                            <p className="text-[14px] text-slate-800 font-medium uppercase tracking-widest">Select Image</p>
                            <p className="text-[12px] text-slate-400 uppercase font-medium mt-1">High resolution recommended</p>
                          </div>
                        </div>
                      )}
                      <input id="banner-asset" type="file" onChange={(e) => handleImageUpload(e.target.files[0])} className="hidden" accept="image/*" />
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex justify-between items-center">
                    <div>
                        <p className="text-[14px] font-medium text-slate-800 uppercase tracking-widest">Live Status</p>
                        <p className="text-[13px] font-medium text-slate-400 uppercase mt-0.5">{sectionForm.isActive ? 'Active' : 'Hidden'}</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setSectionForm(prev => ({ ...prev, isActive: !prev.isActive }))}
                      className={`w-12 h-6 rounded-full transition-all relative ${sectionForm.isActive ? 'bg-primary' : 'bg-slate-300'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${sectionForm.isActive ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-6 bg-slate-50 border-t border-slate-50 flex gap-4 justify-end items-center shrink-0">
              <div className="flex gap-3">
                 <button 
                   onClick={() => setIsSectionModalOpen(false)} 
                   className="px-8 py-3 text-slate-500 font-medium text-[14px] uppercase tracking-widest hover:bg-slate-100 rounded-2xl transition"
                 >
                   Discard
                 </button>
                 <button 
                   onClick={handleSectionSave}
                   className="px-12 py-3 bg-primary text-white font-medium text-[14px] uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                 >
                   {editingSection !== null ? 'Save Changes' : 'Deploy Banner'}
                 </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      <StatusPopup
        isOpen={status.isOpen}
        message={status.message}
        type={status.type}
        onClose={() => setStatus({ ...status, isOpen: false })}
      />
    </div>
  );
};

export default CMSManager;
