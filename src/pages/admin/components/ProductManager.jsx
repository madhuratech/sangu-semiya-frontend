import { useState, useEffect } from 'react';
import api from '../../../utils/api';
import ProductModal from './ProductModal';
import { ImportModal, ExportModal } from './ImportExportModals';
import StatusPopup from './StatusPopup';
import ConfirmPopup from './ConfirmPopup';


const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Status Notification State
  const [status, setStatus] = useState({ isOpen: false, message: '', type: 'success' });
  
  // Custom Confirmation State
  const [confirm, setConfirm] = useState({ isOpen: false, productId: null });


  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products');
      setProducts(res.data);
      setFilteredProducts(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  // Search Logic
  useEffect(() => {
    let result = products;
    if (searchTerm) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    setFilteredProducts(result);
  }, [searchTerm, products]);

  const showStatus = (message, type = 'success') => {
    setStatus({ isOpen: true, message, type });
  };

  const openDeleteConfirm = (id) => {
    setConfirm({ isOpen: true, productId: id });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/products/${confirm.productId}`);
      showStatus('Inventory removed successfully');
      setConfirm({ isOpen: false, productId: null });
      loadProducts();
    } catch (err) {
      showStatus(err.response?.data?.message || 'Deletion failed', 'error');
    }
  };


  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const openNewProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  if (loading) return <div className="text-xs font-semibold text-primary animate-pulse tracking-widest uppercase py-10">Updating Sync...</div>;

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-6 justify-between items-center">
        
        <div className="flex flex-1 w-full">
          <div className="relative flex-1 group">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input 
              type="text" 
              placeholder="Search products by name or SKU..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-transparent focus:border-slate-200 focus:bg-white rounded-2xl outline-none text-sm font-medium transition-all text-slate-600"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button onClick={() => setIsImportModalOpen(true)} className="px-5 py-3.5 border border-slate-200 rounded-2xl flex items-center gap-2 hover:bg-slate-50 transition text-slate-500 font-semibold uppercase text-[10px] tracking-tight whitespace-nowrap"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"/></svg> Import</button>
          <button onClick={() => setIsExportModalOpen(true)} className="px-5 py-3.5 border border-slate-200 rounded-2xl flex items-center gap-2 hover:bg-slate-50 transition text-slate-500 font-semibold uppercase text-[10px] tracking-tight whitespace-nowrap"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg> Export</button>
          <button onClick={loadProducts} className="p-3.5 border border-slate-200 rounded-2xl hover:bg-slate-50 transition text-slate-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg></button>
          <button onClick={openNewProduct} className="flex-1 lg:flex-none px-8 py-3.5 bg-primary text-white rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-red-100 hover:bg-primary-dark transition-all text-sm font-semibold uppercase tracking-tight">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg> Add Product
          </button>
        </div>

      </div>

      {/* Main Table Area */}
      <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase text-slate-400 font-bold tracking-[0.15em]">
              <tr>
                <th className="px-8 py-6">Product</th>
                <th className="px-6 py-6 font-bold">Category</th>
                <th className="px-6 py-6 font-bold">SKU</th>
                <th className="px-6 py-6 font-bold">Amazon Link</th>
                <th className="px-6 py-6 font-bold">Pack Size</th>
                <th className="px-6 py-6 font-bold text-center">Status</th>
                <th className="px-8 py-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {filteredProducts.map(p => (
                <tr key={p.id || p._id || Math.random()} className="hover:bg-slate-50/30 transition duration-300 group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 flex items-center justify-center">
                         {p?.images?.[0] ? (
                           <img src={p.images[0]} className="w-full h-full object-cover" alt="" />
                         ) : (
                           <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                         )}
                      </div>
                      <div className="font-semibold text-slate-700 tracking-tight">{p.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-5"><span className="text-xs font-medium text-slate-500">{p.category || 'General'}</span></td>
                  <td className="px-6 py-5"><span className="text-xs font-medium text-slate-400 uppercase tracking-tighter">{p.sku || 'N/A'}</span></td>
                  <td className="px-6 py-5">
                    {p.amazonLink ? (
                      <a href={p.amazonLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 font-semibold text-[10px] hover:underline flex items-center gap-1 uppercase tracking-tighter">
                         View Link <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                      </a>
                    ) : (
                      <span className="text-slate-300 text-[10px] font-semibold uppercase tracking-tighter italic">Not Linked</span>
                    )}
                  </td>
                  <td className="px-6 py-5 font-medium text-slate-600">{p.packSize || 'N/A'}</td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-4 py-2 rounded-[1rem] text-[10px] font-semibold uppercase tracking-tighter border ${p.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-300 border-slate-200'}`}>
                      {p.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-3 text-slate-300">
                       <button onClick={() => handleEdit(p)} className="hover:text-blue-500 transition-colors">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                       </button>
                        <button onClick={() => openDeleteConfirm(p.id || p._id)} className="hover:text-red-400 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="p-20 text-center">
              <p className="text-slate-300 font-semibold uppercase text-xs tracking-widest italic animate-pulse">No matches found in inventory.</p>
            </div>
          )}
        </div>
      </div>

      <ProductModal 
        isOpen={isProductModalOpen} 
        onClose={() => setIsProductModalOpen(false)} 
        product={editingProduct}
        refreshProducts={loadProducts}
        onSuccess={(msg) => showStatus(msg, 'success')}
      />
      <ImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} refreshProducts={loadProducts} />
      <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />

      <ConfirmPopup 
        isOpen={confirm.isOpen}
        onClose={() => setConfirm({ ...confirm, isOpen: false })}
        onConfirm={confirmDelete}
        title="Remove From Inventory?"
        message="This operation is irreversible. All associated data will be purged from the administration system."
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

export default ProductManager;
