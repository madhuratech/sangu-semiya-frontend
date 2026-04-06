import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const fallbackProducts = [
  { name: 'Roasted Vermicelli', sizes: '180g | 450g', color: 'from-amber-50 to-orange-50', border: 'border-amber-100', emoji: '🌾' },
  { name: 'Veg Noodles', sizes: '180g', color: 'from-green-50 to-emerald-50', border: 'border-green-100', emoji: '🥬' },
  { name: 'Ragi Vermicelli', sizes: '180g | 450g', color: 'from-rose-50 to-red-50', border: 'border-rose-100', emoji: '🫘' },
  { name: 'Kambu Vermicelli', sizes: '180g', color: 'from-yellow-50 to-amber-50', border: 'border-yellow-100', emoji: '🌿' },
  { name: 'Wheat Vermicelli', sizes: '180g', color: 'from-orange-50 to-yellow-50', border: 'border-orange-100', emoji: '🌾' },
  { name: 'Chinese Noodles', sizes: '200g | 1Kg', color: 'from-sky-50 to-blue-50', border: 'border-sky-100', emoji: '🍜' },
  { name: 'Samba Wheat Broken', sizes: '250g | 500g', color: 'from-stone-50 to-amber-50', border: 'border-stone-200', emoji: '🥣' },
];

const ProductRange = ({ products = [] }) => {
  const displayProducts = products.length > 0 ? products : fallbackProducts;

  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="max-w-xl">
            <span className="text-secondary font-medium text-[8px] tracking-widest uppercase mb-2 block">
              Complete Collection
            </span>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">
              Our Product Range
            </h2>
          </div>
          <Link
            to="/products"
            className="group flex items-center gap-2 text-slate-400 font-medium uppercase text-[9px] tracking-widest pb-1 border-b border-slate-50 hover:text-secondary hover:border-secondary transition-all"
          >
            View All Categories
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {displayProducts.map((product, i) => {
            const isApiProduct = !!product._id || !!product.id;
            const bgColor = product.color || 'from-slate-50 to-slate-100';
            const borderColor = product.border || 'border-slate-100';

            return (
              <Link
                key={i}
                to={`/product/${product.name}`}
                className={`group bg-gradient-to-br ${bgColor} ${borderColor} border rounded-3xl p-6 lg:p-8 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden`}
              >
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/40 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500"></div>
                
                <div className="w-20 h-20 mb-4 transform group-hover:scale-105 transition-all duration-300 relative z-10 flex items-center justify-center">
                  {isApiProduct ? (
                    <img 
                      src={product.images?.[0] || 'https://via.placeholder.com/100?text=Sangu'} 
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-3xl">{product.emoji}</span>
                  )}
                </div>
                
                <h3 className="text-xs font-semibold text-slate-800 mb-2 leading-tight group-hover:text-secondary transition-colors duration-300 relative z-10 uppercase tracking-tight">
                  {product.name}
                </h3>
                
                <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest bg-white/50 px-3 py-1 rounded-full relative z-10 border border-white/50">
                  {isApiProduct ? (product.packSize || "Authentic") : product.sizes}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductRange;
