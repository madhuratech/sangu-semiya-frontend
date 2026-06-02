import React from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiMail, FiMessageCircle, FiPhone, FiCalendar, FiBox, FiClipboard } from 'react-icons/fi';

const EnquiryDetailsModal = ({ isOpen, onClose, enquiry }) => {
  if (!isOpen || !enquiry) return null;

  const handleWhatsApp = () => {
    const text = `Hi ${enquiry.name}, we received your enquiry for ${enquiry.product || 'our products'} on Sangu Brand Semiya. How can we help you today?`;
    window.open(`https://wa.me/${enquiry.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleEmail = () => {
    const subject = `Regarding your Enquiry on Sangu Brand Semiya`;
    const body = `Hi ${enquiry.name},\n\nThank you for reaching out to us regarding ${enquiry.product || 'our products'}.\n\n(Write your response here)`;
    window.open(`mailto:${enquiry.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden animate-slide-up border border-slate-100">
        
        {/* Header */}
        <div className="px-8 py-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-lg font-medium text-slate-800 tracking-tight">Lead Details</h2>
            <p className="text-[14px] text-slate-400 font-medium uppercase tracking-widest mt-1">Ref ID: {enquiry._id?.slice(-8)}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <FiX size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Customer Info */}
          <div className="space-y-4">
             <h3 className="text-[14px] font-medium text-primary uppercase tracking-widest flex items-center gap-2">
                Customer Information
             </h3>
             <div className="grid grid-cols-1 gap-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 shrink-0 border border-slate-200 shadow-sm">
                    <FiClipboard size={16} />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium uppercase text-slate-400 tracking-wider mb-0.5">Name</p>
                    <p className="text-sm font-medium text-slate-800">{enquiry.name}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 shrink-0 border border-slate-200 shadow-sm">
                      <FiPhone size={16} />
                    </div>
                    <div>
                      <p className="text-[14px] font-medium uppercase text-slate-400 tracking-wider mb-0.5">Phone</p>
                      <p className="text-sm font-medium text-slate-800">{enquiry.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 shrink-0 border border-slate-200 shadow-sm">
                      <FiMail size={16} />
                    </div>
                    <div>
                      <p className="text-[14px] font-medium uppercase text-slate-400 tracking-wider mb-0.5">Email</p>
                      <p className="text-sm font-medium text-slate-800 truncate">{enquiry.email || 'N/A'}</p>
                    </div>
                  </div>
                </div>
             </div>
          </div>

          <div className="h-px bg-slate-100"></div>

          {/* Enquiry Details */}
          <div className="space-y-4">
             <h3 className="text-[14px] font-medium text-primary uppercase tracking-widest flex items-center gap-2">
                Requirements
             </h3>
             <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 shrink-0 border border-slate-200 shadow-sm">
                    <FiBox size={16} />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium uppercase text-slate-400 tracking-wider mb-0.5">Product</p>
                    <p className="text-sm font-medium text-primary">{enquiry.product || 'General'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 shrink-0 border border-slate-200 shadow-sm">
                    <FiCalendar size={16} />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium uppercase text-slate-400 tracking-wider mb-0.5">Quantity</p>
                    <p className="text-sm font-medium text-slate-800">{enquiry.quantity}</p>
                  </div>
                </div>
             </div>
             {enquiry.message && (
               <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative mt-4">
                 <p className="text-[13px] font-medium uppercase text-slate-400 absolute -top-2 left-4 bg-white px-1 tracking-widest">Message</p>
                 <p className="text-xs text-slate-600 leading-relaxed font-medium">{enquiry.message}</p>
               </div>
             )}
          </div>
        </div>

        {/* Footer / Actions */}
        <div className="px-8 py-6 bg-slate-50 border-t border-slate-200 flex gap-4">
          <button 
            onClick={handleWhatsApp}
            className="flex-1 bg-[#25D366] hover:bg-[#1ebe5d] text-white py-3.5 rounded-xl font-medium text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-emerald-50 transition-all active:scale-95"
          >
            <FiMessageCircle size={16} /> Respond via WhatsApp
          </button>
          {enquiry.email && (
            <button 
              onClick={handleEmail}
              className="flex-1 bg-slate-800 hover:bg-black text-white py-3.5 rounded-xl font-medium text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-slate-100 transition-all active:scale-95"
            >
              <FiMail size={16} /> Respond via Email
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EnquiryDetailsModal;
