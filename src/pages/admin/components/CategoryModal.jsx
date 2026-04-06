import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';
import api from '../../../utils/api';
import { FiX, FiCheck, FiFolder, FiType, FiInfo } from 'react-icons/fi';

const CategoryModal = ({ isOpen, onClose, category, refresh, onSuccess }) => {
  const [formData, setFormData] = useState({ name: '', description: '', status: 'Active' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        status: category.status || 'Active'
      });
    } else {
      setFormData({ name: '', description: '', status: 'Active' });
    }
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (category) {
        await api.put(`/categories/${category.id || category._id}`, formData);
        onSuccess('Category Updated Successfully');
      } else {
        await api.post('/categories', formData);
        onSuccess('New Category Created');
      }
      refresh();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full text-sm border border-slate-200 rounded-2xl px-4 py-3.5 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-slate-300 font-medium";
  const labelCls = "text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-2 block ml-1";

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
       <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 flex flex-col animate-scale-in">
          
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                   <FiFolder size={20} strokeWidth={2.5} />
                </div>
                <div>
                   <h2 className="text-lg font-bold text-slate-800 tracking-tight leading-none">
                      {category ? 'Edit Category' : 'Create Category'}
                   </h2>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Classification Intelligence</p>
                </div>
             </div>
             <button onClick={onClose} className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-2xl transition-all text-slate-400 hover:text-slate-600 border border-transparent hover:border-slate-100">
               <FiX size={20} />
             </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
             <div>
                <label className={labelCls}>Category Identity</label>
                <div className="relative group">
                   <FiType className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-primary transition-colors" />
                   <input 
                     required 
                     type="text" 
                     value={formData.name} 
                     onChange={e => setFormData({ ...formData, name: e.target.value })} 
                     className={inputCls + " pl-12"} 
                     placeholder="e.g. Signature Blend" 
                   />
                </div>
             </div>

             <div>
                <label className={labelCls}>Brief Narrative</label>
                <div className="relative group">
                   <FiInfo className="absolute left-4 top-4 text-slate-300 group-hover:text-primary transition-colors" />
                   <textarea 
                     rows="3" 
                     value={formData.description} 
                     onChange={e => setFormData({ ...formData, description: e.target.value })} 
                     className={inputCls + " pl-12 resize-none"} 
                     placeholder="How would you describe this collection?" 
                   />
                </div>
             </div>

             <div className="pt-2">
                <label className={labelCls}>Visibility Status</label>
                <div className="flex gap-2">
                   {['Active', 'Inactive'].map(s => (
                     <button
                       key={s}
                       type="button"
                       onClick={() => setFormData({ ...formData, status: s })}
                       className={`flex-1 py-3.5 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all border ${formData.status === s ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200' : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'}`}
                     >
                       {s}
                     </button>
                   ))}
                </div>
             </div>

             <div className="pt-4 flex gap-3">
                <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-50 text-slate-500 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-all">
                   Cancel
                </button>
                <button type="submit" disabled={loading} className="flex-[2] py-4 bg-primary text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg shadow-red-100 disabled:opacity-50">
                   {loading ? 'Processing...' : category ? 'Save Changes' : 'Confirm Creation'}
                </button>
             </div>
          </form>
       </div>
    </div>,
    document.body
  );
};

export default CategoryModal;
