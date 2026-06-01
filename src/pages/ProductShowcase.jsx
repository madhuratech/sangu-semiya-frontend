import { useState, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { slugify } from '../utils/slugify';
import { FiArrowRight } from 'react-icons/fi';

const showcaseProducts = [
  {
    id: 'roasted-vermicelli',
    name: 'Roasted Vermicelli',
    description: 'Experience the perfect crunch and authentic flavor with our gold-standard roasted vermicelli. Crafted from 100% hard wheat suji for a non-sticky texture.',
    bgColor: 'bg-orange-50/50',
    accentColor: 'text-orange-600',
    image: 'https://via.placeholder.com/600x600?text=Roasted+Vermicelli',
    category: 'Sangu Brand'
  },
  {
    id: 'veg-noodles',
    name: 'Veg Noodles',
    description: 'Deliciously smooth and healthy noodles packed with the goodness of vegetables. A quick and nutritious meal for the entire family.',
    bgColor: 'bg-rose-50/50',
    accentColor: 'text-rose-600',
    image: 'https://via.placeholder.com/600x600?text=Veg+Noodles',
    category: 'Sangu Brand'
  },
  {
    id: 'ragi-vermicelli',
    name: 'Ragi Vermicelli',
    description: 'Rich in calcium and fiber, our finger millet vermicelli is a nutritious twist on traditional semiya. Perfect for health-conscious breakfast.',
    bgColor: 'bg-slate-100/50',
    accentColor: 'text-slate-600',
    image: 'https://via.placeholder.com/600x600?text=Ragi+Vermicelli',
    category: 'Sangu Brand'
  },
  {
    id: 'kambu-vermicelli',
    name: 'Kambu Vermicelli',
    description: 'Enjoy the ancient goodness of Pearl Millet. Our Kambu vermicelli is gluten-aware and highly nutritious, bringing traditional wellness to your table.',
    bgColor: 'bg-pink-50/50',
    accentColor: 'text-pink-600',
    image: 'https://via.placeholder.com/600x600?text=Kambu+Vermicelli',
    category: 'Sangu Brand'
  },
  {
    id: 'wheat-vermicelli',
    name: 'Wheat Vermicelli',
    description: 'Pure whole wheat goodness in every strand. A wholesome choice for balanced meals, providing sustained energy and fiber.',
    bgColor: 'bg-emerald-50/50',
    accentColor: 'text-emerald-600',
    image: 'https://via.placeholder.com/600x600?text=Wheat+Vermicelli',
    category: 'Sangu Brand'
  },
  {
    id: 'chinese-noodles',
    name: 'Chinese Noodles',
    description: 'Bring the restaurant-style stir-fry home with our premium Chinese noodles. Perfectly textured to hold sauces and flavors.',
    bgColor: 'bg-amber-50/50',
    accentColor: 'text-amber-600',
    image: 'https://via.placeholder.com/600x600?text=Chinese+Noodles',
    category: 'Sangu Brand'
  },
  {
    id: 'samba-wheat-broken',
    name: 'Samba Wheat Broken',
    description: 'Traditional Samba wheat, carefully broken to the perfect size for upma and payasam. Naturally rich in minerals and vitamins.',
    bgColor: 'bg-purple-50/50',
    accentColor: 'text-purple-600',
    image: 'https://via.placeholder.com/600x600?text=Samba+Wheat+Broken',
    category: 'Sangu Brand'
  }
];

const ProductShowcase = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProducts = async () => {
      try {
        const res = await axios.get('https://sangu-semiya-backend-bq1f.onrender.com/api/products');
        // Map API data if available, otherwise use static showcase
        if (res.data && res.data.length > 0) {
          const mapped = showcaseProducts.map(sp => {
            const apiP = res.data.find(p => p.name.toLowerCase().includes(sp.name.toLowerCase()));
            return {
              ...sp,
              image: apiP?.images?.[0] || sp.image,
              apiId: apiP?._id || apiP?.id
            };
          });
          setProducts(mapped);
        } else {
          setProducts(showcaseProducts);
        }
      } catch (err) {
        setProducts(showcaseProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-white min-h-screen pt-24 pb-12 overflow-hidden">
      
      {/* ── Page Header ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-20 animate-fade-in">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-primary italic tracking-tight mb-4">
          Our Product Range
        </h1>
        <div className="flex items-center justify-center gap-4">
          <div className="h-[1px] w-12 bg-primary/30"></div>
          <div className="w-2 h-2 rotate-45 border border-primary/50"></div>
          <div className="h-[1px] w-24 bg-primary/50"></div>
          <div className="w-2 h-2 rotate-45 bg-primary/30"></div>
          <div className="h-[1px] w-12 bg-primary/30"></div>
        </div>
      </div>

      {/* ── Product List ── */}
      <div className="space-y-0">
        {products.map((product, idx) => (
          <section 
            key={product.id} 
            className={`${product.bgColor} py-20 lg:py-28 relative overflow-hidden group`}
          >
            <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
              <div className={`flex flex-col lg:items-center gap-12 lg:gap-20 ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                
                {/* Image side */}
                <div className="flex-1 flex justify-center animate-fade-in-up">
                  <div className="relative w-full max-w-md aspect-[4/5] lg:aspect-square">
                    <div className="absolute -inset-10 bg-white/40 blur-3xl rounded-full scale-0 group-hover:scale-100 transition-transform duration-1000"></div>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-contain drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-700 relative z-10"
                    />
                  </div>
                </div>

                {/* Content side */}
                <div className="flex-1 flex flex-col justify-center text-left space-y-6 lg:max-w-xl animate-fade-in-up delay-100">
                  <div>
                    <span className={`text-[14px] font-medium uppercase tracking-[0.2em] ${product.accentColor} mb-2 block`}>
                      {product.category}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-medium text-slate-800 tracking-tight leading-tight mb-6">
                      {product.name}
                    </h2>
                  </div>
                  
                  <p className="text-base md:text-lg text-slate-500 font-normal leading-relaxed max-w-lg">
                    {product.description}
                  </p>

                  <div className="pt-6">
                    <Link 
                      to={`/product/${slugify(product.name)}`}
                      className={`inline-flex items-center gap-3 text-[14px] font-medium uppercase tracking-widest text-slate-400 hover:text-primary transition-all group/link`}
                    >
                      Know More 
                      <FiArrowRight size={14} className="group-hover/link:translate-x-2 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>

              </div>
            </div>

            {/* Background decorative element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-medium text-slate-900/5 select-none pointer-events-none uppercase tracking-tighter whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-1000 lg:block hidden">
              {product.name}
            </div>
          </section>
        ))}
      </div>
      
      {/* ── Footer Link ── */}
      <div className="text-center py-24 bg-white">
        <Link 
          to="/contact-us"
          className="bg-primary text-white px-10 py-5 rounded-2xl font-medium text-[15px] tracking-widest uppercase hover:bg-secondary transition-all shadow-xl hover:shadow-secondary/20 transform hover:-translate-y-1 active:scale-95"
        >
          Enquire For Bulk Order
        </Link>
      </div>

    </div>
  );
};

export default memo(ProductShowcase);
