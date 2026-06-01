import { useState, useEffect, memo, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { slugify } from '../utils/slugify';
import { ProductSkeleton } from '../components/Skeleton';

const CookingInspiration = memo(lazy(() => import('../components/home/CookingInspiration')));

const Products = () => {
  const [products, setProducts] = useState(Array(8).fill(null));
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const [productsRes, homeRes] = await Promise.all([
          api.get('/products'),
          api.get('/homepage')
        ]);
        setProducts(productsRes.data);
        if (homeRes.data?.recipes) {
          setRecipes(homeRes.data.recipes);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products', err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white min-h-screen py-20 pb-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="text-center mb-16 max-w-2xl mx-auto animate-fade-in-down transform-gpu will-change-transform">
          <span className="text-primary font-medium text-[13px] tracking-widest uppercase mb-3 block">Premium Selection</span>
          <h1 className="text-4xl md:text-5xl font-medium text-slate-900 mb-6 tracking-tight leading-tight">Authentic Taste, <br/><span className="text-primary italic text-3xl md:text-4xl">Modern Choice</span></h1>
          <p className="text-base text-slate-500 font-normal leading-relaxed">Discover our range of gold-standard vermicelli, crafted with 100% hard wheat for the perfect texture in every dish.</p>
        </div>

        {!loading && products.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100">
            <div className="text-3xl mb-4">🌾</div>
            <p className="text-slate-400 font-medium text-sm uppercase tracking-widest italic">Our kitchen is preparing new varieties</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8 min-h-[800px]">
            {products.map((product, idx) => (
              <div key={product?._id || product?.id || idx} className="group relative flex flex-col animate-fade-in transform-gpu will-change-transform">
                {!product ? (
                  <ProductSkeleton />
                ) : (
                  <>
                    <Link to={`/product/${slugify(product.name)}`} className="relative aspect-square overflow-hidden bg-slate-50 rounded-2xl mb-4 border border-slate-100 group-hover:shadow-xl transition-all duration-500">
                      <img 
                        src={product.images?.[0] || 'https://via.placeholder.com/500?text=Sangu+Semiya'} 
                        alt={product.name} 
                        loading="lazy"
                        width="500"
                        height="500"
                        className="w-full h-full object-contain p-6 transform group-hover:scale-105 transition duration-700" 
                      />
                      
                      {product.featured && (
                        <div className="absolute top-3 right-3 bg-secondary text-white text-[12px] font-medium uppercase py-1 px-3 rounded-full shadow-lg z-10">
                          Best Seller
                        </div>
                      )}
                    </Link>

                    <div className="text-left px-1">
                      <Link to={`/product/${slugify(product.name)}`}>
                        <h3 className="text-xs font-medium text-slate-800 hover:text-primary transition-colors line-clamp-1 mb-1 uppercase tracking-tight">{product.name}</h3>
                      </Link>
                      <p className="text-[14px] text-slate-400 font-medium uppercase tracking-widest mt-1">{product.category || "Authentic"}</p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Cooking Inspiration ── */}
      <Suspense fallback={<div className="h-96" />}>
        <CookingInspiration recipes={recipes} />
      </Suspense>
    </div>
  );
};

export default memo(Products);
