import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductManager from './components/ProductManager';
import EnquiryManager from './components/EnquiryManager';
import CMSManager from './components/CMSManager';
import AdminManager from './components/AdminManager';
import RecipeManager from './components/RecipeManager';
import BlogManager from './components/BlogManager';
import CategoryManager from './components/CategoryManager';
import api from '../../utils/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [userRole, setUserRole] = useState('');
  const [metrics, setMetrics] = useState({ products: 0, enquiries: 0, activeEnquiries: 0 });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const role = localStorage.getItem('adminRole');
    
    if (!token) {
      navigate('/admin/login');
      return;
    }
    
    console.log("Current User Role:", role); // Debugging access
    setUserRole(role || 'Sub-Admin');

    const fetchMetrics = async () => {
      try {
        const prod = await api.get('/products');
        const enq = await api.get('/enquiry');
        setMetrics({
          products: prod.data.length,
          enquiries: enq.data.length,
          activeEnquiries: enq.data.filter(e => e.status !== 'Resolved').length
        });
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
        }
      }
    }
    
    if(activeTab === 'overview') {
       fetchMetrics();
    }
  }, [navigate, activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRole');
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-[#F1F5F9] overflow-hidden text-sm">
      
      {/* Compact Sidebar */}
      <div className="w-56 bg-white border-r border-slate-200 flex flex-col shadow-sm flex-shrink-0 z-20">
        <div className="p-4 border-b border-slate-100">
          <h2 className="text-lg font-medium text-slate-800 tracking-tight flex items-center">
            <span className="w-2 h-6 bg-primary rounded-full mr-2"></span>
            Sangu <span className="text-primary ml-1 text-sm">Admin</span>
          </h2>
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          <button onClick={() => setActiveTab('overview')} className={`w-full text-left px-3 py-2 rounded-lg font-normal transition-all flex items-center ${activeTab === 'overview' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg> Dashboard
          </button>
          <button onClick={() => setActiveTab('products')} className={`w-full text-left px-3 py-2 rounded-lg font-normal transition-all flex items-center ${activeTab === 'products' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg> Products
          </button>
          <button onClick={() => setActiveTab('categories')} className={`w-full text-left px-3 py-2 rounded-lg font-normal transition-all flex items-center ${activeTab === 'categories' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0h10"/></svg> Categories
          </button>
          <button onClick={() => setActiveTab('blogs')} className={`w-full text-left px-3 py-2 rounded-lg font-normal transition-all flex items-center ${activeTab === 'blogs' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg> Blogs
          </button>
          <button onClick={() => setActiveTab('enquiries')} className={`w-full text-left px-3 py-2 rounded-lg font-normal transition-all flex items-center ${activeTab === 'enquiries' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg> Enquiries
          </button>
          <button onClick={() => setActiveTab('cms')} className={`w-full text-left px-3 py-2 rounded-lg font-normal transition-all flex items-center ${activeTab === 'cms' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg> CMS Tuning
          </button>
          <button onClick={() => setActiveTab('recipes')} className={`w-full text-left px-3 py-2 rounded-lg font-normal transition-all flex items-center ${activeTab === 'recipes' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg> Cooking Recipe
          </button>
          
          {userRole === 'Admin' && (
            <div className="pt-6 mt-6 border-t-2 border-slate-50">
               <div className="flex items-center px-3 mb-3">
                 <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                 <p className="text-[14px] uppercase text-slate-400 font-medium tracking-widest leading-none">Settings</p>
               </div>
               <button onClick={() => setActiveTab('admins')} className={`w-full text-left px-3 py-3 rounded-xl font-medium transition-all flex items-center shadow-sm ${activeTab === 'admins' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'}`}>
                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg> 
                 <span>Admin Control</span>
               </button>
            </div>
          )}
        </nav>
        
        <div className="p-3 border-t border-slate-100 mt-auto bg-slate-50/50">
          <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-red-500 font-medium hover:bg-red-50 rounded-lg transition-all flex items-center text-xs">
             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg> Sign Out
          </button>
        </div>
      </div>

      {/* Dense Main Area */}
      <div className="flex-1 h-screen overflow-y-auto p-4 md:p-6 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {activeTab === 'overview' && (
             <div className="animate-fade-in space-y-6">
                <header>
                  <h1 className="text-xl font-medium text-slate-900 leading-none">System Overview</h1>
                  <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-medium">Real-time metrics</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                     <div>
                       <h3 className="text-xs font-medium text-slate-400 uppercase tracking-tighter">Products</h3>
                       <p className="text-2xl font-medium text-slate-900">{metrics.products}</p>
                     </div>
                     <div className="p-2 bg-blue-50 rounded-lg text-blue-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4"/></svg></div>
                   </div>
                   
                   <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                     <div>
                       <h3 className="text-xs font-medium text-slate-400 uppercase tracking-tighter">Enquiries</h3>
                       <p className="text-2xl font-medium text-slate-900">{metrics.enquiries}</p>
                     </div>
                     <div className="p-2 bg-green-50 rounded-lg text-green-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19"/></svg></div>
                   </div>

                   <div className="bg-white p-4 rounded-xl border border-primary/20 shadow-sm flex items-center justify-between">
                     <div>
                       <h3 className="text-xs font-medium text-primary/60 uppercase tracking-tighter">Attention</h3>
                       <p className="text-2xl font-medium text-primary">{metrics.activeEnquiries}</p>
                     </div>
                     <div className="p-2 bg-red-50 rounded-lg text-primary animate-pulse"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg></div>
                   </div>
                </div>
             </div>
          )}
          
          {activeTab === 'products' && <div className="animate-fade-in"><ProductManager /></div>}
          {activeTab === 'categories' && <div className="animate-fade-in"><CategoryManager /></div>}
          {activeTab === 'blogs' && <div className="animate-fade-in"><BlogManager /></div>}
          {activeTab === 'enquiries' && <div className="animate-fade-in"><EnquiryManager /></div>}
          {activeTab === 'cms' && <div className="animate-fade-in"><CMSManager /></div>}
          {activeTab === 'recipes' && <div className="animate-fade-in"><RecipeManager /></div>}
          {activeTab === 'admins' && userRole === 'Admin' && <div className="animate-fade-in"><AdminManager /></div>}

        </div>
      </div>

    </div>
  );
};

export default Dashboard;
