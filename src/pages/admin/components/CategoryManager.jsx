import { useState, useEffect } from 'react';
import api from '../../../utils/api';
import { FiPlus, FiEdit3, FiTrash2, FiChevronDown, FiChevronUp, FiRefreshCw, FiGrid, FiPackage, FiSearch } from 'react-icons/fi';
import CategoryModal from './CategoryModal';
import AssignProductsModal from './AssignProductsModal';
import ConfirmPopup from './ConfirmPopup';
import StatusPopup from './StatusPopup';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Modals
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [assigningCategory, setAssigningCategory] = useState(null);
  const [confirm, setConfirm] = useState({ isOpen: false, id: null });
  const [status, setStatus] = useState({ isOpen: false, message: '', type: 'success' });

  const loadData = async () => {
    setLoading(true);
    try {
      const [catRes, prodRes] = await Promise.all([
        api.get('/categories'),
        api.get('/products')
      ]);
      setCategories(catRes.data);
      setProducts(prodRes.data);
    } catch (err) {
      console.error('Failed to load categories/products. If endpoint is missing, this is expected.', err);
      // For now, if it fails, let's keep empty arrays so the UI doesn't crash
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const toggleRow = (id) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  const showStatus = (message, type = 'success') => setStatus({ isOpen: true, message, type });

  const handleDelete = async () => {
    try {
      await api.delete(`/categories/${confirm.id}`);
      showStatus('Category removed');
      setConfirm({ isOpen: false, id: null });
      loadData();
    } catch (err) {
      showStatus('Failed to delete category', 'error');
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-xs font-medium text-primary animate-pulse tracking-widest uppercase py-10">Syncing Categories...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-6">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
               <FiGrid size={24} strokeWidth={2.5} />
            </div>
            <div>
               <h1 className="text-2xl font-medium text-slate-800 tracking-tighter leading-none mb-1">Categories</h1>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Management Intelligence</p>
            </div>
         </div>
         
         <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <div className="relative group flex-1 lg:min-w-[320px]">
               <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-primary transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search categories..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 focus:border-primary focus:bg-white rounded-[1.25rem] outline-none text-sm font-bold transition-all text-slate-600 shadow-inner"
               />
            </div>
            
            <div className="flex items-center gap-3">
               <button onClick={loadData} className="w-12 h-12 flex items-center justify-center border border-slate-200 rounded-[1.25rem] text-slate-400 hover:bg-slate-50 hover:text-primary transition-all shadow-sm" title="Refresh Inventory">
                  <FiRefreshCw size={18} />
               </button>
               <div className="px-6 py-4 bg-amber-50 border border-amber-100 rounded-[1.25rem] text-amber-600">
                  <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Stock</p>
                  <p className="text-sm font-bold leading-none">{categories.length} ACTIVE</p>
               </div>
               <button onClick={() => { setEditingCategory(null); setIsCategoryModalOpen(true); }} className="px-10 py-4 bg-primary text-white rounded-[1.25rem] font-medium text-xs uppercase tracking-widest shadow-xl shadow-red-100 hover:bg-primary-dark transition-all flex items-center gap-2">
                  <FiPlus strokeWidth={2} /> NEW CATEGORY
               </button>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden">
         {filteredCategories.length === 0 ? (
           <div className="p-20 text-center">
             <p className="text-slate-300 font-medium uppercase text-xs tracking-widest italic animate-pulse">No categories found.</p>
           </div>
         ) : (
           <div className="divide-y divide-slate-50">
             {filteredCategories.map((cat) => {
               const id = cat.id || cat._id;
               const assignedProducts = products.filter(p => (p.category === cat.name || p.categoryId === id));
               const isExpanded = expandedRows.has(id);

               return (
                 <div key={id} className="group">
                    {/* Parent Row */}
                    <div className="flex items-center justify-between p-6 hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => toggleRow(id)}>
                       <div className="flex items-center gap-5">
                          <button className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-2xl text-slate-400 group-hover:text-primary transition-all">
                             {isExpanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                          </button>
                          <div>
                             <h3 className="font-medium text-slate-800 tracking-tight">{cat.name}</h3>
                             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{assignedProducts.length} Products Assigned</p>
                          </div>
                       </div>

                       <div className="flex items-center gap-3">
                          <button onClick={(e) => { e.stopPropagation(); setAssigningCategory(cat); setIsAssignModalOpen(true); }} className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 font-bold text-[11px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all">
                             <FiPlus /> Assign Products
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); setEditingCategory(cat); setIsCategoryModalOpen(true); }} className="w-10 h-10 flex items-center justify-center rounded-xl bg-amber-50 text-amber-500 border border-amber-100 hover:bg-amber-100 transition-all">
                             <FiEdit3 size={18} />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); setConfirm({ isOpen: true, id: id }); }} className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-400 border border-red-100 hover:bg-red-100 transition-all">
                             <FiTrash2 size={18} />
                          </button>
                       </div>
                    </div>

                    {/* Child Products List */}
                    {isExpanded && (
                      <div className="bg-slate-50/30 border-t border-slate-50 px-20 py-4 animate-fade-in">
                         {assignedProducts.length === 0 ? (
                           <div className="py-4 text-xs italic text-slate-400 font-medium tracking-tight">No products assigned specifically to this category yet.</div>
                         ) : (
                           <div className="space-y-4">
                             {assignedProducts.map(prod => (
                               <div key={prod.id || prod._id} className="flex items-center gap-4 group/item">
                                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400 shadow-sm overflow-hidden">
                                     {prod.images?.[0] ? <img src={prod.images[0]} className="w-full h-full object-cover" /> : 'P'}
                                  </div>
                                  <span className="text-sm font-medium text-slate-600 transition-colors group-hover/item:text-slate-900">{prod.name}</span>
                               </div>
                             ))}
                           </div>
                         )}
                      </div>
                    )}
                 </div>
               );
             })}
           </div>
         )}
      </div>

      <CategoryModal 
        isOpen={isCategoryModalOpen} 
        onClose={() => setIsCategoryModalOpen(false)} 
        category={editingCategory}
        refresh={loadData}
        onSuccess={(msg) => showStatus(msg, 'success')}
      />

      <AssignProductsModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        category={assigningCategory}
        allProducts={products}
        refresh={loadData}
        onSuccess={(msg) => showStatus(msg, 'success')}
      />

      <ConfirmPopup 
        isOpen={confirm.isOpen}
        onClose={() => setConfirm({ ...confirm, isOpen: false })}
        onConfirm={handleDelete}
        title="Remove Category?"
        message="Deleting this category will unassign all products. This action cannot be undone."
      />

      <StatusPopup 
        isOpen={status.isOpen}
        message={status.message}
        type={status.type}
        onClose={() => setStatus({ ...status, isOpen: false })}
      />
    </div>
  );
};

export default CategoryManager;
