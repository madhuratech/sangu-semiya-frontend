import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy load pages for better performance and smaller initial bundle size
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const BulkOrder = lazy(() => import('./pages/BulkOrder'));
const OurCompany = lazy(() => import('./pages/OurCompany'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const MediaAwards = lazy(() => import('./pages/MediaAwards'));
const BlogRecipe = lazy(() => import('./pages/BlogRecipe'));
const BlogPostDetail = lazy(() => import('./pages/BlogPostDetail'));
const RecipeDetail = lazy(() => import('./pages/RecipeDetail'));
const ProductShowcase = lazy(() => import('./pages/ProductShowcase'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));


// Global Loading Component for Suspense fallback
const GlobalLoader = () => (
  <div className="fixed inset-0 z-[99] flex items-center justify-center bg-white">
    <div className="w-12 h-12 border-4 border-slate-100 border-t-primary rounded-full animate-spin"></div>
  </div>
);

const AppContent = () => {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className={`flex flex-col ${isAdminRoute ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      {!isAdminRoute && <Navbar />}
      <main className={`flex-grow ${!isAdminRoute ? 'pt-32 md:pt-40' : ''}`}>
        <Suspense fallback={<GlobalLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />

            <Route path="/our-product-range" element={<ProductShowcase />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/bulk-order" element={<BulkOrder />} />
            <Route path="/about" element={<OurCompany />} />
            <Route path="/our-story" element={<OurCompany />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/media" element={<MediaAwards />} />
            <Route path="/blog" element={<BlogRecipe />} />
            <Route path="/blog/:slug" element={<BlogPostDetail />} />
            <Route path="/recipe/:name" element={<RecipeDetail />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
          </Routes>
        </Suspense>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppContent />
    </Router>
  );
}

export default App;
