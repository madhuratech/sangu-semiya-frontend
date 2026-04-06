import { useState, useEffect } from 'react';
import api from '../../../utils/api';
import ProductModal from './ProductModal';
import ProductPreviewModal from './ProductPreviewModal';
import { ImportModal, ExportModal } from './ImportExportModals';
import StatusPopup from './StatusPopup';
import ConfirmPopup from './ConfirmPopup';
import { FiEye, FiEdit3, FiTrash2 } from 'react-icons/fi';


const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [previewingProduct, setPreviewingProduct] = useState(null);

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

  const openDeleteConfirm = (id, e) => {
    if (e) e.stopPropagation();
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


  const handleEdit = (product, e) => {
    if (e) e.stopPropagation();
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handlePreview = (product, e) => {
    if (e) e.stopPropagation();
    setPreviewingProduct(product);
    setIsPreviewModalOpen(true);
  };

  const openNewProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  if (loading) return <div className="text-xs font-medium text-primary animate-pulse tracking-widest uppercase py-10">Updating Sync...</div>;

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
          <button onClick={() => setIsImportModalOpen(true)} className="px-5 py-3.5 border border-slate-200 rounded-2xl flex items-center gap-2 hover:bg-slate-50 transition text-slate-500 font-medium uppercase text-[14px] tracking-tight whitespace-nowrap"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"/></svg> Import</button>
          <button onClick={() => setIsExportModalOpen(true)} className="px-5 py-3.5 border border-slate-200 rounded-2xl flex items-center gap-2 hover:bg-slate-50 transition text-slate-500 font-medium uppercase text-[14px] tracking-tight whitespace-nowrap"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg> Export</button>
          <button onClick={loadProducts} className="p-3.5 border border-slate-200 rounded-2xl hover:bg-slate-50 transition text-slate-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg></button>
          <button onClick={openNewProduct} className="flex-1 lg:flex-none px-8 py-3.5 bg-primary text-white rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-red-100 hover:bg-primary-dark transition-all text-sm font-medium uppercase tracking-tight">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg> Add Product
          </button>
        </div>

      </div>

      {/* Main Table Area */}
      <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100 text-[14px] uppercase text-slate-400 font-medium tracking-[0.15em]">
              <tr>
                <th className="px-8 py-6 font-medium">Product</th>
                <th className="px-6 py-6 font-medium">Category</th>
                <th className="px-6 py-6 font-medium">SKU</th>
                <th className="px-6 py-6 font-medium">Amazon Link</th>
                <th className="px-6 py-6 font-medium">Pack Size</th>
                <th className="px-6 py-6 font-medium text-center">Status</th>
                <th className="px-8 py-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
               {filteredProducts.map(p => (
                <tr 
                  key={p.id || p._id || Math.random()} 
                  onClick={() => handleEdit(p)}
                  className="hover:bg-slate-50/50 transition duration-300 group cursor-pointer"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 flex items-center justify-center">
                         {p?.images?.[0] ? (
                           <img src={p.images[0]} className="w-full h-full object-cover" alt="" />
                         ) : (
                           <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                         )}
                      </div>
                      <div className="font-medium text-slate-700 tracking-tight">{p.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-5"><span className="text-xs font-medium text-slate-500">{p.category || 'General'}</span></td>
                  <td className="px-6 py-5"><span className="text-xs font-medium text-slate-400 uppercase tracking-tighter">{p.sku || 'N/A'}</span></td>
                  <td className="px-6 py-5">
                    {p.amazonLink ? (
                      <a href={p.amazonLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 font-medium text-[14px] hover:underline flex items-center gap-1 uppercase tracking-tighter">
                         View Link <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                      </a>
                    ) : (
                      <span className="text-slate-300 text-[14px] font-medium uppercase tracking-tighter italic">Not Linked</span>
                    )}
                  </td>
                  <td className="px-6 py-5 font-medium text-slate-600">{p.packSize || 'N/A'}</td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-4 py-2 rounded-[1rem] text-[14px] font-medium uppercase tracking-tighter border ${p.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-300 border-slate-200'}`}>
                      {p.status || 'Active'}
                    </span>
                  </td>
                   <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-3 text-slate-300">
                       <button 
                         onClick={(e) => handlePreview(p, e)} 
                         className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-blue-50 hover:text-blue-500 transition-all border border-transparent hover:border-blue-100"
                         title="Preview Product"
                       >
                         <FiEye size={18} />
                       </button>
                       <button 
                         onClick={(e) => handleEdit(p, e)} 
                         className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-amber-50 hover:text-amber-500 transition-all border border-transparent hover:border-amber-100"
                         title="Edit Product"
                       >
                         <FiEdit3 size={18} />
                       </button>
                       <button 
                         onClick={(e) => openDeleteConfirm(p.id || p._id, e)} 
                         className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-red-50 hover:text-red-400 transition-all border border-transparent hover:border-red-100"
                         title="Delete Product"
                       >
                         <FiTrash2 size={18} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="p-20 text-center">
              <p className="text-slate-300 font-medium uppercase text-xs tracking-widest italic animate-pulse">No matches found in inventory.</p>
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
      <ProductPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        product={previewingProduct}
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
