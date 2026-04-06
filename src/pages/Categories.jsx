import { useState, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { FiGrid, FiArrowRight, FiPackage } from 'react-icons/fi';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching categories', err);
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="bg-white min-h-screen py-20 pb-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-20 max-w-2xl mx-auto animate-fade-in-down">
          <span className="text-primary font-bold text-[11px] tracking-[0.3em] uppercase mb-4 block">Our Collections</span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tighter leading-none">
            Explore by <span className="text-primary italic">Flavor Range</span>
          </h1>
          <p className="text-base text-slate-500 font-medium leading-relaxed">
            Discover our meticulously curated collections, each designed to bring authentic taste and gold-standard texture to your kitchen.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-64 bg-slate-50 rounded-[2rem] animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-24 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200/50">
             <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-200/50 text-slate-200">
                <FiPackage size={32} />
             </div>
             <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.2em] italic">We are curating new collections for you.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {categories.map((cat, idx) => (
              <div 
                key={cat.id || cat._id} 
                className="group relative bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col items-center text-center animate-fade-in"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Decorative Background Blob */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
                
                {/* Icon Circle */}
                <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-primary mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner group-hover:shadow-xl group-hover:shadow-primary/20">
                   <FiGrid size={36} strokeWidth={1.5} />
                </div>

                <div className="space-y-4 flex-1">
                   <h3 className="text-2xl font-black text-slate-800 tracking-tight group-hover:text-primary transition-colors">{cat.name}</h3>
                   <p className="text-sm text-slate-400 font-medium leading-relaxed line-clamp-3 uppercase tracking-tighter">
                      {cat.description || 'Premium vermicelli crafted for exceptional culinary experiences. Perfect texture and authentic taste.'}
                   </p>
                </div>

                <div className="mt-10 w-full pt-8 border-t border-slate-50">
                   <Link 
                     to="/products" // For now, we point to /products. In a real app, we'd filter by category.
                     className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-slate-900 group-hover:gap-5 transition-all"
                   >
                     Browse Collection <FiArrowRight strokeWidth={3} className="text-primary" />
                   </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-32 p-16 bg-slate-900 rounded-[4rem] text-center relative overflow-hidden shadow-2xl shadow-slate-200">
           <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -mr-48 -mt-48" />
           <div className="relative z-10 space-y-6">
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-none">Can't decide?</h2>
              <p className="text-slate-400 font-medium text-lg max-w-xl mx-auto">See our full variety of signature Sangu Brand products spanning generations.</p>
              <div className="pt-6">
                <Link to="/products" className="px-12 py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primary-dark transition-all inline-block shadow-xl shadow-primary/20">
                   View Entire Catalog
                </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Categories);
