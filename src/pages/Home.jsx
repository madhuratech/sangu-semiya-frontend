import { useState, useEffect, memo, Suspense, lazy } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import { ProductSkeleton } from '../components/Skeleton';
import { useReveal } from '../utils/useReveal';

// Optimized Components (Memoize if needed for high frequency updates, though here they are mostly static)
const AmazonStrip = memo(lazy(() => import('../components/home/AmazonStrip')));
const FounderSection = memo(lazy(() => import('../components/home/FounderSection')));
const CookingInspiration = memo(lazy(() => import('../components/home/CookingInspiration')));
const WhyChooseUs = memo(lazy(() => import('../components/home/WhyChooseUs')));
const ProductionProcess = memo(lazy(() => import('../components/home/ProductionProcess')));
const ProductBenefits = memo(lazy(() => import('../components/home/ProductBenefits')));
const MilestoneSection = memo(lazy(() => import('../components/home/MilestoneSection')));
const BulkOrderCTA = memo(lazy(() => import('../components/home/BulkOrderCTA')));
const EnquirySection = memo(lazy(() => import('../components/home/EnquirySection')));
import heroSemiya from '../assets/Sangu-Semiya.jpeg';
import step1Raw from '../assets/step1-raw.png';
import step2Cleaning from '../assets/step2-cleaning.png';
import step3Production from '../assets/step3-production.png';
import step4Quality from '../assets/step4-quality.png';

