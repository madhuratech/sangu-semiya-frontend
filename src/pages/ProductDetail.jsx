import { useState, useEffect, memo, Suspense, lazy } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { slugify } from '../utils/slugify';
import { FiBox, FiClock, FiShield, FiBriefcase, FiCheckCircle, FiWind, FiTarget, FiZap, FiActivity, FiTrendingUp, FiPackage } from 'react-icons/fi';

const CookingInspiration = memo(lazy(() => import('../components/home/CookingInspiration')));

const ProductDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const [allProductsRes, homeRes] = await Promise.all([
          axios.get(`https://sangu-semiya-backend-bq1f.onrender.com/api/products`),
          axios.get(`https://sangu-semiya-backend-bq1f.onrender.com/api/homepage`)
        ]);

        const allProducts = allProductsRes.data || [];
        const targetSlug = slugify(id);

        let matchedProduct = allProducts.find(p => 
          p.id === id || 
          p._id === id || 
          slugify(p.name) === targetSlug
        );

        if (!matchedProduct) {
          const candidates = allProducts.filter(p => 
            p.name && (
              targetSlug.includes(slugify(p.name)) || 
              slugify(p.name).includes(targetSlug)
            )
          );
          if (candidates.length > 0) {
            candidates.sort((a, b) => {
              const indexA = targetSlug.indexOf(slugify(a.name));
              const indexB = targetSlug.indexOf(slugify(b.name));
              if (indexA !== indexB) {
                return indexA - indexB;
              }
              return b.name.length - a.name.length;
            });
            matchedProduct = candidates[0];
          }
        }

        let productData = null;
        if (matchedProduct) {
          try {
            const detailRes = await axios.get(`https://sangu-semiya-backend-bq1f.onrender.com/api/products/${matchedProduct.id || matchedProduct._id}`);
            productData = detailRes.data;
          } catch (detailErr) {
            console.warn('Failed to fetch full product details, falling back to list data', detailErr);
            productData = matchedProduct;
          }
        }

        if (!productData) {
          try {
            const detailRes = await axios.get(`https://sangu-semiya-backend-bq1f.onrender.com/api/products/${id}`);
            productData = detailRes.data;
          } catch (err) {
            console.error('Product not found in list or API', err);
          }
        }

        setProduct(productData);
        if (homeRes.data?.recipes) {
          setRecipes(homeRes.data.recipes);
        }
        if (productData) {
          document.title = `${productData.name} | Sangu Brand Semiya`;
          if (productData.packSize) {
            const sizes = productData.packSize.split(',').map(s => s.trim());
            setSelectedSize(sizes[0]);
          }
          const related = allProducts
            .filter(p => (p.id || p._id) !== (productData.id || productData._id) && p.name !== productData.name)
            .slice(0, 4);
          setRelatedProducts(related);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product details', err);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-6 h-6 border-2 border-slate-200 border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white space-y-4">
      <div className="text-6xl font-medium text-slate-100 tracking-tight">404</div>
      <div className="text-sm font-medium text-slate-800 uppercase tracking-widest">{t('productNotFound')}</div>
      <Link to="/products" className="mt-4 bg-slate-900 text-white px-6 py-3 text-[14px] font-medium uppercase tracking-widest hover:bg-primary transition-colors">
        {t('backToProducts')}
      </Link>
    </div>
  );

  const availableSizes = product.packSize
    ? product.packSize.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  const images = product.images?.length > 0
    ? product.images
    : ['https://via.placeholder.com/800x900?text=Sangu+Semiya'];

  const meta = product.metadata || {};

  const getIcon = (iconName) => {
    const iconMap = {
      'Wind': <FiWind />,
      'Check': <FiCheckCircle />,
      'Clock': <FiClock />,
      'Shield': <FiShield />,
      'Target': <FiTarget />,
      'Zap': <FiZap />,
      'Activity': <FiActivity />,
      'Briefcase': <FiBriefcase />,
      'Chart': <FiTrendingUp />,
      'Box': <FiBox />,
      'Package': <FiPackage />,
    };
    return iconMap[iconName] || <FiPackage />;
  };

  const features = meta.features?.length > 0 ? meta.features.map(f => ({
    icon: typeof f.icon === 'string' ? getIcon(f.icon) : f.icon,
    label: f.label
  })) : [
    { icon: <FiBriefcase />, label: t('featureWheatSemolina') },
    { icon: <FiCheckCircle />, label: t('featureNoAdditives') },
    { icon: <FiClock />, label: t('featureQuickCook') },
    { icon: <FiShield />, label: t('featureTripleLayer') },
  ];

  const nutritionRows = meta.nutrition?.length > 0 ? meta.nutrition.map(n => [n.label, n.value]) : [
    [t('nutrEnergy'), '360 kcal'],
    [t('nutrProtein'), '10.5 g'],
    [t('nutrCarbs'), '77.2 g'],
    [t('nutrTotalFat'), '0.8 g'],
    [t('nutrDietaryFiber'), '2.5 g'],
    [t('nutrSodium'), '< 5 mg'],
  ];

  const bannerHeadline = meta.bannerHeadline || t('cookingInspirationFallback');

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-primary selection:text-white pb-32">

      {/* ── Breadcrumb ── */}
      <div className="border-b border-slate-50 py-3 px-6 lg:px-16">
        <div className="max-w-screen-xl mx-auto flex flex-wrap items-center gap-y-1.5 gap-x-2 text-[13px] font-medium uppercase tracking-widest text-slate-400">
          <Link to="/" className="hover:text-slate-900 transition">{t('home')}</Link>
          <span className="opacity-30">/</span>
          <Link to="/products" className="hover:text-slate-900 transition">{t('products')}</Link>
          <span className="opacity-30">/</span>
          <span className="text-slate-900">{product.name}</span>
        </div>
      </div>

      {/* ── Main Product Zone ── */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-16 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_360px] gap-8 lg:gap-12">

          {/* Left: Thumbnail Rail */}
          <div className="flex lg:flex-col gap-3 order-2 lg:order-1">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`w-14 h-14 lg:w-16 lg:h-16 rounded-xl border transition-all overflow-hidden p-1 bg-white ${activeImage === idx ? 'border-slate-900 shadow-md' : 'border-slate-100 opacity-60 hover:opacity-100 hover:border-slate-300'
                  }`}
              >
                <img src={img} alt="" width="64" height="64" className="w-full h-full object-contain" />
              </button>
            ))}
          </div>

          {/* Center: Main Image with aspect-ratio to prevent CLS */}
          <div className="order-1 lg:order-2 bg-slate-50/50 rounded-3xl flex items-center justify-center aspect-square lg:h-[540px] relative overflow-hidden group border border-slate-100 transform-gpu will-change-transform">
            <img
              src={images[activeImage]}
              alt={product.name}
              width="800"
              height="800"
              className="w-full h-full object-contain p-8 lg:p-14 transition-transform duration-500 group-hover:scale-105"
              fetchPriority="high"
            />
            <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm shadow-sm text-slate-900 text-[12px] font-medium uppercase tracking-widest px-3 py-1.5 rounded-full border border-slate-200">
              {t('sanguQuality')}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="order-3 flex flex-col justify-start">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[12px] font-medium uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded">{product.category || 'Collection'}</span>
              {product.sku && (
                <span className="text-[12px] font-medium uppercase tracking-widest text-slate-400">{t('skuPrefix')}{product.sku}</span>
              )}
            </div>

            <h1 className="text-2xl lg:text-3xl font-medium text-slate-900 tracking-tight leading-tight mb-4 uppercase">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-slate-100">
              <span className="text-sm font-medium text-slate-400 italic">{t('priceOnEnquiry')}</span>
            </div>

            {availableSizes.length > 0 && (
              <div className="mb-8">
                <p className="text-[13px] font-medium uppercase tracking-widest text-slate-400 mb-3">{t('selectPackSize')}</p>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-2.5 rounded-xl text-[14px] font-medium uppercase tracking-widest border transition-all ${selectedSize === size
                        ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 shadow-sm'
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 mb-8">
              <Link
                to={`/bulk-order?product=${encodeURIComponent(product.name)}&size=${encodeURIComponent(selectedSize)}`}
                className="flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-xl text-[14px] font-medium uppercase tracking-widest hover:bg-secondary transition-all shadow-lg active:scale-95 transform-gpu will-change-transform"
              >
                <FiBox className="w-4 h-4" />
                {t('bulkEnquiry')}
              </Link>
              {product.amazonLink && (
                <a
                  href={product.amazonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border border-slate-200 text-slate-600 py-4 rounded-xl text-[14px] font-medium uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                >
                  {t('buyOnAmazon')}
                </a>
              )}
            </div>

            <p className="text-[17px] text-slate-500 leading-relaxed mb-8">
              {product.description || t('defaultDescription')}
            </p>

            <ul className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-8">
              {features.slice(0, 4).map((f, i) => (
                <li key={i} className="flex flex-col items-center text-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 transform-gpu will-change-transform">
                  <span className="text-lg text-primary">{f.icon}</span>
                  <span className="text-[13px] font-medium text-slate-600 uppercase tracking-normal leading-tight">{f.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Simplified Lifestyle Banner ── */}
      <div className="w-full h-[400px] bg-slate-900 relative overflow-hidden flex items-center justify-center transform-gpu will-change-transform">
        <div className="absolute inset-0 bg-slate-900/60 z-10"></div>
        <img
          src={images[0]}
          alt={product.name}
          width="1920"
          height="1080"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 max-w-screen-xl mx-auto px-6 lg:px-16 w-full text-center">
          <h2 className="text-3xl lg:text-5xl font-medium text-white tracking-tight italic">
            {bannerHeadline.split('\n').join(' ')}
          </h2>
          <p className="text-white/60 mt-4 max-w-lg mx-auto text-sm">
            {t('lifestyleText')}
          </p>
        </div>
      </div>

      {/* ── Detailed Grid ── */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-16 py-20 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          <div className="space-y-8">
            <div className="space-y-2">
              <span className="text-[13px] font-medium uppercase tracking-widest text-primary">{t('qualityPromise')}</span>
              <h2 className="text-3xl font-medium text-slate-900 tracking-tight">{t('pureWheatExcellence')}</h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[
                { label: t('promiseDurumWheatLabel'), desc: t('promiseDurumWheatDesc') },
                { label: t('promiseNonStickyLabel'), desc: t('promiseNonStickyDesc') },
                { label: t('promiseFamilyTrustedLabel'), desc: t('promiseFamilyTrustedDesc') },
              ].map((item, i) => (
                <div key={i} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <h3 className="text-xs font-medium text-slate-900 mb-1 uppercase tracking-tight">{item.label}</h3>
                  <p className="text-xs text-slate-400 font-normal leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-8 lg:p-12 rounded-3xl border border-slate-100 shadow-inner">
            <h3 className="text-[14px] font-medium uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <FiZap className="text-primary" /> {t('nutritionGlance')}
            </h3>
            <div className="space-y-2">
              {nutritionRows.map(([label, val]) => (
                <div key={label} className="flex justify-between items-center py-3 border-b border-white last:border-0">
                  <span className="text-[14px] font-medium uppercase tracking-widest text-slate-400">{label}</span>
                  <span className="text-xs font-medium text-slate-900">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Related Products ── */}
      {relatedProducts.length > 0 && (
        <div className="bg-slate-50/50 border-t border-slate-100 py-20 pb-32">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-16">
            <div className="flex items-end justify-between mb-12">
              <div className="space-y-2">
                <p className="text-[13px] font-medium uppercase tracking-widest text-slate-400">{t('recommended')}</p>
                <h2 className="text-2xl font-medium text-slate-900 tracking-tight uppercase">{t('relatedVarieties')}</h2>
              </div>
              <Link to="/products" className="text-xs font-medium text-slate-400 hover:text-primary transition underline underline-offset-8 decoration-slate-200">
                {t('viewAllVarieties')}
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <div key={p._id || p.id} className="group flex flex-col items-center text-center transform-gpu will-change-transform">
                  <Link to={`/product/${slugify(p.name)}`} className="block aspect-square bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-4 p-6 w-full group-hover:shadow-lg transition-all duration-500">
                    <img
                      src={p.images?.[0] || 'https://via.placeholder.com/400?text=Sangu'}
                      alt={p.name}
                      width="400"
                      height="400"
                      loading="lazy"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  <Link to={`/product/${slugify(p.name)}`}>
                    <h3 className="text-xs font-medium text-slate-800 hover:text-primary transition-colors uppercase tracking-tight line-clamp-1 mb-1">{p.name}</h3>
                  </Link>
                  <p className="text-xs font-medium text-primary">{p.price || "₹45.00"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* ── Cooking Inspiration ── */}
      <Suspense fallback={<div className="h-96" />}>
        <CookingInspiration recipes={recipes} />
      </Suspense>
    </div>
  );
};

export default memo(ProductDetail);
