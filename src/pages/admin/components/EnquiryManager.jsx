import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../../../utils/api';
import StatusPopup from './StatusPopup';
import ConfirmPopup from './ConfirmPopup';
import EnquiryDetailsModal from './EnquiryDetailsModal';
import { FiEye, FiTrash2, FiClock, FiActivity, FiCheckCircle, FiMail } from 'react-icons/fi';

const EnquiryManager = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ isOpen: false, message: '', type: 'success' });
  const [confirm, setConfirm] = useState({ isOpen: false, id: null });
  const [viewModal, setViewModal] = useState({ isOpen: false, enquiry: null });
  const [activeTab, setActiveTab] = useState('Instant'); // 'Instant' or 'Product'
  const loadEnquiries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/enquiry');
      const data = res.data.map(e => ({ ...e, _id: e._id || e.id }));
      setEnquiries(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadEnquiries(); }, [loadEnquiries]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/enquiry/${id}/status`, { status: newStatus });
      setEnquiries(enquiries.map(e => e._id === id ? { ...e, status: newStatus } : e));
      setStatus({ isOpen: true, message: `Status updated to ${newStatus}`, type: 'success' });
    } catch (err) {
      setStatus({ isOpen: true, message: 'Failed to update status', type: 'error' });
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/enquiry/${confirm.id}`);
      setEnquiries(enquiries.filter(e => e._id !== confirm.id));
      setStatus({ isOpen: true, message: 'Enquiry deleted successfully', type: 'success' });
      setConfirm({ isOpen: false, id: null });
    } catch (err) {
      setStatus({ isOpen: true, message: 'Failed to delete enquiry', type: 'error' });
    }
  };

  const getStatusColor = (status) => {
    if (status === 'Resolved') return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    if (status === 'In-Progress') return 'bg-blue-50 text-blue-600 border-blue-200';
    return 'bg-amber-50 text-amber-600 border-amber-200';
  };

  const filteredData = useMemo(() => {
    return enquiries.filter(e => {
       if (e.type) return e.type === activeTab;
       // Inference logic for records without an explicit type
       const isInstant = e.message === 'Sent from Instant Enquiry form';
       if (activeTab === 'Instant') return isInstant;
       if (activeTab === 'Product') return !isInstant;
       return true;
    });
  }, [enquiries, activeTab]);

  if (loading) return (
     <div className="flex flex-col items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm text-slate-500 font-medium">Synchronizing records...</p>
     </div>
  );

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Tab Header Component */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-lg font-medium text-slate-800 tracking-tight">Record Keeper</h2>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('Instant')}
            className={`px-6 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-all ${activeTab === 'Instant' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Instant Enquiries
          </button>
          <button 
            onClick={() => setActiveTab('Product')}
            className={`px-6 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-all ${activeTab === 'Product' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Bulk Orders
          </button>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#fcfdff] border-b border-slate-200">
              <tr className="text-[15px] font-medium text-slate-500 uppercase tracking-widest">
                <th className="px-6 py-5">Time Received</th>
                <th className="px-6 py-5">Customer Profile</th>
                <th className="px-6 py-5">Required Item</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-6 py-5 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map(e => (
                <tr key={e._id} className="hover:bg-slate-50/50 transition duration-150">
                  <td className="px-6 py-4">
                    <p className="text-xs font-medium text-slate-700">{new Date(e.created_at || e.createdAt || Date.now()).toLocaleDateString()}</p>
                    <p className="text-[14px] text-slate-400 font-mono mt-0.5">#{e._id?.slice(-6)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-800 leading-tight">{e.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">{e.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-primary">{e.product && e.product !== 'General Enquiry' ? e.product : 'General Enquiry'}</p>
                    {e.quantity && <p className="text-xs text-slate-500 mt-1 font-medium">Qty: {e.quantity}</p>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                       <select 
                        value={e.status || 'Pending'} 
                        onChange={(ev) => handleStatusChange(e._id, ev.target.value)}
                        className={`text-[14px] font-medium px-3 py-1.5 rounded-lg border outline-none cursor-pointer tracking-wider ${getStatusColor(e.status || 'Pending')}`}
                      >
                        <option value="Pending">PENDING</option>
                        <option value="In-Progress">IN-PROGRESS</option>
                        <option value="Resolved">RESOLVED</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setViewModal({ isOpen: true, enquiry: e })}
                        className="p-2.5 bg-slate-50 text-slate-500 rounded-lg border border-slate-200 hover:bg-white hover:text-blue-600 hover:border-blue-400 transition-all shadow-sm group"
                        title="View Details"
                      >
                        <FiEye size={15} />
                      </button>
                      <button 
                        onClick={() => setConfirm({ isOpen: true, id: e._id })}
                        className="p-2.5 bg-slate-50 text-slate-500 rounded-lg border border-slate-200 hover:bg-white hover:text-red-600 hover:border-red-400 transition-all shadow-sm"
                        title="Delete Lead"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredData.length === 0 && (
            <div className="flex flex-col items-center justify-center p-24 text-center grayscale opacity-60">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4 border border-slate-200">
                <FiMail size={32} />
              </div>
              <p className="text-sm font-medium text-slate-400 tracking-tight">No enquiries found in this category.</p>
            </div>
          )}
        </div>
      </div>

      {/* Popups & Modals */}
      <EnquiryDetailsModal 
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, enquiry: null })}
        enquiry={viewModal.enquiry}
      />

      <ConfirmPopup 
        isOpen={confirm.isOpen}
        onClose={() => setConfirm({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Confirm Removal"
        message="Are you sure you want to permanently delete this lead record? This action cannot be undone."
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

export default EnquiryManager;
