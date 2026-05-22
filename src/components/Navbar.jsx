import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, memo } from 'react';
import axios from 'axios';
import { FiMenu, FiX, FiChevronDown, FiMail, FiPhone } from 'react-icons/fi';
import logo from '../assets/Sangu-Brand-Semiya-Logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('https://sangu-semiya-backend-bq1f.onrender.com/api/products');
        setProducts(res.data);
      } catch (err) {
        console.error('Error fetching products for navbar', err);
      }
    };
    fetchProducts();
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed w-full z-50 top-0 transform-gpu translate-z-0">
      {/* Top Info Bar */}
      <div className="bg-gray-800 text-gray-300 text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <span className="font-medium text-white tracking-wide">Authentic Taste    • Premium Quality    • Trusted by Families Since Years </span>
          <div className="flex items-center gap-6">
            <a
              href="mailto:info@sangubrandsemiya.com"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <FiMail size={13} />
              <span>info@sangubrandsemiya.com</span>
            </a>
            <a
              href="tel:+919677707416"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <FiPhone size={13} />
              <span>+91 96777 07416</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="bg-primary shadow-lg relative h-24 md:h-22 animate-fade-in-down shadow-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full relative">

            {/* Left Nav Links */}
            <div className="hidden md:flex items-center gap-7">
              <Link
                to="/"
                className={`font-medium transition-all duration-200 hover:text-secondary hover:scale-105 ${isActive('/') ? 'text-secondary' : 'text-gray-900'}`}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={`font-medium transition-all duration-200 hover:text-secondary hover:scale-105 ${isActive('/about') ? 'text-secondary' : 'text-gray-900'}`}
              >
                Our Company
              </Link>
              <div
                className="relative"
                onMouseEnter={() => setProductsOpen(true)}
                onMouseLeave={() => setProductsOpen(false)}
              >
                <div className={`flex items-center gap-1 cursor-pointer font-medium transition-all duration-200 hover:text-secondary hover:scale-105 ${location.pathname.startsWith('/product') ? 'text-secondary' : 'text-gray-900'}`}>
                  Products <FiChevronDown size={14} className={`transition-transform ${productsOpen ? 'rotate-180' : ''}`} />
                </div>
                {productsOpen && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-md shadow-xl py-2 border border-gray-100 animate-fade-in-down transform-gpu max-h-[60vh] sm:max-h-[70vh] max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <Link
                      to="/our-product-range"
                      className={`block px-4 py-2 text-sm font-medium hover:bg-yellow-50 transition-colors border-b border-gray-50 mb-1 ${isActive('/our-product-range') ? 'text-secondary' : 'text-primary'}`}
                      onClick={() => setProductsOpen(false)}
                    >
                      Our Product Range (Showcase)
                    </Link>
                    <Link
                      to="/products"
                      className={`block px-4 py-2 text-sm font-medium hover:bg-yellow-50 transition-colors border-b border-gray-50 mb-1 ${isActive('/products') ? 'text-secondary' : 'text-gray-700'}`}
                      onClick={() => setProductsOpen(false)}
                    >
                      Shop All Products (Grid View)
                    </Link>
                    <div className="px-4 py-1 text-[12px] font-medium text-slate-300 uppercase tracking-[0.2em] mt-1">Individual Varieties</div>
                    {products.length > 0 ? (
                      products.map((product) => (
                        <Link
                          key={product._id || product.id}
                          to={`/product/${product.name}`}
                          className={`block px-4 py-2 text-[15px] font-medium hover:bg-yellow-50 hover:text-secondary transition-colors ${isActive(`/product/${product.name}`) ? 'text-secondary' : 'text-gray-600'}`}
                          onClick={() => setProductsOpen(false)}
                        >
                          {product.name}
                        </Link>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-xs text-gray-400 italic">No products found</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Center Logo - CIRCULAR OVERLAPPING - Optimized dimensions */}
            <div className="absolute left-1/2 -translate-x-1/2 top-2 md:top-2 z-50">
              <Link to="/" className="block">
                <div className="bg-white p-1 rounded-full shadow-2xl border-2 border-primary hover-lift transition-all duration-500 hover:rotate-3">
                  <img
                    src={logo}
                    alt="Sangu Brand Semiya"
                    width="112"
                    height="112"
                    className="h-20 w-22 md:h-28 md:w-28 object-contain"
                  />
                </div>
              </Link>
            </div>

            {/* Right Nav Links */}
            <div className="hidden md:flex items-center gap-7">
              <Link
                to="/blog"
                className={`font-medium transition-all duration-200 hover:text-secondary hover:scale-105 ${isActive('/blog') ? 'text-secondary' : 'text-gray-900'}`}
              >
                Blog & Recipe
              </Link>
              <Link
                to="/contact-us"
                className={`font-medium transition-all duration-200 hover:text-secondary hover:scale-105 ${isActive('/contact-us') ? 'text-secondary' : 'text-gray-900'}`}
              >
                Contact Us
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden flex items-center ml-auto">
              <button onClick={toggleMenu} aria-label="Toggle Menu" className="text-gray-900 hover:text-secondary focus:outline-none">
                {isOpen ? <FiX size={26} /> : <FiMenu size={26} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-primary border-t border-yellow-400 animate-fade-in-down pb-6 pt-12 transform-gpu absolute top-full left-0 w-full max-h-[calc(100vh-6rem)] overflow-y-auto custom-scrollbar shadow-2xl">
            <div className="px-4 space-y-1 text-center font-medium">
              <Link
                to="/"
                onClick={toggleMenu}
                className={`block py-3 hover:text-secondary transition ${isActive('/') ? 'text-secondary underline decoration-2 underline-offset-8' : 'text-gray-900'}`}
              >
                Home
              </Link>
              <Link
                to="/about"
                onClick={toggleMenu}
                className={`block py-3 hover:text-secondary transition ${isActive('/about') ? 'text-secondary underline decoration-2 underline-offset-8' : 'text-gray-900'}`}
              >
                Our Company
              </Link>
              <div className="py-2">
                <div className="block text-secondary/60 text-[17px] uppercase font-medium tracking-widest mb-2 px-4 text-center">Products</div>
                <div className="space-y-1">
                  <Link
                    to="/our-product-range"
                    onClick={toggleMenu}
                    className="block py-3 text-primary text-sm font-medium border-b border-yellow-400/30"
                  >
                    Our Product Range (Showcase)
                  </Link>
                  <Link
                    to="/products"
                    onClick={toggleMenu}
                    className="block py-3 text-gray-900 text-sm font-medium border-b border-yellow-400/30 mb-4"
                  >
                    Shop All Products (Grid View)
                  </Link>
                  <div className="text-[14px] uppercase tracking-widest text-gray-500 mb-2 mt-4 font-medium">Individual Varieties</div>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <Link
                        key={product._id || product.id}
                        to={`/product/${product.name}`}
                        onClick={toggleMenu}
                        className="block py-2 text-gray-800 hover:text-secondary transition text-xs font-medium"
                      >
                        {product.name}
                      </Link>
                    ))
                  ) : (
                    <p className="text-gray-500 text-[14px] italic px-4">Loading varieties...</p>
                  )}
                </div>
              </div>
              <Link
                to="/blog"
                onClick={toggleMenu}
                className={`block py-3 hover:text-secondary transition ${isActive('/blog') ? 'text-secondary underline decoration-2 underline-offset-8' : 'text-gray-900'}`}
              >
                Blog & Recipe
              </Link>
              <Link
                to="/contact-us"
                onClick={toggleMenu}
                className={`block py-3 hover:text-secondary transition ${isActive('/contact-us') ? 'text-secondary underline decoration-2 underline-offset-8' : 'text-gray-900'}`}
              >
                Contact Us
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default memo(Navbar);