const Home = () => {
  const [data, setData] = useState({
    heroBanner: {
      message: "Sangu Brand Semiya",
      subMessage: "Healthy, Delicious & Quick to Cook",
      heroImage: ""
    },
    whyChooseUs: [],
    recipes: []
  });

  const [featuredProducts, setFeaturedProducts] = useState([null, null, null, null]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);

  useReveal([isProductsLoading]);

  const steps = [
    { title: "Raw Selection", image: step1Raw, desc: "Sourcing the finest hard wheat grains." },
    { title: "Cleaning", image: step2Cleaning, desc: "Traditional manual cleaning to ensure freshness and hygiene." },
    { title: "Production", image: step3Production, desc: "Traditionally handcrafted with care and precision." },
    { title: "Quality Check", image: step4Quality, desc: "ISO-standard nutritional testing." }
  ];

  const benefits = [
    { title: "Ingredients", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=300&auto=format&fit=crop", desc: "Made with Wheat Semolina (Durum Wheat) & Refined Wheat Flour (Maida).", items: ["SOFT & NON-STICKY", "NO ARTIFICIAL COLORS OR PRESERVATIVES", "DELICIOUS EVERY BITE"] },
    { title: "Health Benefits", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=300&auto=format&fit=crop", desc: "Rich in complex carbohydrates and gluten-friendly.", items: ["Zero Cholesterol", "Low GI", "Fiber Rich"] },
    { title: "Usage Ideas", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=300&auto=format&fit=crop", desc: "Versatile base for global and local recipes.", items: ["Breakfast Upma", "Classic Payasam", "Vermicelli Pasta"] }
  ];

  const trustCards = [
    { title: "Easy Management", image: "https://images.unsplash.com/photo-1454165833767-1314bd4b3211?q=80&w=200&auto=format&fit=crop", desc: "Simplified stocking and fast-moving inventory for retail partners." },
    { title: "User Friendly", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=200&auto=format&fit=crop", desc: "Consistent texture ensures perfect results for every home chef." },
    { title: "Business Growth", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=200&auto=format&fit=crop", desc: "Proven market demand and strong customer loyalty drive your profits." }
  ];

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await api.get('/homepage');
        if (res.data) {
          setData(prev => ({ ...prev, ...res.data }));
        }
      } catch (err) { console.log('Using default home data'); }
    };

    const fetchFeaturedProducts = async () => {
      try {
        const res = await api.get('/products');
        if (res.data?.length > 0) {
          const featured = res.data.filter(p => p.featured);
          setFeaturedProducts(featured.length > 0 ? featured.slice(0, 4) : res.data.slice(0, 4));
        }
      } catch (err) { console.log('Using default featured focus'); }
      finally { setIsProductsLoading(false); }
    };

    fetchHomeData();
    fetchFeaturedProducts();
  }, []);

  const renderCustomSections = (pos) => {
    const sections = data.customSections?.filter(s => s.isActive && (s.position === pos || (!s.position && pos === 'top'))) || [];
    if (sections.length === 0) return null;

    return sections.map((section, idx) => (
      <section key={`${pos}-${idx}`} className="relative py-14 lg:py-20 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}>
            <div className="w-full lg:w-1/2 aspect-[16/9] lg:aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl reveal-up">
              <img src={section.image} alt={section.title} className="w-full h-full object-cover" />
            </div>
            <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left reveal-up delay-200">
              <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
                {section.title}
              </h2>
              <p className="text-lg text-slate-600 font-medium leading-relaxed">
                {section.subtitle}
              </p>
              {section.buttonText && (
                <Link
                  to={section.buttonLink || '/products'}
                  className="inline-block bg-primary text-white px-10 py-4 rounded-2xl font-bold uppercase tracking-widest text-[13px] shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                >
                  {section.buttonText}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    ));
  };

  return (
    <div className="w-full bg-white font-sans selection:bg-secondary selection:text-white">

      {/* HERO SECTION - Optimized with min-height and explicit image sizes */}
      <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center pt-20 overflow-hidden bg-white">
        <div className="blob-container">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px] animate-blob"></div>
          <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-secondary/5 rounded-full blur-[80px] animate-blob animation-delay-2000"></div>
          <div className="absolute top-[40%] left-[20%] w-[20%] h-[20%] bg-yellow-200/20 rounded-full blur-[60px] animate-blob animation-delay-4000"></div>
        </div>
        <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full bg-slate-50/50 skew-x-[-12deg] translate-x-32 z-0 hidden lg:block border-l border-slate-100 transform-gpu will-change-transform"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

            <div className="text-center lg:text-left space-y-8 animate-fade-in-up transform-gpu will-change-transform">
              <div className="inline-block">
                <span className="px-4 py-1 rounded-full bg-red-50 text-secondary font-medium text-[14px] tracking-widest uppercase border border-red-100">
                  Established 1982
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-medium text-gray-900 tracking-tight leading-[1.1]">
                  {data.heroBanner?.message || "Sangu Brand Semiya"}
                </h1>
                <p className="text-lg lg:text-xl text-gray-600 font-medium max-w-lg mx-auto lg:mx-0">
                  {data.heroBanner?.subMessage || "Healthy, Delicious & Quick to Cook"}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <a href="https://www.amazon.in/s?k=SANGU+BRAND+ROASTED+VERMICELLI&ref=bl_dp_s_web_0" target="_blank" rel="noreferrer" className="bg-[#131921] hover:bg-secondary text-white px-8 py-4 rounded-xl font-medium text-[15px] tracking-widest uppercase transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-secondary/20">
                  Shop on Amazon <span>→</span>
                </a>
                <Link to="/products" className="bg-white border border-gray-200 text-gray-500 hover:border-secondary hover:text-secondary px-8 py-4 rounded-xl font-medium text-[15px] tracking-widest uppercase transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-md">
                  View Catalog
                </Link>
              </div>
            </div>

            <div className="relative group max-w-xl mx-auto lg:mr-0 lg:ml-auto">
              {/* Image with fixed aspect ratio to prevent CLS */}
              <div className="relative p-3 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden transform-gpu will-change-transform transition-transform duration-700 hover:scale-[1.02]">
                <div className="aspect-[5/5] lg:aspect-[5/5] w-full bg-slate-50 relative overflow-hidden">
                  <img
                    src={heroSemiya}
                    alt="Sangu Brand Package"
                    width="1200"
                    height="1650"
                    className="w-full h-full object-cover rounded-[2rem]"
                    fetchpriority="high"
                  />
                </div>
              </div>
              <div className="absolute -inset-4 bg-primary/5 blur-3xl -z-10 rounded-full group-hover:bg-primary/10 transition-colors"></div>
            </div>

          </div>
        </div>
      </section>

      <Suspense fallback={<div className="h-20" />}>
        <AmazonStrip />
      </Suspense>

      {/* Top Banners Placement */}
      {renderCustomSections('top')}

      <section className="py-14 lg:py-20 min-h-[400px]">
        <Suspense fallback={<div className="animate-pulse bg-slate-50 w-full h-96 rounded-3xl" />}>
          <FounderSection />
        </Suspense>
      </section>


      <section className="py-14 lg:py-20 bg-slate-50/30 min-h-[400px]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12 space-y-2 reveal reveal-up">
          <span className="inline-block py-1 px-3 rounded-full bg-red-50 border border-red-100 text-primary font-medium text-[12px] tracking-widest uppercase mb-1">
            The Sangu Edge
          </span>
          <h2 className="text-2xl md:text-3xl font-medium text-slate-900 tracking-tight text-center lg:text-left">
            Why Families Trust Us
          </h2>
        </div>
        <Suspense fallback={<div className="h-96" />}>
          <ProductBenefits benefits={benefits} />
        </Suspense>
      </section>

      <div className="min-h-[400px]">
        <Suspense fallback={<div className="h-96" />}>
          <ProductionProcess steps={steps} />
        </Suspense>
      </div>

      {/* Middle Banners Placement */}
      {renderCustomSections('middle')}

      {/* Featured Gallery with Skeleton loaders */}
      <section className="py-14 lg:py-20 bg-white min-h-[600px]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4 tracking-tight">
            <div className="space-y-1">
              <span className="text-secondary font-medium text-[12px] tracking-widest uppercase block animate-fade-in">Premium Selection</span>
              <h2 className="text-2xl md:text-3xl font-medium text-slate-900 tracking-tight">Gold-Standard Range</h2>
            </div>
            <Link to="/products" className="text-slate-400 font-medium uppercase text-[14px] tracking-widest pb-1 border-b border-slate-100 hover:text-secondary hover:border-secondary transition-all">
              View All Products
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {isProductsLoading
              ? [1, 2, 3, 4].map(n => <ProductSkeleton key={n} />)
              : featuredProducts.map((p, idx) => (
                <div key={p?._id || idx} className={`group relative flex flex-col transform-gpu will-change-transform reveal reveal-up delay-${(idx + 1) * 100} hover-lift`}>
                  <Link to={`/product/${p?.name}`} className="relative aspect-square overflow-hidden bg-slate-50 rounded-3xl mb-4 border border-slate-100 group-hover:shadow-xl transition-all duration-500">
                    <img
                      src={p?.images?.[0] || 'https://via.placeholder.com/500?text=Sangu+Semiya'}
                      alt={p?.name}
                      loading="lazy"
                      width="500"
                      height="500"
                      className="w-full h-full object-contain p-6 transform group-hover:scale-105 transition duration-700"
                    />
                  </Link>

                  <div className="text-left px-1">
                    <Link to={`/product/${p?.name}`}>
                      <h3 className="text-sm font-medium text-slate-800 hover:text-primary transition-colors line-clamp-1 mb-1 uppercase tracking-tight">{p?.name}</h3>
                    </Link>
                    <p className="text-[14px] text-slate-400 font-medium uppercase tracking-widest">{p?.category || "Authentic"}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      <section className="min-h-[400px]">
        <Suspense fallback={<div className="h-96" />}>
          <MilestoneSection />
        </Suspense>
      </section>

      <section className="min-h-[300px]">
        <Suspense fallback={<div className="h-80" />}>
          <BulkOrderCTA />
        </Suspense>
      </section>

      <section className="py-14 lg:py-20 bg-slate-50/50 min-h-[400px]">
        <Suspense fallback={<div className="h-96" />}>
          <EnquirySection trustCards={trustCards} />
        </Suspense>
      </section>

      {/* Bottom Banners Placement */}
      {renderCustomSections('bottom')}

      <div className="min-h-[500px]">
        <Suspense fallback={<div className="animate-pulse bg-slate-50 h-[500px]" />}>
          <CookingInspiration recipes={data.recipes} />
        </Suspense>
      </div>

    </div>
  );
};

export default memo(Home);
