import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import { FiX, FiExternalLink, FiShoppingBag, FiLayers, FiPackage, FiZap, FiInfo } from 'react-icons/fi';

const ProductPreviewModal = ({ isOpen, onClose, product }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const mainImage = product.images?.[0] || null;
  const metadata = product.metadata || {};
  const statusCls = product.status === 'Active' 
    ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
    : 'bg-slate-50 text-slate-400 border-slate-200';

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-[2rem] w-full max-w-4xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col animate-scale-in" style={{ maxHeight: '90vh' }}>
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                <FiShoppingBag size={20} />
             </div>
             <div>
                <h2 className="text-lg font-bold text-slate-800 tracking-tight leading-none">{product.name}</h2>
                <p className="text-[12px] font-medium text-slate-400 uppercase tracking-widest mt-1">Product Intelligence Preview</p>
             </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-2xl transition-all text-slate-400 hover:text-slate-600 border border-transparent hover:border-slate-100">
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Column: Visuals */}
            <div className="space-y-6">
               <div className="aspect-square rounded-3xl bg-slate-50 border border-slate-100 overflow-hidden relative group">
                  {mainImage ? (
                    <img src={mainImage} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                       <FiPackage size={48} className="mb-2 opacity-20" />
                       <span className="text-xs font-semibold uppercase tracking-widest">No Image Found</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                     <span className={`px-4 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider border shadow-sm ${statusCls}`}>
                        {product.status || 'Active'}
                     </span>
                  </div>
               </div>

               {/* Stats Grid */}
               <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                     <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5 opacity-70">
                        <FiLayers size={10} /> SKU Code
                     </p>
                     <p className="text-sm font-bold text-slate-700 uppercase">{product.sku || 'N/A'}</p>
                  </div>
                  <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                     <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5 opacity-70">
                        <FiPackage size={10} /> Pack Size
                     </p>
                     <p className="text-sm font-bold text-slate-700">{product.packSize || 'N/A'}</p>
                  </div>
               </div>

               {product.amazonLink && (
                 <a href={product.amazonLink} target="_blank" rel="noopener noreferrer" 
                    className="flex items-center justify-center gap-2 w-full py-4 bg-amber-500/10 text-amber-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all group overflow-hidden relative border border-amber-200/50">
                    <span className="relative z-10 flex items-center gap-2">View On Amazon <FiExternalLink size={14} /></span>
                 </a>
               )}
            </div>

            {/* Right Column: Info */}
            <div className="space-y-8">
               
               <div>
                  <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                     <FiInfo size={12} className="text-primary" /> Story & Description
                  </h3>
                  <div className="text-sm text-slate-600 leading-relaxed font-medium bg-slate-50/30 p-5 rounded-2xl border border-slate-100">
                     {product.description || 'No description provided for this product.'}
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                       <FiZap size={12} className="text-amber-500" /> Key Features
                    </h3>
                    <ul className="space-y-3">
                       {metadata.features?.length > 0 ? (
                         metadata.features.map((f, i) => (
                           <li key={i} className="flex items-start gap-3">
                              <span className="shrink-0 w-5 h-5 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center text-[10px]">✔</span>
                              <span className="text-xs font-semibold text-slate-600 leading-tight">{f.label}</span>
                           </li>
                         ))
                       ) : (
                         <li className="text-xs text-slate-400 italic">No features listed</li>
                       )}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                       <FiLayers size={12} className="text-blue-500" /> Nutrition
                    </h3>
                    <div className="space-y-2.5">
                       {metadata.nutrition?.length > 0 ? (
                         metadata.nutrition.map((n, i) => (
                           <div key={i} className="flex justify-between items-center pb-2 border-b border-slate-50 last:border-0">
                              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">{n.label}</span>
                              <span className="text-xs font-black text-slate-700">{n.value}</span>
                           </div>
                         ))
                       ) : (
                         <span className="text-xs text-slate-400 italic">Not available</span>
                       )}
                    </div>
                  </div>
               </div>

               <div className="pt-4">
                  <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-200 relative overflow-hidden group">
                     {/* Decorative background */}
                     <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
                     
                     <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">Current Intelligence Price</p>
                     <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black tracking-tighter">₹{product.price || '0'}</span>
                        <span className="text-[10px] font-medium text-slate-500 line-through opacity-50">MRP. {parseInt(product.price || 0) + 10}</span>
                     </div>
                     <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-400/10 w-fit px-3 py-1 rounded-full border border-emerald-400/20">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Live on Portal
                     </div>
                  </div>
               </div>

            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Added {new Date(product.createdAt || Date.now()).toLocaleDateString()}</p>
           <button onClick={onClose} className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
              Close Preview
           </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProductPreviewModal;
