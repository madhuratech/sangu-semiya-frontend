import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';
import api from '../../../utils/api';
import { FiX, FiSearch, FiCheck, FiPackage, FiInfo } from 'react-icons/fi';

const AssignProductsModal = ({ isOpen, onClose, category, allProducts, refresh, onSuccess }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category && isOpen) {
      const alreadyAssigned = allProducts
        .filter(p => p.category === category.name || p.categoryId === (category.id || category._id))
        .map(p => p.id || p._id);
      setSelectedProductIds(new Set(alreadyAssigned));
    }
  }, [category, isOpen, allProducts]);

  if (!isOpen || !category) return null;

  const toggleProduct = (id) => {
    const next = new Set(selectedProductIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedProductIds(next);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // In a real backend, we might have a specific endpoint for this.
      // Here we might need to update each product's category.
      // For simplicity in this mockup/frontend implementation:
      await api.post(`/categories/${category.id || category._id}/assign-products`, {
        productIds: Array.from(selectedProductIds)
      });
      
      onSuccess('Products Assigned Successfully');
      refresh();
      onClose();
    } catch (err) {
      // Fallback: If the endpoint doesn't exist, we could manually update each product, 
      // but let's assume the specialized endpoint exists or should be added.
      console.error(err);
      alert('Failed to assign products. Please ensure the backend endpoint /categories/:id/assign-products exists.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = allProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
       <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 flex flex-col animate-scale-in" style={{ maxHeight: '85vh' }}>
          
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10 shrink-0">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                   <FiPackage size={20} />
                </div>
                <div>
                   <h2 className="text-lg font-bold text-slate-800 tracking-tight leading-none">Assign Products</h2>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Target: {category.name}</p>
                </div>
             </div>
             <button onClick={onClose} className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-2xl transition-all text-slate-400 hover:text-slate-600 border border-transparent hover:border-slate-100">
               <FiX size={20} />
             </button>
          </div>

          {/* Search bar */}
          <div className="px-8 py-4 border-b border-slate-50 bg-slate-50/30 shrink-0">
             <div className="relative group">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search inventory..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-primary focus:bg-white text-sm font-medium transition-all text-slate-600 bg-white"
                />
             </div>
          </div>

          {/* List Area */}
          <div className="flex-1 overflow-y-auto px-8 py-4 custom-scrollbar">
             <div className="space-y-2">
                {filteredProducts.length === 0 ? (
                  <div className="py-20 text-center text-xs text-slate-300 font-bold uppercase tracking-widest italic">No products found.</div>
                ) : (
                  filteredProducts.map(prod => {
                    const id = prod.id || prod._id;
                    const isSelected = selectedProductIds.has(id);
                    return (
                      <div 
                        key={id} 
                        onClick={() => toggleProduct(id)}
                        className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer group transition-all ${isSelected ? 'bg-slate-900 border-slate-900 shadow-md shadow-slate-200' : 'bg-white border-slate-100 hover:border-slate-300'}`}
                      >
                         <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-lg overflow-hidden border flex items-center justify-center transition-colors ${isSelected ? 'bg-white/10 border-white/20' : 'bg-slate-50 border-slate-200'}`}>
                               {prod.images?.[0] ? <img src={prod.images[0]} className="w-full h-full object-cover" /> : <FiPackage className={isSelected ? 'text-white' : 'text-slate-300'} size={14} />}
                            </div>
                            <div>
                               <h4 className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-700'}`}>{prod.name}</h4>
                               <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${isSelected ? 'text-slate-400' : 'text-slate-300'}`}>{prod.sku || 'No SKU'}</p>
                            </div>
                         </div>
                         <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${isSelected ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-50 text-transparent border border-slate-200 group-hover:border-slate-300'}`}>
                            <FiCheck size={14} strokeWidth={3} />
                         </div>
                      </div>
                    );
                  })
                )}
             </div>
          </div>

          <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center shrink-0">
             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedProductIds.size} Selective Targets</div>
             <div className="flex gap-3">
                <button onClick={onClose} className="px-6 py-3 bg-white border border-slate-200 text-slate-500 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                   Cancel
                </button>
                <button onClick={handleSave} disabled={loading} className="px-8 py-3 bg-primary text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg shadow-red-100 disabled:opacity-50">
                   {loading ? 'Processing...' : 'Confirm Assignments'}
                </button>
             </div>
          </div>
       </div>
    </div>,
    document.body
  );
};

export default AssignProductsModal;
